import type { NextPage } from "next";
import React from "react";
import { ConnectButton } from "web3uikit";

const Header: NextPage = () => {
  return (
    <nav className="py-3 border-b-2 border-emerald-500 flex flex-row items-center justify-center">
      <h1 className="font-medium text-lg">Toffee Pets</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};

export default Header;
