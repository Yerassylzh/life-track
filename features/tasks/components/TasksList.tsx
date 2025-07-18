import { addDaystoDate, dateToYMD, YMDToDate } from "@/lib/date";
import { useMemo } from "react";
import { useTasks } from "../context/TasksContext";
import { markTaskAsCompleted, markTaskAsUncompleted } from "../lib/update";
import NoTasks from "./NoTasks";
import TaskBox from "./TaskBox";

type TasksDateType = { date: Date } | { showUpcoming: boolean };
type DisplayType =
  | { displayCompleted: boolean }
  | { displayUncompleted: boolean }
  | { displayAllTasks: boolean };

export type TasksProps = {
  hasLabel?: boolean;
  displayBottomBorderForAll?: boolean;
} & TasksDateType &
  DisplayType;

export default function TasksList(props: TasksProps) {
  const { tasks } = useTasks();

  const tasksToDisplay = useMemo(() => {
    let filteredTasks;
    if ("date" in props) {
      filteredTasks = tasks.filter(
        (task) => dateToYMD(props.date) === dateToYMD(task.targetDate)
      );
    } else {
      const todayStartDate = YMDToDate(dateToYMD(new Date()));
      const yesterdayStartDate = addDaystoDate(todayStartDate, 1);
      filteredTasks = tasks.filter(
        (task) => yesterdayStartDate <= task.targetDate
      );
    }

    if ("displayAllTasks" in props) {
      return filteredTasks.sort(
        (a, b) => (a.completedAt ? 1 : -1) - (b.completedAt ? 1 : -1)
      );
    } else if ("displayCompleted" in props) {
      return filteredTasks.filter((task) => task.completedAt !== null);
    } else if ("displayUncompleted" in props) {
      return filteredTasks.filter((task) => task.completedAt === null);
    }
    return [];
  }, [tasks, props]);

  return (
    <>
      {tasksToDisplay.length === 0 && <NoTasks />}
      {tasksToDisplay.map((task, index) => (
        <TaskBox
          key={task.id}
          task={task}
          hasBottomBorder={
            props.displayBottomBorderForAll
              ? true
              : index !== tasksToDisplay.length - 1
          }
          hasLabel={props.hasLabel}
          onPress={async () => {
            if ("showUpcoming" in props) {
              return;
            }
            if (task.completedAt) {
              await markTaskAsUncompleted(task.id);
            } else {
              await markTaskAsCompleted(task.id);
            }
          }}
        />
      ))}
    </>
  );
}
