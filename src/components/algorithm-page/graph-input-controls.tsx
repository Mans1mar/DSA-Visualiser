"use client";

import { Button } from "@/components/ui/button";

export function GraphInputControls({ onRandomize }: { onRandomize: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="sm" variant="outline" onClick={onRandomize}>
        Randomize graph
      </Button>
    </div>
  );
}
