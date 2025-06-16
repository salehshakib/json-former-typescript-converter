"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Download,
  FileJson2,
  Type,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { OutputFormat } from "@/app/page";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading: boolean; // Main conversion loading
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
  aiSuggestions: string | null;
  isFetchingAiSuggestions: boolean;
  onFetchAiSuggestions: () => Promise<void>;
}

export default function TypeScriptOutputPanel({
  tsOutput,
  onDownload,
  onCopy,
  isLoading,
  outputFormat,
  setOutputFormat,
  aiSuggestions,
  isFetchingAiSuggestions,
  onFetchAiSuggestions,
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
            <FileJson2
              className="h-5 w-5 text-muted-foreground"
              aria-label="Interface format"
            />
            <Switch
              id="output-format-switch"
              checked={outputFormat === "type"}
              onCheckedChange={(checked) =>
                setOutputFormat(checked ? "type" : "interface")
              }
              aria-label="Toggle output format between Interface (off) and Type (on)"
              disabled={isLoading || isFetchingAiSuggestions}
            />
            <Type
              className="h-5 w-5 text-muted-foreground"
              aria-label="Type alias format"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onCopy}
            disabled={isLoading || isFetchingAiSuggestions || !hasTsOutput}
            aria-label="Copy TypeScript code"
            title="Copy TypeScript"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            disabled={isLoading || isFetchingAiSuggestions || !hasTsOutput}
            aria-label="Download TypeScript file"
            title="Download TypeScript"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <ScrollArea className="border rounded-md bg-muted/30 h-[70vh]">
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
      <CardFooter className="flex flex-col items-start gap-4 p-4 border-t">
        <Button
          onClick={onFetchAiSuggestions}
          disabled={isLoading || isFetchingAiSuggestions || !hasTsOutput}
          size="sm"
          variant="outline"
          className="w-full"
        >
          {isFetchingAiSuggestions ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          {isFetchingAiSuggestions
            ? "Thinking..."
            : "Get AI Enhancement Suggestions"}
        </Button>
        {aiSuggestions && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ai-suggestions">
              <AccordionTrigger className="text-sm">
                View AI Enhancement Suggestions
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] p-1 border rounded-md">
                  <div className="prose prose-sm dark:prose-invert max-w-none p-2 text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {aiSuggestions}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
}
