// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IToffeePetsCollectible {
    function finishBreed(
        uint256 tokenId,
        string memory gene,
        bool isMutation
    ) external;
}
