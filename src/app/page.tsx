
"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/json-former/app-header";
import JsonInputPanel from "@/components/json-former/json-input-panel";
import TypeScriptOutputPanel from "@/components/json-former/typescript-output-panel";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { convertJsonToTs } from "@/lib/json-to-ts";
import { suggestTypescriptImprovements, type SuggestionItem, type SuggestTypescriptImprovementsOutput } from "@/ai/flows/suggest-improvements";
import { TooltipProvider } from "@/components/ui/tooltip";

const EXAMPLE_JSON = {
  user: {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496",
      },
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
  },
  posts: [
    {
      userId: 1,
      id: 1,
      title:
        "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto",
    },
  ],
  isActive: true,
  tags: ["json", "typescript", "converter"],
  userCurrency: {
    currencyId: 3,
    fullName: "United Arab Emirates Dirham",
    shortName: "AED",
    symbol: "د.إ"
  },
  baseCurrency: {
    currencyId: 3,
    fullName: "United Arab Emirates Dirham",
    shortName: "AED",
    symbol: "د.إ"
  },
};

export type OutputFormat = "interface" | "type";
export type ActiveTsView = "current" | "aiEnhanced";

export default function JsonFormerPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [tsOutput, setTsOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("interface");
  const [aiSuggestions, setAiSuggestions] = useState<SuggestionItem[] | null>(null);
  const [isFetchingAiSuggestions, setIsFetchingAiSuggestions] = useState<boolean>(false);
  const [acceptedAiSuggestionCode, setAcceptedAiSuggestionCode] = useState<string | null>(null);
  const [activeTsView, setActiveTsView] = useState<ActiveTsView>("current");
  const { toast } = useToast();

  const handleLoadExampleJson = () => {
    const exampleJsonString = JSON.stringify(EXAMPLE_JSON, null, 2);
    setJsonInput(exampleJsonString);
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);
    setActiveTsView("current");
  };

  const memoizedHandleConvert = useCallback(
    async (currentJsonInput: string, currentOutputFormat: OutputFormat) => {
      setAiSuggestions(null); 
      setAcceptedAiSuggestionCode(null);
      setActiveTsView("current");
      if (!currentJsonInput.trim()) {
        setTsOutput("");
        setIsLoading(false);
        setProgressValue(0);
        return;
      }

      setIsLoading(true);
      setTsOutput("");
      setProgressValue(10); 

      const conversionResult = convertJsonToTs(
        currentJsonInput,
        "RootObject",
        currentOutputFormat
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgressValue(100);

      if (conversionResult.error) {
        toast({
          title: "Conversion Error",
          description: conversionResult.error,
          variant: "destructive",
        });
        setTsOutput("");
        setProgressValue(0);
      } else {
        setTsOutput(conversionResult.typescriptCode);
      }
      setIsLoading(false);
    },
    [toast] 
  );

  useEffect(() => {
    const currentInput = jsonInput;
    const currentFormat = outputFormat;
    
    if (!currentInput.trim()) {
      setTsOutput("");
      setAiSuggestions(null);
      setAcceptedAiSuggestionCode(null);
      setActiveTsView("current");
      setIsLoading(false);
      setProgressValue(0);
      return;
    }
    
    // Clear AI-related states when input changes before new conversion
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);
    setActiveTsView("current");


    const handler = setTimeout(() => {
      memoizedHandleConvert(currentInput, currentFormat);
    }, 750); 

    return () => {
      clearTimeout(handler);
    };
  }, [jsonInput, outputFormat, memoizedHandleConvert]);


  const handlePasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setAcceptedAiSuggestionCode(null);
      setAiSuggestions(null);
      setActiveTsView("current");
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      toast({
        title: "Paste Error",
        description:
          "Could not paste from clipboard. Check permissions or try manually.",
        variant: "destructive",
      });
    }
  };

  const handleFormatJson = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Format Error",
        description: "Nothing to format. JSON input is empty.",
        variant: "destructive",
      });
      return;
    }
    try {
      const parsedJson = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsedJson, null, 2));
      // No need to reset AI states here as the underlying data for conversion hasn't changed its structure.
      // The useEffect for jsonInput will trigger a re-conversion, which will clear AI states.
    } catch (error) {
      toast({
        title: "Format Error",
        description: "Invalid JSON. Could not format.",
        variant: "destructive",
      });
    }
  };

  const handleClearJson = () => {
    setJsonInput("");
    // setTsOutput(""); // This will be handled by useEffect
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);
    setActiveTsView("current");
  };

  const handleCopyTs = async () => {
    const codeToCopy = activeTsView === 'aiEnhanced' && acceptedAiSuggestionCode ? acceptedAiSuggestionCode : tsOutput;
    if (!codeToCopy.trim()) {
      toast({
        title: "Copy Error",
        description: "No TypeScript code to copy.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(codeToCopy);
      toast({
        title: "Copied!",
        description: `TypeScript (${activeTsView === 'aiEnhanced' ? 'AI Enhanced' : 'Current'}) copied to clipboard.`,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Error",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadFile = () => {
    const codeToDownload = activeTsView === 'aiEnhanced' && acceptedAiSuggestionCode ? acceptedAiSuggestionCode : tsOutput;
    const defaultFilename = activeTsView === 'aiEnhanced' 
      ? "ai-enhanced.ts" 
      : (outputFormat === "interface" ? "interfaces.ts" : "types.ts");

    if (!codeToDownload.trim()) {
      toast({
        title: "Download Error",
        description: "No TypeScript code to download.",
        variant: "destructive",
      });
      return;
    }
    const blob = new Blob([codeToDownload], {
      type: "text/typescript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `TypeScript file (${defaultFilename}) downloaded.`,
    });
  };


  const handleFetchAiSuggestions = async () => {
    if (!tsOutput.trim()) {
      toast({
        title: "AI Suggestions Error",
        description: "No TypeScript code to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsFetchingAiSuggestions(true);
    setAiSuggestions(null); 
    try {
      const result: SuggestTypescriptImprovementsOutput = await suggestTypescriptImprovements({ 
        typescriptCode: tsOutput,
        jsonInput: jsonInput // Provide original JSON for context
      });
      if (result.suggestions && result.suggestions.length > 0) {
        // Filter out suggestions that might be empty or problematic
        const validSuggestions = result.suggestions.filter(s => s.description && s.description.trim() !== "");
        if (validSuggestions.length > 0) {
            setAiSuggestions(validSuggestions);
        } else {
            // Case where AI returns an array but items are not usable
            setAiSuggestions([{ description: "No actionable suggestions found. The AI might have returned empty descriptions or encountered an issue.", isApplicable: false }]);
        }
      } else {
        // Case where AI returns an empty array or suggestions field is missing/null
        setAiSuggestions([{ description: "No specific improvements found by the AI or an error occurred.", isApplicable: false }]);
      }
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
      toast({
        title: "AI Suggestions Error",
        description: "Could not fetch suggestions from the AI. Please try again.",
        variant: "destructive",
      });
      setAiSuggestions([{ description: "Failed to load suggestions due to an error.", isApplicable: false }]); // Provide some feedback
    } finally {
      setIsFetchingAiSuggestions(false);
    }
  };

  const handleAcceptAiSuggestion = (suggestedCode: string) => {
    // DO NOT update tsOutput here. tsOutput should reflect the original conversion.
    // setTsOutput(suggestedCode); 
    setAcceptedAiSuggestionCode(suggestedCode);
    setActiveTsView("aiEnhanced");
    toast({
      title: "AI Suggestion Applied",
      description: "The TypeScript output has been updated. View in 'Enhanced' view.",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AppHeader />
        {isLoading && (
          <Progress
            value={progressValue}
            className="w-full h-1 fixed top-0 left-0 z-50 rounded-none bg-accent/30 [&>div]:bg-accent"
          />
        )}
        <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-1 flex-col md:flex-row gap-6 md:gap-8 items-stretch min-h-0 overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col">
            <JsonInputPanel
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
              isLoading={isLoading}
              onPaste={handlePasteJson}
              onFormat={handleFormatJson}
              onLoadExample={handleLoadExampleJson}
              onClear={handleClearJson}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <TypeScriptOutputPanel
              tsOutput={tsOutput}
              onDownloadTs={handleDownloadFile} // This will be the generic download, panel will decide what to download
              onCopyTs={handleCopyTs} // Generic copy
              isLoading={isLoading}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              aiSuggestions={aiSuggestions}
              isFetchingAiSuggestions={isFetchingAiSuggestions}
              onFetchAiSuggestions={handleFetchAiSuggestions}
              onAcceptAiSuggestion={handleAcceptAiSuggestion}
              acceptedAiSuggestionCode={acceptedAiSuggestionCode}
              activeTsView={activeTsView}
              setActiveTsView={setActiveTsView}
            />
          </div>
        </main>
        <footer className="py-4 text-center text-xs text-muted-foreground border-t">
          Crafted by Saleh Shakib with Firebase Studio.
        </footer>
      </div>
    </TooltipProvider>
  );
}
