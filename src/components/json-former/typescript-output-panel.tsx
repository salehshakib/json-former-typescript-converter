
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Copy } from "lucide-react";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading: boolean;
}

export default function TypeScriptOutputPanel({ 
  tsOutput, 
  onDownload, 
  onCopy,
  isLoading
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;

  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle className="text-2xl font-headline">TypeScript Output</CardTitle>
          <CardDescription>Generated TypeScript type definitions.</CardDescription>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onCopy} disabled={isLoading || !hasTsOutput} aria-label="Copy TypeScript code">
                  <Copy className="mr-2 h-4 w-4" /> Copy Code
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy TypeScript to clipboard</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onDownload} disabled={isLoading || !hasTsOutput} aria-label="Download TypeScript file">
                  <Download className="mr-2 h-4 w-4" /> Download .ts
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as types.ts</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="flex-1 border rounded-md bg-muted/30 p-1 min-h-[400px] md:min-h-[500px] lg:min-h-[calc(100vh-320px)]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
            <code className={`${!hasTsOutput && !isLoading ? 'text-muted-foreground' : ''} h-full block`}>
              {isLoading && !hasTsOutput ? "Generating TypeScript..." : 
               hasTsOutput ? tsOutput : "Your TypeScript code will appear here..."}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
