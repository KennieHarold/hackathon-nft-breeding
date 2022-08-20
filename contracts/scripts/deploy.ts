import { ethers } from 'hardhat';

const genesisGenes = [
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

async function main() {
  console.log('Deploying contracts...');

  const Toffee = await ethers.getContractFactory('Toffee');
  const toffee = await Toffee.deploy();
  await toffee.deployed();

  const ToffeeExchange = await ethers.getContractFactory('ToffeeExchange');
  const toffeeExchange = await ToffeeExchange.deploy(toffee.address, ethers.utils.parseEther('0.0001'));
  await toffeeExchange.deployed();

  await toffee.transfer(toffeeExchange.address, ethers.utils.parseEther('500000'));

  const ToffeePetsCollectible = await ethers.getContractFactory('ToffeePetsCollectible');
  const toffeePetsCollectible = await ToffeePetsCollectible.deploy(genesisGenes, toffee.address);
  await toffeePetsCollectible.deployed();

  const GeneCrossover = await ethers.getContractFactory('GeneCrossover');
  const geneCrossover = await GeneCrossover.deploy(
    [5, 5, 5, 5, 5, 5, 5, 5],
    50,
    process.env.GOERLI_VRF_COORDINATOR,
    process.env.GOERLI_SUBSCRIPTION_ID,
    100000,
    process.env.GOERLI_GASLANE,
    toffeePetsCollectible.address
  );
  await geneCrossover.deployed();
  await toffeePetsCollectible.setGeneCrossover(geneCrossover.address);

  console.log(`Toffee address: ${toffee.address}`);
  console.log(`Toffee Exchange address: ${toffeeExchange.address}`);
  console.log(`Toffee Pets Collectible address: ${toffeePetsCollectible.address}`);
  console.log(`Gene Crossover address: ${geneCrossover.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
