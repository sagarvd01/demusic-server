// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';

contract DeMusic is Ownable{
    address[] users;
    mapping(address => bool) userRegistry;
    mapping(address => bool) userSubscriber;
    address server;

    constructor(){
    }

    function addUser() external{
        if(!userRegistry[msg.sender]){
            users.push(msg.sender);
            userRegistry[msg.sender] = true;
            userSubscriber[msg.sender] = true;
        }
    }

    function unSubscribe() external{
        userSubscriber[msg.sender] = false;
    }

    function checkUserSubsciptionStatus(address user) external view returns (bool){
        return userSubscriber[user];
    }

    function addServerAddress(address svr) external onlyOwner{
        server = address(svr);
    }

    function getUsers() external view returns (address[] memory){
        require(address(msg.sender) == address(server) || address(msg.sender) == owner(), "Not accessible to general public");
        return users;
    }

}