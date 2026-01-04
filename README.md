# 🧪 Web3 Learning Lab

**web3-learning-lab** is a hands-on project for building **deep, systems-level understanding of Ethereum and smart contract security**.

This repository is intentionally **not a tutorial**.  
It focuses on *writing contracts, breaking them, fixing them, and proving correctness*.

---

## 🎯 Project Goals

- Understand Ethereum as a **settlement system**
- Write Solidity with **security-first thinking**
- Learn common **vulnerabilities by exploiting them**
- Fix bugs using **invariants and correct design**
- Prove behavior with **tests**
- Gradually move toward **production-grade patterns**

---

## 🏗️ What’s Inside

### 📓 Notes

This repository includes a `NOTES.md` file documenting my learning process, including:
- Blockchain & crypto fundamentals
- Smart contract execution model
- Security pitfalls and exploit mechanics
- Design reasoning and open questions

---

### Smart Contracts

| Contract | Purpose |
|--------|--------|
| `Counter.sol` | Solidity fundamentals (state, functions, events) |
| `Vault.sol` | ETH custody + access control |
| `Bank.sol` | Reentrancy vulnerability **and its fix (CEI)** |
| `BankAttacker.sol` | Demonstrates a real exploit using reentrancy |

> ⚠️ Vulnerable contracts are intentionally kept for learning and comparison.

---

### Tests (Hardhat v3 + ethers v6)

- Unit tests written in **TypeScript**
- Exploit tests that **prove vulnerabilities**
- Regression tests that **prove fixes**
- Balance-diff testing instead of assumptions
- Tests designed with an **auditor mindset**

---

## 🧰 Scripts & Tooling

- Hardhat v3 (Beta)
- ethers v6
- Ignition deployment modules
- Local Hardhat node
- MetaMask-compatible frontend experiments

---

## 🧠 Core Concepts Covered

- EOAs vs contracts
- ETH balances vs internal accounting
- Reentrancy and timing attacks
- CEI (Checks–Effects–Interactions)
- Custom Solidity errors
- Access control as a security boundary
- Why exploits are about **broken invariants**, not syntax

---

## 📂 Project Structure

```text
web3-learning-lab/
├─ contracts/
│  ├─ Counter.sol
│  ├─ Vault.sol
│  ├─ Bank.sol
│  ├─ BankAttacker.sol
├─ test/
│  ├─ Counter.ts
│  ├─ Vault.ts
│  ├─ BankAttack.ts
├─ scripts/
│  ├─ deploy-vault.ts
│  ├─ send-op-tx.ts
├─ ignition/
│  └─ Counter.ts
├─ hardhat.config.ts
├─ tsconfig.json
├─ package.json
├─ README.md
└─ .gitignore
```

# Roadmap

## Phase 1: Fundamentals & Exploits (Completed)

- Solidity basics
- Reentrancy exploit
- Attacker contracts
- Proof via tests

## Phase 2: Security & Invariants (Next)

- Invariant testing
- Regression tests
- NatSpec documentation
- Provable correctness

## Phase 3: Real-World Patterns

- Pull payments
- Escrow
- Pausable contracts
- Ownership and upgrade risks

## Phase 4: Deployment & Ecosystem

- Deploy to Sepolia or Holesky
- Contract verification on explorers
- Gas and fee mechanics
- On-chain interaction via explorers

## Phase 5: Advanced Topics (Optional)

- MEV and front-running
- Flashbots and private order flow
- Layer 2 settlement mechanics
- Historical exploit postmortems
