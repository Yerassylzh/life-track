import { Task } from "@/db/schema";
import { addDaystoDate, dateToYMD, YMDToDate } from "@/lib/date";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, View } from "react-native";
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
  allowToDisplayNoTasks?: boolean;
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
          key={item.id}
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

  const listRef = useRef<FlashList<any>>(null);

  useEffect(() => {
    listRef.current?.prepareForLayoutAnimationRender();
  }, []);

  if (tasksToDisplay.length === 0 && props.allowToDisplayNoTasks) {
    return (
      <View className="flex-1 items-center justify-start pb-40">
        <NoTasks />
      </View>
    );
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
