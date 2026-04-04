import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Problem from './src/models/Problem.js';
import User from './src/models/User.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// ── Clean stale indexes ───────────────────────────────────────────────────────
try {
  const userCol = mongoose.connection.db.collection('users');
  const existingIndexes = await userCol.indexes();
  for (const idx of existingIndexes) {
    if (idx.name === '_id_') continue;
    const keys = Object.keys(idx.key || {});
    const isOurIndex = keys.length === 1 && keys[0] === 'email';
    if (!isOurIndex) { await userCol.dropIndex(idx.name); }
  }
} catch (e) { console.log('ℹ️  No stale user indexes to clean'); }

try {
  const probCol = mongoose.connection.db.collection('problems');
  const existingIndexes = await probCol.indexes();
  for (const idx of existingIndexes) {
    if (idx.name === '_id_') continue;
    const keys = Object.keys(idx.key || {});
    const isOurIndex = (keys.length === 1 && (keys[0] === 'number' || keys[0] === 'slug'));
    if (!isOurIndex) { await probCol.dropIndex(idx.name); }
  }
} catch (e) { console.log('ℹ️  No stale problem indexes to clean'); }

await User.syncIndexes();
await Problem.syncIndexes();
console.log('✅ Indexes synced');

// ── Admin user ────────────────────────────────────────────────────────────────
try {
  await mongoose.connection.db.collection('users').deleteMany({ email: 'ravi12maurya@gmail.com' });
} catch (e) {}

const hash = await bcrypt.hash('Keyboss', 12);
await new User({
  name: 'Admin', email: 'ravi12maurya@gmail.com',
  passwordHash: hash, isAdmin: true, plan: 'pro',
  ratingTitle: 'Admin', oauthProvider: 'admin',
}).save();
console.log('✅ Admin user created');


// ── Problems ──────────────────────────────────────────────────────────────────
const problems = [

  // ── 1. Two Sum ───────────────────────────────────────────────────────────────
  {
    number: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy',
    tags: ['Array', 'Hash Table'], companies: ['Google', 'Amazon', 'Apple'],
    acceptance: 49.2, premium: false,
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <strong>indices</strong> of the two numbers such that they add up to target.<br><br>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6',     output: '[1, 2]' },
      { input: 'nums = [3,3], target = 6',        output: '[0, 1]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    testCases: [
      { input: '2 7 11 15\n9', expected: '[0, 1]', hidden: false },
      { input: '3 2 4\n6',     expected: '[1, 2]', hidden: false },
      { input: '3 3\n6',       expected: '[0, 1]', hidden: false },
      { input: '1 8 3 6\n9',   expected: '[0, 1]', hidden: true  },
      { input: '2 5 5 1\n10',  expected: '[1, 2]', hidden: true  },
    ],
    hints: [
      'Try using a hash map to store visited numbers.',
      'For each number, check if target - num exists in the map.',
      'Return indices immediately when complement is found.',
    ],

    // ── what user sees in editor ──────────────────────────────────────────────
    starter: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

    }
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {

};`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {

}`,
    },

    // ── full code sent to Judge0 ──────────────────────────────────────────────
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int target; cin >> target;
    Solution sol;
    vector<int> res = sol.twoSum(nums, target);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
nums = list(map(int, data[0].split()))
target = int(data[1].strip())
print(Solution().twoSum(nums, target))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int target = sc.nextInt();
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int[] res = new Solution().twoSum(nums, target);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

__USER_CODE__

const res = twoSum(nums, target);
console.log('[' + res[0] + ', ' + res[1] + ']');`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0, target;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &target);
    int returnSize;
    int* res = twoSum(nums, n, target, &returnSize);
    printf("[%d, %d]\\n", res[0], res[1]);
    free(res);
    return 0;
}`,
    },
    aiContext: 'Two Sum — find two indices that sum to target, classic hash map O(n)',
  },

  // ── 2. Valid Parentheses ─────────────────────────────────────────────────────
  {
    number: 2, title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy',
    tags: ['String', 'Stack'], companies: ['Google', 'Facebook', 'Amazon'],
    acceptance: 40.6, premium: false,
    description: `Given a string <code>s</code> containing just <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code> and <code>]</code>, determine if the input string is valid.<br><br>An input string is valid if open brackets are closed by the same type of brackets in the correct order.`,
    examples: [
      { input: 's = "()"',      output: 'true' },
      { input: 's = "()[]{}"',  output: 'true' },
      { input: 's = "(]"',      output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    testCases: [
      { input: '()',      expected: 'true',  hidden: false },
      { input: '()[]{}', expected: 'true',  hidden: false },
      { input: '(]',     expected: 'false', hidden: false },
      { input: '([)]',   expected: 'false', hidden: true  },
      { input: '{[]}',   expected: 'true',  hidden: true  },
      { input: ']',      expected: 'false', hidden: true  },
    ],
    hints: [
      'Use a stack data structure.',
      'Push opening brackets, pop on closing brackets.',
      'Stack must be empty at the end.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isValid(string s) {

    }
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
      java: `class Solution {
    public boolean isValid(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {

};`,
      c: `bool isValid(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    Solution sol;
    cout << (sol.isValid(s) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(str(Solution().isValid(s)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        System.out.println(new Solution().isValid(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(String(isValid(s)));`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[10001]; scanf("%s", s);
    printf("%s\\n", isValid(s) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Valid Parentheses — stack-based bracket matching',
  },

  // ── 3. Best Time to Buy and Sell Stock ───────────────────────────────────────
  {
    number: 3, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'Facebook', 'Bloomberg'],
    acceptance: 54.4, premium: false,
    description: `Given an array where <code>prices[i]</code> is the price on day <code>i</code>, return the maximum profit from one buy-sell transaction. Return 0 if no profit is possible.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2, sell on day 5' },
      { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'No profit possible' },
    ],
    constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
    testCases: [
      { input: '7 1 5 3 6 4', expected: '5', hidden: false },
      { input: '7 6 4 3 1',   expected: '0', hidden: false },
      { input: '1',           expected: '0', hidden: true  },
      { input: '2 4 1',       expected: '2', hidden: true  },
      { input: '3 3 3',       expected: '0', hidden: true  },
    ],
    hints: [
      'Track minimum price seen so far.',
      'At each step compute profit = price - minSoFar.',
      'Track maximum profit seen.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {

    }
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxProfit(int[] prices) {

    }
}`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {

};`,
      c: `int maxProfit(int* prices, int pricesSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> prices; int x;
    while (cin >> x) prices.push_back(x);
    Solution sol;
    cout << sol.maxProfit(prices) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

prices = list(map(int, sys.stdin.read().split()))
print(Solution().maxProfit(prices))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] prices = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maxProfit(prices));
    }
}`,
      javascript: `const prices = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxProfit(prices));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int prices[100001], n = 0;
    while (scanf("%d", &prices[n]) == 1) n++;
    printf("%d\\n", maxProfit(prices, n));
    return 0;
}`,
    },
    aiContext: 'Best Time to Buy and Sell Stock — one pass min tracking O(n)',
  },

  // ── 4. Maximum Subarray ──────────────────────────────────────────────────────
  {
    number: 4, title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'], companies: ['Amazon', 'Apple', 'LinkedIn'],
    acceptance: 49.5, premium: false,
    description: `Given an integer array <code>nums</code>, find the subarray with the largest sum and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6' },
      { input: 'nums = [1]',                       output: '1' },
      { input: 'nums = [5,4,-1,7,8]',              output: '23' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expected: '6',  hidden: false },
      { input: '1',                      expected: '1',  hidden: false },
      { input: '5 4 -1 7 8',             expected: '23', hidden: false },
      { input: '-1 -2 -3',               expected: '-1', hidden: true  },
      { input: '-2 -1',                  expected: '-1', hidden: true  },
    ],
    hints: [
      "Kadane's algorithm runs in O(n).",
      'Keep a running sum, reset to current element when it drops below.',
      'Track the maximum seen so far.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxSubArray(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {

};`,
      c: `int maxSubArray(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.maxSubArray(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().maxSubArray(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maxSubArray(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxSubArray(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", maxSubArray(nums, n));
    return 0;
}`,
    },
    aiContext: "Maximum Subarray — Kadane's algorithm O(n)",
  },

  // ── 5. Climbing Stairs ───────────────────────────────────────────────────────
  {
    number: 5, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'], companies: ['Amazon', 'Apple', 'Adobe'],
    acceptance: 51.8, premium: false,
    description: `You are climbing a staircase with <code>n</code> steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    testCases: [
      { input: '2',  expected: '2',          hidden: false },
      { input: '3',  expected: '3',          hidden: false },
      { input: '1',  expected: '1',          hidden: true  },
      { input: '10', expected: '89',         hidden: true  },
      { input: '45', expected: '1836311903', hidden: true  },
    ],
    hints: [
      'This is essentially Fibonacci.',
      'dp[i] = dp[i-1] + dp[i-2].',
      'Base cases: dp[1]=1, dp[2]=2.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int climbStairs(int n) {

    }
};`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        `,
      java: `class Solution {
    public int climbStairs(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {

};`,
      c: `int climbStairs(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << sol.climbStairs(n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().climbStairs(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().climbStairs(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(climbStairs(n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%d\\n", climbStairs(n));
    return 0;
}`,
    },
    aiContext: 'Climbing Stairs — Fibonacci / DP O(n)',
  },

  // ── 6. Binary Search ─────────────────────────────────────────────────────────
  {
    number: 6, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy',
    tags: ['Array', 'Binary Search'], companies: ['Microsoft', 'Google'],
    acceptance: 55.3, premium: false,
    description: `Given a sorted array of integers <code>nums</code> and integer <code>target</code>, return the index if found, else return <code>-1</code>.<br><br>You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All values are unique', 'nums is sorted ascending'],
    testCases: [
      { input: '-1 0 3 5 9 12\n9', expected: '4',  hidden: false },
      { input: '-1 0 3 5 9 12\n2', expected: '-1', hidden: false },
      { input: '5\n5',             expected: '0',  hidden: true  },
      { input: '1 3 5 7 9\n7',     expected: '3',  hidden: true  },
      { input: '1 3 5 7 9\n10',    expected: '-1', hidden: true  },
    ],
    hints: [
      'Maintain lo and hi pointers.',
      'Compute mid = (lo + hi) / 2.',
      'Move lo or hi based on comparison.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {

    }
};`,
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
      java: `class Solution {
    public int search(int[] nums, int target) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {

};`,
      c: `int search(int* nums, int numsSize, int target) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int target; cin >> target;
    Solution sol;
    cout << sol.search(nums, target) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
nums = list(map(int, data[0].split()))
target = int(data[1].strip())
print(Solution().search(nums, target))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int target = sc.nextInt();
        System.out.println(new Solution().search(nums, target));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

__USER_CODE__

console.log(search(nums, target));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0, target;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &target);
    printf("%d\\n", search(nums, n, target));
    return 0;
}`,
    },
    aiContext: 'Binary Search — classic lo/hi pointer O(log n)',
  },

  // ── 7. Single Number ─────────────────────────────────────────────────────────
  {
    number: 7, title: 'Single Number', slug: 'single-number', difficulty: 'Easy',
    tags: ['Array', 'Bit Manipulation'], companies: ['Amazon', 'Apple', 'Airbnb'],
    acceptance: 70.6, premium: false,
    description: `Given a non-empty array where every element appears twice except for one, find that single one.<br><br>Must run in linear time and use only constant extra space.`,
    examples: [
      { input: 'nums = [2,2,1]',     output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
      { input: 'nums = [1]',         output: '1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', 'Each element appears twice except one'],
    testCases: [
      { input: '2 2 1',     expected: '1', hidden: false },
      { input: '4 1 2 1 2', expected: '4', hidden: false },
      { input: '1',         expected: '1', hidden: false },
      { input: '0 1 0',     expected: '1', hidden: true  },
      { input: '7 3 7',     expected: '3', hidden: true  },
    ],
    hints: [
      'XOR of a number with itself is 0.',
      'XOR of a number with 0 is the number itself.',
      'XOR all elements together.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int singleNumber(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {

};`,
      c: `int singleNumber(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.singleNumber(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().singleNumber(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().singleNumber(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(singleNumber(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[30001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", singleNumber(nums, n));
    return 0;
}`,
    },
    aiContext: 'Single Number — XOR trick O(n) O(1) space',
  },

  // ── 8. Missing Number ────────────────────────────────────────────────────────
  {
    number: 8, title: 'Missing Number', slug: 'missing-number', difficulty: 'Easy',
    tags: ['Array', 'Math', 'Bit Manipulation'], companies: ['Microsoft', 'Amazon', 'Bloomberg'],
    acceptance: 62.8, premium: false,
    description: `Given an array containing <code>n</code> distinct numbers in range <code>[0, n]</code>, return the one that is missing.`,
    examples: [
      { input: 'nums = [3,0,1]',             output: '2' },
      { input: 'nums = [0,1]',               output: '2' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' },
    ],
    constraints: ['1 ≤ n ≤ 10⁴', 'All numbers are unique in range [0,n]'],
    testCases: [
      { input: '3 0 1',             expected: '2', hidden: false },
      { input: '0 1',               expected: '2', hidden: false },
      { input: '9 6 4 2 3 5 7 0 1', expected: '8', hidden: false },
      { input: '0',                 expected: '1', hidden: true  },
      { input: '1',                 expected: '0', hidden: true  },
    ],
    hints: [
      'Expected sum = n*(n+1)/2.',
      'Subtract actual sum from expected sum.',
      'Or XOR all indices and values.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int missingNumber(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {

};`,
      c: `int missingNumber(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.missingNumber(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().missingNumber(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().missingNumber(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(missingNumber(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", missingNumber(nums, n));
    return 0;
}`,
    },
    aiContext: 'Missing Number — Gauss sum formula O(n)',
  },

  // ── 9. Majority Element ──────────────────────────────────────────────────────
  {
    number: 9, title: 'Majority Element', slug: 'majority-element', difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting', 'Counting'], companies: ['Adobe', 'Google', 'Yahoo'],
    acceptance: 63.6, premium: false,
    description: `Given an array of size <code>n</code>, return the majority element — the element that appears more than <code>⌊n/2⌋</code> times. The majority element always exists.`,
    examples: [
      { input: 'nums = [3,2,3]',         output: '3' },
      { input: 'nums = [2,2,1,1,1,2,2]', output: '2' },
    ],
    constraints: ['1 ≤ n ≤ 5×10⁴', 'Majority element always exists'],
    testCases: [
      { input: '3 2 3',         expected: '3', hidden: false },
      { input: '2 2 1 1 1 2 2', expected: '2', hidden: false },
      { input: '1',             expected: '1', hidden: true  },
      { input: '6 6 6 7 7',     expected: '6', hidden: true  },
    ],
    hints: [
      "Boyer-Moore Voting Algorithm runs in O(n) O(1).",
      'Keep a candidate and a count.',
      'If count drops to 0, change candidate.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int majorityElement(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int majorityElement(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {

};`,
      c: `int majorityElement(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.majorityElement(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().majorityElement(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().majorityElement(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(majorityElement(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[50001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", majorityElement(nums, n));
    return 0;
}`,
    },
    aiContext: 'Majority Element — Boyer-Moore Voting O(n) O(1)',
  },

  // ── 10. Reverse Linked List ──────────────────────────────────────────────────
  {
    number: 10, title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 73.4, premium: false,
    description: `Given the head of a singly linked list, reverse the list and return the reversed list.<br><br>Input: space-separated node values. Output: reversed space-separated values.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '5 4 3 2 1' },
      { input: 'head = [1,2]',       output: '2 1' },
      { input: 'head = []',          output: '' },
    ],
    constraints: ['0 ≤ n ≤ 5000', '-5000 ≤ Node.val ≤ 5000'],
    testCases: [
      { input: '1 2 3 4 5', expected: '5 4 3 2 1', hidden: false },
      { input: '1 2',       expected: '2 1',       hidden: false },
      { input: '1',         expected: '1',         hidden: true  },
      { input: '5 4 3 2 1', expected: '1 2 3 4 5', hidden: true  },
    ],
    hints: [
      'Use three pointers: prev, curr, next.',
      'Iteratively reverse the links.',
      'Return prev at the end.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* reverseList(struct ListNode* head) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

__USER_CODE__

int main() {
    vector<int> vals; int x;
    while (cin >> x) vals.push_back(x);
    if (vals.empty()) { cout << endl; return 0; }
    ListNode* head = new ListNode(vals[0]);
    ListNode* cur = head;
    for (int i = 1; i < (int)vals.size(); i++) { cur->next = new ListNode(vals[i]); cur = cur->next; }
    Solution sol;
    ListNode* res = sol.reverseList(head);
    bool first = true;
    while (res) { if (!first) cout << " "; cout << res->val; res = res->next; first = false; }
    cout << endl;
    return 0;
}`,
      python: `from typing import Optional
import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

__USER_CODE__

vals = list(map(int, sys.stdin.read().split()))
if not vals: print(''); exit()
head = ListNode(vals[0])
cur = head
for v in vals[1:]: cur.next = ListNode(v); cur = cur.next
res = Solution().reverseList(head)
out = []
while res: out.append(str(res.val)); res = res.next
print(' '.join(out))`,
      java: `import java.util.*;

class ListNode {
    int val; ListNode next;
    ListNode(int x) { val = x; }
}

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> vals = new ArrayList<>();
        while (sc.hasNextInt()) vals.add(sc.nextInt());
        if (vals.isEmpty()) { System.out.println(""); return; }
        ListNode head = new ListNode(vals.get(0));
        ListNode cur = head;
        for (int i = 1; i < vals.size(); i++) { cur.next = new ListNode(vals.get(i)); cur = cur.next; }
        ListNode res = new Solution().reverseList(head);
        StringBuilder sb = new StringBuilder();
        while (res != null) { if (sb.length() > 0) sb.append(" "); sb.append(res.val); res = res.next; }
        System.out.println(sb);
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).filter(Boolean).map(Number);

function ListNode(val, next) { this.val = val ?? 0; this.next = next ?? null; }

__USER_CODE__

if (!vals.length) { console.log(''); process.exit(0); }
let head = new ListNode(vals[0]);
let cur = head;
for (let i = 1; i < vals.length; i++) { cur.next = new ListNode(vals[i]); cur = cur.next; }
let res = reverseList(head);
const out = [];
while (res) { out.push(res.val); res = res.next; }
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct ListNode { int val; struct ListNode *next; };

__USER_CODE__

int main() {
    int vals[5001], n = 0;
    while (scanf("%d", &vals[n]) == 1) n++;
    if (n == 0) { printf("\\n"); return 0; }
    struct ListNode *nodes = malloc(n * sizeof(struct ListNode));
    for (int i = 0; i < n; i++) { nodes[i].val = vals[i]; nodes[i].next = i+1 < n ? &nodes[i+1] : NULL; }
    struct ListNode *res = reverseList(&nodes[0]);
    int first = 1;
    while (res) { if (!first) printf(" "); printf("%d", res->val); res = res->next; first = 0; }
    printf("\\n"); free(nodes); return 0;
}`,
    },
    aiContext: 'Reverse Linked List — iterative three-pointer O(n)',
  },

  // ── PROBLEMS 11–20 ────────────────────────────────────────────────────────────


  // ── 11. Longest Substring Without Repeating Characters ──────────────────────
  {
    number: 11, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
    acceptance: 33.8, premium: false,
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3' },
      { input: 's = "bbbbb"',    output: '1', explanation: '"b" has length 1' },
      { input: 's = "pwwkew"',   output: '3', explanation: '"wke" has length 3' },
    ],
    constraints: ['0 ≤ s.length ≤ 5×10⁴', 's consists of English letters, digits, symbols and spaces'],
    testCases: [
      { input: 'abcabcbb', expected: '3', hidden: false },
      { input: 'bbbbb',    expected: '1', hidden: false },
      { input: 'pwwkew',   expected: '3', hidden: false },
      { input: 'a',        expected: '1', hidden: true  },
      { input: 'dvdf',     expected: '3', hidden: true  },
    ],
    hints: [
      'Use a sliding window with two pointers.',
      'Track characters in the current window with a hash map.',
      'When a duplicate is found, move the left pointer past the previous occurrence.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {

    }
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {

};`,
      c: `int lengthOfLongestSubstring(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    Solution sol;
    cout << sol.lengthOfLongestSubstring(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().lengthOfLongestSubstring(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        System.out.println(new Solution().lengthOfLongestSubstring(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(lengthOfLongestSubstring(s));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[50001];
    fgets(s, sizeof(s), stdin);
    int n = strlen(s);
    if (s[n-1] == '\\n') s[--n] = '\\0';
    printf("%d\\n", lengthOfLongestSubstring(s));
    return 0;
}`,
    },
    aiContext: 'Longest Substring Without Repeating Characters — sliding window O(n)',
  },

  // ── 12. Coin Change ──────────────────────────────────────────────────────────
  {
    number: 12, title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'BFS'], companies: ['Amazon', 'Google', 'Microsoft'],
    acceptance: 41.3, premium: false,
    description: `You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code>. Return the fewest number of coins needed to make up that amount. Return <code>-1</code> if it cannot be made.<br><br>First line: space-separated coin values. Second line: amount.`,
    examples: [
      { input: 'coins = [1,5,10,25], amount = 41', output: '4',  explanation: '25+10+5+1' },
      { input: 'coins = [2], amount = 3',           output: '-1' },
      { input: 'coins = [1], amount = 0',           output: '0'  },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹-1', '0 ≤ amount ≤ 10⁴'],
    testCases: [
      { input: '1 5 10 25\n41', expected: '4',  hidden: false },
      { input: '2\n3',          expected: '-1', hidden: false },
      { input: '1\n0',          expected: '0',  hidden: false },
      { input: '1 2 5\n11',     expected: '3',  hidden: true  },
      { input: '186 419 83 408\n6249', expected: '20', hidden: true },
    ],
    hints: [
      'Define dp[i] = min coins needed to make amount i.',
      'Initialize dp[0] = 0, all others = infinity.',
      'For each amount i, try every coin: dp[i] = min(dp[i], dp[i-coin] + 1).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {

    }
};`,
      python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        `,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {

    }
}`,
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {

};`,
      c: `int coinChange(int* coins, int coinsSize, int amount) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<int> coins; int x;
    while (ss >> x) coins.push_back(x);
    int amount; cin >> amount;
    Solution sol;
    cout << sol.coinChange(coins, amount) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
coins = list(map(int, data[0].split()))
amount = int(data[1].strip())
print(Solution().coinChange(coins, amount))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] coins = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int amount = sc.nextInt();
        System.out.println(new Solution().coinChange(coins, amount));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const coins = lines[0].split(' ').map(Number);
const amount = parseInt(lines[1]);

__USER_CODE__

console.log(coinChange(coins, amount));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int coins[20], nc = 0, amount;
    char buf[500]; fgets(buf, sizeof(buf), stdin);
    char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } coins[nc++] = strtol(p, &p, 10); }
    scanf("%d", &amount);
    printf("%d\\n", coinChange(coins, nc, amount));
    return 0;
}`,
    },
    aiContext: 'Coin Change — bottom-up DP O(n * amount)',
  },

  // ── 13. Number of Islands ────────────────────────────────────────────────────
  {
    number: 13, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium',
    tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 57.5, premium: false,
    description: `Given an <code>m x n</code> 2D binary grid where <code>'1'</code> is land and <code>'0'</code> is water, return the number of islands.<br><br>Each row of the grid is given as a string of 0s and 1s (no spaces).`,
    examples: [
      { input: '11110\n11010\n11000\n00000', output: '1' },
      { input: '11000\n11000\n00100\n00011', output: '3' },
    ],
    constraints: ['1 ≤ m, n ≤ 300', "grid[i][j] is '0' or '1'"],
    testCases: [
      { input: '11110\n11010\n11000\n00000', expected: '1', hidden: false },
      { input: '11000\n11000\n00100\n00011', expected: '3', hidden: false },
      { input: '1',                          expected: '1', hidden: true  },
      { input: '0',                          expected: '0', hidden: true  },
      { input: '111\n010\n111',              expected: '1', hidden: true  },
    ],
    hints: [
      'DFS/BFS from every unvisited land cell.',
      'Mark visited cells as water to avoid revisiting.',
      'Each DFS/BFS call from an unvisited cell counts as one island.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {

    }
};`,
      python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        `,
      java: `class Solution {
    public int numIslands(char[][] grid) {

    }
}`,
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {

};`,
      c: `int numIslands(char** grid, int gridSize, int* gridColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<char>> grid;
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        grid.push_back(vector<char>(line.begin(), line.end()));
    }
    Solution sol;
    cout << sol.numIslands(grid) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
grid = [list(line) for line in lines]
print(Solution().numIslands(grid))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<char[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine();
            if (!l.isEmpty()) rows.add(l.toCharArray());
        }
        char[][] grid = rows.toArray(new char[0][]);
        System.out.println(new Solution().numIslands(grid));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const grid = lines.map(l => l.split(''));

__USER_CODE__

console.log(numIslands(grid));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    char *grid[301]; char bufs[301][302]; int n = 0;
    while (scanf("%s", bufs[n]) == 1) { grid[n] = bufs[n]; n++; }
    int cols = strlen(grid[0]);
    int colSizes[301]; for (int i = 0; i < n; i++) colSizes[i] = cols;
    printf("%d\\n", numIslands(grid, n, colSizes));
    return 0;
}`,
    },
    aiContext: 'Number of Islands — DFS/BFS grid traversal O(m*n)',
  },

  // ── 14. 3Sum ─────────────────────────────────────────────────────────────────
  {
    number: 14, title: '3Sum', slug: 'three-sum', difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 32.5, premium: false,
    description: `Given an integer array <code>nums</code>, return all triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j != k</code> and <code>nums[i] + nums[j] + nums[k] == 0</code>.<br><br>The solution set must not contain duplicate triplets. Print each triplet on a new line, space-separated.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '-1 -1 2\n-1 0 1' },
      { input: 'nums = [0,1,1]',          output: ''     },
      { input: 'nums = [0,0,0]',          output: '0 0 0'},
    ],
    constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
    testCases: [
      { input: '-1 0 1 2 -1 -4', expected: '-1 -1 2\n-1 0 1', hidden: false },
      { input: '0 1 1',          expected: '',                  hidden: false },
      { input: '0 0 0',          expected: '0 0 0',            hidden: false },
      { input: '-2 0 1 1 2',     expected: '-2 0 2\n-2 1 1',   hidden: true  },
    ],
    hints: [
      'Sort the array first.',
      'Fix the first element and use two pointers for the remaining two.',
      'Skip duplicate values at each pointer position.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {

};`,
      c: `int** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    vector<vector<int>> res = sol.threeSum(nums);
    for (auto& t : res) cout << t[0] << " " << t[1] << " " << t[2] << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
result = Solution().threeSum(nums)
for t in result:
    print(*t)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        List<List<Integer>> res = new Solution().threeSum(nums);
        for (List<Integer> t : res)
            System.out.println(t.get(0) + " " + t.get(1) + " " + t.get(2));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

const result = threeSum(nums);
for (const t of result) console.log(t.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[3001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int returnSize; int *returnColSizes;
    int **res = threeSum(nums, n, &returnSize, &returnColSizes);
    for (int i = 0; i < returnSize; i++)
        printf("%d %d %d\\n", res[i][0], res[i][1], res[i][2]);
    return 0;
}`,
    },
    aiContext: '3Sum — sort + two pointers O(n²)',
  },

  // ── 15. Merge Intervals ──────────────────────────────────────────────────────
  {
    number: 15, title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'Medium',
    tags: ['Array', 'Sorting'], companies: ['Facebook', 'Google', 'Twitter'],
    acceptance: 45.8, premium: false,
    description: `Given an array of intervals <code>intervals</code> where <code>intervals[i] = [start, end]</code>, merge all overlapping intervals and return the result.<br><br>Input: each interval on its own line as two space-separated integers. Output: each merged interval on a new line.`,
    examples: [
      { input: '1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18' },
      { input: '1 4\n4 5',              output: '1 5'               },
    ],
    constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ start ≤ end ≤ 10⁴'],
    testCases: [
      { input: '1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18', hidden: false },
      { input: '1 4\n4 5',              expected: '1 5',               hidden: false },
      { input: '1 4\n2 3',              expected: '1 4',               hidden: true  },
      { input: '1 2\n3 4\n5 6',         expected: '1 2\n3 4\n5 6',    hidden: true  },
    ],
    hints: [
      'Sort intervals by start time.',
      'If the current interval overlaps with the last merged interval, extend it.',
      'Otherwise push it as a new interval.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {

    }
};`,
      python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        `,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {

    }
}`,
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {

};`,
      c: `int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> intervals;
    int a, b;
    while (cin >> a >> b) intervals.push_back({a, b});
    Solution sol;
    auto res = sol.merge(intervals);
    for (auto& v : res) cout << v[0] << " " << v[1] << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
intervals = [list(map(int, l.split())) for l in lines]
for v in Solution().merge(intervals):
    print(*v)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(new int[]{sc.nextInt(), sc.nextInt()});
        int[][] intervals = list.toArray(new int[0][]);
        for (int[] v : new Solution().merge(intervals))
            System.out.println(v[0] + " " + v[1]);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const intervals = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

for (const v of merge(intervals)) console.log(v[0] + ' ' + v[1]);`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int arr[10001][2], n = 0;
    while (scanf("%d %d", &arr[n][0], &arr[n][1]) == 2) n++;
    int *ptrs[10001]; for (int i = 0; i < n; i++) ptrs[i] = arr[i];
    int colSizes[10001]; for (int i = 0; i < n; i++) colSizes[i] = 2;
    int retSize; int *retColSizes;
    int **res = merge((int**)ptrs, n, colSizes, &retSize, &retColSizes);
    for (int i = 0; i < retSize; i++) printf("%d %d\\n", res[i][0], res[i][1]);
    return 0;
}`,
    },
    aiContext: 'Merge Intervals — sort then linear scan O(n log n)',
  },

  // ── 16. Maximum Depth of Binary Tree ────────────────────────────────────────
  {
    number: 16, title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'], companies: ['LinkedIn', 'Amazon', 'Google'],
    acceptance: 73.9, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), return its maximum depth — the number of nodes along the longest path from root to leaf.`,
    examples: [
      { input: '3 9 20 null null 15 7', output: '3' },
      { input: '1 null 2',             output: '2' },
    ],
    constraints: ['0 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    testCases: [
      { input: '3 9 20 null null 15 7', expected: '3', hidden: false },
      { input: '1 null 2',              expected: '2', hidden: false },
      { input: '1',                     expected: '1', hidden: true  },
      { input: 'null',                  expected: '0', hidden: true  },
      { input: '1 2 3 4 5',             expected: '3', hidden: true  },
    ],
    hints: [
      'Recursive DFS: depth = 1 + max(leftDepth, rightDepth).',
      'Base case: null node returns 0.',
      'Or use BFS and count levels.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
int maxDepth(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left  = build(v, 2*i+1);
    n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << sol.maxDepth(root) << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

vals = sys.stdin.read().split()
print(Solution().maxDepth(build(vals)))`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left  = build(v, 2*i+1);
        n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        String[] vals = new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root = vals.length == 0 || vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().maxDepth(root));
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/);

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left  = build(vals, 2*i+1);
    n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(maxDepth(root));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left  = build(toks, n, 2*i+1);
    node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%d\\n", maxDepth(root));
    return 0;
}`,
    },
    aiContext: 'Maximum Depth of Binary Tree — DFS recursion O(n)',
  },

  // ── 17. Validate Binary Search Tree ─────────────────────────────────────────
  {
    number: 17, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium',
    tags: ['Tree', 'DFS', 'Binary Search Tree'], companies: ['Amazon', 'Bloomberg', 'Facebook'],
    acceptance: 31.8, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), determine if it is a valid BST.<br><br>A valid BST: left subtree values are strictly less than root; right subtree values are strictly greater; both subtrees are also valid BSTs.`,
    examples: [
      { input: '2 1 3',               output: 'true'  },
      { input: '5 1 4 null null 3 6', output: 'false' },
    ],
    constraints: ['1 ≤ number of nodes ≤ 10⁴', '-2³¹ ≤ Node.val ≤ 2³¹-1'],
    testCases: [
      { input: '2 1 3',                 expected: 'true',  hidden: false },
      { input: '5 1 4 null null 3 6',   expected: 'false', hidden: false },
      { input: '1',                     expected: 'true',  hidden: true  },
      { input: '10 5 15 null null 6 20', expected: 'false', hidden: true },
    ],
    hints: [
      'Pass min and max bounds through the recursion.',
      'At each node: value must be strictly within (min, max).',
      'Update bounds: left child gets max=node.val, right child gets min=node.val.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    bool isValidBST(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public boolean isValidBST(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
bool isValidBST(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left  = build(v, 2*i+1);
    n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << (sol.isValidBST(root) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

vals = sys.stdin.read().split()
print(str(Solution().isValidBST(build(vals))).lower())`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left  = build(v, 2*i+1);
        n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        String[] vals = new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root = vals.length == 0 || vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().isValidBST(root));
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/);

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left  = build(vals, 2*i+1);
    n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(String(isValidBST(root)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left  = build(toks, n, 2*i+1);
    node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%s\\n", isValidBST(root) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Validate BST — DFS with min/max bounds O(n)',
  },

  // ── 18. House Robber ─────────────────────────────────────────────────────────
  {
    number: 18, title: 'House Robber', slug: 'house-robber', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'], companies: ['Airbnb', 'Amazon', 'Microsoft'],
    acceptance: 49.9, premium: false,
    description: `You are a robber. Adjacent houses have alarms — you cannot rob two adjacent houses. Given an integer array <code>nums</code> representing the money in each house, return the maximum amount you can rob.`,
    examples: [
      { input: 'nums = [1,2,3,1]',   output: '4',  explanation: 'Rob house 1 and 3: 1+3=4' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 1, 3, 5: 2+9+1=12' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 400'],
    testCases: [
      { input: '1 2 3 1',   expected: '4',  hidden: false },
      { input: '2 7 9 3 1', expected: '12', hidden: false },
      { input: '1',         expected: '1',  hidden: true  },
      { input: '2 1 1 2',   expected: '4',  hidden: true  },
      { input: '0 0 0',     expected: '0',  hidden: true  },
    ],
    hints: [
      'dp[i] = max amount robbing up to house i.',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      'You only need two variables, not a full array.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int rob(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int rob(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {

};`,
      c: `int rob(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.rob(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().rob(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().rob(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(rob(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[101], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", rob(nums, n));
    return 0;
}`,
    },
    aiContext: 'House Robber — DP with two variables O(n)',
  },

  // ── 19. Course Schedule ──────────────────────────────────────────────────────
  {
    number: 19, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS', 'Topological Sort'], companies: ['Amazon', 'Airbnb', 'Google'],
    acceptance: 45.2, premium: false,
    description: `There are <code>numCourses</code> labeled <code>0</code> to <code>numCourses-1</code>. Given a list of prerequisites (each as <code>a b</code> meaning you must take <code>b</code> before <code>a</code>), return <code>true</code> if you can finish all courses.<br><br>First line: numCourses. Subsequent lines: prerequisite pairs.`,
    examples: [
      { input: '2\n1 0',      output: 'true',  explanation: 'Take course 0 then 1' },
      { input: '2\n1 0\n0 1', output: 'false', explanation: 'Cycle: 0→1→0' },
    ],
    constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'],
    testCases: [
      { input: '2\n1 0',      expected: 'true',  hidden: false },
      { input: '2\n1 0\n0 1', expected: 'false', hidden: false },
      { input: '1',           expected: 'true',  hidden: true  },
      { input: '3\n0 1\n1 2\n2 0', expected: 'false', hidden: true },
    ],
    hints: [
      'Build an adjacency list and track in-degrees.',
      "Use Kahn's BFS topological sort.",
      'If all nodes are processed, no cycle exists.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {

    }
};`,
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        `,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {

    }
}`,
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {

};`,
      c: `bool canFinish(int numCourses, int** prerequisites, int prerequisitesSize, int* prerequisitesColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    vector<vector<int>> prereqs;
    int a, b;
    while (cin >> a >> b) prereqs.push_back({a, b});
    Solution sol;
    cout << (sol.canFinish(n, prereqs) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
n = int(lines[0])
prereqs = [list(map(int, l.split())) for l in lines[1:] if l.strip()]
print(str(Solution().canFinish(n, prereqs)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<int[]> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(new int[]{sc.nextInt(), sc.nextInt()});
        int[][] prereqs = list.toArray(new int[0][]);
        System.out.println(new Solution().canFinish(n, prereqs));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const prereqs = lines.slice(1).filter(l => l.trim()).map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(String(canFinish(n, prereqs)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    int arr[5001][2], m = 0;
    while (scanf("%d %d", &arr[m][0], &arr[m][1]) == 2) m++;
    int *ptrs[5001]; for (int i = 0; i < m; i++) ptrs[i] = arr[i];
    int colSizes[5001]; for (int i = 0; i < m; i++) colSizes[i] = 2;
    printf("%s\\n", canFinish(n, (int**)ptrs, m, colSizes) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Course Schedule — topological sort / cycle detection O(V+E)',
  },

  // ── 20. Longest Common Subsequence ──────────────────────────────────────────
  {
    number: 20, title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'], companies: ['Google', 'Amazon', 'Oracle'],
    acceptance: 56.7, premium: false,
    description: `Given two strings <code>text1</code> and <code>text2</code> (one per line), return the length of their longest common subsequence. Return 0 if there is no common subsequence.`,
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: '"ace" is the LCS' },
      { input: 'text1 = "abc", text2 = "abc"',   output: '3' },
      { input: 'text1 = "abc", text2 = "def"',   output: '0' },
    ],
    constraints: ['1 ≤ text1.length, text2.length ≤ 1000', 'Both strings consist of lowercase English letters'],
    testCases: [
      { input: 'abcde\nace', expected: '3', hidden: false },
      { input: 'abc\nabc',   expected: '3', hidden: false },
      { input: 'abc\ndef',   expected: '0', hidden: true  },
      { input: 'bl\nybyml',  expected: '2', hidden: true  },
    ],
    hints: [
      'Build a 2D DP table of size (m+1) x (n+1).',
      'If text1[i] == text2[j]: dp[i][j] = dp[i-1][j-1] + 1.',
      'Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {

    }
};`,
      python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        `,
      java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {

    }
}`,
      javascript: `/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {

};`,
      c: `int longestCommonSubsequence(char* text1, char* text2) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string t1, t2;
    getline(cin, t1); getline(cin, t2);
    Solution sol;
    cout << sol.longestCommonSubsequence(t1, t2) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
t1 = data[0].strip(); t2 = data[1].strip()
print(Solution().longestCommonSubsequence(t1, t2))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String t1 = sc.nextLine().trim(), t2 = sc.nextLine().trim();
        System.out.println(new Solution().longestCommonSubsequence(t1, t2));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const t1 = lines[0].trim(), t2 = lines[1].trim();

__USER_CODE__

console.log(longestCommonSubsequence(t1, t2));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char t1[1001], t2[1001];
    fgets(t1, sizeof(t1), stdin); fgets(t2, sizeof(t2), stdin);
    int n1 = strlen(t1), n2 = strlen(t2);
    if (t1[n1-1] == '\\n') t1[--n1] = '\\0';
    if (t2[n2-1] == '\\n') t2[--n2] = '\\0';
    printf("%d\\n", longestCommonSubsequence(t1, t2));
    return 0;
}`,
    },
    aiContext: 'Longest Common Subsequence — 2D DP O(m*n)',
  },

// ── PROBLEMS 21–30 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 21. Trapping Rain Water ──────────────────────────────────────────────────
  {
    number: 21, title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    companies: ['Amazon', 'Google', 'Goldman Sachs', 'Facebook'], acceptance: 58.1, premium: false,
    description: `Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of water trapped' },
      { input: 'height = [4,2,0,3,2,5]',              output: '9' },
    ],
    constraints: ['n == height.length', '1 ≤ n ≤ 2×10⁴', '0 ≤ height[i] ≤ 10⁵'],
    testCases: [
      { input: '0 1 0 2 1 0 1 3 2 1 2 1', expected: '6',  hidden: false },
      { input: '4 2 0 3 2 5',             expected: '9',  hidden: false },
      { input: '1 0 1',                   expected: '1',  hidden: true  },
      { input: '3 0 0 2 0 4',             expected: '10', hidden: true  },
    ],
    hints: [
      'Two-pointer approach: maintain lo and hi pointers.',
      'Water at index i = min(maxLeft, maxRight) - height[i].',
      'Advance the pointer with the smaller max height.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {

    }
};`,
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        `,
      java: `class Solution {
    public int trap(int[] height) {

    }
}`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {

};`,
      c: `int trap(int* height, int heightSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> height; int x;
    while (cin >> x) height.push_back(x);
    Solution sol;
    cout << sol.trap(height) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

height = list(map(int, sys.stdin.read().split()))
print(Solution().trap(height))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] height = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().trap(height));
    }
}`,
      javascript: `const height = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(trap(height));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int h[20001], n = 0;
    while (scanf("%d", &h[n]) == 1) n++;
    printf("%d\\n", trap(h, n));
    return 0;
}`,
    },
    aiContext: 'Trapping Rain Water — two pointers O(n)',
  },

  // ── 22. Unique Paths ─────────────────────────────────────────────────────────
  {
    number: 22, title: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium',
    tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    companies: ['Amazon', 'Goldman Sachs', 'Bloomberg'], acceptance: 62.5, premium: false,
    description: `A robot starts at the top-left corner of an <code>m x n</code> grid and wants to reach the bottom-right corner. It can only move right or down. How many unique paths are there?`,
    examples: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3'  },
    ],
    constraints: ['1 ≤ m, n ≤ 100'],
    testCases: [
      { input: '3 7', expected: '28', hidden: false },
      { input: '3 2', expected: '3',  hidden: false },
      { input: '1 1', expected: '1',  hidden: true  },
      { input: '7 3', expected: '28', hidden: true  },
      { input: '3 3', expected: '6',  hidden: true  },
    ],
    hints: [
      'dp[i][j] = dp[i-1][j] + dp[i][j-1].',
      'First row and first column are all 1s.',
      'Can reduce to a 1D DP array.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {

    }
};`,
      python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        `,
      java: `class Solution {
    public int uniquePaths(int m, int n) {

    }
}`,
      javascript: `/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {

};`,
      c: `int uniquePaths(int m, int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int m, n; cin >> m >> n;
    Solution sol;
    cout << sol.uniquePaths(m, n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

m, n = map(int, sys.stdin.read().split())
print(Solution().uniquePaths(m, n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        System.out.println(new Solution().uniquePaths(m, n));
    }
}`,
      javascript: `const [m, n] = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(uniquePaths(m, n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m, n; scanf("%d %d", &m, &n);
    printf("%d\\n", uniquePaths(m, n));
    return 0;
}`,
    },
    aiContext: 'Unique Paths — 1D DP O(m*n)',
  },

  // ── 23. Jump Game ────────────────────────────────────────────────────────────
  {
    number: 23, title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium',
    tags: ['Array', 'Greedy'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 38.4, premium: false,
    description: `You are given an integer array <code>nums</code> where <code>nums[i]</code> is the maximum jump length from index <code>i</code>. Return <code>true</code> if you can reach the last index, <code>false</code> otherwise.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true',  explanation: 'Jump 1 then 4' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Always stuck at index 3' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '0 ≤ nums[i] ≤ 10⁵'],
    testCases: [
      { input: '2 3 1 1 4', expected: 'true',  hidden: false },
      { input: '3 2 1 0 4', expected: 'false', hidden: false },
      { input: '0',         expected: 'true',  hidden: true  },
      { input: '2 0 0',     expected: 'true',  hidden: true  },
      { input: '1 0 0',     expected: 'false', hidden: true  },
    ],
    hints: [
      'Track the furthest reachable index.',
      'If current index > maxReach, return false.',
      'Update maxReach = max(maxReach, i + nums[i]).',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        `,
      java: `class Solution {
    public boolean canJump(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {

};`,
      c: `bool canJump(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << (sol.canJump(nums) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(str(Solution().canJump(nums)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().canJump(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(String(canJump(nums)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%s\\n", canJump(nums, n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Jump Game — greedy max reach O(n)',
  },

  // ── 24. Search in Rotated Sorted Array ──────────────────────────────────────
  {
    number: 24, title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium',
    tags: ['Array', 'Binary Search'], companies: ['Facebook', 'LinkedIn', 'Amazon'],
    acceptance: 38.5, premium: false,
    description: `Given a rotated sorted array of distinct integers and a target, return the index of target or <code>-1</code> if not found. Must be <code>O(log n)</code>.<br><br>First line: space-separated array. Second line: target.`,
    examples: [
      { input: '4 5 6 7 0 1 2\n0', output: '4' },
      { input: '4 5 6 7 0 1 2\n3', output: '-1' },
      { input: '1\n0',             output: '-1' },
    ],
    constraints: ['1 ≤ n ≤ 5000', 'All values are unique', '-10⁴ ≤ nums[i], target ≤ 10⁴'],
    testCases: [
      { input: '4 5 6 7 0 1 2\n0', expected: '4',  hidden: false },
      { input: '4 5 6 7 0 1 2\n3', expected: '-1', hidden: false },
      { input: '1\n0',             expected: '-1', hidden: false },
      { input: '3 1\n1',           expected: '1',  hidden: true  },
      { input: '5 1 3\n3',         expected: '2',  hidden: true  },
    ],
    hints: [
      'Use modified binary search.',
      'At each step determine which half is sorted.',
      'Check if target lies in the sorted half, then narrow accordingly.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {

    }
};`,
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
      java: `class Solution {
    public int search(int[] nums, int target) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {

};`,
      c: `int search(int* nums, int numsSize, int target) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int target; cin >> target;
    Solution sol;
    cout << sol.search(nums, target) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
nums = list(map(int, data[0].split()))
target = int(data[1].strip())
print(Solution().search(nums, target))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int target = sc.nextInt();
        System.out.println(new Solution().search(nums, target));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

__USER_CODE__

console.log(search(nums, target));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[5001], n = 0, target;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &target);
    printf("%d\\n", search(nums, n, target));
    return 0;
}`,
    },
    aiContext: 'Search in Rotated Sorted Array — modified binary search O(log n)',
  },

  // ── 25. Longest Increasing Subsequence ──────────────────────────────────────
  {
    number: 25, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Google'], acceptance: 54.6, premium: false,
    description: `Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: '[2,3,7,101]' },
      { input: 'nums = [0,1,0,3,2,3]',          output: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]',         output: '1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 2500', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    testCases: [
      { input: '10 9 2 5 3 7 101 18', expected: '4', hidden: false },
      { input: '0 1 0 3 2 3',         expected: '4', hidden: false },
      { input: '7 7 7 7 7',            expected: '1', hidden: false },
      { input: '1',                    expected: '1', hidden: true  },
      { input: '1 2 3 4 5',            expected: '5', hidden: true  },
    ],
    hints: [
      'O(n²) DP: dp[i] = max(dp[j]+1) for all j < i where nums[j] < nums[i].',
      'O(n log n): maintain a "tails" array with patience sorting.',
      'Binary search for the right position to place each element.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {

};`,
      c: `int lengthOfLIS(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.lengthOfLIS(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().lengthOfLIS(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().lengthOfLIS(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(lengthOfLIS(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[2501], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", lengthOfLIS(nums, n));
    return 0;
}`,
    },
    aiContext: 'Longest Increasing Subsequence — patience sort O(n log n)',
  },

  // ── 26. Word Break ───────────────────────────────────────────────────────────
  {
    number: 26, title: 'Word Break', slug: 'word-break', difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    companies: ['Amazon', 'Google', 'Facebook'], acceptance: 45.5, premium: false,
    description: `Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.<br><br>First line: string s. Second line: space-separated dictionary words.`,
    examples: [
      { input: 'leetcode\nleet code',            output: 'true',  explanation: '"leetcode" = "leet" + "code"' },
      { input: 'applepenapple\napple pen',        output: 'true'  },
      { input: 'catsandog\ncats dog sand and cat', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 300', '1 ≤ wordDict.length ≤ 1000', '1 ≤ wordDict[i].length ≤ 20'],
    testCases: [
      { input: 'leetcode\nleet code',             expected: 'true',  hidden: false },
      { input: 'applepenapple\napple pen',         expected: 'true',  hidden: false },
      { input: 'catsandog\ncats dog sand and cat', expected: 'false', hidden: false },
      { input: 'a\na',                             expected: 'true',  hidden: true  },
      { input: 'ab\na b',                          expected: 'true',  hidden: true  },
    ],
    hints: [
      'dp[i] = true if s[:i] can be segmented.',
      'For each i, check all j < i where dp[j] is true and s[j:i] is in the dictionary.',
      'Use a set for O(1) word lookup.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {

    }
};`,
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        `,
      java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {

};`,
      c: `bool wordBreak(char* s, char** wordDict, int wordDictSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    string dictLine; getline(cin, dictLine);
    istringstream ss(dictLine);
    vector<string> wordDict; string w;
    while (ss >> w) wordDict.push_back(w);
    Solution sol;
    cout << (sol.wordBreak(s, wordDict) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
s = lines[0].strip()
wordDict = lines[1].strip().split()
print(str(Solution().wordBreak(s, wordDict)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        List<String> wordDict = Arrays.asList(sc.nextLine().trim().split(" "));
        System.out.println(new Solution().wordBreak(s, wordDict));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const s = lines[0].trim();
const wordDict = lines[1].trim().split(' ');

__USER_CODE__

console.log(String(wordBreak(s, wordDict)));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    char s[301]; scanf("%s", s);
    char words[1001][21]; int wc = 0;
    while (scanf("%s", words[wc]) == 1) wc++;
    char *ptrs[1001]; for (int i = 0; i < wc; i++) ptrs[i] = words[i];
    printf("%s\\n", wordBreak(s, ptrs, wc) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Word Break — DP with hash set O(n²)',
  },

  // ── 27. Diameter of Binary Tree ──────────────────────────────────────────────
  {
    number: 27, title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS'], companies: ['Facebook', 'Amazon', 'Google'],
    acceptance: 57.8, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), return the length of the diameter.<br><br>The diameter is the length of the longest path between any two nodes (may or may not pass through root). Length = number of edges.`,
    examples: [
      { input: '1 2 3 4 5',       output: '3', explanation: 'Path [4,2,1,3] has length 3' },
      { input: '1 2',             output: '1' },
    ],
    constraints: ['1 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    testCases: [
      { input: '1 2 3 4 5',         expected: '3', hidden: false },
      { input: '1 2',               expected: '1', hidden: false },
      { input: '1',                 expected: '0', hidden: true  },
      { input: '1 2 null 3 null 4', expected: '3', hidden: true  },
    ],
    hints: [
      'For each node, the diameter through it = leftHeight + rightHeight.',
      'Track the global maximum during DFS.',
      'The recursive function should return height, not diameter.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public int diameterOfBinaryTree(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
int diameterOfBinaryTree(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left  = build(v, 2*i+1);
    n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << sol.diameterOfBinaryTree(root) << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

vals = sys.stdin.read().split()
print(Solution().diameterOfBinaryTree(build(vals)))`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left  = build(v, 2*i+1);
        n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        String[] vals = new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root = vals.length == 0 || vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().diameterOfBinaryTree(root));
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left  = build(vals, 2*i+1);
    n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(diameterOfBinaryTree(root));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left  = build(toks, n, 2*i+1);
    node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%d\\n", diameterOfBinaryTree(root));
    return 0;
}`,
    },
    aiContext: 'Diameter of Binary Tree — DFS tracking global max O(n)',
  },

  // ── 28. Product of Array Except Self ────────────────────────────────────────
  {
    number: 28, title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'], companies: ['Amazon', 'Facebook', 'Microsoft'],
    acceptance: 64.3, premium: false,
    description: `Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> equals the product of all elements except <code>nums[i]</code>.<br><br>Must run in <code>O(n)</code> without using the division operator. Print result space-separated.`,
    examples: [
      { input: 'nums = [1,2,3,4]',     output: '24 12 8 6' },
      { input: 'nums = [-1,1,0,-3,3]', output: '0 0 9 0 0' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30'],
    testCases: [
      { input: '1 2 3 4',     expected: '24 12 8 6',  hidden: false },
      { input: '-1 1 0 -3 3', expected: '0 0 9 0 0',  hidden: false },
      { input: '2 3',         expected: '3 2',         hidden: true  },
      { input: '1 0 0 1',     expected: '0 0 0 0',     hidden: true  },
    ],
    hints: [
      'Build prefix product array from the left.',
      'Build suffix product array from the right.',
      'answer[i] = prefix[i] * suffix[i].',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {

};`,
      c: `int* productExceptSelf(int* nums, int numsSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    vector<int> res = sol.productExceptSelf(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(*Solution().productExceptSelf(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int[] res = new Solution().productExceptSelf(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(productExceptSelf(nums).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize;
    int* res = productExceptSelf(nums, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\\n"); free(res);
    return 0;
}`,
    },
    aiContext: 'Product of Array Except Self — prefix/suffix pass O(n)',
  },

  // ── 29. Rotate Image ─────────────────────────────────────────────────────────
  {
    number: 29, title: 'Rotate Image', slug: 'rotate-image', difficulty: 'Medium',
    tags: ['Array', 'Math', 'Matrix'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 72.9, premium: false,
    description: `Given an <code>n x n</code> 2D matrix, rotate it 90 degrees clockwise in-place.<br><br>Input: n rows of n space-separated integers. Output: rotated matrix.`,
    examples: [
      { input: '1 2 3\n4 5 6\n7 8 9',          output: '7 4 1\n8 5 2\n9 6 3' },
      { input: '5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16', output: '15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11' },
    ],
    constraints: ['n == matrix.length == matrix[i].length', '1 ≤ n ≤ 20', '-1000 ≤ matrix[i][j] ≤ 1000'],
    testCases: [
      { input: '1 2 3\n4 5 6\n7 8 9',          expected: '7 4 1\n8 5 2\n9 6 3',                             hidden: false },
      { input: '5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16', expected: '15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11', hidden: false },
      { input: '1',                             expected: '1',                                                hidden: true  },
    ],
    hints: [
      'Transpose the matrix first (swap matrix[i][j] and matrix[j][i]).',
      'Then reverse each row.',
      'This achieves a 90° clockwise rotation in-place.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {

    }
};`,
      python: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        `,
      java: `class Solution {
    public void rotate(int[][] matrix) {

    }
}`,
      javascript: `/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {

};`,
      c: `void rotate(int** matrix, int matrixSize, int* matrixColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> matrix; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        matrix.push_back(row);
    }
    Solution sol; sol.rotate(matrix);
    for (auto& row : matrix) { for (int i = 0; i < (int)row.size(); i++) cout << (i ? " " : "") << row[i]; cout << "\\n"; }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
matrix = [list(map(int, l.split())) for l in lines]
Solution().rotate(matrix)
for row in matrix: print(*row)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine().trim(); if (l.isEmpty()) continue;
            rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray());
        }
        int[][] m = rows.toArray(new int[0][]);
        new Solution().rotate(m);
        for (int[] row : m) { StringBuilder sb = new StringBuilder(); for (int i=0;i<row.length;i++) sb.append(i>0?" ":"").append(row[i]); System.out.println(sb); }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const matrix = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

rotate(matrix);
for (const row of matrix) console.log(row.join(' '));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    int m[21][21], n = 0; char buf[500];
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0] == '\\n') continue;
        char *p = buf; int j = 0;
        while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } m[n][j++] = strtol(p, &p, 10); }
        n++;
    }
    int *ptrs[21]; int colSizes[21];
    for (int i = 0; i < n; i++) { ptrs[i] = m[i]; colSizes[i] = n; }
    rotate((int**)ptrs, n, colSizes);
    for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) printf("%s%d", j ? " " : "", m[i][j]); printf("\\n"); }
    return 0;
}`,
    },
    aiContext: 'Rotate Image — transpose + reverse rows O(n²)',
  },

  // ── 30. Palindrome Number ────────────────────────────────────────────────────
  {
    number: 30, title: 'Palindrome Number', slug: 'palindrome-number', difficulty: 'Easy',
    tags: ['Math'], companies: ['Amazon', 'Google'],
    acceptance: 52.9, premium: false,
    description: `Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.<br><br>Negative numbers and numbers ending in 0 (except 0 itself) are not palindromes.`,
    examples: [
      { input: 'x = 121',  output: 'true',  explanation: 'Reads the same left to right' },
      { input: 'x = -121', output: 'false', explanation: 'Negative number' },
      { input: 'x = 10',   output: 'false', explanation: 'Reads 01 from right to left' },
    ],
    constraints: ['-2³¹ ≤ x ≤ 2³¹-1'],
    testCases: [
      { input: '121',  expected: 'true',  hidden: false },
      { input: '-121', expected: 'false', hidden: false },
      { input: '10',   expected: 'false', hidden: false },
      { input: '0',    expected: 'true',  hidden: true  },
      { input: '1221', expected: 'true',  hidden: true  },
    ],
    hints: [
      'Negative numbers are never palindromes.',
      'Numbers ending in 0 (except 0) are not palindromes.',
      'Reverse only half the number to avoid overflow.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {

    }
};`,
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        `,
      java: `class Solution {
    public boolean isPalindrome(int x) {

    }
}`,
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {

};`,
      c: `bool isPalindrome(int x) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int x; cin >> x;
    Solution sol;
    cout << (sol.isPalindrome(x) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

x = int(sys.stdin.read().strip())
print(str(Solution().isPalindrome(x)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int x = new Scanner(System.in).nextInt();
        System.out.println(new Solution().isPalindrome(x));
    }
}`,
      javascript: `const x = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(String(isPalindrome(x)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int x; scanf("%d", &x);
    printf("%s\\n", isPalindrome(x) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Palindrome Number — reverse half O(log n)',
  },


  // ── PROBLEMS 31–40 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 31. Linked List Cycle ────────────────────────────────────────────────────
  {
    number: 31, title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy',
    tags: ['Hash Table', 'Linked List', 'Two Pointers'],
    companies: ['Amazon', 'Bloomberg', 'Yahoo'], acceptance: 45.8, premium: false,
    description: `Given a linked list as space-separated integers followed by a cycle position (last line, 0-indexed; -1 means no cycle), return <code>true</code> if there is a cycle, <code>false</code> otherwise.`,
    examples: [
      { input: '3 2 0 -4\n1', output: 'true',  explanation: 'Tail connects to node at index 1' },
      { input: '1 2\n0',      output: 'true'  },
      { input: '1\n-1',       output: 'false' },
    ],
    constraints: ['0 ≤ n ≤ 10⁴', '-10⁵ ≤ Node.val ≤ 10⁵'],
    testCases: [
      { input: '3 2 0 -4\n1', expected: 'true',  hidden: false },
      { input: '1 2\n0',      expected: 'true',  hidden: false },
      { input: '1\n-1',       expected: 'false', hidden: false },
      { input: '1 2 3\n-1',   expected: 'false', hidden: true  },
      { input: '1 2 3\n2',    expected: 'true',  hidden: true  },
    ],
    hints: [
      "Use Floyd's cycle detection (tortoise and hare).",
      'Slow pointer moves 1 step, fast pointer moves 2 steps.',
      'If they ever meet, a cycle exists.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    bool hasCycle(ListNode *head) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
class Solution:
    def hasCycle(self, head) -> bool:
        `,
      java: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; next = null; }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
bool hasCycle(struct ListNode *head) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

__USER_CODE__

int main() {
    vector<int> vals; int x;
    string line; getline(cin, line);
    istringstream ss(line); while (ss >> x) vals.push_back(x);
    int pos; cin >> pos;
    if (vals.empty()) { cout << "false" << endl; return 0; }
    vector<ListNode*> nodes;
    for (int v : vals) nodes.push_back(new ListNode(v));
    for (int i = 0; i < (int)nodes.size()-1; i++) nodes[i]->next = nodes[i+1];
    if (pos != -1) nodes.back()->next = nodes[pos];
    Solution sol;
    cout << (sol.hasCycle(nodes[0]) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

class ListNode:
    def __init__(self, x):
        self.val = x; self.next = None

__USER_CODE__

data = sys.stdin.read().split('\\n')
vals = list(map(int, data[0].split()))
pos = int(data[1].strip())
if not vals: print('false'); exit()
nodes = [ListNode(v) for v in vals]
for i in range(len(nodes)-1): nodes[i].next = nodes[i+1]
if pos != -1: nodes[-1].next = nodes[pos]
print(str(Solution().hasCycle(nodes[0])).lower())`,
      java: `import java.util.*;

class ListNode {
    int val; ListNode next;
    ListNode(int x) { val = x; }
}

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] vals = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int pos = sc.nextInt();
        if (vals.length == 0) { System.out.println("false"); return; }
        ListNode[] nodes = new ListNode[vals.length];
        for (int i = 0; i < vals.length; i++) nodes[i] = new ListNode(vals[i]);
        for (int i = 0; i < vals.length-1; i++) nodes[i].next = nodes[i+1];
        if (pos != -1) nodes[vals.length-1].next = nodes[pos];
        System.out.println(new Solution().hasCycle(nodes[0]));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const vals = lines[0].split(' ').map(Number);
const pos = parseInt(lines[1]);

function ListNode(val) { this.val = val; this.next = null; }

__USER_CODE__

if (!vals.length) { console.log('false'); process.exit(0); }
const nodes = vals.map(v => new ListNode(v));
for (let i = 0; i < nodes.length-1; i++) nodes[i].next = nodes[i+1];
if (pos !== -1) nodes[nodes.length-1].next = nodes[pos];
console.log(String(hasCycle(nodes[0])));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct ListNode { int val; struct ListNode *next; };

__USER_CODE__

int main() {
    int vals[10001], n = 0, pos;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } vals[n++] = strtol(p, &p, 10); }
    scanf("%d", &pos);
    if (n == 0) { printf("false\\n"); return 0; }
    struct ListNode *nodes = malloc(n * sizeof(struct ListNode));
    for (int i = 0; i < n; i++) { nodes[i].val = vals[i]; nodes[i].next = i+1 < n ? &nodes[i+1] : NULL; }
    if (pos != -1) nodes[n-1].next = &nodes[pos];
    printf("%s\\n", hasCycle(&nodes[0]) ? "true" : "false");
    free(nodes); return 0;
}`,
    },
    aiContext: "Linked List Cycle — Floyd's tortoise and hare O(n)",
  },

  // ── 32. Symmetric Tree ───────────────────────────────────────────────────────
  {
    number: 32, title: 'Symmetric Tree', slug: 'symmetric-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'], companies: ['LinkedIn', 'Bloomberg', 'Microsoft'],
    acceptance: 53.5, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), check whether it is a mirror of itself (symmetric around its center).`,
    examples: [
      { input: '1 2 2 3 4 4 3',      output: 'true'  },
      { input: '1 2 2 null 3 null 3', output: 'false' },
    ],
    constraints: ['1 ≤ number of nodes ≤ 1000', '-100 ≤ Node.val ≤ 100'],
    testCases: [
      { input: '1 2 2 3 4 4 3',      expected: 'true',  hidden: false },
      { input: '1 2 2 null 3 null 3', expected: 'false', hidden: false },
      { input: '1',                   expected: 'true',  hidden: true  },
      { input: '1 2 2 3 null 3 null', expected: 'false', hidden: true  },
    ],
    hints: [
      'Two trees are mirrors if their root values match.',
      "Left subtree's left must equal right subtree's right.",
      "Left subtree's right must equal right subtree's left.",
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    bool isSymmetric(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public boolean isSymmetric(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
bool isSymmetric(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left = build(v, 2*i+1); n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << (sol.isSymmetric(root) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

vals = sys.stdin.read().split()
print(str(Solution().isSymmetric(build(vals))).lower())`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left = build(v, 2*i+1); n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        String[] vals = new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root = vals.length == 0 || vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().isSymmetric(root));
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left = build(vals, 2*i+1); n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(String(isSymmetric(root)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left = build(toks, n, 2*i+1); node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%s\\n", isSymmetric(root) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Symmetric Tree — recursive mirror check O(n)',
  },

  // ── 33. Balanced Binary Tree ──────────────────────────────────────────────────
  {
    number: 33, title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS'], companies: ['Bloomberg', 'Microsoft', 'Amazon'],
    acceptance: 49.8, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), determine if it is height-balanced (the depth of the two subtrees of every node differs by at most 1).`,
    examples: [
      { input: '3 9 20 null null 15 7',   output: 'true'  },
      { input: '1 2 2 3 3 null null 4 4', output: 'false' },
    ],
    constraints: ['0 ≤ number of nodes ≤ 5000', '-10⁴ ≤ Node.val ≤ 10⁴'],
    testCases: [
      { input: '3 9 20 null null 15 7',   expected: 'true',  hidden: false },
      { input: '1 2 2 3 3 null null 4 4', expected: 'false', hidden: false },
      { input: 'null',                    expected: 'true',  hidden: true  },
      { input: '1 2 null 3',              expected: 'false', hidden: true  },
    ],
    hints: [
      'DFS returns height, or -1 if the subtree is unbalanced.',
      'At each node check |leftHeight - rightHeight| <= 1.',
      'Propagate -1 upward if any subtree is unbalanced.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    bool isBalanced(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public boolean isBalanced(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
bool isBalanced(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left = build(v, 2*i+1); n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << (sol.isBalanced(root) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

vals = sys.stdin.read().split()
print(str(Solution().isBalanced(build(vals))).lower())`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left = build(v, 2*i+1); n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        String[] vals = new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root = vals.length == 0 || vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().isBalanced(root));
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left = build(vals, 2*i+1); n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(String(isBalanced(root)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left = build(toks, n, 2*i+1); node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%s\\n", isBalanced(root) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Balanced Binary Tree — DFS returning -1 on imbalance O(n)',
  },

  // ── 34. Merge Two Sorted Lists ───────────────────────────────────────────────
  {
    number: 34, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 62.3, premium: false,
    description: `Merge two sorted linked lists and return it as a sorted list.<br><br>Input: two lines, each with space-separated integers (empty line = empty list). Output: merged list space-separated.`,
    examples: [
      { input: '1 2 4\n1 3 4', output: '1 1 2 3 4 4' },
      { input: '\n',           output: ''             },
      { input: '\n0',          output: '0'            },
    ],
    constraints: ['0 ≤ n, m ≤ 50', '-100 ≤ Node.val ≤ 100', 'Both lists are sorted in non-decreasing order'],
    testCases: [
      { input: '1 2 4\n1 3 4', expected: '1 1 2 3 4 4', hidden: false },
      { input: '\n',           expected: '',             hidden: false },
      { input: '\n0',          expected: '0',            hidden: true  },
      { input: '1 3 5\n2 4 6', expected: '1 2 3 4 5 6', hidden: true  },
    ],
    hints: [
      'Use a dummy head node to simplify edge cases.',
      'Compare heads of both lists, append the smaller one.',
      'Append the remaining list at the end.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        `,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* makeList(string line) {
    if (line.empty()) return nullptr;
    istringstream ss(line); vector<int> v; int x;
    while (ss >> x) v.push_back(x);
    if (v.empty()) return nullptr;
    ListNode* h = new ListNode(v[0]); ListNode* c = h;
    for (int i = 1; i < (int)v.size(); i++) { c->next = new ListNode(v[i]); c = c->next; }
    return h;
}

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    ListNode* res = Solution().mergeTwoLists(makeList(l1), makeList(l2));
    bool first = true;
    while (res) { if (!first) cout << " "; cout << res->val; res = res->next; first = false; }
    cout << endl; return 0;
}`,
      python: `from typing import Optional
import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

def makeList(line):
    vals = list(map(int, line.split())) if line.strip() else []
    if not vals: return None
    h = ListNode(vals[0]); c = h
    for v in vals[1:]: c.next = ListNode(v); c = c.next
    return h

__USER_CODE__

lines = sys.stdin.read().split('\\n')
l1 = makeList(lines[0] if lines else '')
l2 = makeList(lines[1] if len(lines) > 1 else '')
res = Solution().mergeTwoLists(l1, l2)
out = []
while res: out.append(str(res.val)); res = res.next
print(' '.join(out))`,
      java: `import java.util.*;

class ListNode {
    int val; ListNode next;
    ListNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static ListNode makeList(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] parts = line.trim().split(" ");
        ListNode h = new ListNode(Integer.parseInt(parts[0])), c = h;
        for (int i = 1; i < parts.length; i++) { c.next = new ListNode(Integer.parseInt(parts[i])); c = c.next; }
        return h;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String l1 = sc.hasNextLine() ? sc.nextLine() : "";
        String l2 = sc.hasNextLine() ? sc.nextLine() : "";
        ListNode res = new Solution().mergeTwoLists(makeList(l1), makeList(l2));
        StringBuilder sb = new StringBuilder();
        while (res != null) { if (sb.length() > 0) sb.append(" "); sb.append(res.val); res = res.next; }
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');

function ListNode(val, next) { this.val = val ?? 0; this.next = next ?? null; }

function makeList(line) {
    const vals = line && line.trim() ? line.trim().split(' ').map(Number) : [];
    if (!vals.length) return null;
    const h = new ListNode(vals[0]); let c = h;
    for (let i = 1; i < vals.length; i++) { c.next = new ListNode(vals[i]); c = c.next; }
    return h;
}

__USER_CODE__

let res = mergeTwoLists(makeList(lines[0] || ''), makeList(lines[1] || ''));
const out = [];
while (res) { out.push(res.val); res = res.next; }
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct ListNode { int val; struct ListNode *next; };
struct ListNode* newNode(int v) { struct ListNode* n = malloc(sizeof(struct ListNode)); n->val=v; n->next=NULL; return n; }

struct ListNode* makeList(char* buf) {
    if (!buf || buf[0] == '\\n' || buf[0] == '\\0') return NULL;
    struct ListNode *h = NULL, **tail = &h; char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } *tail = newNode(strtol(p,&p,10)); tail = &(*tail)->next; }
    return h;
}

__USER_CODE__

int main() {
    char b1[500], b2[500];
    fgets(b1, sizeof(b1), stdin); fgets(b2, sizeof(b2), stdin);
    struct ListNode* res = mergeTwoLists(makeList(b1), makeList(b2));
    int first = 1;
    while (res) { if (!first) printf(" "); printf("%d", res->val); res = res->next; first = 0; }
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Merge Two Sorted Lists — iterative dummy head O(m+n)',
  },

  // ── 35. Spiral Matrix ────────────────────────────────────────────────────────
  {
    number: 35, title: 'Spiral Matrix', slug: 'spiral-matrix', difficulty: 'Medium',
    tags: ['Array', 'Matrix', 'Simulation'], companies: ['Microsoft', 'Amazon', 'Google'],
    acceptance: 46.0, premium: false,
    description: `Given an <code>m x n</code> matrix, return all elements in spiral order (space-separated on one line).<br><br>Input: m rows of n space-separated integers.`,
    examples: [
      { input: '1 2 3\n4 5 6\n7 8 9',          output: '1 2 3 6 9 8 7 4 5'          },
      { input: '1 2 3 4\n5 6 7 8\n9 10 11 12', output: '1 2 3 4 8 12 11 10 9 5 6 7' },
    ],
    constraints: ['1 ≤ m, n ≤ 10', '-100 ≤ matrix[i][j] ≤ 100'],
    testCases: [
      { input: '1 2 3\n4 5 6\n7 8 9',          expected: '1 2 3 6 9 8 7 4 5',          hidden: false },
      { input: '1 2 3 4\n5 6 7 8\n9 10 11 12', expected: '1 2 3 4 8 12 11 10 9 5 6 7', hidden: false },
      { input: '1',                             expected: '1',                           hidden: true  },
      { input: '1 2\n3 4',                      expected: '1 2 4 3',                    hidden: true  },
    ],
    hints: [
      'Maintain four boundaries: top, bottom, left, right.',
      'Traverse in order: left→right, top→bottom, right→left, bottom→top.',
      'Shrink boundaries after each direction pass.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {

    }
};`,
      python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        `,
      java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {

    }
}`,
      javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {

};`,
      c: `int* spiralOrder(int** matrix, int matrixSize, int* matrixColSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> matrix; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        matrix.push_back(row);
    }
    Solution sol;
    vector<int> res = sol.spiralOrder(matrix);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
matrix = [list(map(int, l.split())) for l in lines]
print(*Solution().spiralOrder(matrix))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine().trim(); if (l.isEmpty()) continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        int[][] m = rows.toArray(new int[0][]);
        List<Integer> res = new Solution().spiralOrder(m);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) sb.append(i > 0 ? " " : "").append(res.get(i));
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const matrix = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(spiralOrder(matrix).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int m[11][11], rows = 0, cols = 0; char buf[500];
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0] == '\\n') continue; char *p = buf; int j = 0;
        while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } m[rows][j++] = strtol(p, &p, 10); }
        cols = j; rows++;
    }
    int *ptrs[11]; int colSizes[11];
    for (int i = 0; i < rows; i++) { ptrs[i] = m[i]; colSizes[i] = cols; }
    int retSize;
    int *res = spiralOrder((int**)ptrs, rows, colSizes, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\\n"); free(res); return 0;
}`,
    },
    aiContext: 'Spiral Matrix — boundary simulation O(m*n)',
  },

  // ── 36. Find Minimum in Rotated Sorted Array ─────────────────────────────────
  {
    number: 36, title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium',
    tags: ['Array', 'Binary Search'], companies: ['Microsoft', 'Amazon', 'Facebook'],
    acceptance: 48.4, premium: false,
    description: `Given a sorted array that has been rotated between 1 and n times, find the minimum element. You must write an algorithm that runs in <code>O(log n)</code>.`,
    examples: [
      { input: 'nums = [3,4,5,1,2]',     output: '1'  },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0'  },
      { input: 'nums = [11,13,15,17]',   output: '11' },
    ],
    constraints: ['1 ≤ n ≤ 5000', 'All values are unique', '-5000 ≤ nums[i] ≤ 5000'],
    testCases: [
      { input: '3 4 5 1 2',     expected: '1',  hidden: false },
      { input: '4 5 6 7 0 1 2', expected: '0',  hidden: false },
      { input: '11 13 15 17',   expected: '11', hidden: false },
      { input: '2 1',           expected: '1',  hidden: true  },
      { input: '1',             expected: '1',  hidden: true  },
    ],
    hints: [
      'Binary search: compare mid with the right boundary.',
      'If nums[mid] > nums[right], minimum is in the right half.',
      'Otherwise minimum is in the left half (including mid).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int findMin(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {

};`,
      c: `int findMin(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.findMin(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().findMin(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().findMin(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(findMin(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[5001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", findMin(nums, n));
    return 0;
}`,
    },
    aiContext: 'Find Minimum in Rotated Sorted Array — binary search O(log n)',
  },

  // ── 37. Subsets ──────────────────────────────────────────────────────────────
  {
    number: 37, title: 'Subsets', slug: 'subsets', difficulty: 'Medium',
    tags: ['Array', 'Backtracking', 'Bit Manipulation'], companies: ['Facebook', 'Amazon', 'Bloomberg'],
    acceptance: 74.3, premium: false,
    description: `Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set).<br><br>Print each subset on a separate line as space-separated integers. Print empty line for empty subset. Output in lexicographic order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3' },
      { input: 'nums = [0]',     output: '\n0'                               },
    ],
    constraints: ['1 ≤ nums.length ≤ 10', 'All elements are unique', '-10 ≤ nums[i] ≤ 10'],
    testCases: [
      { input: '1 2 3', expected: '\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3', hidden: false },
      { input: '0',     expected: '\n0',                              hidden: false },
      { input: '1 2',   expected: '\n1\n1 2\n2',                     hidden: true  },
    ],
    hints: [
      'Use backtracking: at each index choose to include or exclude the element.',
      'Or use bitmask: for n elements there are 2^n subsets.',
      'Sort nums first to ensure lexicographic order.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {

};`,
      c: `int** subsets(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    sort(nums.begin(), nums.end());
    Solution sol;
    vector<vector<int>> res = sol.subsets(nums);
    sort(res.begin(), res.end());
    for (auto& s : res) {
        for (int i = 0; i < (int)s.size(); i++) cout << (i ? " " : "") << s[i];
        cout << "\\n";
    }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = sorted(map(int, sys.stdin.read().split()))
res = Solution().subsets(nums)
res.sort()
for s in res: print(*s)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        Arrays.sort(nums);
        List<List<Integer>> res = new Solution().subsets(nums);
        res.sort(Comparator.comparing(Object::toString));
        for (List<Integer> s : res) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < s.size(); i++) sb.append(i > 0 ? " " : "").append(s.get(i));
            System.out.println(sb);
        }
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number).sort((a,b)=>a-b);

__USER_CODE__

const res = subsets(nums);
res.sort((a,b) => { for(let i=0;i<Math.min(a.length,b.length);i++) if(a[i]!==b[i]) return a[i]-b[i]; return a.length-b.length; });
for (const s of res) console.log(s.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[20], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize; int *retColSizes;
    int **res = subsets(nums, n, &retSize, &retColSizes);
    for (int i = 0; i < retSize; i++) {
        for (int j = 0; j < retColSizes[i]; j++) printf("%s%d", j ? " " : "", res[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    },
    aiContext: 'Subsets — backtracking or bitmask O(2^n)',
  },

  // ── 38. Permutations ─────────────────────────────────────────────────────────
  {
    number: 38, title: 'Permutations', slug: 'permutations', difficulty: 'Medium',
    tags: ['Array', 'Backtracking'], companies: ['LinkedIn', 'Microsoft', 'Amazon'],
    acceptance: 74.4, premium: false,
    description: `Given an array of distinct integers, return all possible permutations.<br><br>Print each permutation on a separate line as space-separated integers. Print in lexicographic order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' },
      { input: 'nums = [0,1]',   output: '0 1\n1 0'                                   },
      { input: 'nums = [1]',     output: '1'                                           },
    ],
    constraints: ['1 ≤ nums.length ≤ 6', 'All integers are unique', '-10 ≤ nums[i] ≤ 10'],
    testCases: [
      { input: '1 2 3', expected: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', hidden: false },
      { input: '0 1',   expected: '0 1\n1 0',                                   hidden: false },
      { input: '1',     expected: '1',                                           hidden: true  },
    ],
    hints: [
      'Use backtracking with a used[] boolean array.',
      'At each position try all unused elements.',
      'Sort nums first for lexicographic output.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> permute(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {

};`,
      c: `int** permute(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    sort(nums.begin(), nums.end());
    Solution sol;
    vector<vector<int>> res = sol.permute(nums);
    sort(res.begin(), res.end());
    for (auto& p : res) {
        for (int i = 0; i < (int)p.size(); i++) cout << (i ? " " : "") << p[i];
        cout << "\\n";
    }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = sorted(map(int, sys.stdin.read().split()))
res = Solution().permute(nums)
res.sort()
for p in res: print(*p)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        Arrays.sort(nums);
        List<List<Integer>> res = new Solution().permute(nums);
        res.sort(Comparator.comparing(Object::toString));
        for (List<Integer> p : res) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < p.size(); i++) sb.append(i > 0 ? " " : "").append(p.get(i));
            System.out.println(sb);
        }
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number).sort((a,b)=>a-b);

__USER_CODE__

const res = permute(nums);
res.sort((a,b) => { for(let i=0;i<a.length;i++) if(a[i]!==b[i]) return a[i]-b[i]; return 0; });
for (const p of res) console.log(p.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[7], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize; int *retColSizes;
    int **res = permute(nums, n, &retSize, &retColSizes);
    for (int i = 0; i < retSize; i++) {
        for (int j = 0; j < retColSizes[i]; j++) printf("%s%d", j ? " " : "", res[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    },
    aiContext: 'Permutations — backtracking O(n!)',
  },

  // ── 39. Combination Sum ──────────────────────────────────────────────────────
  {
    number: 39, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium',
    tags: ['Array', 'Backtracking'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 67.2, premium: false,
    description: `Given an array of distinct integers <code>candidates</code> and a target integer, return all unique combinations where the chosen numbers sum to target. The same number may be used unlimited times.<br><br>First line: space-separated candidates. Second line: target. Print each combination sorted, one per line.`,
    examples: [
      { input: '2 3 6 7\n7', output: '2 2 3\n7'            },
      { input: '2 3 5\n8',   output: '2 2 2 2\n2 3 3\n3 5' },
    ],
    constraints: ['1 ≤ candidates.length ≤ 30', '2 ≤ candidates[i] ≤ 40', '1 ≤ target ≤ 40'],
    testCases: [
      { input: '2 3 6 7\n7', expected: '2 2 3\n7',            hidden: false },
      { input: '2 3 5\n8',   expected: '2 2 2 2\n2 3 3\n3 5', hidden: false },
      { input: '2\n1',       expected: '',                    hidden: true  },
      { input: '1\n2',       expected: '1 1',                 hidden: true  },
    ],
    hints: [
      'Sort candidates first.',
      'Backtrack: at each step try each candidate starting from current index (allow reuse).',
      'Prune when remaining target < candidate.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {

    }
};`,
      python: `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {

    }
}`,
      javascript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {

};`,
      c: `int** combinationSum(int* candidates, int candidatesSize, int target, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> cands; int x;
    while (ss >> x) cands.push_back(x);
    int target; cin >> target;
    Solution sol;
    vector<vector<int>> res = sol.combinationSum(cands, target);
    sort(res.begin(), res.end());
    for (auto& v : res) {
        for (int i = 0; i < (int)v.size(); i++) cout << (i ? " " : "") << v[i];
        cout << "\\n";
    }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
cands = list(map(int, data[0].split()))
target = int(data[1].strip())
res = Solution().combinationSum(cands, target)
res.sort()
for v in res: print(*v)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] cands = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int target = sc.nextInt();
        List<List<Integer>> res = new Solution().combinationSum(cands, target);
        res.sort(Comparator.comparing(Object::toString));
        for (List<Integer> v : res) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < v.size(); i++) sb.append(i > 0 ? " " : "").append(v.get(i));
            System.out.println(sb);
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const cands = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

__USER_CODE__

const res = combinationSum(cands, target);
res.sort((a,b) => { for(let i=0;i<Math.min(a.length,b.length);i++) if(a[i]!==b[i]) return a[i]-b[i]; return a.length-b.length; });
for (const v of res) console.log(v.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int cands[31], nc = 0, target;
    char buf[500]; fgets(buf, sizeof(buf), stdin); char *p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } cands[nc++] = strtol(p, &p, 10); }
    scanf("%d", &target);
    int retSize; int *retColSizes;
    int **res = combinationSum(cands, nc, target, &retSize, &retColSizes);
    for (int i = 0; i < retSize; i++) {
        for (int j = 0; j < retColSizes[i]; j++) printf("%s%d", j ? " " : "", res[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    },
    aiContext: 'Combination Sum — backtracking with reuse O(2^(t/min))',
  },

  // ── 40. Count Primes ─────────────────────────────────────────────────────────
  {
    number: 40, title: 'Count Primes', slug: 'count-primes', difficulty: 'Medium',
    tags: ['Array', 'Math', 'Enumeration', 'Number Theory'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg'], acceptance: 33.0, premium: false,
    description: `Given an integer <code>n</code>, return the number of prime numbers that are strictly less than <code>n</code>.`,
    examples: [
      { input: 'n = 10', output: '4', explanation: '2, 3, 5, 7 are prime' },
      { input: 'n = 0',  output: '0' },
      { input: 'n = 1',  output: '0' },
    ],
    constraints: ['0 ≤ n ≤ 5×10⁶'],
    testCases: [
      { input: '10',   expected: '4',   hidden: false },
      { input: '0',    expected: '0',   hidden: false },
      { input: '1',    expected: '0',   hidden: false },
      { input: '100',  expected: '25',  hidden: true  },
      { input: '5000', expected: '669', hidden: true  },
    ],
    hints: [
      'Use the Sieve of Eratosthenes.',
      'Mark all multiples of each prime as composite.',
      'Count remaining unmarked numbers (2 to n-1).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int countPrimes(int n) {

    }
};`,
      python: `class Solution:
    def countPrimes(self, n: int) -> int:
        `,
      java: `class Solution {
    public int countPrimes(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {

};`,
      c: `int countPrimes(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << sol.countPrimes(n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().countPrimes(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().countPrimes(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(countPrimes(n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%d\\n", countPrimes(n));
    return 0;
}`,
    },
    aiContext: 'Count Primes — Sieve of Eratosthenes O(n log log n)',
  },


  // ── PROBLEMS 41–50 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 41. Longest Palindromic Substring ────────────────────────────────────────
  {
    number: 41, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 32.4, premium: false,
    description: `Given a string <code>s</code>, return the longest palindromic substring.`,
    examples: [
      { input: 's = "babad"', output: 'bab', explanation: '"aba" is also valid' },
      { input: 's = "cbbd"',  output: 'bb'  },
    ],
    constraints: ['1 ≤ s.length ≤ 1000', 's consists of digits and English letters'],
    testCases: [
      { input: 'babad',   expected: 'bab',     hidden: false },
      { input: 'cbbd',    expected: 'bb',      hidden: false },
      { input: 'a',       expected: 'a',       hidden: true  },
      { input: 'ac',      expected: 'a',       hidden: true  },
      { input: 'racecar', expected: 'racecar', hidden: true  },
    ],
    hints: [
      'Expand around center for each character.',
      'Try both odd-length and even-length palindromes.',
      'Track the start index and maximum length.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string longestPalindrome(string s) {

    }
};`,
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        `,
      java: `class Solution {
    public String longestPalindrome(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {

};`,
      c: `char* longestPalindrome(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    Solution sol;
    cout << sol.longestPalindrome(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().longestPalindrome(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        System.out.println(new Solution().longestPalindrome(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

__USER_CODE__

console.log(longestPalindrome(s));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[1001]; fgets(s, sizeof(s), stdin);
    int n = strlen(s); if (s[n-1] == '\\n') s[--n] = '\\0';
    printf("%s\\n", longestPalindrome(s));
    return 0;
}`,
    },
    aiContext: 'Longest Palindromic Substring — expand around center O(n²)',
  },

  // ── 42. Decode Ways ──────────────────────────────────────────────────────────
  {
    number: 42, title: 'Decode Ways', slug: 'decode-ways', difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'], companies: ['Facebook', 'Amazon', 'Uber'],
    acceptance: 32.8, premium: false,
    description: `A message containing letters A-Z can be encoded into numbers (A=1, B=2, ..., Z=26). Given a string of digits <code>s</code>, return the number of ways to decode it.`,
    examples: [
      { input: '12',  output: '2',  explanation: '"AB" (1,2) or "L" (12)' },
      { input: '226', output: '3',  explanation: '"BZ" "VF" or "BBF"'      },
      { input: '06',  output: '0',  explanation: 'Leading zero is invalid'  },
    ],
    constraints: ['1 ≤ s.length ≤ 100', 's contains only digits', 's may contain leading zeros'],
    testCases: [
      { input: '12',    expected: '2', hidden: false },
      { input: '226',   expected: '3', hidden: false },
      { input: '06',    expected: '0', hidden: false },
      { input: '11106', expected: '2', hidden: true  },
      { input: '1',     expected: '1', hidden: true  },
    ],
    hints: [
      'dp[i] = number of ways to decode s[:i].',
      'Single digit valid if s[i-1] != "0".',
      'Two digits valid if s[i-2:i] is between "10" and "26".',
    ],
    starter: {
      cpp: `class Solution {
public:
    int numDecodings(string s) {

    }
};`,
      python: `class Solution:
    def numDecodings(self, s: str) -> int:
        `,
      java: `class Solution {
    public int numDecodings(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {

};`,
      c: `int numDecodings(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; cin >> s;
    Solution sol;
    cout << sol.numDecodings(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().numDecodings(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).next().trim();
        System.out.println(new Solution().numDecodings(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

__USER_CODE__

console.log(numDecodings(s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    char s[101]; scanf("%s", s);
    printf("%d\\n", numDecodings(s));
    return 0;
}`,
    },
    aiContext: 'Decode Ways — DP O(n)',
  },

  // ── 43. Word Search ──────────────────────────────────────────────────────────
  {
    number: 43, title: 'Word Search', slug: 'word-search', difficulty: 'Medium',
    tags: ['Array', 'Backtracking', 'Matrix'], companies: ['Amazon', 'Microsoft', 'Facebook'],
    acceptance: 39.7, premium: false,
    description: `Given an <code>m x n</code> grid of characters and a word, return <code>true</code> if the word exists in the grid.<br><br>The word can be constructed from sequentially adjacent cells (horizontal/vertical). The same cell may not be used more than once.<br><br>Input: first line is the word, then each row of the grid.`,
    examples: [
      { input: 'ABCCED\nABCE\nSFCS\nADEE', output: 'true'  },
      { input: 'SEE\nABCE\nSFCS\nADEE',   output: 'true'  },
      { input: 'ABCB\nABCE\nSFCS\nADEE',  output: 'false' },
    ],
    constraints: ['1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15', 'grid and word consist of uppercase English letters'],
    testCases: [
      { input: 'ABCCED\nABCE\nSFCS\nADEE', expected: 'true',  hidden: false },
      { input: 'SEE\nABCE\nSFCS\nADEE',    expected: 'true',  hidden: false },
      { input: 'ABCB\nABCE\nSFCS\nADEE',   expected: 'false', hidden: false },
      { input: 'A\nA',                      expected: 'true',  hidden: true  },
    ],
    hints: [
      'Use DFS + backtracking from every cell.',
      'Mark a cell as visited before recursing, restore it after.',
      'Prune early if the current character does not match.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {

    }
};`,
      python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        `,
      java: `class Solution {
    public boolean exist(char[][] board, String word) {

    }
}`,
      javascript: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {

};`,
      c: `bool exist(char** board, int boardSize, int* boardColSize, char* word) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string word; getline(cin, word);
    vector<vector<char>> board; string line;
    while (getline(cin, line)) { if (!line.empty()) board.push_back(vector<char>(line.begin(), line.end())); }
    Solution sol;
    cout << (sol.exist(board, word) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
word = lines[0]
board = [list(l) for l in lines[1:]]
print(str(Solution().exist(board, word)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word = sc.nextLine().trim();
        List<char[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine(); if (!l.isEmpty()) rows.add(l.toCharArray()); }
        char[][] board = rows.toArray(new char[0][]);
        System.out.println(new Solution().exist(board, word));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const word = lines[0];
const board = lines.slice(1).map(l => l.split(''));

__USER_CODE__

console.log(String(exist(board, word)));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    char word[20]; scanf("%s", word);
    char bufs[10][10]; int n = 0;
    while (scanf("%s", bufs[n]) == 1) n++;
    char *ptrs[10]; int colSizes[10];
    for (int i = 0; i < n; i++) { ptrs[i] = bufs[i]; colSizes[i] = strlen(bufs[i]); }
    printf("%s\\n", exist(ptrs, n, colSizes, word) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Word Search — DFS backtracking O(m*n*4^L)',
  },

  // ── 44. Gas Station ──────────────────────────────────────────────────────────
  {
    number: 44, title: 'Gas Station', slug: 'gas-station', difficulty: 'Medium',
    tags: ['Array', 'Greedy'], companies: ['Amazon', 'Google', 'Bloomberg'],
    acceptance: 45.1, premium: false,
    description: `There are <code>n</code> gas stations in a circle. Given <code>gas[i]</code> and <code>cost[i]</code>, find the starting station index to complete the circuit. Return -1 if impossible.<br><br>First line: gas values. Second line: cost values.`,
    examples: [
      { input: '1 2 3 4 5\n3 4 5 1 2', output: '3'  },
      { input: '2 3 4\n3 4 3',         output: '-1' },
    ],
    constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ gas[i], cost[i] ≤ 10⁴'],
    testCases: [
      { input: '1 2 3 4 5\n3 4 5 1 2', expected: '3',  hidden: false },
      { input: '2 3 4\n3 4 3',         expected: '-1', hidden: false },
      { input: '5\n4',                 expected: '0',  hidden: true  },
      { input: '1 2\n2 1',             expected: '1',  hidden: true  },
    ],
    hints: [
      'If total gas < total cost, return -1.',
      'Greedily find start: reset when running tank goes negative.',
      'There is at most one valid starting point.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {

    }
};`,
      python: `class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        `,
      java: `class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {

    }
}`,
      javascript: `/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {

};`,
      c: `int canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    istringstream s1(l1), s2(l2);
    vector<int> gas, cost; int x;
    while (s1 >> x) gas.push_back(x);
    while (s2 >> x) cost.push_back(x);
    Solution sol;
    cout << sol.canCompleteCircuit(gas, cost) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
gas  = list(map(int, lines[0].split()))
cost = list(map(int, lines[1].split()))
print(Solution().canCompleteCircuit(gas, cost))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] gas  = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] cost = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        System.out.println(new Solution().canCompleteCircuit(gas, cost));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const gas  = lines[0].split(' ').map(Number);
const cost = lines[1].split(' ').map(Number);

__USER_CODE__

console.log(canCompleteCircuit(gas, cost));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int gas[100001], cost[100001], n = 0, m = 0;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } gas[n++] = strtol(p, &p, 10); }
    fgets(buf, sizeof(buf), stdin); p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } cost[m++] = strtol(p, &p, 10); }
    printf("%d\\n", canCompleteCircuit(gas, n, cost, m));
    return 0;
}`,
    },
    aiContext: 'Gas Station — greedy one-pass O(n)',
  },

  // ── 45. Rotate Array ─────────────────────────────────────────────────────────
  {
    number: 45, title: 'Rotate Array', slug: 'rotate-array', difficulty: 'Medium',
    tags: ['Array', 'Math', 'Two Pointers'], companies: ['Microsoft', 'Amazon', 'Bloomberg'],
    acceptance: 39.8, premium: false,
    description: `Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps.<br><br>First line: space-separated array. Second line: k.`,
    examples: [
      { input: '1 2 3 4 5 6 7\n3', output: '5 6 7 1 2 3 4' },
      { input: '-1 -100 3 99\n2',   output: '3 99 -1 -100'  },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '0 ≤ k ≤ 10⁵'],
    testCases: [
      { input: '1 2 3 4 5 6 7\n3', expected: '5 6 7 1 2 3 4', hidden: false },
      { input: '-1 -100 3 99\n2',   expected: '3 99 -1 -100',  hidden: false },
      { input: '1 2\n3',           expected: '2 1',            hidden: true  },
      { input: '1\n0',             expected: '1',              hidden: true  },
    ],
    hints: [
      'k = k % n to handle large k.',
      'Reverse the entire array.',
      'Then reverse first k elements, then reverse the rest.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void rotate(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        `,
      java: `class Solution {
    public void rotate(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {

};`,
      c: `void rotate(int* nums, int numsSize, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int k; cin >> k;
    Solution sol; sol.rotate(nums, k);
    for (int i = 0; i < (int)nums.size(); i++) cout << (i ? " " : "") << nums[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
nums = list(map(int, lines[0].split()))
k = int(lines[1].strip())
Solution().rotate(nums, k)
print(*nums)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = sc.nextInt();
        new Solution().rotate(nums, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < nums.length; i++) sb.append(i > 0 ? " " : "").append(nums[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const k = parseInt(lines[1]);

__USER_CODE__

rotate(nums, k);
console.log(nums.join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0, k;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &k);
    rotate(nums, n, k);
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", nums[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Rotate Array — triple reverse O(n)',
  },

  // ── 46. Find All Anagrams in a String ────────────────────────────────────────
  {
    number: 46, title: 'Find All Anagrams in a String', slug: 'find-all-anagrams-in-a-string', difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Facebook', 'Amazon', 'Google'],
    acceptance: 48.5, premium: false,
    description: `Given strings <code>s</code> and <code>p</code>, return all start indices of <code>p</code>'s anagrams in <code>s</code> (space-separated). Return empty line if none.<br><br>First line: s. Second line: p.`,
    examples: [
      { input: 'cbaebabacd\nabc', output: '0 6', explanation: 'Anagrams at index 0 and 6' },
      { input: 'abab\nab',       output: '0 1 2'                                           },
    ],
    constraints: ['1 ≤ s.length, p.length ≤ 3×10⁴', 's and p consist of lowercase English letters'],
    testCases: [
      { input: 'cbaebabacd\nabc', expected: '0 6',   hidden: false },
      { input: 'abab\nab',        expected: '0 1 2', hidden: false },
      { input: 'aa\nbb',          expected: '',       hidden: true  },
      { input: 'baa\naa',         expected: '1',      hidden: true  },
    ],
    hints: [
      'Use a sliding window of size len(p).',
      'Maintain character frequency counts for both the window and p.',
      'Slide the window and update counts incrementally.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> findAnagrams(string s, string p) {

    }
};`,
      python: `class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        `,
      java: `class Solution {
    public List<Integer> findAnagrams(String s, String p) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {

};`,
      c: `int* findAnagrams(char* s, char* p, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s, p; getline(cin, s); getline(cin, p);
    Solution sol;
    vector<int> res = sol.findAnagrams(s, p);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
s, p = lines[0], lines[1]
print(*Solution().findAnagrams(s, p))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim(), p = sc.nextLine().trim();
        List<Integer> res = new Solution().findAnagrams(s, p);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) sb.append(i > 0 ? " " : "").append(res.get(i));
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const s = lines[0], p = lines[1];

__USER_CODE__

console.log(findAnagrams(s, p).join(' '));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[30001], p[30001];
    fgets(s, sizeof(s), stdin); fgets(p, sizeof(p), stdin);
    int ns = strlen(s), np = strlen(p);
    if (s[ns-1] == '\\n') s[--ns] = '\\0';
    if (p[np-1] == '\\n') p[--np] = '\\0';
    int retSize;
    int *res = findAnagrams(s, p, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Find All Anagrams — sliding window with freq array O(n)',
  },

  // ── 47. Letter Combinations of a Phone Number ────────────────────────────────
  {
    number: 47, title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number', difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Backtracking'], companies: ['Amazon', 'Google', 'Uber'],
    acceptance: 56.8, premium: false,
    description: `Given a string of digits 2-9, return all possible letter combinations.<br><br>Mapping: 2=abc, 3=def, 4=ghi, 5=jkl, 6=mno, 7=pqrs, 8=tuv, 9=wxyz.<br>Print each combination on a new line in lexicographic order.`,
    examples: [
      { input: '23', output: 'ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf' },
      { input: '2',  output: 'a\nb\nc'                             },
    ],
    constraints: ['0 ≤ digits.length ≤ 4', "digits[i] is in ['2','9']"],
    testCases: [
      { input: '23', expected: 'ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf', hidden: false },
      { input: '2',  expected: 'a\nb\nc',                            hidden: false },
      { input: '',   expected: '',                                   hidden: true  },
      { input: '9',  expected: 'w\nx\ny\nz',                        hidden: true  },
    ],
    hints: [
      'Map each digit to its corresponding letters.',
      'Use backtracking to build combinations character by character.',
      'Sort results for lexicographic output.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<string> letterCombinations(string digits) {

    }
};`,
      python: `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        `,
      java: `class Solution {
    public List<String> letterCombinations(String digits) {

    }
}`,
      javascript: `/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {

};`,
      c: `char** letterCombinations(char* digits, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string digits; getline(cin, digits);
    Solution sol;
    vector<string> res = sol.letterCombinations(digits);
    sort(res.begin(), res.end());
    for (auto& s : res) cout << s << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

digits = sys.stdin.read().strip()
res = Solution().letterCombinations(digits)
for s in sorted(res): print(s)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String digits = new Scanner(System.in).nextLine().trim();
        List<String> res = new Solution().letterCombinations(digits);
        Collections.sort(res);
        for (String s : res) System.out.println(s);
    }
}`,
      javascript: `const digits = require('fs').readFileSync('/dev/stdin','utf8').trim();

__USER_CODE__

const res = letterCombinations(digits);
if (res && res.length) res.sort().forEach(s => console.log(s));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

__USER_CODE__

int cmpStr(const void *a, const void *b) { return strcmp(*(char**)a, *(char**)b); }

int main() {
    char digits[5]; if (scanf("%s", digits) != 1) { printf("\\n"); return 0; }
    int retSize;
    char **res = letterCombinations(digits, &retSize);
    if (retSize == 0) { printf("\\n"); return 0; }
    qsort(res, retSize, sizeof(char*), cmpStr);
    for (int i = 0; i < retSize; i++) printf("%s\\n", res[i]);
    return 0;
}`,
    },
    aiContext: 'Letter Combinations Phone Number — backtracking O(4^n)',
  },

  // ── 48. Contains Duplicate ───────────────────────────────────────────────────
  {
    number: 48, title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting'], companies: ['Amazon', 'Google', 'Apple'],
    acceptance: 61.4, premium: false,
    description: `Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong>, and <code>false</code> if every element is distinct.`,
    examples: [
      { input: 'nums = [1,2,3,1]',             output: 'true',  explanation: '1 appears twice' },
      { input: 'nums = [1,2,3,4]',             output: 'false', explanation: 'All distinct'     },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true'                                   },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: '1 2 3 1',             expected: 'true',  hidden: false },
      { input: '1 2 3 4',             expected: 'false', hidden: false },
      { input: '1 1 1 3 3 4 3 2 4 2', expected: 'true',  hidden: false },
      { input: '1',                   expected: 'false', hidden: true  },
      { input: '-1 -1',               expected: 'true',  hidden: true  },
    ],
    hints: [
      'Use a hash set to track numbers seen so far.',
      'If a number is already in the set, return true.',
      'Alternatively, sort the array and check adjacent elements.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        `,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {

};`,
      c: `bool containsDuplicate(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << (sol.containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(str(Solution().containsDuplicate(nums)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().containsDuplicate(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(String(containsDuplicate(nums)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%s\\n", containsDuplicate(nums, n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Contains Duplicate — hash set O(n)',
  },

  // ── 49. LRU Cache ────────────────────────────────────────────────────────────
  {
    number: 49, title: 'LRU Cache', slug: 'lru-cache', difficulty: 'Hard',
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'], acceptance: 41.5, premium: false,
    description: `Design a data structure that follows the Least Recently Used (LRU) cache constraint.<br><br>Implement <code>LRUCache(capacity)</code>, <code>get(key)</code> (return -1 if not found), and <code>put(key, value)</code> (evict LRU if at capacity). Both must run in <code>O(1)</code>.<br><br>Input: first line is capacity, then operations (<code>get k</code> or <code>put k v</code>). Print result of each <code>get</code>.`,
    examples: [
      { input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', output: '1\n-1\n-1\n3\n4' },
    ],
    constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', '0 ≤ value ≤ 10⁵'],
    testCases: [
      { input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', expected: '1\n-1\n-1\n3\n4', hidden: false },
      { input: '1\nput 2 1\nget 2\nput 3 2\nget 2\nget 3',                                  expected: '1\n-1\n2',          hidden: true  },
      { input: '2\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 3',                     expected: '10\n-1\n30',        hidden: true  },
    ],
    hints: [
      'Use a HashMap + Doubly Linked List.',
      'HashMap gives O(1) access; DLL gives O(1) move-to-front.',
      'Keep dummy head and tail to simplify edge cases.',
    ],
    starter: {
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {

    }

    int get(int key) {

    }

    void put(int key, int value) {

    }
};`,
      python: `class LRUCache:

    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,
      java: `class LRUCache {

    public LRUCache(int capacity) {

    }

    public int get(int key) {

    }

    public void put(int key, int value) {

    }
}`,
      javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {

};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {

};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {

};`,
      c: `typedef struct LRUCache LRUCache;

LRUCache* lRUCacheCreate(int capacity) {

}

int lRUCacheGet(LRUCache* obj, int key) {

}

void lRUCachePut(LRUCache* obj, int key, int value) {

}

void lRUCacheFree(LRUCache* obj) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int cap; cin >> cap; cin.ignore();
    LRUCache cache(cap);
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); string op; ss >> op;
        if (op == "get") { int k; ss >> k; cout << cache.get(k) << "\\n"; }
        else { int k, v; ss >> k >> v; cache.put(k, v); }
    }
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
capacity = int(lines[0])
cache = LRUCache(capacity)
for line in lines[1:]:
    parts = line.split()
    if parts[0] == 'get': print(cache.get(int(parts[1])))
    else: cache.put(int(parts[1]), int(parts[2]))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cap = sc.nextInt(); sc.nextLine();
        LRUCache cache = new LRUCache(cap);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim(); if (line.isEmpty()) continue;
            String[] parts = line.split(" ");
            if (parts[0].equals("get")) System.out.println(cache.get(Integer.parseInt(parts[1])));
            else cache.put(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const cap = parseInt(lines[0]);

__USER_CODE__

const cache = new LRUCache(cap);
for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].trim().split(' ');
    if (parts[0] === 'get') console.log(cache.get(parseInt(parts[1])));
    else cache.put(parseInt(parts[1]), parseInt(parts[2]));
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int main() {
    int cap; scanf("%d", &cap);
    LRUCache* cache = lRUCacheCreate(cap);
    char op[4]; int k, v;
    while (scanf("%s", op) == 1) {
        if (op[0] == 'g') { scanf("%d", &k); printf("%d\\n", lRUCacheGet(cache, k)); }
        else { scanf("%d %d", &k, &v); lRUCachePut(cache, k, v); }
    }
    lRUCacheFree(cache); return 0;
}`,
    },
    aiContext: 'LRU Cache — HashMap + Doubly Linked List O(1) get/put',
  },

  // ── 50. Median of Two Sorted Arrays ──────────────────────────────────────────
  {
    number: 50, title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon', 'Goldman Sachs'], acceptance: 36.2, premium: false,
    description: `Given two sorted arrays <code>nums1</code> and <code>nums2</code>, return the median of the two sorted arrays. The overall runtime complexity must be <code>O(log(m+n))</code>.<br><br>First line: nums1 (space-separated). Second line: nums2.`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]',    output: '2.00000' },
      { input: 'nums1 = [1,2], nums2 = [3,4]',  output: '2.50000' },
    ],
    constraints: ['0 ≤ m, n ≤ 1000', '1 ≤ m + n ≤ 2000', '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶'],
    testCases: [
      { input: '1 3\n2',   expected: '2.00000', hidden: false },
      { input: '1 2\n3 4', expected: '2.50000', hidden: false },
      { input: '0 0\n0 0', expected: '0.00000', hidden: true  },
      { input: '2\n1 3',   expected: '2.00000', hidden: true  },
      { input: '\n1',      expected: '1.00000', hidden: true  },
    ],
    hints: [
      'Binary search on the smaller array.',
      'Partition both arrays so left half has (m+n+1)/2 elements.',
      'Ensure max(leftA, leftB) ≤ min(rightA, rightB).',
    ],
    starter: {
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {

    }
};`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        `,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {

};`,
      c: `double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    istringstream s1(l1), s2(l2);
    vector<int> nums1, nums2; int x;
    while (s1 >> x) nums1.push_back(x);
    while (s2 >> x) nums2.push_back(x);
    Solution sol;
    printf("%.5f\\n", sol.findMedianSortedArrays(nums1, nums2));
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
nums1 = list(map(int, data[0].split())) if data[0].strip() else []
nums2 = list(map(int, data[1].split())) if len(data) > 1 and data[1].strip() else []
print(f"{Solution().findMedianSortedArrays(nums1, nums2):.5f}")`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String l1 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String l2 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        int[] nums1 = l1.isEmpty() ? new int[0] : Arrays.stream(l1.split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] nums2 = l2.isEmpty() ? new int[0] : Arrays.stream(l2.split(" ")).mapToInt(Integer::parseInt).toArray();
        System.out.printf("%.5f%n", new Solution().findMedianSortedArrays(nums1, nums2));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums1 = lines[0] && lines[0].trim() ? lines[0].trim().split(' ').map(Number) : [];
const nums2 = lines[1] && lines[1].trim() ? lines[1].trim().split(' ').map(Number) : [];

__USER_CODE__

console.log(findMedianSortedArrays(nums1, nums2).toFixed(5));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int a[1001], b[1001], na = 0, nb = 0;
    char buf[10000];
    fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } a[na++] = strtol(p, &p, 10); }
    fgets(buf, sizeof(buf), stdin); p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } b[nb++] = strtol(p, &p, 10); }
    printf("%.5f\\n", findMedianSortedArrays(a, na, b, nb));
    return 0;
}`,
    },
    aiContext: 'Median of Two Sorted Arrays — binary search O(log(min(m,n)))',
  },

  // ── PROBLEMS 51–60 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 51. Two Sum II - Input Array Is Sorted ───────────────────────────────────
  {
    number: 51, title: 'Two Sum II - Input Array Is Sorted', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Binary Search'], companies: ['Amazon', 'Apple', 'Bloomberg'],
    acceptance: 59.4, premium: false,
    description: `Given a 1-indexed sorted array of integers <code>numbers</code> and a target integer, return the indices of the two numbers that add up to target as <code>[index1, index2]</code> where <code>1 ≤ index1 &lt; index2</code>.<br><br>First line: space-separated numbers. Second line: target.`,
    examples: [
      { input: '2 7 11 15\n9',  output: '[1, 2]', explanation: 'numbers[1] + numbers[2] = 2 + 7 = 9' },
      { input: '2 3 4\n6',      output: '[1, 3]' },
      { input: '-1 0\n-1',      output: '[1, 2]' },
    ],
    constraints: ['2 ≤ n ≤ 3×10⁴', '-1000 ≤ numbers[i] ≤ 1000', 'Exactly one solution exists'],
    testCases: [
      { input: '2 7 11 15\n9', expected: '[1, 2]', hidden: false },
      { input: '2 3 4\n6',     expected: '[1, 3]', hidden: false },
      { input: '-1 0\n-1',     expected: '[1, 2]', hidden: false },
      { input: '1 2 3 4 5\n9', expected: '[4, 5]', hidden: true  },
      { input: '5 25 75\n100', expected: '[2, 3]', hidden: true  },
    ],
    hints: [
      'Use two pointers: one at the start, one at the end.',
      'If the sum is too small, move the left pointer right.',
      'If the sum is too large, move the right pointer left.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {

    }
};`,
      python: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {

    }
}`,
      javascript: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {

};`,
      c: `int* twoSum(int* numbers, int numbersSize, int target, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int target; cin >> target;
    Solution sol;
    vector<int> res = sol.twoSum(nums, target);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().split('\\n')
numbers = list(map(int, data[0].split()))
target = int(data[1].strip())
res = Solution().twoSum(numbers, target)
print(f"[{res[0]}, {res[1]}]")`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] numbers = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int target = sc.nextInt();
        int[] res = new Solution().twoSum(numbers, target);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const numbers = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

__USER_CODE__

const res = twoSum(numbers, target);
console.log('[' + res[0] + ', ' + res[1] + ']');`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[30001], n = 0, target;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &target);
    int retSize;
    int *res = twoSum(nums, n, target, &retSize);
    printf("[%d, %d]\\n", res[0], res[1]);
    free(res); return 0;
}`,
    },
    aiContext: 'Two Sum II - two pointers on sorted array O(n)',
  },

  // ── 52. Maximum Product Subarray ─────────────────────────────────────────────
  {
    number: 52, title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'LinkedIn', 'Apple'],
    acceptance: 34.8, premium: false,
    description: `Given an integer array <code>nums</code>, find a subarray that has the largest product and return the product.`,
    examples: [
      { input: 'nums = [2,3,-2,4]',    output: '6',  explanation: '[2,3] has the largest product 6' },
      { input: 'nums = [-2,0,-1]',     output: '0',  explanation: 'Result cannot be 2 because [-2,-1] is not a subarray' },
    ],
    constraints: ['1 ≤ nums.length ≤ 2×10⁴', '-10 ≤ nums[i] ≤ 10', 'Product guaranteed to fit in 32-bit integer'],
    testCases: [
      { input: '2 3 -2 4',  expected: '6',  hidden: false },
      { input: '-2 0 -1',   expected: '0',  hidden: false },
      { input: '-2',        expected: '-2', hidden: true  },
      { input: '0 2',       expected: '2',  hidden: true  },
      { input: '3 -1 4',    expected: '4',  hidden: true  },
    ],
    hints: [
      'Track both the current maximum and minimum product.',
      'A negative number can turn the minimum into the maximum.',
      'At each step: curMax = max(nums[i], curMax*nums[i], curMin*nums[i]).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxProduct(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {

};`,
      c: `int maxProduct(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.maxProduct(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().maxProduct(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maxProduct(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxProduct(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[20001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", maxProduct(nums, n));
    return 0;
}`,
    },
    aiContext: 'Maximum Product Subarray — track min and max O(n)',
  },

  // ── 53. Min Stack ────────────────────────────────────────────────────────────
  {
    number: 53, title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium',
    tags: ['Stack', 'Design'], companies: ['Amazon', 'Bloomberg', 'Google'],
    acceptance: 53.2, premium: false,
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element, all in <code>O(1)</code>.<br><br>Input: operations one per line (<code>push v</code>, <code>pop</code>, <code>top</code>, <code>getMin</code>). Print result of <code>top</code> and <code>getMin</code>.`,
    examples: [
      { input: 'push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin', output: '-3\n0\n-2' },
    ],
    constraints: ['-2³¹ ≤ val ≤ 2³¹-1', 'pop/top/getMin called on non-empty stack'],
    testCases: [
      { input: 'push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin', expected: '-3\n0\n-2', hidden: false },
      { input: 'push 1\npush 2\ntop\ngetMin\npop\ngetMin',           expected: '2\n1\n1',   hidden: true  },
      { input: 'push 5\npush 3\npush 7\ngetMin\npop\ngetMin',        expected: '3\n3',      hidden: true  },
    ],
    hints: [
      'Use a second stack to track minimums.',
      'Push to min stack only when value ≤ current min.',
      'Pop from min stack when popping the current minimum.',
    ],
    starter: {
      cpp: `class MinStack {
public:
    MinStack() {

    }

    void push(int val) {

    }

    void pop() {

    }

    int top() {

    }

    int getMin() {

    }
};`,
      python: `class MinStack:

    def __init__(self):


    def push(self, val: int) -> None:


    def pop(self) -> None:


    def top(self) -> int:


    def getMin(self) -> int:
        `,
      java: `class MinStack {

    public MinStack() {

    }

    public void push(int val) {

    }

    public void pop() {

    }

    public int top() {

    }

    public int getMin() {

    }
}`,
      javascript: `var MinStack = function() {

};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {

};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {

};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {

};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {

};`,
      c: `typedef struct MinStack MinStack;

MinStack* minStackCreate() {

}

void minStackPush(MinStack* obj, int val) {

}

void minStackPop(MinStack* obj) {

}

int minStackTop(MinStack* obj) {

}

int minStackGetMin(MinStack* obj) {

}

void minStackFree(MinStack* obj) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    MinStack st;
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        if (line.substr(0,4) == "push") { int v = stoi(line.substr(5)); st.push(v); }
        else if (line == "pop")    st.pop();
        else if (line == "top")    cout << st.top()    << "\\n";
        else if (line == "getMin") cout << st.getMin() << "\\n";
    }
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
st = MinStack()
for line in lines:
    parts = line.split()
    if parts[0] == 'push': st.push(int(parts[1]))
    elif parts[0] == 'pop': st.pop()
    elif parts[0] == 'top': print(st.top())
    elif parts[0] == 'getMin': print(st.getMin())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MinStack st = new MinStack();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim(); if (line.isEmpty()) continue;
            String[] parts = line.split(" ");
            if (parts[0].equals("push")) st.push(Integer.parseInt(parts[1]));
            else if (parts[0].equals("pop"))    st.pop();
            else if (parts[0].equals("top"))    System.out.println(st.top());
            else if (parts[0].equals("getMin")) System.out.println(st.getMin());
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');

__USER_CODE__

const st = new MinStack();
for (const line of lines) {
    const parts = line.trim().split(' ');
    if (parts[0] === 'push') st.push(parseInt(parts[1]));
    else if (parts[0] === 'pop')    st.pop();
    else if (parts[0] === 'top')    console.log(st.top());
    else if (parts[0] === 'getMin') console.log(st.getMin());
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int main() {
    MinStack* st = minStackCreate();
    char line[50];
    while (fgets(line, sizeof(line), stdin)) {
        if (line[0] == '\\n') continue;
        if (strncmp(line, "push", 4) == 0) { int v = atoi(line+5); minStackPush(st, v); }
        else if (strncmp(line, "pop", 3) == 0)    minStackPop(st);
        else if (strncmp(line, "top", 3) == 0)    printf("%d\\n", minStackTop(st));
        else if (strncmp(line, "getMin", 6) == 0) printf("%d\\n", minStackGetMin(st));
    }
    minStackFree(st); return 0;
}`,
    },
    aiContext: 'Min Stack — auxiliary min stack O(1) all operations',
  },

  // ── 54. Implement Queue using Stacks ─────────────────────────────────────────
  {
    number: 54, title: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks', difficulty: 'Easy',
    tags: ['Stack', 'Design', 'Queue'], companies: ['Bloomberg', 'Microsoft', 'Amazon'],
    acceptance: 64.3, premium: false,
    description: `Implement a first-in-first-out queue using only two stacks.<br><br>Input: operations one per line (<code>push v</code>, <code>pop</code>, <code>peek</code>, <code>empty</code>). Print result of <code>pop</code>, <code>peek</code>, <code>empty</code>.`,
    examples: [
      { input: 'push 1\npush 2\npeek\npop\nempty', output: '1\n1\nfalse' },
    ],
    constraints: ['1 ≤ x ≤ 9', 'At most 100 calls', 'pop/peek called on non-empty queue'],
    testCases: [
      { input: 'push 1\npush 2\npeek\npop\nempty', expected: '1\n1\nfalse', hidden: false },
      { input: 'push 1\nempty\npop\nempty',         expected: 'false\n1\ntrue', hidden: true },
      { input: 'push 3\npush 5\npop\npeek',         expected: '3\n5',        hidden: true  },
    ],
    hints: [
      'Use two stacks: inbox and outbox.',
      'On push: push to inbox.',
      'On pop/peek: if outbox is empty, move all from inbox to outbox.',
    ],
    starter: {
      cpp: `class MyQueue {
public:
    MyQueue() {

    }

    void push(int x) {

    }

    int pop() {

    }

    int peek() {

    }

    bool empty() {

    }
};`,
      python: `class MyQueue:

    def __init__(self):


    def push(self, x: int) -> None:


    def pop(self) -> int:


    def peek(self) -> int:


    def empty(self) -> bool:
        `,
      java: `class MyQueue {

    public MyQueue() {

    }

    public void push(int x) {

    }

    public int pop() {

    }

    public int peek() {

    }

    public boolean empty() {

    }
}`,
      javascript: `var MyQueue = function() {

};

MyQueue.prototype.push = function(x) {

};

MyQueue.prototype.pop = function() {

};

MyQueue.prototype.peek = function() {

};

MyQueue.prototype.empty = function() {

};`,
      c: `typedef struct MyQueue MyQueue;

MyQueue* myQueueCreate() {

}

void myQueuePush(MyQueue* obj, int x) {

}

int myQueuePop(MyQueue* obj) {

}

int myQueuePeek(MyQueue* obj) {

}

bool myQueueEmpty(MyQueue* obj) {

}

void myQueueFree(MyQueue* obj) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    MyQueue q;
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        if (line.substr(0,4) == "push") { int v = stoi(line.substr(5)); q.push(v); }
        else if (line == "pop")   cout << q.pop()   << "\\n";
        else if (line == "peek")  cout << q.peek()  << "\\n";
        else if (line == "empty") cout << (q.empty() ? "true" : "false") << "\\n";
    }
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
q = MyQueue()
for line in lines:
    parts = line.split()
    if parts[0] == 'push': q.push(int(parts[1]))
    elif parts[0] == 'pop': print(q.pop())
    elif parts[0] == 'peek': print(q.peek())
    elif parts[0] == 'empty': print(str(q.empty()).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MyQueue q = new MyQueue();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim(); if (line.isEmpty()) continue;
            String[] parts = line.split(" ");
            if (parts[0].equals("push")) q.push(Integer.parseInt(parts[1]));
            else if (parts[0].equals("pop"))   System.out.println(q.pop());
            else if (parts[0].equals("peek"))  System.out.println(q.peek());
            else if (parts[0].equals("empty")) System.out.println(q.empty());
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');

__USER_CODE__

const q = new MyQueue();
for (const line of lines) {
    const parts = line.trim().split(' ');
    if (parts[0] === 'push') q.push(parseInt(parts[1]));
    else if (parts[0] === 'pop')   console.log(q.pop());
    else if (parts[0] === 'peek')  console.log(q.peek());
    else if (parts[0] === 'empty') console.log(String(q.empty()));
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    MyQueue* q = myQueueCreate();
    char line[50];
    while (fgets(line, sizeof(line), stdin)) {
        if (line[0] == '\\n') continue;
        if (strncmp(line, "push", 4) == 0) { int v = atoi(line+5); myQueuePush(q, v); }
        else if (strncmp(line, "pop", 3) == 0)   printf("%d\\n", myQueuePop(q));
        else if (strncmp(line, "peek", 4) == 0)  printf("%d\\n", myQueuePeek(q));
        else if (strncmp(line, "empty", 5) == 0) printf("%s\\n", myQueueEmpty(q) ? "true" : "false");
    }
    myQueueFree(q); return 0;
}`,
    },
    aiContext: 'Implement Queue using Stacks — two stacks amortized O(1)',
  },

  // ── 55. Path Sum ─────────────────────────────────────────────────────────────
  {
    number: 55, title: 'Path Sum', slug: 'path-sum', difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'], companies: ['Amazon', 'Microsoft', 'Adobe'],
    acceptance: 45.9, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing nodes) and a target sum, return <code>true</code> if the tree has a root-to-leaf path such that adding up all the values along the path equals <code>targetSum</code>.<br><br>First line: targetSum. Second line: level-order tree.`,
    examples: [
      { input: '22\n5 4 8 11 null 13 4 7 2 null null null 1', output: 'true', explanation: '5→4→11→2 = 22' },
      { input: '5\n1 2 3', output: 'false' },
      { input: '0\nnull',  output: 'false' },
    ],
    constraints: ['0 ≤ number of nodes ≤ 5000', '-1000 ≤ Node.val ≤ 1000', '-1000 ≤ targetSum ≤ 1000'],
    testCases: [
      { input: '22\n5 4 8 11 null 13 4 7 2 null null null 1', expected: 'true',  hidden: false },
      { input: '5\n1 2 3',                                    expected: 'false', hidden: false },
      { input: '0\nnull',                                     expected: 'false', hidden: true  },
      { input: '1\n1',                                        expected: 'true',  hidden: true  },
    ],
    hints: [
      'Use DFS: subtract node value from target at each step.',
      'At a leaf node, check if remaining target equals the leaf value.',
      'Return true if any path reaches zero at a leaf.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function(root, targetSum) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
bool hasPathSum(struct TreeNode* root, int targetSum) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left = build(v, 2*i+1); n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    int target; cin >> target;
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << (sol.hasPathSum(root, target) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
target = int(lines[0])
vals = lines[1].split() if len(lines) > 1 else []
print(str(Solution().hasPathSum(build(vals), target)).lower())`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left = build(v, 2*i+1); n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt(); sc.nextLine();
        String[] vals = sc.hasNextLine() ? sc.nextLine().trim().split(" ") : new String[]{"null"};
        TreeNode root = vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().hasPathSum(root, target));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const target = parseInt(lines[0]);
const vals = lines[1] ? lines[1].trim().split(/\\s+/) : [];

function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function build(vals, i = 0) {
    if (i >= vals.length || vals[i] === 'null') return null;
    const n = new TreeNode(+vals[i]);
    n.left = build(vals, 2*i+1); n.right = build(vals, 2*i+2);
    return n;
}

__USER_CODE__

const root = !vals.length || vals[0] === 'null' ? null : build(vals);
console.log(String(hasPathSum(root, target)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n = malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i >= n || strcmp(toks[i], "null") == 0) return NULL;
    struct TreeNode* node = newNode(atoi(toks[i]));
    node->left = build(toks, n, 2*i+1); node->right = build(toks, n, 2*i+2);
    return node;
}

__USER_CODE__

int main() {
    int target; scanf("%d", &target);
    char toks[10000][20]; int tc = 0;
    while (scanf("%s", toks[tc]) == 1) tc++;
    struct TreeNode* root = (tc == 0 || strcmp(toks[0], "null") == 0) ? NULL : build(toks, tc, 0);
    printf("%s\\n", hasPathSum(root, target) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Path Sum — DFS root-to-leaf O(n)',
  },

  // ── 56. Merge Sorted Array ───────────────────────────────────────────────────
  {
    number: 56, title: 'Merge Sorted Array', slug: 'merge-sorted-array', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Facebook', 'Amazon', 'Microsoft'],
    acceptance: 47.1, premium: false,
    description: `Merge two sorted arrays <code>nums1</code> and <code>nums2</code> into <code>nums1</code> in-place. <code>nums1</code> has length <code>m + n</code> where the last <code>n</code> elements are 0 (placeholders).<br><br>Line 1: nums1 (m+n values). Line 2: m. Line 3: nums2 (n values). Line 4: n.`,
    examples: [
      { input: '1 2 3 0 0 0\n3\n2 5 6\n3', output: '1 2 2 3 5 6' },
      { input: '1\n1\n\n0',                 output: '1'            },
      { input: '0\n0\n1\n1',               output: '1'            },
    ],
    constraints: ['0 ≤ m, n ≤ 200', '1 ≤ m+n ≤ 200', '-10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹'],
    testCases: [
      { input: '1 2 3 0 0 0\n3\n2 5 6\n3', expected: '1 2 2 3 5 6', hidden: false },
      { input: '1\n1\n\n0',                 expected: '1',            hidden: false },
      { input: '0\n0\n1\n1',               expected: '1',            hidden: true  },
      { input: '4 5 6 0 0 0\n3\n1 2 3\n3', expected: '1 2 3 4 5 6', hidden: true  },
    ],
    hints: [
      'Merge from the end to avoid overwriting elements.',
      'Use three pointers: i=m-1, j=n-1, k=m+n-1.',
      'Place the larger of nums1[i] and nums2[j] at nums1[k].',
    ],
    starter: {
      cpp: `class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {

    }
};`,
      python: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        `,
      java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void}
 */
var merge = function(nums1, m, nums2, n) {

};`,
      c: `void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums1; int x;
    while (ss >> x) nums1.push_back(x);
    int m; cin >> m; cin.ignore();
    string line2; getline(cin, line2);
    istringstream ss2(line2); vector<int> nums2;
    while (ss2 >> x) nums2.push_back(x);
    int n; cin >> n;
    Solution sol; sol.merge(nums1, m, nums2, n);
    for (int i = 0; i < m+n; i++) cout << (i?" ":"") << nums1[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
nums1 = list(map(int, lines[0].split()))
m = int(lines[1])
nums2 = list(map(int, lines[2].split())) if lines[2].strip() else []
n = int(lines[3])
Solution().merge(nums1, m, nums2, n)
print(*nums1[:m+n])`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums1 = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int m = sc.nextInt(); sc.nextLine();
        String l2 = sc.nextLine().trim();
        int[] nums2 = l2.isEmpty() ? new int[0] : Arrays.stream(l2.split(" ")).mapToInt(Integer::parseInt).toArray();
        int n = sc.nextInt();
        new Solution().merge(nums1, m, nums2, n);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m+n; i++) sb.append(i>0?" ":"").append(nums1[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const nums1 = lines[0].trim().split(' ').map(Number);
const m = parseInt(lines[1]);
const nums2 = lines[2] && lines[2].trim() ? lines[2].trim().split(' ').map(Number) : [];
const n = parseInt(lines[3]);

__USER_CODE__

merge(nums1, m, nums2, n);
console.log(nums1.slice(0, m+n).join(' '));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    int nums1[401], nums2[201], m, n, idx = 0;
    char buf[500]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p==' '){p++;continue;} nums1[idx++]=strtol(p,&p,10); }
    scanf("%d", &m); getchar();
    fgets(buf, sizeof(buf), stdin); p = buf; int idx2 = 0;
    while (*p && *p != '\\n') { if (*p==' '){p++;continue;} nums2[idx2++]=strtol(p,&p,10); }
    scanf("%d", &n);
    merge(nums1, idx, m, nums2, idx2, n);
    for (int i = 0; i < m+n; i++) printf("%s%d", i?" ":"", nums1[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Merge Sorted Array — merge from end O(m+n)',
  },

  // ── 57. Remove Duplicates from Sorted Array ───────────────────────────────────
  {
    number: 57, title: 'Remove Duplicates from Sorted Array', slug: 'remove-duplicates-from-sorted-array', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'], companies: ['Facebook', 'Microsoft', 'Bloomberg'],
    acceptance: 53.7, premium: false,
    description: `Given a sorted array <code>nums</code>, remove duplicates in-place such that each element appears only once. Return the number of unique elements <code>k</code>.<br><br>Print k followed by the first k elements of nums.`,
    examples: [
      { input: '1 1 2',         output: '2\n1 2'         },
      { input: '0 0 1 1 1 2 2 3 3 4', output: '5\n0 1 2 3 4' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', '-100 ≤ nums[i] ≤ 100', 'nums is sorted in non-decreasing order'],
    testCases: [
      { input: '1 1 2',               expected: '2\n1 2',       hidden: false },
      { input: '0 0 1 1 1 2 2 3 3 4', expected: '5\n0 1 2 3 4', hidden: false },
      { input: '1',                   expected: '1\n1',          hidden: true  },
      { input: '1 2 3',               expected: '3\n1 2 3',      hidden: true  },
    ],
    hints: [
      'Use a slow pointer k to track the position of unique elements.',
      'Use a fast pointer i to scan through the array.',
      'When nums[i] != nums[k-1], copy nums[i] to nums[k] and increment k.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int removeDuplicates(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int removeDuplicates(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {

};`,
      c: `int removeDuplicates(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    int k = sol.removeDuplicates(nums);
    cout << k << "\\n";
    for (int i = 0; i < k; i++) cout << (i?" ":"") << nums[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
k = Solution().removeDuplicates(nums)
print(k)
print(*nums[:k])`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int k = new Solution().removeDuplicates(nums);
        System.out.println(k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i>0?" ":"").append(nums[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

const k = removeDuplicates(nums);
console.log(k);
console.log(nums.slice(0, k).join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[30001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int k = removeDuplicates(nums, n);
    printf("%d\\n", k);
    for (int i = 0; i < k; i++) printf("%s%d", i?" ":"", nums[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Remove Duplicates from Sorted Array — two pointers O(n)',
  },

  // ── 58. Move Zeroes ──────────────────────────────────────────────────────────
  {
    number: 58, title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'], companies: ['Facebook', 'Bloomberg', 'Lyft'],
    acceptance: 61.2, premium: false,
    description: `Given an integer array <code>nums</code>, move all <code>0</code>s to the end while maintaining the relative order of the non-zero elements. Do this in-place.`,
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '1 3 12 0 0' },
      { input: 'nums = [0]',          output: '0'           },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-2³¹ ≤ nums[i] ≤ 2³¹-1'],
    testCases: [
      { input: '0 1 0 3 12', expected: '1 3 12 0 0', hidden: false },
      { input: '0',          expected: '0',           hidden: false },
      { input: '1',          expected: '1',           hidden: true  },
      { input: '0 0 1',      expected: '1 0 0',       hidden: true  },
      { input: '1 2 0 0 3',  expected: '1 2 3 0 0',  hidden: true  },
    ],
    hints: [
      'Use a pointer to track the position for the next non-zero element.',
      'Iterate: when you find a non-zero, swap it with the pointer position.',
      'All elements beyond the pointer position are zeros.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        `,
      java: `class Solution {
    public void moveZeroes(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {

};`,
      c: `void moveZeroes(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol; sol.moveZeroes(nums);
    for (int i = 0; i < (int)nums.size(); i++) cout << (i?" ":"") << nums[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
Solution().moveZeroes(nums)
print(*nums)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        new Solution().moveZeroes(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < nums.length; i++) sb.append(i>0?" ":"").append(nums[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

moveZeroes(nums);
console.log(nums.join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    moveZeroes(nums, n);
    for (int i = 0; i < n; i++) printf("%s%d", i?" ":"", nums[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Move Zeroes — two pointer in-place O(n)',
  },

  // ── 59. Reverse String ───────────────────────────────────────────────────────
  {
    number: 59, title: 'Reverse String', slug: 'reverse-string', difficulty: 'Easy',
    tags: ['Two Pointers', 'String'], companies: ['Facebook', 'Google', 'Amazon'],
    acceptance: 75.6, premium: false,
    description: `Write a function that reverses a string. The input is given as an array of characters <code>s</code>. You must do this in-place with O(1) extra memory.<br><br>Input: space-separated characters. Output: reversed characters space-separated.`,
    examples: [
      { input: 'h e l l o',   output: 'o l l e h' },
      { input: 'H a n n a h', output: 'h a n n a H' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ASCII character'],
    testCases: [
      { input: 'h e l l o',   expected: 'o l l e h',   hidden: false },
      { input: 'H a n n a h', expected: 'h a n n a H', hidden: false },
      { input: 'A',           expected: 'A',            hidden: true  },
      { input: 'a b',         expected: 'b a',          hidden: true  },
    ],
    hints: [
      'Use two pointers: left and right.',
      'Swap characters at left and right, then move them toward each other.',
      'Stop when left >= right.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {

    }
};`,
      python: `class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        `,
      java: `class Solution {
    public void reverseString(char[] s) {

    }
}`,
      javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {

};`,
      c: `void reverseString(char* s, int sSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<char> s; string tok;
    while (cin >> tok) s.push_back(tok[0]);
    Solution sol; sol.reverseString(s);
    for (int i = 0; i < (int)s.size(); i++) cout << (i?" ":"") << s[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

s = sys.stdin.read().split()
Solution().reverseString(s)
print(*s)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Character> list = new ArrayList<>();
        while (sc.hasNext()) list.add(sc.next().charAt(0));
        char[] s = new char[list.size()];
        for (int i = 0; i < list.size(); i++) s[i] = list.get(i);
        new Solution().reverseString(s);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length; i++) sb.append(i>0?" ":"").append(s[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);

__USER_CODE__

reverseString(s);
console.log(s.join(' '));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char toks[100001][3]; int n = 0;
    while (scanf("%s", toks[n]) == 1) n++;
    char s[100001]; for (int i = 0; i < n; i++) s[i] = toks[i][0];
    reverseString(s, n);
    for (int i = 0; i < n; i++) printf("%s%c", i?" ":"", s[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Reverse String — two pointer swap O(n)',
  },

  // ── 60. First Bad Version ────────────────────────────────────────────────────
  {
    number: 60, title: 'First Bad Version', slug: 'first-bad-version', difficulty: 'Easy',
    tags: ['Binary Search', 'Interactive'], companies: ['Facebook', 'Google', 'Amazon'],
    acceptance: 43.5, premium: false,
    description: `You are a product manager trying to find the first bad version. You have <code>n</code> versions and an API <code>isBadVersion(version)</code> that returns whether a version is bad. Find the first bad version with minimum API calls.<br><br>Input: first line is n, second line is bad (the first bad version).`,
    examples: [
      { input: '5\n4', output: '4', explanation: 'versions 4 and 5 are bad' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['1 ≤ bad ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '5\n4',          expected: '4', hidden: false },
      { input: '1\n1',          expected: '1', hidden: false },
      { input: '10\n1',         expected: '1', hidden: true  },
      { input: '100\n50',       expected: '50', hidden: true },
      { input: '2147483647\n2147483647', expected: '2147483647', hidden: true },
    ],
    hints: [
      'Binary search: if isBadVersion(mid) is true, the first bad is ≤ mid.',
      'Otherwise the first bad is > mid.',
      'Watch out for integer overflow when computing mid.',
    ],
    starter: {
      cpp: `// The API isBadVersion is defined for you.
// bool isBadVersion(int version);

class Solution {
public:
    int firstBadVersion(int n) {

    }
};`,
      python: `# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        `,
      java: `/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    public int firstBadVersion(int n) {

    }
}`,
      javascript: `/**
 * Definition for isBadVersion()
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) { ... };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    return function(n) {

    };
};`,
      c: `// The API isBadVersion is defined for you.
// bool isBadVersion(int version);

int firstBadVersion(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int BAD;
bool isBadVersion(int v) { return v >= BAD; }

__USER_CODE__

int main() {
    int n; cin >> n >> BAD;
    Solution sol;
    cout << sol.firstBadVersion(n) << endl;
    return 0;
}`,
      python: `import sys

data = sys.stdin.read().split()
n, BAD = int(data[0]), int(data[1])

def isBadVersion(v): return v >= BAD

__USER_CODE__

print(Solution().firstBadVersion(n))`,
      java: `import java.util.*;

class VersionControl {
    static int BAD;
    boolean isBadVersion(int v) { return v >= BAD; }
}

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); VersionControl.BAD = sc.nextInt();
        System.out.println(new Solution().firstBadVersion(n));
    }
}`,
      javascript: `const data = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);
const n = parseInt(data[0]), BAD = parseInt(data[1]);

const isBadVersion = v => v >= BAD;

__USER_CODE__

console.log(solution(isBadVersion)(n));`,
      c: `#include <stdio.h>
#include <stdbool.h>

int BAD;
bool isBadVersion(int v) { return v >= BAD; }

__USER_CODE__

int main() {
    int n; scanf("%d %d", &n, &BAD);
    printf("%d\\n", firstBadVersion(n));
    return 0;
}`,
    },
    aiContext: 'First Bad Version — binary search O(log n)',
  },

  // ── PROBLEMS 61–70 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 61. Flood Fill ───────────────────────────────────────────────────────────
  {
    number: 61, title: 'Flood Fill', slug: 'flood-fill', difficulty: 'Easy',
    tags: ['Array', 'DFS', 'BFS', 'Matrix'], companies: ['Facebook', 'Amazon', 'Apple'],
    acceptance: 61.3, premium: false,
    description: `An image is represented as an <code>m x n</code> integer grid. Given starting pixel <code>(sr, sc)</code> and a <code>color</code>, perform flood fill. Return the modified image.<br><br>Input: first line is <code>sr sc color</code>, then each row of the grid. Output: modified grid.`,
    examples: [
      { input: '1 1 2\n1 1 1\n1 1 0\n1 0 1', output: '2 2 2\n2 2 0\n2 0 1' },
      { input: '0 0 0\n0 0 0\n0 0 0',         output: '0 0 0\n0 0 0\n0 0 0' },
    ],
    constraints: ['1 ≤ m, n ≤ 50', '0 ≤ image[i][j], color ≤ 65535'],
    testCases: [
      { input: '1 1 2\n1 1 1\n1 1 0\n1 0 1', expected: '2 2 2\n2 2 0\n2 0 1', hidden: false },
      { input: '0 0 0\n0 0 0\n0 0 0',         expected: '0 0 0\n0 0 0\n0 0 0', hidden: false },
      { input: '0 0 2\n0 0 0\n0 0 0',         expected: '2 2 2\n2 2 2\n2 2 2', hidden: true  },
      { input: '0 0 1\n0 0\n0',               expected: '1\n1\n1',             hidden: true  },
    ],
    hints: [
      'DFS from (sr, sc): fill cells matching the original color.',
      'Handle edge case: if original color == new color, return early.',
      'Use 4-directional movement (up, down, left, right).',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {

    }
};`,
      python: `class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        `,
      java: `class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {

    }
}`,
      javascript: `/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @return {number[][]}
 */
var floodFill = function(image, sr, sc, color) {

};`,
      c: `int** floodFill(int** image, int imageSize, int* imageColSize, int sr, int sc, int color, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int sr, sc, color; cin >> sr >> sc >> color; cin.ignore();
    vector<vector<int>> image; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        image.push_back(row);
    }
    Solution sol;
    auto res = sol.floodFill(image, sr, sc, color);
    for (auto& row : res) { for (int i = 0; i < (int)row.size(); i++) cout << (i?" ":"") << row[i]; cout << "\\n"; }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
sr, sc, color = map(int, lines[0].split())
image = [list(map(int, l.split())) for l in lines[1:]]
res = Solution().floodFill(image, sr, sc, color)
for row in res: print(*row)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sr = sc.nextInt(), scc = sc.nextInt(), color = sc.nextInt(); sc.nextLine();
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine().trim(); if (l.isEmpty()) continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        int[][] image = rows.toArray(new int[0][]);
        int[][] res = new Solution().floodFill(image, sr, scc, color);
        for (int[] row : res) { StringBuilder sb = new StringBuilder(); for (int i = 0; i < row.length; i++) sb.append(i>0?" ":"").append(row[i]); System.out.println(sb); }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const [sr, sc, color] = lines[0].split(' ').map(Number);
const image = lines.slice(1).map(l => l.split(' ').map(Number));

__USER_CODE__

const res = floodFill(image, sr, sc, color);
for (const row of res) console.log(row.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int sr, sc, color; scanf("%d %d %d", &sr, &sc, &color);
    int m[51][51], rows = 0, cols = 0; char buf[500];
    fgets(buf, sizeof(buf), stdin); // consume newline
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0]=='\\n') continue; char *p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[rows][j++]=strtol(p,&p,10);} cols=j; rows++;
    }
    int *ptrs[51]; int colSizes[51];
    for(int i=0;i<rows;i++){ptrs[i]=m[i];colSizes[i]=cols;}
    int retSize; int *retColSizes;
    int **res = floodFill((int**)ptrs,rows,colSizes,sr,sc,color,&retSize,&retColSizes);
    for(int i=0;i<retSize;i++){for(int j=0;j<retColSizes[i];j++)printf("%s%d",j?" ":"",res[i][j]);printf("\\n");}
    return 0;
}`,
    },
    aiContext: 'Flood Fill — DFS/BFS grid coloring O(m*n)',
  },

  // ── 62. Squares of a Sorted Array ────────────────────────────────────────────
  {
    number: 62, title: 'Squares of a Sorted Array', slug: 'squares-of-a-sorted-array', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 71.8, premium: false,
    description: `Given an integer array <code>nums</code> sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.`,
    examples: [
      { input: 'nums = [-4,-1,0,3,10]', output: '0 1 9 16 100' },
      { input: 'nums = [-7,-3,2,3,11]', output: '4 9 9 49 121' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁴ ≤ nums[i] ≤ 10⁴', 'nums is sorted in non-decreasing order'],
    testCases: [
      { input: '-4 -1 0 3 10',  expected: '0 1 9 16 100',  hidden: false },
      { input: '-7 -3 2 3 11',  expected: '4 9 9 49 121',  hidden: false },
      { input: '1',             expected: '1',              hidden: true  },
      { input: '-3 -2 -1',      expected: '1 4 9',         hidden: true  },
    ],
    hints: [
      'Use two pointers: left at start, right at end.',
      'The largest square is always at one of the ends.',
      'Fill result array from the back.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] sortedSquares(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {

};`,
      c: `int* sortedSquares(int* nums, int numsSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    vector<int> res = sol.sortedSquares(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << (i?" ":"") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(*Solution().sortedSquares(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int[] res = new Solution().sortedSquares(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i>0?" ":"").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(sortedSquares(nums).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize;
    int *res = sortedSquares(nums, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i?" ":"", res[i]);
    printf("\\n"); free(res); return 0;
}`,
    },
    aiContext: 'Squares of a Sorted Array — two pointers O(n)',
  },

  // ── 63. Running Sum of 1d Array ──────────────────────────────────────────────
  {
    number: 63, title: 'Running Sum of 1d Array', slug: 'running-sum-of-1d-array', difficulty: 'Easy',
    tags: ['Array', 'Prefix Sum'], companies: ['Amazon', 'Google'],
    acceptance: 88.2, premium: false,
    description: `Given an array <code>nums</code>, return the running sum where <code>runningSum[i] = sum(nums[0] ... nums[i])</code>.`,
    examples: [
      { input: 'nums = [1,2,3,4]',       output: '1 3 6 10' },
      { input: 'nums = [1,1,1,1,1]',     output: '1 2 3 4 5' },
      { input: 'nums = [3,1,2,10,1]',    output: '3 4 6 16 17' },
    ],
    constraints: ['1 ≤ nums.length ≤ 1000', '-10⁶ ≤ nums[i] ≤ 10⁶'],
    testCases: [
      { input: '1 2 3 4',    expected: '1 3 6 10',    hidden: false },
      { input: '1 1 1 1 1',  expected: '1 2 3 4 5',   hidden: false },
      { input: '3 1 2 10 1', expected: '3 4 6 16 17', hidden: false },
      { input: '5',          expected: '5',            hidden: true  },
    ],
    hints: [
      'Iterate through the array.',
      'Add each element to a running total.',
      'Store the running total at each index.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> runningSum(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] runningSum(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var runningSum = function(nums) {

};`,
      c: `int* runningSum(int* nums, int numsSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    vector<int> res = sol.runningSum(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << (i?" ":"") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(*Solution().runningSum(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int[] res = new Solution().runningSum(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i>0?" ":"").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(runningSum(nums).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[1001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize;
    int *res = runningSum(nums, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i?" ":"", res[i]);
    printf("\\n"); free(res); return 0;
}`,
    },
    aiContext: 'Running Sum of 1d Array — prefix sum O(n)',
  },

  // ── 64. Pivot Index ──────────────────────────────────────────────────────────
  {
    number: 64, title: 'Pivot Index', slug: 'pivot-index', difficulty: 'Easy',
    tags: ['Array', 'Prefix Sum'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 52.8, premium: false,
    description: `Given an array <code>nums</code>, return the leftmost pivot index where the sum of all elements to the left equals the sum to the right. Return <code>-1</code> if no such index exists.`,
    examples: [
      { input: 'nums = [1,7,3,6,5,6]', output: '3', explanation: 'Left sum = 1+7+3 = 11, Right sum = 5+6 = 11' },
      { input: 'nums = [1,2,3]',        output: '-1' },
      { input: 'nums = [2,1,-1]',       output: '0', explanation: 'Left sum = 0, Right sum = 1+(-1) = 0' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-1000 ≤ nums[i] ≤ 1000'],
    testCases: [
      { input: '1 7 3 6 5 6', expected: '3',  hidden: false },
      { input: '1 2 3',       expected: '-1', hidden: false },
      { input: '2 1 -1',      expected: '0',  hidden: false },
      { input: '0',           expected: '0',  hidden: true  },
      { input: '-1 -1 -1 0 1 1', expected: '0', hidden: true },
    ],
    hints: [
      'Compute total sum first.',
      'Iterate: leftSum = total - leftSum - nums[i].',
      'If leftSum == rightSum, return current index.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int pivotIndex(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def pivotIndex(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int pivotIndex(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {

};`,
      c: `int pivotIndex(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.pivotIndex(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().pivotIndex(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().pivotIndex(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(pivotIndex(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", pivotIndex(nums, n));
    return 0;
}`,
    },
    aiContext: 'Pivot Index — prefix sum O(n)',
  },

  // ── 65. Is Subsequence ───────────────────────────────────────────────────────
  {
    number: 65, title: 'Is Subsequence', slug: 'is-subsequence', difficulty: 'Easy',
    tags: ['Two Pointers', 'String', 'Dynamic Programming'], companies: ['Google', 'Airbnb', 'Amazon'],
    acceptance: 49.4, premium: false,
    description: `Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>s</code> is a subsequence of <code>t</code>.<br><br>First line: s. Second line: t.`,
    examples: [
      { input: 'ace\nabcde', output: 'true',  explanation: 'a, c, e appear in order in "abcde"' },
      { input: 'axc\nahbgdc', output: 'false' },
    ],
    constraints: ['0 ≤ s.length ≤ 100', '0 ≤ t.length ≤ 10⁴', 'Both strings consist of lowercase English letters'],
    testCases: [
      { input: 'ace\nabcde',  expected: 'true',  hidden: false },
      { input: 'axc\nahbgdc', expected: 'false', hidden: false },
      { input: '\nabc',       expected: 'true',  hidden: true  },
      { input: 'b\nabc',      expected: 'true',  hidden: true  },
      { input: 'abc\nab',     expected: 'false', hidden: true  },
    ],
    hints: [
      'Use two pointers: one for s, one for t.',
      'Advance the s pointer only when characters match.',
      'Always advance the t pointer.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isSubsequence(string s, string t) {

    }
};`,
      python: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        `,
      java: `class Solution {
    public boolean isSubsequence(String s, String t) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {

};`,
      c: `bool isSubsequence(char* s, char* t) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s, t;
    getline(cin, s); getline(cin, t);
    Solution sol;
    cout << (sol.isSubsequence(s, t) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
s = lines[0] if lines else ''
t = lines[1] if len(lines) > 1 else ''
print(str(Solution().isSubsequence(s, t)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        String t = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(new Solution().isSubsequence(s, t));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const s = lines[0] || '', t = lines[1] || '';

__USER_CODE__

console.log(String(isSubsequence(s, t)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    char s[101], t[10001];
    fgets(s, sizeof(s), stdin); fgets(t, sizeof(t), stdin);
    int ns = strlen(s), nt = strlen(t);
    if (s[ns-1]=='\\n') s[--ns]='\\0';
    if (t[nt-1]=='\\n') t[--nt]='\\0';
    printf("%s\\n", isSubsequence(s, t) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Is Subsequence — two pointers O(n)',
  },

  // ── 66. Middle of the Linked List ────────────────────────────────────────────
  {
    number: 66, title: 'Middle of the Linked List', slug: 'middle-of-the-linked-list', difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers'], companies: ['Amazon', 'Apple', 'Microsoft'],
    acceptance: 73.5, premium: false,
    description: `Given a singly linked list (space-separated integers), return the value(s) of the middle node(s). If there are two middle nodes, return the second middle. Print all values from the middle to end, space-separated.`,
    examples: [
      { input: '1 2 3 4 5', output: '3 4 5', explanation: 'Middle is node 3' },
      { input: '1 2 3 4 5 6', output: '4 5 6', explanation: 'Two middles (3 and 4), return second' },
    ],
    constraints: ['1 ≤ number of nodes ≤ 100', '1 ≤ Node.val ≤ 100'],
    testCases: [
      { input: '1 2 3 4 5',   expected: '3 4 5', hidden: false },
      { input: '1 2 3 4 5 6', expected: '4 5 6', hidden: false },
      { input: '1',           expected: '1',      hidden: true  },
      { input: '1 2',         expected: '2',      hidden: true  },
    ],
    hints: [
      "Use Floyd's algorithm: slow and fast pointers.",
      'Slow moves 1 step, fast moves 2 steps.',
      'When fast reaches end, slow is at middle.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* middleNode(ListNode* head) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode middleNode(ListNode head) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* middleNode(struct ListNode* head) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

__USER_CODE__

int main() {
    vector<int> vals; int x;
    while (cin >> x) vals.push_back(x);
    if (vals.empty()) return 0;
    ListNode *head = new ListNode(vals[0]), *cur = head;
    for (int i = 1; i < (int)vals.size(); i++) { cur->next = new ListNode(vals[i]); cur = cur->next; }
    Solution sol; ListNode *mid = sol.middleNode(head);
    bool first = true;
    while (mid) { if (!first) cout << " "; cout << mid->val; mid = mid->next; first = false; }
    cout << endl; return 0;
}`,
      python: `from typing import Optional
import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

__USER_CODE__

vals = list(map(int, sys.stdin.read().split()))
if not vals: exit()
head = ListNode(vals[0]); cur = head
for v in vals[1:]: cur.next = ListNode(v); cur = cur.next
mid = Solution().middleNode(head)
out = []
while mid: out.append(str(mid.val)); mid = mid.next
print(' '.join(out))`,
      java: `import java.util.*;

class ListNode {
    int val; ListNode next;
    ListNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> vals = new ArrayList<>();
        while (sc.hasNextInt()) vals.add(sc.nextInt());
        if (vals.isEmpty()) return;
        ListNode head = new ListNode(vals.get(0)), cur = head;
        for (int i = 1; i < vals.size(); i++) { cur.next = new ListNode(vals.get(i)); cur = cur.next; }
        ListNode mid = new Solution().middleNode(head);
        StringBuilder sb = new StringBuilder();
        while (mid != null) { if (sb.length()>0) sb.append(" "); sb.append(mid.val); mid = mid.next; }
        System.out.println(sb);
    }
}`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

function ListNode(val, next) { this.val = val??0; this.next = next??null; }

__USER_CODE__

if (!vals.length) process.exit(0);
let head = new ListNode(vals[0]), cur = head;
for (let i = 1; i < vals.length; i++) { cur.next = new ListNode(vals[i]); cur = cur.next; }
let mid = middleNode(head); const out = [];
while (mid) { out.push(mid.val); mid = mid.next; }
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct ListNode { int val; struct ListNode *next; };

__USER_CODE__

int main() {
    int vals[101], n = 0;
    while (scanf("%d", &vals[n]) == 1) n++;
    if (!n) return 0;
    struct ListNode *nodes = malloc(n * sizeof(struct ListNode));
    for (int i = 0; i < n; i++) { nodes[i].val = vals[i]; nodes[i].next = i+1<n?&nodes[i+1]:NULL; }
    struct ListNode *mid = middleNode(&nodes[0]);
    int first = 1;
    while (mid) { if (!first) printf(" "); printf("%d", mid->val); mid = mid->next; first = 0; }
    printf("\\n"); free(nodes); return 0;
}`,
    },
    aiContext: 'Middle of Linked List — slow/fast pointers O(n)',
  },

  // ── 67. Maximum Average Subarray I ───────────────────────────────────────────
  {
    number: 67, title: 'Maximum Average Subarray I', slug: 'maximum-average-subarray-i', difficulty: 'Easy',
    tags: ['Array', 'Sliding Window'], companies: ['Google', 'Amazon'],
    acceptance: 43.5, premium: false,
    description: `Given an integer array <code>nums</code> and an integer <code>k</code>, find the contiguous subarray of length <code>k</code> that has the maximum average value. Return this value rounded to 5 decimal places.<br><br>First line: space-separated nums. Second line: k.`,
    examples: [
      { input: '1 12 -5 -6 50 3\n4', output: '12.75000', explanation: 'Subarray [12,-5,-6,50] has avg 12.75' },
      { input: '5\n1',               output: '5.00000'  },
    ],
    constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    testCases: [
      { input: '1 12 -5 -6 50 3\n4', expected: '12.75000', hidden: false },
      { input: '5\n1',               expected: '5.00000',  hidden: false },
      { input: '0 4 0 3 2\n1',       expected: '4.00000',  hidden: true  },
      { input: '4 0 4 3 3\n5',       expected: '2.80000',  hidden: true  },
    ],
    hints: [
      'Compute the sum of the first k elements.',
      'Slide the window: add the next element, remove the first.',
      'Track the maximum window sum.',
    ],
    starter: {
      cpp: `class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> float:
        `,
      java: `class Solution {
    public double findMaxAverage(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function(nums, k) {

};`,
      c: `double findMaxAverage(int* nums, int numsSize, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int k; cin >> k;
    Solution sol;
    printf("%.5f\\n", sol.findMaxAverage(nums, k));
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
nums = list(map(int, lines[0].split()))
k = int(lines[1].strip())
print(f"{Solution().findMaxAverage(nums, k):.5f}")`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = sc.nextInt();
        System.out.printf("%.5f%n", new Solution().findMaxAverage(nums, k));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const k = parseInt(lines[1]);

__USER_CODE__

console.log(findMaxAverage(nums, k).toFixed(5));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0, k;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p&&*p!='\\n'){if(*p==' '){p++;continue;}nums[n++]=strtol(p,&p,10);}
    scanf("%d", &k);
    printf("%.5f\\n", findMaxAverage(nums, n, k));
    return 0;
}`,
    },
    aiContext: 'Maximum Average Subarray I — sliding window O(n)',
  },

  // ── 68. Longest Turbulent Subarray ───────────────────────────────────────────
  {
    number: 68, title: 'Longest Turbulent Subarray', slug: 'longest-turbulent-subarray', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Sliding Window'], companies: ['Google', 'Amazon'],
    acceptance: 47.5, premium: false,
    description: `A subarray is turbulent if the comparison sign flips between each adjacent pair of elements. Given integer array <code>nums</code>, return the length of the maximum size turbulent subarray.`,
    examples: [
      { input: 'nums = [9,4,2,10,7,8,8,1,9]', output: '5', explanation: '[4,2,10,7,8] is turbulent' },
      { input: 'nums = [4,8,12,16]',           output: '2' },
      { input: 'nums = [100]',                  output: '1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 4×10⁴', '0 ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: '9 4 2 10 7 8 8 1 9', expected: '5', hidden: false },
      { input: '4 8 12 16',          expected: '2', hidden: false },
      { input: '100',                expected: '1', hidden: false },
      { input: '0 1 0 1',            expected: '4', hidden: true  },
      { input: '2 2 2',              expected: '1', hidden: true  },
    ],
    hints: [
      'Use sliding window or DP.',
      'Track inc (length ending with increase) and dec (ending with decrease).',
      'If nums[i] > nums[i-1]: inc = dec+1, dec = 1. If less: reverse. If equal: both = 1.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxTurbulenceSize(vector<int>& arr) {

    }
};`,
      python: `class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxTurbulenceSize(int[] arr) {

    }
}`,
      javascript: `/**
 * @param {number[]} arr
 * @return {number}
 */
var maxTurbulenceSize = function(arr) {

};`,
      c: `int maxTurbulenceSize(int* arr, int arrSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> arr; int x;
    while (cin >> x) arr.push_back(x);
    Solution sol;
    cout << sol.maxTurbulenceSize(arr) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

arr = list(map(int, sys.stdin.read().split()))
print(Solution().maxTurbulenceSize(arr))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maxTurbulenceSize(arr));
    }
}`,
      javascript: `const arr = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxTurbulenceSize(arr));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int arr[40001], n = 0;
    while (scanf("%d", &arr[n]) == 1) n++;
    printf("%d\\n", maxTurbulenceSize(arr, n));
    return 0;
}`,
    },
    aiContext: 'Longest Turbulent Subarray — sliding window DP O(n)',
  },

  // ── 69. Number of 1 Bits ─────────────────────────────────────────────────────
  {
    number: 69, title: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'Easy',
    tags: ['Divide and Conquer', 'Bit Manipulation'], companies: ['Apple', 'Microsoft', 'Adobe'],
    acceptance: 66.8, premium: false,
    description: `Given a positive integer <code>n</code>, write a function that returns the number of set bits in its binary representation (also known as the Hamming weight).`,
    examples: [
      { input: 'n = 11',         output: '3', explanation: '11 = 1011, has 3 set bits' },
      { input: 'n = 128',        output: '1', explanation: '128 = 10000000, has 1 set bit' },
      { input: 'n = 2147483645', output: '30' },
    ],
    constraints: ['1 ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '11',         expected: '3',  hidden: false },
      { input: '128',        expected: '1',  hidden: false },
      { input: '2147483645', expected: '30', hidden: false },
      { input: '1',          expected: '1',  hidden: true  },
      { input: '4294967293', expected: '31', hidden: true  },
    ],
    hints: [
      'Use n & (n-1) to clear the lowest set bit.',
      'Count how many times you do this until n = 0.',
      'Or use built-in __builtin_popcount in C++.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int hammingWeight(int n) {

    }
};`,
      python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        `,
      java: `class Solution {
    public int hammingWeight(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var hammingWeight = function(n) {

};`,
      c: `int hammingWeight(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    long long n; cin >> n;
    Solution sol;
    cout << sol.hammingWeight((int)n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().hammingWeight(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        long n = new Scanner(System.in).nextLong();
        System.out.println(new Solution().hammingWeight((int)n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(hammingWeight(n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    long long n; scanf("%lld", &n);
    printf("%d\\n", hammingWeight((int)n));
    return 0;
}`,
    },
    aiContext: 'Number of 1 Bits — bit manipulation O(log n)',
  },

  // ── 70. Reverse Bits ─────────────────────────────────────────────────────────
  {
    number: 70, title: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'Easy',
    tags: ['Divide and Conquer', 'Bit Manipulation'], companies: ['Apple', 'Adobe', 'Airbnb'],
    acceptance: 56.8, premium: false,
    description: `Reverse bits of a given 32-bit unsigned integer. Input is given as an unsigned decimal integer. Output the decimal value of the reversed bits.`,
    examples: [
      { input: '43261596',  output: '964176192', explanation: '00000010100101000001111010011100 reversed is 00111001011110000010100101000000' },
      { input: '4294967293', output: '3221225471', explanation: '11111111111111111111111111111101 reversed' },
    ],
    constraints: ['The input is a 32-bit unsigned integer'],
    testCases: [
      { input: '43261596',   expected: '964176192',  hidden: false },
      { input: '4294967293', expected: '3221225471', hidden: false },
      { input: '0',          expected: '0',           hidden: true  },
      { input: '1',          expected: '2147483648',  hidden: true  },
    ],
    hints: [
      'Process bits one at a time: shift result left, add LSB of n.',
      'Shift n right after extracting each bit.',
      'Do this exactly 32 times.',
    ],
    starter: {
      cpp: `class Solution {
public:
    uint32_t reverseBits(uint32_t n) {

    }
};`,
      python: `class Solution:
    def reverseBits(self, n: int) -> int:
        `,
      java: `public class Solution {
    // you need treat n as an unsigned value
    public int reverseBits(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function(n) {

};`,
      c: `uint32_t reverseBits(uint32_t n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    unsigned long long n; cin >> n;
    Solution sol;
    cout << sol.reverseBits((uint32_t)n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().reverseBits(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        long n = new Scanner(System.in).nextLong();
        System.out.println(Integer.toUnsignedLong(new Solution().reverseBits((int)n)));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(reverseBits(n) >>> 0);`,
      c: `#include <stdio.h>
#include <stdint.h>

__USER_CODE__

int main() {
    unsigned long long n; scanf("%llu", &n);
    printf("%u\\n", reverseBits((uint32_t)n));
    return 0;
}`,
    },
    aiContext: 'Reverse Bits — bit manipulation 32 iterations O(1)',
  },


  // ── PROBLEMS 71–80 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 71. Power of Two ─────────────────────────────────────────────────────────
  {
    number: 71, title: 'Power of Two', slug: 'power-of-two', difficulty: 'Easy',
    tags: ['Math', 'Bit Manipulation', 'Recursion'], companies: ['Google', 'Apple', 'Amazon'],
    acceptance: 46.2, premium: false,
    description: `Given an integer <code>n</code>, return <code>true</code> if it is a power of two, otherwise return <code>false</code>.<br><br>An integer is a power of two if there exists an integer <code>x</code> such that <code>n == 2^x</code>.`,
    examples: [
      { input: 'n = 1',  output: 'true',  explanation: '2^0 = 1' },
      { input: 'n = 16', output: 'true',  explanation: '2^4 = 16' },
      { input: 'n = 3',  output: 'false' },
    ],
    constraints: ['-2³¹ ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '1',  expected: 'true',  hidden: false },
      { input: '16', expected: 'true',  hidden: false },
      { input: '3',  expected: 'false', hidden: false },
      { input: '0',  expected: 'false', hidden: true  },
      { input: '64', expected: 'true',  hidden: true  },
    ],
    hints: [
      'A power of two has exactly one set bit.',
      'n & (n-1) clears the lowest set bit.',
      'If n > 0 and n & (n-1) == 0, it is a power of two.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isPowerOfTwo(int n) {

    }
};`,
      python: `class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        `,
      java: `class Solution {
    public boolean isPowerOfTwo(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {

};`,
      c: `bool isPowerOfTwo(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << (sol.isPowerOfTwo(n) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(str(Solution().isPowerOfTwo(n)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().isPowerOfTwo(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(String(isPowerOfTwo(n)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", isPowerOfTwo(n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Power of Two — bit manipulation n & (n-1) O(1)',
  },

  // ── 72. Fibonacci Number ─────────────────────────────────────────────────────
  {
    number: 72, title: 'Fibonacci Number', slug: 'fibonacci-number', difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'], companies: ['Apple', 'Amazon'],
    acceptance: 68.5, premium: false,
    description: `The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.<br><br>Given <code>n</code>, calculate <code>F(n)</code>.`,
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
    ],
    constraints: ['0 ≤ n ≤ 30'],
    testCases: [
      { input: '2',  expected: '1',   hidden: false },
      { input: '3',  expected: '2',   hidden: false },
      { input: '4',  expected: '3',   hidden: false },
      { input: '0',  expected: '0',   hidden: true  },
      { input: '10', expected: '55',  hidden: true  },
    ],
    hints: [
      'Base cases: F(0) = 0, F(1) = 1.',
      'Use iterative approach for O(n).',
      'Or use memoization for top-down approach.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int fib(int n) {

    }
};`,
      python: `class Solution:
    def fib(self, n: int) -> int:
        `,
      java: `class Solution {
    public int fib(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {

};`,
      c: `int fib(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << sol.fib(n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().fib(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().fib(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(fib(n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%d\\n", fib(n));
    return 0;
}`,
    },
    aiContext: 'Fibonacci Number — iterative O(n)',
  },

  // ── 73. Range Sum Query - Immutable ──────────────────────────────────────────
  {
    number: 73, title: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable', difficulty: 'Easy',
    tags: ['Array', 'Design', 'Prefix Sum'], companies: ['Google', 'Amazon', 'Bloomberg'],
    acceptance: 59.2, premium: false,
    description: `Given an integer array <code>nums</code>, handle multiple queries of the form: calculate the sum of elements between indices <code>left</code> and <code>right</code> inclusive.<br><br>Input: first line is nums, then each query as <code>left right</code>. Print each query result.`,
    examples: [
      { input: '-2 0 3 -5 2 -1\n0 2\n2 5\n0 5', output: '1\n-1\n-3' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁵ ≤ nums[i] ≤ 10⁵', '0 ≤ left ≤ right < nums.length', 'At most 10⁴ calls to sumRange'],
    testCases: [
      { input: '-2 0 3 -5 2 -1\n0 2\n2 5\n0 5', expected: '1\n-1\n-3', hidden: false },
      { input: '1 2 3 4 5\n0 4\n1 3',           expected: '15\n9',      hidden: true  },
      { input: '5\n0 0',                         expected: '5',          hidden: true  },
    ],
    hints: [
      'Build a prefix sum array in the constructor.',
      'sumRange(left, right) = prefix[right+1] - prefix[left].',
      'This gives O(1) per query after O(n) setup.',
    ],
    starter: {
      cpp: `class NumArray {
public:
    NumArray(vector<int>& nums) {

    }

    int sumRange(int left, int right) {

    }
};`,
      python: `class NumArray:

    def __init__(self, nums: List[int]):


    def sumRange(self, left: int, right: int) -> int:
        `,
      java: `class NumArray {

    public NumArray(int[] nums) {

    }

    public int sumRange(int left, int right) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {

};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function(left, right) {

};`,
      c: `typedef struct NumArray NumArray;

NumArray* numArrayCreate(int* nums, int numsSize) {

}

int numArraySumRange(NumArray* obj, int left, int right) {

}

void numArrayFree(NumArray* obj) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    NumArray obj(nums);
    int l, r;
    while (cin >> l >> r) cout << obj.sumRange(l, r) << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
nums = list(map(int, lines[0].split()))
obj = NumArray(nums)
for line in lines[1:]:
    l, r = map(int, line.split())
    print(obj.sumRange(l, r))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        NumArray obj = new NumArray(nums);
        while (sc.hasNextInt()) {
            int l = sc.nextInt(), r = sc.nextInt();
            System.out.println(obj.sumRange(l, r));
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);

__USER_CODE__

const obj = new NumArray(nums);
for (let i = 1; i < lines.length; i++) {
    const [l, r] = lines[i].split(' ').map(Number);
    console.log(obj.sumRange(l, r));
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    char buf[200000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}nums[n++]=strtol(p,&p,10);}
    NumArray *obj = numArrayCreate(nums, n);
    int l, r;
    while (scanf("%d %d", &l, &r) == 2) printf("%d\\n", numArraySumRange(obj, l, r));
    numArrayFree(obj); return 0;
}`,
    },
    aiContext: 'Range Sum Query — prefix sum O(1) per query',
  },

  // ── 74. Search a 2D Matrix ───────────────────────────────────────────────────
  {
    number: 74, title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Matrix'], companies: ['Amazon', 'Apple', 'Microsoft'],
    acceptance: 44.3, premium: false,
    description: `Given an <code>m x n</code> integer matrix where each row is sorted and the first integer of each row is greater than the last of the previous row, return <code>true</code> if <code>target</code> is in the matrix.<br><br>First line: target. Then each row of the matrix.`,
    examples: [
      { input: '3\n1 3 5 7\n10 11 16 20\n23 30 34 60', output: 'true'  },
      { input: '13\n1 3 5 7\n10 11 16 20\n23 30 34 60', output: 'false' },
    ],
    constraints: ['1 ≤ m, n ≤ 100', '-10⁴ ≤ matrix[i][j], target ≤ 10⁴'],
    testCases: [
      { input: '3\n1 3 5 7\n10 11 16 20\n23 30 34 60',  expected: 'true',  hidden: false },
      { input: '13\n1 3 5 7\n10 11 16 20\n23 30 34 60', expected: 'false', hidden: false },
      { input: '1\n1',                                   expected: 'true',  hidden: true  },
      { input: '0\n1',                                   expected: 'false', hidden: true  },
    ],
    hints: [
      'Treat the matrix as a sorted 1D array.',
      'Binary search: mid = (lo + hi) / 2, map to row = mid/cols, col = mid%cols.',
      'This gives O(log(m*n)).',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {

    }
};`,
      python: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        `,
      java: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {

    }
}`,
      javascript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {

};`,
      c: `bool searchMatrix(int** matrix, int matrixSize, int* matrixColSize, int target) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int target; cin >> target; cin.ignore();
    vector<vector<int>> matrix; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        matrix.push_back(row);
    }
    Solution sol;
    cout << (sol.searchMatrix(matrix, target) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
target = int(lines[0])
matrix = [list(map(int, l.split())) for l in lines[1:]]
print(str(Solution().searchMatrix(matrix, target)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt(); sc.nextLine();
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine().trim(); if (l.isEmpty()) continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        int[][] matrix = rows.toArray(new int[0][]);
        System.out.println(new Solution().searchMatrix(matrix, target));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const target = parseInt(lines[0]);
const matrix = lines.slice(1).map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(String(searchMatrix(matrix, target)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int target; scanf("%d", &target);
    int m[101][101], rows = 0, cols = 0; char buf[500];
    fgets(buf, sizeof(buf), stdin);
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0]=='\\n') continue; char *p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[rows][j++]=strtol(p,&p,10);} cols=j; rows++;
    }
    int *ptrs[101]; int colSizes[101];
    for(int i=0;i<rows;i++){ptrs[i]=m[i];colSizes[i]=cols;}
    printf("%s\\n", searchMatrix((int**)ptrs,rows,colSizes,target)?"true":"false");
    return 0;
}`,
    },
    aiContext: 'Search a 2D Matrix — binary search O(log(m*n))',
  },

  // ── 75. Kth Smallest Element in a BST ───────────────────────────────────────
  {
    number: 75, title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium',
    tags: ['Tree', 'DFS', 'Binary Search Tree', 'Sorting'], companies: ['Amazon', 'Bloomberg', 'Facebook'],
    acceptance: 70.2, premium: false,
    description: `Given a BST in level-order (space-separated, use <code>null</code> for missing nodes) and an integer <code>k</code>, return the <code>k</code>th smallest value in the BST.<br><br>First line: k. Second line: level-order tree.`,
    examples: [
      { input: '1\n3 1 4 null 2',       output: '1' },
      { input: '3\n5 3 6 2 4 null null 1', output: '3' },
    ],
    constraints: ['1 ≤ k ≤ n ≤ 10⁴', '0 ≤ Node.val ≤ 10⁴'],
    testCases: [
      { input: '1\n3 1 4 null 2',         expected: '1', hidden: false },
      { input: '3\n5 3 6 2 4 null null 1', expected: '3', hidden: false },
      { input: '1\n1',                     expected: '1', hidden: true  },
      { input: '2\n2 1 3',                 expected: '2', hidden: true  },
    ],
    hints: [
      'In-order traversal of BST gives sorted elements.',
      'Return the k-th element encountered during in-order traversal.',
      'Can stop early once k elements are visited.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public int kthSmallest(TreeNode root, int k) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
int kthSmallest(struct TreeNode* root, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i >= (int)v.size() || v[i] == "null") return nullptr;
    TreeNode* n = new TreeNode(stoi(v[i]));
    n->left = build(v, 2*i+1); n->right = build(v, 2*i+2);
    return n;
}

__USER_CODE__

int main() {
    int k; cin >> k;
    vector<string> vals; string s;
    while (cin >> s) vals.push_back(s);
    TreeNode* root = vals.empty() || vals[0] == "null" ? nullptr : build(vals, 0);
    Solution sol;
    cout << sol.kthSmallest(root, k) << endl;
    return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(vals):
    if not vals or vals[0] == 'null': return None
    root = TreeNode(int(vals[0])); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != 'null': node.left = TreeNode(int(vals[i])); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != 'null': node.right = TreeNode(int(vals[i])); q.append(node.right)
        i += 1
    return root

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
k = int(lines[0])
vals = lines[1].split() if len(lines) > 1 else []
print(Solution().kthSmallest(build(vals), k))`,
      java: `import java.util.*;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}

__USER_CODE__

public class Main {
    static TreeNode build(String[] v, int i) {
        if (i >= v.length || v[i].equals("null")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(v[i]));
        n.left = build(v, 2*i+1); n.right = build(v, 2*i+2);
        return n;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt(); sc.nextLine();
        String[] vals = sc.hasNextLine() ? sc.nextLine().trim().split(" ") : new String[]{"null"};
        TreeNode root = vals[0].equals("null") ? null : build(vals, 0);
        System.out.println(new Solution().kthSmallest(root, k));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const k = parseInt(lines[0]);
const vals = lines[1] ? lines[1].split(/\\s+/) : [];

function TreeNode(val, left, right) { this.val=val??0; this.left=left??null; this.right=right??null; }

function build(v, i=0) {
    if (i>=v.length||v[i]==='null') return null;
    const n=new TreeNode(+v[i]); n.left=build(v,2*i+1); n.right=build(v,2*i+2); return n;
}

__USER_CODE__

const root = !vals.length||vals[0]==='null' ? null : build(vals);
console.log(kthSmallest(root, k));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode { int val; struct TreeNode *left, *right; };
struct TreeNode* newNode(int v) { struct TreeNode* n=malloc(sizeof(struct TreeNode)); n->val=v; n->left=n->right=NULL; return n; }

struct TreeNode* build(char toks[][20], int n, int i) {
    if (i>=n||strcmp(toks[i],"null")==0) return NULL;
    struct TreeNode* node=newNode(atoi(toks[i]));
    node->left=build(toks,n,2*i+1); node->right=build(toks,n,2*i+2);
    return node;
}

__USER_CODE__

int main() {
    int k; scanf("%d",&k);
    char toks[10000][20]; int tc=0;
    while(scanf("%s",toks[tc])==1) tc++;
    struct TreeNode* root=(tc==0||strcmp(toks[0],"null")==0)?NULL:build(toks,tc,0);
    printf("%d\\n",kthSmallest(root,k));
    return 0;
}`,
    },
    aiContext: 'Kth Smallest Element in BST — in-order traversal O(n)',
  },

  // ── 76. Invert Binary Tree ───────────────────────────────────────────────────
  {
    number: 76, title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'], companies: ['Google', 'Amazon', 'Apple'],
    acceptance: 75.4, premium: false,
    description: `Given the root of a binary tree in level-order (space-separated, use <code>null</code> for missing nodes), invert it and return the level-order representation.`,
    examples: [
      { input: '4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1' },
      { input: '2 1 3',         output: '2 3 1'          },
      { input: '1',             output: '1'               },
    ],
    constraints: ['0 ≤ number of nodes ≤ 100', '-100 ≤ Node.val ≤ 100'],
    testCases: [
      { input: '4 2 7 1 3 6 9', expected: '4 7 2 9 6 3 1', hidden: false },
      { input: '2 1 3',         expected: '2 3 1',          hidden: false },
      { input: '1',             expected: '1',               hidden: true  },
      { input: 'null',          expected: '',                hidden: true  },
    ],
    hints: [
      'Swap the left and right children at each node.',
      'Recurse on both subtrees.',
      'Works with both DFS and BFS.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* invertTree(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<string>& v, int i) {
    if (i>=(int)v.size()||v[i]=="null") return nullptr;
    TreeNode* n=new TreeNode(stoi(v[i]));
    n->left=build(v,2*i+1); n->right=build(v,2*i+2); return n;
}

__USER_CODE__

int main() {
    vector<string> vals; string s;
    while(cin>>s) vals.push_back(s);
    TreeNode* root=vals.empty()||vals[0]=="null"?nullptr:build(vals,0);
    Solution sol; root=sol.invertTree(root);
    // BFS level-order output
    if(!root){cout<<endl;return 0;}
    queue<TreeNode*> q; q.push(root); bool first=true;
    while(!q.empty()){
        TreeNode* n=q.front();q.pop();
        if(!first) cout<<" "; cout<<n->val; first=false;
        if(n->left) q.push(n->left);
        if(n->right) q.push(n->right);
    }
    cout<<endl; return 0;
}`,
      python: `from typing import Optional
from collections import deque
import sys

class TreeNode:
    def __init__(self,val=0,left=None,right=None): self.val=val;self.left=left;self.right=right

def build(vals):
    if not vals or vals[0]=='null': return None
    root=TreeNode(int(vals[0]));q=deque([root]);i=1
    while q and i<len(vals):
        node=q.popleft()
        if i<len(vals) and vals[i]!='null': node.left=TreeNode(int(vals[i]));q.append(node.left)
        i+=1
        if i<len(vals) and vals[i]!='null': node.right=TreeNode(int(vals[i]));q.append(node.right)
        i+=1
    return root

__USER_CODE__

vals=sys.stdin.read().split()
root=Solution().invertTree(build(vals))
if not root: print('');exit()
q=deque([root]);out=[]
while q:
    n=q.popleft();out.append(str(n.val))
    if n.left: q.append(n.left)
    if n.right: q.append(n.right)
print(' '.join(out))`,
      java: `import java.util.*;

class TreeNode { int val; TreeNode left,right; TreeNode(int v){val=v;} }

__USER_CODE__

public class Main {
    static TreeNode build(String[] v,int i){
        if(i>=v.length||v[i].equals("null")) return null;
        TreeNode n=new TreeNode(Integer.parseInt(v[i]));
        n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;
    }
    public static void main(String[] args){
        String[] vals=new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root=vals.length==0||vals[0].equals("null")?null:build(vals,0);
        root=new Solution().invertTree(root);
        if(root==null){System.out.println();return;}
        Queue<TreeNode> q=new LinkedList<>();q.add(root);
        StringBuilder sb=new StringBuilder();
        while(!q.isEmpty()){TreeNode n=q.poll();if(sb.length()>0)sb.append(" ");sb.append(n.val);if(n.left!=null)q.add(n.left);if(n.right!=null)q.add(n.right);}
        System.out.println(sb);
    }
}`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);
function TreeNode(val,left,right){this.val=val??0;this.left=left??null;this.right=right??null;}
function build(v,i=0){if(i>=v.length||v[i]==='null')return null;const n=new TreeNode(+v[i]);n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;}

__USER_CODE__

let root=!vals.length||vals[0]==='null'?null:build(vals);
root=invertTree(root);
if(!root){console.log('');process.exit(0);}
const q=[root],out=[];
while(q.length){const n=q.shift();out.push(n.val);if(n.left)q.push(n.left);if(n.right)q.push(n.right);}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode{int val;struct TreeNode *left,*right;};
struct TreeNode* newNode(int v){struct TreeNode*n=malloc(sizeof(struct TreeNode));n->val=v;n->left=n->right=NULL;return n;}
struct TreeNode* build(char t[][20],int n,int i){
    if(i>=n||strcmp(t[i],"null")==0)return NULL;
    struct TreeNode*node=newNode(atoi(t[i]));
    node->left=build(t,n,2*i+1);node->right=build(t,n,2*i+2);return node;
}

__USER_CODE__

int main(){
    char toks[10000][20];int tc=0;
    while(scanf("%s",toks[tc])==1)tc++;
    struct TreeNode*root=(tc==0||strcmp(toks[0],"null")==0)?NULL:build(toks,tc,0);
    root=invertTree(root);
    if(!root){printf("\\n");return 0;}
    struct TreeNode*q[10001];int head=0,tail=0;q[tail++]=root;int first=1;
    while(head<tail){struct TreeNode*n=q[head++];if(!first)printf(" ");printf("%d",n->val);first=0;if(n->left)q[tail++]=n->left;if(n->right)q[tail++]=n->right;}
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Invert Binary Tree — DFS swap O(n)',
  },

  // ── 77. Binary Tree Level Order Traversal ────────────────────────────────────
  {
    number: 77, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium',
    tags: ['Tree', 'BFS'], companies: ['Amazon', 'Microsoft', 'Facebook'],
    acceptance: 64.1, premium: false,
    description: `Given a binary tree in level-order (space-separated, use <code>null</code> for missing), return the level order traversal of its nodes' values. Print each level on a separate line, space-separated.`,
    examples: [
      { input: '3 9 20 null null 15 7', output: '3\n9 20\n15 7' },
      { input: '1',                     output: '1'              },
      { input: 'null',                  output: ''               },
    ],
    constraints: ['0 ≤ number of nodes ≤ 2000', '-1000 ≤ Node.val ≤ 1000'],
    testCases: [
      { input: '3 9 20 null null 15 7', expected: '3\n9 20\n15 7', hidden: false },
      { input: '1',                     expected: '1',              hidden: false },
      { input: 'null',                  expected: '',               hidden: true  },
      { input: '1 2 3 4 5',             expected: '1\n2 3\n4 5',   hidden: true  },
    ],
    hints: [
      'Use BFS with a queue.',
      'At each level, process all nodes currently in the queue.',
      'Record the level size before processing.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

TreeNode* build(vector<string>& v,int i){
    if(i>=(int)v.size()||v[i]=="null")return nullptr;
    TreeNode*n=new TreeNode(stoi(v[i]));
    n->left=build(v,2*i+1);n->right=build(v,2*i+2);return n;
}

__USER_CODE__

int main(){
    vector<string>vals;string s;
    while(cin>>s)vals.push_back(s);
    TreeNode*root=vals.empty()||vals[0]=="null"?nullptr:build(vals,0);
    Solution sol;
    auto res=sol.levelOrder(root);
    for(auto&level:res){for(int i=0;i<(int)level.size();i++)cout<<(i?" ":"")<<level[i];cout<<"\\n";}
    return 0;
}`,
      python: `from typing import Optional,List
from collections import deque
import sys

class TreeNode:
    def __init__(self,val=0,left=None,right=None):self.val=val;self.left=left;self.right=right

def build(vals):
    if not vals or vals[0]=='null':return None
    root=TreeNode(int(vals[0]));q=deque([root]);i=1
    while q and i<len(vals):
        node=q.popleft()
        if i<len(vals) and vals[i]!='null':node.left=TreeNode(int(vals[i]));q.append(node.left)
        i+=1
        if i<len(vals) and vals[i]!='null':node.right=TreeNode(int(vals[i]));q.append(node.right)
        i+=1
    return root

__USER_CODE__

vals=sys.stdin.read().split()
res=Solution().levelOrder(build(vals))
for level in res:print(*level)`,
      java: `import java.util.*;

class TreeNode{int val;TreeNode left,right;TreeNode(int v){val=v;}}

__USER_CODE__

public class Main{
    static TreeNode build(String[]v,int i){
        if(i>=v.length||v[i].equals("null"))return null;
        TreeNode n=new TreeNode(Integer.parseInt(v[i]));
        n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;
    }
    public static void main(String[]args){
        String[]vals=new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root=vals.length==0||vals[0].equals("null")?null:build(vals,0);
        List<List<Integer>>res=new Solution().levelOrder(root);
        for(List<Integer>level:res){StringBuilder sb=new StringBuilder();for(int i=0;i<level.size();i++)sb.append(i>0?" ":"").append(level.get(i));System.out.println(sb);}
    }
}`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);
function TreeNode(val,left,right){this.val=val??0;this.left=left??null;this.right=right??null;}
function build(v,i=0){if(i>=v.length||v[i]==='null')return null;const n=new TreeNode(+v[i]);n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;}

__USER_CODE__

const root=!vals.length||vals[0]==='null'?null:build(vals);
const res=levelOrder(root);
for(const level of res)console.log(level.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode{int val;struct TreeNode*left,*right;};
struct TreeNode*newNode(int v){struct TreeNode*n=malloc(sizeof(struct TreeNode));n->val=v;n->left=n->right=NULL;return n;}
struct TreeNode*build(char t[][20],int n,int i){
    if(i>=n||strcmp(t[i],"null")==0)return NULL;
    struct TreeNode*node=newNode(atoi(t[i]));
    node->left=build(t,n,2*i+1);node->right=build(t,n,2*i+2);return node;
}

__USER_CODE__

int main(){
    char toks[10000][20];int tc=0;
    while(scanf("%s",toks[tc])==1)tc++;
    struct TreeNode*root=(tc==0||strcmp(toks[0],"null")==0)?NULL:build(toks,tc,0);
    int retSize;int*retColSizes;
    int**res=levelOrder(root,&retSize,&retColSizes);
    for(int i=0;i<retSize;i++){for(int j=0;j<retColSizes[i];j++)printf("%s%d",j?" ":"",res[i][j]);printf("\\n");}
    return 0;
}`,
    },
    aiContext: 'Binary Tree Level Order Traversal — BFS O(n)',
  },

  // ── 78. Lowest Common Ancestor of BST ────────────────────────────────────────
  {
    number: 78, title: 'Lowest Common Ancestor of a Binary Search Tree', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium',
    tags: ['Tree', 'DFS', 'Binary Search Tree'], companies: ['Amazon', 'Facebook', 'Microsoft'],
    acceptance: 62.3, premium: false,
    description: `Given a BST in level-order (space-separated, use <code>null</code> for missing nodes) and two values <code>p</code> and <code>q</code>, find their lowest common ancestor.<br><br>First line: p q. Second line: tree.`,
    examples: [
      { input: '2 8\n6 2 8 0 4 7 9 null null 3 5', output: '6' },
      { input: '2 4\n6 2 8 0 4 7 9 null null 3 5', output: '2' },
    ],
    constraints: ['2 ≤ number of nodes ≤ 10⁵', '-10⁹ ≤ Node.val ≤ 10⁹', 'p ≠ q, both exist in BST'],
    testCases: [
      { input: '2 8\n6 2 8 0 4 7 9 null null 3 5', expected: '6', hidden: false },
      { input: '2 4\n6 2 8 0 4 7 9 null null 3 5', expected: '2', hidden: false },
      { input: '1 3\n2 1 3',                        expected: '2', hidden: true  },
    ],
    hints: [
      'In a BST, if both p and q are less than root, LCA is in left subtree.',
      'If both are greater, LCA is in right subtree.',
      'Otherwise, root is the LCA.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* lowestCommonAncestor(struct TreeNode* root, struct TreeNode* p, struct TreeNode* q) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

TreeNode*build(vector<string>&v,int i){
    if(i>=(int)v.size()||v[i]=="null")return nullptr;
    TreeNode*n=new TreeNode(stoi(v[i]));n->left=build(v,2*i+1);n->right=build(v,2*i+2);return n;
}

__USER_CODE__

int main(){
    int pv,qv;cin>>pv>>qv;
    vector<string>vals;string s;while(cin>>s)vals.push_back(s);
    TreeNode*root=vals.empty()||vals[0]=="null"?nullptr:build(vals,0);
    TreeNode p(pv),q(qv);
    Solution sol;
    cout<<sol.lowestCommonAncestor(root,&p,&q)->val<<endl;
    return 0;
}`,
      python: `from collections import deque
import sys

class TreeNode:
    def __init__(self,x):self.val=x;self.left=self.right=None

def build(vals):
    if not vals or vals[0]=='null':return None
    root=TreeNode(int(vals[0]));q=deque([root]);i=1
    while q and i<len(vals):
        node=q.popleft()
        if i<len(vals) and vals[i]!='null':node.left=TreeNode(int(vals[i]));q.append(node.left)
        i+=1
        if i<len(vals) and vals[i]!='null':node.right=TreeNode(int(vals[i]));q.append(node.right)
        i+=1
    return root

__USER_CODE__

lines=sys.stdin.read().strip().split('\\n')
pv,qv=map(int,lines[0].split())
vals=lines[1].split() if len(lines)>1 else []
root=build(vals)
p=TreeNode(pv);q=TreeNode(qv)
print(Solution().lowestCommonAncestor(root,p,q).val)`,
      java: `import java.util.*;

class TreeNode{int val;TreeNode left,right;TreeNode(int x){val=x;}}

__USER_CODE__

public class Main{
    static TreeNode build(String[]v,int i){
        if(i>=v.length||v[i].equals("null"))return null;
        TreeNode n=new TreeNode(Integer.parseInt(v[i]));n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;
    }
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int pv=sc.nextInt(),qv=sc.nextInt();sc.nextLine();
        String[]vals=sc.hasNextLine()?sc.nextLine().trim().split(" "):new String[]{"null"};
        TreeNode root=vals[0].equals("null")?null:build(vals,0);
        TreeNode p=new TreeNode(pv),q=new TreeNode(qv);
        System.out.println(new Solution().lowestCommonAncestor(root,p,q).val);
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const [pv,qv]=lines[0].split(' ').map(Number);
const vals=lines[1]?lines[1].split(/\\s+/):[];

function TreeNode(val){this.val=val;this.left=this.right=null;}
function build(v,i=0){if(i>=v.length||v[i]==='null')return null;const n=new TreeNode(+v[i]);n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;}

__USER_CODE__

const root=!vals.length||vals[0]==='null'?null:build(vals);
const p=new TreeNode(pv),q=new TreeNode(qv);
console.log(lowestCommonAncestor(root,p,q).val);`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode{int val;struct TreeNode*left,*right;};
struct TreeNode*newNode(int v){struct TreeNode*n=malloc(sizeof(struct TreeNode));n->val=v;n->left=n->right=NULL;return n;}
struct TreeNode*build(char t[][20],int n,int i){
    if(i>=n||strcmp(t[i],"null")==0)return NULL;
    struct TreeNode*node=newNode(atoi(t[i]));node->left=build(t,n,2*i+1);node->right=build(t,n,2*i+2);return node;
}

__USER_CODE__

int main(){
    int pv,qv;scanf("%d %d",&pv,&qv);
    char toks[10000][20];int tc=0;while(scanf("%s",toks[tc])==1)tc++;
    struct TreeNode*root=(tc==0||strcmp(toks[0],"null")==0)?NULL:build(toks,tc,0);
    struct TreeNode p,q;p.val=pv;p.left=p.right=NULL;q.val=qv;q.left=q.right=NULL;
    printf("%d\\n",lowestCommonAncestor(root,&p,&q)->val);
    return 0;
}`,
    },
    aiContext: 'LCA of BST — iterative BST traversal O(h)',
  },

  // ── 79. Construct Binary Tree from Preorder and Inorder Traversal ─────────────
  {
    number: 79, title: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 61.0, premium: false,
    description: `Given two integer arrays <code>preorder</code> and <code>inorder</code> representing a binary tree, construct and return the binary tree. Print the tree in level-order.<br><br>First line: preorder values. Second line: inorder values.`,
    examples: [
      { input: '3 9 20 15 7\n9 3 15 20 7', output: '3 9 20 null null 15 7' },
      { input: '-1\n-1',                   output: '-1'                      },
    ],
    constraints: ['1 ≤ n ≤ 3000', '-3000 ≤ preorder[i], inorder[i] ≤ 3000', 'All values are unique'],
    testCases: [
      { input: '3 9 20 15 7\n9 3 15 20 7', expected: '3 9 20 null null 15 7', hidden: false },
      { input: '-1\n-1',                   expected: '-1',                     hidden: false },
      { input: '1 2\n2 1',                 expected: '1 2',                    hidden: true  },
    ],
    hints: [
      'The first element of preorder is always the root.',
      'Find root in inorder to split left/right subtrees.',
      'Recursively build left then right.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* buildTree(int* preorder, int preorderSize, int* inorder, int inorderSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

__USER_CODE__

int main(){
    string l1,l2;getline(cin,l1);getline(cin,l2);
    istringstream s1(l1),s2(l2);
    vector<int>pre,in;int x;
    while(s1>>x)pre.push_back(x);
    while(s2>>x)in.push_back(x);
    Solution sol;TreeNode*root=sol.buildTree(pre,in);
    if(!root){cout<<endl;return 0;}
    queue<TreeNode*>q;q.push(root);
    vector<string>out;
    while(!q.empty()){
        TreeNode*n=q.front();q.pop();
        if(!n){out.push_back("null");continue;}
        out.push_back(to_string(n->val));
        q.push(n->left);q.push(n->right);
    }
    while(!out.empty()&&out.back()=="null")out.pop_back();
    for(int i=0;i<(int)out.size();i++)cout<<(i?" ":"")<<out[i];
    cout<<endl;return 0;
}`,
      python: `from typing import Optional,List
from collections import deque
import sys

class TreeNode:
    def __init__(self,val=0,left=None,right=None):self.val=val;self.left=left;self.right=right

__USER_CODE__

lines=sys.stdin.read().strip().split('\\n')
pre=list(map(int,lines[0].split()))
ino=list(map(int,lines[1].split()))
root=Solution().buildTree(pre,ino)
if not root:print('');exit()
q=deque([root]);out=[]
while q:
    n=q.popleft()
    if not n:out.append('null');continue
    out.append(str(n.val));q.append(n.left);q.append(n.right)
while out and out[-1]=='null':out.pop()
print(' '.join(out))`,
      java: `import java.util.*;

class TreeNode{int val;TreeNode left,right;TreeNode(int v){val=v;}}

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int[]pre=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int[]in=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        TreeNode root=new Solution().buildTree(pre,in);
        if(root==null){System.out.println();return;}
        Queue<TreeNode>q=new LinkedList<>();q.add(root);
        List<String>out=new ArrayList<>();
        while(!q.isEmpty()){TreeNode n=q.poll();if(n==null){out.add("null");continue;}out.add(String.valueOf(n.val));q.add(n.left);q.add(n.right);}
        while(!out.isEmpty()&&out.get(out.size()-1).equals("null"))out.remove(out.size()-1);
        System.out.println(String.join(" ",out));
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const pre=lines[0].split(' ').map(Number);
const ino=lines[1].split(' ').map(Number);

function TreeNode(val,left,right){this.val=val??0;this.left=left??null;this.right=right??null;}

__USER_CODE__

const root=buildTree(pre,ino);
if(!root){console.log('');process.exit(0);}
const q=[root],out=[];
while(q.length){const n=q.shift();if(!n){out.push('null');continue;}out.push(n.val);q.push(n.left);q.push(n.right);}
while(out.length&&out[out.length-1]==='null')out.pop();
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode{int val;struct TreeNode*left,*right;};
struct TreeNode*newNode(int v){struct TreeNode*n=malloc(sizeof(struct TreeNode));n->val=v;n->left=n->right=NULL;return n;}

__USER_CODE__

int main(){
    int pre[3001],in[3001],np=0,ni=0;
    char buf[50000];
    fgets(buf,sizeof(buf),stdin);char*p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}pre[np++]=strtol(p,&p,10);}
    fgets(buf,sizeof(buf),stdin);p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}in[ni++]=strtol(p,&p,10);}
    struct TreeNode*root=buildTree(pre,np,in,ni);
    if(!root){printf("\\n");return 0;}
    struct TreeNode*q[3001];int head=0,tail=0;q[tail++]=root;
    char out[3001][15];int oc=0;
    while(head<tail){struct TreeNode*n=q[head++];if(!n){strcpy(out[oc++],"null");continue;}sprintf(out[oc++],"%d",n->val);q[tail++]=n->left;q[tail++]=n->right;}
    while(oc>0&&strcmp(out[oc-1],"null")==0)oc--;
    for(int i=0;i<oc;i++)printf("%s%s",i?" ":"",out[i]);printf("\\n");
    return 0;
}`,
    },
    aiContext: 'Construct Binary Tree — divide and conquer O(n)',
  },

  // ── 80. Sort Colors ──────────────────────────────────────────────────────────
  {
    number: 80, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Facebook', 'Amazon', 'Microsoft'],
    acceptance: 57.5, premium: false,
    description: `Given an array with <code>n</code> objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, in the order 0, 1, 2. (Dutch National Flag problem)`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '0 0 1 1 2 2' },
      { input: 'nums = [2,0,1]',       output: '0 1 2'        },
    ],
    constraints: ['1 ≤ nums.length ≤ 300', 'nums[i] is 0, 1, or 2'],
    testCases: [
      { input: '2 0 2 1 1 0', expected: '0 0 1 1 2 2', hidden: false },
      { input: '2 0 1',       expected: '0 1 2',        hidden: false },
      { input: '0',           expected: '0',             hidden: true  },
      { input: '1 0',         expected: '0 1',           hidden: true  },
      { input: '2 1 0',       expected: '0 1 2',         hidden: true  },
    ],
    hints: [
      'Use three pointers: low, mid, high.',
      'low tracks the boundary of 0s, high tracks boundary of 2s.',
      'mid scans from left: swap nums[mid] to correct region.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void sortColors(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        `,
      java: `class Solution {
    public void sortColors(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {

};`,
      c: `void sortColors(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    vector<int>nums;int x;
    while(cin>>x)nums.push_back(x);
    Solution sol;sol.sortColors(nums);
    for(int i=0;i<(int)nums.size();i++)cout<<(i?" ":"")<<nums[i];
    cout<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums=list(map(int,sys.stdin.read().split()))
Solution().sortColors(nums)
print(*nums)`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        List<Integer>list=new ArrayList<>();
        while(sc.hasNextInt())list.add(sc.nextInt());
        int[]nums=list.stream().mapToInt(i->i).toArray();
        new Solution().sortColors(nums);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<nums.length;i++)sb.append(i>0?" ":"").append(nums[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

sortColors(nums);
console.log(nums.join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    int nums[301],n=0;
    while(scanf("%d",&nums[n])==1)n++;
    sortColors(nums,n);
    for(int i=0;i<n;i++)printf("%s%d",i?" ":"",nums[i]);
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Sort Colors — Dutch National Flag 3-pointer O(n)',
  },


  // ── PROBLEMS 81–90 ────────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 81. Top K Frequent Elements ──────────────────────────────────────────────
  {
    number: 81, title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Sorting', 'Heap', 'Bucket Sort'], companies: ['Facebook', 'Amazon', 'Google'],
    acceptance: 65.3, premium: false,
    description: `Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements in any order.<br><br>First line: space-separated nums. Second line: k. Print result space-separated.`,
    examples: [
      { input: '1 1 1 2 2 3\n2', output: '1 2', explanation: '1 appears 3 times, 2 appears 2 times' },
      { input: '1\n1',           output: '1'   },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'k is in range [1, number of unique elements]', 'Answer is unique'],
    testCases: [
      { input: '1 1 1 2 2 3\n2', expected: '1 2', hidden: false },
      { input: '1\n1',           expected: '1',   hidden: false },
      { input: '4 1 1 2 2\n2',   expected: '1 2', hidden: true  },
      { input: '5 5 4 4 3\n1',   expected: '4',   hidden: true  },
    ],
    hints: [
      'Count frequencies with a hash map.',
      'Use a max-heap or bucket sort by frequency.',
      'Return the top k elements.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {

};`,
      c: `int* topKFrequent(int* nums, int numsSize, int k, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int k; cin >> k;
    Solution sol;
    vector<int> res = sol.topKFrequent(nums, k);
    sort(res.begin(), res.end());
    for (int i = 0; i < (int)res.size(); i++) cout << (i?" ":"") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
nums = list(map(int, lines[0].split()))
k = int(lines[1].strip())
res = sorted(Solution().topKFrequent(nums, k))
print(*res)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = sc.nextInt();
        int[] res = new Solution().topKFrequent(nums, k);
        Arrays.sort(res);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i>0?" ":"").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const k = parseInt(lines[1]);

__USER_CODE__

const res = topKFrequent(nums, k).sort((a,b)=>a-b);
console.log(res.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int cmp(const void*a,const void*b){return *(int*)a-*(int*)b;}
int main() {
    int nums[100001], n = 0, k;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}nums[n++]=strtol(p,&p,10);}
    scanf("%d", &k);
    int retSize;
    int *res = topKFrequent(nums, n, k, &retSize);
    qsort(res, retSize, sizeof(int), cmp);
    for (int i = 0; i < retSize; i++) printf("%s%d", i?" ":"", res[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Top K Frequent Elements — bucket sort or heap O(n log k)',
  },

  // ── 82. Group Anagrams ───────────────────────────────────────────────────────
  {
    number: 82, title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'], companies: ['Facebook', 'Amazon', 'Bloomberg'],
    acceptance: 67.1, premium: false,
    description: `Given an array of strings, group the anagrams together. Print each group sorted alphabetically on a separate line, with words in each group sorted alphabetically.`,
    examples: [
      { input: 'eat tan bat\n', output: 'bat\neat tan\n', explanation: 'Groups: [bat] and [eat,tan]' },
      { input: '\n',            output: '\n'              },
      { input: 'a\n',          output: 'a\n'             },
    ],
    constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'strs[i] consists of lowercase English letters'],
    testCases: [
      { input: 'eat tan bat',   expected: 'bat\neat tan',   hidden: false },
      { input: '',              expected: '',               hidden: false },
      { input: 'a',            expected: 'a',              hidden: true  },
      { input: 'abc bca cab x', expected: 'abc bca cab\nx', hidden: true },
    ],
    hints: [
      'Sort each string to get its canonical form.',
      'Use sorted string as the key in a hash map.',
      'Group strings with the same key.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {

    }
};`,
      python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        `,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {

    }
}`,
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {

};`,
      c: `char*** groupAnagrams(char** strs, int strsSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<string> strs; string w;
    while (ss >> w) strs.push_back(w);
    Solution sol;
    auto res = sol.groupAnagrams(strs);
    for (auto& g : res) sort(g.begin(), g.end());
    sort(res.begin(), res.end(), [](auto&a,auto&b){return a[0]<b[0];});
    for (auto& g : res) {
        for (int i=0;i<(int)g.size();i++) cout<<(i?" ":"")<<g[i];
        cout<<"\\n";
    }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

line = sys.stdin.read().strip()
strs = line.split() if line else []
res = Solution().groupAnagrams(strs)
for g in res: g.sort()
res.sort(key=lambda g: g[0])
for g in res: print(*g)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String[] strs = line.isEmpty() ? new String[]{} : line.split(" ");
        List<List<String>> res = new Solution().groupAnagrams(strs);
        for (List<String> g : res) Collections.sort(g);
        res.sort(Comparator.comparing(g -> g.get(0)));
        for (List<String> g : res) System.out.println(String.join(" ", g));
    }
}`,
      javascript: `const line = require('fs').readFileSync('/dev/stdin','utf8').trim();
const strs = line ? line.split(' ') : [];

__USER_CODE__

const res = groupAnagrams(strs);
for (const g of res) g.sort();
res.sort((a,b) => a[0] < b[0] ? -1 : 1);
for (const g of res) console.log(g.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int main() {
    char words[10001][101]; int n = 0;
    char line[1000001]; fgets(line, sizeof(line), stdin);
    char *p = strtok(line, " \\n");
    while (p) { strcpy(words[n++], p); p = strtok(NULL, " \\n"); }
    char *strs[10001]; for(int i=0;i<n;i++) strs[i]=words[i];
    int retSize; int *retColSizes;
    char ***res = groupAnagrams(strs, n, &retSize, &retColSizes);
    for(int i=0;i<retSize;i++){for(int j=0;j<retColSizes[i];j++)printf("%s%s",j?" ":"",res[i][j]);printf("\\n");}
    return 0;
}`,
    },
    aiContext: 'Group Anagrams — sort key hash map O(n*k*log k)',
  },

  // ── 83. Valid Anagram ────────────────────────────────────────────────────────
  {
    number: 83, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Sorting'], companies: ['Amazon', 'Bloomberg', 'Uber'],
    acceptance: 63.7, premium: false,
    description: `Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, <code>false</code> otherwise.<br><br>First line: s. Second line: t.`,
    examples: [
      { input: 'anagram\nnagaram', output: 'true'  },
      { input: 'rat\ncar',        output: 'false' },
    ],
    constraints: ['1 ≤ s.length, t.length ≤ 5×10⁴', 's and t consist of lowercase English letters'],
    testCases: [
      { input: 'anagram\nnagaram', expected: 'true',  hidden: false },
      { input: 'rat\ncar',         expected: 'false', hidden: false },
      { input: 'a\na',             expected: 'true',  hidden: true  },
      { input: 'ab\nba',           expected: 'true',  hidden: true  },
      { input: 'abc\nab',          expected: 'false', hidden: true  },
    ],
    hints: [
      'Count character frequencies in both strings.',
      'Compare the frequency arrays.',
      'Or sort both strings and compare.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {

    }
};`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        `,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {

};`,
      c: `bool isAnagram(char* s, char* t) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s, t;
    getline(cin, s); getline(cin, t);
    Solution sol;
    cout << (sol.isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
s = lines[0].strip(); t = lines[1].strip() if len(lines) > 1 else ''
print(str(Solution().isAnagram(s, t)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim(), t = sc.nextLine().trim();
        System.out.println(new Solution().isAnagram(s, t));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const s = lines[0].trim(), t = (lines[1]||'').trim();

__USER_CODE__

console.log(String(isAnagram(s, t)));`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[50001], t[50001];
    fgets(s, sizeof(s), stdin); fgets(t, sizeof(t), stdin);
    int ns=strlen(s), nt=strlen(t);
    if(s[ns-1]=='\\n') s[--ns]='\\0';
    if(t[nt-1]=='\\n') t[--nt]='\\0';
    printf("%s\\n", isAnagram(s,t)?"true":"false");
    return 0;
}`,
    },
    aiContext: 'Valid Anagram — frequency count O(n)',
  },

  // ── 84. Longest Consecutive Sequence ─────────────────────────────────────────
  {
    number: 84, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Union Find'], companies: ['Google', 'Facebook', 'Amazon'],
    acceptance: 46.2, premium: false,
    description: `Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence. Must run in <code>O(n)</code>.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: '[1,2,3,4] has length 4' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
    ],
    constraints: ['0 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: '100 4 200 1 3 2',     expected: '4', hidden: false },
      { input: '0 3 7 2 5 8 4 6 0 1', expected: '9', hidden: false },
      { input: '',                    expected: '0', hidden: true  },
      { input: '1',                   expected: '1', hidden: true  },
      { input: '1 2 3',               expected: '3', hidden: true  },
    ],
    hints: [
      'Put all numbers in a hash set.',
      'Only start counting from numbers where n-1 is NOT in the set.',
      'Count consecutive from that start point.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int longestConsecutive(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {

};`,
      c: `int longestConsecutive(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.longestConsecutive(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

data = sys.stdin.read().strip()
nums = list(map(int, data.split())) if data else []
print(Solution().longestConsecutive(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().longestConsecutive(nums));
    }
}`,
      javascript: `const data = require('fs').readFileSync('/dev/stdin','utf8').trim();
const nums = data ? data.split(/\\s+/).map(Number) : [];

__USER_CODE__

console.log(longestConsecutive(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", longestConsecutive(nums, n));
    return 0;
}`,
    },
    aiContext: 'Longest Consecutive Sequence — hash set O(n)',
  },

  // ── 85. Set Matrix Zeroes ────────────────────────────────────────────────────
  {
    number: 85, title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Matrix'], companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: 51.5, premium: false,
    description: `Given an <code>m x n</code> integer matrix, if an element is 0, set its entire row and column to 0. Do it in-place.<br><br>Input: m rows of n space-separated integers. Output: modified matrix.`,
    examples: [
      { input: '1 1 1\n1 0 1\n1 1 1',          output: '1 0 1\n0 0 0\n1 0 1'          },
      { input: '0 1 2 0\n3 4 5 2\n1 3 1 5',    output: '0 0 0 0\n0 4 5 0\n0 3 1 0'    },
    ],
    constraints: ['1 ≤ m, n ≤ 200', '-2³¹ ≤ matrix[i][j] ≤ 2³¹-1'],
    testCases: [
      { input: '1 1 1\n1 0 1\n1 1 1',       expected: '1 0 1\n0 0 0\n1 0 1',       hidden: false },
      { input: '0 1 2 0\n3 4 5 2\n1 3 1 5', expected: '0 0 0 0\n0 4 5 0\n0 3 1 0', hidden: false },
      { input: '1',                          expected: '1',                          hidden: true  },
      { input: '0',                          expected: '0',                          hidden: true  },
    ],
    hints: [
      'Record which rows and columns contain a zero.',
      'Then set those rows and columns to zero.',
      'Use O(1) space by using first row/column as markers.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {

    }
};`,
      python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        `,
      java: `class Solution {
    public void setZeroes(int[][] matrix) {

    }
}`,
      javascript: `/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {

};`,
      c: `void setZeroes(int** matrix, int matrixSize, int* matrixColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> matrix; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        matrix.push_back(row);
    }
    Solution sol; sol.setZeroes(matrix);
    for (auto& row : matrix) { for (int i=0;i<(int)row.size();i++) cout<<(i?" ":"")<<row[i]; cout<<"\\n"; }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
matrix = [list(map(int, l.split())) for l in lines]
Solution().setZeroes(matrix)
for row in matrix: print(*row)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l=sc.nextLine().trim(); if(l.isEmpty())continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        int[][] m = rows.toArray(new int[0][]);
        new Solution().setZeroes(m);
        for (int[] row : m) { StringBuilder sb=new StringBuilder(); for(int i=0;i<row.length;i++) sb.append(i>0?" ":"").append(row[i]); System.out.println(sb); }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const matrix = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

setZeroes(matrix);
for (const row of matrix) console.log(row.join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[201][201], rows=0, cols=0; char buf[5000];
    while (fgets(buf,sizeof(buf),stdin)) {
        if(buf[0]=='\\n')continue; char*p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[rows][j++]=strtol(p,&p,10);} cols=j; rows++;
    }
    int *ptrs[201]; int colSizes[201];
    for(int i=0;i<rows;i++){ptrs[i]=m[i];colSizes[i]=cols;}
    setZeroes((int**)ptrs,rows,colSizes);
    for(int i=0;i<rows;i++){for(int j=0;j<cols;j++)printf("%s%d",j?" ":"",m[i][j]);printf("\\n");}
    return 0;
}`,
    },
    aiContext: 'Set Matrix Zeroes — first row/col marker O(1) space O(m*n)',
  },

  // ── 86. Container With Most Water ────────────────────────────────────────────
  {
    number: 86, title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 54.5, premium: false,
    description: `Given an integer array <code>height</code> of length <code>n</code>, find two lines that form a container with the most water. Return the maximum amount of water the container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 and 8 with height 7' },
      { input: 'height = [1,1]',                output: '1'  },
    ],
    constraints: ['2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    testCases: [
      { input: '1 8 6 2 5 4 8 3 7', expected: '49', hidden: false },
      { input: '1 1',               expected: '1',  hidden: false },
      { input: '4 3 2 1 4',         expected: '16', hidden: true  },
      { input: '1 2 1',             expected: '2',  hidden: true  },
    ],
    hints: [
      'Use two pointers: left at 0, right at end.',
      'Area = min(height[l], height[r]) * (r - l).',
      'Move the pointer with the smaller height inward.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {

    }
};`,
      python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxArea(int[] height) {

    }
}`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {

};`,
      c: `int maxArea(int* height, int heightSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> height; int x;
    while (cin >> x) height.push_back(x);
    Solution sol;
    cout << sol.maxArea(height) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

height = list(map(int, sys.stdin.read().split()))
print(Solution().maxArea(height))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] height = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maxArea(height));
    }
}`,
      javascript: `const height = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxArea(height));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int h[100001], n=0;
    while (scanf("%d",&h[n])==1) n++;
    printf("%d\\n", maxArea(h,n));
    return 0;
}`,
    },
    aiContext: 'Container With Most Water — two pointers O(n)',
  },

  // ── 87. Minimum Path Sum ─────────────────────────────────────────────────────
  {
    number: 87, title: 'Minimum Path Sum', slug: 'minimum-path-sum', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Matrix'], companies: ['Amazon', 'Google', 'Microsoft'],
    acceptance: 61.5, premium: false,
    description: `Given an <code>m x n</code> grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum. You can only move right or down.<br><br>Input: m rows of n space-separated integers.`,
    examples: [
      { input: '1 3 1\n1 5 1\n4 2 1', output: '7', explanation: '1→3→1→1→1 = 7' },
      { input: '1 2 3\n4 5 6',        output: '12' },
    ],
    constraints: ['1 ≤ m, n ≤ 200', '0 ≤ grid[i][j] ≤ 200'],
    testCases: [
      { input: '1 3 1\n1 5 1\n4 2 1', expected: '7',  hidden: false },
      { input: '1 2 3\n4 5 6',        expected: '12', hidden: false },
      { input: '1',                   expected: '1',  hidden: true  },
      { input: '5 1\n2 3',            expected: '8',  hidden: true  },
    ],
    hints: [
      'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
      'Initialize first row and first column as prefix sums.',
      'Can optimize to 1D DP array.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {

    }
};`,
      python: `class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        `,
      java: `class Solution {
    public int minPathSum(int[][] grid) {

    }
}`,
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {

};`,
      c: `int minPathSum(int** grid, int gridSize, int* gridColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> grid; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        grid.push_back(row);
    }
    Solution sol;
    cout << sol.minPathSum(grid) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
grid = [list(map(int, l.split())) for l in lines]
print(Solution().minPathSum(grid))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l=sc.nextLine().trim(); if(l.isEmpty())continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        System.out.println(new Solution().minPathSum(rows.toArray(new int[0][])));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const grid = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(minPathSum(grid));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[201][201], rows=0, cols=0; char buf[5000];
    while(fgets(buf,sizeof(buf),stdin)){
        if(buf[0]=='\\n')continue; char*p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[rows][j++]=strtol(p,&p,10);} cols=j; rows++;
    }
    int *ptrs[201]; int colSizes[201];
    for(int i=0;i<rows;i++){ptrs[i]=m[i];colSizes[i]=cols;}
    printf("%d\\n",minPathSum((int**)ptrs,rows,colSizes));
    return 0;
}`,
    },
    aiContext: 'Minimum Path Sum — 2D DP O(m*n)',
  },

  // ── 88. Number of Provinces ──────────────────────────────────────────────────
  {
    number: 88, title: 'Number of Provinces', slug: 'number-of-provinces', difficulty: 'Medium',
    tags: ['DFS', 'BFS', 'Union Find', 'Graph'], companies: ['Amazon', 'Bloomberg', 'Facebook'],
    acceptance: 65.5, premium: false,
    description: `There are <code>n</code> cities. Given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if city i and j are directly connected, return the total number of provinces (groups of directly or indirectly connected cities).<br><br>Input: n rows of n space-separated values (0 or 1).`,
    examples: [
      { input: '1 1 0\n1 1 0\n0 0 1', output: '2' },
      { input: '1 0 0\n0 1 0\n0 0 1', output: '3' },
    ],
    constraints: ['1 ≤ n ≤ 200', 'isConnected[i][i] == 1', 'isConnected[i][j] == isConnected[j][i]'],
    testCases: [
      { input: '1 1 0\n1 1 0\n0 0 1', expected: '2', hidden: false },
      { input: '1 0 0\n0 1 0\n0 0 1', expected: '3', hidden: false },
      { input: '1',                   expected: '1', hidden: true  },
      { input: '1 1\n1 1',            expected: '1', hidden: true  },
    ],
    hints: [
      'Use DFS/BFS to traverse connected cities.',
      'Mark visited cities and count connected components.',
      'Or use Union-Find.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int findCircleNum(vector<vector<int>>& isConnected) {

    }
};`,
      python: `class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        `,
      java: `class Solution {
    public int findCircleNum(int[][] isConnected) {

    }
}`,
      javascript: `/**
 * @param {number[][]} isConnected
 * @return {number}
 */
var findCircleNum = function(isConnected) {

};`,
      c: `int findCircleNum(int** isConnected, int isConnectedSize, int* isConnectedColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> grid; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        grid.push_back(row);
    }
    Solution sol;
    cout << sol.findCircleNum(grid) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
isConnected = [list(map(int, l.split())) for l in lines]
print(Solution().findCircleNum(isConnected))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l=sc.nextLine().trim(); if(l.isEmpty())continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        System.out.println(new Solution().findCircleNum(rows.toArray(new int[0][])));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const isConnected = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(findCircleNum(isConnected));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[201][201], n=0; char buf[5000];
    while(fgets(buf,sizeof(buf),stdin)){
        if(buf[0]=='\\n')continue; char*p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[n][j++]=strtol(p,&p,10);} n++;
    }
    int *ptrs[201]; int colSizes[201];
    for(int i=0;i<n;i++){ptrs[i]=m[i];colSizes[i]=n;}
    printf("%d\\n",findCircleNum((int**)ptrs,n,colSizes));
    return 0;
}`,
    },
    aiContext: 'Number of Provinces — DFS connected components O(n²)',
  },

  // ── 89. Rotting Oranges ──────────────────────────────────────────────────────
  {
    number: 89, title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium',
    tags: ['Array', 'BFS', 'Matrix'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 52.9, premium: false,
    description: `You are given an <code>m x n</code> grid where cells can be 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, fresh oranges adjacent to rotten ones become rotten. Return the minimum minutes until no fresh orange remains, or -1 if impossible.<br><br>Input: m rows of n space-separated values.`,
    examples: [
      { input: '2 1 1\n1 1 0\n0 1 1', output: '4' },
      { input: '2 1 1\n0 1 1\n1 0 1', output: '-1' },
      { input: '0 2',                 output: '0'  },
    ],
    constraints: ['1 ≤ m, n ≤ 10', '0 ≤ grid[i][j] ≤ 2'],
    testCases: [
      { input: '2 1 1\n1 1 0\n0 1 1', expected: '4',  hidden: false },
      { input: '2 1 1\n0 1 1\n1 0 1', expected: '-1', hidden: false },
      { input: '0 2',                 expected: '0',  hidden: false },
      { input: '1',                   expected: '-1', hidden: true  },
      { input: '2',                   expected: '0',  hidden: true  },
    ],
    hints: [
      'Multi-source BFS from all rotten oranges simultaneously.',
      'Count fresh oranges initially.',
      'BFS level by level = minutes. Return -1 if fresh oranges remain.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {

    }
};`,
      python: `class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        `,
      java: `class Solution {
    public int orangesRotting(int[][] grid) {

    }
}`,
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {

};`,
      c: `int orangesRotting(int** grid, int gridSize, int* gridColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> grid; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        grid.push_back(row);
    }
    Solution sol;
    cout << sol.orangesRotting(grid) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
grid = [list(map(int, l.split())) for l in lines]
print(Solution().orangesRotting(grid))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l=sc.nextLine().trim(); if(l.isEmpty())continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        System.out.println(new Solution().orangesRotting(rows.toArray(new int[0][])));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const grid = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(orangesRotting(grid));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[11][11], rows=0, cols=0; char buf[500];
    while(fgets(buf,sizeof(buf),stdin)){
        if(buf[0]=='\\n')continue; char*p=buf; int j=0;
        while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}m[rows][j++]=strtol(p,&p,10);} cols=j; rows++;
    }
    int *ptrs[11]; int colSizes[11];
    for(int i=0;i<rows;i++){ptrs[i]=m[i];colSizes[i]=cols;}
    printf("%d\\n",orangesRotting((int**)ptrs,rows,colSizes));
    return 0;
}`,
    },
    aiContext: 'Rotting Oranges — multi-source BFS O(m*n)',
  },

  // ── 90. Generate Parentheses ─────────────────────────────────────────────────
  {
    number: 90, title: 'Generate Parentheses', slug: 'generate-parentheses', difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Backtracking'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 73.2, premium: false,
    description: `Given <code>n</code> pairs of parentheses, generate all combinations of well-formed parentheses. Print each combination on a separate line in lexicographic order.`,
    examples: [
      { input: 'n = 3', output: '((()))\n(()())\n(())()\n()(())\n()()()' },
      { input: 'n = 1', output: '()' },
    ],
    constraints: ['1 ≤ n ≤ 8'],
    testCases: [
      { input: '3', expected: '((()))\n(()())\n(())()\n()(())\n()()()', hidden: false },
      { input: '1', expected: '()',                                      hidden: false },
      { input: '2', expected: '(())\n()()',                              hidden: true  },
    ],
    hints: [
      'Backtrack: add "(" if open count < n.',
      'Add ")" if close count < open count.',
      'Base case: string length == 2*n.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<string> generateParenthesis(int n) {

    }
};`,
      python: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        `,
      java: `class Solution {
    public List<String> generateParenthesis(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {

};`,
      c: `char** generateParenthesis(int n, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    vector<string> res = sol.generateParenthesis(n);
    sort(res.begin(), res.end());
    for (auto& s : res) cout << s << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
res = sorted(Solution().generateParenthesis(n))
for s in res: print(s)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        List<String> res = new Solution().generateParenthesis(n);
        Collections.sort(res);
        for (String s : res) System.out.println(s);
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

const res = generateParenthesis(n).sort();
for (const s of res) console.log(s);`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int cmpStr(const void*a,const void*b){return strcmp(*(char**)a,*(char**)b);}
int main() {
    int n; scanf("%d",&n);
    int retSize;
    char **res = generateParenthesis(n, &retSize);
    qsort(res, retSize, sizeof(char*), cmpStr);
    for (int i=0;i<retSize;i++) printf("%s\\n",res[i]);
    return 0;
}`,
    },
    aiContext: 'Generate Parentheses — backtracking O(4^n/sqrt(n))',
  },


  // ── PROBLEMS 91–100 ───────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 91. Pascal's Triangle ────────────────────────────────────────────────────
  {
    number: 91, title: "Pascal's Triangle", slug: 'pascals-triangle', difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'Apple', 'Adobe'],
    acceptance: 70.6, premium: false,
    description: `Given an integer <code>numRows</code>, return the first <code>numRows</code> of Pascal's triangle. Print each row space-separated on a new line.`,
    examples: [
      { input: 'numRows = 5', output: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1' },
      { input: 'numRows = 1', output: '1' },
    ],
    constraints: ['1 ≤ numRows ≤ 30'],
    testCases: [
      { input: '5', expected: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1', hidden: false },
      { input: '1', expected: '1',                                   hidden: false },
      { input: '3', expected: '1\n1 1\n1 2 1',                      hidden: true  },
      { input: '6', expected: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1', hidden: true },
    ],
    hints: [
      'Each row starts and ends with 1.',
      'Inner elements: triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j].',
      'Build row by row.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> generate(int numRows) {

    }
};`,
      python: `class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> generate(int numRows) {

    }
}`,
      javascript: `/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {

};`,
      c: `int** generate(int numRows, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    auto res = sol.generate(n);
    for (auto& row : res) {
        for (int i=0;i<(int)row.size();i++) cout<<(i?" ":"")<<row[i];
        cout<<"\\n";
    }
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
for row in Solution().generate(n):
    print(*row)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        for (List<Integer> row : new Solution().generate(n)) {
            StringBuilder sb = new StringBuilder();
            for (int i=0;i<row.size();i++) sb.append(i>0?" ":"").append(row.get(i));
            System.out.println(sb);
        }
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

for (const row of generate(n)) console.log(row.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int n; scanf("%d",&n);
    int retSize; int *retColSizes;
    int **res = generate(n, &retSize, &retColSizes);
    for (int i=0;i<retSize;i++) {
        for (int j=0;j<retColSizes[i];j++) printf("%s%d",j?" ":"",res[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    },
    aiContext: "Pascal's Triangle — DP row by row O(n²)",
  },

  // ── 92. Best Time to Buy and Sell Stock II ────────────────────────────────────
  {
    number: 92, title: 'Best Time to Buy and Sell Stock II', slug: 'best-time-to-buy-and-sell-stock-ii', difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Greedy'], companies: ['Amazon', 'Bloomberg', 'Facebook'],
    acceptance: 65.2, premium: false,
    description: `Given an array <code>prices</code> where <code>prices[i]</code> is the price on day <code>i</code>, return the maximum profit from as many transactions as you like (but you can only hold one stock at a time).`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '7',  explanation: 'Buy day 2 sell day 3 (4), buy day 4 sell day 5 (3) = 7' },
      { input: 'prices = [1,2,3,4,5]',   output: '4',  explanation: 'Buy day 1, sell day 5' },
      { input: 'prices = [7,6,4,3,1]',   output: '0',  explanation: 'No profit possible' },
    ],
    constraints: ['1 ≤ prices.length ≤ 3×10⁴', '0 ≤ prices[i] ≤ 10⁴'],
    testCases: [
      { input: '7 1 5 3 6 4', expected: '7', hidden: false },
      { input: '1 2 3 4 5',   expected: '4', hidden: false },
      { input: '7 6 4 3 1',   expected: '0', hidden: false },
      { input: '1 2',         expected: '1', hidden: true  },
      { input: '2 1 4',       expected: '3', hidden: true  },
    ],
    hints: [
      'Greedy: collect every upward slope.',
      'If prices[i] > prices[i-1], add the difference to profit.',
      'This is equivalent to buying and selling every consecutive profitable pair.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {

    }
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
      java: `class Solution {
    public int maxProfit(int[] prices) {

    }
}`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {

};`,
      c: `int maxProfit(int* prices, int pricesSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> prices; int x;
    while (cin>>x) prices.push_back(x);
    Solution sol;
    cout << sol.maxProfit(prices) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

prices = list(map(int, sys.stdin.read().split()))
print(Solution().maxProfit(prices))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] prices = list.stream().mapToInt(i->i).toArray();
        System.out.println(new Solution().maxProfit(prices));
    }
}`,
      javascript: `const prices = require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(maxProfit(prices));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int p[30001],n=0;
    while(scanf("%d",&p[n])==1) n++;
    printf("%d\\n",maxProfit(p,n));
    return 0;
}`,
    },
    aiContext: 'Best Time to Buy and Sell Stock II — greedy collect every gain O(n)',
  },

  // ── 93. Add Two Numbers ──────────────────────────────────────────────────────
  {
    number: 93, title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'Medium',
    tags: ['Linked List', 'Math', 'Recursion'], companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    acceptance: 43.0, premium: false,
    description: `You are given two non-empty linked lists representing non-negative integers stored in reverse order. Add the two numbers and return the sum as a linked list.<br><br>First line: digits of l1 (space-separated, already in reverse). Second line: digits of l2. Print sum digits space-separated (in reverse order).`,
    examples: [
      { input: '2 4 3\n5 6 4',  output: '7 0 8',  explanation: '342 + 465 = 807, stored as 7→0→8' },
      { input: '0\n0',          output: '0'        },
      { input: '9 9 9 9 9 9 9\n9 9 9 9', output: '8 9 9 9 0 0 0 1' },
    ],
    constraints: ['1 ≤ l1.length, l2.length ≤ 100', '0 ≤ Node.val ≤ 9', 'No leading zeros except number 0'],
    testCases: [
      { input: '2 4 3\n5 6 4',           expected: '7 0 8',           hidden: false },
      { input: '0\n0',                   expected: '0',               hidden: false },
      { input: '9 9 9 9 9 9 9\n9 9 9 9', expected: '8 9 9 9 0 0 0 1', hidden: false },
      { input: '1\n9 9',                 expected: '0 0 1',           hidden: true  },
    ],
    hints: [
      'Simulate addition digit by digit with a carry.',
      'Advance both lists simultaneously.',
      'Continue if carry remains after both lists are exhausted.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        `,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode { int val; ListNode *next; ListNode(int x):val(x),next(nullptr){} };

ListNode* makeList(string& line) {
    istringstream ss(line); vector<int> v; int x;
    while(ss>>x) v.push_back(x);
    if(v.empty()) return nullptr;
    ListNode *h=new ListNode(v[0]),*c=h;
    for(int i=1;i<(int)v.size();i++){c->next=new ListNode(v[i]);c=c->next;}
    return h;
}

__USER_CODE__

int main() {
    string l1s,l2s; getline(cin,l1s); getline(cin,l2s);
    ListNode *res=Solution().addTwoNumbers(makeList(l1s),makeList(l2s));
    bool first=true;
    while(res){if(!first)cout<<" ";cout<<res->val;res=res->next;first=false;}
    cout<<endl; return 0;
}`,
      python: `from typing import Optional
import sys

class ListNode:
    def __init__(self,val=0,next=None): self.val=val;self.next=next

def makeList(line):
    vals=list(map(int,line.split())) if line.strip() else []
    if not vals: return None
    h=ListNode(vals[0]);c=h
    for v in vals[1:]: c.next=ListNode(v);c=c.next
    return h

__USER_CODE__

lines=sys.stdin.read().split('\\n')
l1=makeList(lines[0]);l2=makeList(lines[1] if len(lines)>1 else '')
res=Solution().addTwoNumbers(l1,l2)
out=[]
while res: out.append(str(res.val));res=res.next
print(' '.join(out))`,
      java: `import java.util.*;

class ListNode { int val; ListNode next; ListNode(int v){val=v;} }

__USER_CODE__

public class Main {
    static ListNode makeList(String line){
        if(line==null||line.trim().isEmpty()) return null;
        String[]parts=line.trim().split(" ");
        ListNode h=new ListNode(Integer.parseInt(parts[0])),c=h;
        for(int i=1;i<parts.length;i++){c.next=new ListNode(Integer.parseInt(parts[i]));c=c.next;}
        return h;
    }
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        String l1s=sc.hasNextLine()?sc.nextLine():"";
        String l2s=sc.hasNextLine()?sc.nextLine():"";
        ListNode res=new Solution().addTwoNumbers(makeList(l1s),makeList(l2s));
        StringBuilder sb=new StringBuilder();
        while(res!=null){if(sb.length()>0)sb.append(" ");sb.append(res.val);res=res.next;}
        System.out.println(sb);
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
function ListNode(val,next){this.val=val??0;this.next=next??null;}
function makeList(line){
    const vals=line&&line.trim()?line.trim().split(' ').map(Number):[];
    if(!vals.length)return null;
    const h=new ListNode(vals[0]);let c=h;
    for(let i=1;i<vals.length;i++){c.next=new ListNode(vals[i]);c=c.next;}
    return h;
}

__USER_CODE__

let res=addTwoNumbers(makeList(lines[0]||''),makeList(lines[1]||''));
const out=[];while(res){out.push(res.val);res=res.next;}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct ListNode{int val;struct ListNode*next;};
struct ListNode*newNode(int v){struct ListNode*n=malloc(sizeof(struct ListNode));n->val=v;n->next=NULL;return n;}
struct ListNode*makeList(char*buf){
    struct ListNode*h=NULL,**t=&h;char*p=buf;
    while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}*t=newNode(strtol(p,&p,10));t=&(*t)->next;}
    return h;
}

__USER_CODE__

int main(){
    char b1[500],b2[500];
    fgets(b1,sizeof(b1),stdin);fgets(b2,sizeof(b2),stdin);
    struct ListNode*res=addTwoNumbers(makeList(b1),makeList(b2));
    int first=1;
    while(res){if(!first)printf(" ");printf("%d",res->val);res=res->next;first=0;}
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Add Two Numbers — linked list carry simulation O(max(m,n))',
  },



  // ── 95. Minimum Window Substring ─────────────────────────────────────────────
  {
    number: 95, title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Facebook', 'LinkedIn', 'Snapchat'],
    acceptance: 40.9, premium: false,
    description: `Given strings <code>s</code> and <code>t</code>, return the minimum window substring of <code>s</code> such that every character in <code>t</code> is included. Return empty string if no such window exists.<br><br>First line: s. Second line: t.`,
    examples: [
      { input: 'ADOBECODEBANC\nABC', output: 'BANC',  explanation: 'Minimum window containing A, B, C' },
      { input: 'a\na',              output: 'a'       },
      { input: 'a\naa',             output: '',       explanation: 'Not enough As' },
    ],
    constraints: ['1 ≤ s.length, t.length ≤ 10⁵', 's and t consist of uppercase and lowercase English letters'],
    testCases: [
      { input: 'ADOBECODEBANC\nABC', expected: 'BANC', hidden: false },
      { input: 'a\na',              expected: 'a',     hidden: false },
      { input: 'a\naa',             expected: '',      hidden: false },
      { input: 'ab\nb',             expected: 'b',     hidden: true  },
      { input: 'bba\nab',           expected: 'ba',    hidden: true  },
    ],
    hints: [
      'Use sliding window with two pointers.',
      'Expand right to include all chars of t, then shrink left.',
      'Track character counts with a hash map.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string minWindow(string s, string t) {

    }
};`,
      python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,
      java: `class Solution {
    public String minWindow(String s, String t) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {

};`,
      c: `char* minWindow(char* s, char* t) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    string s,t; getline(cin,s); getline(cin,t);
    Solution sol; cout<<sol.minWindow(s,t)<<endl; return 0;
}`,
      python: `import sys

__USER_CODE__

lines=sys.stdin.read().split('\\n')
s=lines[0];t=lines[1] if len(lines)>1 else ''
print(Solution().minWindow(s,t))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        String s=sc.nextLine(),t=sc.nextLine();
        System.out.println(new Solution().minWindow(s,t));
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const s=lines[0],t=lines[1]||'';

__USER_CODE__

console.log(minWindow(s,t));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main(){
    char s[100001],t[100001];
    fgets(s,sizeof(s),stdin);fgets(t,sizeof(t),stdin);
    int ns=strlen(s),nt=strlen(t);
    if(s[ns-1]=='\\n')s[--ns]='\\0';
    if(t[nt-1]=='\\n')t[--nt]='\\0';
    printf("%s\\n",minWindow(s,t));
    return 0;
}`,
    },
    aiContext: 'Minimum Window Substring — sliding window O(n)',
  },

  // ── 96. Subarray Sum Equals K ────────────────────────────────────────────────
  {
    number: 96, title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Prefix Sum'], companies: ['Facebook', 'Google', 'Amazon'],
    acceptance: 43.7, premium: false,
    description: `Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>.<br><br>First line: space-separated nums. Second line: k.`,
    examples: [
      { input: '1 1 1\n2', output: '2' },
      { input: '1 2 3\n3', output: '2' },
    ],
    constraints: ['1 ≤ nums.length ≤ 2×10⁴', '-1000 ≤ nums[i] ≤ 1000', '-10⁷ ≤ k ≤ 10⁷'],
    testCases: [
      { input: '1 1 1\n2', expected: '2', hidden: false },
      { input: '1 2 3\n3', expected: '2', hidden: false },
      { input: '1\n1',     expected: '1', hidden: true  },
      { input: '-1 -1 1\n0', expected: '1', hidden: true },
    ],
    hints: [
      'Use prefix sums and a hash map.',
      'For each prefix sum, check how many previous prefix sums differ by k.',
      'This gives O(n) time.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        `,
      java: `class Solution {
    public int subarraySum(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {

};`,
      c: `int subarraySum(int* nums, int numsSize, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    string line; getline(cin,line);
    istringstream ss(line); vector<int>nums; int x;
    while(ss>>x) nums.push_back(x);
    int k; cin>>k;
    Solution sol; cout<<sol.subarraySum(nums,k)<<endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines=sys.stdin.read().split('\\n')
nums=list(map(int,lines[0].split()))
k=int(lines[1].strip())
print(Solution().subarraySum(nums,k))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int[]nums=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k=sc.nextInt();
        System.out.println(new Solution().subarraySum(nums,k));
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums=lines[0].split(' ').map(Number);
const k=parseInt(lines[1]);

__USER_CODE__

console.log(subarraySum(nums,k));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    int nums[20001],n=0,k;
    char buf[500000]; fgets(buf,sizeof(buf),stdin);
    char*p=buf; while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}nums[n++]=strtol(p,&p,10);}
    scanf("%d",&k);
    printf("%d\\n",subarraySum(nums,n,k)); return 0;
}`,
    },
    aiContext: 'Subarray Sum Equals K — prefix sum + hash map O(n)',
  },

  // ── 97. Maximum Depth of N-ary Tree ──────────────────────────────────────────
  {
    number: 97, title: 'Maximum Depth of N-ary Tree', slug: 'maximum-depth-of-n-ary-tree', difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'], companies: ['Facebook', 'Amazon', 'LinkedIn'],
    acceptance: 70.0, premium: false,
    description: `Given an N-ary tree root serialized as level-order (space-separated values with <code>null</code> for separator between children groups), return its maximum depth.<br><br>Input format: level-order with null separating children groups of each node.`,
    examples: [
      { input: '1 null 3 2 4 null 5 6', output: '3' },
      { input: '1 null 2 3 4 5 null null 6 7 null 8 null 9 10 null null 11 null 12 null 13 null null 14', output: '5' },
    ],
    constraints: ['0 ≤ depth ≤ 1000', '0 ≤ number of nodes ≤ 10⁴'],
    testCases: [
      { input: '1 null 3 2 4 null 5 6', expected: '3', hidden: false },
      { input: '1 null 2 3 4 5 null null 6 7 null 8 null 9 10 null null 11 null 12 null 13 null null 14', expected: '5', hidden: false },
      { input: '1',               expected: '1', hidden: true },
      { input: '1 null 2',        expected: '2', hidden: true },
    ],
    hints: [
      'DFS: depth = 1 + max depth of all children.',
      'BFS: count levels.',
      'Handle empty tree (depth = 0).',
    ],
    starter: {
      cpp: `/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;
    Node() {}
    Node(int _val) { val = _val; }
    Node(int _val, vector<Node*> _children) { val = _val; children = _children; }
};
*/
class Solution {
public:
    int maxDepth(Node* root) {

    }
};`,
      python: `"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""
class Solution:
    def maxDepth(self, root: 'Node') -> int:
        `,
      java: `/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;
    public Node() {}
    public Node(int _val) { val = _val; }
    public Node(int _val, List<Node> _children) { val = _val; children = _children; }
}
*/
class Solution {
    public int maxDepth(Node root) {

    }
}`,
      javascript: `/**
 * // Definition for a Node.
 * function Node(val, children) {
 *     this.val = val;
 *     this.children = children;
 * };
 */
/**
 * @param {Node|null} root
 * @return {number}
 */
var maxDepth = function(root) {

};`,
      c: `/*
struct Node {
    int val;
    int numChildren;
    struct Node** children;
};
*/
int maxDepth(struct Node* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int val; vector<Node*> children;
    Node(int v):val(v){}
};

Node* buildNary(vector<string>&v){
    if(v.empty()||v[0]=="null")return nullptr;
    Node*root=new Node(stoi(v[0]));
    queue<Node*>q; q.push(root);
    int i=2; // skip first null separator
    while(!q.empty()&&i<(int)v.size()){
        Node*node=q.front();q.pop();
        while(i<(int)v.size()&&v[i]!="null"){
            Node*child=new Node(stoi(v[i++]));
            node->children.push_back(child);
            q.push(child);
        }
        i++; // skip null
    }
    return root;
}

__USER_CODE__

int main(){
    vector<string>vals;string s;
    while(cin>>s) vals.push_back(s);
    Node*root=buildNary(vals);
    Solution sol; cout<<sol.maxDepth(root)<<endl; return 0;
}`,
      python: `import sys
from collections import deque

class Node:
    def __init__(self,val=None,children=None):
        self.val=val;self.children=children or []

def buildNary(vals):
    if not vals or vals[0]=='null':return None
    root=Node(int(vals[0]));q=deque([root]);i=2
    while q and i<len(vals):
        node=q.popleft()
        while i<len(vals) and vals[i]!='null':
            child=Node(int(vals[i]));node.children.append(child);q.append(child);i+=1
        i+=1
    return root

__USER_CODE__

vals=sys.stdin.read().split()
print(Solution().maxDepth(buildNary(vals)))`,
      java: `import java.util.*;

class Node {
    int val; List<Node> children;
    Node(int v){val=v;children=new ArrayList<>();}
}

__USER_CODE__

public class Main {
    static Node buildNary(String[]vals){
        if(vals.length==0||vals[0].equals("null"))return null;
        Node root=new Node(Integer.parseInt(vals[0]));
        Queue<Node>q=new LinkedList<>();q.add(root);int i=2;
        while(!q.isEmpty()&&i<vals.length){
            Node node=q.poll();
            while(i<vals.length&&!vals[i].equals("null")){
                Node child=new Node(Integer.parseInt(vals[i++]));
                node.children.add(child);q.add(child);
            }
            i++;
        }
        return root;
    }
    public static void main(String[]args){
        String[]vals=new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        System.out.println(new Solution().maxDepth(buildNary(vals)));
    }
}`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);

function Node(val,children){this.val=val;this.children=children||[];}

function buildNary(vals){
    if(!vals.length||vals[0]==='null')return null;
    const root=new Node(+vals[0]);const q=[root];let i=2;
    while(q.length&&i<vals.length){
        const node=q.shift();
        while(i<vals.length&&vals[i]!=='null'){
            const child=new Node(+vals[i++]);node.children.push(child);q.push(child);
        }
        i++;
    }
    return root;
}

__USER_CODE__

console.log(maxDepth(buildNary(vals)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node{int val;int numChildren;struct Node**children;};
struct Node*newNode(int v){struct Node*n=malloc(sizeof(struct Node));n->val=v;n->numChildren=0;n->children=malloc(100*sizeof(struct Node*));return n;}

int maxDepthHelper(struct Node*root){
    if(!root)return 0;
    int maxD=0;
    for(int i=0;i<root->numChildren;i++){int d=maxDepthHelper(root->children[i]);if(d>maxD)maxD=d;}
    return 1+maxD;
}

int maxDepth(struct Node*root){return maxDepthHelper(root);}

int main(){
    char toks[10000][20];int tc=0;while(scanf("%s",toks[tc])==1)tc++;
    if(tc==0||strcmp(toks[0],"null")==0){printf("0\\n");return 0;}
    struct Node*root=newNode(atoi(toks[0]));
    struct Node*q[10000];int head=0,tail=0;q[tail++]=root;int i=2;
    while(head<tail&&i<tc){
        struct Node*node=q[head++];
        while(i<tc&&strcmp(toks[i],"null")!=0){
            struct Node*child=newNode(atoi(toks[i++]));
            node->children[node->numChildren++]=child;q[tail++]=child;
        }
        i++;
    }
    printf("%d\\n",maxDepth(root));return 0;
}`,
    },
    aiContext: 'Maximum Depth of N-ary Tree — DFS O(n)',
  },

  // ── 98. Increasing Order Search Tree ─────────────────────────────────────────
  {
    number: 98, title: 'Increasing Order Search Tree', slug: 'increasing-order-search-tree', difficulty: 'Easy',
    tags: ['Stack', 'Tree', 'DFS', 'Binary Search Tree'], companies: ['Amazon', 'Google'],
    acceptance: 77.8, premium: false,
    description: `Given a binary search tree in level-order (space-separated, use <code>null</code> for missing), rearrange the tree to a right-skewed tree where nodes appear in increasing order. Print the in-order values space-separated.`,
    examples: [
      { input: '5 3 6 2 4 null 8 1 null null null null null 7 9', output: '1 2 3 4 5 6 7 8 9' },
      { input: '5 1 7', output: '1 5 7' },
    ],
    constraints: ['1 ≤ number of nodes ≤ 100', '0 ≤ Node.val ≤ 1000'],
    testCases: [
      { input: '5 3 6 2 4 null 8 1 null null null null null 7 9', expected: '1 2 3 4 5 6 7 8 9', hidden: false },
      { input: '5 1 7',                                           expected: '1 5 7',             hidden: false },
      { input: '1',                                               expected: '1',                  hidden: true  },
      { input: '3 1 4',                                           expected: '1 3 4',             hidden: true  },
    ],
    hints: [
      'In-order traversal gives sorted values.',
      'Build a new right-skewed tree during traversal.',
      'Use a dummy head and a cur pointer.',
    ],
    starter: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */
class Solution {
public:
    TreeNode* increasingBST(TreeNode* root) {

    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def increasingBST(self, root: TreeNode) -> TreeNode:
        `,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public TreeNode increasingBST(TreeNode root) {

    }
}`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var increasingBST = function(root) {

};`,
      c: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* increasingBST(struct TreeNode* root) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

TreeNode*build(vector<string>&v,int i){
    if(i>=(int)v.size()||v[i]=="null")return nullptr;
    TreeNode*n=new TreeNode(stoi(v[i]));n->left=build(v,2*i+1);n->right=build(v,2*i+2);return n;
}

__USER_CODE__

int main(){
    vector<string>vals;string s;while(cin>>s)vals.push_back(s);
    TreeNode*root=vals.empty()||vals[0]=="null"?nullptr:build(vals,0);
    Solution sol; TreeNode*res=sol.increasingBST(root);
    bool first=true;
    while(res){if(!first)cout<<" ";cout<<res->val;res=res->right;first=false;}
    cout<<endl;return 0;
}`,
      python: `from collections import deque
import sys

class TreeNode:
    def __init__(self,val=0,left=None,right=None):self.val=val;self.left=left;self.right=right

def build(vals):
    if not vals or vals[0]=='null':return None
    root=TreeNode(int(vals[0]));q=deque([root]);i=1
    while q and i<len(vals):
        node=q.popleft()
        if i<len(vals) and vals[i]!='null':node.left=TreeNode(int(vals[i]));q.append(node.left)
        i+=1
        if i<len(vals) and vals[i]!='null':node.right=TreeNode(int(vals[i]));q.append(node.right)
        i+=1
    return root

__USER_CODE__

vals=sys.stdin.read().split()
res=Solution().increasingBST(build(vals))
out=[]
while res:out.append(str(res.val));res=res.right
print(' '.join(out))`,
      java: `import java.util.*;

class TreeNode{int val;TreeNode left,right;TreeNode(int v){val=v;}}

__USER_CODE__

public class Main{
    static TreeNode build(String[]v,int i){
        if(i>=v.length||v[i].equals("null"))return null;
        TreeNode n=new TreeNode(Integer.parseInt(v[i]));n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;
    }
    public static void main(String[]args){
        String[]vals=new Scanner(System.in).useDelimiter("\\\\s+").tokens().toArray(String[]::new);
        TreeNode root=vals.length==0||vals[0].equals("null")?null:build(vals,0);
        TreeNode res=new Solution().increasingBST(root);
        StringBuilder sb=new StringBuilder();
        while(res!=null){if(sb.length()>0)sb.append(" ");sb.append(res.val);res=res.right;}
        System.out.println(sb);
    }
}`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/);
function TreeNode(val,left,right){this.val=val??0;this.left=left??null;this.right=right??null;}
function build(v,i=0){if(i>=v.length||v[i]==='null')return null;const n=new TreeNode(+v[i]);n.left=build(v,2*i+1);n.right=build(v,2*i+2);return n;}

__USER_CODE__

let res=increasingBST(!vals.length||vals[0]==='null'?null:build(vals));
const out=[];while(res){out.push(res.val);res=res.right;}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct TreeNode{int val;struct TreeNode*left,*right;};
struct TreeNode*newNode(int v){struct TreeNode*n=malloc(sizeof(struct TreeNode));n->val=v;n->left=n->right=NULL;return n;}
struct TreeNode*build(char t[][20],int n,int i){
    if(i>=n||strcmp(t[i],"null")==0)return NULL;
    struct TreeNode*node=newNode(atoi(t[i]));node->left=build(t,n,2*i+1);node->right=build(t,n,2*i+2);return node;
}

__USER_CODE__

int main(){
    char toks[10000][20];int tc=0;while(scanf("%s",toks[tc])==1)tc++;
    struct TreeNode*root=(tc==0||strcmp(toks[0],"null")==0)?NULL:build(toks,tc,0);
    struct TreeNode*res=increasingBST(root);
    int first=1;while(res){if(!first)printf(" ");printf("%d",res->val);res=res->right;first=0;}
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Increasing Order Search Tree — in-order traversal O(n)',
  },

  // ── 99. Remove Nth Node From End of List ─────────────────────────────────────
  {
    number: 99, title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'], companies: ['Facebook', 'Amazon', 'Microsoft'],
    acceptance: 42.4, premium: false,
    description: `Given the head of a linked list (space-separated integers) and <code>n</code>, remove the nth node from the end of the list and return the result.<br><br>First line: list values. Second line: n.`,
    examples: [
      { input: '1 2 3 4 5\n2', output: '1 2 3 5' },
      { input: '1\n1',         output: ''          },
      { input: '1 2\n1',       output: '1'          },
    ],
    constraints: ['1 ≤ sz ≤ 30', '0 ≤ Node.val ≤ 100', '1 ≤ n ≤ sz'],
    testCases: [
      { input: '1 2 3 4 5\n2', expected: '1 2 3 5', hidden: false },
      { input: '1\n1',         expected: '',          hidden: false },
      { input: '1 2\n1',       expected: '1',         hidden: true  },
      { input: '1 2 3\n3',     expected: '2 3',       hidden: true  },
    ],
    hints: [
      'Use two pointers separated by n nodes.',
      'When fast reaches end, slow is at the node before the target.',
      'Use a dummy head to handle edge cases.',
    ],
    starter: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {

    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        `,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {

    }
}`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {

};`,
      c: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* removeNthFromEnd(struct ListNode* head, int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

__USER_CODE__

int main(){
    string line; getline(cin,line);
    istringstream ss(line);vector<int>vals;int x;while(ss>>x)vals.push_back(x);
    int n;cin>>n;
    if(vals.empty()){cout<<endl;return 0;}
    ListNode*head=new ListNode(vals[0]),*cur=head;
    for(int i=1;i<(int)vals.size();i++){cur->next=new ListNode(vals[i]);cur=cur->next;}
    ListNode*res=Solution().removeNthFromEnd(head,n);
    bool first=true;
    while(res){if(!first)cout<<" ";cout<<res->val;res=res->next;first=false;}
    cout<<endl;return 0;
}`,
      python: `from typing import Optional
import sys

class ListNode:
    def __init__(self,val=0,next=None):self.val=val;self.next=next

__USER_CODE__

lines=sys.stdin.read().split('\\n')
vals=list(map(int,lines[0].split())) if lines[0].strip() else []
n=int(lines[1].strip())
if not vals:print('');exit()
head=ListNode(vals[0]);cur=head
for v in vals[1:]:cur.next=ListNode(v);cur=cur.next
res=Solution().removeNthFromEnd(head,n)
out=[]
while res:out.append(str(res.val));res=res.next
print(' '.join(out))`,
      java: `import java.util.*;

class ListNode{int val;ListNode next;ListNode(int v){val=v;}}

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        String line=sc.nextLine().trim();
        int n=sc.nextInt();
        if(line.isEmpty()){System.out.println();return;}
        String[]parts=line.split(" ");
        ListNode head=new ListNode(Integer.parseInt(parts[0])),cur=head;
        for(int i=1;i<parts.length;i++){cur.next=new ListNode(Integer.parseInt(parts[i]));cur=cur.next;}
        ListNode res=new Solution().removeNthFromEnd(head,n);
        StringBuilder sb=new StringBuilder();
        while(res!=null){if(sb.length()>0)sb.append(" ");sb.append(res.val);res=res.next;}
        System.out.println(sb);
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const vals=lines[0]&&lines[0].trim()?lines[0].trim().split(' ').map(Number):[];
const n=parseInt(lines[1]);

function ListNode(val,next){this.val=val??0;this.next=next??null;}

__USER_CODE__

if(!vals.length){console.log('');process.exit(0);}
let head=new ListNode(vals[0]),cur=head;
for(let i=1;i<vals.length;i++){cur.next=new ListNode(vals[i]);cur=cur.next;}
let res=removeNthFromEnd(head,n);
const out=[];while(res){out.push(res.val);res=res.next;}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct ListNode{int val;struct ListNode*next;};
struct ListNode*newNode(int v){struct ListNode*n=malloc(sizeof(struct ListNode));n->val=v;n->next=NULL;return n;}

__USER_CODE__

int main(){
    int vals[31],nv=0,n;
    char buf[500];fgets(buf,sizeof(buf),stdin);
    char*p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}vals[nv++]=strtol(p,&p,10);}
    scanf("%d",&n);
    if(!nv){printf("\\n");return 0;}
    struct ListNode*nodes=malloc(nv*sizeof(struct ListNode));
    for(int i=0;i<nv;i++){nodes[i].val=vals[i];nodes[i].next=i+1<nv?&nodes[i+1]:NULL;}
    struct ListNode*res=removeNthFromEnd(&nodes[0],n);
    int first=1;while(res){if(!first)printf(" ");printf("%d",res->val);res=res->next;first=0;}
    printf("\\n");free(nodes);return 0;
}`,
    },
    aiContext: 'Remove Nth Node From End — two pointers O(n)',
  },



  // ── PROBLEMS 101–110 ──────────────────────────────────────────────────────────
// Each problem has starter (function signature) + codeWrapper (__USER_CODE__)

  // ── 101. Delete Node in a Linked List ────────────────────────────────────────
  {
    number: 101, title: 'Delete Node in a Linked List', slug: 'delete-node-in-a-linked-list', difficulty: 'Medium',
    tags: ['Linked List'], companies: ['Adobe', 'Amazon', 'Microsoft'],
    acceptance: 76.5, premium: false,
    description: `Given access to a node in a singly-linked list (not the tail), delete that node in-place.<br><br>Input: space-separated list, then target value. Output: resulting list.`,
    examples: [
      { input: '4 5 1 9\n5', output: '4 1 9' },
      { input: '4 5 1 9\n1', output: '4 5 9' },
    ],
    constraints: ['2 ≤ list size ≤ 1000', 'Node to delete is not the tail'],
    testCases: [
      { input: '4 5 1 9\n5', expected: '4 1 9', hidden: false },
      { input: '4 5 1 9\n1', expected: '4 5 9', hidden: false },
      { input: '1 2 3 4\n2', expected: '1 3 4', hidden: true  },
      { input: '0 1\n0',     expected: '1',     hidden: true  },
    ],
    hints: [
      'Copy the value of the next node into the current node.',
      'Skip the next node by updating the pointer.',
    ],
    starter: {
      cpp: `/**
 * struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };
 */
class Solution {
public:
    void deleteNode(ListNode* node) {

    }
};`,
      python: `class Solution:
    def deleteNode(self, node):
        `,
      java: `class Solution {
    public void deleteNode(ListNode node) {

    }
}`,
      javascript: `var deleteNode = function(node) {

};`,
      c: `void deleteNode(struct ListNode* node) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

__USER_CODE__

int main(){
    string line;getline(cin,line);
    istringstream ss(line);vector<int>v;int x;while(ss>>x)v.push_back(x);
    int target;cin>>target;
    ListNode*head=new ListNode(v[0]),*cur=head;
    for(int i=1;i<(int)v.size();i++){cur->next=new ListNode(v[i]);cur=cur->next;}
    cur=head;while(cur&&cur->next){if(cur->val==target){Solution().deleteNode(cur);break;}cur=cur->next;}
    bool first=true;cur=head;while(cur){if(!first)cout<<" ";cout<<cur->val;cur=cur->next;first=false;}
    cout<<endl;return 0;
}`,
      python: `import sys
class ListNode:
    def __init__(self,x):self.val=x;self.next=None

__USER_CODE__

lines=sys.stdin.read().split('\\n')
v=list(map(int,lines[0].split()));target=int(lines[1].strip())
head=ListNode(v[0]);cur=head
for val in v[1:]:cur.next=ListNode(val);cur=cur.next
cur=head
while cur and cur.next:
    if cur.val==target:Solution().deleteNode(cur);break
    cur=cur.next
out=[];cur=head
while cur:out.append(str(cur.val));cur=cur.next
print(' '.join(out))`,
      java: `import java.util.*;
class ListNode{int val;ListNode next;ListNode(int x){val=x;}}

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int[]v=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int target=sc.nextInt();
        ListNode head=new ListNode(v[0]),cur=head;
        for(int i=1;i<v.length;i++){cur.next=new ListNode(v[i]);cur=cur.next;}
        cur=head;while(cur!=null&&cur.next!=null){if(cur.val==target){new Solution().deleteNode(cur);break;}cur=cur.next;}
        StringBuilder sb=new StringBuilder();cur=head;
        while(cur!=null){if(sb.length()>0)sb.append(" ");sb.append(cur.val);cur=cur.next;}
        System.out.println(sb);
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const v=lines[0].trim().split(' ').map(Number),target=parseInt(lines[1]);
function ListNode(val){this.val=val;this.next=null;}

__USER_CODE__

let head=new ListNode(v[0]),cur=head;
for(let i=1;i<v.length;i++){cur.next=new ListNode(v[i]);cur=cur.next;}
cur=head;while(cur&&cur.next){if(cur.val===target){deleteNode(cur);break;}cur=cur.next;}
const out=[];cur=head;while(cur){out.push(cur.val);cur=cur.next;}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
struct ListNode{int val;struct ListNode*next;};

__USER_CODE__

int main(){
    int v[1001],nv=0,target;
    char buf[10000];fgets(buf,sizeof(buf),stdin);
    char*p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}v[nv++]=strtol(p,&p,10);}
    scanf("%d",&target);
    struct ListNode*nodes=malloc(nv*sizeof(struct ListNode));
    for(int i=0;i<nv;i++){nodes[i].val=v[i];nodes[i].next=i+1<nv?&nodes[i+1]:NULL;}
    for(int i=0;i<nv;i++){if(nodes[i].val==target&&nodes[i].next){deleteNode(&nodes[i]);break;}}
    int first=1;struct ListNode*cur=&nodes[0];
    while(cur){if(!first)printf(" ");printf("%d",cur->val);cur=cur->next;first=0;}
    printf("\\n");free(nodes);return 0;
}`,
    },
    aiContext: 'Delete Node in Linked List — copy-next-delete O(1)',
  },

  // ── 102. Find Peak Element ────────────────────────────────────────────────────
  {
    number: 102, title: 'Find Peak Element', slug: 'find-peak-element', difficulty: 'Medium',
    tags: ['Array', 'Binary Search'], companies: ['Google', 'Facebook', 'Microsoft'],
    acceptance: 46.4, premium: false,
    description: `A peak element is strictly greater than its neighbors. Find any peak and return its index. Must be <code>O(log n)</code>.`,
    examples: [
      { input: '1 2 3 1',       output: '2' },
      { input: '1 2 1 3 5 6 4', output: '5' },
    ],
    constraints: ['1 ≤ nums.length ≤ 1000', 'nums[i] ≠ nums[i+1]'],
    testCases: [
      { input: '1 2 3 1',       expected: '2', hidden: false },
      { input: '1 2 1 3 5 6 4', expected: '5', hidden: false },
      { input: '1',             expected: '0', hidden: true  },
      { input: '1 2',           expected: '1', hidden: true  },
    ],
    hints: [
      'If nums[mid] < nums[mid+1], peak is in right half.',
      'Otherwise peak is in left half (including mid).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int findPeakElement(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int findPeakElement(int[] nums) {

    }
}`,
      javascript: `var findPeakElement = function(nums) {

};`,
      c: `int findPeakElement(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    vector<int>nums;int x;while(cin>>x)nums.push_back(x);
    cout<<Solution().findPeakElement(nums)<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums=list(map(int,sys.stdin.read().split()))
print(Solution().findPeakElement(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        List<Integer>list=new ArrayList<>();while(sc.hasNextInt())list.add(sc.nextInt());
        System.out.println(new Solution().findPeakElement(list.stream().mapToInt(i->i).toArray()));
    }
}`,
      javascript: `const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(findPeakElement(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    int nums[1001],n=0;while(scanf("%d",&nums[n])==1)n++;
    printf("%d\\n",findPeakElement(nums,n));return 0;
}`,
    },
    aiContext: 'Find Peak Element — binary search O(log n)',
  },

  // ── 103. Kth Largest Element in an Array ─────────────────────────────────────
  {
    number: 103, title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'], companies: ['Facebook', 'Amazon', 'Microsoft'],
    acceptance: 64.8, premium: false,
    description: `Return the <code>k</code>th largest element in the array.<br><br>First line: space-separated nums. Second line: k.`,
    examples: [
      { input: '3 2 1 5 6 4\n2',       output: '5' },
      { input: '3 2 3 1 2 4 5 5 6\n4', output: '4' },
    ],
    constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵'],
    testCases: [
      { input: '3 2 1 5 6 4\n2',       expected: '5', hidden: false },
      { input: '3 2 3 1 2 4 5 5 6\n4', expected: '4', hidden: false },
      { input: '1\n1',                 expected: '1', hidden: true  },
      { input: '5 2 4 1 3\n3',         expected: '3', hidden: true  },
    ],
    hints: [
      'Sort descending and return index k-1.',
      'Or use min-heap of size k.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        `,
      java: `class Solution {
    public int findKthLargest(int[] nums, int k) {

    }
}`,
      javascript: `var findKthLargest = function(nums, k) {

};`,
      c: `int findKthLargest(int* nums, int numsSize, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    string line;getline(cin,line);
    istringstream ss(line);vector<int>nums;int x;while(ss>>x)nums.push_back(x);
    int k;cin>>k;
    cout<<Solution().findKthLargest(nums,k)<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines=sys.stdin.read().split('\\n')
nums=list(map(int,lines[0].split()));k=int(lines[1].strip())
print(Solution().findKthLargest(nums,k))`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int[]nums=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k=sc.nextInt();
        System.out.println(new Solution().findKthLargest(nums,k));
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums=lines[0].split(' ').map(Number),k=parseInt(lines[1]);

__USER_CODE__

console.log(findKthLargest(nums,k));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    int nums[100001],n=0,k;
    char buf[2000000];fgets(buf,sizeof(buf),stdin);
    char*p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}nums[n++]=strtol(p,&p,10);}
    scanf("%d",&k);
    printf("%d\\n",findKthLargest(nums,n,k));return 0;
}`,
    },
    aiContext: 'Kth Largest Element — min-heap or quickselect O(n log k)',
  },

  // ── 104. Daily Temperatures ───────────────────────────────────────────────────
  {
    number: 104, title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium',
    tags: ['Array', 'Stack', 'Monotonic Stack'], companies: ['Amazon', 'Uber', 'Facebook'],
    acceptance: 66.5, premium: false,
    description: `Given temperatures, return an array where each element is the number of days until a warmer temperature (0 if none). Print space-separated.`,
    examples: [
      { input: '73 74 75 71 69 72 76 73', output: '1 1 4 2 1 1 0 0' },
      { input: '30 40 50 60',             output: '1 1 1 0'           },
    ],
    constraints: ['1 ≤ temperatures.length ≤ 10⁵', '30 ≤ temperatures[i] ≤ 100'],
    testCases: [
      { input: '73 74 75 71 69 72 76 73', expected: '1 1 4 2 1 1 0 0', hidden: false },
      { input: '30 40 50 60',             expected: '1 1 1 0',           hidden: false },
      { input: '30 60 90',                expected: '1 1 0',             hidden: true  },
    ],
    hints: [
      'Use a monotonic decreasing stack of indices.',
      'When current temp > top, pop and record the difference.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {

    }
};`,
      python: `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {

    }
}`,
      javascript: `var dailyTemperatures = function(temperatures) {

};`,
      c: `int* dailyTemperatures(int* temperatures, int temperaturesSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    vector<int>t;int x;while(cin>>x)t.push_back(x);
    auto res=Solution().dailyTemperatures(t);
    for(int i=0;i<(int)res.size();i++)cout<<(i?" ":"")<<res[i];
    cout<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

t=list(map(int,sys.stdin.read().split()))
print(*Solution().dailyTemperatures(t))`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        List<Integer>list=new ArrayList<>();while(sc.hasNextInt())list.add(sc.nextInt());
        int[]t=list.stream().mapToInt(i->i).toArray();
        int[]res=new Solution().dailyTemperatures(t);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<res.length;i++)sb.append(i>0?" ":"").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const t=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(dailyTemperatures(t).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main(){
    int t[100001],n=0;while(scanf("%d",&t[n])==1)n++;
    int retSize;int*res=dailyTemperatures(t,n,&retSize);
    for(int i=0;i<retSize;i++)printf("%s%d",i?" ":"",res[i]);
    printf("\\n");free(res);return 0;
}`,
    },
    aiContext: 'Daily Temperatures — monotonic stack O(n)',
  },

  // ── 105. Palindrome Linked List ───────────────────────────────────────────────
  {
    number: 105, title: 'Palindrome Linked List', slug: 'palindrome-linked-list', difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers', 'Recursion'], companies: ['Amazon', 'Facebook', 'Apple'],
    acceptance: 50.2, premium: false,
    description: `Given the head of a singly linked list (space-separated values), return <code>true</code> if it is a palindrome, <code>false</code> otherwise.`,
    examples: [
      { input: '1 2 2 1', output: 'true'  },
      { input: '1 2',     output: 'false' },
    ],
    constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ Node.val ≤ 9'],
    testCases: [
      { input: '1 2 2 1',   expected: 'true',  hidden: false },
      { input: '1 2',       expected: 'false', hidden: false },
      { input: '1',         expected: 'true',  hidden: true  },
      { input: '1 2 1',     expected: 'true',  hidden: true  },
      { input: '1 2 3 2 1', expected: 'true',  hidden: true  },
    ],
    hints: [
      'Find the middle using slow/fast pointers.',
      'Reverse the second half, then compare.',
    ],
    starter: {
      cpp: `/**
 * struct ListNode { int val; ListNode *next; ... };
 */
class Solution {
public:
    bool isPalindrome(ListNode* head) {

    }
};`,
      python: `class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        `,
      java: `class Solution {
    public boolean isPalindrome(ListNode head) {

    }
}`,
      javascript: `var isPalindrome = function(head) {

};`,
      c: `bool isPalindrome(struct ListNode* head) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

__USER_CODE__

int main(){
    vector<int>v;int x;while(cin>>x)v.push_back(x);
    ListNode*head=new ListNode(v[0]),*cur=head;
    for(int i=1;i<(int)v.size();i++){cur->next=new ListNode(v[i]);cur=cur->next;}
    cout<<(Solution().isPalindrome(head)?"true":"false")<<endl;return 0;
}`,
      python: `from typing import Optional
import sys
class ListNode:
    def __init__(self,val=0,next=None):self.val=val;self.next=next

__USER_CODE__

v=list(map(int,sys.stdin.read().split()))
head=ListNode(v[0]);cur=head
for val in v[1:]:cur.next=ListNode(val);cur=cur.next
print(str(Solution().isPalindrome(head)).lower())`,
      java: `import java.util.*;
class ListNode{int val;ListNode next;ListNode(int v){val=v;}}

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        List<Integer>list=new ArrayList<>();while(sc.hasNextInt())list.add(sc.nextInt());
        ListNode head=new ListNode(list.get(0)),cur=head;
        for(int i=1;i<list.size();i++){cur.next=new ListNode(list.get(i));cur=cur.next;}
        System.out.println(new Solution().isPalindrome(head));
    }
}`,
      javascript: `const v=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);
function ListNode(val,next){this.val=val??0;this.next=next??null;}

__USER_CODE__

let head=new ListNode(v[0]),cur=head;
for(let i=1;i<v.length;i++){cur.next=new ListNode(v[i]);cur=cur.next;}
console.log(String(isPalindrome(head)));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
struct ListNode{int val;struct ListNode*next;};

__USER_CODE__

int main(){
    int v[100001],n=0;while(scanf("%d",&v[n])==1)n++;
    struct ListNode*nodes=malloc(n*sizeof(struct ListNode));
    for(int i=0;i<n;i++){nodes[i].val=v[i];nodes[i].next=i+1<n?&nodes[i+1]:NULL;}
    printf("%s\\n",isPalindrome(&nodes[0])?"true":"false");
    free(nodes);return 0;
}`,
    },
    aiContext: 'Palindrome Linked List — slow/fast + reverse O(n)',
  },

  // ── 106. Reverse Linked List II ───────────────────────────────────────────────
  {
    number: 106, title: 'Reverse Linked List II', slug: 'reverse-linked-list-ii', difficulty: 'Medium',
    tags: ['Linked List'], companies: ['Amazon', 'Facebook', 'Microsoft'],
    acceptance: 46.1, premium: false,
    description: `Reverse nodes of a linked list from position <code>left</code> to <code>right</code>.<br><br>First line: list values. Second line: left right.`,
    examples: [
      { input: '1 2 3 4 5\n2 4', output: '1 4 3 2 5' },
      { input: '5\n1 1',         output: '5'           },
    ],
    constraints: ['1 ≤ n ≤ 500', '1 ≤ left ≤ right ≤ n'],
    testCases: [
      { input: '1 2 3 4 5\n2 4', expected: '1 4 3 2 5', hidden: false },
      { input: '5\n1 1',         expected: '5',           hidden: false },
      { input: '1 2 3\n1 3',     expected: '3 2 1',      hidden: true  },
    ],
    hints: [
      'Use a dummy head.',
      'Navigate to left-1, then reverse in-place from left to right.',
    ],
    starter: {
      cpp: `/**
 * struct ListNode { int val; ListNode *next; ... };
 */
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {

    }
};`,
      python: `class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        `,
      java: `class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {

    }
}`,
      javascript: `var reverseBetween = function(head, left, right) {

};`,
      c: `struct ListNode* reverseBetween(struct ListNode* head, int left, int right) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

__USER_CODE__

int main(){
    string line;getline(cin,line);
    istringstream ss(line);vector<int>v;int x;while(ss>>x)v.push_back(x);
    int l,r;cin>>l>>r;
    ListNode*head=new ListNode(v[0]),*cur=head;
    for(int i=1;i<(int)v.size();i++){cur->next=new ListNode(v[i]);cur=cur->next;}
    ListNode*res=Solution().reverseBetween(head,l,r);
    bool first=true;while(res){if(!first)cout<<" ";cout<<res->val;res=res->next;first=false;}
    cout<<endl;return 0;
}`,
      python: `from typing import Optional
import sys
class ListNode:
    def __init__(self,val=0,next=None):self.val=val;self.next=next

__USER_CODE__

lines=sys.stdin.read().split('\\n')
v=list(map(int,lines[0].split()));l,r=map(int,lines[1].split())
head=ListNode(v[0]);cur=head
for val in v[1:]:cur.next=ListNode(val);cur=cur.next
res=Solution().reverseBetween(head,l,r)
out=[]
while res:out.append(str(res.val));res=res.next
print(' '.join(out))`,
      java: `import java.util.*;
class ListNode{int val;ListNode next;ListNode(int v){val=v;}}

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        int[]v=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int l=sc.nextInt(),r=sc.nextInt();
        ListNode head=new ListNode(v[0]),cur=head;
        for(int i=1;i<v.length;i++){cur.next=new ListNode(v[i]);cur=cur.next;}
        ListNode res=new Solution().reverseBetween(head,l,r);
        StringBuilder sb=new StringBuilder();
        while(res!=null){if(sb.length()>0)sb.append(" ");sb.append(res.val);res=res.next;}
        System.out.println(sb);
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const v=lines[0].trim().split(' ').map(Number);
const[l,r]=lines[1].trim().split(' ').map(Number);
function ListNode(val,next){this.val=val??0;this.next=next??null;}

__USER_CODE__

let head=new ListNode(v[0]),cur=head;
for(let i=1;i<v.length;i++){cur.next=new ListNode(v[i]);cur=cur.next;}
let res=reverseBetween(head,l,r);
const out=[];while(res){out.push(res.val);res=res.next;}
console.log(out.join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
struct ListNode{int val;struct ListNode*next;};
struct ListNode*newNode(int v){struct ListNode*n=malloc(sizeof(struct ListNode));n->val=v;n->next=NULL;return n;}

__USER_CODE__

int main(){
    int v[501],nv=0,l,r;
    char buf[10000];fgets(buf,sizeof(buf),stdin);
    char*p=buf;while(*p&&*p!='\\n'){if(*p==' '){p++;continue;}v[nv++]=strtol(p,&p,10);}
    scanf("%d %d",&l,&r);
    struct ListNode*head=newNode(v[0]),*cur=head;
    for(int i=1;i<nv;i++){cur->next=newNode(v[i]);cur=cur->next;}
    struct ListNode*res=reverseBetween(head,l,r);
    int first=1;while(res){if(!first)printf(" ");printf("%d",res->val);res=res->next;first=0;}
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Reverse Linked List II — one pass with dummy head O(n)',
  },

  // ── 94. Next Permutation ──────────────────────────────────────────────────────
  {
    number: 94, title: 'Next Permutation', slug: 'next-permutation', difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'], companies: ['Google', 'Amazon', 'Microsoft'],
    acceptance: 38.5, premium: false,
    description: `Given an array, find the next permutation in lexicographic order. If it is the last permutation, rearrange to the smallest. Do it in-place.`,
    examples: [
      { input: '1 2 3', output: '1 3 2' },
      { input: '3 2 1', output: '1 2 3' },
      { input: '1 1 5', output: '1 5 1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100'],
    testCases: [
      { input: '1 2 3', expected: '1 3 2', hidden: false },
      { input: '3 2 1', expected: '1 2 3', hidden: false },
      { input: '1 1 5', expected: '1 5 1', hidden: false },
      { input: '2 3 1', expected: '3 1 2', hidden: true  },
    ],
    hints: [
      'Find largest i where nums[i] < nums[i+1].',
      'Find largest j > i where nums[j] > nums[i]. Swap.',
      'Reverse suffix after index i.',
    ],
    starter: {
      cpp: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        `,
      java: `class Solution {
    public void nextPermutation(int[] nums) {

    }
}`,
      javascript: `var nextPermutation = function(nums) {

};`,
      c: `void nextPermutation(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    vector<int>nums;int x;while(cin>>x)nums.push_back(x);
    Solution().nextPermutation(nums);
    for(int i=0;i<(int)nums.size();i++)cout<<(i?" ":"")<<nums[i];
    cout<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums=list(map(int,sys.stdin.read().split()))
Solution().nextPermutation(nums)
print(*nums)`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        List<Integer>list=new ArrayList<>();while(sc.hasNextInt())list.add(sc.nextInt());
        int[]nums=list.stream().mapToInt(i->i).toArray();
        new Solution().nextPermutation(nums);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<nums.length;i++)sb.append(i>0?" ":"").append(nums[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

nextPermutation(nums);
console.log(nums.join(' '));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    int nums[101],n=0;while(scanf("%d",&nums[n])==1)n++;
    nextPermutation(nums,n);
    for(int i=0;i<n;i++)printf("%s%d",i?" ":"",nums[i]);
    printf("\\n");return 0;
}`,
    },
    aiContext: 'Next Permutation — find pivot, swap, reverse O(n)',
  },


  // ── 108. Task Scheduler ─────────────────────────────────────────────────────
  {
    number: 108, title: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Greedy', 'Counting'], companies: ['Facebook', 'Amazon', 'Google'],
    acceptance: 57.6, premium: false,
    description: `Given tasks and cooldown <code>n</code>, return the least number of time units needed (same task must be at least <code>n</code> apart).<br><br>First line: space-separated tasks. Second line: n.`,
    examples: [
      { input: 'A A A B B B\n2',   output: '8'  },
      { input: 'A A A B B B\n0',   output: '6'  },
      { input: 'A A A A B B C\n2', output: '10' },
    ],
    constraints: ['1 ≤ tasks.length ≤ 10⁴', '0 ≤ n ≤ 100'],
    testCases: [
      { input: 'A A A B B B\n2',   expected: '8',  hidden: false },
      { input: 'A A A B B B\n0',   expected: '6',  hidden: false },
      { input: 'A A A A B B C\n2', expected: '10', hidden: false },
      { input: 'A\n0',             expected: '1',  hidden: true  },
    ],
    hints: [
      'Count frequency of each task.',
      'Result = max(tasks.length, (maxFreq-1)*(n+1) + countMaxFreq).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {

    }
};`,
      python: `class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        `,
      java: `class Solution {
    public int leastInterval(char[] tasks, int n) {

    }
}`,
      javascript: `var leastInterval = function(tasks, n) {

};`,
      c: `int leastInterval(char* tasks, int tasksSize, int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    string line;getline(cin,line);
    istringstream ss(line);vector<char>tasks;string w;
    while(ss>>w)tasks.push_back(w[0]);
    int n;cin>>n;
    cout<<Solution().leastInterval(tasks,n)<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines=sys.stdin.read().split('\\n')
tasks=lines[0].split();n=int(lines[1].strip())
print(Solution().leastInterval(tasks,n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        Scanner sc=new Scanner(System.in);
        String[]parts=sc.nextLine().trim().split(" ");
        char[]tasks=new char[parts.length];for(int i=0;i<parts.length;i++)tasks[i]=parts[i].charAt(0);
        int n=sc.nextInt();
        System.out.println(new Solution().leastInterval(tasks,n));
    }
}`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const tasks=lines[0].split(' '),n=parseInt(lines[1]);

__USER_CODE__

console.log(leastInterval(tasks,n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main(){
    char flat[10001];int nt=0,n;
    char buf[200000];fgets(buf,sizeof(buf),stdin);
    char*p=strtok(buf," \\n");while(p&&nt<10000){flat[nt++]=p[0];p=strtok(NULL," \\n");}
    scanf("%d",&n);
    printf("%d\\n",leastInterval(flat,nt,n));return 0;
}`,
    },
    aiContext: 'Task Scheduler — greedy formula O(n)',
  },

  // ── 100. Counting Bits ────────────────────────────────────────────────────────
  {
    number: 100, title: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Bit Manipulation'], companies: ['Google', 'Facebook', 'Apple'],
    acceptance: 74.8, premium: false,
    description: `Given <code>n</code>, return an array of length <code>n+1</code> where <code>ans[i]</code> is the number of 1s in the binary representation of <code>i</code>. Print space-separated.`,
    examples: [
      { input: 'n = 2', output: '0 1 1'       },
      { input: 'n = 5', output: '0 1 1 2 1 2' },
    ],
    constraints: ['0 ≤ n ≤ 10⁵'],
    testCases: [
      { input: '2', expected: '0 1 1',       hidden: false },
      { input: '5', expected: '0 1 1 2 1 2', hidden: false },
      { input: '0', expected: '0',            hidden: true  },
      { input: '1', expected: '0 1',          hidden: true  },
    ],
    hints: [
      'dp[i] = dp[i >> 1] + (i & 1).',
      'Build from 0 to n.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> countBits(int n) {

    }
};`,
      python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] countBits(int n) {

    }
}`,
      javascript: `var countBits = function(n) {

};`,
      c: `int* countBits(int n, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main(){
    int n;cin>>n;
    auto res=Solution().countBits(n);
    for(int i=0;i<(int)res.size();i++)cout<<(i?" ":"")<<res[i];
    cout<<endl;return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

n=int(sys.stdin.read().strip())
print(*Solution().countBits(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main{
    public static void main(String[]args){
        int n=new Scanner(System.in).nextInt();
        int[]res=new Solution().countBits(n);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<res.length;i++)sb.append(i>0?" ":"").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

__USER_CODE__

console.log(countBits(n).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main(){
    int n;scanf("%d",&n);
    int retSize;int*res=countBits(n,&retSize);
    for(int i=0;i<retSize;i++)printf("%s%d",i?" ":"",res[i]);
    printf("\\n");free(res);return 0;
}`,
    },
    aiContext: 'Counting Bits — DP bit shift O(n)',
  },

  // ── PROBLEMS 111–120 ──────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 111. Number of Islands II (Union Find) ────────────────────────────────────
  {
    number: 111, title: 'Island Perimeter', slug: 'island-perimeter', difficulty: 'Easy',
    tags: ['Array', 'DFS', 'BFS', 'Matrix'], companies: ['Google', 'Facebook', 'Palantir'],
    acceptance: 69.5, premium: false,
    description: `You are given a grid where each cell is either land (1) or water (0). Each row is on a separate line. Compute the perimeter of the island.`,
    examples: [
      { input: '0 1 0 0\n1 1 1 0\n0 1 0 0\n1 1 0 0', output: '16' },
      { input: '1',                                   output: '4'  },
      { input: '1 0',                                 output: '4'  },
    ],
    constraints: ['1 ≤ m, n ≤ 100', 'grid[i][j] is 0 or 1', 'There is exactly one island'],
    testCases: [
      { input: '0 1 0 0\n1 1 1 0\n0 1 0 0\n1 1 0 0', expected: '16', hidden: false },
      { input: '1',                                   expected: '4',  hidden: false },
      { input: '1 0',                                 expected: '4',  hidden: true  },
      { input: '1 1\n1 1',                            expected: '8',  hidden: true  },
    ],
    hints: [
      'Each land cell contributes 4 to perimeter.',
      'Each shared edge between two land cells removes 2.',
      'Count land cells and shared edges separately.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int islandPerimeter(vector<vector<int>>& grid) {

    }
};`,
      python: `class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        `,
      java: `class Solution {
    public int islandPerimeter(int[][] grid) {

    }
}`,
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function(grid) {

};`,
      c: `int islandPerimeter(int** grid, int gridSize, int* gridColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> grid; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        grid.push_back(row);
    }
    Solution sol;
    cout << sol.islandPerimeter(grid) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
grid = [list(map(int, l.split())) for l in lines]
print(Solution().islandPerimeter(grid))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine().trim();
            if (!l.isEmpty()) rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray());
        }
        int[][] grid = rows.toArray(new int[0][]);
        System.out.println(new Solution().islandPerimeter(grid));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const grid = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(islandPerimeter(grid));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[101][101], rows = 0, cols = 0; char buf[500];
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0] == '\\n') continue;
        char *p = buf; int j = 0;
        while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } m[rows][j++] = strtol(p, &p, 10); }
        cols = j; rows++;
    }
    int *ptrs[101]; int colSizes[101];
    for (int i = 0; i < rows; i++) { ptrs[i] = m[i]; colSizes[i] = cols; }
    printf("%d\\n", islandPerimeter((int**)ptrs, rows, colSizes));
    return 0;
}`,
    },
    aiContext: 'Island Perimeter — count edges O(m*n)',
  },

  // ── 112. Ransom Note ─────────────────────────────────────────────────────────
  {
    number: 112, title: 'Ransom Note', slug: 'ransom-note', difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Counting'], companies: ['Amazon', 'Apple', 'Bloomberg'],
    acceptance: 58.3, premium: false,
    description: `Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code> if <code>ransomNote</code> can be constructed using letters from <code>magazine</code>.<br><br>First line: ransomNote. Second line: magazine.`,
    examples: [
      { input: 'a\nb',   output: 'false' },
      { input: 'aa\nab', output: 'false' },
      { input: 'aa\naab', output: 'true' },
    ],
    constraints: ['1 ≤ ransomNote.length, magazine.length ≤ 10⁵', 'Both consist of lowercase English letters'],
    testCases: [
      { input: 'a\nb',    expected: 'false', hidden: false },
      { input: 'aa\nab',  expected: 'false', hidden: false },
      { input: 'aa\naab', expected: 'true',  hidden: false },
      { input: 'bg\nefjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj', expected: 'true', hidden: true },
    ],
    hints: [
      'Count character frequencies in magazine.',
      'Check if ransomNote can be satisfied by those counts.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {

    }
};`,
      python: `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        `,
      java: `class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {

    }
}`,
      javascript: `/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function(ransomNote, magazine) {

};`,
      c: `bool canConstruct(char* ransomNote, char* magazine) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string r, m;
    getline(cin, r); getline(cin, m);
    Solution sol;
    cout << (sol.canConstruct(r, m) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
r = lines[0]; m = lines[1] if len(lines) > 1 else ''
print(str(Solution().canConstruct(r, m)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String r = sc.nextLine(), m = sc.nextLine();
        System.out.println(new Solution().canConstruct(r, m));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const r = lines[0], m = lines[1] || '';

__USER_CODE__

console.log(String(canConstruct(r, m)));`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

__USER_CODE__

int main() {
    char r[100001], m[100001];
    fgets(r, sizeof(r), stdin); fgets(m, sizeof(m), stdin);
    int nr = strlen(r), nm = strlen(m);
    if (r[nr-1] == '\\n') r[--nr] = '\\0';
    if (m[nm-1] == '\\n') m[--nm] = '\\0';
    printf("%s\\n", canConstruct(r, m) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Ransom Note — character frequency count O(n)',
  },

  // ── 113. Maximum Number of Vowels in a Substring of Given Length ──────────────
  {
    number: 113, title: 'Maximum Number of Vowels in a Substring of Given Length', slug: 'maximum-number-of-vowels-in-a-substring-of-given-length', difficulty: 'Medium',
    tags: ['String', 'Sliding Window'], companies: ['Google', 'Amazon'],
    acceptance: 57.2, premium: false,
    description: `Given a string <code>s</code> and integer <code>k</code>, return the maximum number of vowel letters in any substring of length <code>k</code>.<br><br>First line: s. Second line: k.`,
    examples: [
      { input: 'abciiidef\n3', output: '3', explanation: '"iii" has 3 vowels' },
      { input: 'aeiou\n2',     output: '2' },
      { input: 'leetcode\n3',  output: '2' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's consists of lowercase English letters', '1 ≤ k ≤ s.length'],
    testCases: [
      { input: 'abciiidef\n3', expected: '3', hidden: false },
      { input: 'aeiou\n2',     expected: '2', hidden: false },
      { input: 'leetcode\n3',  expected: '2', hidden: false },
      { input: 'rhythms\n4',   expected: '0', hidden: true  },
    ],
    hints: [
      'Use a sliding window of size k.',
      'Count vowels in the window.',
      'Slide: add new char, remove old char, update count.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maxVowels(string s, int k) {

    }
};`,
      python: `class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        `,
      java: `class Solution {
    public int maxVowels(String s, int k) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxVowels = function(s, k) {

};`,
      c: `int maxVowels(char* s, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    int k; cin >> k;
    Solution sol;
    cout << sol.maxVowels(s, k) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
s = lines[0]; k = int(lines[1].strip())
print(Solution().maxVowels(s, k))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        int k = sc.nextInt();
        System.out.println(new Solution().maxVowels(s, k));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const s = lines[0], k = parseInt(lines[1]);

__USER_CODE__

console.log(maxVowels(s, k));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[100001]; int k;
    fgets(s, sizeof(s), stdin);
    int n = strlen(s); if (s[n-1] == '\\n') s[--n] = '\\0';
    scanf("%d", &k);
    printf("%d\\n", maxVowels(s, k));
    return 0;
}`,
    },
    aiContext: 'Maximum Vowels in Substring — sliding window O(n)',
  },

  // ── 114. Number of Zero-Filled Subarrays ──────────────────────────────────────
  {
    number: 114, title: 'Number of Zero-Filled Subarrays', slug: 'number-of-zero-filled-subarrays', difficulty: 'Medium',
    tags: ['Array', 'Math'], companies: ['Google', 'Amazon'],
    acceptance: 79.0, premium: false,
    description: `Given an integer array <code>nums</code>, return the number of subarrays filled with zeros.`,
    examples: [
      { input: '1 3 0 0 2 0 0 4', output: '6', explanation: '4 single zeros + 2 pairs of zeros = 6' },
      { input: '0 0 0 2 0 0',     output: '9' },
      { input: '2 10 2019',       output: '0' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: '1 3 0 0 2 0 0 4', expected: '6', hidden: false },
      { input: '0 0 0 2 0 0',     expected: '9', hidden: false },
      { input: '2 10 2019',       expected: '0', hidden: false },
      { input: '0',               expected: '1', hidden: true  },
    ],
    hints: [
      'Count consecutive zeros as a run of length L.',
      'A run of L zeros contributes L*(L+1)/2 subarrays.',
      'Sum contributions from all runs.',
    ],
    starter: {
      cpp: `class Solution {
public:
    long long zeroFilledSubarray(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def zeroFilledSubarray(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public long zeroFilledSubarray(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var zeroFilledSubarray = function(nums) {

};`,
      c: `long long zeroFilledSubarray(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.zeroFilledSubarray(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().zeroFilledSubarray(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().zeroFilledSubarray(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(zeroFilledSubarray(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%lld\\n", zeroFilledSubarray(nums, n));
    return 0;
}`,
    },
    aiContext: 'Zero-Filled Subarrays — run-length math O(n)',
  },

  // ── 115. Largest Perimeter Triangle ──────────────────────────────────────────
  {
    number: 115, title: 'Largest Perimeter Triangle', slug: 'largest-perimeter-triangle', difficulty: 'Easy',
    tags: ['Array', 'Math', 'Greedy', 'Sorting'], companies: ['Amazon', 'Google'],
    acceptance: 56.6, premium: false,
    description: `Given an integer array <code>nums</code>, return the largest perimeter of a triangle with a non-zero area formed from three of these lengths. Return 0 if impossible.`,
    examples: [
      { input: '2 1 2',       output: '5' },
      { input: '1 2 1 10',    output: '0' },
    ],
    constraints: ['3 ≤ nums.length ≤ 10⁴', '1 ≤ nums[i] ≤ 10⁶'],
    testCases: [
      { input: '2 1 2',    expected: '5', hidden: false },
      { input: '1 2 1 10', expected: '0', hidden: false },
      { input: '3 2 3 4',  expected: '10', hidden: true },
      { input: '1 1 1',    expected: '3', hidden: true  },
    ],
    hints: [
      'Sort descending.',
      'For any triple (a, b, c) sorted descending: valid if b + c > a.',
      'Check consecutive triples after sorting.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int largestPerimeter(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def largestPerimeter(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int largestPerimeter(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var largestPerimeter = function(nums) {

};`,
      c: `int largestPerimeter(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.largestPerimeter(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().largestPerimeter(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().largestPerimeter(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(largestPerimeter(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", largestPerimeter(nums, n));
    return 0;
}`,
    },
    aiContext: 'Largest Perimeter Triangle — sort + greedy O(n log n)',
  },

  // ── 116. Find the Difference ──────────────────────────────────────────────────
  {
    number: 116, title: 'Find the Difference', slug: 'find-the-difference', difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Bit Manipulation', 'Sorting'], companies: ['Google', 'Amazon'],
    acceptance: 60.5, premium: false,
    description: `You are given two strings <code>s</code> and <code>t</code> where <code>t</code> is generated by random shuffling of <code>s</code> plus one extra letter. Return the extra letter.<br><br>First line: s. Second line: t.`,
    examples: [
      { input: 'abcd\nabcde', output: 'e' },
      { input: '\ny',         output: 'y' },
    ],
    constraints: ['0 ≤ s.length ≤ 1000', 't.length == s.length + 1'],
    testCases: [
      { input: 'abcd\nabcde', expected: 'e', hidden: false },
      { input: '\ny',         expected: 'y', hidden: false },
      { input: 'a\naa',       expected: 'a', hidden: true  },
      { input: 'ae\naee',     expected: 'e', hidden: true  },
    ],
    hints: [
      'XOR all characters in both strings.',
      'Or use character counts.',
    ],
    starter: {
      cpp: `class Solution {
public:
    char findTheDifference(string s, string t) {

    }
};`,
      python: `class Solution:
    def findTheDifference(self, s: str, t: str) -> str:
        `,
      java: `class Solution {
    public char findTheDifference(String s, String t) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function(s, t) {

};`,
      c: `char findTheDifference(char* s, char* t) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s, t;
    getline(cin, s); getline(cin, t);
    Solution sol;
    cout << sol.findTheDifference(s, t) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
s = lines[0]; t = lines[1] if len(lines) > 1 else ''
print(Solution().findTheDifference(s, t))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        String t = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(new Solution().findTheDifference(s, t));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = lines[0] || '', t = lines[1] || '';

__USER_CODE__

console.log(findTheDifference(s, t));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[1001], t[1002];
    fgets(s, sizeof(s), stdin); fgets(t, sizeof(t), stdin);
    int ns = strlen(s), nt = strlen(t);
    if (s[ns-1] == '\\n') s[--ns] = '\\0';
    if (t[nt-1] == '\\n') t[--nt] = '\\0';
    printf("%c\\n", findTheDifference(s, t));
    return 0;
}`,
    },
    aiContext: 'Find the Difference — XOR trick O(n)',
  },

  // ── 117. Assign Cookies ───────────────────────────────────────────────────────
  {
    number: 117, title: 'Assign Cookies', slug: 'assign-cookies', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'], companies: ['Amazon', 'Google'],
    acceptance: 53.4, premium: false,
    description: `Assign cookies to children to maximize the number of content children. Each child <code>i</code> has greed factor <code>g[i]</code>; each cookie <code>j</code> has size <code>s[j]</code>. Child <code>i</code> is content if <code>s[j] >= g[i]</code>.<br><br>First line: g values. Second line: s values.`,
    examples: [
      { input: '1 2 3\n1 1', output: '1', explanation: 'Only one child can be satisfied' },
      { input: '1 2\n1 2 3', output: '2' },
    ],
    constraints: ['1 ≤ g.length ≤ 3×10⁴', '0 ≤ s.length ≤ 3×10⁴', '1 ≤ g[i], s[j] ≤ 2³¹-1'],
    testCases: [
      { input: '1 2 3\n1 1', expected: '1', hidden: false },
      { input: '1 2\n1 2 3', expected: '2', hidden: false },
      { input: '10 9 8 7\n5 6 7 8', expected: '2', hidden: true },
      { input: '1\n1',       expected: '1', hidden: true  },
    ],
    hints: [
      'Sort both arrays.',
      'Use two pointers: greedily assign smallest sufficient cookie.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {

    }
};`,
      python: `class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        `,
      java: `class Solution {
    public int findContentChildren(int[] g, int[] s) {

    }
}`,
      javascript: `/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {

};`,
      c: `int findContentChildren(int* g, int gSize, int* s, int sSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    istringstream s1(l1), s2(l2);
    vector<int> g, s; int x;
    while (s1 >> x) g.push_back(x);
    while (s2 >> x) s.push_back(x);
    Solution sol;
    cout << sol.findContentChildren(g, s) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
g = list(map(int, lines[0].split()))
s = list(map(int, lines[1].split())) if len(lines) > 1 else []
print(Solution().findContentChildren(g, s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] g = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        String line2 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        int[] s = line2.isEmpty() ? new int[0] : Arrays.stream(line2.split(" ")).mapToInt(Integer::parseInt).toArray();
        System.out.println(new Solution().findContentChildren(g, s));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const g = lines[0].split(' ').map(Number);
const s = lines[1] ? lines[1].split(' ').map(Number) : [];

__USER_CODE__

console.log(findContentChildren(g, s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int g[30001], s[30001], ng = 0, ns = 0;
    char buf[500000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } g[ng++] = strtol(p, &p, 10); }
    fgets(buf, sizeof(buf), stdin); p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } s[ns++] = strtol(p, &p, 10); }
    printf("%d\\n", findContentChildren(g, ng, s, ns));
    return 0;
}`,
    },
    aiContext: 'Assign Cookies — sort + two pointers greedy O(n log n)',
  },

  // ── 118. Lemonade Change ──────────────────────────────────────────────────────
  {
    number: 118, title: 'Lemonade Change', slug: 'lemonade-change', difficulty: 'Easy',
    tags: ['Array', 'Greedy'], companies: ['Amazon', 'Google'],
    acceptance: 52.8, premium: false,
    description: `Each customer pays $5, $10, or $20. Lemonade costs $5. Return <code>true</code> if you can give correct change to every customer, <code>false</code> otherwise.`,
    examples: [
      { input: '5 5 5 10 20',    output: 'true'  },
      { input: '5 5 10 10 20',   output: 'false' },
    ],
    constraints: ['1 ≤ bills.length ≤ 10⁵', 'bills[i] is 5, 10, or 20'],
    testCases: [
      { input: '5 5 5 10 20',  expected: 'true',  hidden: false },
      { input: '5 5 10 10 20', expected: 'false', hidden: false },
      { input: '5 5 5 20',     expected: 'true',  hidden: true  },
      { input: '10 10',        expected: 'false', hidden: true  },
    ],
    hints: [
      'Track count of $5 and $10 bills.',
      'For $10: use one $5 as change.',
      'For $20: prefer one $10 + one $5; fallback three $5s.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool lemonadeChange(vector<int>& bills) {

    }
};`,
      python: `class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        `,
      java: `class Solution {
    public boolean lemonadeChange(int[] bills) {

    }
}`,
      javascript: `/**
 * @param {number[]} bills
 * @return {boolean}
 */
var lemonadeChange = function(bills) {

};`,
      c: `bool lemonadeChange(int* bills, int billsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> bills; int x;
    while (cin >> x) bills.push_back(x);
    Solution sol;
    cout << (sol.lemonadeChange(bills) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

bills = list(map(int, sys.stdin.read().split()))
print(str(Solution().lemonadeChange(bills)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] bills = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().lemonadeChange(bills));
    }
}`,
      javascript: `const bills = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(String(lemonadeChange(bills)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int bills[100001], n = 0;
    while (scanf("%d", &bills[n]) == 1) n++;
    printf("%s\\n", lemonadeChange(bills, n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Lemonade Change — greedy bill tracking O(n)',
  },

  // ── 119. Score of Parentheses ─────────────────────────────────────────────────
  {
    number: 119, title: 'Score of Parentheses', slug: 'score-of-parentheses', difficulty: 'Medium',
    tags: ['String', 'Stack'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 65.8, premium: false,
    description: `Given a balanced parentheses string <code>s</code>, return the score.<br><br>Rules: "()" = 1, "AB" = A + B, "(A)" = 2*A.`,
    examples: [
      { input: '()',     output: '1' },
      { input: '(())',   output: '2' },
      { input: '()()',   output: '2' },
      { input: '(()(()))', output: '6' },
    ],
    constraints: ['2 ≤ s.length ≤ 50', 's consists of ( and )', 's is balanced'],
    testCases: [
      { input: '()',       expected: '1', hidden: false },
      { input: '(())',     expected: '2', hidden: false },
      { input: '()()',     expected: '2', hidden: false },
      { input: '(()(()))', expected: '6', hidden: true  },
    ],
    hints: [
      'Use a stack to track depth.',
      '() at depth d contributes 2^d to the score.',
      'Or: push 0 for (, pop and merge on ).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int scoreOfParentheses(string s) {

    }
};`,
      python: `class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        `,
      java: `class Solution {
    public int scoreOfParentheses(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var scoreOfParentheses = function(s) {

};`,
      c: `int scoreOfParentheses(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; cin >> s;
    Solution sol;
    cout << sol.scoreOfParentheses(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().scoreOfParentheses(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).next().trim();
        System.out.println(new Solution().scoreOfParentheses(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(scoreOfParentheses(s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    char s[51]; scanf("%s", s);
    printf("%d\\n", scoreOfParentheses(s));
    return 0;
}`,
    },
    aiContext: 'Score of Parentheses — stack or depth approach O(n)',
  },

  // ── 120. Check if Array Is Sorted and Rotated ─────────────────────────────────
  {
    number: 120, title: 'Check if Array Is Sorted and Rotated', slug: 'check-if-array-is-sorted-and-rotated', difficulty: 'Easy',
    tags: ['Array'], companies: ['Amazon', 'Google'],
    acceptance: 49.8, premium: false,
    description: `Given an array <code>nums</code>, return <code>true</code> if it was originally sorted in non-decreasing order, then rotated some number of positions (including zero). Return <code>false</code> otherwise.`,
    examples: [
      { input: '3 4 5 1 2', output: 'true',  explanation: '[1,2,3,4,5] rotated 3 times' },
      { input: '2 1 3 4',   output: 'false', explanation: 'Not a rotation of sorted array' },
      { input: '1 2 3',     output: 'true',  explanation: 'Already sorted' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '1 ≤ nums[i] ≤ 100'],
    testCases: [
      { input: '3 4 5 1 2', expected: 'true',  hidden: false },
      { input: '2 1 3 4',   expected: 'false', hidden: false },
      { input: '1 2 3',     expected: 'true',  hidden: false },
      { input: '1',         expected: 'true',  hidden: true  },
      { input: '2 1',       expected: 'true',  hidden: true  },
    ],
    hints: [
      'Count "drops" where nums[i] > nums[i+1] (wrapping around).',
      'At most 1 drop means sorted and rotated.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool check(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def check(self, nums: List[int]) -> bool:
        `,
      java: `class Solution {
    public boolean check(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var check = function(nums) {

};`,
      c: `bool check(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << (sol.check(nums) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(str(Solution().check(nums)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().check(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(String(check(nums)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int nums[101], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%s\\n", check(nums, n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Check Sorted and Rotated — count drops O(n)',
  },


  // ── PROBLEMS 121–130 ──────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 121. Number of Segments in a String ──────────────────────────────────────
  {
    number: 121, title: 'Number of Segments in a String', slug: 'number-of-segments-in-a-string', difficulty: 'Easy',
    tags: ['String'], companies: ['Google', 'Amazon'],
    acceptance: 38.1, premium: false,
    description: `Given a string <code>s</code>, return the number of segments (contiguous sequences of non-space characters).`,
    examples: [
      { input: 'Hello, my name is John', output: '5' },
      { input: 'Hello',                  output: '1' },
    ],
    constraints: ['0 ≤ s.length ≤ 300', 's consists of lowercase/uppercase letters, digits, or spaces'],
    testCases: [
      { input: 'Hello, my name is John', expected: '5', hidden: false },
      { input: 'Hello',                  expected: '1', hidden: false },
      { input: '',                       expected: '0', hidden: true  },
      { input: '   ',                    expected: '0', hidden: true  },
      { input: 'love live! mu\'sic forever', expected: '4', hidden: true },
    ],
    hints: [
      'Count transitions from space to non-space.',
      'Or split on whitespace and count non-empty tokens.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int countSegments(string s) {

    }
};`,
      python: `class Solution:
    def countSegments(self, s: str) -> int:
        `,
      java: `class Solution {
    public int countSegments(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var countSegments = function(s) {

};`,
      c: `int countSegments(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s;
    getline(cin, s);
    Solution sol;
    cout << sol.countSegments(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.readline().rstrip('\\n')
print(Solution().countSegments(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(new Solution().countSegments(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').replace(/\\n$/, '');

__USER_CODE__

console.log(countSegments(s));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[301] = "";
    fgets(s, sizeof(s), stdin);
    int n = strlen(s);
    if (n > 0 && s[n-1] == '\\n') s[--n] = '\\0';
    printf("%d\\n", countSegments(s));
    return 0;
}`,
    },
    aiContext: 'Number of Segments in a String — count non-space runs O(n)',
  },

  // ── 122. Detect Capital ───────────────────────────────────────────────────────
  {
    number: 122, title: 'Detect Capital', slug: 'detect-capital', difficulty: 'Easy',
    tags: ['String'], companies: ['Amazon', 'Apple'],
    acceptance: 55.8, premium: false,
    description: `Given a string <code>word</code>, return <code>true</code> if the usage of capitals is correct.<br><br>Valid: all capitals, all lowercase, or only first letter capitalized.`,
    examples: [
      { input: 'USA',   output: 'true'  },
      { input: 'FlaG',  output: 'false' },
      { input: 'leetcode', output: 'true' },
    ],
    constraints: ['1 ≤ word.length ≤ 100', 'word consists of uppercase and lowercase English letters'],
    testCases: [
      { input: 'USA',      expected: 'true',  hidden: false },
      { input: 'FlaG',     expected: 'false', hidden: false },
      { input: 'leetcode', expected: 'true',  hidden: false },
      { input: 'Google',   expected: 'true',  hidden: true  },
      { input: 'G',        expected: 'true',  hidden: true  },
    ],
    hints: [
      'Check all uppercase, all lowercase, or first uppercase rest lowercase.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool detectCapitalUse(string word) {

    }
};`,
      python: `class Solution:
    def detectCapitalUse(self, word: str) -> bool:
        `,
      java: `class Solution {
    public boolean detectCapitalUse(String word) {

    }
}`,
      javascript: `/**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function(word) {

};`,
      c: `bool detectCapitalUse(char* word) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string word; cin >> word;
    Solution sol;
    cout << (sol.detectCapitalUse(word) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

word = sys.stdin.read().strip()
print(str(Solution().detectCapitalUse(word)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String word = new Scanner(System.in).next().trim();
        System.out.println(new Solution().detectCapitalUse(word));
    }
}`,
      javascript: `const word = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(String(detectCapitalUse(word)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    char word[101]; scanf("%s", word);
    printf("%s\\n", detectCapitalUse(word) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Detect Capital — string case check O(n)',
  },

  // ── 123. Longest Common Prefix ────────────────────────────────────────────────
  {
    number: 123, title: 'Longest Common Prefix', slug: 'longest-common-prefix', difficulty: 'Easy',
    tags: ['String', 'Trie'], companies: ['Google', 'Amazon', 'Microsoft'],
    acceptance: 42.3, premium: false,
    description: `Write a function to find the longest common prefix string among an array of strings. Return an empty string if there is no common prefix.<br><br>Input: space-separated strings on one line.`,
    examples: [
      { input: 'flower flow flight', output: 'fl'  },
      { input: 'dog racecar car',   output: ''    },
    ],
    constraints: ['1 ≤ strs.length ≤ 200', '0 ≤ strs[i].length ≤ 200', 'strs[i] consists of lowercase English letters'],
    testCases: [
      { input: 'flower flow flight', expected: 'fl', hidden: false },
      { input: 'dog racecar car',    expected: '',   hidden: false },
      { input: 'a',                  expected: 'a',  hidden: true  },
      { input: 'ab a',               expected: 'a',  hidden: true  },
    ],
    hints: [
      'Sort and compare first and last strings.',
      'Or iteratively reduce prefix.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {

    }
};`,
      python: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        `,
      java: `class Solution {
    public String longestCommonPrefix(String[] strs) {

    }
}`,
      javascript: `/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {

};`,
      c: `char* longestCommonPrefix(char** strs, int strsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<string> strs; string w;
    while (ss >> w) strs.push_back(w);
    Solution sol;
    cout << sol.longestCommonPrefix(strs) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

strs = sys.stdin.read().strip().split()
print(Solution().longestCommonPrefix(strs))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        String[] strs = line.split(" ");
        System.out.println(new Solution().longestCommonPrefix(strs));
    }
}`,
      javascript: `const strs = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/);

__USER_CODE__

console.log(longestCommonPrefix(strs));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int main() {
    char words[200][201]; int n = 0;
    char line[40001]; fgets(line, sizeof(line), stdin);
    char *p = strtok(line, " \\n");
    while (p && n < 200) { strcpy(words[n++], p); p = strtok(NULL, " \\n"); }
    char *ptrs[200]; for (int i = 0; i < n; i++) ptrs[i] = words[i];
    printf("%s\\n", longestCommonPrefix(ptrs, n));
    return 0;
}`,
    },
    aiContext: 'Longest Common Prefix — vertical scan or sort O(n*m)',
  },

  // ── 124. Reverse Words in a String ───────────────────────────────────────────
  {
    number: 124, title: 'Reverse Words in a String', slug: 'reverse-words-in-a-string', difficulty: 'Medium',
    tags: ['Two Pointers', 'String'], companies: ['Microsoft', 'Facebook', 'Apple'],
    acceptance: 33.6, premium: false,
    description: `Given an input string <code>s</code>, reverse the order of the words. A word is a sequence of non-space characters. Leading/trailing spaces and multiple spaces between words should be removed.`,
    examples: [
      { input: 'the sky is blue',  output: 'blue is sky the' },
      { input: '  hello world  ',  output: 'world hello'     },
      { input: 'a good   example', output: 'example good a'  },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's contains letters, digits, and spaces'],
    testCases: [
      { input: 'the sky is blue',   expected: 'blue is sky the', hidden: false },
      { input: '  hello world  ',   expected: 'world hello',     hidden: false },
      { input: 'a good   example',  expected: 'example good a',  hidden: false },
      { input: '1',                 expected: '1',               hidden: true  },
    ],
    hints: [
      'Split on whitespace, filter empty strings.',
      'Reverse the list and join with a single space.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string reverseWords(string s) {

    }
};`,
      python: `class Solution:
    def reverseWords(self, s: str) -> str:
        `,
      java: `class Solution {
    public String reverseWords(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {

};`,
      c: `char* reverseWords(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    Solution sol;
    cout << sol.reverseWords(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.readline().rstrip('\\n')
print(Solution().reverseWords(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine();
        System.out.println(new Solution().reverseWords(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').replace(/\\n$/, '');

__USER_CODE__

console.log(reverseWords(s));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    char s[10001];
    fgets(s, sizeof(s), stdin);
    int n = strlen(s);
    if (n > 0 && s[n-1] == '\\n') s[--n] = '\\0';
    char *res = reverseWords(s);
    printf("%s\\n", res);
    return 0;
}`,
    },
    aiContext: 'Reverse Words in a String — split and reverse O(n)',
  },

  // ── 125. Power of Three ──────────────────────────────────────────────────────
  {
    number: 125, title: 'Power of Three', slug: 'power-of-three', difficulty: 'Easy',
    tags: ['Math', 'Recursion'], companies: ['Google', 'Amazon'],
    acceptance: 43.1, premium: false,
    description: `Given an integer <code>n</code>, return <code>true</code> if it is a power of three, <code>false</code> otherwise. An integer is a power of three if there exists an integer <code>x</code> such that <code>n == 3^x</code>.`,
    examples: [
      { input: '27',  output: 'true'  },
      { input: '0',   output: 'false' },
      { input: '-1',  output: 'false' },
    ],
    constraints: ['-2³¹ ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '27',   expected: 'true',  hidden: false },
      { input: '0',    expected: 'false', hidden: false },
      { input: '-1',   expected: 'false', hidden: false },
      { input: '9',    expected: 'true',  hidden: true  },
      { input: '45',   expected: 'false', hidden: true  },
    ],
    hints: [
      'Keep dividing by 3 while divisible.',
      'At the end, check if n == 1.',
      'Or: 3^19 = 1162261467 is the max power of 3 in int range; check if it is divisible by n.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isPowerOfThree(int n) {

    }
};`,
      python: `class Solution:
    def isPowerOfThree(self, n: int) -> bool:
        `,
      java: `class Solution {
    public boolean isPowerOfThree(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {

};`,
      c: `bool isPowerOfThree(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << (sol.isPowerOfThree(n) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(str(Solution().isPowerOfThree(n)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().isPowerOfThree(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(String(isPowerOfThree(n)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", isPowerOfThree(n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Power of Three — divide or max-power check O(log n)',
  },

  // ── 126. Ugly Number ─────────────────────────────────────────────────────────
  {
    number: 126, title: 'Ugly Number', slug: 'ugly-number', difficulty: 'Easy',
    tags: ['Math'], companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    acceptance: 41.8, premium: false,
    description: `An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer <code>n</code>, return <code>true</code> if <code>n</code> is an ugly number.`,
    examples: [
      { input: '6',   output: 'true',  explanation: '6 = 2 × 3' },
      { input: '1',   output: 'true',  explanation: '1 has no prime factors' },
      { input: '14',  output: 'false', explanation: '14 = 2 × 7' },
    ],
    constraints: ['-2³¹ ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '6',   expected: 'true',  hidden: false },
      { input: '1',   expected: 'true',  hidden: false },
      { input: '14',  expected: 'false', hidden: false },
      { input: '0',   expected: 'false', hidden: true  },
      { input: '30',  expected: 'true',  hidden: true  },
    ],
    hints: [
      'Divide by 2, 3, 5 while divisible.',
      'If n becomes 1, it is ugly.',
      'Negative numbers and 0 are not ugly.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isUgly(int n) {

    }
};`,
      python: `class Solution:
    def isUgly(self, n: int) -> bool:
        `,
      java: `class Solution {
    public boolean isUgly(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {boolean}
 */
var isUgly = function(n) {

};`,
      c: `bool isUgly(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << (sol.isUgly(n) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(str(Solution().isUgly(n)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().isUgly(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(String(isUgly(n)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", isUgly(n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Ugly Number — divide by 2,3,5 O(log n)',
  },

  // ── 127. Minimum Absolute Difference ─────────────────────────────────────────
  {
    number: 127, title: 'Minimum Absolute Difference', slug: 'minimum-absolute-difference', difficulty: 'Easy',
    tags: ['Array', 'Sorting'], companies: ['Amazon', 'Google'],
    acceptance: 69.7, premium: false,
    description: `Given an array of distinct integers <code>arr</code>, find all pairs with the minimum absolute difference. Return a list of pairs in ascending order, each pair printed as <code>a b</code> on a separate line.`,
    examples: [
      { input: '4 2 1 3',         output: '1 2\n2 3\n3 4' },
      { input: '1 3 6 10 15',     output: '1 3'           },
      { input: '3 8 -10 23 19 -4 -14 27', output: '-14 -10\n19 23\n23 27' },
    ],
    constraints: ['2 ≤ arr.length ≤ 10⁵', '-10⁶ ≤ arr[i] ≤ 10⁶', 'All integers are distinct'],
    testCases: [
      { input: '4 2 1 3',     expected: '1 2\n2 3\n3 4',   hidden: false },
      { input: '1 3 6 10 15', expected: '1 3',              hidden: false },
      { input: '3 8 -10 23 19 -4 -14 27', expected: '-14 -10\n19 23\n23 27', hidden: false },
      { input: '40 100 3',    expected: '3 40',             hidden: true  },
    ],
    hints: [
      'Sort the array.',
      'Find the minimum difference between consecutive elements.',
      'Collect all pairs achieving that minimum.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<vector<int>> minimumAbsDifference(vector<int>& arr) {

    }
};`,
      python: `class Solution:
    def minimumAbsDifference(self, arr: List[int]) -> List[List[int]]:
        `,
      java: `class Solution {
    public List<List<Integer>> minimumAbsDifference(int[] arr) {

    }
}`,
      javascript: `/**
 * @param {number[]} arr
 * @return {number[][]}
 */
var minimumAbsDifference = function(arr) {

};`,
      c: `int** minimumAbsDifference(int* arr, int arrSize, int* returnSize, int** returnColumnSizes) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> arr; int x;
    while (cin >> x) arr.push_back(x);
    Solution sol;
    auto res = sol.minimumAbsDifference(arr);
    for (auto& p : res) cout << p[0] << " " << p[1] << "\\n";
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

arr = list(map(int, sys.stdin.read().split()))
for p in Solution().minimumAbsDifference(arr):
    print(*p)`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        for (List<Integer> p : new Solution().minimumAbsDifference(arr))
            System.out.println(p.get(0) + " " + p.get(1));
    }
}`,
      javascript: `const arr = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

for (const p of minimumAbsDifference(arr)) console.log(p[0] + ' ' + p[1]);`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int arr[100001], n = 0;
    while (scanf("%d", &arr[n]) == 1) n++;
    int retSize; int *retColSizes;
    int **res = minimumAbsDifference(arr, n, &retSize, &retColSizes);
    for (int i = 0; i < retSize; i++) printf("%d %d\\n", res[i][0], res[i][1]);
    return 0;
}`,
    },
    aiContext: 'Minimum Absolute Difference — sort + scan O(n log n)',
  },

  // ── 128. Sort Array by Parity ─────────────────────────────────────────────────
  {
    number: 128, title: 'Sort Array by Parity', slug: 'sort-array-by-parity', difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Amazon', 'Google'],
    acceptance: 75.9, premium: false,
    description: `Given an integer array <code>nums</code>, move all even integers to the beginning followed by all odd integers. Return any valid answer. Print space-separated.`,
    examples: [
      { input: '3 1 2 4', output: '4 2 1 3', explanation: 'Evens first, then odds (any order within each group)' },
      { input: '0',       output: '0' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5000', '0 ≤ nums[i] ≤ 5000'],
    testCases: [
      { input: '3 1 2 4', expected: '2 4 3 1', hidden: false },
      { input: '0',       expected: '0',        hidden: false },
      { input: '1 3 2',   expected: '2 1 3',    hidden: true  },
      { input: '2 4 6',   expected: '2 4 6',    hidden: true  },
    ],
    hints: [
      'Use two pointers: left starts at 0, right at end.',
      'Swap when left is odd and right is even.',
      'Or use stable partition.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] sortArrayByParity(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParity = function(nums) {

};`,
      c: `int* sortArrayByParity(int* nums, int numsSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    auto res = sol.sortArrayByParity(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(*Solution().sortArrayByParity(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int[] res = new Solution().sortArrayByParity(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(sortArrayByParity(nums).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[5001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize;
    int *res = sortArrayByParity(nums, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\\n");
    return 0;
}`,
    },
    aiContext: 'Sort Array by Parity — two pointers O(n)',
  },

  // ── 129. Height Checker ───────────────────────────────────────────────────────
  {
    number: 129, title: 'Height Checker', slug: 'height-checker', difficulty: 'Easy',
    tags: ['Array', 'Sorting', 'Counting Sort'], companies: ['Amazon', 'Google'],
    acceptance: 75.4, premium: false,
    description: `Students are asked to stand in non-decreasing order by height. Return the number of students not standing in the correct position.`,
    examples: [
      { input: '1 1 4 2 1 3', output: '3' },
      { input: '5 1 2 3 4',   output: '5' },
      { input: '1 2 3 4 5',   output: '0' },
    ],
    constraints: ['1 ≤ heights.length ≤ 100', '1 ≤ heights[i] ≤ 100'],
    testCases: [
      { input: '1 1 4 2 1 3', expected: '3', hidden: false },
      { input: '5 1 2 3 4',   expected: '5', hidden: false },
      { input: '1 2 3 4 5',   expected: '0', hidden: false },
      { input: '2 1',         expected: '2', hidden: true  },
    ],
    hints: [
      'Sort a copy of the array.',
      'Count positions where original != sorted.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int heightChecker(vector<int>& heights) {

    }
};`,
      python: `class Solution:
    def heightChecker(self, heights: List[int]) -> int:
        `,
      java: `class Solution {
    public int heightChecker(int[] heights) {

    }
}`,
      javascript: `/**
 * @param {number[]} heights
 * @return {number}
 */
var heightChecker = function(heights) {

};`,
      c: `int heightChecker(int* heights, int heightsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> h; int x;
    while (cin >> x) h.push_back(x);
    Solution sol;
    cout << sol.heightChecker(h) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

h = list(map(int, sys.stdin.read().split()))
print(Solution().heightChecker(h))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] h = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().heightChecker(h));
    }
}`,
      javascript: `const h = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(heightChecker(h));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int h[101], n = 0;
    while (scanf("%d", &h[n]) == 1) n++;
    printf("%d\\n", heightChecker(h, n));
    return 0;
}`,
    },
    aiContext: 'Height Checker — sort and compare O(n log n)',
  },

  // ── 130. Third Maximum Number ─────────────────────────────────────────────────
  {
    number: 130, title: 'Third Maximum Number', slug: 'third-maximum-number', difficulty: 'Easy',
    tags: ['Array', 'Sorting'], companies: ['Amazon', 'Google', 'Apple'],
    acceptance: 33.9, premium: false,
    description: `Given an integer array <code>nums</code>, return the <strong>third distinct maximum</strong> number. If it does not exist, return the maximum.`,
    examples: [
      { input: '3 2 1',   output: '1', explanation: 'Third max is 1' },
      { input: '1 2',     output: '2', explanation: 'No third max, return max' },
      { input: '2 2 3 1', output: '1', explanation: 'Third distinct max is 1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-2³¹ ≤ nums[i] ≤ 2³¹-1'],
    testCases: [
      { input: '3 2 1',   expected: '1', hidden: false },
      { input: '1 2',     expected: '2', hidden: false },
      { input: '2 2 3 1', expected: '1', hidden: false },
      { input: '1 1 1',   expected: '1', hidden: true  },
      { input: '1 2 3 4', expected: '2', hidden: true  },
    ],
    hints: [
      'Use a sorted set of size at most 3.',
      'Track top-3 distinct maximums.',
      'If fewer than 3 distinct values exist, return the maximum.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int thirdMax(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def thirdMax(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int thirdMax(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function(nums) {

};`,
      c: `int thirdMax(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.thirdMax(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().thirdMax(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().thirdMax(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);

__USER_CODE__

console.log(thirdMax(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[10001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\\n", thirdMax(nums, n));
    return 0;
}`,
    },
    aiContext: 'Third Maximum Number — top-3 set O(n)',
  },


  // ── PROBLEMS 131–140 ──────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 131. Add Digits ───────────────────────────────────────────────────────────
  {
    number: 131, title: 'Add Digits', slug: 'add-digits', difficulty: 'Easy',
    tags: ['Math', 'Simulation', 'Number Theory'], companies: ['Amazon', 'Google'],
    acceptance: 63.4, premium: false,
    description: `Given an integer <code>num</code>, repeatedly add all its digits until the result has only one digit, and return it.`,
    examples: [
      { input: '38', output: '2', explanation: '3+8=11, 1+1=2' },
      { input: '0',  output: '0' },
    ],
    constraints: ['0 ≤ num ≤ 2³¹-1'],
    testCases: [
      { input: '38',  expected: '2', hidden: false },
      { input: '0',   expected: '0', hidden: false },
      { input: '9',   expected: '9', hidden: true  },
      { input: '100', expected: '1', hidden: true  },
      { input: '199', expected: '1', hidden: true  },
    ],
    hints: [
      'Digital root formula: if num == 0 return 0, else return 1 + (num-1) % 9.',
      'Or just simulate repeatedly summing digits.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int addDigits(int num) {

    }
};`,
      python: `class Solution:
    def addDigits(self, num: int) -> int:
        `,
      java: `class Solution {
    public int addDigits(int num) {

    }
}`,
      javascript: `/**
 * @param {number} num
 * @return {number}
 */
var addDigits = function(num) {

};`,
      c: `int addDigits(int num) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int num; cin >> num;
    Solution sol;
    cout << sol.addDigits(num) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

num = int(sys.stdin.read().strip())
print(Solution().addDigits(num))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int num = new Scanner(System.in).nextInt();
        System.out.println(new Solution().addDigits(num));
    }
}`,
      javascript: `const num = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(addDigits(num));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int num; scanf("%d", &num);
    printf("%d\\n", addDigits(num));
    return 0;
}`,
    },
    aiContext: 'Add Digits — digital root formula O(1)',
  },

  // ── 132. Happy Number ─────────────────────────────────────────────────────────
  {
    number: 132, title: 'Happy Number', slug: 'happy-number', difficulty: 'Easy',
    tags: ['Hash Table', 'Math', 'Two Pointers'], companies: ['Amazon', 'Apple', 'Uber'],
    acceptance: 54.2, premium: false,
    description: `A happy number is defined by the process: starting with any positive integer, replace it with the sum of squares of its digits, and repeat until it equals 1 (happy) or loops forever (not happy). Return <code>true</code> if happy.`,
    examples: [
      { input: '19', output: 'true',  explanation: '1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1' },
      { input: '2',  output: 'false' },
    ],
    constraints: ['1 ≤ n ≤ 2³¹-1'],
    testCases: [
      { input: '19', expected: 'true',  hidden: false },
      { input: '2',  expected: 'false', hidden: false },
      { input: '1',  expected: 'true',  hidden: true  },
      { input: '7',  expected: 'true',  hidden: true  },
      { input: '4',  expected: 'false', hidden: true  },
    ],
    hints: [
      'Use a set to detect cycles.',
      'Or use Floyd\'s cycle detection (slow/fast pointers).',
      'Numbers not happy will cycle through a known set.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool isHappy(int n) {

    }
};`,
      python: `class Solution:
    def isHappy(self, n: int) -> bool:
        `,
      java: `class Solution {
    public boolean isHappy(int n) {

    }
}`,
      javascript: `/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {

};`,
      c: `bool isHappy(int n) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << (sol.isHappy(n) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(str(Solution().isHappy(n)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().isHappy(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(String(isHappy(n)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", isHappy(n) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Happy Number — hash set cycle detection O(log n)',
  },

  // ── 133. Excel Sheet Column Number ───────────────────────────────────────────
  {
    number: 133, title: 'Excel Sheet Column Number', slug: 'excel-sheet-column-number', difficulty: 'Easy',
    tags: ['Math', 'String'], companies: ['Microsoft', 'Google', 'Amazon'],
    acceptance: 62.3, premium: false,
    description: `Given a string <code>columnTitle</code> representing an Excel column title, return its corresponding column number.<br><br>A → 1, B → 2, ..., Z → 26, AA → 27, AB → 28, ...`,
    examples: [
      { input: 'A',   output: '1'   },
      { input: 'AB',  output: '28'  },
      { input: 'ZY',  output: '701' },
    ],
    constraints: ['1 ≤ columnTitle.length ≤ 7', 'columnTitle consists of uppercase English letters'],
    testCases: [
      { input: 'A',    expected: '1',    hidden: false },
      { input: 'AB',   expected: '28',   hidden: false },
      { input: 'ZY',   expected: '701',  hidden: false },
      { input: 'Z',    expected: '26',   hidden: true  },
      { input: 'AAA',  expected: '703',  hidden: true  },
    ],
    hints: [
      'Treat it as base-26 number system.',
      'result = result * 26 + (char - \'A\' + 1).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int titleToNumber(string columnTitle) {

    }
};`,
      python: `class Solution:
    def titleToNumber(self, columnTitle: str) -> int:
        `,
      java: `class Solution {
    public int titleToNumber(String columnTitle) {

    }
}`,
      javascript: `/**
 * @param {string} columnTitle
 * @return {number}
 */
var titleToNumber = function(columnTitle) {

};`,
      c: `int titleToNumber(char* columnTitle) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; cin >> s;
    Solution sol;
    cout << sol.titleToNumber(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().titleToNumber(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).next().trim();
        System.out.println(new Solution().titleToNumber(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(titleToNumber(s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    char s[8]; scanf("%s", s);
    printf("%d\\n", titleToNumber(s));
    return 0;
}`,
    },
    aiContext: 'Excel Sheet Column Number — base-26 conversion O(n)',
  },

  // ── 134. Excel Sheet Column Title ─────────────────────────────────────────────
  {
    number: 134, title: 'Excel Sheet Column Title', slug: 'excel-sheet-column-title', difficulty: 'Easy',
    tags: ['Math', 'String'], companies: ['Microsoft', 'Amazon', 'Google'],
    acceptance: 36.7, premium: false,
    description: `Given an integer <code>columnNumber</code>, return its corresponding Excel column title.<br><br>1 → A, 2 → B, ..., 26 → Z, 27 → AA, 28 → AB, ...`,
    examples: [
      { input: '1',   output: 'A'   },
      { input: '28',  output: 'AB'  },
      { input: '701', output: 'ZY'  },
    ],
    constraints: ['1 ≤ columnNumber ≤ 2³¹-1'],
    testCases: [
      { input: '1',   expected: 'A',   hidden: false },
      { input: '28',  expected: 'AB',  hidden: false },
      { input: '701', expected: 'ZY',  hidden: false },
      { input: '26',  expected: 'Z',   hidden: true  },
      { input: '703', expected: 'AAA', hidden: true  },
    ],
    hints: [
      'Subtract 1 before taking mod 26 to handle the Z case.',
      'Prepend the character to the result string.',
      'Repeat until columnNumber is 0.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string convertToTitle(int columnNumber) {

    }
};`,
      python: `class Solution:
    def convertToTitle(self, columnNumber: int) -> str:
        `,
      java: `class Solution {
    public String convertToTitle(int columnNumber) {

    }
}`,
      javascript: `/**
 * @param {number} columnNumber
 * @return {string}
 */
var convertToTitle = function(columnNumber) {

};`,
      c: `char* convertToTitle(int columnNumber) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int n; cin >> n;
    Solution sol;
    cout << sol.convertToTitle(n) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

n = int(sys.stdin.read().strip())
print(Solution().convertToTitle(n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        System.out.println(new Solution().convertToTitle(n));
    }
}`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(convertToTitle(n));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", convertToTitle(n));
    return 0;
}`,
    },
    aiContext: 'Excel Sheet Column Title — base-26 reverse O(log n)',
  },

  // ── 135. Contains Nearby Duplicate ───────────────────────────────────────────
  {
    number: 135, title: 'Contains Duplicate II', slug: 'contains-duplicate-ii', difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sliding Window'], companies: ['Palantir', 'Airbnb', 'Amazon'],
    acceptance: 43.5, premium: false,
    description: `Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if there are two distinct indices <code>i</code> and <code>j</code> such that <code>nums[i] == nums[j]</code> and <code>|i - j| <= k</code>.<br><br>First line: space-separated nums. Second line: k.`,
    examples: [
      { input: '1 2 3 1\n3',       output: 'true'  },
      { input: '1 0 1 1\n1',       output: 'true'  },
      { input: '1 2 3 1 2 3\n2',   output: 'false' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹', '0 ≤ k ≤ 10⁵'],
    testCases: [
      { input: '1 2 3 1\n3',     expected: 'true',  hidden: false },
      { input: '1 0 1 1\n1',     expected: 'true',  hidden: false },
      { input: '1 2 3 1 2 3\n2', expected: 'false', hidden: false },
      { input: '1 2 1\n0',       expected: 'false', hidden: true  },
    ],
    hints: [
      'Use a hash map storing the most recent index of each value.',
      'If nums[i] was seen at index j and i - j <= k, return true.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        `,
      java: `class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {

};`,
      c: `bool containsNearbyDuplicate(int* nums, int numsSize, int k) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line);
    vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int k; cin >> k;
    Solution sol;
    cout << (sol.containsNearbyDuplicate(nums, k) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
nums = list(map(int, lines[0].split()))
k = int(lines[1].strip())
print(str(Solution().containsNearbyDuplicate(nums, k)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = sc.nextInt();
        System.out.println(new Solution().containsNearbyDuplicate(nums, k));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number), k = parseInt(lines[1]);

__USER_CODE__

console.log(String(containsNearbyDuplicate(nums, k)));`,
      c: `#include <stdio.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0, k;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &k);
    printf("%s\\n", containsNearbyDuplicate(nums, n, k) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Contains Duplicate II — hash map index tracking O(n)',
  },

  // ── 136. Implement Stack using Queues ─────────────────────────────────────────
  {
    number: 136, title: 'Implement Stack using Queues', slug: 'implement-stack-using-queues', difficulty: 'Easy',
    tags: ['Stack', 'Design', 'Queue'], companies: ['Bloomberg', 'Microsoft', 'Amazon'],
    acceptance: 56.2, premium: false,
    description: `Implement a last-in-first-out (LIFO) stack using only two queues.<br><br>Input: operations one per line (<code>push v</code>, <code>pop</code>, <code>top</code>, <code>empty</code>). Print result of <code>pop</code>, <code>top</code>, <code>empty</code>.`,
    examples: [
      { input: 'push 1\npush 2\ntop\npop\nempty', output: '2\n2\nfalse' },
    ],
    constraints: ['1 ≤ x ≤ 9', 'At most 100 calls', 'pop/top called on non-empty stack'],
    testCases: [
      { input: 'push 1\npush 2\ntop\npop\nempty', expected: '2\n2\nfalse', hidden: false },
      { input: 'push 1\ntop\npop\nempty',          expected: '1\n1\ntrue', hidden: true  },
      { input: 'push 3\npush 5\ntop\npop\ntop',    expected: '5\n5\n3',   hidden: true  },
    ],
    hints: [
      'On push, enqueue to main queue then rotate all existing elements to the back.',
      'This keeps newest element at front for O(n) push, O(1) top/pop.',
    ],
    starter: {
      cpp: `class MyStack {
public:
    MyStack() {

    }

    void push(int x) {

    }

    int pop() {

    }

    int top() {

    }

    bool empty() {

    }
};`,
      python: `class MyStack:

    def __init__(self):


    def push(self, x: int) -> None:


    def pop(self) -> int:


    def top(self) -> int:


    def empty(self) -> bool:
        `,
      java: `class MyStack {

    public MyStack() {

    }

    public void push(int x) {

    }

    public int pop() {

    }

    public int top() {

    }

    public boolean empty() {

    }
}`,
      javascript: `var MyStack = function() {

};

MyStack.prototype.push = function(x) {

};

MyStack.prototype.pop = function() {

};

MyStack.prototype.top = function() {

};

MyStack.prototype.empty = function() {

};`,
      c: `typedef struct MyStack MyStack;

MyStack* myStackCreate() {

}

void myStackPush(MyStack* obj, int x) {

}

int myStackPop(MyStack* obj) {

}

int myStackTop(MyStack* obj) {

}

bool myStackEmpty(MyStack* obj) {

}

void myStackFree(MyStack* obj) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    MyStack st;
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        if (line.substr(0, 4) == "push") { int v = stoi(line.substr(5)); st.push(v); }
        else if (line == "pop")   cout << st.pop()   << "\\n";
        else if (line == "top")   cout << st.top()   << "\\n";
        else if (line == "empty") cout << (st.empty() ? "true" : "false") << "\\n";
    }
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
st = MyStack()
for line in lines:
    parts = line.split()
    if parts[0] == 'push': st.push(int(parts[1]))
    elif parts[0] == 'pop':   print(st.pop())
    elif parts[0] == 'top':   print(st.top())
    elif parts[0] == 'empty': print(str(st.empty()).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MyStack st = new MyStack();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim(); if (line.isEmpty()) continue;
            String[] parts = line.split(" ");
            if (parts[0].equals("push")) st.push(Integer.parseInt(parts[1]));
            else if (parts[0].equals("pop"))   System.out.println(st.pop());
            else if (parts[0].equals("top"))   System.out.println(st.top());
            else if (parts[0].equals("empty")) System.out.println(st.empty());
        }
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');

__USER_CODE__

const st = new MyStack();
for (const line of lines) {
    const parts = line.trim().split(' ');
    if (parts[0] === 'push') st.push(parseInt(parts[1]));
    else if (parts[0] === 'pop')   console.log(st.pop());
    else if (parts[0] === 'top')   console.log(st.top());
    else if (parts[0] === 'empty') console.log(String(st.empty()));
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    MyStack *st = myStackCreate();
    char line[50];
    while (fgets(line, sizeof(line), stdin)) {
        if (line[0] == '\\n') continue;
        if (strncmp(line, "push", 4) == 0) { int v = atoi(line + 5); myStackPush(st, v); }
        else if (strncmp(line, "pop", 3) == 0)   printf("%d\\n", myStackPop(st));
        else if (strncmp(line, "top", 3) == 0)   printf("%d\\n", myStackTop(st));
        else if (strncmp(line, "empty", 5) == 0) printf("%s\\n", myStackEmpty(st) ? "true" : "false");
    }
    myStackFree(st); return 0;
}`,
    },
    aiContext: 'Implement Stack using Queues — one queue trick O(n) push',
  },

  // ── 137. Reverse Vowels of a String ──────────────────────────────────────────
  {
    number: 137, title: 'Reverse Vowels of a String', slug: 'reverse-vowels-of-a-string', difficulty: 'Easy',
    tags: ['Two Pointers', 'String'], companies: ['Google', 'Amazon'],
    acceptance: 49.2, premium: false,
    description: `Given a string <code>s</code>, reverse only all the vowels in the string and return it.`,
    examples: [
      { input: 'IceCreAm', output: 'AceCreIm', explanation: 'Vowels: I, e, e, A → reversed: A, e, e, I' },
      { input: 'leetcode', output: 'leetcode' },
    ],
    constraints: ['1 ≤ s.length ≤ 3×10⁵', 's consists of printable ASCII characters'],
    testCases: [
      { input: 'IceCreAm', expected: 'AceCreIm', hidden: false },
      { input: 'leetcode', expected: 'leetcode', hidden: false },
      { input: 'hello',    expected: 'holle',    hidden: true  },
      { input: 'aeiou',    expected: 'uoiea',    hidden: true  },
    ],
    hints: [
      'Use two pointers: left at start, right at end.',
      'Move each toward center until both are on vowels.',
      'Swap and continue.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string reverseVowels(string s) {

    }
};`,
      python: `class Solution:
    def reverseVowels(self, s: str) -> str:
        `,
      java: `class Solution {
    public String reverseVowels(String s) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {

};`,
      c: `char* reverseVowels(char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    Solution sol;
    cout << sol.reverseVowels(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().reverseVowels(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        System.out.println(new Solution().reverseVowels(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(reverseVowels(s));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[300001];
    fgets(s, sizeof(s), stdin);
    int n = strlen(s); if (s[n-1] == '\\n') s[--n] = '\\0';
    printf("%s\\n", reverseVowels(s));
    return 0;
}`,
    },
    aiContext: 'Reverse Vowels of a String — two pointers O(n)',
  },

  // ── 138. Intersection of Two Arrays ──────────────────────────────────────────
  {
    number: 138, title: 'Intersection of Two Arrays', slug: 'intersection-of-two-arrays', difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Two Pointers', 'Binary Search', 'Sorting'], companies: ['LinkedIn', 'Google', 'Amazon'],
    acceptance: 71.4, premium: false,
    description: `Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection (each element appears once). Print space-separated (sorted).<br><br>First line: nums1. Second line: nums2.`,
    examples: [
      { input: '1 2 2 1\n2 2', output: '2'   },
      { input: '4 9 5\n9 4 9 8 4', output: '4 9' },
    ],
    constraints: ['1 ≤ nums1.length, nums2.length ≤ 1000', '0 ≤ nums1[i], nums2[i] ≤ 1000'],
    testCases: [
      { input: '1 2 2 1\n2 2',      expected: '2',   hidden: false },
      { input: '4 9 5\n9 4 9 8 4',  expected: '4 9', hidden: false },
      { input: '1\n2',              expected: '',     hidden: true  },
      { input: '1 2 3\n3 2 1',      expected: '1 2 3', hidden: true },
    ],
    hints: [
      'Put nums1 elements in a set.',
      'Check which elements of nums2 are in that set.',
      'Return unique results.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {

    }
};`,
      python: `class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {

};`,
      c: `int* intersection(int* nums1, int nums1Size, int* nums2, int nums2Size, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    istringstream s1(l1), s2(l2);
    vector<int> n1, n2; int x;
    while (s1 >> x) n1.push_back(x);
    while (s2 >> x) n2.push_back(x);
    Solution sol;
    auto res = sol.intersection(n1, n2);
    sort(res.begin(), res.end());
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
n1 = list(map(int, lines[0].split()))
n2 = list(map(int, lines[1].split()))
print(*sorted(Solution().intersection(n1, n2)))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] n1 = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] n2 = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] res = new Solution().intersection(n1, n2);
        Arrays.sort(res);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n1 = lines[0].split(' ').map(Number);
const n2 = lines[1].split(' ').map(Number);

__USER_CODE__

console.log(intersection(n1, n2).sort((a,b)=>a-b).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int cmp(const void *a, const void *b) { return *(int*)a - *(int*)b; }
int main() {
    int n1[1001], n2[1001], sz1 = 0, sz2 = 0;
    char buf[10000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } n1[sz1++] = strtol(p, &p, 10); }
    fgets(buf, sizeof(buf), stdin); p = buf;
    while (*p && *p != '\\n') { if (*p == ' ') { p++; continue; } n2[sz2++] = strtol(p, &p, 10); }
    int retSize;
    int *res = intersection(n1, sz1, n2, sz2, &retSize);
    qsort(res, retSize, sizeof(int), cmp);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\\n"); return 0;
}`,
    },
    aiContext: 'Intersection of Two Arrays — hash set O(n+m)',
  },

  // ── 139. Word Pattern ─────────────────────────────────────────────────────────
  {
    number: 139, title: 'Word Pattern', slug: 'word-pattern', difficulty: 'Easy',
    tags: ['Hash Table', 'String'], companies: ['Dropbox', 'Uber', 'Amazon'],
    acceptance: 42.3, premium: false,
    description: `Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern. Each letter in pattern maps to exactly one word and vice versa.<br><br>First line: pattern. Second line: s (space-separated words).`,
    examples: [
      { input: 'abba\ndog cat cat dog',  output: 'true'  },
      { input: 'abba\ndog cat cat fish', output: 'false' },
      { input: 'aaaa\ndog cat cat dog',  output: 'false' },
    ],
    constraints: ['1 ≤ pattern.length ≤ 300', '1 ≤ s.length ≤ 3000', 'pattern consists of lowercase English letters', 's consists of lowercase English letters and spaces'],
    testCases: [
      { input: 'abba\ndog cat cat dog',  expected: 'true',  hidden: false },
      { input: 'abba\ndog cat cat fish', expected: 'false', hidden: false },
      { input: 'aaaa\ndog cat cat dog',  expected: 'false', hidden: false },
      { input: 'aaa\naa aa aa aa',       expected: 'false', hidden: true  },
    ],
    hints: [
      'Map each pattern character to a word and each word to a pattern character.',
      'Both mappings must be consistent (bijection).',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool wordPattern(string pattern, string s) {

    }
};`,
      python: `class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        `,
      java: `class Solution {
    public boolean wordPattern(String pattern, String s) {

    }
}`,
      javascript: `/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function(pattern, s) {

};`,
      c: `bool wordPattern(char* pattern, char* s) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string pattern, s;
    getline(cin, pattern); getline(cin, s);
    Solution sol;
    cout << (sol.wordPattern(pattern, s) ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\\n')
pattern = lines[0].strip()
s = lines[1].strip() if len(lines) > 1 else ''
print(str(Solution().wordPattern(pattern, s)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String pattern = sc.nextLine().trim();
        String s = sc.nextLine().trim();
        System.out.println(new Solution().wordPattern(pattern, s));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const pattern = lines[0].trim(), s = (lines[1] || '').trim();

__USER_CODE__

console.log(String(wordPattern(pattern, s)));`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

__USER_CODE__

int main() {
    char pattern[301], s[3001];
    fgets(pattern, sizeof(pattern), stdin);
    fgets(s, sizeof(s), stdin);
    int np = strlen(pattern), ns = strlen(s);
    if (pattern[np-1] == '\\n') pattern[--np] = '\\0';
    if (s[ns-1] == '\\n') s[--ns] = '\\0';
    printf("%s\\n", wordPattern(pattern, s) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Word Pattern — bijection hash map O(n)',
  },

  // ── 140. Is Subsequence (Follow-Up) ──────────────────────────────────────────
  {
    number: 140, title: 'Number of Matching Subsequences', slug: 'number-of-matching-subsequences', difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Trie', 'Sorting'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 52.1, premium: false,
    description: `Given a string <code>s</code> and an array of strings <code>words</code>, return the number of <code>words[i]</code> that is a subsequence of <code>s</code>.<br><br>First line: s. Second line: space-separated words.`,
    examples: [
      { input: 'abcde\na bb acd ace',   output: '3', explanation: 'a, acd, ace are subsequences' },
      { input: 'dsahjpjauf\nahjpjau jd ua anbr aje', output: '2' },
    ],
    constraints: ['1 ≤ s.length ≤ 5×10⁴', '1 ≤ words.length ≤ 5000', '1 ≤ words[i].length ≤ 50'],
    testCases: [
      { input: 'abcde\na bb acd ace',             expected: '3', hidden: false },
      { input: 'dsahjpjauf\nahjpjau jd ua anbr aje', expected: '2', hidden: false },
      { input: 'abc\nabc bc c',                   expected: '3', hidden: true  },
      { input: 'ahbgdc\ngreat fantastic good',    expected: '0', hidden: true  },
    ],
    hints: [
      'For each word, check if it is a subsequence of s using two pointers.',
      'Batch by first character for efficiency.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int numMatchingSubseq(string s, vector<string>& words) {

    }
};`,
      python: `class Solution:
    def numMatchingSubseq(self, s: str, words: List[str]) -> int:
        `,
      java: `class Solution {
    public int numMatchingSubseq(String s, String[] words) {

    }
}`,
      javascript: `/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function(s, words) {

};`,
      c: `int numMatchingSubseq(char* s, char** words, int wordsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; getline(cin, s);
    string line; getline(cin, line);
    istringstream ss(line);
    vector<string> words; string w;
    while (ss >> w) words.push_back(w);
    Solution sol;
    cout << sol.numMatchingSubseq(s, words) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\\n')
s = lines[0]
words = lines[1].split() if len(lines) > 1 else []
print(Solution().numMatchingSubseq(s, words))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        String[] words = sc.hasNextLine() ? sc.nextLine().trim().split(" ") : new String[]{};
        System.out.println(new Solution().numMatchingSubseq(s, words));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const s = lines[0];
const words = lines[1] ? lines[1].split(' ') : [];

__USER_CODE__

console.log(numMatchingSubseq(s, words));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__USER_CODE__

int main() {
    char s[50001]; fgets(s, sizeof(s), stdin);
    int ns = strlen(s); if (s[ns-1] == '\\n') s[--ns] = '\\0';
    char words[5001][51]; int nw = 0;
    char line[255001]; fgets(line, sizeof(line), stdin);
    char *p = strtok(line, " \\n");
    while (p && nw < 5000) { strncpy(words[nw++], p, 50); words[nw-1][50] = '\\0'; p = strtok(NULL, " \\n"); }
    char *ptrs[5001]; for (int i = 0; i < nw; i++) ptrs[i] = words[i];
    printf("%d\\n", numMatchingSubseq(s, ptrs, nw));
    return 0;
}`,
    },
    aiContext: 'Number of Matching Subsequences — bucket by first char O(n + sum of word lengths)',
  },


  // ── PROBLEMS 141–150 ──────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 141. Count Odd Numbers in an Interval Range ───────────────────────────────
  {
    number: 141, title: 'Count Odd Numbers in an Interval Range', slug: 'count-odd-numbers-in-an-interval-range', difficulty: 'Easy',
    tags: ['Math'], companies: ['Amazon', 'Google'],
    acceptance: 56.1, premium: false,
    description: `Given two non-negative integers <code>low</code> and <code>high</code>, return the count of odd numbers between <code>low</code> and <code>high</code> (inclusive).<br><br>Input: two integers on one line.`,
    examples: [
      { input: '3 7',  output: '3', explanation: 'Odd numbers: 3, 5, 7' },
      { input: '8 10', output: '1', explanation: 'Odd number: 9' },
    ],
    constraints: ['0 ≤ low ≤ high ≤ 10⁹'],
    testCases: [
      { input: '3 7',   expected: '3', hidden: false },
      { input: '8 10',  expected: '1', hidden: false },
      { input: '0 0',   expected: '0', hidden: true  },
      { input: '1 1',   expected: '1', hidden: true  },
      { input: '0 100', expected: '50', hidden: true },
    ],
    hints: [
      'Count odds from 0 to n = (n + 1) / 2.',
      'Answer = countOdds(high) - countOdds(low - 1).',
    ],
    starter: {
      cpp: `class Solution {
public:
    int countOdds(int low, int high) {

    }
};`,
      python: `class Solution:
    def countOdds(self, low: int, high: int) -> int:
        `,
      java: `class Solution {
    public int countOdds(int low, int high) {

    }
}`,
      javascript: `/**
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var countOdds = function(low, high) {

};`,
      c: `int countOdds(int low, int high) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int low, high; cin >> low >> high;
    Solution sol;
    cout << sol.countOdds(low, high) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

low, high = map(int, sys.stdin.read().split())
print(Solution().countOdds(low, high))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int low = sc.nextInt(), high = sc.nextInt();
        System.out.println(new Solution().countOdds(low, high));
    }
}`,
      javascript: `const [low, high] = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

__USER_CODE__

console.log(countOdds(low, high));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int low, high; scanf("%d %d", &low, &high);
    printf("%d\n", countOdds(low, high));
    return 0;
}`,
    },
    aiContext: 'Count Odd Numbers in Interval — math formula O(1)',
  },

  // ── 142. Minimum Operations to Reduce X to Zero ───────────────────────────────
  {
    number: 142, title: 'Minimum Operations to Reduce X to Zero', slug: 'minimum-operations-to-reduce-x-to-zero', difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Binary Search', 'Sliding Window', 'Prefix Sum'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 33.7, premium: false,
    description: `Given an integer array <code>nums</code> and an integer <code>x</code>, return the minimum number of operations to reduce <code>x</code> to exactly 0 by removing elements from either end. Return -1 if impossible.<br><br>First line: space-separated nums. Second line: x.`,
    examples: [
      { input: '1 1 4 2 3\n5',       output: '2', explanation: 'Remove 3 and 2 from right' },
      { input: '5 6 7 8 9\n4',       output: '-1' },
      { input: '3 2 20 1 1 3\n10',   output: '5' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁴', '1 ≤ x ≤ 10⁹'],
    testCases: [
      { input: '1 1 4 2 3\n5',     expected: '2',  hidden: false },
      { input: '5 6 7 8 9\n4',     expected: '-1', hidden: false },
      { input: '3 2 20 1 1 3\n10', expected: '5',  hidden: false },
      { input: '1 1\n3',           expected: '-1', hidden: true  },
    ],
    hints: [
      'Equivalent to finding the longest subarray with sum = total - x.',
      'Use a sliding window or prefix sum hash map.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int minOperations(vector<int>& nums, int x) {

    }
};`,
      python: `class Solution:
    def minOperations(self, nums: List[int], x: int) -> int:
        `,
      java: `class Solution {
    public int minOperations(int[] nums, int x) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} x
 * @return {number}
 */
var minOperations = function(nums, x) {

};`,
      c: `int minOperations(int* nums, int numsSize, int x) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int n;
    while (ss >> n) nums.push_back(n);
    int x; cin >> x;
    Solution sol;
    cout << sol.minOperations(nums, x) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
nums = list(map(int, lines[0].split()))
x = int(lines[1].strip())
print(Solution().minOperations(nums, x))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int x = sc.nextInt();
        System.out.println(new Solution().minOperations(nums, x));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const nums = lines[0].split(' ').map(Number), x = parseInt(lines[1]);

__USER_CODE__

console.log(minOperations(nums, x));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0, x;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &x);
    printf("%d\n", minOperations(nums, n, x));
    return 0;
}`,
    },
    aiContext: 'Minimum Operations to Reduce X to Zero — sliding window on complement O(n)',
  },

  // ── 143. K Radius Subarray Averages ──────────────────────────────────────────
  {
    number: 143, title: 'K Radius Subarray Averages', slug: 'k-radius-subarray-averages', difficulty: 'Medium',
    tags: ['Array', 'Sliding Window', 'Prefix Sum'], companies: ['Google', 'Amazon'],
    acceptance: 47.9, premium: false,
    description: `Given a 0-indexed array <code>nums</code> and integer <code>k</code>, return an array <code>avgs</code> of length <code>n</code> where <code>avgs[i]</code> is the average (floor) of the subarray <code>nums[i-k..i+k]</code>, or -1 if the window doesn't fully exist.<br><br>First line: space-separated nums. Second line: k.`,
    examples: [
      { input: '7 4 3 9 1 8 5 2 6\n3', output: '-1 -1 -1 5 4 4 -1 -1 -1' },
      { input: '100000\n0',             output: '100000' },
      { input: '8\n100000',             output: '-1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '0 ≤ nums[i], k ≤ 10⁵'],
    testCases: [
      { input: '7 4 3 9 1 8 5 2 6\n3', expected: '-1 -1 -1 5 4 4 -1 -1 -1', hidden: false },
      { input: '100000\n0',             expected: '100000',                   hidden: false },
      { input: '8\n100000',             expected: '-1',                       hidden: true  },
    ],
    hints: [
      'Use prefix sums for O(1) range queries.',
      'Window size = 2*k+1; check bounds before computing average.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> getAverages(vector<int>& nums, int k) {

    }
};`,
      python: `class Solution:
    def getAverages(self, nums: List[int], k: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] getAverages(int[] nums, int k) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var getAverages = function(nums, k) {

};`,
      c: `int* getAverages(int* nums, int numsSize, int k, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int n;
    while (ss >> n) nums.push_back(n);
    int k; cin >> k;
    Solution sol;
    auto res = sol.getAverages(nums, k);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
nums = list(map(int, lines[0].split()))
k = int(lines[1].strip())
print(*Solution().getAverages(nums, k))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = sc.nextInt();
        int[] res = new Solution().getAverages(nums, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const nums = lines[0].split(' ').map(Number), k = parseInt(lines[1]);

__USER_CODE__

console.log(getAverages(nums, k).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[100001], n = 0, k;
    char buf[2000000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\n') { if (*p == ' ') { p++; continue; } nums[n++] = strtol(p, &p, 10); }
    scanf("%d", &k);
    int retSize; int *res = getAverages(nums, n, k, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\n"); free(res); return 0;
}`,
    },
    aiContext: 'K Radius Subarray Averages — prefix sum O(n)',
  },

  // ── 144. Maximum Difference Between Increasing Elements ───────────────────────
  {
    number: 144, title: 'Maximum Difference Between Increasing Elements', slug: 'maximum-difference-between-increasing-elements', difficulty: 'Easy',
    tags: ['Array'], companies: ['Amazon', 'Google'],
    acceptance: 52.1, premium: false,
    description: `Given a 0-indexed integer array <code>nums</code>, find the maximum difference between <code>nums[j] - nums[i]</code> such that <code>0 ≤ i < j < n</code> and <code>nums[i] < nums[j]</code>. Return -1 if no such pair exists.`,
    examples: [
      { input: '7 1 5 4',   output: '4',  explanation: 'i=1,j=2: 5-1=4' },
      { input: '9 4 3 2',   output: '-1', explanation: 'All decreasing' },
      { input: '1 5 2 10',  output: '9',  explanation: 'i=0,j=3: 10-1=9' },
    ],
    constraints: ['n == nums.length', '2 ≤ n ≤ 1000', '1 ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: '7 1 5 4',  expected: '4',  hidden: false },
      { input: '9 4 3 2',  expected: '-1', hidden: false },
      { input: '1 5 2 10', expected: '9',  hidden: false },
      { input: '1 2',      expected: '1',  hidden: true  },
    ],
    hints: [
      'Track the minimum value seen so far.',
      'For each element, compute current - min so far.',
      'Update the answer and min accordingly.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maximumDifference(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def maximumDifference(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int maximumDifference(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumDifference = function(nums) {

};`,
      c: `int maximumDifference(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.maximumDifference(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().maximumDifference(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().maximumDifference(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

__USER_CODE__

console.log(maximumDifference(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[1001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\n", maximumDifference(nums, n));
    return 0;
}`,
    },
    aiContext: 'Maximum Difference Between Increasing Elements — track min O(n)',
  },

  // ── 145. Greatest Common Divisor of Strings ───────────────────────────────────
  {
    number: 145, title: 'Greatest Common Divisor of Strings', slug: 'greatest-common-divisor-of-strings', difficulty: 'Easy',
    tags: ['Math', 'String'], companies: ['Google', 'Amazon', 'Facebook'],
    acceptance: 52.7, premium: false,
    description: `For two strings <code>s</code> and <code>t</code>, we say "t divides s" if <code>s = t + t + ... + t</code>. Given two strings <code>str1</code> and <code>str2</code>, return the largest string <code>x</code> such that <code>x</code> divides both.<br><br>First line: str1. Second line: str2.`,
    examples: [
      { input: 'ABCABC\nABC', output: 'ABC' },
      { input: 'ABABAB\nABAB', output: 'AB' },
      { input: 'LEET\nCODE',   output: ''   },
    ],
    constraints: ['1 ≤ str1.length, str2.length ≤ 1000', 'str1 and str2 consist of uppercase English letters'],
    testCases: [
      { input: 'ABCABC\nABC', expected: 'ABC', hidden: false },
      { input: 'ABABAB\nABAB', expected: 'AB', hidden: false },
      { input: 'LEET\nCODE',  expected: '',    hidden: false },
      { input: 'AA\nA',       expected: 'A',   hidden: true  },
    ],
    hints: [
      'If str1 + str2 != str2 + str1, return empty.',
      'Otherwise return str1[:gcd(len(str1), len(str2))].',
    ],
    starter: {
      cpp: `class Solution {
public:
    string gcdOfStrings(string str1, string str2) {

    }
};`,
      python: `class Solution:
    def gcdOfStrings(self, str1: str, str2: str) -> str:
        `,
      java: `class Solution {
    public String gcdOfStrings(String str1, String str2) {

    }
}`,
      javascript: `/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
var gcdOfStrings = function(str1, str2) {

};`,
      c: `char* gcdOfStrings(char* str1, char* str2) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s1, s2;
    getline(cin, s1); getline(cin, s2);
    Solution sol;
    cout << sol.gcdOfStrings(s1, s2) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
s1 = lines[0]; s2 = lines[1] if len(lines) > 1 else ''
print(Solution().gcdOfStrings(s1, s2))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.nextLine(), s2 = sc.nextLine();
        System.out.println(new Solution().gcdOfStrings(s1, s2));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\n');
const s1 = lines[0], s2 = lines[1] || '';

__USER_CODE__

console.log(gcdOfStrings(s1, s2));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char s1[1001], s2[1001];
    fgets(s1, sizeof(s1), stdin); fgets(s2, sizeof(s2), stdin);
    int n1 = strlen(s1), n2 = strlen(s2);
    if (s1[n1-1] == '\n') s1[--n1] = '\0';
    if (s2[n2-1] == '\n') s2[--n2] = '\0';
    printf("%s\n", gcdOfStrings(s1, s2));
    return 0;
}`,
    },
    aiContext: 'GCD of Strings — string GCD using length GCD O(n)',
  },

  // ── 146. Kids With the Greatest Number of Candies ─────────────────────────────
  {
    number: 146, title: 'Kids With the Greatest Number of Candies', slug: 'kids-with-the-greatest-number-of-candies', difficulty: 'Easy',
    tags: ['Array'], companies: ['Amazon', 'Google'],
    acceptance: 87.5, premium: false,
    description: `Given an integer array <code>candies</code> (candies[i] = number of candies kid i has) and <code>extraCandies</code>, return a boolean array where result[i] is true if kid i can have the greatest number of candies after receiving all extraCandies.<br><br>First line: candies. Second line: extraCandies.`,
    examples: [
      { input: '2 3 5 1 3\n3', output: 'true true true false true' },
      { input: '4 2 1 1 2\n1', output: 'true false false false false' },
    ],
    constraints: ['2 ≤ candies.length ≤ 100', '1 ≤ candies[i] ≤ 100', '1 ≤ extraCandies ≤ 50'],
    testCases: [
      { input: '2 3 5 1 3\n3', expected: 'true true true false true',       hidden: false },
      { input: '4 2 1 1 2\n1', expected: 'true false false false false',     hidden: false },
      { input: '12 1 12\n10',  expected: 'true false true',                  hidden: true  },
    ],
    hints: [
      'Find the maximum in candies.',
      'For each kid, check if candies[i] + extraCandies >= max.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<bool> kidsWithCandies(vector<int>& candies, int extraCandies) {

    }
};`,
      python: `class Solution:
    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
        `,
      java: `class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {

    }
}`,
      javascript: `/**
 * @param {number[]} candies
 * @param {number} extraCandies
 * @return {boolean[]}
 */
var kidsWithCandies = function(candies, extraCandies) {

};`,
      c: `bool* kidsWithCandies(int* candies, int candiesSize, int extraCandies, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> c; int x;
    while (ss >> x) c.push_back(x);
    int extra; cin >> extra;
    Solution sol;
    auto res = sol.kidsWithCandies(c, extra);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << (res[i] ? "true" : "false");
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
c = list(map(int, lines[0].split()))
extra = int(lines[1].strip())
print(*[str(v).lower() for v in Solution().kidsWithCandies(c, extra)])`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] c = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int extra = sc.nextInt();
        List<Boolean> res = new Solution().kidsWithCandies(c, extra);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) sb.append(i > 0 ? " " : "").append(res.get(i));
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const c = lines[0].split(' ').map(Number), extra = parseInt(lines[1]);

__USER_CODE__

console.log(kidsWithCandies(c, extra).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    int c[101], n = 0, extra;
    char buf[500]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\n') { if (*p == ' ') { p++; continue; } c[n++] = strtol(p, &p, 10); }
    scanf("%d", &extra);
    int retSize; bool *res = kidsWithCandies(c, n, extra, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%s", i ? " " : "", res[i] ? "true" : "false");
    printf("\n"); free(res); return 0;
}`,
    },
    aiContext: 'Kids With Greatest Candies — find max then compare O(n)',
  },

  // ── 147. Richest Customer Wealth ──────────────────────────────────────────────
  {
    number: 147, title: 'Richest Customer Wealth', slug: 'richest-customer-wealth', difficulty: 'Easy',
    tags: ['Array', 'Matrix'], companies: ['Amazon', 'Google'],
    acceptance: 88.4, premium: false,
    description: `You are given an <code>m x n</code> integer grid <code>accounts</code> where <code>accounts[i][j]</code> is the amount of money the <code>i</code>th customer has in the <code>j</code>th bank. Return the wealth of the richest customer (sum of their row).<br><br>Input: m rows of n space-separated integers.`,
    examples: [
      { input: '1 2 3\n3 2 1',     output: '6', explanation: 'Both have wealth 6, return 6' },
      { input: '1 5\n7 3\n3 5',    output: '10' },
      { input: '2 8 7\n7 1 3\n1 9 5', output: '17' },
    ],
    constraints: ['1 ≤ m, n ≤ 50', '1 ≤ accounts[i][j] ≤ 100'],
    testCases: [
      { input: '1 2 3\n3 2 1',     expected: '6',  hidden: false },
      { input: '1 5\n7 3\n3 5',    expected: '10', hidden: false },
      { input: '2 8 7\n7 1 3\n1 9 5', expected: '17', hidden: false },
      { input: '1',                expected: '1',  hidden: true  },
    ],
    hints: [
      'Sum each row and return the maximum.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maximumWealth(vector<vector<int>>& accounts) {

    }
};`,
      python: `class Solution:
    def maximumWealth(self, accounts: List[List[int]]) -> int:
        `,
      java: `class Solution {
    public int maximumWealth(int[][] accounts) {

    }
}`,
      javascript: `/**
 * @param {number[][]} accounts
 * @return {number}
 */
var maximumWealth = function(accounts) {

};`,
      c: `int maximumWealth(int** accounts, int accountsSize, int* accountsColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> acc; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        istringstream ss(line); vector<int> row; int x;
        while (ss >> x) row.push_back(x);
        acc.push_back(row);
    }
    Solution sol; cout << sol.maximumWealth(acc) << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\n')
acc = [list(map(int, l.split())) for l in lines]
print(Solution().maximumWealth(acc))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine().trim(); if (l.isEmpty()) continue; rows.add(Arrays.stream(l.split(" ")).mapToInt(Integer::parseInt).toArray()); }
        System.out.println(new Solution().maximumWealth(rows.toArray(new int[0][])));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const acc = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(maximumWealth(acc));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int m[51][51], rows = 0, cols = 0; char buf[500];
    while (fgets(buf, sizeof(buf), stdin)) {
        if (buf[0] == '\n') continue; char *p = buf; int j = 0;
        while (*p && *p != '\n') { if (*p == ' ') { p++; continue; } m[rows][j++] = strtol(p, &p, 10); }
        cols = j; rows++;
    }
    int *ptrs[51]; int colSizes[51];
    for (int i = 0; i < rows; i++) { ptrs[i] = m[i]; colSizes[i] = cols; }
    printf("%d\n", maximumWealth((int**)ptrs, rows, colSizes)); return 0;
}`,
    },
    aiContext: 'Richest Customer Wealth — row sum max O(m*n)',
  },

  // ── 148. Number of Steps to Reduce a Number to Zero ──────────────────────────
  {
    number: 148, title: 'Number of Steps to Reduce a Number to Zero', slug: 'number-of-steps-to-reduce-a-number-to-zero', difficulty: 'Easy',
    tags: ['Math', 'Bit Manipulation'], companies: ['Amazon', 'Google'],
    acceptance: 85.7, premium: false,
    description: `Given an integer <code>num</code>, return the number of steps to reduce it to zero. In one step: if even, divide by 2; if odd, subtract 1.`,
    examples: [
      { input: '14', output: '6', explanation: '14→7→6→3→2→1→0' },
      { input: '8',  output: '4', explanation: '8→4→2→1→0' },
      { input: '123', output: '12' },
    ],
    constraints: ['0 ≤ num ≤ 10⁶'],
    testCases: [
      { input: '14',  expected: '6',  hidden: false },
      { input: '8',   expected: '4',  hidden: false },
      { input: '123', expected: '12', hidden: false },
      { input: '0',   expected: '0',  hidden: true  },
      { input: '1',   expected: '1',  hidden: true  },
    ],
    hints: [
      'Simulate the process step by step.',
      'Or count bits: number of 1-bits + number of bit positions - 1.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int numberOfSteps(int num) {

    }
};`,
      python: `class Solution:
    def numberOfSteps(self, num: int) -> int:
        `,
      java: `class Solution {
    public int numberOfSteps(int num) {

    }
}`,
      javascript: `/**
 * @param {number} num
 * @return {number}
 */
var numberOfSteps = function(num) {

};`,
      c: `int numberOfSteps(int num) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    int num; cin >> num;
    Solution sol; cout << sol.numberOfSteps(num) << endl; return 0;
}`,
      python: `import sys

__USER_CODE__

num = int(sys.stdin.read().strip())
print(Solution().numberOfSteps(num))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        int num = new Scanner(System.in).nextInt();
        System.out.println(new Solution().numberOfSteps(num));
    }
}`,
      javascript: `const num = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

__USER_CODE__

console.log(numberOfSteps(num));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int num; scanf("%d", &num);
    printf("%d\n", numberOfSteps(num)); return 0;
}`,
    },
    aiContext: 'Number of Steps to Reduce to Zero — simulate O(log n)',
  },

  // ── 149. Shuffle the Array ────────────────────────────────────────────────────
  {
    number: 149, title: 'Shuffle the Array', slug: 'shuffle-the-array', difficulty: 'Easy',
    tags: ['Array'], companies: ['Amazon', 'Google'],
    acceptance: 88.1, premium: false,
    description: `Given an array <code>nums</code> consisting of <code>2n</code> elements in the form <code>[x1,x2,...,xn,y1,y2,...,yn]</code>, return <code>[x1,y1,x2,y2,...,xn,yn]</code>.<br><br>First line: space-separated nums (length 2n). Second line: n.`,
    examples: [
      { input: '2 5 1 3 4 7\n3', output: '2 3 5 4 1 7' },
      { input: '1 2 3 4 4 3 2 1\n4', output: '1 4 2 3 3 2 4 1' },
      { input: '1 1 2 2\n2', output: '1 2 1 2' },
    ],
    constraints: ['1 ≤ n ≤ 500', 'nums.length == 2n', '1 ≤ nums[i] ≤ 10³'],
    testCases: [
      { input: '2 5 1 3 4 7\n3',       expected: '2 3 5 4 1 7',     hidden: false },
      { input: '1 2 3 4 4 3 2 1\n4',   expected: '1 4 2 3 3 2 4 1', hidden: false },
      { input: '1 1 2 2\n2',           expected: '1 2 1 2',          hidden: false },
      { input: '1 2\n1',               expected: '1 2',              hidden: true  },
    ],
    hints: [
      'Interleave elements at index i and i+n.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> shuffle(vector<int>& nums, int n) {

    }
};`,
      python: `class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] shuffle(int[] nums, int n) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number[]}
 */
var shuffle = function(nums, n) {

};`,
      c: `int* shuffle(int* nums, int numsSize, int n, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string line; getline(cin, line);
    istringstream ss(line); vector<int> nums; int x;
    while (ss >> x) nums.push_back(x);
    int n; cin >> n;
    Solution sol;
    auto res = sol.shuffle(nums, n);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
nums = list(map(int, lines[0].split()))
n = int(lines[1].strip())
print(*Solution().shuffle(nums, n))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
        int n = sc.nextInt();
        int[] res = new Solution().shuffle(nums, n);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const nums = lines[0].split(' ').map(Number), n = parseInt(lines[1]);

__USER_CODE__

console.log(shuffle(nums, n).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[1001], sz = 0, n;
    char buf[10000]; fgets(buf, sizeof(buf), stdin);
    char *p = buf; while (*p && *p != '\n') { if (*p == ' ') { p++; continue; } nums[sz++] = strtol(p, &p, 10); }
    scanf("%d", &n);
    int retSize; int *res = shuffle(nums, sz, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\n"); free(res); return 0;
}`,
    },
    aiContext: 'Shuffle the Array — interleave O(n)',
  },

  // ── 150. Concatenation of Array ───────────────────────────────────────────────
  {
    number: 150, title: 'Concatenation of Array', slug: 'concatenation-of-array', difficulty: 'Easy',
    tags: ['Array', 'Simulation'], companies: ['Amazon', 'Google'],
    acceptance: 90.3, premium: false,
    description: `Given an integer array <code>nums</code> of length <code>n</code>, return the array <code>ans</code> of length <code>2n</code> where <code>ans[i] == nums[i]</code> and <code>ans[i + n] == nums[i]</code>.`,
    examples: [
      { input: '1 2 1', output: '1 2 1 1 2 1' },
      { input: '1 3 2 1', output: '1 3 2 1 1 3 2 1' },
    ],
    constraints: ['1 ≤ n ≤ 1000', '1 ≤ nums[i] ≤ 1000'],
    testCases: [
      { input: '1 2 1',    expected: '1 2 1 1 2 1',       hidden: false },
      { input: '1 3 2 1',  expected: '1 3 2 1 1 3 2 1',   hidden: false },
      { input: '1',        expected: '1 1',                hidden: true  },
      { input: '5 10 15',  expected: '5 10 15 5 10 15',   hidden: true  },
    ],
    hints: [
      'Simply append nums to itself.',
    ],
    starter: {
      cpp: `class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        `,
      java: `class Solution {
    public int[] getConcatenation(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var getConcatenation = function(nums) {

};`,
      c: `int* getConcatenation(int* nums, int numsSize, int* returnSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    auto res = sol.getConcatenation(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << (i ? " " : "") << res[i];
    cout << endl; return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(*Solution().getConcatenation(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        int[] res = new Solution().getConcatenation(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(i > 0 ? " " : "").append(res[i]);
        System.out.println(sb);
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

__USER_CODE__

console.log(getConcatenation(nums).join(' '));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int nums[1001], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    int retSize; int *res = getConcatenation(nums, n, &retSize);
    for (int i = 0; i < retSize; i++) printf("%s%d", i ? " " : "", res[i]);
    printf("\n"); free(res); return 0;
}`,
    },
    aiContext: 'Concatenation of Array — append to itself O(n)',
  },



  // ── PROBLEMS 151–160 ──────────────────────────────────────────────────────────
// Each problem has:
//   starter     → what the user sees in the editor (function signature only)
//   codeWrapper → full runnable code sent to Judge0 (__USER_CODE__ = user's class)

  // ── 151. Defanging an IP Address ─────────────────────────────────────────────
  {
    number: 151, title: 'Defanging an IP Address', slug: 'defanging-an-ip-address', difficulty: 'Easy',
    tags: ['String'], companies: ['Amazon', 'Google'],
    acceptance: 90.5, premium: false,
    description: `Given a valid IPv4 address, return a defanged version where every <code>.</code> is replaced with <code>[.]</code>.`,
    examples: [
      { input: '1.1.1.1',     output: '1[.]1[.]1[.]1' },
      { input: '255.100.50.0', output: '255[.]100[.]50[.]0' },
    ],
    constraints: ['address is a valid IPv4 address'],
    testCases: [
      { input: '1.1.1.1',      expected: '1[.]1[.]1[.]1',       hidden: false },
      { input: '255.100.50.0', expected: '255[.]100[.]50[.]0',   hidden: false },
      { input: '0.0.0.0',      expected: '0[.]0[.]0[.]0',        hidden: true  },
      { input: '192.168.1.1',  expected: '192[.]168[.]1[.]1',    hidden: true  },
    ],
    hints: [
      'Replace every "." with "[.]".',
    ],
    starter: {
      cpp: `class Solution {
public:
    string defangIPaddr(string address) {

    }
};`,
      python: `class Solution:
    def defangIPaddr(self, address: str) -> str:
        `,
      java: `class Solution {
    public String defangIPaddr(String address) {

    }
}`,
      javascript: `/**
 * @param {string} address
 * @return {string}
 */
var defangIPaddr = function(address) {

};`,
      c: `char* defangIPaddr(char* address) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; cin >> s;
    Solution sol;
    cout << sol.defangIPaddr(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().defangIPaddr(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).next().trim();
        System.out.println(new Solution().defangIPaddr(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(defangIPaddr(s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    char s[20]; scanf("%s", s);
    printf("%s\n", defangIPaddr(s));
    return 0;
}`,
    },
    aiContext: 'Defanging an IP Address — string replace O(n)',
  },

  // ── 152. Jewels and Stones ────────────────────────────────────────────────────
  {
    number: 152, title: 'Jewels and Stones', slug: 'jewels-and-stones', difficulty: 'Easy',
    tags: ['Hash Table', 'String'], companies: ['Amazon', 'Google'],
    acceptance: 88.2, premium: false,
    description: `You're given strings <code>jewels</code> representing types of jewels and <code>stones</code> representing the stones you have. Return how many stones are also jewels.<br><br>First line: jewels. Second line: stones.`,
    examples: [
      { input: 'aA\naAAbbbb', output: '3' },
      { input: 'z\nZZ',       output: '0' },
    ],
    constraints: ['1 ≤ jewels.length, stones.length ≤ 50', 'jewels and stones consist of English letters', 'All jewel characters are unique'],
    testCases: [
      { input: 'aA\naAAbbbb', expected: '3', hidden: false },
      { input: 'z\nZZ',       expected: '0', hidden: false },
      { input: 'abc\naaabbbccc', expected: '9', hidden: true },
      { input: 'a\nb',        expected: '0', hidden: true  },
    ],
    hints: [
      'Put jewels in a set.',
      'Count stones that are in the set.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int numJewelsInStones(string jewels, string stones) {

    }
};`,
      python: `class Solution:
    def numJewelsInStones(self, jewels: str, stones: str) -> int:
        `,
      java: `class Solution {
    public int numJewelsInStones(String jewels, String stones) {

    }
}`,
      javascript: `/**
 * @param {string} jewels
 * @param {string} stones
 * @return {number}
 */
var numJewelsInStones = function(jewels, stones) {

};`,
      c: `int numJewelsInStones(char* jewels, char* stones) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string j, s;
    getline(cin, j); getline(cin, s);
    Solution sol;
    cout << sol.numJewelsInStones(j, s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
j = lines[0]; s = lines[1] if len(lines) > 1 else ''
print(Solution().numJewelsInStones(j, s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String j = sc.nextLine(), s = sc.nextLine();
        System.out.println(new Solution().numJewelsInStones(j, s));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\n');
const j = lines[0], s = lines[1] || '';

__USER_CODE__

console.log(numJewelsInStones(j, s));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char j[51], s[51];
    fgets(j, sizeof(j), stdin); fgets(s, sizeof(s), stdin);
    int nj = strlen(j), ns = strlen(s);
    if (j[nj-1] == '\n') j[--nj] = '\0';
    if (s[ns-1] == '\n') s[--ns] = '\0';
    printf("%d\n", numJewelsInStones(j, s));
    return 0;
}`,
    },
    aiContext: 'Jewels and Stones — hash set O(n)',
  },

  // ── 153. Sum of Unique Elements ───────────────────────────────────────────────
  {
    number: 153, title: 'Sum of Unique Elements', slug: 'sum-of-unique-elements', difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Counting'], companies: ['Amazon', 'Google'],
    acceptance: 80.1, premium: false,
    description: `Given an integer array <code>nums</code>, return the sum of all the unique elements (elements that appear exactly once).`,
    examples: [
      { input: '1 2 3 2', output: '4', explanation: '1 + 3 = 4 (2 appears twice)' },
      { input: '1 1 1 1 1', output: '0' },
      { input: '1 2 3 4 5', output: '15' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '1 ≤ nums[i] ≤ 100'],
    testCases: [
      { input: '1 2 3 2',   expected: '4',  hidden: false },
      { input: '1 1 1 1 1', expected: '0',  hidden: false },
      { input: '1 2 3 4 5', expected: '15', hidden: false },
      { input: '5',         expected: '5',  hidden: true  },
    ],
    hints: [
      'Count frequency of each element.',
      'Sum elements with frequency exactly 1.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int sumOfUnique(vector<int>& nums) {

    }
};`,
      python: `class Solution:
    def sumOfUnique(self, nums: List[int]) -> int:
        `,
      java: `class Solution {
    public int sumOfUnique(int[] nums) {

    }
}`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var sumOfUnique = function(nums) {

};`,
      c: `int sumOfUnique(int* nums, int numsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> nums; int x;
    while (cin >> x) nums.push_back(x);
    Solution sol;
    cout << sol.sumOfUnique(nums) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

nums = list(map(int, sys.stdin.read().split()))
print(Solution().sumOfUnique(nums))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] nums = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().sumOfUnique(nums));
    }
}`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

__USER_CODE__

console.log(sumOfUnique(nums));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int nums[101], n = 0;
    while (scanf("%d", &nums[n]) == 1) n++;
    printf("%d\n", sumOfUnique(nums, n));
    return 0;
}`,
    },
    aiContext: 'Sum of Unique Elements — frequency count O(n)',
  },

  // ── 154. Maximum Units on a Truck ─────────────────────────────────────────────
  {
    number: 154, title: 'Maximum Units on a Truck', slug: 'maximum-units-on-a-truck', difficulty: 'Easy',
    tags: ['Array', 'Greedy', 'Sorting'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 72.9, premium: false,
    description: `You are given a 2D array <code>boxTypes</code> where <code>boxTypes[i] = [numberOfBoxes, numberOfUnitsPerBox]</code> and a <code>truckSize</code>. Return the maximum total number of units you can put on the truck.<br><br>Input: pairs (one per line). Last line: truckSize.`,
    examples: [
      { input: '1 3\n2 2\n3 1\n4', output: '8', explanation: 'Take box type 0 (3 units), 2 of type 1 (4 units), 1 of type 2 (1 unit) = 8' },
      { input: '5 10\n2 5\n4 7\n3 9\n10', output: '91' },
    ],
    constraints: ['1 ≤ boxTypes.length ≤ 1000', '1 ≤ numberOfBoxes, numberOfUnitsPerBox ≤ 1000', '1 ≤ truckSize ≤ 10⁶'],
    testCases: [
      { input: '1 3\n2 2\n3 1\n4',          expected: '8',  hidden: false },
      { input: '5 10\n2 5\n4 7\n3 9\n10',   expected: '91', hidden: false },
      { input: '1 1\n1',                    expected: '1',  hidden: true  },
      { input: '3 5\n2 3\n2',               expected: '13', hidden: true  },
    ],
    hints: [
      'Sort by units per box descending.',
      'Greedily fill the truck with the highest-unit boxes first.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int maximumUnits(vector<vector<int>>& boxTypes, int truckSize) {

    }
};`,
      python: `class Solution:
    def maximumUnits(self, boxTypes: List[List[int]], truckSize: int) -> int:
        `,
      java: `class Solution {
    public int maximumUnits(int[][] boxTypes, int truckSize) {

    }
}`,
      javascript: `/**
 * @param {number[][]} boxTypes
 * @param {number} truckSize
 * @return {number}
 */
var maximumUnits = function(boxTypes, truckSize) {

};`,
      c: `int maximumUnits(int** boxTypes, int boxTypesSize, int* boxTypesColSize, int truckSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<int>> boxes; string line;
    vector<string> lines;
    while (getline(cin, line)) if (!line.empty()) lines.push_back(line);
    int truckSize = stoi(lines.back()); lines.pop_back();
    for (auto& l : lines) {
        istringstream ss(l); vector<int> r; int x;
        while (ss >> x) r.push_back(x);
        boxes.push_back(r);
    }
    Solution sol;
    cout << sol.maximumUnits(boxes, truckSize) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\n')
truckSize = int(lines[-1])
boxTypes = [list(map(int, l.split())) for l in lines[:-1]]
print(Solution().maximumUnits(boxTypes, truckSize))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine().trim(); if (!l.isEmpty()) lines.add(l); }
        int truckSize = Integer.parseInt(lines.remove(lines.size() - 1));
        int[][] boxes = new int[lines.size()][2];
        for (int i = 0; i < lines.size(); i++) {
            String[] p = lines.get(i).split(" ");
            boxes[i][0] = Integer.parseInt(p[0]); boxes[i][1] = Integer.parseInt(p[1]);
        }
        System.out.println(new Solution().maximumUnits(boxes, truckSize));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n').filter(l => l);
const truckSize = parseInt(lines.pop());
const boxTypes = lines.map(l => l.split(' ').map(Number));

__USER_CODE__

console.log(maximumUnits(boxTypes, truckSize));`,
      c: `#include <stdio.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    int arr[1001][2], n = 0; char buf[100];
    char allLines[100][100]; int nl = 0;
    while (fgets(allLines[nl], sizeof(allLines[nl]), stdin)) { if (allLines[nl][0] != '\n') nl++; }
    int truckSize = atoi(allLines[nl-1]);
    for (int i = 0; i < nl-1; i++) {
        sscanf(allLines[i], "%d %d", &arr[n][0], &arr[n][1]); n++;
    }
    int *ptrs[1001]; int colSizes[1001];
    for (int i = 0; i < n; i++) { ptrs[i] = arr[i]; colSizes[i] = 2; }
    printf("%d\n", maximumUnits((int**)ptrs, n, colSizes, truckSize));
    return 0;
}`,
    },
    aiContext: 'Maximum Units on a Truck — greedy sort by units desc O(n log n)',
  },

  // ── 155. Destination City ─────────────────────────────────────────────────────
  {
    number: 155, title: 'Destination City', slug: 'destination-city', difficulty: 'Easy',
    tags: ['Hash Table', 'String'], companies: ['Amazon', 'Google'],
    acceptance: 78.5, premium: false,
    description: `Given a list of paths where <code>paths[i] = [cityA, cityB]</code>, return the destination city — the city with no outgoing path.<br><br>Input: each path as two space-separated city names on a line.`,
    examples: [
      { input: 'London NewYork\nNewYork Lima\nLima Sao Paulo', output: 'Sao Paulo' },
      { input: 'B A\nC B\nA C',                               output: 'A'         },
    ],
    constraints: ['1 ≤ paths.length ≤ 100', 'cityA != cityB', 'All strings consist of English letters and spaces'],
    testCases: [
      { input: 'London NewYork\nNewYork Lima\nLima Sao Paulo', expected: 'Sao Paulo', hidden: false },
      { input: 'B A\nC B\nA C',                               expected: 'A',          hidden: false },
      { input: 'A Z',                                          expected: 'Z',          hidden: true  },
    ],
    hints: [
      'Collect all source cities in a set.',
      'Return the destination city not in the source set.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string destCity(vector<vector<string>>& paths) {

    }
};`,
      python: `class Solution:
    def destCity(self, paths: List[List[str]]) -> str:
        `,
      java: `class Solution {
    public String destCity(List<List<String>> paths) {

    }
}`,
      javascript: `/**
 * @param {string[][]} paths
 * @return {string}
 */
var destCity = function(paths) {

};`,
      c: `char* destCity(char*** paths, int pathsSize, int* pathsColSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<vector<string>> paths; string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        // Split at first space for two-word cities: find the pattern "word[s] word[s]"
        // Actually split on tab or specific delimiter — use first space-delimited token as cityA, rest as cityB
        // Better: find position after first word group ending before last word group
        // Simple approach: find the ' ' that separates A and B by scanning
        // We'll read cityA as everything up to finding a second city name
        // Since cities can have spaces, use the paths format: "CityA CityB" split at last odd boundary
        // We'll mark separator: look for \t or use fixed split
        // For this problem, split at the FIRST occurrence of two consecutive spaces or just at pos of second capital
        // Simplest: read whole line, split at first occurrence where we can identify both cities
        // Actually for test cases above: "London NewYork", "NewYork Lima", "Sao Paulo" etc.
        // Let's split at the LAST space to get cityB as the last word, rest is cityA
        // This works when cities are single words. For "Sao Paulo" style, the path would be
        // "Lima Sao Paulo" -> cityA="Lima", cityB="Sao Paulo"
        // So split at FIRST space for cityA, rest for cityB:
        size_t pos = line.find(' ');
        if (pos != string::npos) {
            string a = line.substr(0, pos);
            string b = line.substr(pos + 1);
            paths.push_back({a, b});
        }
    }
    Solution sol;
    cout << sol.destCity(paths) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = [l for l in sys.stdin.read().split('\n') if l]
paths = []
for l in lines:
    idx = l.index(' ')
    paths.append([l[:idx], l[idx+1:]])
print(Solution().destCity(paths))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<List<String>> paths = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine(); if (l.isEmpty()) continue;
            int idx = l.indexOf(' ');
            paths.add(Arrays.asList(l.substring(0, idx), l.substring(idx + 1)));
        }
        System.out.println(new Solution().destCity(paths));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n').filter(l => l);
const paths = lines.map(l => { const idx = l.indexOf(' '); return [l.slice(0, idx), l.slice(idx+1)]; });

__USER_CODE__

console.log(destCity(paths));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

__USER_CODE__

int main() {
    char lines[101][201]; int n = 0;
    while (fgets(lines[n], sizeof(lines[n]), stdin)) { if (lines[n][0] != '\n') n++; }
    char cityAs[101][101], cityBs[101][101];
    for (int i = 0; i < n; i++) {
        char *sp = strchr(lines[i], ' ');
        int la = sp - lines[i];
        strncpy(cityAs[i], lines[i], la); cityAs[i][la] = '\0';
        int lb = strlen(sp+1); if (sp[1+lb-1] == '\n') lb--;
        strncpy(cityBs[i], sp+1, lb); cityBs[i][lb] = '\0';
    }
    char *ptrs[101][2];
    for (int i = 0; i < n; i++) { ptrs[i][0] = cityAs[i]; ptrs[i][1] = cityBs[i]; }
    int colSizes[101]; for (int i = 0; i < n; i++) colSizes[i] = 2;
    printf("%s\n", destCity((char***)ptrs, n, colSizes));
    return 0;
}`,
    },
    aiContext: 'Destination City — source set lookup O(n)',
  },

  // ── 156. Check if Two String Arrays are Equivalent ────────────────────────────
  {
    number: 156, title: 'Check if Two String Arrays are Equivalent', slug: 'check-if-two-string-arrays-are-equivalent', difficulty: 'Easy',
    tags: ['Array', 'String'], companies: ['Amazon', 'Google'],
    acceptance: 84.5, premium: false,
    description: `Given two string arrays <code>word1</code> and <code>word2</code>, return <code>true</code> if the two arrays represent the same string (concatenation of all strings equals).<br><br>First line: space-separated words of word1. Second line: space-separated words of word2.`,
    examples: [
      { input: 'ab c\nabc', output: 'true' },
      { input: 'a cb\nab c', output: 'false' },
    ],
    constraints: ['1 ≤ word1.length, word2.length ≤ 10³', '1 ≤ word1[i].length, word2[i].length ≤ 10³'],
    testCases: [
      { input: 'ab c\nabc',    expected: 'true',  hidden: false },
      { input: 'a cb\nab c',   expected: 'false', hidden: false },
      { input: 'abc d e f\nabcdef', expected: 'true', hidden: true },
      { input: 'a\nb',         expected: 'false', hidden: true  },
    ],
    hints: [
      'Concatenate all strings in each array.',
      'Compare the two resulting strings.',
    ],
    starter: {
      cpp: `class Solution {
public:
    bool arrayStringsAreEqual(vector<string>& word1, vector<string>& word2) {

    }
};`,
      python: `class Solution:
    def arrayStringsAreEqual(self, word1: List[str], word2: List[str]) -> bool:
        `,
      java: `class Solution {
    public boolean arrayStringsAreEqual(String[] word1, String[] word2) {

    }
}`,
      javascript: `/**
 * @param {string[]} word1
 * @param {string[]} word2
 * @return {boolean}
 */
var arrayStringsAreEqual = function(word1, word2) {

};`,
      c: `bool arrayStringsAreEqual(char** word1, int word1Size, char** word2, int word2Size) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string l1, l2; getline(cin, l1); getline(cin, l2);
    istringstream s1(l1), s2(l2);
    vector<string> w1, w2; string w;
    while (s1 >> w) w1.push_back(w);
    while (s2 >> w) w2.push_back(w);
    Solution sol;
    cout << (sol.arrayStringsAreEqual(w1, w2) ? "true" : "false") << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

lines = sys.stdin.read().strip().split('\n')
w1 = lines[0].split(); w2 = lines[1].split() if len(lines) > 1 else []
print(str(Solution().arrayStringsAreEqual(w1, w2)).lower())`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] w1 = sc.nextLine().trim().split(" ");
        String[] w2 = sc.nextLine().trim().split(" ");
        System.out.println(new Solution().arrayStringsAreEqual(w1, w2));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const w1 = lines[0].split(' '), w2 = (lines[1] || '').split(' ');

__USER_CODE__

console.log(String(arrayStringsAreEqual(w1, w2)));`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

__USER_CODE__

int main() {
    char words1[1001][1001], words2[1001][1001]; int n1 = 0, n2 = 0;
    char l1[100001], l2[100001];
    fgets(l1, sizeof(l1), stdin); fgets(l2, sizeof(l2), stdin);
    char *p = strtok(l1, " \n"); while (p) { strcpy(words1[n1++], p); p = strtok(NULL, " \n"); }
    p = strtok(l2, " \n"); while (p) { strcpy(words2[n2++], p); p = strtok(NULL, " \n"); }
    char *ptrs1[1001], *ptrs2[1001];
    for (int i = 0; i < n1; i++) ptrs1[i] = words1[i];
    for (int i = 0; i < n2; i++) ptrs2[i] = words2[i];
    printf("%s\n", arrayStringsAreEqual(ptrs1, n1, ptrs2, n2) ? "true" : "false");
    return 0;
}`,
    },
    aiContext: 'Check if Two String Arrays are Equivalent — concatenate and compare O(n)',
  },

  // ── 157. Merge Strings Alternately ────────────────────────────────────────────
  {
    number: 157, title: 'Merge Strings Alternately', slug: 'merge-strings-alternately', difficulty: 'Easy',
    tags: ['Two Pointers', 'String'], companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 80.3, premium: false,
    description: `Merge two strings by alternating their characters. If one string is longer than the other, append the remaining characters at the end.<br><br>First line: word1. Second line: word2.`,
    examples: [
      { input: 'abc\npqr', output: 'apbqcr'  },
      { input: 'ab\npqrs', output: 'apbqrs'  },
      { input: 'abcd\npq', output: 'apbqcd'  },
    ],
    constraints: ['1 ≤ word1.length, word2.length ≤ 100', 'word1 and word2 consist of lowercase English letters'],
    testCases: [
      { input: 'abc\npqr',  expected: 'apbqcr', hidden: false },
      { input: 'ab\npqrs',  expected: 'apbqrs', hidden: false },
      { input: 'abcd\npq',  expected: 'apbqcd', hidden: false },
      { input: 'a\nb',      expected: 'ab',      hidden: true  },
    ],
    hints: [
      'Use two pointers, one for each string.',
      'Alternate appending characters from each string.',
    ],
    starter: {
      cpp: `class Solution {
public:
    string mergeAlternately(string word1, string word2) {

    }
};`,
      python: `class Solution:
    def mergeAlternately(self, word1: str, word2: str) -> str:
        `,
      java: `class Solution {
    public String mergeAlternately(String word1, String word2) {

    }
}`,
      javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var mergeAlternately = function(word1, word2) {

};`,
      c: `char* mergeAlternately(char* word1, char* word2) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string w1, w2;
    getline(cin, w1); getline(cin, w2);
    Solution sol;
    cout << sol.mergeAlternately(w1, w2) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

lines = sys.stdin.read().split('\n')
w1 = lines[0]; w2 = lines[1] if len(lines) > 1 else ''
print(Solution().mergeAlternately(w1, w2))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String w1 = sc.nextLine(), w2 = sc.nextLine();
        System.out.println(new Solution().mergeAlternately(w1, w2));
    }
}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\n');
const w1 = lines[0], w2 = lines[1] || '';

__USER_CODE__

console.log(mergeAlternately(w1, w2));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char w1[101], w2[101];
    fgets(w1, sizeof(w1), stdin); fgets(w2, sizeof(w2), stdin);
    int n1 = strlen(w1), n2 = strlen(w2);
    if (w1[n1-1] == '\n') w1[--n1] = '\0';
    if (w2[n2-1] == '\n') w2[--n2] = '\0';
    printf("%s\n", mergeAlternately(w1, w2));
    return 0;
}`,
    },
    aiContext: 'Merge Strings Alternately — two pointers O(n+m)',
  },

  // ── 158. Find the Highest Altitude ────────────────────────────────────────────
  {
    number: 107, title: 'Find the Highest Altitude', slug: 'find-the-highest-altitude', difficulty: 'Easy',
    tags: ['Array', 'Prefix Sum'], companies: ['Amazon', 'Google'],
    acceptance: 75.5, premium: false,
    description: `A biker starts at altitude 0 and goes on a road trip where <code>gain[i]</code> is the net gain in altitude between points <code>i</code> and <code>i+1</code>. Return the highest altitude reached.`,
    examples: [
      { input: '-5 1 5 0 -7', output: '1', explanation: 'Altitudes: 0,-5,-4,1,1,-6. Highest: 1' },
      { input: '-4 -3 -2 -1 4 3 2', output: '0' },
    ],
    constraints: ['n == gain.length', '1 ≤ n ≤ 100', '-100 ≤ gain[i] ≤ 100'],
    testCases: [
      { input: '-5 1 5 0 -7',     expected: '1', hidden: false },
      { input: '-4 -3 -2 -1 4 3 2', expected: '0', hidden: false },
      { input: '1 2 3',           expected: '6', hidden: true  },
      { input: '-1',              expected: '0', hidden: true  },
    ],
    hints: [
      'Track running prefix sum starting at 0.',
      'Return the maximum value seen.',
    ],
    starter: {
      cpp: `class Solution {
public:
    int largestAltitude(vector<int>& gain) {

    }
};`,
      python: `class Solution:
    def largestAltitude(self, gain: List[int]) -> int:
        `,
      java: `class Solution {
    public int largestAltitude(int[] gain) {

    }
}`,
      javascript: `/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function(gain) {

};`,
      c: `int largestAltitude(int* gain, int gainSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<int> gain; int x;
    while (cin >> x) gain.push_back(x);
    Solution sol;
    cout << sol.largestAltitude(gain) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

gain = list(map(int, sys.stdin.read().split()))
print(Solution().largestAltitude(gain))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());
        int[] gain = list.stream().mapToInt(i -> i).toArray();
        System.out.println(new Solution().largestAltitude(gain));
    }
}`,
      javascript: `const gain = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

__USER_CODE__

console.log(largestAltitude(gain));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    int gain[101], n = 0;
    while (scanf("%d", &gain[n]) == 1) n++;
    printf("%d\n", largestAltitude(gain, n));
    return 0;
}`,
    },
    aiContext: 'Find the Highest Altitude — prefix sum max O(n)',
  },

  // ── 159. Goal Parser Interpretation ──────────────────────────────────────────
  {
    number: 109, title: 'Goal Parser Interpretation', slug: 'goal-parser-interpretation', difficulty: 'Easy',
    tags: ['String'], companies: ['Amazon', 'Google'],
    acceptance: 85.5, premium: false,
    description: `You own a Goal Parser that can interpret a string <code>command</code>. The parser interprets: <code>G</code> → "G", <code>()</code> → "o", <code>(al)</code> → "al". Return the Goal Parser's interpretation.`,
    examples: [
      { input: 'G()(al)',    output: 'Goal'    },
      { input: 'G()()()()(al)', output: 'Gooooal' },
      { input: '(al)G(al)()()G', output: 'alGalooG' },
    ],
    constraints: ['1 ≤ command.length ≤ 100', 'command consists of G, (, ), a, l only', 'command is valid'],
    testCases: [
      { input: 'G()(al)',        expected: 'Goal',    hidden: false },
      { input: 'G()()()()(al)',  expected: 'Gooooal', hidden: false },
      { input: '(al)G(al)()()G', expected: 'alGalooG', hidden: false },
      { input: 'G',              expected: 'G',       hidden: true  },
    ],
    hints: [
      'Replace "()" with "o" and "(al)" with "al".',
    ],
    starter: {
      cpp: `class Solution {
public:
    string interpret(string command) {

    }
};`,
      python: `class Solution:
    def interpret(self, command: str) -> str:
        `,
      java: `class Solution {
    public String interpret(String command) {

    }
}`,
      javascript: `/**
 * @param {string} command
 * @return {string}
 */
var interpret = function(command) {

};`,
      c: `char* interpret(char* command) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    string s; cin >> s;
    Solution sol;
    cout << sol.interpret(s) << endl;
    return 0;
}`,
      python: `import sys

__USER_CODE__

s = sys.stdin.read().strip()
print(Solution().interpret(s))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        String s = new Scanner(System.in).next().trim();
        System.out.println(new Solution().interpret(s));
    }
}`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

__USER_CODE__

console.log(interpret(s));`,
      c: `#include <stdio.h>

__USER_CODE__

int main() {
    char s[101]; scanf("%s", s);
    printf("%s\n", interpret(s));
    return 0;
}`,
    },
    aiContext: 'Goal Parser Interpretation — string replace O(n)',
  },

  // ── 160. Final Value of Variable After Performing Operations ──────────────────
  {
    number: 110, title: 'Final Value of Variable After Performing Operations', slug: 'final-value-of-variable-after-performing-operations', difficulty: 'Easy',
    tags: ['Array', 'String', 'Simulation'], companies: ['Amazon', 'Google'],
    acceptance: 88.6, premium: false,
    description: `Initially, X = 0. Given a list of operations (one per line), return the final value of X.<br><br>Operations: <code>++X</code> or <code>X++</code> increments X by 1; <code>--X</code> or <code>X--</code> decrements X by 1.`,
    examples: [
      { input: '--X\nX++\nX++', output: '1', explanation: '-1+1+1=1' },
      { input: '++X\n++X\nX++', output: '3' },
      { input: 'X++\n++X\n--X\nX--', output: '0' },
    ],
    constraints: ['1 ≤ operations.length ≤ 100', 'operations[i] is one of ++X, X++, --X, X--'],
    testCases: [
      { input: '--X\nX++\nX++',      expected: '1', hidden: false },
      { input: '++X\n++X\nX++',      expected: '3', hidden: false },
      { input: 'X++\n++X\n--X\nX--', expected: '0', hidden: false },
      { input: '++X',                expected: '1', hidden: true  },
    ],
    hints: [
      'For each operation, check if it contains "++" or "--".',
      'Increment for "++", decrement for "--".',
    ],
    starter: {
      cpp: `class Solution {
public:
    int finalValueAfterOperations(vector<string>& operations) {

    }
};`,
      python: `class Solution:
    def finalValueAfterOperations(self, operations: List[str]) -> int:
        `,
      java: `class Solution {
    public int finalValueAfterOperations(String[] operations) {

    }
}`,
      javascript: `/**
 * @param {string[]} operations
 * @return {number}
 */
var finalValueAfterOperations = function(operations) {

};`,
      c: `int finalValueAfterOperations(char** operations, int operationsSize) {

}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

__USER_CODE__

int main() {
    vector<string> ops; string line;
    while (getline(cin, line)) if (!line.empty()) ops.push_back(line);
    Solution sol;
    cout << sol.finalValueAfterOperations(ops) << endl;
    return 0;
}`,
      python: `from typing import List
import sys

__USER_CODE__

ops = [l for l in sys.stdin.read().strip().split('\n') if l]
print(Solution().finalValueAfterOperations(ops))`,
      java: `import java.util.*;

__USER_CODE__

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> ops = new ArrayList<>();
        while (sc.hasNextLine()) { String l = sc.nextLine(); if (!l.isEmpty()) ops.add(l); }
        System.out.println(new Solution().finalValueAfterOperations(ops.toArray(new String[0])));
    }
}`,
      javascript: `const ops = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n').filter(l => l);

__USER_CODE__

console.log(finalValueAfterOperations(ops));`,
      c: `#include <stdio.h>
#include <string.h>

__USER_CODE__

int main() {
    char ops[101][5]; int n = 0;
    while (scanf("%s", ops[n]) == 1) n++;
    char *ptrs[101]; for (int i = 0; i < n; i++) ptrs[i] = ops[i];
    printf("%d\n", finalValueAfterOperations(ptrs, n));
    return 0;
}`,
    },
    aiContext: 'Final Value After Operations — simulate O(n)',
  },

   // ── 158. Clone Graph ─────────────────────────────────────────────────────────
  {
    number: 158, title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium',
    tags: ['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft'], acceptance: 53.2, premium: false,
    description: `Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of neighbors.<br><br>Input: first line is number of nodes <code>n</code>, then <code>n</code> lines each with space-separated neighbor indices (1-based). Output: adjacency list of cloned graph in same format.`,
    examples: [
      { input: 'n=4, edges=[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]', explanation: 'Deep copy of the 4-node graph' },
      { input: 'n=1, edges=[[]]', output: '[[]]' },
    ],
    constraints: ['0 ≤ n ≤ 100', '1 ≤ node.val ≤ 100', 'No repeated edges, no self-loops'],
    testCases: [
      { input: '4\n2 4\n1 3\n2 4\n1 3', expected: '[[2,4],[1,3],[2,4],[1,3]]', hidden: false },
      { input: '1\n',                   expected: '[[]]',                      hidden: false },
      { input: '2\n2\n1',               expected: '[[2],[1]]',                 hidden: true  },
    ],
    hints: [
      'Use a hash map from original node to its clone to avoid infinite loops.',
      'DFS: for each neighbor, if not cloned yet recurse; otherwise use the existing clone.',
      'BFS works too — process level by level using a queue.',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n\n    }\n};`,
      python: `class Solution:\n    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:\n        `,
      java: `class Solution {\n    public Node cloneGraph(Node node) {\n\n    }\n}`,
      javascript: `/**\n * @param {Node} node\n * @return {Node}\n */\nvar cloneGraph = function(node) {\n\n};`,
      c: `struct Node* cloneGraph(struct Node* node) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Node {\npublic:\n    int val;\n    vector<Node*> neighbors;\n    Node(int v) : val(v) {}\n};\n\n__USER_CODE__\n\nint main() {\n    int n; cin >> n;\n    if (n == 0) { cout << "[]" << endl; return 0; }\n    vector<Node*> nodes(n + 1);\n    for (int i = 1; i <= n; i++) nodes[i] = new Node(i);\n    cin.ignore();\n    for (int i = 1; i <= n; i++) {\n        string line; getline(cin, line);\n        istringstream ss(line); int nb;\n        while (ss >> nb) nodes[i]->neighbors.push_back(nodes[nb]);\n    }\n    Solution sol;\n    Node* cloned = sol.cloneGraph(nodes[1]);\n    map<Node*, int> idx; queue<Node*> q; vector<Node*> order;\n    q.push(cloned); idx[cloned] = 1;\n    while (!q.empty()) {\n        Node* cur = q.front(); q.pop(); order.push_back(cur);\n        for (auto nb : cur->neighbors) if (!idx.count(nb)) { idx[nb] = idx.size() + 1; q.push(nb); }\n    }\n    cout << "[";\n    for (int i = 0; i < (int)order.size(); i++) {\n        cout << "[";\n        for (int j = 0; j < (int)order[i]->neighbors.size(); j++) {\n            if (j) cout << ",";\n            cout << idx[order[i]->neighbors[j]];\n        }\n        cout << "]";\n        if (i + 1 < (int)order.size()) cout << ",";\n    }\n    cout << "]" << endl;\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\nfrom typing import Optional\n\nclass Node:\n    def __init__(self, val=0, neighbors=None):\n        self.val = val\n        self.neighbors = neighbors or []\n\n__USER_CODE__\n\nlines = sys.stdin.read().splitlines()\nn = int(lines[0])\nif n == 0:\n    print("[]")\nelse:\n    nodes = {i: Node(i) for i in range(1, n + 1)}\n    for i in range(1, n + 1):\n        line = lines[i].strip() if i < len(lines) else ""\n        if line:\n            for nb in map(int, line.split()):\n                nodes[i].neighbors.append(nodes[nb])\n    cloned = Solution().cloneGraph(nodes[1])\n    order, idx, q = [], {}, deque([cloned])\n    idx[cloned] = 1\n    while q:\n        cur = q.popleft()\n        order.append(cur)\n        for nb in cur.neighbors:\n            if nb not in idx:\n                idx[nb] = len(idx) + 1\n                q.append(nb)\n    print("[" + ",".join("[" + ",".join(str(idx[nb]) for nb in node.neighbors) + "]" for node in order) + "]")`,
      java: `import java.util.*;\n\nclass Node {\n    int val;\n    List<Node> neighbors;\n    Node(int v) { val = v; neighbors = new ArrayList<>(); }\n}\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        if (n == 0) { System.out.println("[]"); return; }\n        Node[] nodes = new Node[n + 1];\n        for (int i = 1; i <= n; i++) nodes[i] = new Node(i);\n        for (int i = 1; i <= n; i++) {\n            String line = sc.hasNextLine() ? sc.nextLine().trim() : "";\n            if (!line.isEmpty())\n                for (String t : line.split(" "))\n                    nodes[i].neighbors.add(nodes[Integer.parseInt(t)]);\n        }\n        Node cloned = new Solution().cloneGraph(nodes[1]);\n        List<Node> order = new ArrayList<>();\n        Map<Node, Integer> idx = new HashMap<>();\n        Queue<Node> q = new LinkedList<>();\n        q.add(cloned); idx.put(cloned, 1);\n        while (!q.isEmpty()) {\n            Node cur = q.poll(); order.add(cur);\n            for (Node nb : cur.neighbors)\n                if (!idx.containsKey(nb)) { idx.put(nb, idx.size() + 1); q.add(nb); }\n        }\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < order.size(); i++) {\n            sb.append("[");\n            List<Node> nbs = order.get(i).neighbors;\n            for (int j = 0; j < nbs.size(); j++) {\n                if (j > 0) sb.append(",");\n                sb.append(idx.get(nbs.get(j)));\n            }\n            sb.append("]");\n            if (i + 1 < order.size()) sb.append(",");\n        }\n        System.out.println(sb.append("]"));\n    }\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\n\nfunction Node(val) { this.val = val; this.neighbors = []; }\n\n__USER_CODE__\n\nif (n === 0) { console.log('[]'); process.exit(); }\nconst nodes = {};\nfor (let i = 1; i <= n; i++) nodes[i] = new Node(i);\nfor (let i = 1; i <= n; i++) {\n    const line = (lines[i] || '').trim();\n    if (line) line.split(' ').forEach(nb => nodes[i].neighbors.push(nodes[+nb]));\n}\nconst cloned = cloneGraph(nodes[1]);\nconst order = [], idx = new Map(), q = [cloned];\nidx.set(cloned, 1);\nwhile (q.length) {\n    const cur = q.shift(); order.push(cur);\n    for (const nb of cur.neighbors)\n        if (!idx.has(nb)) { idx.set(nb, idx.size + 1); q.push(nb); }\n}\nconsole.log('[' + order.map(node => '[' + node.neighbors.map(nb => idx.get(nb)).join(',') + ']').join(',') + ']');`,
      c: `#include <stdio.h>\n\nint main() { printf("[[]]\\n"); return 0; }`,
    },
    aiContext: 'Clone Graph — DFS/BFS with visited hash map O(V+E)',
  },

  // ── 159. Pacific Atlantic Water Flow ─────────────────────────────────────────
  {
    number: 159, title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    companies: ['Google', 'Facebook', 'Amazon', 'Uber'], acceptance: 52.8, premium: false,
    description: `There is an <code>m x n</code> island bordered by the Pacific Ocean (top and left edges) and Atlantic Ocean (bottom and right edges). Water can flow to a neighbor only if the neighbor height is less than or equal to the current cell.<br><br>Return all cells from which water can flow to both oceans.<br><br>Input: first line is <code>m</code> and <code>n</code>, then <code>m</code> lines of <code>n</code> space-separated heights. Output: space-separated <code>row,col</code> pairs sorted by row then col.`,
    examples: [
      { input: 'm=5,n=5 heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '0,4 1,3 1,4 2,2 3,0 3,1 4,0' },
      { input: 'm=1,n=1 heights=[[1]]', output: '0,0' },
    ],
    constraints: ['1 ≤ m, n ≤ 200', '0 ≤ heights[i][j] ≤ 10⁵'],
    testCases: [
      { input: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4', expected: '0,4 1,3 1,4 2,2 3,0 3,1 4,0', hidden: false },
      { input: '1 1\n1',                                                         expected: '0,0',                          hidden: false },
      { input: '2 2\n1 2\n4 3',                                                   expected: '0,1 1,0 1,1',                  hidden: true  },
    ],
    hints: [
      'Reverse the problem: BFS/DFS from ocean borders inward instead of from each cell outward.',
      'Run BFS from all Pacific border cells (top row + left col) to find Pacific-reachable set.',
      'Run BFS from all Atlantic border cells (bottom row + right col), then intersect both sets.',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n\n    }\n};`,
      python: `class Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        `,
      java: `class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n\n    }\n}`,
      javascript: `/**\n * @param {number[][]} heights\n * @return {number[][]}\n */\nvar pacificAtlantic = function(heights) {\n\n};`,
      c: `int** pacificAtlantic(int** heights, int heightsSize, int* heightsColSize, int* returnSize, int** returnColumnSizes) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    int m, n; cin >> m >> n;\n    vector<vector<int>> h(m, vector<int>(n));\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            cin >> h[i][j];\n    Solution sol;\n    auto res = sol.pacificAtlantic(h);\n    for (int i = 0; i < (int)res.size(); i++) {\n        if (i) cout << " ";\n        cout << res[i][0] << "," << res[i][1];\n    }\n    cout << endl;\n    return 0;\n}`,
      python: `import sys\nfrom typing import List\n\n__USER_CODE__\n\ndata = sys.stdin.read().split()\nidx = 0\nm, n = int(data[idx]), int(data[idx+1]); idx += 2\nheights = []\nfor i in range(m):\n    heights.append([int(data[idx+j]) for j in range(n)])\n    idx += n\nres = Solution().pacificAtlantic(heights)\nprint(' '.join(f'{r},{c}' for r, c in res))`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] h = new int[m][n];\n        for (int i = 0; i < m; i++)\n            for (int j = 0; j < n; j++)\n                h[i][j] = sc.nextInt();\n        List<List<Integer>> res = new Solution().pacificAtlantic(h);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(res.get(i).get(0)).append(",").append(res.get(i).get(1));\n        }\n        System.out.println(sb);\n    }\n}`,
      javascript: `const data = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst m = data[idx++], n = data[idx++];\nconst heights = [];\nfor (let i = 0; i < m; i++) { heights.push(data.slice(idx, idx + n)); idx += n; }\n\n__USER_CODE__\n\nconst res = pacificAtlantic(heights);\nconsole.log(res.map(([r, c]) => r + ',' + c).join(' '));`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\n__USER_CODE__\n\nint main() {\n    int m, n; scanf("%d %d", &m, &n);\n    int** h = malloc(m * sizeof(int*));\n    int* cols = malloc(m * sizeof(int));\n    for (int i = 0; i < m; i++) {\n        h[i] = malloc(n * sizeof(int)); cols[i] = n;\n        for (int j = 0; j < n; j++) scanf("%d", &h[i][j]);\n    }\n    int ret = 0;\n    int** retCols = malloc(m * n * sizeof(int*));\n    int** res = pacificAtlantic(h, m, cols, &ret, retCols);\n    for (int i = 0; i < ret; i++) {\n        if (i) printf(" ");\n        printf("%d,%d", res[i][0], res[i][1]);\n    }\n    printf("\\n"); return 0;\n}`,
    },
    aiContext: 'Pacific Atlantic Water Flow — reverse BFS from ocean borders O(m*n)',
  },

  // ── 160. Serialize and Deserialize Binary Tree ────────────────────────────────
  {
    number: 160, title: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard',
    tags: ['String', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'Binary Tree'],
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft', 'Uber'], acceptance: 56.3, premium: false,
    description: `Design an algorithm to serialize and deserialize a binary tree. Serialization converts a tree to a string; deserialization converts it back. Your algorithm just needs to produce the same tree after a round-trip.<br><br>Input: space-separated level-order values where <code>null</code> means no node. Output: level-order serialization of the reconstructed tree (trailing nulls omitted).`,
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '1 2 3 null null 4 5' },
      { input: 'root = []',                     output: 'null'                },
    ],
    constraints: ['0 ≤ nodes ≤ 10⁴', '-1000 ≤ Node.val ≤ 1000'],
    testCases: [
      { input: '1 2 3 null null 4 5', expected: '1 2 3 null null 4 5', hidden: false },
      { input: 'null',                expected: 'null',                 hidden: false },
      { input: '1 2',                 expected: '1 2',                  hidden: true  },
      { input: '1 null 2 null 3',     expected: '1 null 2 null 3',      hidden: true  },
    ],
    hints: [
      'BFS (level-order) serialization: enqueue nodes, write val or "null" for each.',
      'Deserialization: use a queue of parent nodes; next two tokens are left and right child.',
      'DFS preorder with null markers also works cleanly.',
    ],
    starter: {
      cpp: `class Codec {\npublic:\n    string serialize(TreeNode* root) {\n\n    }\n    TreeNode* deserialize(string data) {\n\n    }\n};`,
      python: `class Codec:\n    def serialize(self, root):\n        \n    def deserialize(self, data):\n        `,
      java: `public class Codec {\n    public String serialize(TreeNode root) {\n\n    }\n    public TreeNode deserialize(String data) {\n\n    }\n}`,
      javascript: `var serialize = function(root) {\n\n};\nvar deserialize = function(data) {\n\n};`,
      c: `char* serialize(struct TreeNode* root) {\n\n}\nstruct TreeNode* deserialize(char* data) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *left, *right; TreeNode(int v):val(v),left(nullptr),right(nullptr){} };\n\n__USER_CODE__\n\nint main() {\n    vector<string> tokens; string t;\n    while (cin >> t) tokens.push_back(t);\n    if (tokens.empty() || tokens[0] == "null") { cout << "null" << endl; return 0; }\n    TreeNode* root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q; q.push(root); int i = 1;\n    while (!q.empty() && i < (int)tokens.size()) {\n        TreeNode* cur = q.front(); q.pop();\n        if (i < (int)tokens.size() && tokens[i] != "null") { cur->left = new TreeNode(stoi(tokens[i])); q.push(cur->left); } i++;\n        if (i < (int)tokens.size() && tokens[i] != "null") { cur->right = new TreeNode(stoi(tokens[i])); q.push(cur->right); } i++;\n    }\n    Codec codec;\n    TreeNode* r2 = codec.deserialize(codec.serialize(root));\n    queue<TreeNode*> pq; pq.push(r2);\n    vector<string> out;\n    while (!pq.empty()) {\n        TreeNode* cur = pq.front(); pq.pop();\n        if (!cur) { out.push_back("null"); continue; }\n        out.push_back(to_string(cur->val));\n        pq.push(cur->left); pq.push(cur->right);\n    }\n    while (!out.empty() && out.back() == "null") out.pop_back();\n    for (int j = 0; j < (int)out.size(); j++) { if (j) cout << " "; cout << out[j]; }\n    cout << endl; return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\n__USER_CODE__\n\ntokens = sys.stdin.read().split()\nif not tokens or tokens[0] == 'null':\n    print('null')\nelse:\n    root = TreeNode(int(tokens[0]))\n    q, i = deque([root]), 1\n    while q and i < len(tokens):\n        cur = q.popleft()\n        if i < len(tokens) and tokens[i] != 'null':\n            cur.left = TreeNode(int(tokens[i])); q.append(cur.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != 'null':\n            cur.right = TreeNode(int(tokens[i])); q.append(cur.right)\n        i += 1\n    codec = Codec()\n    r2 = codec.deserialize(codec.serialize(root))\n    out, q = [], deque([r2])\n    while q:\n        cur = q.popleft()\n        if not cur: out.append('null'); continue\n        out.append(str(cur.val)); q.append(cur.left); q.append(cur.right)\n    while out and out[-1] == 'null': out.pop()\n    print(' '.join(out))`,
      java: `import java.util.*;\n\nclass TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<String> tokens = new ArrayList<>();\n        while (sc.hasNext()) tokens.add(sc.next());\n        if (tokens.isEmpty() || tokens.get(0).equals("null")) { System.out.println("null"); return; }\n        TreeNode root = new TreeNode(Integer.parseInt(tokens.get(0)));\n        Queue<TreeNode> q = new LinkedList<>(); q.add(root); int i = 1;\n        while (!q.isEmpty() && i < tokens.size()) {\n            TreeNode cur = q.poll();\n            if (i < tokens.size() && !tokens.get(i).equals("null")) { cur.left = new TreeNode(Integer.parseInt(tokens.get(i))); q.add(cur.left); } i++;\n            if (i < tokens.size() && !tokens.get(i).equals("null")) { cur.right = new TreeNode(Integer.parseInt(tokens.get(i))); q.add(cur.right); } i++;\n        }\n        Codec codec = new Codec();\n        TreeNode r2 = codec.deserialize(codec.serialize(root));\n        Queue<TreeNode> pq = new LinkedList<>(); pq.add(r2);\n        List<String> out = new ArrayList<>();\n        while (!pq.isEmpty()) {\n            TreeNode cur = pq.poll();\n            if (cur == null) { out.add("null"); continue; }\n            out.add(String.valueOf(cur.val)); pq.add(cur.left); pq.add(cur.right);\n        }\n        while (!out.isEmpty() && out.get(out.size()-1).equals("null")) out.remove(out.size()-1);\n        System.out.println(String.join(" ", out));\n    }\n}`,
      javascript: `const tokens = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/);\n\nfunction TreeNode(val, left, right) { this.val = val; this.left = left || null; this.right = right || null; }\n\n__USER_CODE__\n\nif (!tokens.length || tokens[0] === 'null') { console.log('null'); process.exit(); }\nconst root = new TreeNode(+tokens[0]);\nconst q = [root]; let i = 1;\nwhile (q.length && i < tokens.length) {\n    const cur = q.shift();\n    if (tokens[i] !== 'null') { cur.left = new TreeNode(+tokens[i]); q.push(cur.left); } i++;\n    if (i < tokens.length && tokens[i] !== 'null') { cur.right = new TreeNode(+tokens[i]); q.push(cur.right); } i++;\n}\nconst r2 = deserialize(serialize(root));\nconst out = [], pq = [r2];\nwhile (pq.length) {\n    const cur = pq.shift();\n    if (!cur) { out.push('null'); continue; }\n    out.push(String(cur.val)); pq.push(cur.left); pq.push(cur.right);\n}\nwhile (out.length && out[out.length-1] === 'null') out.pop();\nconsole.log(out.join(' '));`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct TreeNode { int val; struct TreeNode *left, *right; };\n\n__USER_CODE__\n\nint main() { printf("1\\n"); return 0; }`,
    },
    aiContext: 'Serialize and Deserialize Binary Tree — BFS level-order with null markers O(n)',
  },

  // ── 161. Number of Connected Components in an Undirected Graph ────────────────
  {
    number: 161, title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
    companies: ['LinkedIn', 'Google', 'Amazon', 'Facebook'], acceptance: 61.4, premium: false,
    description: `Given <code>n</code> nodes labeled <code>0</code> to <code>n-1</code> and a list of undirected edges, return the number of connected components in the graph.<br><br>Input: first line has <code>n</code> and <code>e</code> (edge count). Next <code>e</code> lines each have two integers <code>u v</code>.`,
    examples: [
      { input: 'n=5, edges=[[0,1],[1,2],[3,4]]',       output: '2' },
      { input: 'n=5, edges=[[0,1],[1,2],[2,3],[3,4]]', output: '1' },
    ],
    constraints: ['1 ≤ n ≤ 2000', '0 ≤ edges.length ≤ 5000', 'No duplicate edges, no self-loops'],
    testCases: [
      { input: '5 3\n0 1\n1 2\n3 4', expected: '2', hidden: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4', expected: '1', hidden: false },
      { input: '4 0',                      expected: '4', hidden: true  },
      { input: '3 1\n0 2',                 expected: '2', hidden: true  },
    ],
    hints: [
      'Union-Find: start with n components, decrement each time you union two different sets.',
      'Alternatively DFS/BFS from each unvisited node — count how many times you start a new traversal.',
      'Union-Find with path compression runs in nearly O(n) time.',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    int countComponents(int n, vector<vector<int>>& edges) {\n\n    }\n};`,
      python: `class Solution:\n    def countComponents(self, n: int, edges: List[List[int]]) -> int:\n        `,
      java: `class Solution {\n    public int countComponents(int n, int[][] edges) {\n\n    }\n}`,
      javascript: `/**\n * @param {number} n\n * @param {number[][]} edges\n * @return {number}\n */\nvar countComponents = function(n, edges) {\n\n};`,
      c: `int countComponents(int n, int** edges, int edgesSize, int* edgesColSize) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    int n, e; cin >> n >> e;\n    vector<vector<int>> edges(e, vector<int>(2));\n    for (int i = 0; i < e; i++) cin >> edges[i][0] >> edges[i][1];\n    Solution sol;\n    cout << sol.countComponents(n, edges) << endl;\n    return 0;\n}`,
      python: `import sys\nfrom typing import List\n\n__USER_CODE__\n\ndata = sys.stdin.read().split()\nidx = 0\nn, e = int(data[idx]), int(data[idx+1]); idx += 2\nedges = []\nfor _ in range(e):\n    edges.append([int(data[idx]), int(data[idx+1])]); idx += 2\nprint(Solution().countComponents(n, edges))`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), e = sc.nextInt();\n        int[][] edges = new int[e][2];\n        for (int i = 0; i < e; i++) { edges[i][0] = sc.nextInt(); edges[i][1] = sc.nextInt(); }\n        System.out.println(new Solution().countComponents(n, edges));\n    }\n}`,
      javascript: `const data = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = data[idx++], e = data[idx++];\nconst edges = [];\nfor (let i = 0; i < e; i++) edges.push([data[idx++], data[idx++]]);\n\n__USER_CODE__\n\nconsole.log(countComponents(n, edges));`,
      c: `#include <stdio.h>\n\n__USER_CODE__\n\nint main() {\n    int n, e; scanf("%d %d", &n, &e);\n    int buf[5000][2], cols[5000];\n    for (int i = 0; i < e; i++) { scanf("%d %d", &buf[i][0], &buf[i][1]); cols[i] = 2; }\n    int* ptrs[5000];\n    for (int i = 0; i < e; i++) ptrs[i] = buf[i];\n    printf("%d\\n", countComponents(n, (int**)ptrs, e, cols));\n    return 0;\n}`,
    },
    aiContext: 'Number of Connected Components — Union-Find or DFS/BFS O(n+e)',
  },

  // ── 162. Word Ladder ──────────────────────────────────────────────────────────
  {
    number: 162, title: 'Word Ladder', slug: 'word-ladder', difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Breadth-First Search'],
    companies: ['Amazon', 'Facebook', 'Google', 'LinkedIn', 'Snapchat'], acceptance: 37.2, premium: false,
    description: `Given a <code>beginWord</code>, <code>endWord</code>, and a word list, return the number of words in the shortest transformation sequence from <code>beginWord</code> to <code>endWord</code>. Each step changes exactly one letter and every intermediate word must exist in the word list. Return <code>0</code> if no sequence exists.<br><br>Input: first line has beginWord and endWord. Second line has the space-separated word list.`,
    examples: [
      { input: 'beginWord="hit" endWord="cog" wordList=["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit→hot→dot→dog→cog' },
      { input: 'beginWord="hit" endWord="cog" wordList=["hot","dot","dog","lot","log"]',        output: '0' },
    ],
    constraints: ['1 ≤ beginWord.length ≤ 10', 'endWord.length == beginWord.length', '1 ≤ wordList.length ≤ 5000'],
    testCases: [
      { input: 'hit cog\nhot dot dog lot log cog', expected: '5', hidden: false },
      { input: 'hit cog\nhot dot dog lot log',     expected: '0', hidden: false },
      { input: 'a c\na b c',                       expected: '2', hidden: true  },
      { input: 'hot dog\nhot dog',                 expected: '2', hidden: true  },
    ],
    hints: [
      'BFS is ideal — it finds the shortest path naturally.',
      'For each word try replacing every character with a–z and check if the result is in the word set.',
      'Remove visited words from the set to avoid cycles.',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n\n    }\n};`,
      python: `class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:\n        `,
      java: `class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n\n    }\n}`,
      javascript: `/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nvar ladderLength = function(beginWord, endWord, wordList) {\n\n};`,
      c: `int ladderLength(char* beginWord, char* endWord, char** wordList, int wordListSize) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    string begin, end; cin >> begin >> end;\n    cin.ignore();\n    string line; getline(cin, line);\n    istringstream ss(line);\n    vector<string> wordList;\n    string w; while (ss >> w) wordList.push_back(w);\n    Solution sol;\n    cout << sol.ladderLength(begin, end, wordList) << endl;\n    return 0;\n}`,
      python: `import sys\nfrom typing import List\n\n__USER_CODE__\n\nlines = sys.stdin.read().splitlines()\nbegin, end = lines[0].split()\nwordList = lines[1].split() if len(lines) > 1 else []\nprint(Solution().ladderLength(begin, end, wordList))`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String begin = sc.next(), end = sc.next();\n        sc.nextLine();\n        List<String> words = new ArrayList<>(Arrays.asList(sc.nextLine().trim().split(" ")));\n        System.out.println(new Solution().ladderLength(begin, end, words));\n    }\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst [beginWord, endWord] = lines[0].split(' ');\nconst wordList = lines[1] ? lines[1].split(' ') : [];\n\n__USER_CODE__\n\nconsole.log(ladderLength(beginWord, endWord, wordList));`,
      c: `#include <stdio.h>\n#include <string.h>\n\n__USER_CODE__\n\nint main() {\n    char begin[15], end[15]; scanf("%s %s", begin, end);\n    char words[5001][15]; int n = 0;\n    while (scanf("%s", words[n]) == 1) n++;\n    char* wl[5001];\n    for (int i = 0; i < n; i++) wl[i] = words[i];\n    printf("%d\\n", ladderLength(begin, end, wl, n));\n    return 0;\n}`,
    },
    aiContext: 'Word Ladder — BFS shortest path with single-char substitutions O(M²×N)',
  },

  // ── 163. Alien Dictionary ─────────────────────────────────────────────────────
  {
    number: 163, title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'Hard',
    tags: ['Array', 'String', 'Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    companies: ['Facebook', 'Airbnb', 'Google', 'Snapchat', 'Twitter'], acceptance: 33.8, premium: false,
    description: `You are given a list of strings from an alien language's dictionary sorted in lexicographic order by that language's rules. Derive the order of letters in that language and return them as a string. If no valid order exists return <code>""</code>. If multiple valid orders exist return any.<br><br>Input: first line is number of words <code>n</code>, then <code>n</code> lines each with one word.`,
    examples: [
      { input: 'words=["wrt","wrf","er","ett","rftt"]', output: 'wertf' },
      { input: 'words=["z","x"]',                       output: 'zx'    },
      { input: 'words=["z","x","z"]',                   output: '',     explanation: 'Cycle — invalid' },
    ],
    constraints: ['1 ≤ words.length ≤ 100', '1 ≤ words[i].length ≤ 100', 'All chars are lowercase English letters'],
    testCases: [
      { input: '5\nwrt\nwrf\ner\nett\nrftt', expected: 'wertf', hidden: false },
      { input: '2\nz\nx',                    expected: 'zx',    hidden: false },
      { input: '3\nz\nx\nz',                 expected: '',      hidden: false },
      { input: '2\nabc\nab',                 expected: '',      hidden: true  },
    ],
    hints: [
      'Compare adjacent words character by character — the first differing pair gives a directed edge.',
      'Build a graph then run topological sort (Kahn\'s BFS or DFS).',
      'If a cycle is detected (queue empties before all nodes are processed) return "".',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    string alienOrder(vector<string>& words) {\n\n    }\n};`,
      python: `class Solution:\n    def alienOrder(self, words: List[str]) -> str:\n        `,
      java: `class Solution {\n    public String alienOrder(String[] words) {\n\n    }\n}`,
      javascript: `/**\n * @param {string[]} words\n * @return {string}\n */\nvar alienOrder = function(words) {\n\n};`,
      c: `char* alienOrder(char** words, int wordsSize) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    int n; cin >> n;\n    vector<string> words(n);\n    for (int i = 0; i < n; i++) cin >> words[i];\n    Solution sol;\n    cout << sol.alienOrder(words) << endl;\n    return 0;\n}`,
      python: `import sys\nfrom typing import List\n\n__USER_CODE__\n\nlines = sys.stdin.read().splitlines()\nn = int(lines[0])\nwords = [lines[i+1] for i in range(n)]\nprint(Solution().alienOrder(words))`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        String[] words = new String[n];\n        for (int i = 0; i < n; i++) words[i] = sc.nextLine().trim();\n        System.out.println(new Solution().alienOrder(words));\n    }\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst words = lines.slice(1, n + 1);\n\n__USER_CODE__\n\nconsole.log(alienOrder(words));`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\n__USER_CODE__\n\nint main() {\n    int n; scanf("%d ", &n);\n    char** words = malloc(n * sizeof(char*));\n    for (int i = 0; i < n; i++) { words[i] = malloc(105); scanf("%s", words[i]); }\n    printf("%s\\n", alienOrder(words, n));\n    return 0;\n}`,
    },
    aiContext: 'Alien Dictionary — topological sort on character ordering graph O(C)',
  },

  // ── 164. Regular Expression Matching ─────────────────────────────────────────
  {
    number: 164, title: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    companies: ['Google', 'Facebook', 'Uber', 'Airbnb', 'Twitter'], acceptance: 28.1, premium: false,
    description: `Implement regular expression matching with <code>'.'</code> (matches any single character) and <code>'*'</code> (matches zero or more of the preceding element). The match must cover the entire input string.<br><br>Input: first line is string <code>s</code>, second line is pattern <code>p</code>. Output: <code>true</code> or <code>false</code>.`,
    examples: [
      { input: 's="aa" p="a"',  output: 'false', explanation: '"a" does not match entire "aa"' },
      { input: 's="aa" p="a*"', output: 'true',  explanation: '"a*" matches zero or more a'    },
      { input: 's="ab" p=".*"', output: 'true',  explanation: '".*" matches any sequence'      },
    ],
    constraints: ['1 ≤ s.length ≤ 20', '1 ≤ p.length ≤ 30', 's has only lowercase letters', 'p has lowercase letters, ".", and "*"'],
    testCases: [
      { input: 'aa\na',              expected: 'false', hidden: false },
      { input: 'aa\na*',             expected: 'true',  hidden: false },
      { input: 'ab\n.*',             expected: 'true',  hidden: false },
      { input: 'aab\nc*a*b',         expected: 'true',  hidden: true  },
      { input: 'mississippi\nmis*is*p*.', expected: 'false', hidden: true },
    ],
    hints: [
      'DP: let dp[i][j] = true if s[0..i-1] matches p[0..j-1].',
      'If p[j-1] == "*": dp[i][j] = dp[i][j-2] (skip x*) OR (char matches AND dp[i-1][j]).',
      'If p[j-1] == "." or p[j-1] == s[i-1]: dp[i][j] = dp[i-1][j-1].',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    bool isMatch(string s, string p) {\n\n    }\n};`,
      python: `class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        `,
      java: `class Solution {\n    public boolean isMatch(String s, String p) {\n\n    }\n}`,
      javascript: `/**\n * @param {string} s\n * @param {string} p\n * @return {boolean}\n */\nvar isMatch = function(s, p) {\n\n};`,
      c: `bool isMatch(char* s, char* p) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    string s, p; cin >> s >> p;\n    Solution sol;\n    cout << (sol.isMatch(s, p) ? "true" : "false") << endl;\n    return 0;\n}`,
      python: `import sys\n\n__USER_CODE__\n\nlines = sys.stdin.read().splitlines()\ns, p = lines[0], lines[1]\nprint(str(Solution().isMatch(s, p)).lower())`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next(), p = sc.next();\n        System.out.println(new Solution().isMatch(s, p));\n    }\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst s = lines[0], p = lines[1];\n\n__USER_CODE__\n\nconsole.log(isMatch(s, p));`,
      c: `#include <stdio.h>\n#include <stdbool.h>\n\n__USER_CODE__\n\nint main() {\n    char s[25], p[35]; scanf("%s %s", s, p);\n    printf("%s\\n", isMatch(s, p) ? "true" : "false");\n    return 0;\n}`,
    },
    aiContext: 'Regular Expression Matching — 2D DP with dot and star handling O(m*n)',
  },

  // ── 165. Edit Distance ────────────────────────────────────────────────────────
  {
    number: 165, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Bloomberg', 'Uber'], acceptance: 54.7, premium: false,
    description: `Given two strings <code>word1</code> and <code>word2</code>, return the minimum number of operations (insert, delete, replace a character) to convert <code>word1</code> to <code>word2</code>.<br><br>Input: first line is word1, second line is word2.`,
    examples: [
      { input: 'word1="horse" word2="ros"',           output: '3', explanation: 'horse→rorse→rose→ros' },
      { input: 'word1="intention" word2="execution"', output: '5' },
    ],
    constraints: ['0 ≤ word1.length, word2.length ≤ 500', 'Words consist of lowercase English letters'],
    testCases: [
      { input: 'horse\nros',            expected: '3', hidden: false },
      { input: 'intention\nexecution',  expected: '5', hidden: false },
      { input: '\nabc',                 expected: '3', hidden: true  },
      { input: 'abc\nabc',              expected: '0', hidden: true  },
    ],
    hints: [
      'dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1].',
      'Base cases: dp[i][0] = i (delete all), dp[0][j] = j (insert all).',
      'Transition: if chars match dp[i][j] = dp[i-1][j-1], else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
    ],
    starter: {
      cpp: `class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n\n    }\n};`,
      python: `class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        `,
      java: `class Solution {\n    public int minDistance(String word1, String word2) {\n\n    }\n}`,
      javascript: `/**\n * @param {string} word1\n * @param {string} word2\n * @return {number}\n */\nvar minDistance = function(word1, word2) {\n\n};`,
      c: `int minDistance(char* word1, char* word2) {\n\n}`,
    },
    codeWrapper: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n__USER_CODE__\n\nint main() {\n    string w1, w2;\n    getline(cin, w1); getline(cin, w2);\n    Solution sol;\n    cout << sol.minDistance(w1, w2) << endl;\n    return 0;\n}`,
      python: `import sys\n\n__USER_CODE__\n\nlines = sys.stdin.read().splitlines()\nw1 = lines[0] if lines else ""\nw2 = lines[1] if len(lines) > 1 else ""\nprint(Solution().minDistance(w1, w2))`,
      java: `import java.util.*;\n\n__USER_CODE__\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));\n        String w1 = br.readLine(); if (w1 == null) w1 = "";\n        String w2 = br.readLine(); if (w2 == null) w2 = "";\n        System.out.println(new Solution().minDistance(w1, w2));\n    }\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst word1 = lines[0] || '', word2 = lines[1] || '';\n\n__USER_CODE__\n\nconsole.log(minDistance(word1, word2));`,
      c: `#include <stdio.h>\n\n__USER_CODE__\n\nint main() {\n    char w1[505], w2[505];\n    scanf("%s %s", w1, w2);\n    printf("%d\\n", minDistance(w1, w2));\n    return 0;\n}`,
    },
    aiContext: 'Edit Distance — classic 2D DP insert/delete/replace O(m*n)',
  },


];

// ── Seed ─────────────────────────────────────────────────────────────────────
let inserted = 0;
for (const p of problems) {
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
await Problem.findOneAndUpdate(
  { number: p.number },
  { ...p, slug, aiContext: p.aiContext || `${p.title} — ${p.tags.join(', ')}` },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
  inserted++;
  console.log(` #${p.number} ${p.title}`);
}

console.log(`\nSeeded ${inserted} problems + admin user`);
await mongoose.disconnect();
