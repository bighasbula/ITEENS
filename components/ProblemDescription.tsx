'use client';

import { Badge } from '@/components/ui/badge';
import { Problem } from '@/lib/problems';

interface ProblemDescriptionProps {
  problem: Problem;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Problem Title and Stats */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{problem.name}</h1>
          <Badge 
            variant="secondary" 
            className={
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }
          >
            {problem.difficulty}
          </Badge>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>📊 Beginner Friendly</span>
          <span>⏱️ 5-10 min</span>
          <span>💡 Practice Problem</span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="space-y-4">
        <p className="text-foreground leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* Sample Input/Output */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sample Input/Output:</h3>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="space-y-2 text-sm">
            <div><strong>Input:</strong> <code className="bg-background px-2 py-1 rounded">{problem.sampleInput}</code></div>
            <div><strong>Output:</strong> <code className="bg-background px-2 py-1 rounded">{problem.sampleOutput}</code></div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-accent">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tips for Beginners */}
      <div className="bg-accent/20 p-4 rounded-lg">
        <h4 className="font-semibold text-accent-foreground mb-2">💡 Tips for Beginners:</h4>
        <ul className="text-accent-foreground text-sm space-y-1">
          <li>• Read the problem description carefully</li>
          <li>• Start with simple examples</li>
          <li>• Test your code with the sample input</li>
          <li>• Don&apos;t worry if it takes time - learning is a process!</li>
        </ul>
      </div>
    </div>
  );
}
