import hardhat, { ethers } from 'hardhat';

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
  console.log('Verifying contracts...');

  await hardhat
    .run('verify:verify', {
      address: process.env.GOERLI_TOFFEE_ADDRESS,
      contract: 'contracts/Toffee.sol:Toffee',
      constructorArguments: []
    })
    .catch((error) => {
      console.error(error);
    });

  await hardhat
    .run('verify:verify', {
      address: process.env.GOERLI_TOFFEE_EXCHANGE_ADDRESS,
      contract: 'contracts/ToffeeExchange.sol:ToffeeExchange',
      constructorArguments: [process.env.GOERLI_TOFFEE_ADDRESS, ethers.utils.parseEther('0.0001')]
    })
    .catch((error) => {
      console.error(error);
    });

  await hardhat
    .run('verify:verify', {
      address: process.env.GOERLI_TOFFEE_PETS_COLLECTIBLE_ADDRESS,
      contract: 'contracts/ToffeePetsCollectible.sol:ToffeePetsCollectible',
      constructorArguments: [genesisGenes, process.env.GOERLI_TOFFEE_ADDRESS]
    })
    .catch((error) => {
      console.error(error);
    });

  await hardhat
    .run('verify:verify', {
      address: process.env.GOERLI_GENE_CROSSOVER_ADDRESS,
      contract: 'contracts/GeneCrossover.sol:GeneCrossover',
      constructorArguments: [
        [5, 5, 5, 5, 5, 5, 5, 5],
        50,
        process.env.GOERLI_VRF_COORDINATOR,
        process.env.GOERLI_SUBSCRIPTION_ID,
        100000,
        process.env.GOERLI_GASLANE,
        process.env.GOERLI_TOFFEE_PETS_COLLECTIBLE_ADDRESS
      ]
    })
    .catch((error) => {
      console.error(error);
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
