import type { PublicKey } from '@solana/web3.js';

import Wallet from '@project-serum/sol-wallet-adapter';
import { Transaction } from '@solana/web3.js';
import { Button, Modal, Form } from 'react-bootstrap';
import EventEmitter from 'eventemitter3';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { Box, Flex } from "components/Box";
import { Text } from "components/Text";
import { notify } from './../utils/notifications';
import styled from "styled-components";
import { useConnectionConfig } from './connection';
import { useLocalStorageState } from './../utils/utils';
import { LedgerWalletAdapter } from '../wallet-adapters/ledger';
import { SolongWalletAdapter } from '../wallet-adapters/solong';
import { PhantomWalletAdapter } from '../wallet-adapters/phantom';
import useTheme from "hooks/useTheme";

const ASSETS_URL = 'https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/';
export const WALLET_PROVIDERS = [
  {
    name: 'Sollet',
    url: 'https://www.sollet.io',
    icon: `${ASSETS_URL}sollet.svg`,
  },
  {
    name: 'Solong',
    url: 'https://solongwallet.com',
    icon: `${ASSETS_URL}solong.png`,
    adapter: SolongWalletAdapter,
  },
  {
    name: 'Solflare',
    url: 'https://solflare.com/access-wallet',
    icon: `${ASSETS_URL}solflare.svg`,
  },
  {
    name: 'MathWallet',
    url: 'https://mathwallet.org',
    icon: `${ASSETS_URL}mathwallet.svg`,
  },
  {
    name: 'Ledger',
    url: 'https://www.ledger.com',
    icon: `${ASSETS_URL}ledger.svg`,
    adapter: LedgerWalletAdapter,
  },
  {
    name: 'Phantom',
    url: 'https://phantom.app/',
    icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
    adapter: PhantomWalletAdapter,
  },
];

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

const WalletContext = React.createContext<{
  wallet: WalletAdapter | undefined;
  connected: boolean;
  select: () => void;
  provider: typeof WALLET_PROVIDERS[number] | undefined;
}>({
  wallet: undefined,
  connected: false,
  select() {},
  provider: undefined,
});

export function WalletProvider({ children = null as any }) {
  const { endpoint } = useConnectionConfig();
  const { theme } = useTheme();
  const { colors } = theme;
  const [autoConnect, setAutoConnect] = useLocalStorageState('autoConnect');
  const [providerUrl, setProviderUrl] = useLocalStorageState('walletProvider');

  const provider = useMemo(() => WALLET_PROVIDERS.find(({ url }) => url === providerUrl), [providerUrl]);

  const wallet = useMemo(
    function () {
      if (provider) {
        return new (provider.adapter || Wallet)(providerUrl, endpoint) as WalletAdapter;
      }
    },
    [provider, providerUrl, endpoint]
  );

  const [connected, setConnected] = useState(false);
  const [searched, setSearched] = useState(WALLET_PROVIDERS);
  function search(str, strArray) {
    let result = [];
    for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].name.toLocaleLowerCase().indexOf(str.toLocaleLowerCase()) > -1) {
        console.log(strArray[j].symbol);
        result.push(j);
      }
    }
    if (result.length > 0) {
      console.log(result);

      let newArr = result.map((e) => WALLET_PROVIDERS[e]);

      return setSearched(newArr);
    }
  }

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        if (wallet.publicKey) {
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length
                )}`
              : walletPublicKey;

          notify({
            message: 'Wallet update',
            description: `Connected to wallet ${keyToDisplay}`,
          });
        }
      });

      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
      });
    }

    return () => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    return () => {};
  }, [wallet, autoConnect]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => setIsModalVisible(true), []);
  const close = useCallback(() => setIsModalVisible(false), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        select,
        provider,
      }}
    >
      {children}
      <Modal
        show={isModalVisible}
        onHide={close}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ background: colors.backgroundGradient }}>
          <Flex alignItems="center">
            <Text fontFamily="Montserrat SemiBold" fontSize="18px">
              Connect Wallet(s)
            </Text>
            <AiOutlineClose
              onClick={() => setIsModalVisible(false)}
              color={colors.text}
              size={20}
              className="ms-auto"
            />
          </Flex>
          <Box>
          <Box p="20px">
            <Flex justifyContent="center" flexDirection="column">
            <InputFiled
                placeholder="Search"
                onChange={(e: any) => search(e.target.value, WALLET_PROVIDERS)}
              />
              <Box maxHeight="200px" overflowX="hidden">
                {searched.map((provider, index) => {
                  const onClick = function () {
                    setProviderUrl(provider.url);
                    setAutoConnect(true);
                    close();
                  };
                  return(
                  <Flex
                    m="18px 0"
                    key={`${Date.now()}${index}`}
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                    onClick={onClick}
                  >
                    <img
                      src={provider.icon}
                      width="24px"
                      style={{
                        borderRadius: provider.name === "Metamask" ? "0" : "50%",
                      }}
                      alt=""
                    />
                    <Text ml="10px" fontFamily="Montserrat SemiBold">
                      {provider.name}
                    </Text>
                  </Flex>
                  )
                })}
              </Box>
            </Flex>
          </Box>
        </Box>
        </Modal.Body>
      </Modal>
    </WalletContext.Provider>
  );
}

const InputFiled = styled(Form.Control)`
  border-radius: 8px;
  margin: 10px 0;
  padding: 8px 20px;
  background: #00000033;
  font-family: "SourceSansPro Light";
  color: white !important;
  width: 80%;
  border: solid 1px ${({ theme }) => theme.colors.secondary};
  &:focus {
    background: #00000033;
    border: solid 1px ${({ theme }) => theme.colors.primary};
  }
`;

export function useWallet() {
  const { wallet, connected, provider, select } = useContext(WalletContext);
  return {
    wallet,
    connected,
    provider,
    select,
    publicKey: wallet?.publicKey,
    connect() {
      // wallet ? wallet.connect() :
      select();
    },
    disconnect() {
      wallet?.disconnect();
    },
  };
}
