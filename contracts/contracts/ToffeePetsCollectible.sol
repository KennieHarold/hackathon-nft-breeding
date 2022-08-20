// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

import './IGeneCrossover.sol';
import './IToffee.sol';

error ToffeePetsCollectible__NotEnoughToken();
error ToffeePetsCollectible__NotBreeding();
error ToffeePetsCollectible__GeneCrossoverNotSetup();
error ToffeePetsCollectible__TokenNotOwned();
error ToffeePetsCollectible__TokenNotForSale();

contract ToffeePetsCollectible is ERC721, Ownable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant GENE_CROSSOVER_ROLE = keccak256('onlygenecrossovercall');
    uint256 public constant BREEDING_FEE = 5 * 10**18;

    struct ToffeePet {
        string gene;
        uint256 generation;
        uint256 tokenPrice;
        bool mutation;
        bool breeding;
    }

    Counters.Counter private _tokenIdCounter;

    IToffee public s_toffee;
    IGeneCrossover public s_geneCrossover;

    // mapping of token id to ToffeePet struct
    mapping(uint256 => ToffeePet) public s_toffeePets;

    // mapping of token id that it is for sale
    // the token is for sale if it is owned by the contract
    mapping(uint256 => bool) public s_toffeePetsForSale;

    event BreedingFinish(uint256 indexed tokenId, string gene, bool isMutation);
    event Purchase(uint256 tokenId, uint256 toffeeAmount);

    constructor(string[] memory genesisGenes, address toffee) ERC721('Toffee Pets', 'TOFP') {
        s_toffee = IToffee(toffee);

        // mint 10 genesis tokens for selling
        for (uint8 i = 0; i < 10; i++) {
            uint256 tokenId = _createToffeePet(address(this), genesisGenes[i], 0, 10 * 10**18, false, false);
            s_toffeePetsForSale[tokenId] = true;
        }
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setGeneCrossover(address geneCrossover) external onlyOwner {
        s_geneCrossover = IGeneCrossover(geneCrossover);
        _setupRole(GENE_CROSSOVER_ROLE, geneCrossover);
    }

    function purchase(uint256 toffeeAmount, uint256 tokenId) external {
        if (!s_toffeePetsForSale[tokenId]) {
            revert ToffeePetsCollectible__TokenNotForSale();
        }

        ToffeePet memory toffeePet = s_toffeePets[tokenId];

        if (toffeePet.tokenPrice > toffeeAmount) {
            revert ToffeePetsCollectible__NotEnoughToken();
        }

        s_toffeePetsForSale[tokenId] = false;
        _transfer(address(this), msg.sender, tokenId);
        s_toffee.burnFrom(msg.sender, toffeeAmount);

        emit Purchase(tokenId, toffeeAmount);
    }

    function breed(
        uint256 toffeeAmount,
        uint256 fatherTokenId,
        uint256 motherTokenId
    ) external {
        if (address(s_geneCrossover) == address(0)) {
            revert ToffeePetsCollectible__GeneCrossoverNotSetup();
        }

        if (ownerOf(fatherTokenId) != msg.sender) {
            revert ToffeePetsCollectible__TokenNotOwned();
        }

        if (ownerOf(motherTokenId) != msg.sender) {
            revert ToffeePetsCollectible__TokenNotOwned();
        }

        if (BREEDING_FEE > toffeeAmount) {
            revert ToffeePetsCollectible__NotEnoughToken();
        }

        ToffeePet memory fatherToffeePet = s_toffeePets[fatherTokenId];
        ToffeePet memory motherToffeePet = s_toffeePets[motherTokenId];

        string memory fatherGene = fatherToffeePet.gene;
        string memory motherGene = motherToffeePet.gene;

        uint256 generation = _getMaxNumber(fatherToffeePet.generation, motherToffeePet.generation) + 1;
        uint256 tokenId = _createToffeePet(msg.sender, '', generation, 10 * 10**18, false, true);

        s_geneCrossover.mixGeneRunner(tokenId, fatherGene, motherGene);
        s_toffee.burnFrom(msg.sender, toffeeAmount);
    }

    /**
     * @dev Callback function used by GeneCrossover
     */
    function finishBreed(
        uint256 tokenId,
        string memory gene,
        bool isMutation
    ) external onlyRole(GENE_CROSSOVER_ROLE) {
        ToffeePet storage toffeePet = s_toffeePets[tokenId];
        if (toffeePet.breeding == false) {
            revert ToffeePetsCollectible__NotBreeding();
        }

        toffeePet.gene = gene;
        toffeePet.mutation = isMutation;
        toffeePet.breeding = false;

        emit BreedingFinish(tokenId, gene, isMutation);
    }

    function getToffeePetInfo(uint256 tokenId) external view returns (ToffeePet memory) {
        return s_toffeePets[tokenId];
    }

    function getTotalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function isToffeePetForSale(uint256 tokenId) external view returns (bool) {
        return s_toffeePetsForSale[tokenId];
    }

    function _getMaxNumber(uint256 a, uint256 b) internal pure returns (uint256 max) {
        if (a > b) {
            max = a;
        } else {
            max = b;
        }
    }

    function _createToffeePet(
        address to,
        string memory gene,
        uint256 generation,
        uint256 tokenPrice,
        bool mutation,
        bool breeding
    ) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        ToffeePet memory toffeePet = ToffeePet(gene, generation, tokenPrice, mutation, breeding);
        s_toffeePets[tokenId] = toffeePet;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @dev Describes linear override for `supportsInterface` used in
     * both `AccessControl` and `ERC721`
     */
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
