'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DemoSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Demo data for testing the success page
    const demoData = {
      problemId: 'two-sum',
      language: 'python' as const,
      code: `def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []

# Read input
input_line = input()
nums = ast.literal_eval(input_line)
target = int(input())

# Call function and print result
result = twoSum(nums, target)
print(result)`,
      executionTime: '0.002',
      memory: 15,
      testCasesPassed: 5,
      totalTestCases: 5,
      timestamp: new Date().toISOString(),
    };

    const encodedData = encodeURIComponent(JSON.stringify(demoData));
    router.push(`/success?data=${encodedData}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to success page...</p>
        <Button 
          onClick={() => router.push('/problem')}
          className="mt-4"
        >
          Go to Problem Instead
        </Button>
      </div>
    </div>
  );
}
