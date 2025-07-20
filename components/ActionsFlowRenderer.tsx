import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import DynamicIcon from "@/features/habits/components/ui/DynamicIcon";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import { navigate } from "expo-router/build/global-state/routing";
import { Href } from "expo-router/build/types";
import { useCallback, useState } from "react";
import { Pressable, PressableProps, View } from "react-native";
import InterText from "./ui/InterText";

export type RedirectStep = {
  redirectTo: Href;
  redirectParams?: Record<string, string>;
};

export type ActivityStep = {
  title: string;
  description: string;
  iconName: string;
  next?: ActivityStep[] | RedirectStep;
};

export type ActionsFlowRendererProps = {
  flow: ActivityStep[];
  onRedirect?: () => void;
};

export default function ActionsFlowRenderer({
  flow,
  onRedirect,
}: ActionsFlowRendererProps) {
  const [currentFlow, setCurrentFlow] = useState<ActivityStep[]>(flow);

  const onStepPress = useCallback(
    (step: ActivityStep) => {
      if (Array.isArray(step.next)) {
        setCurrentFlow(step.next);
      } else {
        const next = step.next as RedirectStep;
        onRedirect && onRedirect();
        navigate(next.redirectTo, next.redirectParams);
      }
    },
    [onRedirect]
  );

  return (
    <View className="gap-6">
      {currentFlow.map((step, index) => {
        return (
          <Option
            key={index}
            title={step.title}
            description={step.description}
            iconName={step.iconName}
            onPress={() => onStepPress(step)}
          />
        );
      })}
    </View>
  );
}

type OptionProps = {
  title: string;
  description: string;
  iconName: string;
} & PressableProps;

function Option({
  title,
  description,
  iconName,
  className,
  ...rest
}: OptionProps) {
  const { theme } = usePreferredColorTheme();

  return (
    <Pressable
      {...rest}
      className={cn("flex-row gap-4 items-center justify-start", className)}
    >
      <View
        className={cn(
          "w-10 h-10 p-1 bg-gray-200 rounded-full items-center justify-center",
          theme === "dark" && "bg-gray-700"
        )}
      >
        <DynamicIcon name={iconName} size={20} color={Colors.primary} />
      </View>
      <View className="flex-grow">
        <InterText className="text-lg font-bold">{title}</InterText>
        <View style={{ flexDirection: "row" }}>
          <InterText
            style={{ flex: 1, flexWrap: "wrap" }}
            className={cn(
              "text-sm text-gray-500",
              theme === "dark" && "text-gray-400"
            )}
          >
            {description}
          </InterText>
        </View>
      </View>
    </Pressable>
  );
}
