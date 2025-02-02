"use client";

import { removeTask, toggleTaskCompletion } from "@/lib/redux/taskSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Pen, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { Task } from "@/app/task-list/page";

interface SwipeableCardProps {
  task: Task;
  className?: string;
}

export const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "High":
      return "bg-red-500 text-white dark:bg-red-600";
    case "Medium":
      return "bg-yellow-500 text-white dark:bg-yellow-600";
    case "Low":
      return "bg-green-500 text-white dark:bg-green-600";
    default:
      return "bg-gray-500 text-white dark:bg-gray-600";
  }
};

const SwipeableCard: React.FC<SwipeableCardProps> = ({ task, className }) => {
  const { toast } = useToast();
  const [swiped, setSwiped] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwiped(true);
      document
        .getElementById(`task-options-${task.id}`)
        ?.classList.add("visible");
    },
    onTap: () => {
      setSwiped(false);
      document
        .getElementById(`task-options-${task.id}`)
        ?.classList.remove("visible");
    },
    onSwipedRight: () => {
      setSwiped(false);
      document
        .getElementById(`task-options-${task.id}`)
        ?.classList.remove("visible");
    },
    trackMouse: true,
  });

  const handleRemove = () => {
    dispatch(removeTask(task.id));
    toast({
      title: "Task Removed.",
      variant: "destructive",
    });
  };

  const handleEdit = () => {
    router.push(`${task.id}`);
  };

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(task.id));
    const title = task.completed
      ? "Task Marked Incomplete."
      : "Task Marked Completed";
    toast({
      title,
    });
  };

  return (
    <Card
      {...handlers}
      className={cn(
        "relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white dark:bg-gray-800",
        className
      )}
    >
      <div
        className={cn(
          "p-4 rounded-lg transition-transform duration-300 ease-in-out",
          {
            "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500": task.completed,
            "bg-gray-50 dark:bg-gray-900": !task.completed,
            "transform -translate-x-10": swiped,
            "transform translate-x-0": !swiped,
          }
        )}
      >
        <div className="flex items-center justify-between">
          <Link href={`/task-detail/${task.id}`}>
            <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-900 dark:text-gray-100">
              {task.title}
              <Badge
                className={cn(
                  "px-2 py-1 rounded-full",
                  getPriorityColor(task.priority),
                  {
                    "bg-gray-400 text-gray-100": task.completed,
                    "dark:bg-gray-500 dark:text-gray-200": task.completed,
                  }
                )}
              >
                {task.priority}
              </Badge>
            </h2>
            <p
              className={cn("text-gray-600 text-sm", {
                "text-gray-500 dark:text-gray-400": task.completed,
              })}
            >
              Due: {format(new Date(task.dueDate), "MMMM dd, yyyy")}
            </p>
          </Link>
          <Checkbox
            className="ml-4 transition-transform duration-200 ease-in-out"
            onCheckedChange={handleToggleComplete}
            checked={task.completed}
          />
        </div>
      </div>
      <div
        id={`task-options-${task.id}`}
        className="task-options absolute top-0 right-0 flex flex-col items-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
      >
        <Button
          onClick={handleEdit}
          variant="ghost"
          className="text-blue-500 hover:bg-transparent hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
        >
          <Pen size={15} />
        </Button>
        <Button
          onClick={handleRemove}
          variant="ghost"
          className="text-red-500 hover:bg-transparent hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
        >
          <Trash size={15} />
        </Button>
      </div>
    </Card>
  );
};

export default SwipeableCard;
