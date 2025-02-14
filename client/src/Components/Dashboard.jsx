import React from "react";
import TrafficGraph from "./TrafficGraph";
import Event from "./Event";
import Alarm from "./Alarm";
import PacketLoss from "./PacketLoss";
import Latency from "./Latency";
import Nav from "./Nav";

const Dashboard = () => {
  return (
    <div className="h-screen overflow-auto bg-black">
      <Nav />
      <div className="flex p-3 gap-2 h-full">
        {/* Left part */}
        <div className="left flex flex-col w-3/4 gap-2 h-full">
          <Event />
          <TrafficGraph />
        </div>

        {/* Right part */}
        <div className="right flex w-1/4 flex-col">
          <Alarm />
          <PacketLoss />
          <Latency />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
