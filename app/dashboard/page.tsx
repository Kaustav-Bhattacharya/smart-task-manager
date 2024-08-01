"use client";
import Header from "@/components/custom/header";
import { Card } from "@/components/ui/card";
import { RootState } from "@/lib/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Task } from "../page";
import { cn } from "@/lib/utils";

type Props = {};

const Dashboard = (props: Props) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <div className="container w-full">
      <Card>
        <Header heading="Dashboard" />
        <div className="grid lg:grid-cols-3 md:grid-cols-2 my-2 grid-cols-1">
          <PriorityBucket priority="High" tasks={tasks} className="md:col-span-2" />
          <PriorityBucket priority="Medium" tasks={tasks} />
          <PriorityBucket priority="Low" tasks={tasks} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 my-2">
          <StatusBucket status="completed" tasks={tasks} />
          <StatusBucket status="uncompleted" tasks={tasks} />
        </div>
      </Card>
    </div>
  );
};

const PriorityBucket = ({
  priority,
  tasks,
  className,
}: {
  priority: string;
  tasks: Task[];
  className?: string;
}) => {
  const filteredTasks = tasks.filter((task) => task.priority === priority);
  const priorityColor =
    priority === "High"
      ? "text-red-500"
      : priority === "Medium"
      ? "text-yellow-500"
      : "text-green-500";

  // Don't render the bucket if there are no tasks
  if (filteredTasks.length === 0) return null;

  return (
    <div className={cn("container border rounded-lg", className)}>
      <h1 className={cn("font-semibold text-xl", priorityColor)}>
        Priority: {priority}
      </h1>
      {filteredTasks.map((task) => (
        <h1 key={task.id}>{task.title}</h1>
      ))}
    </div>
  );
};

const StatusBucket = ({
  status,
  tasks,
}: {
  status: "completed" | "uncompleted";
  tasks: Task[];
}) => {
  const filteredTasks = tasks.filter((task) =>
    status === "completed" ? task.completed : !task.completed
  );
  const statusColor =
    status === "completed" ? "text-green-500" : "text-gray-500";

  // Don't render the bucket if there are no tasks
  if (filteredTasks.length === 0) return null;

  return (
    <div className="container border rounded-lg">
      <h1 className={cn("font-semibold text-xl", statusColor)}>
        {status === "completed" ? "Completed Tasks" : "Uncompleted Tasks"}
      </h1>
      {filteredTasks.map((task) => (
        <h1 key={task.id}>{task.title}</h1>
      ))}
    </div>
  );
};

export default Dashboard;
