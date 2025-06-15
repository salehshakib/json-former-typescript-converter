"use client";

import { useState, useEffect } from 'react';
import AppHeader from '@/components/json-former/app-header';
import JsonInputPanel from '@/components/json-former/json-input-panel';
import TypeScriptOutputPanel from '@/components/json-former/typescript-output-panel';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { convertJsonToTs } from '@/lib/json-to-ts';
import { suggestTypescriptImprovements } from '@/ai/flows/suggest-improvements';

export default function JsonFormerPage() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [tsOutput, setTsOutput] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Example JSON for quick testing
    const exampleJson = {
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
    setJsonInput(JSON.stringify(exampleJson, null, 2));
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

    // Simulate parsing delay
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
        setProgressValue(100); // Still complete the progress bar
      }
    } else {
       setProgressValue(100); // No TS code to suggest on
    }
    
    setTimeout(() => {
      setIsLoading(false);
      // Optionally reset progress after a delay if you want it to disappear
      // setTimeout(() => setProgressValue(0), 1000); 
    }, 500); // Keep 100% for a bit
  };

  const handleDownload = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      {isLoading && (
        <Progress value={progressValue} className="w-full h-1 fixed top-0 left-0 z-50 rounded-none bg-accent/30 [&>div]:bg-accent" />
      )}
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        <div className="w-full md:w-1/2 flex">
          <JsonInputPanel 
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            onConvert={handleConvert}
            isLoading={isLoading}
          />
        </div>
        <div className="w-full md:w-1/2 flex">
          <TypeScriptOutputPanel
            tsOutput={tsOutput}
            aiSuggestions={aiSuggestions}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Powered by AI & Next.js. &copy; {new Date().getFullYear()} JSONFormer.
      </footer>
    </div>
  );
}
