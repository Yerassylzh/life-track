import Add from "@/components/ui/Add";
import React from "react";
import { useChooseHabitTypeToCreate } from "../../context/ChooseHabitTypeToCreateContext";

function CreateNewHabitButton() {
  const { showModal } = useChooseHabitTypeToCreate();
  return (
    <>
      <Add className="mb-[100px] right-[15px]" onPress={showModal} />
    </>
  );
}

export default React.memo(CreateNewHabitButton);
