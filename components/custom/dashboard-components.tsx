import { Task } from "@/app/task-list/page";
import { cn } from "@/lib/utils";
import SwipeableCard, { getPriorityColor } from "./swipable-card";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, CheckCircle, Circle, MapPin } from "lucide-react";

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
            ? "Go on! No completed tasks."
            : "Greate! No uncompleted tasks for now."}
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

const UpcomingTasks = ({ tasks }: { tasks: Task[] }) => {
  const upcomingTasks = tasks
    .filter((task) => new Date(task.dueDate) > new Date() && !task.completed)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

    if(upcomingTasks.length <= 0) {
      return (
        <>
          <h1 className="font-semibold text-xl text-blue-500 p-2 md:p-4">
            Upcoming Tasks
          </h1>
          <div className="font-semibold p-2 md:p-4">
            No upcoming tasks for now.
          </div>
        </>
      );
    }

  return (
    <div className="container border rounded-lg p-5">
      <h1 className="font-semibold text-xl text-blue-500 p-2 md:p-4">
        Upcoming Tasks
      </h1>
      <div className="p-2 flex gap-2 flex-col md:p-4">
        {upcomingTasks.map((task) => (
          <SwipeableCard className="z-0" key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const DashboardTaskCard = ({ task }: {task:Task}) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white dark:bg-gray-800">
      <CardHeader className="flex justify-between items-start p-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
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
        <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
        <div className="flex items-center">
          <MapPin size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{task.location}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          {task.completed ? (
            <CheckCircle size={20} className="text-green-500 mr-2" />
          ) : (
            <Circle size={20} className="text-gray-400 dark:text-gray-600 mr-2" />
          )}
          <span
            className={cn("text-sm text-gray-700", {
              "text-green-500": task.completed,
              "dark:text-green-400": task.completed,
              "dark:text-gray-300": !task.completed,
            })}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};


export { PriorityBucket, StatusBucket, DashboardTaskCard, UpcomingTasks };
