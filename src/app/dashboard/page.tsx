import DashboardMain from "@/components/dashboard/DashboardMain";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex w-screen min-h-screen flex-col justify-center items-center p-24">
      <DashboardMain />
    </div>
  );
};

export default Dashboard;
