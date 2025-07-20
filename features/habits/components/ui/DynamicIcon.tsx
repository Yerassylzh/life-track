import * as LucideIcons from "lucide-react-native";
import type { ComponentProps } from "react";

type IconName = keyof typeof LucideIcons;

type Props = {
  name: IconName;
} & ComponentProps<any>;

// @ignore ts
export default function DynamicIcon({ name, ...rest }: Props) {
  const Icon = (LucideIcons as any)[name] as React.ComponentType<any>;

  // Runtime check to ensure it's actually a component
  if (!Icon) {
    console.log("Icon with name", name, "doesn't exist");
    return null;
  }

  return <Icon {...rest} />;
}
