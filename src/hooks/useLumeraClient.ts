/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lumeraClient from "@lumera-protocol/sdk-js";
import type { EncodeObject } from "@cosmjs/proto-signing";

import {
  ILumeraClient,
  IDownload,
  IUpload,
  ILumeraClientWithoutSigner,
} from '../types';

const createBatchedSignaturePrompter = () => {
  return lumeraClient.createBatchedSignaturePrompter();
}

const createDefaultTxPrompter = () => {
  return lumeraClient.createDefaultTxPrompter();
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
  if (!chainId) {
    throw new Error('Chain ID is required.');
  }
  if (!rpcUrl) {
    throw new Error('RPC Url is required.');
  }
  if (!lcdUrl) {
    throw new Error('LCD Url is required.');
  }
  if (!snapiUrl) {
    throw new Error('Snapi Url is required.');
  }
  if (!signer) {
    throw new Error('Signer is required.');
  }
  if (!address) {
    throw new Error('Address is required.');
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

const getLumeraClientWithoutSigner = async (config: ILumeraClientWithoutSigner) => {
  const {
    chainId,
    rpcUrl,
    lcdUrl,
    snapiUrl,
    gasPrice = '0.025ulume',
    timeout = 45000,
    maxRetries = 3,
  } = config;
  if (!chainId) {
    throw new Error('Chain ID is required.');
  }
  if (!rpcUrl) {
    throw new Error('RPC Url is required.');
  }
  if (!lcdUrl) {
    throw new Error('LCD Url is required.');
  }
  if (!snapiUrl) {
    throw new Error('Snapi Url is required.');
  }
  const signer: any = null;
  const client = await lumeraClient.createLumeraClient({
    chainId,
    rpcUrl,
    lcdUrl,
    snapiUrl,
    signer,
    address: '',
    gasPrice,
    http: {
      timeout,
      maxRetries,
    },
  });
  return client;
}

const getSupernodes = async (client: lumeraClient.LumeraClient) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Supernode.listSupernodes();
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const simulate = async (client: lumeraClient.LumeraClient, address: string, msgs: EncodeObject[], memo: string) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Tx.simulate(address, msgs, memo)
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getSupernodeParams = async (client: lumeraClient.LumeraClient) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Supernode.getParams();
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getSupernodeByAddress = async (client: lumeraClient.LumeraClient, supernodeAddress: string) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Supernode.getSupernodeByAddress(supernodeAddress);
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getSupernode = async (client: lumeraClient.LumeraClient, validatorAddress: string) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Supernode.getSupernode(validatorAddress);
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getKeplrSigner = async (chainId: string) => {
  const signer: any = await lumeraClient.getKeplrSigner(chainId);
  return signer;
}

const downloadCascade = async (item: IDownload, client: lumeraClient.LumeraClient) => {
  try {
    if (!client) {
      throw new Error('client is required.')
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

const uploadCascade = async (item: IUpload, client: lumeraClient.LumeraClient) => {
  try {
    if (!client) {
      throw new Error('client is required.')
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

const getAction = async (client: lumeraClient.LumeraClient, actionId: string) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    if (!actionId) {
      throw new Error('actionId is required.')
    }
    const items = await client.Blockchain.Action.getAction(actionId);
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getActionFee = async (client: lumeraClient.LumeraClient, dataSize: number) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    if (!dataSize || dataSize <= 0) {
      throw new Error('dataSize is required.')
    }
    const items = await client.Blockchain.Action.getActionFee(dataSize);
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

const getParams = async (client: lumeraClient.LumeraClient) => {
  try {
    if (!client) {
      throw new Error('client is required.')
    }
    const items = await client.Blockchain.Action.getParams();
    return items;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.')
  }
}

export {
  getAction,
  getActionFee,
  getParams,
  getLumeraClient,
  getLumeraClientWithoutSigner,
  simulate,
  getSupernodeParams,
  getSupernodeByAddress,
  getSupernode,
  createBatchedSignaturePrompter,
  createDefaultTxPrompter,
  getSupernodes,
  getKeplrSigner,
  downloadCascade,
  uploadCascade,
}
