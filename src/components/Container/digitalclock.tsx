"use client";
import { useEffect, useState } from "react";

interface ClockProps {
  format12Hour?: boolean;
}

const Clock: React.FC<ClockProps> = ({ format12Hour = true }) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";

      if (format12Hour) {
        hours = hours % 12 || 12;
      }

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(now.getMinutes()).padStart(
        2,
        "0",
      )}:${String(now.getSeconds()).padStart(2, "0")}${format12Hour ? ` ${ampm}` : ""}`;
      setCurrentTime(formattedTime);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [format12Hour]);

  return <div>{currentTime}</div>;
};

export default Clock;
