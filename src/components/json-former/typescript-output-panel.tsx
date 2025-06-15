
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
  progressValue: number;
}

export default function TypeScriptOutputPanel({ 
  tsOutput, 
  aiSuggestions, 
  onDownload, 
  onCopy,
  isLoading,
  progressValue
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;
  const hasAiSuggestions = aiSuggestions.trim().length > 0;

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
        <ScrollArea className="flex-1 border rounded-md bg-muted/30 p-1 min-h-[350px] md:min-h-[450px] lg:min-h-[calc(100vh-370px)]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
            <code className={`${!hasTsOutput && !isLoading ? 'text-muted-foreground' : ''} h-full block`}>
              {isLoading && !hasTsOutput && progressValue < 60 ? "Converting JSON..." : 
               isLoading && !hasTsOutput && progressValue >=60 ? "Generating TypeScript..." :
               hasTsOutput ? tsOutput : "Your TypeScript code will appear here..."}
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
                {isLoading && !hasAiSuggestions && progressValue >= 70 ? "Fetching AI suggestions..." : 
                 hasAiSuggestions ? aiSuggestions : "No suggestions available."}
              </pre>
            </ScrollArea>
          </CardFooter>
      ) : null}
    </Card>
  );
}
