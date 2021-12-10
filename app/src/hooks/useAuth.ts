import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Wallet from "@project-serum/sol-wallet-adapter";
import { useCallback, useState } from "react";
import { getProvider } from "utils/utils";
import { setupNetwork } from "utils/wallet";
import { WalletAdapter } from "wallet-adapters";
import { getEndpoint } from "utils/getRpcUrl";
import { injected } from "../connectors";
import { SolanaWeb3Class } from "utils/solanaWeb3";
import { useSetWalletState } from "state/hooks";

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const endpoint = getEndpoint();
  let [wallet, setWallet] = useState<WalletAdapter | undefined>(undefined);

  const { walletUpdate } = useSetWalletState();
  const login = useCallback(() => {
    activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork();
        if (hasSetup) {
          activate(injected);
        }
      } else {
        if (error instanceof NoEthereumProviderError) {
          console.log("Provider Error", "No provider was found");
        } else {
          console.log(error.name, error.message);
        }
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    deactivate();
  }, [deactivate]);

  //wallet connect code For solana wallet connection
  const SolonaWalletConnect = useCallback((providerUrl: string) => {
    console.log("here");
    const provider = getProvider(providerUrl, 4);
    if (provider) {
      const updateWallet = () => {
        // hack to also update wallet synchronously in case it disconnects
        // eslint-disable-next-line react-hooks/exhaustive-deps
        let wallet = new (provider.adapter || Wallet)(
          provider.url,
          endpoint,
        ) as WalletAdapter;
        setWallet(wallet);
        wallet.connect();

        wallet.on("connect", async () => {
          console.log("connected");
          if (wallet?.publicKey) {
            const walletPublicKey = wallet.publicKey.toBase58();
            SolanaWeb3Class.solanaProvider(provider);
            SolanaWeb3Class.solanaWeb3(wallet);
            localStorage.setItem("connected", "true");
            localStorage.setItem("providerUrl", providerUrl);
            localStorage.setItem("endpoint", endpoint);
            localStorage.setItem("publicKey", walletPublicKey);
            console.log({
              connected: true,
              chainId: 4,
              providerUrl,
              publicKey: walletPublicKey,
            });
            walletUpdate({
              connected: true,
              chainId: 4,
              providerUrl,
              publicKey: walletPublicKey,
            });
            console.log(wallet);

            // sourceWalletUpdate({
            //   connected: true,
            //   providerUrl,
            //   publicKey: walletPublicKey,
            //   chainId: NetworkChainId.SOLANA,
            // });
          }
        });
      };
      if (document.readyState !== "complete") {
        // wait to ensure that browser extensions are loaded
        const listener = () => {
          updateWallet();
          window.removeEventListener("load", listener);
        };
        window.addEventListener("load", listener);
      } else {
        updateWallet();
      }
    } else {
      // ShowMessage("error", "Sorry!", "Kindly install wallet extension");
      console.log("Kindly install wallet extension");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Disconnect Solona wallets
  const disconnectWallet = useCallback(() => {
    // setWalletState({ connected: false });

    localStorage.clear();

    const wallet = SolanaWeb3Class.solanaWeb3();
    walletUpdate({
      connected: false,
      chainId: null,
      providerUrl: "",
      publicKey: "",
    });
    wallet.disconnect();
    // sourceWalletUpdate({
    //   connected: false,
    //   publicKey: "",
    //   chainId: NetworkChainId.NO_CHAIN,
    // });
    // eslint-disable-next-line
  }, [wallet]);

  return { login, logout, SolonaWalletConnect, disconnectWallet };
};

export default useAuth;
