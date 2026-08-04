export const defaultLocale = "pt-PT" as const;
export const supportedLocales = [defaultLocale] as const;
export type AppLocale = (typeof supportedLocales)[number];
export const defaultTimeZone = "Europe/Lisbon" as const;

export const formatPreferences = {
  measurementSystem: "metric",
  hourCycle: "h23",
  timeZone: defaultTimeZone
} as const;
