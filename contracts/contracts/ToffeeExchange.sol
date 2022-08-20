// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import './IToffee.sol';

error ToffeeExchange__TransferFailed();
error ToffeeExchange__NotEnoughEthPurchase();
error ToffeeExchange__ContractNoBalance();

contract ToffeeExchange is Ownable {
    IToffee public s_toffee;

    uint256 public s_price;

    constructor(address toffee, uint256 price) {
        s_toffee = IToffee(toffee);
        s_price = price;
    }

    function purchase(uint256 wholeAmount) external payable {
        uint256 totalEth = wholeAmount * s_price;

        if (s_toffee.balanceOf(address(this)) <= 0) {
            revert ToffeeExchange__ContractNoBalance();
        }

        if (totalEth > msg.value) {
            revert ToffeeExchange__NotEnoughEthPurchase();
        }

        bool succeeded = s_toffee.transfer(msg.sender, wholeAmount);
        if (!succeeded) {
            revert ToffeeExchange__TransferFailed();
        }
    }

    function withdraw() external onlyOwner {
        bool succeeded = s_toffee.transfer(owner(), s_toffee.balanceOf(address(this)));
        if (!succeeded) {
            revert ToffeeExchange__TransferFailed();
        }
    }
}
