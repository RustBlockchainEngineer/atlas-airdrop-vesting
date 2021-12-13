import { WALLET_PROVIDERS } from "config/constants/walletProviders";
import { useCallback, useState } from "react";

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
 
export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
}

