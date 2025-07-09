// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PostStorage {
    uint public postCount;

    struct Post {
        uint id;
        address creator;
        string title;
        string description;
        string imageHash;
        uint timestamp;
    }

    mapping(uint => Post) public posts;

    event PostCreated(
        uint id,
        address indexed creator,
        string title,
        string description,
        string imageHash,
        uint timestamp
    );

    function createPost(string memory title, string memory description, string memory imageHash) public {
        posts[postCount] = Post(
            postCount,
            msg.sender,
            title,
            description,
            imageHash,
            block.timestamp
        );

        emit PostCreated(
            postCount,
            msg.sender,
            title,
            description,
            imageHash,
            block.timestamp
        );

        postCount++;
    }

    function getPost(uint id) public view returns (Post memory) {
        return posts[id];
    }
}