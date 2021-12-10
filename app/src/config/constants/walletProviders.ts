import { NetworkChainId } from "./types";

import {
  PhantomWalletAdapter,
  SolflareExtensionWalletAdapter,
  SolletExtensionAdapter,
} from "../../wallet-adapters";

export const WALLET_PROVIDERS: any = {
  [NetworkChainId.SOLANA]: [
    {
      name: "Sollet Extension",
      url: "https://www.sollet.io/extension",
      icon: "./assets/images/sol.png",
      adapter: SolletExtensionAdapter as any,
    },
    {
      name: "Sollet.io",
      url: "https://www.sollet.io",
      icon: "./assets/images/sol.png",
    },
    {
      name: "Solflare",
      url: "https://solflare.com/access-wallet",
      icon: `https://pbs.twimg.com/profile_images/1420039600396029968/38WxnNNJ_400x400.png`,
    },
    {
      name: "Solflare Extension",
      url: "https://solflare.com",
      icon: `https://pbs.twimg.com/profile_images/1420039600396029968/38WxnNNJ_400x400.png`,
      adapter: SolflareExtensionWalletAdapter,
    },
    {
      name: "Phantom",
      url: "https://www.phantom.app",
      icon: `https://www.phantom.app/img/logo.png`,
      adapter: PhantomWalletAdapter,
    },
  ],
};
