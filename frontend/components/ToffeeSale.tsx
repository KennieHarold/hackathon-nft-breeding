import React from "react";
import type { NextPage } from "next";
import {
  useWeb3Contract,
  useMoralis,
  Web3ExecuteFunctionParameters,
} from "react-moralis";
import Card from "./Card";
import ToffeePetsCollectible from "../abis/ToffeePetsCollectible.json";

const ToffeeSale: NextPage = () => {
  const [toffeePets, setToffeePets] = React.useState<any[]>([]);

  const { isWeb3Enabled } = useMoralis();
  const { runContractFunction: getTotalSupply } = useWeb3Contract({
    abi: ToffeePetsCollectible.abi,
    contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
    functionName: "getTotalSupply",
  });

  const { runContractFunction: isToffeePetForSale } = useWeb3Contract({});
  const { runContractFunction: getToffeePetInfo } = useWeb3Contract({});

  const getMetadata = async (tokenId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/metadata/" + tokenId)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error(error);
        return {};
      });
  };

  React.useEffect(() => {
    const isForSaleOptions: Web3ExecuteFunctionParameters = {
      abi: ToffeePetsCollectible.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
      functionName: "isToffeePetForSale",
    };

    const toffeePetInfoOptions: Web3ExecuteFunctionParameters = {
      abi: ToffeePetsCollectible.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
      functionName: "getToffeePetInfo",
    };

    async function startup() {
      const supply = (await getTotalSupply()) as string;
      const supplyNumber = parseInt(supply, 10);
      setToffeePets([]);

      for (let i = 0; i < supplyNumber; i++) {
        isForSaleOptions.params = {
          tokenId: i,
        };

        const sale = await isToffeePetForSale({
          params: isForSaleOptions,
        });

        if (!sale) continue;

        toffeePetInfoOptions.params = {
          tokenId: i,
        };

        const info: any = await getToffeePetInfo({
          params: toffeePetInfoOptions,
        });

        const metadata = await getMetadata(i);
        const toffeePet = {
          ...info,
          tokenId: i,
          metadata,
        };

        setToffeePets((prevToffeePets) => [...prevToffeePets, toffeePet]);
      }
    }

    if (isWeb3Enabled) startup();
  }, [getToffeePetInfo, getTotalSupply, isToffeePetForSale, isWeb3Enabled]);

  return (
    <div className="flex flex-row mt-5 flex-wrap justify-center items-center px-5">
      {toffeePets.map((toffeePet) => (
        <Card
          key={toffeePet.tokenId}
          tokenId={toffeePet.tokenId}
          name={toffeePet.metadata.name}
          image={toffeePet.metadata.image}
          price={0}
          generation={toffeePet.generation?.toString()}
          sale={true}
          width={250}
        ></Card>
      ))}
    </div>
  );
};

export default ToffeeSale;
