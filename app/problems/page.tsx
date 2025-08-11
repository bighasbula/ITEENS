'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Play, Target } from 'lucide-react';
import Link from 'next/link';
import { getAllProblems } from '@/lib/problems';

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const allProblems = getAllProblems();
  
  // Get all unique tags
  const allTags = Array.from(new Set(allProblems.flatMap(problem => problem.tags))).sort();

  // Filter problems based on search, difficulty, and tags
  const filteredProblems = allProblems.filter(problem => {
    const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'all' || problem.tags.includes(tagFilter);
    
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Practice Problems</h1>
          </div>
          <p className="text-xl text-muted-foreground">Choose a problem to solve and improve your coding skills</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('all');
                setTagFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{problem.name}</CardTitle>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {problem.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {problem.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{problem.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Sample Input/Output */}
                <div className="bg-muted p-3 rounded text-xs mb-4">
                  <div className="font-semibold mb-1 text-card-foreground">Sample:</div>
                  <div className="text-muted-foreground">
                    <div>Input: {problem.sampleInput}</div>
                    <div>Output: {problem.sampleOutput}</div>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/problem?id=${problem.id}`}>
                  <Button className="w-full" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Solving
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No problems found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-primary mb-2">{allProblems.length}</div>
              <div className="text-muted-foreground">Total Problems</div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-primary mb-2">
                {allProblems.filter(p => p.difficulty === 'Easy').length}
              </div>
              <div className="text-muted-foreground">Beginner Friendly</div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-primary mb-2">{allTags.length}</div>
              <div className="text-muted-foreground">Topics Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
