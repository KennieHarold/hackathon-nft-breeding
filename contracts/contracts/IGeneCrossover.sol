// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IGeneCrossover {
    function mixGeneRunner(
        uint256 _toffeePetsId,
        string memory _fatherGene,
        string memory _motherGene
    ) external;
}
