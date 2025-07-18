import Add from "@/components/ui/Add";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import ChooseHabitTypeToCreate from "./ChooseHabitTypeToCreate";

function CreateNewHabitButton() {
  const activityTypeChoiceRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Add
        className="mb-[100px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseHabitTypeToCreate ref={activityTypeChoiceRef} />
    </>
  );
}

export default React.memo(CreateNewHabitButton);
