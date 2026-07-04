export type Language = "java" | "cpp" | "python";

export const LANGUAGE_ORDER: Language[] = ["java", "cpp", "python"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  java: "Java",
  cpp: "C++",
  python: "Python",
};

export type LanguageSources = Record<Language, string[]>;
