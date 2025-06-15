
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, FileJson2, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { OutputFormat } from "@/app/page";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading: boolean;
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
}

export default function TypeScriptOutputPanel({
  tsOutput,
  onDownload,
  onCopy,
  isLoading,
  outputFormat,
  setOutputFormat,
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;

  return (
    <Card className="flex flex-col shadow-lg rounded-xl overflow-hidden h-full">
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
          <div className="flex items-center space-x-2 mr-2">
            <FileJson2 className="h-5 w-5 text-muted-foreground" aria-label="Interface format" />
            <Switch
              id="output-format-switch"
              checked={outputFormat === "type"} 
              onCheckedChange={(checked) =>
                setOutputFormat(checked ? "type" : "interface") 
              }
              aria-label="Toggle output format between Interface (off) and Type (on)"
              disabled={isLoading}
            />
            <Type className="h-5 w-5 text-muted-foreground" aria-label="Type alias format" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onCopy}
            disabled={isLoading || !hasTsOutput}
            aria-label="Copy TypeScript code"
            title="Copy TypeScript"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            disabled={isLoading || !hasTsOutput}
            aria-label="Download TypeScript file"
            title="Download TypeScript"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="border rounded-md bg-muted/30 h-[80vh]">
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
