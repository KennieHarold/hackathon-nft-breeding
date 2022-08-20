declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_PK: string;
      ETHERSCAN_API_KEY: string;
      INFURA_API_KEY: string;
      GOERLI_VRF_COORDINATOR: string;
      GOERLI_GASLANE: string;
      GOERLI_SUBSCRIPTION_ID: string;
      GOERLI_TOFFEE_ADDRESS: string;
      GOERLI_TOFFEE_EXCHANGE_ADDRESS: string;
      GOERLI_TOFFEE_COLLECTIBLE_ADDRESS: string;
      GOERLI_GENE_CROSSOVER_ADDRESS: string;
    }
  }
}

export {};
