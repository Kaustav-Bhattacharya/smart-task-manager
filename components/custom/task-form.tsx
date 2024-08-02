"use client";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Header from "./header";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

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

  const [mapOpen, setMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for user input feedback
  const mapRef = useRef(null);

  const searchLocation = async (query: string) => {
    setSearchQuery(query); // Update the search query as the user types

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/autocomplete",
        {
          params: {
            input: query,
            api_key: "B9LRU8nGhltYj1jXXjtzo5Ytdwx1bzt0JlRZFrKb",
          },
          headers: {
            "X-Request-Id": "64ba9a05-c37e-47c6-88d2-1170ce873f42",
          },
        }
      );

      setSearchResults(response.data.predictions);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  useEffect(() => {
    // Fix for missing marker icon
    //@ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    //@ts-ignore
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const handleSearchSelect = (result: any) => {
    const { lat, lng } = result.geometry.location;
    setMarkerPosition([lat, lng]);
    form.setValue("location", result.description);
    setSearchQuery(result.description);
    setMapOpen(false);
  };

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
    <div className="container p-5 space-y-5 max-w-[768px] scroll-auto">
      <Header heading={taskId ? "Edit Task" : "Add Task"} />
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
          <div className="flex flex-col lg:flex-row gap-5 items-center w-full justify-between">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="flex flex-col w-full mt-2">
                  <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
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
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search location..."
                      type="text"
                      {...field}
                      className="rounded-md"
                      value={searchQuery}
                      onChange={(e) => searchLocation(e.target.value)}
                      onFocus={() => setMapOpen(true)}
                    />
                    {mapOpen && searchResults.length > 0 && (
                      <ul className="absolute bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto w-full mt-1 z-20">
                        {searchResults.map((result) => (
                          <li
                            key={result.place_id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSearchSelect(result)}
                          >
                            {result.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mapOpen && (
            <div className="mt-4 relative overflow-hidden rounded-md shadow-md z-10">
              <MapContainer
                center={markerPosition || [51.505, -0.09]}
                zoom={13}
                style={{ height: "300px", width: "100%", position: "relative" }}
                className="rounded-md"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {markerPosition && <Marker position={markerPosition} />}
              </MapContainer>
            </div>
          )}

          <div className="flex w-full justify-end">
            <Button type="submit" className="rounded-md">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
