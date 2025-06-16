"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, ClipboardPaste, FileJson, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onClear,
}: JsonInputPanelProps) {
  return (
    <Card className="flex flex-1 min-h-[70vh] flex-col shadow-lg rounded-xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle className="text-2xl font-headline">JSON Input</CardTitle>
          <CardDescription>Paste, type, or load example JSON.</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onPaste}
                disabled={isLoading}
                aria-label="Paste JSON from clipboard"
              >
                <ClipboardPaste className="h-4 w-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Paste JSON</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onFormat}
                disabled={isLoading || !jsonInput.trim()}
                aria-label="Format JSON"
              >
                <AlignLeft className="h-4 w-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Format JSON</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onLoadExample}
                disabled={isLoading}
                aria-label="Load example JSON"
              >
                <FileJson className="h-4 w-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Load Example JSON</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onClear}
                disabled={isLoading || !jsonInput.trim()}
                aria-label="Clear JSON input"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50 focus-visible:ring-destructive"
              >
                <Trash2 className="h-4 w-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Clear JSON Input</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{ "name": "JSONFormer", "version": 1 }'
          className="resize-none h-full min-h-[60vh] scrollbar-thin outline-none text-sm border rounded-md bg-muted/30 focus:ring-0 font-code   w-full"
          aria-label="JSON Input Area"
        />
      </CardContent>
    </Card>
  );
}
