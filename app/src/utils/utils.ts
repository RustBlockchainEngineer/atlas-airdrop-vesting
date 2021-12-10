import { WALLET_PROVIDERS } from "config/constants/walletProviders";

/**
 * This return wallet provider object
 * @param providerUrl
 * @returns
 */
export const getProvider = (providerUrl: string, chainId: number) => {
  const provider = WALLET_PROVIDERS[chainId].find(
    ({ url }) => url === providerUrl,
  );
  console.log(provider);
  return provider;
};
