// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IZKVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool);
}

contract ZkVerifyContract is Ownable, ReentrancyGuard {
    IZKVerifier public verifier;
    
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    // Verification types
    enum VerificationType { KYC, CREDIT_SCORE, AGE_VERIFICATION }
    
    struct VerificationRecord {
        bool isVerified;
        uint256 timestamp;
        VerificationType verificationType;
    }

    mapping(address => mapping(VerificationType => VerificationRecord)) public verifications;
    
    event ProofVerified(address indexed user, VerificationType verificationType, bool success);
    event VerifierUpdated(address newVerifier);

    constructor(address _verifier) {
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
        uint256[1] memory input,
        VerificationType verificationType
    ) public nonReentrant returns (bool) {
        require(!verifications[msg.sender][verificationType].isVerified, "Already verified");
        
        bool isValid = verifier.verifyProof(a, b, c, input);
        
        if (isValid) {
            verifications[msg.sender][verificationType] = VerificationRecord({
                isVerified: true,
                timestamp: block.timestamp,
                verificationType: verificationType
            });
        }
        
        emit ProofVerified(msg.sender, verificationType, isValid);
        return isValid;
    }
    
    function getVerificationStatus(address user, VerificationType verificationType) 
        public 
        view 
        returns (bool isVerified, uint256 timestamp) 
    {
        VerificationRecord memory record = verifications[user][verificationType];
        return (record.isVerified, record.timestamp);
    }

    function isVerified(address user, VerificationType verificationType) public view returns (bool) {
        return verifications[user][verificationType].isVerified;
    }
}