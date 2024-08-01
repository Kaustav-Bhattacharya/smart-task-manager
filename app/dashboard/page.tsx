"use client";
import { DashBarChart, DashLineChart, DashPieChart } from "@/components/custom/dashboard-charts";
import { PriorityBucket, StatusBucket, UpcomingTasks } from "@/components/custom/dashboard-components";
import Header from "@/components/custom/header";
import { RootState } from "@/lib/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  if (tasks.length <= 0) {
    return (
      <div className="container w-full">
        <Header heading="Dashboard" />
        <div className="font-semibold text-xl p-5">Start by adding tasks.</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Header heading="Dashboard" />
      <div className="overflow-auto h-[calc(100vh-150px)] md:h-[calc(100vh-140px)]">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 p-5">
          <div className="col-span-1">
          <DashLineChart/>
          </div>
          <div className="col-span-1">
          <DashPieChart/>
          </div>
          <div className="col-span-1">
          <DashBarChart/>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 p-5">
          <PriorityBucket
            priority="High"
            tasks={tasks}
            className="md:col-span-2 lg:col-span-1"
          />
          <PriorityBucket priority="Medium" tasks={tasks} />
          <PriorityBucket priority="Low" tasks={tasks} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          <StatusBucket status="completed" tasks={tasks} />
          <StatusBucket status="uncompleted" tasks={tasks} />
        </div>
        <div className="p-5">
          <UpcomingTasks tasks={tasks} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
