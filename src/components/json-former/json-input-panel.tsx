
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardPaste, Indent, FileJson, Trash2, AlignLeft } from "lucide-react";

interface JsonInputPanelProps {
  jsonInput: string;
  setJsonInput: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  onPaste: () => void;
  onFormat: () => void;
  onLoadExample: () => void;
  onClear: () => void;
}

export default function JsonInputPanel({ 
  jsonInput, 
  setJsonInput, 
  isLoading,
  onPaste,
  onFormat,
  onLoadExample,
  onClear
}: JsonInputPanelProps) {
  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle className="text-2xl font-headline">JSON Input</CardTitle>
          <CardDescription>Paste, type, or load example JSON.</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={onPaste} disabled={isLoading} aria-label="Paste JSON from clipboard">
              <ClipboardPaste className="h-4 w-4 " /> 
            </Button>
            <Button variant="outline" size="sm" onClick={onFormat} disabled={isLoading || !jsonInput.trim()} aria-label="Format JSON">
              <AlignLeft className="h-4 w-4 " /> 
            </Button>
            <Button variant="outline" size="sm" onClick={onLoadExample} disabled={isLoading} aria-label="Load example JSON">
              <FileJson className="h-4 w-4 " /> 
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClear} 
              disabled={isLoading || !jsonInput.trim()} 
              aria-label="Clear JSON input" 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50 focus-visible:ring-destructive"
            >
              <Trash2 className="h-4 w-4 " />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{ "name": "JSONFormer", "version": 1 }'
          className="resize-none h-[67vh] text-sm bg-muted/30 border-input focus:ring-primary font-code"
          aria-label="JSON Input Area"
        />
      </CardContent>
    </Card>
  );
}
