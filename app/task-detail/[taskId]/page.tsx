//@ts-nocheck

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
    router.push(`/${taskToDisplay?.id}`);
  };

  const handleRemove = () => {
    dispatch(removeTask(taskToDisplay?.id));
    toast({
      title: "Task Removed.",
      variant: "destructive",
    });
  };

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(taskToDisplay.id));
    const title = taskToDisplay?.completed ? "Task Marked Incomplete.": "Task Marked Completed"
    toast({
      title,
    });
  };


  return (
    <div className="container max-w-[768px]">
      <Header heading="Task Details" />
      <Card
        className={cn("bg-purple-300 rounded shadow-md p-4 min-h-[60vh]", {
          "text-gray-600": taskToDisplay?.completed,
        })}
      >
        <h2 className="text-xl font-bold flex items-center gap-3 w-full justify-between mt-3 mb-1">
          {taskToDisplay?.title}
          <span className="flex gap-3 items-center">
            <Pen
              size={15}
              fill="true"
              onClick={handleEdit}
              className="cursor-pointer"
            />
            <Trash
              size={15}
              onClick={handleRemove}
              className="cursor-pointer text-red-500"
            />
          </span>
        </h2>
        <p className="font-light italic">{taskToDisplay?.description}</p>
        <div className="flex items-center justify-between mt-8 flex-wrap space-y-4">
          <p className="font-medium italic text-sm text-gray-600 flex items-center text-nowrap flex-wrap">
            Due: {format(new Date(taskToDisplay.dueDate), "EEEE, MMM dd, yyyy")}
            <Badge
              className={cn(
                `${getPriorityColor(taskToDisplay?.priority)} md:ml-4 mr-1 text-nowrap`,
                {
                  "bg-gray-400 transition-colors": taskToDisplay?.completed,
                }
              )}
            >
              {taskToDisplay?.priority} on priority
            </Badge>
            <span className="text-nowrap hidden lg:block">(no pressure)*</span>
          </p>
          <p className="flex items-center gap-3 text-xs italic text-gray-500">
            Already completed?{" "}
            <Checkbox
              className="size-5 transition-all ease-in"
              onCheckedChange={handleToggleComplete}
              checked={taskToDisplay?.completed}
            />
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetail;
