import React from "react";
import TrafficGraph from "./TrafficGraph";
import Event from "./Event";
import Alarm from "./Alarm";
import PacketLoss from "./PacketLoss";
import Latency from "./Latency";
import Nav from "./Nav";

const Dashboard = () => {
  return (


    <div className="h-screen flex flex-col overflow-auto bg-black">
      <Nav />

      

      <div className="flex flex-grow p-3 gap-2">


        {/* Left part */}
        <div className="left flex flex-col w-3/4  gap-3  h-full p-2">

          <Event />
          <TrafficGraph />
        </div>

        {/* Right part */}

        <div className="right flex w-1/4 flex-col gap-3">


          <Alarm />
          <PacketLoss />
          <Latency />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
