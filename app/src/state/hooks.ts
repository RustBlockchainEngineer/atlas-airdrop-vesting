import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { State, WalletState } from "./types";
import { setWalletState } from "./walletState";

export const useFetchPublicData = () => {}; // end of use Fetch Public Data

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block);
};

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock);
};

export const useWalletState = () => {
  const wallet_state = useSelector((state: State) => state.wallet);
  return wallet_state;
};

export const useSetWalletState = () => {
  const dispatch = useAppDispatch();

  const walletUpdate = useCallback((wallet: WalletState) => {
    // dispatch(setWalletState(wallet));
    dispatch(
      setWalletState({
        connected: wallet?.connected,
        providerUrl: wallet?.providerUrl,
        publicKey: wallet?.publicKey,
        chainId: wallet?.chainId,
      }),
    );
    // eslint-disable-next-line
  }, []);

  return { walletUpdate };
};
