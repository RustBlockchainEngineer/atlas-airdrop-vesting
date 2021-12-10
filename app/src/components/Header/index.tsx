import { Link } from "react-router-dom";
import { Box, Flex } from "components/Box";
import { AiOutlineMenu } from "react-icons/ai";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { Navbar } from "react-bootstrap";
import useViewport from "hooks/useViewport";
import styled from "styled-components";
import useTheme from "hooks/useTheme";
import { useEffect, useState } from "react";
import { useWalletState } from "state/hooks";
import WalletModal from "./WalletModal";

const Header: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { width } = useViewport();
  const isMobile = width <= 990;
  const { theme } = useTheme();
  const { text } = theme.colors;

  const { connected, publicKey } = useWalletState();

  useEffect(() => {
    setVisible(false);
  }, [connected]);

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          padding: isMobile ? "10px" : "10px 70px",
          borderBottom: "solid 1px #182b3c",
        }}
      >
        <Navbar.Brand>
          <img src="./assets/images/logo.svg" alt="" height="40px" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <AiOutlineMenu color={text} size={22} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Flex
            flex={2}
            justifyContent="center"
            alignItems={isMobile ? "center" : ""}
            flexDirection={isMobile ? "column" : "row"}
          >
            <Box m="0 4% 0 1%" p="0px 16px">
              <Link style={{ textDecoration: "none" }} to="/">
                <Text
                  textTransform="uppercase"
                  fontFamily="Montserrat SemiBold"
                >
                  Home
                </Text>
              </Link>
            </Box>
            <Box
              m="0 4% 0 1%"
              p={isMobile ? "10px 16px" : "0px 16px"}
              borderRadius="8px"
            >
              <Link style={{ textDecoration: "none" }} to="/pools">
                <Text
                  textTransform="uppercase"
                  fontFamily="Montserrat SemiBold"
                >
                  Support
                </Text>
              </Link>
            </Box>
          </Flex>
          <Flex justifyContent="center" width={isMobile ? "100%" : "auto"}>
            <StyledButton
              onClick={() => {
                if (!connected) {
                  setVisible(true);
                }
              }}
            >
              {connected
                ? publicKey.slice(0, 4) + "..." + publicKey.slice(-4)
                : "Connect Wallet"}
            </StyledButton>
          </Flex>
        </Navbar.Collapse>
      </Navbar>

      <WalletModal visible={visible} setVisible={setVisible} />
    </>
  );
};

const StyledButton = styled(Button)`
  border: 6px solid;
  border-radius: 2px;
  border-image-slice: 1;
  background-color: #0d0d18;
  border-width: 1px;
  border-image-source: linear-gradient(115deg, #e2653d 0%, #403fd8 100%);
  font-family: "Montserrat SemiBold" !important;
  padding: 12px 25px;
`;

export default Header;
