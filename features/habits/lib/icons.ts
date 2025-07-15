export const habitIcons = [
  "BedDouble",
  "Album",
  "Book",
  "Trophy",
  "Bike",
  "Dumbbell",
  "Volleyball",
  "ShieldHalf",
  "AlarmClock",
  "Ban",
  "Monitor",
  "Palette",
  "AppWindowMac",
  "Laptop",
  "DollarSign",
  "Heart",
  "BrushCleaning",
  "Radical",
  "Trees",
  "GlassWater",
] as const;

export type HabitIconNameType = (typeof habitIcons)[number];
