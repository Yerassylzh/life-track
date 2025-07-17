import InterText from "@/components/InterText";
import SheetModal from "@/components/SheetModal";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Task } from "@/db/schema";
import { cn } from "@/lib/tailwindClasses";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { Pressable, View } from "react-native";
import { deleteTask } from "../lib/delete";

export default function TaskDeletionConfirmationModal({
  task,
  ref,
}: {
  task: Task;
  ref: RefObject<BottomSheetModal | null>;
}) {
  const { theme } = usePreferredColorTheme();

  return (
    <SheetModal style={{ paddingTop: 0, paddingBottom: 0 }} ref={ref}>
      <View className="gap-3 flex-grow flex-1 justify-between">
        <InterText>{`Do you really want to delete task '${task.name}'?`}</InterText>
        <View
          className={cn(
            "flex-1 flex-row items-center gap-2 border-t border-t-gray-100",
            theme === "dark" && "border-t-gray-800"
          )}
        >
          <Pressable
            style={{
              flex: 1,
            }}
            className={cn(
              "items-center justify-center py-3 border-r border-r-gray-100",
              theme === "dark" && "border-r-gray-800"
            )}
            onPress={() => ref.current?.dismiss()}
          >
            <InterText className="font-semibold text-base">CANCEL</InterText>
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            className="items-center justify-center py-3"
            onPress={async () => {
              ref.current?.dismiss();
              await deleteTask(task);
            }}
          >
            <InterText className="font-semibold text-base text-red-500">
              DELETE
            </InterText>
          </Pressable>
        </View>
      </View>
    </SheetModal>
  );
}
