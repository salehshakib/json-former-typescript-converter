
"use client";

import { useState, useEffect } from 'react';
import AppHeader from '@/components/json-former/app-header';
import JsonInputPanel from '@/components/json-former/json-input-panel';
import TypeScriptOutputPanel from '@/components/json-former/typescript-output-panel';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { convertJsonToTs } from '@/lib/json-to-ts';
import { suggestTypescriptImprovements } from '@/ai/flows/suggest-improvements';

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
        lng: "81.1496"
      }
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets"
    }
  },
  posts: [
    {
      userId: 1,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto"
    }
  ],
  isActive: true,
  tags: ["json", "typescript", "converter"]
};

export default function JsonFormerPage() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [tsOutput, setTsOutput] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const { toast } = useToast();

  const handleLoadExampleJson = () => {
    setJsonInput(JSON.stringify(EXAMPLE_JSON, null, 2));
    toast({
      title: "Example Loaded",
      description: "Sample JSON has been loaded into the input area.",
    });
  };

  useEffect(() => {
    // Load example JSON on initial mount
    handleLoadExampleJson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleConvert = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Input Error",
        description: "JSON input cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTsOutput('');
    setAiSuggestions('');
    setProgressValue(10);

    await new Promise(resolve => setTimeout(resolve, 200));
    setProgressValue(30);

    const conversionResult = convertJsonToTs(jsonInput);

    if (conversionResult.error) {
      toast({
        title: "Conversion Error",
        description: conversionResult.error,
        variant: "destructive",
      });
      setIsLoading(false);
      setProgressValue(0);
      return;
    }

    setTsOutput(conversionResult.typescriptCode);
    setProgressValue(60);

    if (conversionResult.typescriptCode) {
      try {
        setProgressValue(70);
        const aiResult = await suggestTypescriptImprovements({ typescriptCode: conversionResult.typescriptCode });
        setAiSuggestions(aiResult.suggestions);
        setProgressValue(100);
      } catch (aiError: any) {
        console.error("AI Suggestion Error:", aiError);
        setAiSuggestions("Could not fetch AI suggestions at this time.");
        toast({
          title: "AI Suggestion Error",
          description: "Failed to get AI suggestions. Please try again later.",
          variant: "destructive",
        });
        setProgressValue(100);
      }
    } else {
       setProgressValue(100);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleDownloadTs = () => {
    if (!tsOutput.trim()) {
      toast({
        title: "Download Error",
        description: "No TypeScript code to download.",
        variant: "destructive",
      });
      return;
    }
    const blob = new Blob([tsOutput], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'types.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "types.ts is being downloaded.",
    });
  };

  const handlePasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      toast({
        title: "Pasted from Clipboard",
        description: "JSON input has been updated.",
      });
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: "Paste Error",
        description: "Could not paste from clipboard. Check permissions or try manually.",
        variant: "destructive",
      });
    }
  };

  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsedJson, null, 2));
      toast({
        title: "JSON Formatted",
        description: "The JSON input has been beautified.",
      });
    } catch (error) {
      toast({
        title: "Format Error",
        description: "Invalid JSON. Could not format.",
        variant: "destructive",
      });
    }
  };

  const handleClearJson = () => {
    setJsonInput('');
    toast({
      title: "Input Cleared",
      description: "JSON input area has been cleared.",
    });
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
        title: "Copied to Clipboard",
        description: "TypeScript code has been copied.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Error",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      {isLoading && (
        <Progress value={progressValue} className="w-full h-1 fixed top-0 left-0 z-50 rounded-none bg-accent/30 [&>div]:bg-accent" />
      )}
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        <div className="w-full md:w-1/2 flex flex-col">
          <JsonInputPanel 
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            onConvert={handleConvert}
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
            aiSuggestions={aiSuggestions}
            onDownload={handleDownloadTs}
            onCopy={handleCopyTs}
            isLoading={isLoading}
            progressValue={progressValue} // Pass progressValue here
          />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Powered by AI & Next.js. &copy; {new Date().getFullYear()} JSONFormer.
      </footer>
    </div>
  );
}
