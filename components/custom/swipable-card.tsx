"use client";
import { Task } from "@/app/page";
import { removeTask, toggleTaskCompletion } from "@/lib/redux/taskSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Pen, Trash } from "lucide-react";
import { Badge } from "@/components//ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import Link from "next/link";

interface SwipeableCardProps {
  task: Task;
  searchTerm: string;
}

export const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const SwipeableCard: React.FC<SwipeableCardProps> = ({ task }) => {
  const {toast} = useToast()
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
      variant:"destructive"
    })
  };

  const handleEdit = () => {
    router.push(`${task.id}`);
  };

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(task.id));
    const title = task.completed ? "Task Marked Incomplete.": "Task Marked Completed"
    toast({
      title,
    });
  };

  return (
    <Card {...handlers} className="relative z-10">
      <div
        className={cn(
          "bg-purple-300 rounded shadow-md p-4",
          {
            "bg-purple-100 text-gray-400": task.completed,
          },
          {
            "transition-all ease-in-out -translate-x-10": swiped,
            "transition-all ease-in-out translate-x-0 ": !swiped,
          }
        )}
      >
        <div className="flex items-center justify-between">
          <Link href={`/task-detail/${task.id}`}>
            <h2 className="text-xl font-bold flex items-center gap-3">
              {task.title}
              <Badge
                className={cn(`${getPriorityColor(task.priority)}`, {
                  "bg-gray-400 transition-colors": task.completed,
                })}
              >
                {task.priority}
              </Badge>
            </h2>
            <p
              className={cn("text-gray-500", {
                "text-gray-300": task.completed,
              })}
            >
              Due: {format(new Date(task.dueDate), 'EEEE, MMM dd, yyyy')}
            </p>
          </Link>
          <div className="flex items-center space-x-2">
            <Checkbox
              className="size-5 transition-all ease-in"
              onCheckedChange={handleToggleComplete}
              checked={task.completed}
            />
          </div>
        </div>
      </div>
      <div
        id={`task-options-${task.id}`}
        className="task-options absolute top-0 right-0 flex flex-col items-center"
      >
        <Button
          onClick={handleEdit}
          variant={"ghost"}
          className="hover:bg-transparent text-green-400 hover:text-green-400"
        >
          <Pen size={15} />
        </Button>
        <Button
          onClick={handleRemove}
          variant={"ghost"}
          className="hover:bg-transparent text-red-500 hover:text-red-500"
        >
          <Trash size={15} />
        </Button>
      </div>
    </Card>
  );
};

export default SwipeableCard;
