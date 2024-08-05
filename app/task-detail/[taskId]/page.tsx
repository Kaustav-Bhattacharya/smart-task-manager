"use client";
import Header from "@/components/custom/header";
import { getPriorityColor } from "@/components/custom/swipable-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { RootState } from "@/lib/redux/store";
import { removeTask, toggleTaskCompletion } from "@/lib/redux/taskSlice";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Pen, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";

type Props = {};

const TaskDetail = (props: Props) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const taskId = params?.taskId;
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskToDisplay = tasks.find((task) => taskId === task.id);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if (taskToDisplay) {
      router.push(`/${taskToDisplay.id}`);
    }
  };

  const handleRemove = () => {
    if (taskToDisplay) {
      dispatch(removeTask(taskToDisplay.id));
      router.back();
      toast({
        title: "Task Removed.",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = () => {
    if (taskToDisplay) {
      dispatch(toggleTaskCompletion(taskToDisplay.id));
      const title = taskToDisplay.completed
        ? "Task Marked Incomplete."
        : "Task Marked Completed";
      toast({
        title,
      });
    }
  };

  if (!taskToDisplay) {
    // Redirect or display a message if the task does not exist
    router.push("/task-list"); // Redirect to a safe page
    return null;
  }

  return (
    <div className="container max-w-[768px]">
      <Header heading="Task Details" />
      <Card
        className={cn(
          "rounded shadow-md p-4 min-h-[60vh] bg-white dark:bg-gray-800",
          {
            "text-gray-600 dark:text-gray-400": taskToDisplay.completed,
          }
        )}
      >
        <h2 className="text-xl font-bold flex items-center gap-3 w-full justify-between mt-3 mb-1 text-gray-900 dark:text-gray-100">
          {taskToDisplay.title}
          <span className="flex gap-3 items-center">
            <Pen
              size={15}
              fill="true"
              onClick={handleEdit}
              className="cursor-pointer text-gray-900 dark:text-gray-100"
            />
            <Trash
              size={15}
              onClick={handleRemove}
              className="cursor-pointer text-red-500"
            />
          </span>
        </h2>
        <p className="font-light italic text-gray-700 dark:text-gray-300">
          {taskToDisplay.description}
        </p>
        <div className="flex items-center justify-between mt-8 flex-wrap space-y-4">
          <p className="font-medium italic text-sm flex items-center text-nowrap flex-wrap text-gray-700 dark:text-gray-300">
            Due:{" "}
            {format(
              new Date(taskToDisplay.dueDate || "2024-08-05T03:36:09.197Z"),
              "EEEE, MMM dd, yyyy"
            )}
            <Badge
              className={cn(
                `${getPriorityColor(
                  taskToDisplay.priority
                )} md:ml-4 mr-1 text-nowrap text-white`,
                {
                  "bg-gray-500 transition-colors": taskToDisplay.completed,
                }
              )}
            >
              {taskToDisplay.priority} on priority
            </Badge>
            <span className="text-nowrap hidden lg:block">(no pressure)*</span>
          </p>
          <p className="flex items-center gap-3 text-xs italic text-gray-600 dark:text-gray-400">
            Already completed?{" "}
            <Checkbox
              className="size-5 transition-all ease-in"
              onCheckedChange={handleToggleComplete}
              checked={taskToDisplay.completed}
            />
          </p>
        </div>
        {taskToDisplay.lat && taskToDisplay.lng && (
          <div className="mt-4">
            <MapContainer
              center={[taskToDisplay.lat, taskToDisplay.lng]}
              zoom={13}
              style={{ height: "300px", width: "100%", position: "relative" }}
              className="rounded-md"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[taskToDisplay.lat, taskToDisplay.lng]}
              />
            </MapContainer>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskDetail;
