import React, { useState } from "react";
import { Flex, Box } from "components/Box";
import { Text } from "components/Text";
import { Button } from "components/Button";
import useTheme from "hooks/useTheme";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Home: React.FC = () => {
  const { theme } = useTheme();
  const {
    backgroundAlt,
    backgroundGradient,
    textSubtle,
    failure,
  } = theme.colors;

  const [connected, setConnected] = useState(false);
  const claim = async () =>{
    
  }
  const rowJSX = (text_1, text_2) => (
    <Flex mt="0.5rem">
      <Text fontFamily="SourceSansPro Light" color={textSubtle}>
        {text_1}
      </Text>
      <Text ml="auto" fontFamily="SourceSansPro Light" color={textSubtle}>
        {text_2}
      </Text>
    </Flex>
  );

  const labels = ["Total", "Claimed", "Locked", "", "", "", "", ""];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [5, 3, 9],
        backgroundColor: "#80ECFF",
        maxBarThickness: 20,
        borderRadius: 4,
      },
    ],
  };

  return (
    <Flex
      flexDirection="column"
      mr={["8px", 0]}
      height="calc(100vh - 60px - 80px)"
      minHeight='590px'
    >
      <Flex
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        m="0 auto"
        width="94%"
        maxWidth="500px"
        background={backgroundAlt}
        p="1px"
        mt="1rem"

      >
        <Box height='100%' p="14px" width="100%" background={backgroundGradient}>
          <Text fontFamily="Montserrat Bold" fontSize="16px">
            Vesting
          </Text>

          {connected ? (
            <>
              <Box mt="10px">
                {rowJSX("Initial Locked Tokens", 1000)}
                {rowJSX("Vesting Start Date", "19.05.18")}
                {rowJSX("Vesting End Date", "19.06.18")}
                {rowJSX("Claimed Tokens", 1000)}
                {rowJSX("Available Tokens", 1000)}
                {rowJSX("Locked Tokens", 300)}
              </Box>

              <Flex mt="0.6rem" justifyContent="center" alignItems="center">
                <Bar options={options} data={data} />
              </Flex>
              <Flex justifyContent="center" alignItems="center" mt="1rem">
                <ButtonQuote onClick={() => claim()}>Claim</ButtonQuote>
              </Flex>
            </>
          ) : (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="500px"
            >
              <Box
                background={failure}
                borderRadius="8px"
                p="14px"
                width="fit-content"
              >
                <AiOutlineInfoCircle size={22} />
              </Box>
              <Text color={failure} fontFamily="SourceSansPro Light" mt="4px">
                Please connect your wallet to see your claim status
              </Text>
              <StyledButton onClick={() => setConnected(true)}>
                Connect Wallet
              </StyledButton>
            </Flex>
          )}
        </Box>
      </Flex>

    </Flex>
  );
};

const ButtonQuote = styled(Button)`
  border-radius: 2px;
  background: linear-gradient(106deg, #e2653d 0%, #403fd8 100%);
  width: 98%;
  margin: 0 auto;
  font-family: "SourceSansPro SemiBold";
`;

const StyledButton = styled(Button)`
  border: 6px solid;
  border-radius: 2px;
  border-image-slice: 1;
  background-color: #0d0d18;
  border-width: 1px;
  border-image-source: linear-gradient(115deg, #e2653d 0%, #403fd8 100%);
  font-family: "Montserrat SemiBold" !important;
  padding: 12px 25px;
  margin-top: 1rem;
`;

export default Home;
