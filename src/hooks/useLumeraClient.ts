import { 
    createLumeraClient, 
    createBatchedSignaturePrompter, 
    createDefaultTxPrompter,
} from "@lumera-protocol/sdk-js";

import { ILumeraClient } from '../types';

const keplrSignaturePrompter = createBatchedSignaturePrompter();
const keplrTxPrompter = createDefaultTxPrompter();

export const useLumeraClient = () => {
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
        const client = await createLumeraClient({
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

    const fetchSupernode = async (config: ILumeraClient) => {
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

    const uploadCascade = async (files: File[], config: ILumeraClient) => {
        try {
            const client = await getLumeraClient(config);
             if (!client) {
                return null;
            } 
            const selectedFile = files[0];
            const fileBuffer = await selectedFile.arrayBuffer();
            const fileBytes = new Uint8Array(fileBuffer);
            const expirationTime = Math.floor(Date.now() / 1000 + 86400 * 1.5).toString();

            const result = await client.Cascade.uploader.uploadFile(fileBytes, {
                fileName: selectedFile.name,
                isPublic: false,
                expirationTime: expirationTime,
                taskOptions: {
                pollInterval: 2000,
                timeout: 300000,
                },
                signaturePrompter: keplrSignaturePrompter,
                txPrompter: keplrTxPrompter,
            });
            return result
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
        }
    }

    const downloadCascade = async (lastActionId: string, config: ILumeraClient, pollInterval = 2000, timeout = 300000) => {
        try {
            const client = await getLumeraClient(config);
            if (!client) {
                return null;
            }
            const stream = await client.Cascade.downloader.download(lastActionId, {
                pollInterval,
                timeout,
            });
            // Read the stream
            const reader = stream.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
            }

            // Combine chunks
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const downloadedBytes = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                downloadedBytes.set(chunk, offset);
                offset += chunk.length;
            }

            return downloadedBytes;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
        }
    }

    return {
        fetchSupernode,
        uploadCascade,
        downloadCascade,
    }
}
