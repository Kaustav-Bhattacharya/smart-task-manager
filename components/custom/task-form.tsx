import { taskFormSchema } from "@/lib/formSchema";
import { RootState } from "@/lib/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { addTask, updateTask } from "@/lib/redux/taskSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Header from "./header";

type Props = {
  taskId?: string; // Optional taskId for editing
};

const TaskForm = ({ taskId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const taskToEdit = tasks.find((task) => taskId === task.id);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      dueDate: taskToEdit ? new Date(taskToEdit.dueDate) : new Date(),
      priority: taskToEdit?.priority || "",
      location: taskToEdit?.location || "",
    },
  });

  const onSubmit = (data: z.infer<typeof taskFormSchema>) => {
    if (taskId) {
      dispatch(updateTask({ id: taskId, ...data }));
      toast({ title: "Task Updated." });
    } else {
      dispatch(addTask({ id: Date.now().toString(), ...data }));
      toast({ title: "Task Created." });
    }
    router.back();
  };

  return (
    <div className="container p-5 space-y-5 max-w-[768px]">
      <Header heading={taskId ? "Edit Task" : "Add Task"}/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Task..."
                    {...field}
                    className="rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="description..."
                    type="text"
                    {...field}
                    className="rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority level..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Input
                  placeholder="location..."
                  type="text"
                  {...field}
                  className="rounded-md"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              className="rounded-md"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
