/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import React from "react";
import ToffeePetsCollectible from "../abis/ToffeePetsCollectible.json";
import Toffee from "../abis/Toffee.json";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import Image from "next/image";
import UnknownPet from "../assets/unknown-pet.png";

interface CardProps {
  tokenId: number;
  name: string;
  image: string;
  price: number;
  generation: number;
  sale: boolean;
  width: number;
  breeding?: boolean;
  mutation?: boolean;
  gene?: string;
  details?: boolean;
}

const Card: NextPage<CardProps> = ({
  tokenId,
  name,
  image,
  price,
  generation,
  sale,
  width,
  breeding,
  mutation,
  gene,
  details,
}) => {
  const { runContractFunction } = useWeb3Contract({});

  const handlePurchase = async () => {
    let approveOptions = {
      abi: Toffee.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_ADDRESS,
      functionName: "approve",
      params: {
        spender: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
        amount: ethers.utils.parseEther("10"),
      },
    };

    let purchaseOptions = {
      abi: ToffeePetsCollectible.abi,
      contractAddress: process.env.NEXT_PUBLIC_TOFFEE_COLLECTIBLE_ADDRESS,
      functionName: "purchase",
      params: {
        toffeeAmount: ethers.utils.parseEther("10"),
        tokenId: tokenId,
      },
    };

    const tx: any = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait();

    const tx2: any = await runContractFunction({
      params: purchaseOptions,
      onError: (error) => console.log(error),
    });

    await tx2.wait();

    window.location.reload();
  };

  const handleGenerateImage = async () => {
    await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ipfs/pin/metadata-with-image",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId, gene }),
      }
    )
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error(error);
      });

    window.location.reload();
  };

  const renderImage = () => {
    return image ? `https://gateway.pinata.cloud/ipfs/${image}` : UnknownPet;
  };

  return (
    <div
      className="my-4 mr-5 border-2 p-3 rounded-md flex flex-col justify-center items-center"
      style={{ width }}
    >
      {sale ? (
        <div className="mb-2 border-2 px-5 rounded-lg">{"10 TOF"}</div>
      ) : null}

      {name ? (
        <div className="mb-3 font-bold">{name}</div>
      ) : (
        <button
          className="px-4 py-2 rounded bg-black text-white"
          onClick={handleGenerateImage}
          disabled={breeding}
        >
          {breeding ? "Please wait until breeding is complete" : "Get Now!"}
        </button>
      )}

      {details ? (
        <div className="w-full mb-4">
          <div>Is still breeding? {breeding?.toString()}</div>
          <div>Is mutated? {mutation?.toString()}</div>
          <div>Generation: {generation}</div>
        </div>
      ) : null}

      <Image
        src={renderImage()}
        alt="thumbnail"
        className="rounded"
        width={width}
        height={width}
      />
      {sale ? (
        <button
          className="mt-5 px-4 py-2 rounded bg-black text-white"
          onClick={handlePurchase}
        >
          Purchase!
        </button>
      ) : null}
    </div>
  );
};

export default Card;
