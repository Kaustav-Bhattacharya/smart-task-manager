import { Task } from "@/app/task-list/page";

export const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };
  
  export const getDistanceFromLatLngInKm = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };
  
  export const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      return permission === "granted";
    }
    return false;
  };
  
  let notifiedTasks = new Set<string>();

  export const notifyNearbyTasks = async (tasks: Task[]) => {
    try {
      const userLocation = await getUserLocation();
      const userLat = userLocation.coords.latitude;
      const userLng = userLocation.coords.longitude;

      const nearbyTasks = tasks.filter((task) => {
        if (task.lat && task.lng) {
          const distance = getDistanceFromLatLngInKm(
            userLat,
            userLng,
            task.lat,
            task.lng
          );
          const isUpcoming = new Date(task.dueDate) > new Date();
          return distance <= 5 && isUpcoming; // 5 km radius and upcoming
        }
        return false;
      });

      nearbyTasks.forEach((task) => {
        if (!notifiedTasks.has(task.id)) {
          new Notification(`Upcoming Task "${task.title}"!`);
          notifiedTasks.add(task.id);
        }
      });
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };
  
  export const startTaskNotificationService = (tasks: Task[]) => {
    const checkInterval = 60 * 60 * 1000; // Check every hour

    const checkNearbyTasks = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        await notifyNearbyTasks(tasks);
      }
    };

    checkNearbyTasks(); // Initial check
    setInterval(checkNearbyTasks, checkInterval); // Periodic checks
  };