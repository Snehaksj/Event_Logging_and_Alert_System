import React from "react";
import TrafficGraph from "./TrafficGraph";
import Event from "./Event";
import Alarm from "./Alarm";
import PacketLoss from "./PacketLoss";
import Latency from "./Latency";
import Nav from "./Nav";

const Dashboard = () => {
  return (
    <div className="h-screen">
      <Nav />
      <div className="flex p-4 gap-2 ">
        {/* Left part */}
        <div className="left flex flex-col w-3/4 border h-full">
          <Event />
          <TrafficGraph />
        </div>

        {/* Right part */}
        <div className="right flex w-1/4 border flex-col">
          <Alarm />
          <PacketLoss />
          <Latency />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
