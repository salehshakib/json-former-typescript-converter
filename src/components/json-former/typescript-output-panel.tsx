"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy } from "lucide-react";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading: boolean;
  progressValue: number; // Keep progressValue if still needed for other logic
}

export default function TypeScriptOutputPanel({
  tsOutput,
  onDownload,
  onCopy,
  isLoading,
  progressValue,
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;

  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle className="text-2xl font-headline">
            TypeScript Output
          </CardTitle>
          <CardDescription>
            Generated TypeScript type definitions.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            disabled={isLoading || !hasTsOutput}
            aria-label="Copy TypeScript code"
          >
            <Copy className="h-4 w-4 " />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isLoading || !hasTsOutput}
            aria-label="Download TypeScript file"
          >
            <Download className="h-4 w-4 " />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="border rounded-md bg-muted/30 p-1 h-[65vh]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
            <code
              className={`${
                !hasTsOutput && !isLoading ? "text-muted-foreground" : ""
              } h-full block`}
            >
              {isLoading && !hasTsOutput
                ? "Generating TypeScript..."
                : hasTsOutput
                ? tsOutput
                : "Your TypeScript code will appear here..."}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
