# Blockchain & Smart Contract Notes

This document captures my learning notes while exploring blockchain systems, crypto fundamentals, and smart contract development.

It includes explanations, refined questions, and observations gathered while building and testing Solidity contracts. The goal is not completeness, but clarity. Understanding how on-chain systems actually behave under real-world conditions, both technically and conceptually.

---

## 0. What Makes Blockchain Different (Non-Technical Context)

Before touching code, the biggest shift was realizing that blockchain systems operate under very different assumptions than traditional software.

In Web2 systems:
- There is an owner or operator
- Users are authenticated and permissioned
- Bugs are usually accidents
- Fixes can be deployed quietly

In blockchain systems:
- There is no central owner
- Anyone can interact with the system
- Bugs are opportunities
- Mistakes are permanent once deployed

This changes not just how code is written, but how systems must be **designed, reasoned about, and trusted**.

---

## 1. Blockchain as a System

Blockchains are not just databases with code execution. They are distributed systems with:
- Global, shared state
- Deterministic execution
- Adversarial participants
- Real economic incentives

Every transaction:
- Is ordered relative to others
- Executes against the current global state
- Can be observed and reacted to by anyone
- Has irreversible effects once finalized

This makes reasoning about behavior fundamentally different from traditional backend systems.

---

## 2. Smart Contracts as On-Chain Programs

Smart contracts are programs that:
- Execute atomically within a transaction
- Cannot be paused mid-execution
- Expose all state and logic publicly
- Must assume hostile callers by default

Key realization:  
A contract is not “used” by trusted clients, it is *interacted with by arbitrary actors*.

This reframes development from “building features” to **defending assumptions**.

---

## 3. Transaction Execution & State Changes

Important properties:
- State changes happen during execution, not after
- External calls can transfer control
- Reverts roll back all state changes in the current call stack
- Ether transfers can trigger code execution

This means:
- Ordering matters
- Side effects matter
- “Simple” functions can have complex behavior

The execution model itself becomes part of the threat surface.

---

## 4. Reentrancy: Why It Exists

Reentrancy is not a bug in Solidity. It’s a result of:
- External calls transferring control
- State being updated after those calls
- Contracts assuming execution is linear

A vulnerable pattern:
1. Send Ether to an external address
2. Update internal state afterward

If the receiver is a contract, it can re-enter before state is updated.

This was an important lesson in how **small ordering decisions can have system-wide consequences**.

---

## 5. Adversarial Thinking (Beyond Code)

One of the biggest non-technical shifts was learning to think adversarially.

On-chain:
- Every function will be called in unexpected ways
- Every assumption will be tested
- Every edge case is a potential exploit

Writing attacker contracts made it clear that:
- Attackers don’t “hack” they follow the rules better than you
- The system fails logically, not mysteriously
- The EVM is neutral and unforgiving

This mindset applies beyond Solidity to any system exposed to untrusted input.

---

## 6. Attacker Contracts & Exploits

Writing attacker contracts clarified that:
- The attacker is just another contract
- Exploits are often simple once assumptions are broken
- Defensive design matters more than clever logic

Assumptions like “this function won’t be called twice” or “this address is safe” are invalid on-chain.

---

## 7. Tests as Proof, Not Just Verification

Tests are not just to check correctness. They can demonstrate:
- That an exploit is possible
- That a fix actually prevents it
- That invariants hold under repeated interaction

Seeing a test fail due to an exploit was more convincing than reading about vulnerabilities.

Tests became a way to **argue about behavior**, not just validate outcomes.

---

## 8. Invariants & Design Principles

Some emerging principles:
- Update state before external calls
- Minimize trust assumptions
- Design for worst-case callers
- Prefer pull over push patterns
- Treat every external interaction as hostile

Invariants help define what must *always* be true, regardless of call order or caller intent.

This shifts design from “what should happen” to “what must never break”.

---

## 9. Crypto, Value & Incentives

On-chain code often controls real value.

This means:
- Bugs are economically exploitable
- Attackers are rational, not random
- Code correctness has financial consequences

Security is not just a technical concern it’s an economic one.  
Incentives shape behavior as much as logic does.

---

## 10. Limits & Tradeoffs (Non-Code Lessons)

Some important non-technical realizations:
- Perfect security doesn’t exist
- Simplicity often beats cleverness
- Reducing surface area matters
- Some risks are social or economic, not technical

Not every problem can be solved in code.

---

## 11. Open Questions

Some questions I’m still exploring:
- How to formally specify and test invariants
- How MEV affects contract assumptions
- Where off-chain trust leaks into on-chain systems
- How protocol-level design influences contract safety

---

## 12. Meta: How I’m Learning

My approach so far:
- Build simple contracts
- Break them intentionally
- Write attacker code
- Prove failures with tests
- Apply fixes and re-test

This process has been far more effective than reading alone.

---

## 13. Future Topics

Planned areas to explore:
- Advanced invariants and property-based testing
- Deployment and verification on testnets
- MEV, front-running, and transaction ordering
- Layer 2 execution and settlement
- Historical exploit postmortems
