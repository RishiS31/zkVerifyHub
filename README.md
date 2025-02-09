# zkVerifyHub: A Zero-Knowledge Proof dApp on Arbitrum

## Overview

zkVerifyHub is a decentralized application (dApp) built on the Arbitrum network, leveraging zero-knowledge proofs (zk-SNARKs) for secure and private verification. This project enables users to connect their wallets (e.g., MetaMask), submit zk-SNARK proofs, and receive real-time verification results through a user-friendly interface.

---

## Features

- **Wallet Integration**: Connect to wallets like MetaMask for seamless user interaction.
- **Zero-Knowledge Proof Verification**: Submit zk-SNARK proofs for validation via smart contracts.
- **Efficient Proof Processing**: Leverages zkVerify for cost-effective and modular proof verification.
- **User-Friendly Interface**: Displays real-time proof verification status to users.

---

## Prerequisites

Before setting up the project, ensure you have the following:

- **Node.js** (v20+)
- **npm** (v9+)
- **MetaMask** browser extension installed
- **Ethers.js** library
- Basic knowledge of Ethereum and blockchain development

---

## Installation

1. Clone the repository:
```sh
git clone https://github.com/RishiS31/zkVerifyHub.git
cd zkVerifyHub
```
2. Install dependencies:
```sh
npm install
```

3. Configure environment variables:
- Create a `.env` file in the root directory.
- Add your Infura/Alchemy API key and other required configurations.

---

---

## Workflow of zkVerifyHub

1. **User Flow**:
 - User connects their wallet using MetaMask.
 - User submits a zk-SNARK proof via the frontend.

2. **Smart Contract Interaction**:
 - The submitted proof is sent to a smart contract that calls zkVerify's verifier.

3. **Proof Validation**:
 - The zkVerify verifier validates the proof and updates the verification status.

4. **Result Display**:
 - The dApp UI displays the verification result to the user.

---

## Smart Contract Integration with zkVerify

### Key Functions

1. **Submit Proofs**:
 Use `verifyProofAttestation` in zkVerify smart contracts to submit proofs.
 ```
 const tx = await contract.verifyProofAttestation(proofData);
 await tx.wait();
 console.log("Proof submitted successfully!");
 ```

2. **Check Verification Status**:
 Query the contract for proof verification results.
 ```
 const status = await contract.getVerificationStatus(proofId);
 console.log("Verification Status:", status);
 ```

---

## Development Notes

### Testing Locally
1. Deploy smart contracts using Hardhat or Truffle.
2. Use a local Ethereum node (e.g., Ganache) or connect to an Arbitrum testnet.

### Frontend Framework
The dApp frontend is built with React.js, providing an intuitive interface for wallet connection and proof submission.

---

## Future Enhancements

- Support additional wallets beyond MetaMask using WalletConnect or Coinbase Wallet SDK.
- Integrate advanced zk-SNARK proving schemes like Groth16 or Plonk.
- Expand compatibility with other L2 solutions like Optimism.

---

## Resources

- [MetaMask Documentation](https://docs.metamask.io)
- [zkVerify Documentation](https://docs.zkverify.io)
- [Ethers.js Library](https://docs.ethers.io)
- [Arbitrum Documentation](https://docs.arbitrum.io)

For additional support, please raise an issue on our GitHub repository.


