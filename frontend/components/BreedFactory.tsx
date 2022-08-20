import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import {
  useWeb3Contract,
  useMoralis,
  Web3ExecuteFunctionParameters,
} from "react-moralis";
import Card from "./Card";
import ToffeePetsCollectible from "../abis/ToffeePetsCollectible.json";
import PlaceHolder from "../assets/placeholder.jpg";
import Toffee from "../abis/Toffee.json";
import { ethers } from "ethers";

const BreedFactory: NextPage = () => {
  const [targetBreedA, setTargetBreedA] = React.useState<string>("");
  const [targetBreedB, setTargetBreedB] = React.useState<string>("");

  const [toffeePets, setToffeePets] = React.useState<any[]>([]);
  const { isWeb3Enabled, account } = useMoralis();
  const { runContractFunction: getTotalSupply } = useWeb3Contract({
    abi: ToffeePetsCollectible.abi,
    contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
    functionName: "getTotalSupply",
  });

  const { runContractFunction: isToffeePetForSale } = useWeb3Contract({});
  const { runContractFunction: getToffeePetInfo } = useWeb3Contract({});
  const { runContractFunction: aporoveToken } = useWeb3Contract({});
  const { runContractFunction: breed } = useWeb3Contract({});

  const getMetadata = async (tokenId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/metadata/" + tokenId)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error(error);
        return {};
      });
  };

  const handleBreed = async () => {
    let approveOptions = {
      abi: Toffee.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_ADDRESS,
      functionName: "approve",
      params: {
        spender: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
        amount: ethers.utils.parseEther("5"),
      },
    };

    let breedOptions: Web3ExecuteFunctionParameters = {
      abi: ToffeePetsCollectible.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
      functionName: "breed",
      params: {
        toffeeAmount: ethers.utils.parseEther("5"),
        fatherTokenId: targetBreedA,
        motherTokenId: targetBreedB,
      },
    };

    const tx: any = await aporoveToken({
      params: approveOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait();

    const tx2: any = await breed({
      params: breedOptions,
      onError: (error) => console.log(error),
    });

    await tx2.wait();

    window.location.href = "/pets";
  };

  const selectBreedParent = (tokenId: number) => {
    if (
      targetBreedA === tokenId.toString() ||
      targetBreedB === tokenId.toString()
    ) {
      alert("Already selected");
      return;
    }

    if (targetBreedA === "") {
      setTargetBreedA(tokenId.toString());
    } else if (targetBreedA !== "" && targetBreedB === "") {
      setTargetBreedB(tokenId.toString());
    } else {
      alert("Slot full");
      return;
    }
  };

  const renderParentAImage = () => {
    if (targetBreedA === "") {
      return PlaceHolder;
    } else {
      const index = toffeePets.findIndex(
        (pet) => targetBreedA === pet.tokenId.toString()
      );
      return `https://gateway.pinata.cloud/ipfs/${toffeePets[index]?.metadata.image}`;
    }
  };

  const renderParentBImage = () => {
    if (targetBreedB === "") {
      return PlaceHolder;
    } else {
      const index = toffeePets.findIndex(
        (pet) => targetBreedB === pet.tokenId.toString()
      );
      return `https://gateway.pinata.cloud/ipfs/${toffeePets[index]?.metadata.image}`;
    }
  };

  React.useEffect(() => {
    const ownerOptions: Web3ExecuteFunctionParameters = {
      abi: ToffeePetsCollectible.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
      functionName: "ownerOf",
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
        ownerOptions.params = {
          tokenId: i,
        };

        const owner: string = (await isToffeePetForSale({
          params: ownerOptions,
        })) as string;

        if (
          owner.toString().toLowerCase() !== account?.toString().toLowerCase()
        )
          continue;

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
  }, [
    account,
    getToffeePetInfo,
    getTotalSupply,
    isToffeePetForSale,
    isWeb3Enabled,
  ]);

  return (
    <div className="mt-10 d-flex flex-col justify-center items-center w-full">
      <div className="d-flex flex-row justify-center items-center w-full">
        <Image
          src={renderParentAImage()}
          alt="placeholder"
          width="170px"
          height="170px"
          priority={true}
        />
        <span className="text-5xl mx-5 font-bold">+</span>
        <Image
          src={renderParentBImage()}
          alt="placeholder"
          width="170px"
          height="170px"
          priority={true}
        />
      </div>

      <button
        className="mt-5 px-4 py-2 rounded bg-black text-white"
        onClick={handleBreed}
      >
        Breed for 5 TOF
      </button>

      <div className="mt-10">
        <h1 className="font-bold">Your toffee pets</h1>
        <div className="flex flex-row mt-5 flex-wrap">
          {toffeePets.map((toffeePet) => (
            <div
              key={toffeePet.tokenId}
              onClick={() => selectBreedParent(toffeePet.tokenId)}
              style={{ cursor: "pointer" }}
            >
              <Card
                tokenId={toffeePet.tokenId}
                name={toffeePet.metadata.name}
                image={toffeePet.metadata.image}
                price={0}
                generation={toffeePet.generation?.toString()}
                sale={false}
                width={150}
              ></Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreedFactory;
