// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TimedVault {
    error ZeroAmount();
    error TooEarly(uint256 nowTs, uint256 unlockTs);
    error InsufficientBalance();
    error NothingToClaim();

    struct Position {
        uint256 deposited;
        uint256 claimable;
        uint256 unlockTime;
    }

    mapping(address => Position) public positions;

    event Deposited(address indexed user, uint256 amount, uint256 unlockTime);
    event WithdrawRequested(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);

    function deposit(uint256 lockSeconds) external payable {
        if (msg.value == 0) revert ZeroAmount();

        Position storage p = positions[msg.sender];

        // Extend lock: if user deposits again, keep the max unlock time (common real-world behavior)
        uint256 newUnlock = block.timestamp + lockSeconds;
        if (newUnlock > p.unlockTime) {
            p.unlockTime = newUnlock;
        }

        p.deposited += msg.value;

        emit Deposited(msg.sender, msg.value, p.unlockTime);
    }

    function requestWithdraw(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        Position storage p = positions[msg.sender];
        if (block.timestamp < p.unlockTime) revert TooEarly(block.timestamp, p.unlockTime);

        if (p.deposited < amount) revert InsufficientBalance();

        p.deposited -= amount;
        p.claimable += amount;

        emit WithdrawRequested(msg.sender, amount);
    }

    function claim() external {
        Position storage p = positions[msg.sender];
        uint256 amount = p.claimable;
        if (amount == 0) revert NothingToClaim();

        p.claimable = 0;

        (bool ok, ) = payable(msg.sender).call{ value: amount }("");
        require(ok, "ETH_TRANSFER_FAILED");

        emit Claimed(msg.sender, amount);
    }

    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
