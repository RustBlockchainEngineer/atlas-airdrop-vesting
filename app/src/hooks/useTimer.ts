import { useState, useEffect } from "react";

export const useCurrentTime = () => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime());
  const [refreshTime, setRefreshTime] = useState(10);
  const [isStart, setStartTime] = useState<boolean>(false);  

  //Start Timer
  const startTimer = () => {
    setRefreshTime(10);
    setStartTime(true);
  };
  //Stop Timer
  const stopTimer = () => {
    setRefreshTime(10);
    setStartTime(false);
  };

  useEffect(() => {
    const tick = () => {
      setCurrentMillis((prevMillis) => prevMillis + 1000);
      if(isStart){
        setRefreshTime((prevTime) => prevTime - 1);
      } 
    };

    const timerID = setInterval(() => tick(), 1000);

    return () => clearInterval(timerID);
  }, [isStart]);

  return { currentMillis, refreshTime , startTimer , stopTimer };
};

export default useCurrentTime;
