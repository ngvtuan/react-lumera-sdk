import { SignaturePrompter, TxPrompter } from '@lumera-protocol/sdk-js';

export interface ILumeraClient {
    chainId: string;
    rpcUrl: string;
    lcdUrl: string;
    snapiUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signer: any;
    address: string;
    gasPrice: string;
    timeout?: number;
    maxRetries?: number;
}

export interface IDownload {
    lastActionId: string;
    pollInterval?: number;
    timeout?: number;
}

type TSignaturePrompter = SignaturePrompter & {
    reset: () => void;
}

export interface IUpload {
    fileBytes: Uint8Array<ArrayBuffer>;
    fileName: string;
    isPublic?: boolean;
    expirationTime?: string;
    pollInterval?: number;
    timeout?: number;
    signaturePrompter?: TSignaturePrompter;
    txPrompter?: TxPrompter;
}