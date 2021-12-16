import { Text } from "components/Text";
import React, { useEffect } from "react";
import styled from "styled-components";
import useCurrentTime from "hooks/useTimer";
import { Flex } from "components/Box";
import { RiRefreshLine } from "react-icons/ri";

interface TimerProps {
  setIsRefresh: Function;
  isRefresh: boolean;
  isPriceLoading: boolean;
}

const TimerComponent: React.FC<TimerProps> = (props: TimerProps) => {
  const { setIsRefresh, isRefresh, isPriceLoading } = props;
  const { refreshTime, startTimer, stopTimer } = useCurrentTime();
  useEffect(() => {
    if (refreshTime === 0) {
      setIsRefresh(!isRefresh);
      startTimer();
    }
  }, [refreshTime]);
  useEffect(() => {
    if (isPriceLoading) {
      stopTimer();
    }else{
      startTimer();
    }
  }, [isPriceLoading]);
  
  return (
    <TimerWrapper>
      <Flex flexDirection="row" style={{ opacity: isPriceLoading ? 0.4 : 1, float: 'right' }}>
        <Text
          className="refresh-text"
          fontFamily="SourceSansPro Light"
          color="#F2F2F2"
        >
          Auto-refresh in
        </Text>
        <Text
          color="#14F195"
          fontFamily="SourceSansPro SemiBold"
          ml="4px"
          className="refresh-text"
        >
          {refreshTime}
        </Text>
        <Text
          className="refresh-text"
          mr="8px"
          fontFamily="SourceSansPro Light"
        >
          s
        </Text>

        <RiRefreshLine
          className={`icon cursor-pointer ${
            isPriceLoading ? "rotate-animate" : ""
          }`}
          color="#14F195"
          onClick={() => {
            setIsRefresh(!isRefresh);
            startTimer();
          }}
        />
      </Flex>
    </TimerWrapper>
  );
};

const TimerWrapper = styled.div`
  .refresh-text {
    font-size: 14px;
  }
  .icon {
    font-size: 18px;
  }

  @media screen and (max-width: 1440px), (max-height: 900px) {
    .refresh-text {
      font-size: 12px;
    }
    .icon {
      font-size: 15px;
    }
  }
`;

export default TimerComponent;
