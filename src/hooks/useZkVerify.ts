import { useCallback, useState } from 'react';
import { useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';

// TODO: Replace with actual deployed contract address
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const CONTRACT_ABI = [
  'function verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[1] input, uint8 verificationType) public returns (bool)',
  'function isVerified(address user, uint8 verificationType) public view returns (bool)',
  'function getVerificationStatus(address user, uint8 verificationType) public view returns (bool isVerified, uint256 timestamp)'
] as const;

export enum VerificationType {
  KYC = 0,
  CREDIT_SCORE = 1,
  AGE_VERIFICATION = 2
}

export function useZkVerify(verificationType: VerificationType) {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [verificationTimestamp, setVerificationTimestamp] = useState<number | null>(null);

  const { writeContract, data: hash } = useWriteContract();

  const { data: verificationData, refetch: refetchVerification } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVerificationStatus',
    args: [null, verificationType],
    enabled: false,
  });

  // Watch for transaction confirmation
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
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
      
      const proofObject = JSON.parse(proofData);
      
      const proof = {
        a: proofObject.a,
        b: proofObject.b,
        c: proofObject.c,
        input: proofObject.input || [1]
      };
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'verifyProof',
        args: [proof.a, proof.b, proof.c, proof.input, verificationType],
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
    isTransactionPending
  };
}