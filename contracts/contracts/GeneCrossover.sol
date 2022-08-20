// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

import './IToffeePetsCollectible.sol';

error GeneCrossover__InvalidConstructorParams();
error GeneCrossover__GeneNotCompatible();
error GeneCrossover__CollectibleNotSet();

contract GeneCrossover is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface public s_vrfCoordinatorV2;
    IToffeePetsCollectible public s_toffePetsCollectible;

    string public s_fatherGene;
    string public s_motherGene;

    uint8 public constant NUM_LIMIT_VALUES_PER_TRAIT = 10;
    uint8 public constant NUM_TRAITS = 8;
    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant NUM_WORDS = 3;

    uint64 public immutable s_subscriptionId;
    uint32 public immutable s_callbackGasLimit;

    uint8[] public s_limitValuesPerTraitList;

    uint8 public s_mutationChance;

    uint256 public s_toffeePetsId;

    bytes32 public s_gasLane;

    event RequestRandomness(uint256 requestId);
    event MixGene(uint256 tokenId, string newGene, bool isMutation);

    constructor(
        uint8[] memory _limitValuesPerTraitList,
        uint8 _mutationChance,
        address _vrfCoordinatorV2,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        bytes32 _gasLane,
        address _toffePetsCollectible
    ) VRFConsumerBaseV2(_vrfCoordinatorV2) {
        for (uint8 i = 0; i < _limitValuesPerTraitList.length; i++) {
            if (_limitValuesPerTraitList[i] > NUM_LIMIT_VALUES_PER_TRAIT) {
                revert GeneCrossover__InvalidConstructorParams();
            }
        }

        if (_limitValuesPerTraitList.length < 2 || _limitValuesPerTraitList.length > NUM_TRAITS) {
            revert GeneCrossover__InvalidConstructorParams();
        }

        s_limitValuesPerTraitList = _limitValuesPerTraitList;
        s_mutationChance = _mutationChance;
        s_vrfCoordinatorV2 = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
        s_subscriptionId = _subscriptionId;
        s_callbackGasLimit = _callbackGasLimit;
        s_gasLane = _gasLane;
        s_toffePetsCollectible = IToffeePetsCollectible(_toffePetsCollectible);
    }

    function mixGeneRunner(
        uint256 _toffeePetsId,
        string memory _fatherGene,
        string memory _motherGene
    ) external {
        if (!isGeneCompatible(_fatherGene)) {
            revert GeneCrossover__GeneNotCompatible();
        }

        if (!isGeneCompatible(_motherGene)) {
            revert GeneCrossover__GeneNotCompatible();
        }

        s_toffeePetsId = _toffeePetsId;
        s_fatherGene = _fatherGene;
        s_motherGene = _motherGene;

        //mixGene(-1, -1);
        requestRandomness();
    }

    function mixGene(int8 mutatedTrait, int8 mutatedValue) internal {
        bytes memory fatherGeneBytes = bytes(s_fatherGene);
        bytes memory motherGeneBytes = bytes(s_motherGene);
        bytes memory crossoveredGeneBytes = new bytes(NUM_TRAITS);

        unchecked {
            // We assume that the genes are in even length
            uint8 divider = NUM_TRAITS / 2;

            for (uint8 i = 0; i < divider; i++) {
                crossoveredGeneBytes[i + divider] = fatherGeneBytes[i];
            }

            for (uint8 i = divider; i < NUM_TRAITS; i++) {
                crossoveredGeneBytes[i - divider] = motherGeneBytes[i];
            }
        }

        bool isMutation = false;
        if (mutatedTrait != -1 && mutatedValue != -1) {
            isMutation = true;
            string memory typeString = uint2str(uint256(uint8(mutatedValue)));
            bytes memory typeStringBytes = bytes(typeString);
            crossoveredGeneBytes[uint8(mutatedTrait)] = typeStringBytes[0];
        }

        s_toffePetsCollectible.finishBreed(s_toffeePetsId, string(crossoveredGeneBytes), isMutation);
        emit MixGene(s_toffeePetsId, string(crossoveredGeneBytes), isMutation);
    }

    function requestRandomness() internal {
        uint256 requestId = s_vrfCoordinatorV2.requestRandomWords(
            s_gasLane,
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            s_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestRandomness(requestId);
    }

    /**
     * @dev Callback function used by VRF Coordinator
     */
    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        uint8 hundred = 100;
        uint8 randomNumber;

        unchecked {
            randomNumber = uint8(randomWords[0] % hundred);
        }

        bool isMutation = randomNumber < s_mutationChance;

        if (isMutation) {
            uint8 randomTrait = uint8(randomWords[1]);
            uint8 randomValue = uint8(randomWords[2]);

            int8 trait = int8(randomTrait % NUM_TRAITS);
            int8 value = int8(randomValue % s_limitValuesPerTraitList[uint8(trait)]);

            mixGene(trait, value);
        } else {
            mixGene(-1, -1);
        }
    }

    function isGeneCompatible(string memory gene) private pure returns (bool) {
        bytes memory byteGenes = bytes(gene);

        if (byteGenes.length != NUM_TRAITS) {
            return false;
        }
        return true;
    }

    // https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.6.sol
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return '0';
        }

        uint256 j = _i;
        uint256 len;

        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);
        uint256 k = len;

        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }

        return string(bstr);
    }
}
