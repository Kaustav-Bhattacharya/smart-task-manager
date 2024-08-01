'use client';
import TaskForm from '@/components/custom/task-form';
import { useParams } from 'next/navigation';

const TaskPage = () => {
  const params = useParams();
  const taskId = params?.taskId;
console.log(taskId);
  // `taskId` will be 'new-task' when adding a task, so we'll pass undefined to TaskForm in that case
  const isNewTask = taskId === 'new-task';

  return <TaskForm taskId={isNewTask ? undefined : taskId as string} />;
};

export default TaskPage;
