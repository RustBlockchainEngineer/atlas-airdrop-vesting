import { Box, Flex } from "components/Box";
import { Text } from 'components/Text'
import { Link } from 'react-router-dom'
import styled from "styled-components";
import { SiDiscord, SiMedium, SiTwitter } from "react-icons/si";
import useTheme from "hooks/useTheme";

const Footer = () => {
  const { theme } = useTheme();
  const { text } = theme.colors;

  return (
    <FooterWrapper>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="10px 20px"
        width="96%"
        margin="0 auto"
        height="60px"
        className='footer-container'
      >
        <Box>
          <img src="./assets/images/logo.svg" alt="" />
        </Box>

        <Flex flex={2} justifyContent="center" className='footer-links' >
          <Link to='/' className='link' >
            <Text mx='16px' fontFamily='Montserrat SemiBold'>Getting Started with Atlas</Text>
          </Link>
          <Link to='/' className='link' >
            <Text mx='16px' fontFamily='Montserrat SemiBold'>Documentation</Text>
          </Link>
          <Link to='/' className='link' >
            <Text mx='16px' fontFamily='Montserrat SemiBold'>Trading on Atlas</Text>
          </Link>
          <Link to='/' className='link' >
            <Text mx='16px' fontFamily='Montserrat SemiBold'>Github</Text>
          </Link>
        </Flex>

        <Flex>
          <Flex>
            <SiDiscord color={text} size={26} className="mx-2 cursor-pointer" /> <Text fontFamily='SourceSansPro Light'>Discord</Text>
          </Flex>
          <Flex>
            <SiMedium color={text} size={26} className="mx-2 cursor-pointer" /> <Text fontFamily='SourceSansPro Light'>Medium</Text>
          </Flex>
          <Flex>
            <SiTwitter color={text} size={26} className="mx-2 cursor-pointer" /> <Text fontFamily='SourceSansPro Light'>Twitter</Text>
          </Flex>
        </Flex>
      </Flex>
    </FooterWrapper>
  );
};

const FooterWrapper = styled(Flex)`
  margin: 0 auto;
  border-top: solid 1px #182b3c;
  width: 100%;

  @media only screen and (max-width: 1200px) {

  .footer-container{
    flex-direction: column;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    margin-top:10px;
  }
  .link{
      margin: 0.5rem 0;
  }
}
`;
export default Footer;
