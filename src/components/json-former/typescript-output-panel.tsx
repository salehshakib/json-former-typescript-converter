
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Sparkles, Copy } from "lucide-react";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  aiSuggestions: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading: boolean;
}

export default function TypeScriptOutputPanel({ 
  tsOutput, 
  aiSuggestions, 
  onDownload, 
  onCopy,
  isLoading 
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;
  const hasAiSuggestions = aiSuggestions.trim().length > 0;

  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-headline">TypeScript Output</CardTitle>
          <CardDescription>Generated TypeScript type definitions.</CardDescription>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onCopy} disabled={isLoading || !hasTsOutput} aria-label="Copy TypeScript code">
                  <Copy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Code</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDownload} disabled={isLoading || !hasTsOutput} aria-label="Download TypeScript file">
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download .ts</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="flex-1 border rounded-md bg-muted/30 p-1 min-h-[350px] md:min-h-[450px] lg:min-h-[calc(100vh-410px)]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
            <code className={`${!hasTsOutput && !isLoading ? 'text-muted-foreground' : ''} h-full block`}>
              {isLoading && !hasTsOutput ? "Generating TypeScript..." : hasTsOutput ? tsOutput : "Your TypeScript code will appear here..."}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
      
      {(isLoading && hasTsOutput && !hasAiSuggestions) || hasAiSuggestions || (isLoading && !hasTsOutput && !aiSuggestions && progressValue > 60) ? (
         <CardFooter className="flex flex-col items-start gap-2 p-4 border-t max-h-[200px] overflow-y-auto">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5"/>
              <h3 className="text-lg font-semibold font-headline">AI Suggestions</h3>
            </div>
            <ScrollArea className="w-full max-h-[120px] p-1">
              <pre className="text-xs whitespace-pre-wrap break-all font-code bg-muted/50 p-3 rounded-md">
                {isLoading && !hasAiSuggestions && progressValue > 60 ? "Fetching AI suggestions..." : hasAiSuggestions ? aiSuggestions : "No suggestions available."}
              </pre>
            </ScrollArea>
          </CardFooter>
      ) : null}
    </Card>
  );
}
