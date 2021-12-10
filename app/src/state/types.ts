// Block

import BigNumber from "bignumber.js";

export interface BlockState {
  currentBlock: number;
  initialBlock: number;
}

export interface WalletState {
  connected: boolean;
  publicKey: string;
  chainId: number;
  providerUrl: string;
}

// Global state

export interface State {
  block: BlockState;
  wallet: WalletState;
}
