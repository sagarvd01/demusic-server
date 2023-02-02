// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';

contract DeMusic is Ownable{
    address[] users;
    mapping(address => bool) userRegistry;
    address server;

    constructor(address svr){
        server = address(svr);
    }

    function addUser() external{
        if(!userRegistry[msg.sender]){
            users.push(msg.sender);
            userRegistry[msg.sender] = true;
        }
    }

    function addServerAddress(address svr) external onlyOwner{
        server = address(svr);
    }

    function getUsers() external view returns (address[] memory){
        require(address(msg.sender) == address(server) || address(msg.sender) == owner(), "Not accessible to general public");
        return users;
    }

}