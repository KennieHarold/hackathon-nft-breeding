import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';
import dotenv from 'dotenv';

dotenv.config();

const { ADMIN_PK, INFURA_API_KEY, ETHERSCAN_API_KEY }: NodeJS.ProcessEnv = process.env;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ADMIN_PK],
      chainId: 5
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 100,
    showTimeSpent: true
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  }
};

export default config;
