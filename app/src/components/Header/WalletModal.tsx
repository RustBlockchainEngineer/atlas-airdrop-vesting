import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { Box, Flex } from "components/Box";
import { Text } from "components/Text";
import useTheme from "hooks/useTheme";
import styled from "styled-components";
import { wallets } from 'config/constants/wallets'
import useAuth from "hooks/useAuth";
import { WALLET_PROVIDERS } from "config/constants/walletProviders";


function WalletModal({ visible, setVisible }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [searched, setSearched] = useState(WALLET_PROVIDERS[4]);

  const { SolonaWalletConnect } = useAuth()

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

      let newArr = result.map((e) => wallets[e]);

      return setSearched(newArr);
    }
  }


  return (
    <Modal show={visible} onHide={() => setVisible(false)} centered>
      <Modal.Body style={{ background: colors.backgroundGradient }}>
        <Flex alignItems="center">
          <Text fontFamily="Montserrat SemiBold" fontSize="18px">
            Connect Wallet(s)
          </Text>
          <AiOutlineClose
            onClick={() => setVisible(false)}
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
                onChange={(e: any) => search(e.target.value, wallets)}
              />
              <Box maxHeight="200px" overflowX="hidden">
                {searched.map((wallet, index) => (
                  <Flex
                    m="18px 0"
                    key={`${Date.now()}${index}`}
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                    onClick={async (e) => {
                      SolonaWalletConnect(wallet.url)
                    }}
                  >
                    <img
                      src={wallet.icon}
                      width="24px"
                      style={{
                        borderRadius: wallet.name === "Metamask" ? "0" : "50%",
                      }}
                      alt=""
                    />
                    <Text ml="10px" fontFamily="Montserrat SemiBold">
                      {wallet.name}
                    </Text>
                  </Flex>
                ))}
              </Box>
            </Flex>
          </Box>
        </Box>
      </Modal.Body>
    </Modal>
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

export default WalletModal;
