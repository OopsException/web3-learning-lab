// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Bank {
    mapping(address => uint256) public balances;

    error NoBalance();
    error TransferFailed();

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        if (amount == 0) revert NoBalance();

        balances[msg.sender] = 0;

        // VULNERABLE
        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }
}
