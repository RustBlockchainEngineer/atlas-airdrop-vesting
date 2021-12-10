/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletState } from "../types";

const initialState: WalletState = {
  chainId: null,
  connected: false,
  providerUrl: "",
  publicKey: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletState: (
      state: WalletState,
      action: PayloadAction<WalletState>,
    ) => {
      state.chainId = action.payload.chainId;
      state.connected = action.payload.connected;
      state.providerUrl = action.payload.providerUrl;
      state.publicKey = action.payload.publicKey;
    },
  },
});

// Actions
export const { setWalletState } = walletSlice.actions;

export default walletSlice.reducer;
