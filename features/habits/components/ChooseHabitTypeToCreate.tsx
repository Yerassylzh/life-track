import ActivityStepsRenderer, {
  ActivityStep,
} from "@/components/ActivityStepsRenderer";
import ModalBottomSheet, {
  ModalBottomSheetProps,
} from "@/components/ModalBottomSheet";

const flow: ActivityStep[] = [
  {
    title: "Yes or No Habit",
    description:
      "Mark whether you did the habit or not. Best for simple goals like meditating, waking up early, or avoiding sugar.",
    iconName: "CheckSquare",
    next: {
      redirectTo: "/habit/create_habit/checkbox",
    },
  },
  {
    title: "Measurable Habit",
    description:
      "Track how much, how long, or how many times you do something. Ideal for habits like reading pages, drinking water, or running kilometers.",
    iconName: "BarChart2",
    next: {
      redirectTo: "/habit/create_habit/numeric",
    },
  },
];

export default function ChooseHabitTypeToCreate({
  ref,
  ...rest
}: ModalBottomSheetProps) {
  return (
    <ModalBottomSheet ref={ref} {...rest}>
      <ActivityStepsRenderer
        flow={flow}
        onRedirect={() => ref?.current?.close({ duration: 100 })}
      />
    </ModalBottomSheet>
  );
}
