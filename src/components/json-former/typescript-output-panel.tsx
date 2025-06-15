
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
import { Copy, Download, Code, FileType } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
        <div className="flex-1">
          <CardTitle className="text-2xl font-headline">
            TypeScript Output
          </CardTitle>
          <CardDescription>
            Generated TypeScript type definitions.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center space-x-2 mr-2">
            <FileType className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="output-format-switch" className="text-sm">Type</Label>
            <Switch
              id="output-format-switch"
              checked={outputFormat === 'interface'}
              onCheckedChange={(checked) => setOutputFormat(checked ? 'interface' : 'type')}
              aria-label="Toggle output format between Type and Interface"
              disabled={isLoading}
            />
            <Label htmlFor="output-format-switch" className="text-sm">Interface</Label>
             <Code className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            disabled={isLoading || !hasTsOutput}
            aria-label="Copy TypeScript code"
            className="gap-1.5"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isLoading || !hasTsOutput}
            aria-label="Download TypeScript file"
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="border rounded-md bg-muted/30 p-1 h-[80vh]">
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
