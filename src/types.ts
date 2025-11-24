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
