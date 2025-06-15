
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, ClipboardPaste, Indent, FileJson, Trash2 } from "lucide-react";

interface JsonInputPanelProps {
  jsonInput: string;
  setJsonInput: Dispatch<SetStateAction<string>>;
  onConvert: () => void;
  isLoading: boolean;
  onPaste: () => void;
  onFormat: () => void;
  onLoadExample: () => void;
  onClear: () => void;
}

export default function JsonInputPanel({ 
  jsonInput, 
  setJsonInput, 
  onConvert, 
  isLoading,
  onPaste,
  onFormat,
  onLoadExample,
  onClear
}: JsonInputPanelProps) {
  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-headline">JSON Input</CardTitle>
          <CardDescription>Paste, type, or load example JSON.</CardDescription>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onPaste} disabled={isLoading} aria-label="Paste JSON from clipboard">
                  <ClipboardPaste className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onFormat} disabled={isLoading || !jsonInput.trim()} aria-label="Format JSON">
                  <Indent className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Format JSON</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onLoadExample} disabled={isLoading} aria-label="Load example JSON">
                  <FileJson className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load Example</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClear} disabled={isLoading || !jsonInput.trim()} aria-label="Clear JSON input">
                  <Trash2 className="h-5 w-5 text-destructive/80 hover:text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Input</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{ "name": "JSONFormer", "version": 1 }'
          className="flex-1 resize-none min-h-[400px] md:min-h-[500px] lg:min-h-[calc(100vh-360px)] text-sm bg-muted/30 border-input focus:ring-primary font-code"
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
