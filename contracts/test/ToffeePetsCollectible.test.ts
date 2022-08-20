import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { expect } from 'chai';

const testGenesisGenes = [
  '11111111',
  '00000000',
  '12344444',
  '44412344',
  '22222222',
  '33333333',
  '44444444',
  '01010101',
  '23232323',
  '34343434'
];

describe('ToffeePetsCollectible Tests', async function () {
  let ToffeePetsCollectible: Contract;
  let ToffeeToken: Contract;
  let GeneCrossover: Contract;
  let VrfCoordinatorV2Mock: Contract;
  let Deployer: Signer;
  let User: Signer;

  before(async function () {
    [Deployer, User] = await ethers.getSigners();

    const toffeeToken = await ethers.getContractFactory('Toffee');
    ToffeeToken = await toffeeToken.deploy();
    await ToffeeToken.deployed();

    const toffeePetsCollectible = await ethers.getContractFactory('ToffeePetsCollectible');
    ToffeePetsCollectible = await toffeePetsCollectible.deploy(testGenesisGenes, ToffeeToken.address);
    await ToffeePetsCollectible.deployed();

    const vrfCoordinatorV2Mock = await ethers.getContractFactory('MockVRFCoordinatorV2');
    VrfCoordinatorV2Mock = await vrfCoordinatorV2Mock.deploy();
    await VrfCoordinatorV2Mock.deployed();
    await VrfCoordinatorV2Mock.createSubscription();
    await VrfCoordinatorV2Mock.fundSubscription(1, ethers.utils.parseEther('10'));

    const geneCrossover = await ethers.getContractFactory('GeneCrossover');
    GeneCrossover = await geneCrossover.deploy(
      [5, 5, 5, 5, 5, 5, 5, 5],
      100, // 100% mutation to test chainlink vrf
      VrfCoordinatorV2Mock.address,
      1,
      500000,
      process.env.GOERLI_GASLANE,
      ToffeePetsCollectible.address
    );
    await GeneCrossover.deployed();
    await VrfCoordinatorV2Mock.addConsumer(1, GeneCrossover.address);

    await ToffeePetsCollectible.connect(Deployer).setGeneCrossover(GeneCrossover.address);
    await ToffeeToken.connect(Deployer).transfer(User.getAddress(), ethers.utils.parseEther('1000'));
  });

  it('should create genesis tokens', async () => {
    for (let i = 0; i < testGenesisGenes.length; i++) {
      const owner = await ToffeePetsCollectible.ownerOf(i);
      expect(owner).to.equal(ToffeePetsCollectible.address);
    }
  });

  it('should purchase multiple tokens', async () => {
    await ToffeeToken.connect(User).approve(ToffeePetsCollectible.address, ethers.utils.parseEther('50'));
    await ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('10'), 0);
    await ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('10'), 1);
    await ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('10'), 2);
    await ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('10'), 3);
    await ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('10'), 4);

    expect(await ToffeeToken.balanceOf(User.getAddress())).to.equal(ethers.utils.parseEther('950'));
    for (let i = 0; i < 5; i++) {
      const owner = await ToffeePetsCollectible.ownerOf(i);
      expect(owner).to.equal(await User.getAddress());
    }
  });

  it('should revert purchase', async () => {
    await ToffeeToken.connect(User).approve(ToffeePetsCollectible.address, ethers.utils.parseEther('9'));
    await expect(
      ToffeePetsCollectible.connect(User).purchase(ethers.utils.parseEther('9'), 5)
    ).to.be.revertedWithCustomError(ToffeePetsCollectible, 'ToffeePetsCollectible__NotEnoughToken');
  });

  it('should breed tokens', async () => {
    await ToffeeToken.connect(User).approve(ToffeePetsCollectible.address, ethers.utils.parseEther('5'));
    await ToffeePetsCollectible.connect(User).breed(ethers.utils.parseEther('5'), 0, 1);
  });
});
