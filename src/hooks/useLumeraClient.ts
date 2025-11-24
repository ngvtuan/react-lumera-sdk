import * as lumeraClient from "@lumera-protocol/sdk-js";

import { ILumeraClient, IDownload, IUpload } from '../types';

export const useLumeraClient = () => {
    const createBatchedSignaturePrompter = () => {
        return lumeraClient.createBatchedSignaturePrompter()
    }

    const createDefaultTxPrompter = () => {
        return lumeraClient.createDefaultTxPrompter()
    }

    const getLumeraClient = async (config: ILumeraClient) => {
        const { 
            chainId,
            rpcUrl,
            lcdUrl,
            snapiUrl,
            signer,
            address,
            gasPrice = '0.025ulume',
            timeout = 45000,
            maxRetries = 3,
        } = config;
        if (!chainId || !rpcUrl || !lcdUrl || !snapiUrl || !signer || !address) {
            return null
        }
        const client = await lumeraClient.createLumeraClient({
            chainId,
            rpcUrl,
            lcdUrl,
            snapiUrl,
            signer,
            address,
            gasPrice,
            http: {
                timeout,
                maxRetries,
            },
        });
        return client;
    }

    const getSupernodes = async (config: ILumeraClient) => {
        try {
            const client = await getLumeraClient(config);
            if (!client) {
                return null;
            }
            const items = await client.Blockchain.Supernode.listSupernodes();
            return items;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
        }
    }

    const getKeplrSigner = async (chainId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const signer: any = await lumeraClient.getKeplrSigner(chainId);
        return signer;
    }

    const downloadCascade = async (item: IDownload, lumeraClientConfig: ILumeraClient) => {
        // lastActionId: string, config: ILumeraClient, pollInterval = 2000, timeout = 300000
        try {
            const client = await getLumeraClient(lumeraClientConfig);
            if (!client) {
                return null;
            }
            const stream = await client.Cascade.downloader.download(item.lastActionId, {
                pollInterval: item.pollInterval || 2000,
                timeout: item.timeout || 300000,
            });

            return stream;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
        }
    }

    const uploadCascade = async (item: IUpload, lumeraClientConfig: ILumeraClient) => {
        try {
            const client = await getLumeraClient(lumeraClientConfig);
             if (!client) {
                return null;
            } 
            const result = await client.Cascade.uploader.uploadFile(item.fileBytes, {
                fileName: item.fileName,
                isPublic: item.isPublic || false,
                expirationTime: item.expirationTime || Math.floor(Date.now() / 1000 + 86400 * 1.5).toString(),
                taskOptions: {
                    pollInterval: item.pollInterval || 2000,
                    timeout: item.timeout || 300000,
                },
                signaturePrompter: item.signaturePrompter,
                txPrompter: item.txPrompter,
            });
            return result
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
        }
    }

    return {
        createBatchedSignaturePrompter,
        createDefaultTxPrompter,
        getSupernodes,
        getKeplrSigner,
        downloadCascade,
        uploadCascade,
    }
}
