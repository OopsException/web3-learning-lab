// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Vault with internal accounting + pull payments
/// Core invariant: withdrawable[user] + deposited[user] is controlled by vault state,
/// and withdrawals never rely on address(this).balance as "truth" for user balances.
contract VaultV2 {
    error ZeroAmount();
    error InsufficientBalance();
    error NothingToClaim();

    mapping(address => uint256) public deposited;   // user accounting
    mapping(address => uint256) public claimable;   // pull-payment bucket

    event Deposited(address indexed user, uint256 amount);
    event WithdrawRequested(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);

    function deposit() external payable {
        if (msg.value == 0) revert ZeroAmount();
        deposited[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Request a withdrawal (moves funds to claimable, no external calls)
    function requestWithdraw(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        uint256 bal = deposited[msg.sender];
        if (bal < amount) revert InsufficientBalance();

        // Effects first (CEI)
        deposited[msg.sender] = bal - amount;
        claimable[msg.sender] += amount;

        emit WithdrawRequested(msg.sender, amount);
    }

    /// @notice Pull-payment claim (external call isolated here)
    function claim() external {
        uint256 amount = claimable[msg.sender];
        if (amount == 0) revert NothingToClaim();

        // Effects first
        claimable[msg.sender] = 0;

        // Interaction
        (bool ok, ) = payable(msg.sender).call{ value: amount }("");
        require(ok, "ETH_TRANSFER_FAILED");

        emit Claimed(msg.sender, amount);
    }

    // helpful for tests
    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
