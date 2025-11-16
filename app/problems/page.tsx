'use client';

import { useUser } from '@/lib/hooks/useUser';
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
  const { userId } = useUser();

  const allProblems = getAllProblems();
  
  // Get all unique tags
  const allTags = Array.from(new Set(allProblems.flatMap(problem => problem.tags))).sort();

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view the problems.</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Target className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-foreground">Practice Problems</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Choose a problem to solve and improve your coding skills</p>
        </div>

        {/* Filters */}
        <div className="bg-card/50 backdrop-blur-sm rounded-md shadow-sm p-3 sm:p-4 mb-4 sm:mb-5 border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs sm:text-sm bg-background/50 border-border/50 focus:border-border font-body"
              />
            </div>

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="h-8 text-xs sm:text-sm border-border/50 bg-background/50 focus:border-border font-body">
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
              <SelectTrigger className="h-8 text-xs sm:text-sm border-border/50 bg-background/50 focus:border-border font-body">
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
              className="h-8 text-xs sm:text-sm border-border/50 hover:scale-[1.02] transition-transform font-body"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-3 sm:p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm sm:text-base mb-2 font-heading">{problem.name}</CardTitle>
                    <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-2">
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 font-body">
                  {problem.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {problem.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-border/50 font-body">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border/50 font-body">
                      +{problem.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Sample Input/Output */}
                <div className="bg-muted/30 p-2 rounded-md text-xs mb-3 font-body">
                  <div className="font-medium mb-1 text-foreground font-heading">Sample:</div>
                  <div className="text-muted-foreground space-y-0.5">
                    <div>Input: {problem.sampleInput}</div>
                    <div>Output: {problem.sampleOutput}</div>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/problem?id=${problem.id}`}>
                  <Button className="w-full text-xs h-8 hover:scale-[1.02] transition-transform" size="sm">
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Start Solving
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base font-medium font-heading text-muted-foreground mb-1">No problems found</h3>
            <p className="text-muted-foreground text-xs sm:text-sm font-body">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card/50 backdrop-blur-sm rounded-md p-3 sm:p-4 shadow-sm border border-border/50 card-hover">
              <div className="text-xl sm:text-2xl font-heading text-primary mb-1">{allProblems.length}</div>
              <div className="text-muted-foreground text-xs sm:text-sm font-body">Total Problems</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-md p-3 sm:p-4 shadow-sm border border-border/50 card-hover">
              <div className="text-xl sm:text-2xl font-heading text-primary mb-1">
                {allProblems.filter(p => p.difficulty === 'Easy').length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm font-body">Beginner Friendly</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-md p-3 sm:p-4 shadow-sm border border-border/50 card-hover">
              <div className="text-xl sm:text-2xl font-heading text-primary mb-1">{allTags.length}</div>
              <div className="text-muted-foreground text-xs sm:text-sm font-body">Topics Covered</div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
