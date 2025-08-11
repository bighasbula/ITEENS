'use client';

interface TerminalProps {
  output: string;
}

export default function Terminal({ output }: TerminalProps) {
  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-muted-foreground">Terminal</span>
      </div>
      
      <div className="whitespace-pre-wrap">
        {output || (
          <span className="text-muted-foreground">
            Click &quot;Run&quot; to test your code and
            click &quot;Submit&quot; to submit your code...
          </span>
        )}
      </div>
      
      {output && (
        <div className="mt-4 text-muted-foreground">
          <span className="text-green-400">$</span> Ready for next command
        </div>
      )}
    </div>
  );
}
