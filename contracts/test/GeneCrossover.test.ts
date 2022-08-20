import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { expect } from 'chai';

describe('GeneCrossover Tests', async function () {
  let GeneCrossover: Contract;
  let VrfCoordinatorV2Mock: Contract;

  before(async function () {
    const [Deployer, TestCollectible] = await ethers.getSigners();
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
      TestCollectible.getAddress() // Dummy collectible contract
    );
    await GeneCrossover.deployed();
    await VrfCoordinatorV2Mock.addConsumer(1, GeneCrossover.address);
  });

  it('should run mix gene', async () => {
    const tx = await GeneCrossover.mixGeneRunner(1, '11111111', '00000000');
    const { events } = await tx.wait();
    const [requestId] = events.filter((x: any) => x.event === 'RequestRandomness')[0].args;
    await VrfCoordinatorV2Mock.fulfillRandomWords(requestId, GeneCrossover.address);
  });
});
