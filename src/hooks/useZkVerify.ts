import { useCallback, useState } from 'react';
import { useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { parseAbiItem } from 'viem';

// Replace with actual deployed verifier contract address
const VERIFIER_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const CONTRACT_ABI = [
  'function verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[2] input, uint8 verificationType) public returns (bool)',
  'function isVerified(address user, uint8 verificationType) public view returns (bool)',
  'function getVerificationStatus(address user, uint8 verificationType) public view returns (bool isVerified, uint256 timestamp, bytes32 proofHash)'
] as const;

export enum VerificationType {
  KYC = 0,
  CREDIT_SCORE = 1,
  AGE_VERIFICATION = 2
}

interface ProofData {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
  input: [string, string];
}

export function useZkVerify(verificationType: VerificationType) {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [verificationTimestamp, setVerificationTimestamp] = useState<number | null>(null);
  const [proofHash, setProofHash] = useState<string | null>(null);

  const { writeContract } = useWriteContract();

  const { data: verificationData, refetch: refetchVerification } = useReadContract({
    address: VERIFIER_CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVerificationStatus',
    args: [null, verificationType],
    enabled: false,
  });

  useWatchContractEvent({
    address: VERIFIER_CONTRACT_ADDRESS,
    abi: [parseAbiItem('event ProofVerified(address indexed user, uint8 verificationType, bool success, uint256 timestamp)')],
    eventName: 'ProofVerified',
    onLogs(logs) {
      setIsTransactionPending(false);
      setVerificationStatus('success');
      refetchVerification();
    },
  });

  const verifyProof = useCallback(async (proofData: string) => {
    try {
      setVerificationStatus('verifying');
      setIsTransactionPending(true);
      
      const proof: ProofData = JSON.parse(proofData);
      
      await writeContract({
        address: VERIFIER_CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'verifyProof',
        args: [
          proof.a,
          proof.b,
          proof.c,
          proof.input,
          verificationType
        ],
      });
      
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus('error');
      setIsTransactionPending(false);
    }
  }, [writeContract, verificationType]);

  return {
    verifyProof,
    verificationStatus,
    isVerified: verificationData?.[0] || false,
    verificationTimestamp: verificationData?.[1] || null,
    proofHash: verificationData?.[2] || null,
    isTransactionPending
  };
}