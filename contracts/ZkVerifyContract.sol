// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IZKVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external view returns (bool);
}

contract ZkVerifyContract is Ownable, ReentrancyGuard {
    IZKVerifier public verifier;
    uint256 public constant MINIMUM_AGE = 18;
    uint256 public constant MINIMUM_CREDIT_SCORE = 650;
    
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[2] input;
    }

    enum VerificationType { KYC, CREDIT_SCORE, AGE_VERIFICATION }
    
    struct VerificationRecord {
        bool isVerified;
        uint256 timestamp;
        VerificationType verificationType;
        bytes32 proofHash;
    }

    mapping(address => mapping(VerificationType => VerificationRecord)) public verifications;
    mapping(bytes32 => bool) public usedProofs;
    
    event ProofVerified(address indexed user, VerificationType verificationType, bool success, uint256 timestamp);
    event VerifierUpdated(address newVerifier);

    constructor(address _verifier) {
        require(_verifier != address(0), "Invalid verifier address");
        verifier = IZKVerifier(_verifier);
    }

    function updateVerifier(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "Invalid verifier address");
        verifier = IZKVerifier(_newVerifier);
        emit VerifierUpdated(_newVerifier);
    }

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input,
        VerificationType verificationType
    ) public nonReentrant returns (bool) {
        require(!verifications[msg.sender][verificationType].isVerified, "Already verified");
        
        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, input, msg.sender));
        require(!usedProofs[proofHash], "Proof already used");
        
        bool isValid = verifier.verifyProof(a, b, c, input);
        require(isValid, "Invalid proof");

        // Additional verification based on type
        if (verificationType == VerificationType.AGE_VERIFICATION) {
            require(input[0] >= MINIMUM_AGE, "Age requirement not met");
        } else if (verificationType == VerificationType.CREDIT_SCORE) {
            require(input[0] >= MINIMUM_CREDIT_SCORE, "Credit score requirement not met");
        }
        
        usedProofs[proofHash] = true;
        verifications[msg.sender][verificationType] = VerificationRecord({
            isVerified: true,
            timestamp: block.timestamp,
            verificationType: verificationType,
            proofHash: proofHash
        });
        
        emit ProofVerified(msg.sender, verificationType, true, block.timestamp);
        return true;
    }
    
    function getVerificationStatus(address user, VerificationType verificationType) 
        public 
        view 
        returns (bool isVerified, uint256 timestamp, bytes32 proofHash) 
    {
        VerificationRecord memory record = verifications[user][verificationType];
        return (record.isVerified, record.timestamp, record.proofHash);
    }

    function isVerified(address user, VerificationType verificationType) public view returns (bool) {
        return verifications[user][verificationType].isVerified;
    }
}