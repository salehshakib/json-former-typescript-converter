"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Sparkles } from "lucide-react";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  aiSuggestions: string;
  onDownload: () => void;
  isLoading: boolean;
}

export default function TypeScriptOutputPanel({ tsOutput, aiSuggestions, onDownload, isLoading }: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;
  const hasAiSuggestions = aiSuggestions.trim().length > 0;

  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">TypeScript Output</CardTitle>
        <CardDescription>Generated TypeScript type definitions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="flex-1 border rounded-md bg-muted/50 p-1 min-h-[200px]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground">
            <code className={`${!hasTsOutput && !isLoading ? 'text-muted-foreground' : ''}`}>
              {isLoading && !hasTsOutput ? "Generating TypeScript..." : hasTsOutput ? tsOutput : "Your TypeScript code will appear here..."}
            </code>
          </pre>
        </ScrollArea>
        {hasTsOutput && (
          <Button 
            onClick={onDownload} 
            disabled={isLoading || !hasTsOutput}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            aria-label="Download TypeScript file"
          >
            <Download className="mr-2 h-5 w-5" />
            Download .ts File
          </Button>
        )}
      </CardContent>
      
      {(isLoading && hasTsOutput && !hasAiSuggestions) || hasAiSuggestions ? (
         <CardFooter className="flex flex-col items-start gap-2 p-4 border-t">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5"/>
              <h3 className="text-lg font-semibold font-headline">AI Suggestions</h3>
            </div>
            <ScrollArea className="w-full max-h-[150px] p-1">
              <pre className="text-xs whitespace-pre-wrap break-all font-code bg-muted/30 p-3 rounded-md">
                {isLoading && !hasAiSuggestions ? "Fetching AI suggestions..." : hasAiSuggestions ? aiSuggestions : "No suggestions available."}
              </pre>
            </ScrollArea>
          </CardFooter>
      ) : null}
    </Card>
  );
}
