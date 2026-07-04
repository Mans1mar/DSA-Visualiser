"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LANGUAGE_LABELS,
  LANGUAGE_ORDER,
  type Language,
  type LanguageSources,
} from "@/lib/algorithms/languages";
import { CodeTab } from "./code-tab";

export function CodeLanguageSwitcher({
  sources,
  currentLine,
  language,
  onLanguageChange,
}: {
  sources: LanguageSources;
  currentLine: number;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {LANGUAGE_ORDER.map((lang) => (
          <Button
            key={lang}
            type="button"
            size="sm"
            variant={lang === language ? "default" : "outline"}
            className={cn(lang === language && "pointer-events-none")}
            onClick={() => onLanguageChange(lang)}
          >
            {LANGUAGE_LABELS[lang]}
          </Button>
        ))}
      </div>
      <CodeTab source={sources[language]} currentLine={currentLine} />
    </div>
  );
}
