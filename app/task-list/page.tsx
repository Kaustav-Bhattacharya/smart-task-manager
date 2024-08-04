"use client";
import useDebounce from "@/lib/hooks/useDebouce";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import SwipeableCard from "@/components/custom/swipable-card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { startTaskNotificationService } from "@/lib/locationNotifications";

export type Task = {
  description: string;
  dueDate: Date;
  id: string;
  title: string;
  priority: string;
  completed?: boolean;
  location: string;
  lat?: number; // Optional latitude
  lng?: number; // Optional longitude
};

const Home: React.FC = () => {
  const router = useRouter();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    .sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));

  const handleAddTask = () => {
    router.push(`/new-task`);
  };

  useEffect(() => {
    startTaskNotificationService(tasks);
  }, [tasks]);

  if (tasks.length <= 0) {
    return (
      <div className="container w-full">
        <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between sticky">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
          <Input
            type="text"
            placeholder="Search tasks..."
            className="border rounded p-2 w-[50%] lg:w-[30%] dark:bg-gray-800 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>
        <div className="font-semibold text-xl p-5 text-gray-900 dark:text-gray-100">
          Start by adding tasks.
        </div>
        <Button
          onClick={handleAddTask}
          className="fixed bottom-10 right-14 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 active:shadow-none active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-10"
        >
          <Plus size={26} />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between sticky">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
        <Input
          type="text"
          placeholder="Search tasks..."
          className="border rounded p-2 w-[50%] lg:w-[30%] dark:bg-gray-800 dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <div className="p-4">
        <div className="space-y-4 overflow-auto h-[calc(100vh-210px)] md:h-[calc(100vh-180px)]">
          {filteredTasks.map((task) => (
            <SwipeableCard
              key={task.id}
              task={task}
            />
          ))}
        </div>
        <Button
          onClick={handleAddTask}
          className="fixed bottom-14 md:bottom-10 right-1 md:right-5 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 active:shadow-none active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-10"
        >
          <Plus size={26} />
        </Button>
      </div>
    </div>
  );
};

export default Home;
