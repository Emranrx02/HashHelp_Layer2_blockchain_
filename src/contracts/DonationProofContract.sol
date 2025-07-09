// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationProofContract {
    struct Donation {
        address donor;
        uint amount;
        string description;
        string ipfsHash;
        uint timestamp;
    }

    mapping(uint => Donation) public donations;
    uint public donationCount;

    event DonationStored(
        address indexed donor,
        uint amount,
        string description,
        string ipfsHash,
        uint timestamp
    );

    function storeDonationWithProof(
        uint amount,
        string memory description,
        string memory ipfsHash
    ) public {
        donations[donationCount] = Donation(
            msg.sender,
            amount,
            description,
            ipfsHash,
            block.timestamp
        );

        emit DonationStored(
            msg.sender,
            amount,
            description,
            ipfsHash,
            block.timestamp
        );

        donationCount++;
    }

    function getDonation(uint index) public view returns (
        address donor,
        uint amount,
        string memory description,
        string memory ipfsHash,
        uint timestamp
    ) {
        Donation storage d = donations[index];
        return (d.donor, d.amount, d.description, d.ipfsHash, d.timestamp);
    }
}