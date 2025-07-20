import ConfirmModalFooter from "@/components/form/ConfirmModalFooter";
import InterText from "@/components/ui/InterText";
import { Task } from "@/db/schema";
import Modal from "@/layouts/Modal";
import { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { deleteTask } from "../lib/delete";

type ContextProps = {
  showModal: (task: Task) => void;
};

const Context = createContext<ContextProps | undefined>(undefined);

export function TaskDeletionConfirmationModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [task, setTask] = useState<Task | null>(null);

  const showModal = useCallback((task: Task) => {
    setTask(task);
    setVisible(true);
  }, []);

  const onOk = useCallback(async () => {
    if (!task) return;

    setVisible(false);
    await deleteTask(task);
  }, [task]);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const data = { showModal };

  return (
    <Context.Provider value={data}>
      {children}
      {task && (
        <Modal visible={visible} onRequestClose={() => setVisible(false)}>
          <View className="gap-3">
            <InterText className="text-base">{`Task '${task.name}' will be permanently deleted. Continue?`}</InterText>
            <ConfirmModalFooter
              onOk={onOk}
              onCancel={onCancel}
              okLabel="DELETE"
              okClassName="text-red-500 text-sm"
              cancelClassName="text-sm"
            />
          </View>
        </Modal>
      )}
    </Context.Provider>
  );
}

export const useTaskDeletionConfirmationModal = () => {
  const context = useContext(Context);
  if (!context) {
    throw Error(
      "useTaskDeletionConfirmationModal must be used within TaskDeletionConfirmationModalProvider"
    );
  }
  return context;
};
