import type { NextPage } from "next";
import React from "react";
import { ConnectButton } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Toffee from "../abis/Toffee.json";
import { ethers } from "ethers";
import Logo from "../assets/logo.png";
import Image from "next/image";

const Header: NextPage = () => {
  const [balance, setBalance] = React.useState<string>("");
  const { isWeb3Enabled, account } = useMoralis();
  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: Toffee.abi,
    contractAddress: process.env.NEXT_PUBLIC_TOFFEE_ADDRESS,
    functionName: "balanceOf",
    params: {
      account,
    },
  });

  React.useEffect(() => {
    async function startup() {
      const balance = (await getBalance()) as string;
      const formattedBalance = ethers.utils.formatEther(balance);
      setBalance(formattedBalance.toString());
    }

    if (isWeb3Enabled) {
      startup();
    }
  }, [isWeb3Enabled, getBalance]);

  return (
    <nav className="py-3 border-b-2 border-emerald-500 flex flex-row items-center justify-center">
      <Image src={Logo} alt="logo" width={50} height={50} />
      <h1 className="font-medium text-xl">Toffee Pets</h1>
      <div className="ml-10">TOF Balance: {balance}</div>
      <div className="ml-auto py-2 px-4 d-flex flex-row">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};

export default Header;
