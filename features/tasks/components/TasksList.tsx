import { Task } from "@/db/schema";
import NoActivities from "@/features/home/components/NoActivities";
import { addDaystoDate, dateToYMD, YMDToDate } from "@/lib/date";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
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

const screenDimensions = Dimensions.get("window");

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

  const renderItem = useCallback(
    ({ item }: { item: Task }) => {
      return (
        <TaskBox
          task={item}
          hasLabel={props.hasLabel}
          hasBottomBorder
          onPress={async () => {
            if ("showUpcoming" in props) {
              return;
            }
            if (item.completedAt) {
              await markTaskAsUncompleted(item.id);
            } else {
              await markTaskAsCompleted(item.id);
            }
          }}
        />
      );
    },
    [props]
  );

  if (tasksToDisplay.length === 0) {
    return <NoActivities includeTasks />;
  }

  return (
    <FlashList
      bounces={true}
      data={tasksToDisplay}
      renderItem={renderItem}
      overScrollMode="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 15 }}
      keyExtractor={(item) => item.id}
      estimatedItemSize={65}
      estimatedListSize={{
        width: screenDimensions.width,
        height: Math.min(screenDimensions.height, 65 * tasksToDisplay.length),
      }}
    />
  );
}
