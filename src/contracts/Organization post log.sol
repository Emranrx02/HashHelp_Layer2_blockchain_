// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationPostContract {
    event PostCreated(
        address indexed org,
        string description,
        string ipfsHash,
        uint256 timestamp
    );

    function createPost(string memory description, string memory ipfsHash) public {
        emit PostCreated(msg.sender, description, ipfsHash, block.timestamp);
    }
}