// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Vault {
    address public owner;

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    error NotOwner();
    error ZeroAmount();
    error WithdrawFailed();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // Accept ETH sent directly to the contract
    receive() external payable {
        if (msg.value == 0) revert ZeroAmount();
        emit Deposited(msg.sender, msg.value);
    }

    // Also accept ETH via fallback if someone calls unknown function with ETH
    fallback() external payable {
        if (msg.value == 0) revert ZeroAmount();
        emit Deposited(msg.sender, msg.value);
    }

    function balance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawAll(address payable to) external onlyOwner {
        uint256 amount = address(this).balance;
        if (amount == 0) revert ZeroAmount();

        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert WithdrawFailed();

        emit Withdrawn(to, amount);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        if (amount == 0) revert ZeroAmount();
        require(amount <= address(this).balance, "Insufficient vault balance");

        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert WithdrawFailed();

        emit Withdrawn(to, amount);
    }
}
