
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
import type { OutputFormat, ActiveTsView } from "@/app/page";
import type { SuggestionItem } from "@/ai/flows/suggest-improvements";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TypeScriptOutputPanelProps {
  tsOutput: string;
  onDownloadTs: () => void;
  onCopyTs: () => void;
  isLoading: boolean;
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
  aiSuggestions: SuggestionItem[] | null;
  isFetchingAiSuggestions: boolean;
  onFetchAiSuggestions: () => Promise<void>;
  onAcceptAiSuggestion: (suggestedCode: string) => void;
  acceptedAiSuggestionCode: string | null;
  activeTsView: ActiveTsView;
  setActiveTsView: Dispatch<SetStateAction<ActiveTsView>>;
}

export default function TypeScriptOutputPanel({
  tsOutput,
  onDownloadTs,
  onCopyTs,
  isLoading,
  outputFormat,
  setOutputFormat,
  aiSuggestions,
  isFetchingAiSuggestions,
  onFetchAiSuggestions,
  onAcceptAiSuggestion,
  acceptedAiSuggestionCode,
  activeTsView,
  setActiveTsView,
}: TypeScriptOutputPanelProps) {
  const hasTsOutput = tsOutput.trim().length > 0;
  const hasAcceptedAiSuggestion = acceptedAiSuggestionCode && acceptedAiSuggestionCode.trim().length > 0;

  const codeToDisplay = activeTsView === 'aiEnhanced' && hasAcceptedAiSuggestion ? acceptedAiSuggestionCode : tsOutput;
  const displayHasContent = codeToDisplay && codeToDisplay.trim().length > 0;

  const isFormatSwitchDisabled = isLoading || isFetchingAiSuggestions || activeTsView !== 'current';

  return (
    <Card className="flex flex-col shadow-lg rounded-xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-2xl font-headline">
            TypeScript Output
          </CardTitle>
          <CardDescription>
            Generated TypeScript type definitions.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
           {activeTsView === 'current' && (
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FileJson2
                    className={cn("h-5 w-5", isFormatSwitchDisabled ? "text-muted-foreground/50" : "text-muted-foreground")}
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
                disabled={isFormatSwitchDisabled}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Type
                     className={cn("h-5 w-5", isFormatSwitchDisabled ? "text-muted-foreground/50" : "text-muted-foreground")}
                    aria-label="Type alias format"
                  />
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Type Alias</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onCopyTs}
                disabled={isLoading || isFetchingAiSuggestions || !displayHasContent}
                aria-label="Copy TypeScript code"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Copy {activeTsView === 'aiEnhanced' && hasAcceptedAiSuggestion ? "Enhanced" : "Current"} Code</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onDownloadTs}
                disabled={isLoading || isFetchingAiSuggestions || !displayHasContent}
                aria-label="Download TypeScript file"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Download {activeTsView === 'aiEnhanced' && hasAcceptedAiSuggestion ? "Enhanced" : "Current"} Code</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        {hasAcceptedAiSuggestion && (
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTsView('current')}
              className={cn(
                "flex-1 rounded-md",
                activeTsView === 'current'
                  ? "bg-muted text-primary shadow-sm font-medium"
                  : "bg-transparent text-foreground hover:bg-muted/50 font-medium"
              )}
            >
              Current
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTsView('aiEnhanced')}
              className={cn(
                "flex-1 rounded-md",
                activeTsView === 'aiEnhanced'
                  ? "bg-muted text-primary shadow-sm font-medium"
                  : "bg-transparent text-foreground hover:bg-muted/50 font-medium"
              )}
            >
              Enhanced
            </Button>
          </div>
        )}
        <ScrollArea className="border rounded-md bg-muted/30 flex-1 min-h-[200px] h-[70vh]">
          <pre className="p-3 text-sm whitespace-pre-wrap break-all font-code text-foreground h-full">
            <code
              className={`${
                !displayHasContent && !isLoading ? "text-muted-foreground" : ""
              } h-full block`}
            >
              {isLoading && !displayHasContent
                ? "Generating TypeScript..."
                : displayHasContent
                ? codeToDisplay
                : "Your TypeScript code will appear here..."}
            </code>
          </pre>
        </ScrollArea>
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
