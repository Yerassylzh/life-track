import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Used to invert such classnames as 'text-gray-300', bg-color-300'. Changes the number value to (1000 - x).
export function invColorClass(className: string) {
  try {
    let chunks = className.split("-");
    const num = Number(chunks[chunks.length - 1]) as number;
    chunks[chunks.length - 1] = (1000 - num).toString();
    console.log(chunks.join("-"));
    return chunks.join("-");
  } catch (err) {
    console.log(err);
    return className;
  }
}

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
