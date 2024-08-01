"use client";
import Header from "@/components/custom/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RootState } from "@/lib/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Task } from "../page";
import { cn } from "@/lib/utils";
import { getPriorityColor } from "@/components/custom/swipable-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Circle, MapPin } from "lucide-react";

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
  const upcomingTasks = tasks
    .filter((task) => new Date(task.dueDate) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  return (
    <div className="w-full">
      <Header heading="Dashboard" />
      <div className="overflow-auto h-[calc(100vh-150px)] md:h-[calc(100vh-140px)]">
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
          <div className="container border rounded-lg p-5">
            <h1 className="font-semibold text-xl text-blue-500 p-2 md:p-4">
              Upcoming Tasks
            </h1>
            <div className="p-2 flex gap-2 flex-col md:p-4">
              {upcomingTasks.map((task) => (
                <DashboardTaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
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

  if (filteredTasks.length === 0)
    return (
      <div className={cn("container border rounded-lg p-0", className)}>
        <h1 className={cn("font-semibold text-xl p-2 md:p-4", priorityColor)}>
          Priority: {priority}
        </h1>
        <div className="p-2 md:p-4">No Tasks Yet.</div>
      </div>
    );

  return (
    <div className={cn("container border rounded-lg p-0", className)}>
      <h1 className={cn("font-semibold text-xl p-2 md:p-4", priorityColor)}>
        Priority: {priority}
      </h1>
      <div className="p-2 flex gap-2 flex-col md:p-4">
        {filteredTasks.map((task) => (
          <DashboardTaskCard key={task.id} task={task} />
        ))}
      </div>
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

  if (filteredTasks.length === 0)
    return (
      <div className="container border rounded-lg p-0">
        <h1 className={cn("font-semibold text-xl p-2 md:p-4", statusColor)}>
          {status === "completed" ? "Completed Tasks" : "Uncompleted Tasks"}
        </h1>
        <div className="p-2 md:p-4 text-center font-semibold">
          {status === "completed"
            ? "No Completed Tasks."
            : "No Uncompleted Tasks."}
        </div>
      </div>
    );

  return (
    <div className="container border rounded-lg p-0">
      <h1 className={cn("font-semibold text-xl p-2 md:p-4", statusColor)}>
        {status === "completed" ? "Completed Tasks" : "Uncompleted Tasks"}
      </h1>
      <div className="p-2 flex gap-2 flex-col md:p-4">
        {filteredTasks.map((task) => (
          <DashboardTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const DashboardTaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white">
      <CardHeader className="flex justify-between items-start p-4">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <Badge
          className={cn(
            "px-2 py-1 rounded-full",
            getPriorityColor(task.priority)
          )}
        >
          {task.priority}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-1">
        <p className="text-gray-700">{task.description}</p>
        <div className="flex items-center">
          <MapPin size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">{task.location}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          {task.completed ? (
            <CheckCircle size={20} className="text-green-500 mr-2" />
          ) : (
            <Circle size={20} className="text-gray-400 mr-2" />
          )}
          <span
            className={cn("text-sm text-gray-700", {
              "text-green-500": task.completed,
            })}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
