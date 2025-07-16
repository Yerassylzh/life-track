import { addDaystoDate, dateToYMD, YMDToDate } from "@/lib/date";
import { useCallback, useMemo } from "react";
import { useTasks } from "../context/TasksContext";
import { markTaskAsCompleted, markTaskAsUncompleted } from "../lib/update";
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

  const getFilteredTasks = useCallback(
    (completed: boolean) => {
      if ("date" in props) {
        return tasks.filter(
          (task) =>
            (completed
              ? task.completedAt !== null
              : task.completedAt === null) &&
            dateToYMD(props.date) === dateToYMD(task.targetDate)
        );
      }
      const todayStartDate = YMDToDate(dateToYMD(new Date()));
      const yesterdayStartDate = addDaystoDate(todayStartDate, 1);
      return tasks.filter((task) => yesterdayStartDate <= task.targetDate);
    },
    [tasks, props]
  );

  const completedTasks = useMemo(
    () => getFilteredTasks(true),
    [getFilteredTasks]
  );
  const uncompletedTasks = useMemo(
    () => getFilteredTasks(false),
    [getFilteredTasks]
  );

  return (
    <>
      {("displayUncompleted" in props || "displayAllTasks" in props) &&
        uncompletedTasks.map((task, index) => (
          <TaskBox
            key={index}
            task={task}
            hasBottomBorder={
              props.displayBottomBorderForAll
                ? true
                : index !== completedTasks.length - 1
            }
            hasLabel={props.hasLabel}
            onPress={async () => {
              if ("showUpcoming" in props) {
                return;
              }
              await markTaskAsCompleted(task.id);
            }}
          />
        ))}
      {("displayCompleted" in props || "displayAllTasks" in props) &&
        completedTasks.map((task, index) => (
          <TaskBox
            key={index}
            task={task}
            hasBottomBorder={
              props.displayBottomBorderForAll
                ? true
                : index !== completedTasks.length - 1
            }
            hasLabel={props.hasLabel}
            onPress={async () => {
              await markTaskAsUncompleted(task.id);
            }}
          />
        ))}
    </>
  );
}
