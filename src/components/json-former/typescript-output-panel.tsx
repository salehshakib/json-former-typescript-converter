
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
  CheckCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { OutputFormat } from "@/app/page";
import type { SuggestionItem } from "@/ai/flows/suggest-improvements";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownloadCurrentTs: () => void;
  onCopyCurrentTs: () => void;
  isLoading: boolean; // Main conversion loading
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
  aiSuggestions: SuggestionItem[] | null;
  isFetchingAiSuggestions: boolean;
  onFetchAiSuggestions: () => Promise<void>;
  onAcceptAiSuggestion: (suggestedCode: string) => void;
  acceptedAiSuggestionCode: string | null;
  onCopyAiSuggestedTs: () => void;
  onDownloadAiSuggestedTs: () => void;
}

export default function TypeScriptOutputPanel({
  tsOutput,
  onDownloadCurrentTs,
  onCopyCurrentTs,
  isLoading,
  outputFormat,
  setOutputFormat,
  aiSuggestions,
  isFetchingAiSuggestions,
  onFetchAiSuggestions,
  onAcceptAiSuggestion,
  acceptedAiSuggestionCode,
  onCopyAiSuggestedTs,
  onDownloadAiSuggestedTs,
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;
  const hasAcceptedAiSuggestion = acceptedAiSuggestionCode && acceptedAiSuggestionCode.trim().length > 0;

  const currentTabCount = hasAcceptedAiSuggestion ? 2 : 1;

  return (
    <Card className="flex flex-col shadow-lg rounded-xl overflow-hidden h-full">
      <CardHeader>
        <div>
          <CardTitle className="text-2xl font-headline">
            TypeScript Output
          </CardTitle>
          <CardDescription>
            View generated or AI-enhanced TypeScript definitions.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        <Tabs defaultValue="current-output" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className={`grid w-full ${currentTabCount === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="current-output">Current Output</TabsTrigger>
            {hasAcceptedAiSuggestion && (
              <TabsTrigger value="ai-enhanced">AI Enhanced</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="current-output" className="flex-1 flex flex-col min-h-0 mt-2">
            <div className="flex items-center justify-between gap-2 py-2 mb-2">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FileJson2
                      className="h-5 w-5 text-muted-foreground"
                      aria-label="Interface format"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Interface</p>
                  </TooltipContent>
                </Tooltip>
                <Switch
                  id="output-format-switch"
                  checked={outputFormat === "type"}
                  onCheckedChange={(checked) =>
                    setOutputFormat(checked ? "type" : "interface")
                  }
                  aria-label="Toggle output format between Interface (off) and Type (on)"
                  disabled={isLoading || isFetchingAiSuggestions}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Type
                      className="h-5 w-5 text-muted-foreground"
                      aria-label="Type alias format"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Type Alias</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onCopyCurrentTs}
                      disabled={isLoading || isFetchingAiSuggestions || !hasTsOutput}
                      aria-label="Copy TypeScript code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Copy TypeScript</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onDownloadCurrentTs}
                      disabled={isLoading || isFetchingAiSuggestions || !hasTsOutput}
                      aria-label="Download TypeScript file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Download TypeScript</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <ScrollArea className="border rounded-md bg-muted/30 flex-1">
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
          </TabsContent>

          {hasAcceptedAiSuggestion && (
            <TabsContent value="ai-enhanced" className="flex-1 flex flex-col min-h-0 mt-2">
               <div className="flex items-center justify-end gap-2 py-2 mb-2"> {/* No format switch needed here */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onCopyAiSuggestedTs}
                      disabled={isLoading || isFetchingAiSuggestions}
                      aria-label="Copy AI Enhanced TypeScript code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Copy AI Enhanced Code</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onDownloadAiSuggestedTs}
                      disabled={isLoading || isFetchingAiSuggestions}
                      aria-label="Download AI Enhanced TypeScript file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>Download AI Enhanced Code</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <ScrollArea className="border rounded-md bg-muted/30 flex-1">
                <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
                  <code className="h-full block">
                    {acceptedAiSuggestionCode}
                  </code>
                </pre>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4 border-t">
        <Button
          onClick={onFetchAiSuggestions}
          disabled={
            isLoading ||
            isFetchingAiSuggestions ||
            !hasTsOutput ||
            aiSuggestions !== null 
          }
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
            : aiSuggestions !== null
            ? "Suggestions Loaded"
            : "Get AI Enhancement Suggestions"}
        </Button>
        {aiSuggestions && aiSuggestions.length > 0 && (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="ai-suggestions-item-0" 
          >
            {aiSuggestions.map((suggestion, index) => (
              <AccordionItem value={`ai-suggestions-item-${index}`} key={index}>
                <AccordionTrigger className="text-sm text-left hover:no-underline">
                  Suggestion {index + 1}
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-auto max-h-[200px] p-1 border rounded-md">
                    <div className="prose prose-sm dark:prose-invert max-w-none p-3 text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {suggestion.description}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                  {suggestion.isApplicable && suggestion.suggestedCode && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={() =>
                        onAcceptAiSuggestion(suggestion.suggestedCode!)
                      }
                      disabled={isFetchingAiSuggestions || isLoading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Suggestion
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
}
