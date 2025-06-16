
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

export default function JsonFormerPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [tsOutput, setTsOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("interface");
  const [aiSuggestions, setAiSuggestions] = useState<SuggestionItem[] | null>(null);
  const [isFetchingAiSuggestions, setIsFetchingAiSuggestions] = useState<boolean>(false);
  const [acceptedAiSuggestionCode, setAcceptedAiSuggestionCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLoadExampleJson = () => {
    const exampleJsonString = JSON.stringify(EXAMPLE_JSON, null, 2);
    setJsonInput(exampleJsonString);
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);
  };

  const memoizedHandleConvert = useCallback(
    async (currentJsonInput: string, currentOutputFormat: OutputFormat) => {
      setAiSuggestions(null); 
      setAcceptedAiSuggestionCode(null);
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
      setIsLoading(false);
      setProgressValue(0);
      return;
    }
    
    // Clear accepted AI suggestion when input changes before new conversion
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);


    const handler = setTimeout(() => {
      memoizedHandleConvert(currentInput, currentFormat);
    }, 750); 

    return () => {
      clearTimeout(handler);
    };
  }, [jsonInput, outputFormat, memoizedHandleConvert]);

  const handleDownloadTs = () => {
    if (!tsOutput.trim()) {
      toast({
        title: "Download Error",
        description: "No TypeScript code to download.",
        variant: "destructive",
      });
      return;
    }
    const blob = new Blob([tsOutput], {
      type: "text/typescript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename =
      outputFormat === "interface" ? "interfaces.ts" : "types.ts";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setAcceptedAiSuggestionCode(null);
      setAiSuggestions(null);
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
      setAcceptedAiSuggestionCode(null);
      setAiSuggestions(null);
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
    setAcceptedAiSuggestionCode(null);
    setAiSuggestions(null);
  };

  const handleCopyTs = async () => {
    if (!tsOutput.trim()) {
      toast({
        title: "Copy Error",
        description: "No TypeScript code to copy.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(tsOutput);
      toast({
        title: "Copied!",
        description: "Current TypeScript output copied to clipboard.",
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
    setAiSuggestions(null); // Clear previous suggestions before fetching new ones
    try {
      const result: SuggestTypescriptImprovementsOutput = await suggestTypescriptImprovements({ 
        typescriptCode: tsOutput,
        jsonInput: jsonInput 
      });
      if (result.suggestions && result.suggestions.length > 0) {
        const validSuggestions = result.suggestions.filter(s => s.description && s.description.trim() !== "");
        if (validSuggestions.length > 0) {
            setAiSuggestions(validSuggestions);
        } else {
            setAiSuggestions([{ description: "No actionable suggestions found. The AI might have returned empty descriptions or encountered an issue.", isApplicable: false }]);
        }
      } else {
        setAiSuggestions([{ description: "No specific improvements found by the AI or an error occurred.", isApplicable: false }]);
      }
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
      toast({
        title: "AI Suggestions Error",
        description: "Could not fetch suggestions from the AI. Please try again.",
        variant: "destructive",
      });
      setAiSuggestions([{ description: "Failed to load suggestions due to an error.", isApplicable: false }]);
    } finally {
      setIsFetchingAiSuggestions(false);
    }
  };

  const handleAcceptAiSuggestion = (suggestedCode: string) => {
    setTsOutput(suggestedCode);
    setAcceptedAiSuggestionCode(suggestedCode);
    toast({
      title: "AI Suggestion Applied",
      description: "The TypeScript output has been updated. View in 'Current Output' or 'AI Enhanced' tab.",
    });
  };

  const handleCopyAiSuggestedTs = async () => {
    if (!acceptedAiSuggestionCode || !acceptedAiSuggestionCode.trim()) {
      toast({
        title: "Copy Error",
        description: "No AI enhanced TypeScript code to copy.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(acceptedAiSuggestionCode);
      toast({
        title: "Copied!",
        description: "AI enhanced TypeScript copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy AI enhanced text: ", err);
      toast({
        title: "Copy Error",
        description: "Could not copy AI enhanced code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAiSuggestedTs = () => {
    if (!acceptedAiSuggestionCode || !acceptedAiSuggestionCode.trim()) {
      toast({
        title: "Download Error",
        description: "No AI enhanced TypeScript code to download.",
        variant: "destructive",
      });
      return;
    }
    const blob = new Blob([acceptedAiSuggestionCode], {
      type: "text/typescript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-enhanced.ts";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "AI enhanced TypeScript file downloaded.",
    });
  };


  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background text-foreground">
        <AppHeader />
        {isLoading && (
          <Progress
            value={progressValue}
            className="w-full h-1 fixed top-0 left-0 z-50 rounded-none bg-accent/30 [&>div]:bg-accent"
          />
        )}
        <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-1 flex-col md:flex-row gap-6 md:gap-8 items-stretch min-h-0">
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
              onDownloadCurrentTs={handleDownloadTs}
              onCopyCurrentTs={handleCopyTs}
              isLoading={isLoading}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              aiSuggestions={aiSuggestions}
              isFetchingAiSuggestions={isFetchingAiSuggestions}
              onFetchAiSuggestions={handleFetchAiSuggestions}
              onAcceptAiSuggestion={handleAcceptAiSuggestion}
              acceptedAiSuggestionCode={acceptedAiSuggestionCode}
              onCopyAiSuggestedTs={handleCopyAiSuggestedTs}
              onDownloadAiSuggestedTs={handleDownloadAiSuggestedTs}
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
