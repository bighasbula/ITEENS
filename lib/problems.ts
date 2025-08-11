import { SupportedLanguage } from './judge0';

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  sampleInput: string;
  sampleOutput: string;
  tags: string[];
  idealSolution: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  testCases: TestCase[];
  defaultCode: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  explanation?: string;
  videoUrl?: string;
}

// Beginner-friendly problems with pre-stored ideal solutions
export const PROBLEMS: Problem[] = [
  {
    id: "sleep-in",
    name: "Sleep In",
    difficulty: "Easy",
    description: "You can sleep in if it's not a weekday or you're on vacation. Write a function sleep_in(weekday, vacation).",
    sampleInput: "sleep_in(False, False)",
    sampleOutput: "True",
    tags: ["booleans", "conditionals"],
    idealSolution: {
      python: "def sleep_in(weekday, vacation):\n    return not weekday or vacation",
      javascript: "function sleepIn(weekday, vacation) {\n    return !weekday || vacation;\n}",
      java: "public static boolean sleepIn(boolean weekday, boolean vacation) {\n    return !weekday || vacation;\n}",
      cpp: "bool sleepIn(bool weekday, bool vacation) {\n    return !weekday || vacation;\n}"
    },
    testCases: [
      { input: "False\nFalse", expectedOutput: "true" },
      { input: "True\nFalse", expectedOutput: "false" },
      { input: "False\nTrue", expectedOutput: "true" },
      { input: "True\nTrue", expectedOutput: "true" }
    ],
    defaultCode: {
      python: `def sleep_in(weekday, vacation):
    # Your code here
    pass

# Read input
weekday = input().lower() == 'true'
vacation = input().lower() == 'true'

# Call function and print result
result = sleep_in(weekday, vacation)
print(result)`,
      javascript: `function sleepIn(weekday, vacation) {
    // Your code here
}

// Read input
const weekday = readline() === 'true';
const vacation = readline() === 'true';

// Call function and print result
const result = sleepIn(weekday, vacation);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static boolean sleepIn(boolean weekday, boolean vacation) {
        // Your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean weekday = scanner.nextBoolean();
        boolean vacation = scanner.nextBoolean();
        
        boolean result = sleepIn(weekday, vacation);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool sleepIn(bool weekday, bool vacation) {
    // Your code here
    return false;
}

int main() {
    string weekdayStr, vacationStr;
    cin >> weekdayStr >> vacationStr;
    
    bool weekday = (weekdayStr == "true");
    bool vacation = (vacationStr == "true");
    
    bool result = sleepIn(weekday, vacation);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`
    }
  },
  {
    id: "monkey-trouble",
    name: "Monkey Trouble",
    difficulty: "Easy",
    description: "We have two monkeys, a and b. We are in trouble if both are smiling or both are not smiling.",
    sampleInput: "monkey_trouble(True, True)",
    sampleOutput: "True",
    tags: ["booleans", "logic"],
    idealSolution: {
      python: "def monkey_trouble(a_smile, b_smile):\n    return a_smile == b_smile",
      javascript: "function monkeyTrouble(aSmile, bSmile) {\n    return aSmile === bSmile;\n}",
      java: "public static boolean monkeyTrouble(boolean aSmile, boolean bSmile) {\n    return aSmile == bSmile;\n}",
      cpp: "bool monkeyTrouble(bool aSmile, bool bSmile) {\n    return aSmile == bSmile;\n}"
    },
    testCases: [
      { input: "True\nTrue", expectedOutput: "true" },
      { input: "False\nFalse", expectedOutput: "true" },
      { input: "True\nFalse", expectedOutput: "false" },
      { input: "False\nTrue", expectedOutput: "false" }
    ],
    defaultCode: {
      python: `def monkey_trouble(a_smile, b_smile):
    # Your code here
    pass

# Read input
a_smile = input().lower() == 'true'
b_smile = input().lower() == 'true'

# Call function and print result
result = monkey_trouble(a_smile, b_smile)
print(result)`,
      javascript: `function monkeyTrouble(aSmile, bSmile) {
    // Your code here
}

// Read input
const aSmile = readline() === 'true';
const bSmile = readline() === 'true';

// Call function and print result
const result = monkeyTrouble(aSmile, bSmile);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static boolean monkeyTrouble(boolean aSmile, boolean bSmile) {
        // Your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean aSmile = scanner.nextBoolean();
        boolean bSmile = scanner.nextBoolean();
        
        boolean result = monkeyTrouble(aSmile, bSmile);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool monkeyTrouble(bool aSmile, bool bSmile) {
    // Your code here
    return false;
}

int main() {
    string aSmileStr, bSmileStr;
    cin >> aSmileStr >> bSmileStr;
    
    bool aSmile = (aSmileStr == "true");
    bool bSmile = (bSmileStr == "true");
    
    bool result = monkeyTrouble(aSmile, bSmile);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`
    },
    explanation: "We need to check if both monkeys are smiling or not. If both are smiling or both are not smiling, we are in trouble. Otherwise, we are not in trouble.",
    videoUrl: "https://youtu.be/b1i3u2lsT78?si=Fpef-BF0i1U4v7NJ"
  },
  {
    id: "sum-double",
    name: "Sum Double",
    difficulty: "Easy",
    description: "Given two int values, return their sum. If the values are the same, return double their sum.",
    sampleInput: "sum_double(1, 2)",
    sampleOutput: "3",
    tags: ["math", "conditionals"],
    idealSolution: {
      python: "def sum_double(a, b):\n    return a + b if a != b else 2 * (a + b)",
      javascript: "function sumDouble(a, b) {\n    return a === b ? 2 * (a + b) : a + b;\n}",
      java: "public static int sumDouble(int a, int b) {\n    return a == b ? 2 * (a + b) : a + b;\n}",
      cpp: "int sumDouble(int a, int b) {\n    return a == b ? 2 * (a + b) : a + b;\n}"
    },
    testCases: [
      { input: "1\n2", expectedOutput: "3" },
      { input: "3\n2", expectedOutput: "5" },
      { input: "2\n2", expectedOutput: "8" },
      { input: "-1\n0", expectedOutput: "-1" },
      { input: "3\n3", expectedOutput: "12" }
    ],
    defaultCode: {
      python: `def sum_double(a, b):
    # Your code here
    pass

# Read input
a = int(input())
b = int(input())

# Call function and print result
result = sum_double(a, b)
print(result)`,
      javascript: `function sumDouble(a, b) {
    // Your code here
}

// Read input
const a = parseInt(readline());
const b = parseInt(readline());

// Call function and print result
const result = sumDouble(a, b);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static int sumDouble(int a, int b) {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        
        int result = sumDouble(a, b);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int sumDouble(int a, int b) {
    // Your code here
    return 0;
}

int main() {
    int a, b;
    cin >> a >> b;
    
    int result = sumDouble(a, b);
    cout << result << endl;
    
    return 0;
}`
    }
  },
  {
    id: "diff21",
    name: "Diff21",
    difficulty: "Easy",
    description: "Given an int n, return the absolute difference between n and 21, except return double the absolute difference if n is over 21.",
    sampleInput: "diff21(19)",
    sampleOutput: "2",
    tags: ["math", "abs"],
    idealSolution: {
      python: "def diff21(n):\n    return abs(n - 21) if n <= 21 else 2 * abs(n - 21)",
      javascript: "function diff21(n) {\n    return n <= 21 ? Math.abs(n - 21) : 2 * Math.abs(n - 21);\n}",
      java: "public static int diff21(int n) {\n    return n <= 21 ? Math.abs(n - 21) : 2 * Math.abs(n - 21);\n}",
      cpp: "int diff21(int n) {\n    return n <= 21 ? abs(n - 21) : 2 * abs(n - 21);\n}"
    },
    testCases: [
      { input: "19", expectedOutput: "2" },
      { input: "10", expectedOutput: "11" },
      { input: "21", expectedOutput: "0" },
      { input: "22", expectedOutput: "2" },
      { input: "25", expectedOutput: "8" },
      { input: "30", expectedOutput: "18" }
    ],
    defaultCode: {
      python: `def diff21(n):
    # Your code here
    pass

# Read input
n = int(input())

# Call function and print result
result = diff21(n)
print(result)`,
      javascript: `function diff21(n) {
    // Your code here
}

// Read input
const n = parseInt(readline());

// Call function and print result
const result = diff21(n);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static int diff21(int n) {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        int result = diff21(n);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
#include <cstdlib>
using namespace std;

int diff21(int n) {
    // Your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    
    int result = diff21(n);
    cout << result << endl;
    
    return 0;
}`
    }
  },
  {
    id: "parrot-trouble",
    name: "Parrot Trouble",
    difficulty: "Easy",
    description: "We are in trouble if the parrot is talking and the hour is before 7 or after 20.",
    sampleInput: "parrot_trouble(True, 6)",
    sampleOutput: "True",
    tags: ["booleans", "time"],
    idealSolution: {
      python: "def parrot_trouble(talking, hour):\n    return talking and (hour < 7 or hour > 20)",
      javascript: "function parrotTrouble(talking, hour) {\n    return talking && (hour < 7 || hour > 20);\n}",
      java: "public static boolean parrotTrouble(boolean talking, int hour) {\n    return talking && (hour < 7 || hour > 20);\n}",
      cpp: "bool parrotTrouble(bool talking, int hour) {\n    return talking && (hour < 7 || hour > 20);\n}"
    },
    testCases: [
      { input: "True\n6", expectedOutput: "true" },
      { input: "True\n7", expectedOutput: "false" },
      { input: "False\n6", expectedOutput: "false" },
      { input: "True\n21", expectedOutput: "true" },
      { input: "False\n21", expectedOutput: "false" },
      { input: "True\n23", expectedOutput: "true" },
      { input: "True\n20", expectedOutput: "false" }
    ],
    defaultCode: {
      python: `def parrot_trouble(talking, hour):
    # Your code here
    pass

# Read input
talking = input().lower() == 'true'
hour = int(input())

# Call function and print result
result = parrot_trouble(talking, hour)
print(result)`,
      javascript: `function parrotTrouble(talking, hour) {
    // Your code here
}

// Read input
const talking = readline() === 'true';
const hour = parseInt(readline());

// Call function and print result
const result = parrotTrouble(talking, hour);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static boolean parrotTrouble(boolean talking, int hour) {
        // Your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean talking = scanner.nextBoolean();
        int hour = scanner.nextInt();
        
        boolean result = parrotTrouble(talking, hour);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool parrotTrouble(bool talking, int hour) {
    // Your code here
    return false;
}

int main() {
    string talkingStr;
    int hour;
    cin >> talkingStr >> hour;
    
    bool talking = (talkingStr == "true");
    
    bool result = parrotTrouble(talking, hour);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`
    }
  },
  {
    id: "string-times",
    name: "String Times",
    difficulty: "Medium",
    description: "Given a string and a non-negative int n, return a larger string that is n copies of the original string. Write a function string_times(str, n).",
    sampleInput: "string_times('Hi', 3)",
    sampleOutput: "HiHiHi",
    tags: ["strings", "loops"],
    idealSolution: {
      python: "def string_times(str, n):\n    return str * n",
      javascript: "function stringTimes(str, n) {\n    return str.repeat(n);\n}",
      java: "public static String stringTimes(String str, int n) {\n    return str.repeat(n);\n}",
      cpp: "string stringTimes(string str, int n) {\n    string result = \"\";\n    for (int i = 0; i < n; i++) {\n        result += str;\n    }\n    return result;\n}"
    },
    testCases: [
      { input: "Hi\n3", expectedOutput: "HiHiHi" },
      { input: "Hi\n1", expectedOutput: "Hi" },
      { input: "Hi\n0", expectedOutput: "" }
    ],
    defaultCode: {
      python: `def string_times(str, n):
    # Your code here
    pass

# Read input
str_val = input()
n = int(input())

# Call function and print result
result = string_times(str_val, n)
print(result)`,
      javascript: `function stringTimes(str, n) {
    // Your code here
}

// Read input
const strVal = readline();
const n = parseInt(readline(), 10);

// Call function and print result
const result = stringTimes(strVal, n);
console.log(result);`,
      java: `import java.util.*;

public class Main {
    public static String stringTimes(String str, int n) {
        // Your code here
        return "";
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String strVal = scanner.nextLine();
        int n = scanner.nextInt();
        
        String result = stringTimes(strVal, n);
        System.out.println(result);
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

string stringTimes(string str, int n) {
    // Your code here
    return "";
}

int main() {
    string strVal;
    int n;
    getline(cin, strVal);
    cin >> n;
    
    string result = stringTimes(strVal, n);
    cout << result << endl;
    
    return 0;
}`
    }
  },
  
    {
      id: "front-times",
      name: "Front Times",
      difficulty: "Medium",
      description: "Given a string and a non-negative int n, we'll say that the 'front' of the string is the first 3 chars, or whatever is there if the string is less than length 3. Return n copies of the front.",
      sampleInput: "front_times('Chocolate', 2)",
      sampleOutput: "ChoCho",
      tags: ["strings", "loops"],
      idealSolution: {
        python: "def front_times(str, n):\n    front_len = 3 if len(str) >= 3 else len(str)\n    front = str[:front_len]\n    return front * n",
        javascript: "function frontTimes(str, n) {\n    const frontLen = str.length >= 3 ? 3 : str.length;\n    const front = str.substring(0, frontLen);\n    return front.repeat(n);\n}",
        java: "public static String frontTimes(String str, int n) {\n    int frontLen = str.length() >= 3 ? 3 : str.length();\n    String front = str.substring(0, frontLen);\n    return front.repeat(n);\n}",
        cpp: "string frontTimes(string str, int n) {\n    int frontLen = str.length() >= 3 ? 3 : str.length();\n    string front = str.substr(0, frontLen);\n    string result = \"\";\n    for (int i = 0; i < n; i++) {\n        result += front;\n    }\n    return result;\n}"
      },
      testCases: [
        { input: "Chocolate\n2", expectedOutput: "ChoCho" },
        { input: "Chocolate\n3", expectedOutput: "ChoChoCho" },
        { input: "Abc\n3", expectedOutput: "AbcAbcAbc" },
        { input: "Hi\n4", expectedOutput: "HiHiHiHi" }
      ],
      defaultCode: {
        python: `def front_times(str, n):
        # Your code here
        pass
    
    # Read input
    s = input()
    n = int(input())
    
    # Call function and print result
    result = front_times(s, n)
    print(result)`,
        javascript: `function frontTimes(str, n) {
        // Your code here
    }
    
    // Read input
    const s = readline();
    const n = parseInt(readline());
    
    // Call function and print result
    const result = frontTimes(s, n);
    console.log(result);`,
        java: `import java.util.*;
    
    public class Main {
        public static String frontTimes(String str, int n) {
            // Your code here
            return "";
        }
        
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            String s = scanner.nextLine();
            int n = scanner.nextInt();
            
            String result = frontTimes(s, n);
            System.out.println(result);
        }
    }`,
        cpp: `#include <iostream>
    #include <string>
    using namespace std;
    
    string frontTimes(string str, int n) {
        // Your code here
        return "";
    }
    
    int main() {
        string s;
        int n;
        getline(cin, s);
        cin >> n;
        
        string result = frontTimes(s, n);
        cout << result << endl;
        
        return 0;
    }`
      }
    },
    {
      id: "array-123",
      name: "Array 123",
      difficulty: "Medium",
      description: "Given an array of integers, return True if the sequence of numbers 1, 2, 3 appears in the array somewhere.",
      sampleInput: "array123([1, 1, 2, 3, 1])",
      sampleOutput: "True",
      tags: ["arrays", "loops", "conditionals"],
      idealSolution: {
      python: "def array123(nums):\n    for i in range(len(nums) - 2):\n        if nums[i] == 1 and nums[i+1] == 2 and nums[i+2] == 3:\n            return True\n    return False",
      javascript: "function array123(nums) {\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (nums[i] === 1 && nums[i+1] === 2 && nums[i+2] === 3) {\n            return true;\n        }\n    }\n    return false;\n}",
      java: "public static boolean array123(int[] nums) {\n    for (int i = 0; i < nums.length - 2; i++) {\n        if (nums[i] == 1 && nums[i+1] == 2 && nums[i+2] == 3) {\n            return true;\n        }\n    }\n    return false;\n}",
      cpp: "bool array123(vector<int>& nums) {\n    for (int i = 0; i < nums.size() - 2; i++) {\n        if (nums[i] == 1 && nums[i+1] == 2 && nums[i+2] == 3) {\n            return true;\n        }\n    }\n    return false;\n}"
    },
      testCases: [
        { input: "1 1 2 3 1", expectedOutput: "true" },
        { input: "1 1 2 4 1", expectedOutput: "false" },
        { input: "1 1 2 1 2 3", expectedOutput: "true" },
        { input: "3 2 1 2 3", expectedOutput: "true" }
      ],
      defaultCode: {
        python: `def array123(nums):
        # Your code here
        pass
    
    # Read input
    nums = list(map(int, input().split()))
    
    # Call function and print result
    result = array123(nums)
    print(result)`,
        javascript: `function array123(nums) {
        // Your code here
    }
    
    // Read input
    const nums = readline().split(" ").map(Number);
    
    // Call function and print result
    const result = array123(nums);
    console.log(result);`,
        java: `import java.util.*;
    
    public class Main {
        public static boolean array123(int[] nums) {
            // Your code here
            return false;
        }
        
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            String[] parts = scanner.nextLine().split(" ");
            int[] nums = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                nums[i] = Integer.parseInt(parts[i]);
            }
            
            boolean result = array123(nums);
            System.out.println(result);
        }
    }`,
        cpp: `#include <iostream>
    #include <vector>
    #include <string>
    #include <sstream>
    using namespace std;
    
    bool array123(vector<int> nums) {
        // Your code here
        return false;
    }
    
    int main() {
        string line;
        getline(cin, line);
        stringstream ss(line);
        vector<int> nums;
        int num;
        while (ss >> num) {
            nums.push_back(num);
        }
        
        bool result = array123(nums);
        cout << (result ? "true" : "false") << endl;
        
        return 0;
    }`
      }
    },
    {
      id: "same-first-last",
      name: "Same First Last",
      difficulty: "Medium",
      description: "Given an array of integers, return True if the array length is 1 or more, and the first element and the last element are the same.",
      sampleInput: "same_first_last([1, 2, 3, 1])",
      sampleOutput: "True",
      tags: ["arrays", "conditionals"],
      idealSolution: {
      python: "def same_first_last(nums):\n    return len(nums) >= 1 and nums[0] == nums[-1]",
      javascript: "function sameFirstLast(nums) {\n    return nums.length >= 1 && nums[0] === nums[nums.length - 1];\n}",
      java: "public static boolean sameFirstLast(int[] nums) {\n    return nums.length >= 1 && nums[0] == nums[nums.length - 1];\n}",
      cpp: "bool sameFirstLast(vector<int>& nums) {\n    return nums.size() >= 1 && nums[0] == nums[nums.size() - 1];\n}"
    },
      testCases: [
        { input: "1 2 3 1", expectedOutput: "True" },
        { input: "1 2 3", expectedOutput: "False" },
        { input: "7", expectedOutput: "True" },
        { input: "5 5 5 5", expectedOutput: "True" }
      ],
      defaultCode: {
        python: `def same_first_last(nums):
        # Your code here
        pass
    
# Read input
nums = list(map(int, input().split()))
    
# Call function and print result
result = same_first_last(nums)
print(result)`,
        javascript: `function sameFirstLast(nums) {
        // Your code here
    }
    
    // Read input
    const nums = readline().split(" ").map(Number);
    
    // Call function and print result
    const result = sameFirstLast(nums);
    console.log(result);`,
        java: `import java.util.*;
    
    public class Main {
        public static boolean sameFirstLast(int[] nums) {
            // Your code here
            return false;
        }
        
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            String[] parts = scanner.nextLine().split(" ");
            int[] nums = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                nums[i] = Integer.parseInt(parts[i]);
            }
            
            boolean result = sameFirstLast(nums);
            System.out.println(result);
        }
    }`,
        cpp: `#include <iostream>
    #include <vector>
    #include <string>
    #include <sstream>
    using namespace std;
    
    bool sameFirstLast(vector<int> nums) {
        // Your code here
        return false;
    }
    
    int main() {
        string line;
        getline(cin, line);
        stringstream ss(line);
        vector<int> nums;
        int num;
        while (ss >> num) {
            nums.push_back(num);
        }
        
        bool result = sameFirstLast(nums);
        cout << (result ? "true" : "false") << endl;
        
        return 0;
    }`
      }
    }
    
    
    

];

// Legacy support - keep the old TWO_SUM_PROBLEM for backward compatibility
export const TWO_SUM_PROBLEM: Problem = {
  id: "two-sum",
  name: "Two Sum",
  difficulty: "Hard",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  sampleInput: "[2, 7, 11, 15]\n9",
  sampleOutput: "[0, 1]",
  tags: ["arrays", "hash-table"],
  idealSolution: {
    python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    javascript: `function twoSum(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in seen) {
            return [seen[complement], i];
        }
        seen[nums[i]] = i;
    }
    return [];
}`,
    java: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`
  },
  testCases: [
    { input: "[2, 7, 11, 15]\n9", expectedOutput: "[0, 1]" },
    { input: "[3, 2, 4]\n6", expectedOutput: "[1, 2]" },
    { input: "[3, 3]\n6", expectedOutput: "[0, 1]" },
    { input: "[1, 5, 8, 10, 13]\n18", expectedOutput: "[2, 4]" },
    { input: "[0, 4, 3, 0]\n0", expectedOutput: "[0, 3]" }
  ],
  defaultCode: {
    python: `import ast

def twoSum(nums, target):
    # Your code here
    pass

# Read input
input_line = input()
nums = ast.literal_eval(input_line)
target = int(input())

# Call function and print result
result = twoSum(nums, target)
print(result)`,
    javascript: `function twoSum(nums, target) {
    // Your code here
}

// Read input
const inputLine = readline();
const nums = JSON.parse(inputLine);
const target = parseInt(readline());

// Call function and print result
const result = twoSum(nums, target);
console.log(JSON.stringify(result));`,
          java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[0];
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String inputLine = scanner.nextLine();
        String[] numStrings = inputLine.substring(1, inputLine.length() - 1).split(",");
        int[] nums = new int[numStrings.length];
        for (int i = 0; i < numStrings.length; i++) {
            nums[i] = Integer.parseInt(numStrings[i].trim());
        }
        int target = scanner.nextInt();
        
        int[] result = twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}

int main() {
    string inputLine;
    getline(cin, inputLine);
    
    // Parse [1,2,3] format
    inputLine = inputLine.substr(1, inputLine.length() - 2); // Remove [ and ]
    stringstream ss(inputLine);
    vector<int> nums;
    string item;
    
    while (getline(ss, item, ',')) {
        nums.push_back(stoi(item));
    }
    
    int target;
    cin >> target;
    
    vector<int> result = twoSum(nums, target);
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    return 0;
}`
  }
};

// Helper function to get a problem by ID
export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find(problem => problem.id === id) || 
         (id === "two-sum" ? TWO_SUM_PROBLEM : undefined);
}

// Helper function to get all problems
export function getAllProblems(): Problem[] {
  return [...PROBLEMS, TWO_SUM_PROBLEM];
}

// Helper function to get problems by difficulty


// Helper function to get ideal solution in specific language
export function getIdealSolution(problem: Problem, language: SupportedLanguage): string {
  return problem.idealSolution[language] || problem.idealSolution.python;
}
