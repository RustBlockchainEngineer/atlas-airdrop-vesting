import React, { useEffect, useState } from "react";
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
import { useWallet } from "contexts/wallet";
import { claimVesting, getVesting } from "utils/claim";
import { useConnection } from "contexts/connection";
import { VESTING_TOKEN_DECIMALS } from "utils/global";
import { showMessage } from "utils/notifications";
import TimerComponent from "./components/TimerWrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Home: React.FC = () => {
  const connection = useConnection();
  const { connect, connected, wallet } = useWallet();
  const { theme } = useTheme();
  const {
    backgroundAlt,
    backgroundGradient,
    textSubtle,
    failure,
  } = theme.colors;
  const [vesting, setVesting] = useState(null as any);

  const [isRefresh, setIsRefresh] = useState(false);
  const [isPriceLoading, setPriceLoading] = useState(true);

  const [vestingStartDate, setVestingStartDate] = useState('');
  const [vestingEndDate, setVestingEndDate] = useState('');
  const [initialLockedToken, setInitialLockedToken] = useState('0');
  const [claimedTokens, setClaimedTokens] = useState('0');
  const [lockedTokens, setLockedTokens] = useState(0);
  const [availableTokens, setAvailableTokens] = useState('0');

  useEffect(() => {
    fetchVesting();
  }, [connected]);

  const fetchVesting = () => {
    try {
      console.log('Called');
      setPriceLoading(true);
      getVesting(connection, wallet)
        .then((fetchedVesting) => {
          setVesting(fetchedVesting);
          setTimeout(() => {
            setVestingStartDate(getVestingStartDate());
            setVestingEndDate(getVestingEndDate());
            setInitialLockedToken(getInitialLockedTokens());
            setClaimedTokens(getClaimedTokens());
            setAvailableTokens(getAvailableTokens());
            setLockedTokens(getLockedTokens());
            setPriceLoading(false);
          }, 1000);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchVesting();
  }, [
    isRefresh
  ]);

  const claim = async () => {
    try {
      await claimVesting(connection, wallet);

      getVesting(connection, wallet)
        .then((fetchedVesting) => {
          setVesting(fetchedVesting);
          showMessage({ description: 'Claim Complete', type: 'success' });
        })
        .catch((err) => {
          showMessage({ description: 'Error', type: 'error' });
        });
    } catch (error) {
      showMessage({ description: 'Error', type: 'error' });
    }
  }
  const getVestingStartDate = () => {
    if (vesting) {
      const startTimestamp = vesting.startTime.toNumber();
      const startDate = new Date(startTimestamp * 1000);
      return startDate.toDateString();
    } else {
      return '-'
    }
  }
  const getVestingEndDate = () => {
    if (vesting) {
      const endTimestamp = vesting.endTime.toNumber();
      const endDate = new Date(endTimestamp * 1000);
      return endDate.toDateString();
    } else {
      return '-';
    }
  }
  const getInitialLockedTokens = () => {
    if (vesting) {
      const vestedTokenAmount = vesting.vestedTokenAmount.toNumber();
      return ( vestedTokenAmount / Math.pow(10, VESTING_TOKEN_DECIMALS)).toFixed(2);
    } else {
      return '0';
    }
  }
  const getClaimedTokens = () => {
    if (vesting) {
      const claimedTokenAmount = vesting.claimedTokenAmount.toNumber();
      return ( claimedTokenAmount / Math.pow(10, VESTING_TOKEN_DECIMALS)).toFixed(2);
    } else {
      return '0';
    }
  }
  const getAvailableTokens = () => {
    if (vesting) {
      let pendingDuration = 0;
      const currentTime = Date.now() / 1000;
      if (currentTime > vesting.endTime.toNumber()) {
          pendingDuration = vesting.endTime.toNumber() - vesting.lastTime.toNumber();
      }
      else if (currentTime > vesting.lastTime.toNumber()) {
        pendingDuration = currentTime - vesting.lastTime.toNumber();
      }

      let remainedDuration = 0;
      if (vesting.lastTime.toNumber() <= vesting.endTime.toNumber() && vesting.lastTime.toNumber() >= vesting.startTime.toNumber()) {
        remainedDuration = vesting.endTime.toNumber() - vesting.lastTime.toNumber();
      }
      let remainedAmount = vesting.vestedTokenAmount.toNumber() - vesting.claimedTokenAmount.toNumber();
      let pending = remainedAmount * pendingDuration / remainedDuration;

      return (pending/ Math.pow(10, VESTING_TOKEN_DECIMALS)).toFixed(4);
    } else {
      return '0';
    }
    
  }
  const getLockedTokens = () => {
    if (vesting) {
      const vestedTokenAmount = getInitialLockedTokens();
      const availableTokenAmount = getAvailableTokens();
      const claimedTokenAmount = getClaimedTokens();
      return parseFloat(vestedTokenAmount) - parseFloat(availableTokenAmount) - parseFloat(claimedTokenAmount);
    } else {
      return 0;
    }
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
          {
            connected ? (
              <>
                <TimerComponent setIsRefresh={setIsRefresh} isRefresh={isRefresh} isPriceLoading={isPriceLoading}/>
              </>
            ) : ''
          }
          <Text fontFamily="Montserrat Bold" fontSize="16px">
            Vesting
          </Text>

          {connected ? (
            <>
              <Box mt="10px">
                {rowJSX("Initial Locked Tokens", initialLockedToken)}
                {rowJSX("Vesting Start Date", vestingStartDate)}
                {rowJSX("Vesting End Date", vestingEndDate)}
                {rowJSX("Claimed Tokens", claimedTokens)}
                {rowJSX("Available Tokens", availableTokens)}
                {rowJSX("Locked Tokens", lockedTokens)}
              </Box>

              {/* <Flex mt="0.6rem" justifyContent="center" alignItems="center">
                <Bar options={options} data={data} />
              </Flex> */}
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
