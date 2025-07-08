// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationContract {
    address public owner;
    address public recipient;

    mapping(address => uint256) public donations;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    constructor(address _recipient) {
        owner = msg.sender;
        recipient = _recipient;
    }

    function donate() public payable {
        require(msg.value > 0, "Send some ETH to donate.");
        donations[msg.sender] += msg.value;

        // Transfer to recipient wallet
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed.");

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    function getDonation(address donor) public view returns (uint256) {
        return donations[donor];
    }

    function changeRecipient(address newRecipient) public {
        require(msg.sender == owner, "Only owner can change recipient.");
        recipient = newRecipient;
    }
}

//0xAcDF97aAD93CF81f8a85E732E982e889F73364C2

//donationcontractprofer.sol aita
// 0xe9350d0023B3E94D892d4a0c15c6Ae0A5D5132d8 eita

//OrganizationContract.sol aita

//0xac45090d82da90c47a8fda64ea1676178c26b686

//DonationProofContract.sol aita
//0x3fF0F5Fe4d41886a4900629cf93196d4c58fa58C
