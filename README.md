# Hackathon NFT Breeding

This is my winning hackathon NFT project during the Genesis Blocks hosted by BreederDao last August 2022.
This project allows on-chain breeding mechanism using a gene crossover algorithm and Chainlink for randomness and mutation.

# Getting Started

## 1. Make sure you fill in these environment variables

_Note: Each directory (contracts, frontend, server) must have a separate environment file_

```shell
# Contracts
INFURA_API_KEY
ADMIN_PK
ETHERSCAN_API_KEY
GOERLI_VRF_COORDINATOR
GOERLI_GASLANE
GOERLI_SUBSCRIPTION_ID
GOERLI_TOFFEE_ADDRESS
GOERLI_TOFFEE_EXCHANGE_ADDRESS
GOERLI_TOFFEE_PETS_COLLECTIBLE_ADDRESS
GOERLI_GENE_CROSSOVER_ADDRESS

# Frontend
NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS
NEXT_PUBLIC_TOFFEE_ADDRESS
NEXT_PUBLIC_EXCHANGE_ADDRESS
NEXT_PUBLIC_GENE_CROSSOVER_ADDRESS
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Server
PINATA_API_KEY
PINATA_SECRET_API_KEY
PINATA_JWT
```

## 2. Deploy the contract

```shell
npx hardhat run ./scripts/deploy.ts --network goerli
```

## 3. Verify the contract

```shell
npx hardhat run ./scripts/verify.ts --network goerli
```

## 4. Start the frontend

```shell
npm run dev
```

or

```shell
yarn dev
```

## 5. Start the server

```shell
npm run dev
```

or

```shell
yarn dev
```

# Contract Addresses

You can check the sample contract addresses at [GoerliEth](https://goerli.etherscan.io/)

```shell
TOFFEE_COLLECTIBLE_ADDRESS=0x43803c69AE20C2aCCdC4AbD76C3167DCc5cb9B94
TOFFEE_ADDRESS=0xF22CDE739b1b3274Da38700424e3fE66d2174146
EXCHANGE_ADDRESS=0x6Cb095D9fa8459f46e7c27B0944F0626BDDB2feD
GENE_CROSSOVER_ADDRESS=0x901cf5F9F6B17Cf5e145bca8B54B4E72bd59D346
```

# Technologies Used

- Solidity
- Hardhat
- NextJS
- Chainlink
- NodeJs
- Pinata (IPFS)
