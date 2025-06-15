"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface JsonInputPanelProps {
  jsonInput: string;
  setJsonInput: Dispatch<SetStateAction<string>>;
  onConvert: () => void;
  isLoading: boolean;
}

export default function JsonInputPanel({ jsonInput, setJsonInput, onConvert, isLoading }: JsonInputPanelProps) {
  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">JSON Input</CardTitle>
        <CardDescription>Paste or type your JSON data below.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{ "name": "JSONFormer", "version": 1 }'
          className="flex-1 resize-none h-full min-h-[300px] text-sm bg-background border-input focus:ring-primary font-code"
          aria-label="JSON Input Area"
        />
        <Button 
          onClick={onConvert} 
          disabled={isLoading || !jsonInput.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Convert JSON to TypeScript"
        >
          <Zap className="mr-2 h-5 w-5" />
          Convert to TypeScript
        </Button>
      </CardContent>
    </Card>
  );
}
