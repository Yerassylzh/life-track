import ActivityStepsRenderer, {
  ActivityStep,
} from "@/components/ActionsFlowRenderer";
import ModalBottomSheet, {
  ModalBottomSheetProps,
} from "@/components/ModalBottomSheet";

const flow: ActivityStep[] = [
  {
    title: "Habit",
    description:
      "Activity that repeats over time. It has detailed tracking and statistics",
    iconName: "Trophy",
    next: [
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
    ],
  },
  {
    title: "Task",
    description: "Single instance activity without tracking over time",
    iconName: "Check",
    next: {
      redirectTo: "/task/create_task",
    },
  },
  {
    title: "Journal entry",
    description:
      "Write your thoughts, experiences, or reflections. You can also add images",
    iconName: "Album",
    next: {
      redirectTo: "/journal/create_journal_entry",
    },
  },
];

export default function ChooseActivityToCreateButtomSheet({
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
