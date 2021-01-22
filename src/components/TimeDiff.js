import React, { useEffect, useState } from "react";
import Format from "../utils/formats";

const TimeDiff = (props) => {
  const [diff, setDiff] = useState("");

  useEffect(() => {
    update();
    setInterval(update, 1000);
  }, []);

  const update = () => {
    setDiff(Format.diff(props.date));
  };

  return <>{diff}</>;
};

export default TimeDiff;
