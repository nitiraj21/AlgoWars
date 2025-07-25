import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  await prisma.matchParticipant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.problem.deleteMany();

  console.log('Old data deleted successfully.');

  const problemsToCreate = [
    {
        id: '1',
        title: 'Indices for Target Sum',
        slug: 'indices-for-target-sum',
        description: 'You are given a list of numbers and a specific target value. Your task is to find two numbers in this list that sum up to the target. Return the indices of these two numbers.',
        difficulty: Difficulty.EASY,
        functionName: 'findPairSum',
        testCases: { "Input": "[10,20,30,40]\n50", "Output": "[1,2]" },
        StarterCode: {
          javascript: 'var findPairSum = function(nums, target) {\n    // Your code here\n};',
          python: 'class Solution:\n    def findPairSum(self, nums: list[int], target: int) -> list[int]:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    vector<int> findPairSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public int[] findPairSum(int[] nums, int target) {\n        // Your code here\n    }\n}',
        },
      },
      // 2. Array - Medium
      {
        id: '2',
        title: 'Maximum Water Storage',
        slug: 'maximum-water-storage',
        description: 'Imagine a series of vertical bars of different heights. You need to select two bars that, when used as the sides of a container, can hold the maximum amount of water. Return this maximum capacity.',
        difficulty: Difficulty.MEDIUM,
        functionName: 'maxAreaContainer',
        testCases: { "Input": "[2,3,4,5,18,17,6]\n", "Output": "17" },
        StarterCode: {
          javascript: 'var maxAreaContainer = function(height) {\n    // Your code here\n};',
          python: 'class Solution:\n    def maxAreaContainer(self, height: list[int]) -> int:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    int maxAreaContainer(vector<int>& height) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public int maxAreaContainer(int[] height) {\n        // Your code here\n    }\n}',
        },
      },
      // 3. String - Easy
      {
        id: '3',
        title: 'Palindrome String Check',
        slug: 'palindrome-string-check',
        description: "You are given a string. Determine if it's a palindrome after you convert it to lowercase and remove all characters that are not letters or numbers. Return true if it is, and false otherwise.",
        difficulty: Difficulty.EASY,
        functionName: 'isPalindrome',
        testCases: { "Input": "Was it a car or a cat I saw?\n", "Output": "true" },
        StarterCode: {
          javascript: 'var isPalindrome = function(s) {\n    // Your code here\n};',
          python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n    }\n}',
        },
      },
      // 4. String - Medium
      {
          id: '4',
          title: 'Longest Unique Substring',
          slug: 'longest-unique-substring',
          description: 'From a given string, find the length of the longest possible substring that does not contain any repeating characters.',
          difficulty: Difficulty.MEDIUM,
          functionName: 'lengthOfLongestSubstring',
          testCases: { "Input": "pwwkew\n", "Output": "3" },
          StarterCode: {
            javascript: 'var lengthOfLongestSubstring = function(s) {\n    // Your code here\n};',
            python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}',
          },
      },
      // 5. Linked List - Easy
      {
          id: '5',
          title: 'Invert Linked List',
          slug: 'invert-linked-list',
          description: 'You are provided with the head of a singly linked list. Your task is to reverse the order of the nodes and return the new head of the inverted list.',
          difficulty: Difficulty.EASY,
          functionName: 'reverseList',
          testCases: { "Input": "[10,20,30]\n", "Output": "[30,20,10]" },
          StarterCode: {
            javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n * this.val = (val===undefined ? 0 : val)\n * this.next = (next===undefined ? null : next)\n * }\n */\nvar reverseList = function(head) {\n    // Your code here\n};',
            python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Your code here\n        pass',
            cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n * int val;\n * ListNode *next;\n * ListNode() : val(0), next(nullptr) {}\n * ListNode(int x) : val(x), next(nullptr) {}\n * ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n    }\n};',
            java: '/**\n * Definition for singly-linked list.\n * public class ListNode {\n * int val;\n * ListNode next;\n * ListNode() {}\n * ListNode(int val) { this.val = val; }\n * ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}',
          },
      },
      // 6. Linked List - Medium
      {
          id: '6',
          title: 'Find Loop in Linked List',
          slug: 'find-loop-in-linked-list',
          description: "You are given the head of a linked list. Check if it contains a cycle (i.e., a node points back to a previous node). Return true if a cycle exists, false otherwise.",
          difficulty: Difficulty.MEDIUM,
          functionName: 'hasCycle',
          testCases: { "Input": "[1,2]\n0", "Output": "true" },
          StarterCode: {
            javascript: 'var hasCycle = function(head) {\n    // Your code here\n};',
            python: 'class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Your code here\n    }\n}',
          },
      },
      // 7. Binary Tree - Easy
      {
          id: '7',
          title: 'Tree Height Calculation',
          slug: 'tree-height-calculation',
          description: 'Calculate the maximum depth of a given binary tree. The depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
          difficulty: Difficulty.EASY,
          functionName: 'maxDepth',
          testCases: { "Input": "[1,null,2]\n", "Output": "2" },
          StarterCode: {
            javascript: 'var maxDepth = function(root) {\n    // Your code here\n};',
            python: 'class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}',
          },
      },
      // 8. Binary Tree - Medium
      {
          id: '8',
          title: 'Verify BST Property',
          slug: 'verify-bst-property',
          description: 'You are given the root of a binary tree. Check if it is a valid Binary Search Tree (BST). A BST is valid if for every node, all values in its left subtree are smaller, and all values in its right subtree are larger.',
          difficulty: Difficulty.MEDIUM,
          functionName: 'isValidBST',
          testCases: { "Input": "[2,1,3]\n", "Output": "true" },
          StarterCode: {
            javascript: 'var isValidBST = function(root) {\n    // Your code here\n};',
            python: 'class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Your code here\n    }\n}',
          },
      },
      // 9. Dynamic Programming - Easy
      {
          id: '9',
          title: 'Staircase Step Combinations',
          slug: 'staircase-step-combinations',
          description: 'You need to climb a staircase with `n` steps. You can take either 1 or 2 steps at a time. Calculate the total number of distinct ways you can reach the top.',
          difficulty: Difficulty.EASY,
          functionName: 'climbStairs',
          testCases: { "Input": "4\n", "Output": "5" },
          StarterCode: {
            javascript: 'var climbStairs = function(n) {\n    // Your code here\n};',
            python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n}',
          },
      },
      // 10. Dynamic Programming - Medium
      {
          id: '10',
          title: 'Minimum Coin Combination',
          slug: 'minimum-coin-combination',
          description: "Given a set of coin denominations and a total amount, determine the minimum number of coins required to make up that amount. If it's impossible, return -1.",
          difficulty: Difficulty.MEDIUM,
          functionName: 'coinChange',
          testCases: { "Input": "[2]\n3", "Output": "-1" },
          StarterCode: {
            javascript: 'var coinChange = function(coins, amount) {\n    // Your code here\n};',
            python: 'class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n    }\n}',
          },
      },
      // 11. Graph - Medium
      {
          id: '11',
          title: 'Count Land Masses',
          slug: 'count-land-masses',
          description: "You are given a 2D grid map where '1' represents land and '0' represents water. An island is a group of connected '1's. Your task is to count the total number of separate islands on the map.",
          difficulty: Difficulty.MEDIUM,
          functionName: 'numIslands',
          testCases: { "Input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]\n", "Output": "1" },
          StarterCode: {
            javascript: 'var numIslands = function(grid) {\n    // Your code here\n};',
            python: 'class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n    }\n}',
          },
      },
      // 12. Heap - Medium
      {
          id: '12',
          title: 'Most Frequent K Numbers',
          slug: 'most-frequent-k-numbers',
          description: 'From a given list of numbers, find the `k` elements that appear most frequently. You can return the result in any order.',
          difficulty: Difficulty.MEDIUM,
          functionName: 'topKFrequent',
          testCases: { "Input": "[4,1,-1,2,-1,2,3]\n2", "Output": "[-1,2]" },
          StarterCode: {
            javascript: 'var topKFrequent = function(nums, k) {\n    // Your code here\n};',
            python: 'class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Your code here\n    }\n}',
          },
      },
      // 13. Sliding Window - Hard
      {
          id: '13',
          title: 'Smallest Covering Substring',
          slug: 'smallest-covering-substring',
          description: "You are given two strings, `s` (the search string) and `t` (the pattern). Find the smallest substring in `s` that contains all the characters of `t`. If no such window exists, return an empty string.",
          difficulty: Difficulty.HARD,
          functionName: 'minWindow',
          testCases: { "Input": "a\na", "Output": "a" },
          StarterCode: {
            javascript: 'var minWindow = function(s, t) {\n    // Your code here\n};',
            python: 'class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public String minWindow(String s, String t) {\n        // Your code here\n    }\n}',
          },
      },
      // 14. Matrix - Medium
      {
          id: '14',
          title: 'Matrix 90-Degree Rotation',
          slug: 'matrix-90-degree-rotation',
          description: "Given a square matrix (n x n), rotate it 90 degrees clockwise. The challenge is to perform this rotation without using any extra matrix for storage (in-place).",
          difficulty: Difficulty.MEDIUM,
          functionName: 'rotate',
          testCases: { "Input": "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\n", "Output": "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" },
          StarterCode: {
            javascript: 'var rotate = function(matrix) {\n    // Your code here\n};',
            python: 'class Solution:\n    def rotate(self, matrix: list[list[int]]) -> None:\n        """\n        Do not return anything, modify matrix in-place instead.\n        """\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    public void rotate(int[][] matrix) {\n        // Your code here\n    }\n}',
          },
      },
      // 15. Bit Manipulation - Easy
      {
          id: '15',
          title: 'Count Set Bits',
          slug: 'count-set-bits',
          description: "Given a 32-bit unsigned integer, count and return the number of '1's in its binary representation. This is also known as its Hamming weight.",
          difficulty: Difficulty.EASY,
          functionName: 'hammingWeight',
          testCases: { "Input": "11111111111111111111111111111101\n", "Output": "31" },
          StarterCode: {
            javascript: 'var hammingWeight = function(n) {\n    // Your code here\n};',
            python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        # Your code here\n        pass',
            cpp: 'class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        // Your code here\n    }\n};',
            java: 'class Solution {\n    // you need to treat n as an unsigned value\n    public int hammingWeight(int n) {\n        // Your code here\n    }\n}',
          },
      },

    // 16. Array - Medium (3Sum)
    {
      id: '16',
      title: 'Zero Sum Triplets',
      slug: 'zero-sum-triplets',
      description: 'Given an integer array `nums`, find all unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and their sum is zero.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'findZeroSumTriplets',
      testCases: { "Input": "[-1,0,1,2,-1,-4]\n", "Output": "[[-1,-1,2],[-1,0,1]]" },
      StarterCode: {
        javascript: 'var findZeroSumTriplets = function(nums) {\n    // Your code here\n};',
        python: 'class Solution:\n    def findZeroSumTriplets(self, nums: list[int]) -> list[list[int]]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    vector<vector<int>> findZeroSumTriplets(vector<int>& nums) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public List<List<Integer>> findZeroSumTriplets(int[] nums) {\n        // Your code here\n    }\n}',
      },
    },
    // 17. Array - Medium (Product of Array Except Self)
    {
      id: '17',
      title: 'Product of Others',
      slug: 'product-of-others',
      description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'productExceptSelf',
      testCases: { "Input": "[1,2,3,4]\n", "Output": "[24,12,8,6]" },
      StarterCode: {
        javascript: 'var productExceptSelf = function(nums) {\n    // Your code here\n};',
        python: 'class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n    }\n}',
      },
    },
    // 18. Array - Easy (Best Time to Buy and Sell Stock)
    {
      id: '18',
      title: 'Maximize Stock Profit',
      slug: 'maximize-stock-profit',
      description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
      difficulty: Difficulty.EASY,
      functionName: 'maxProfit',
      testCases: { "Input": "[7,1,5,3,6,4]\n", "Output": "5" },
      StarterCode: {
        javascript: 'var maxProfit = function(prices) {\n    // Your code here\n};',
        python: 'class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n    }\n}',
      },
    },
    // 19. String - Easy (Valid Anagram)
    {
      id: '19',
      title: 'Anagram Check',
      slug: 'anagram-check',
      description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
      difficulty: Difficulty.EASY,
      functionName: 'isAnagram',
      testCases: { "Input": "anagram\nnagaram", "Output": "true" },
      StarterCode: {
        javascript: 'var isAnagram = function(s, t) {\n    // Your code here\n};',
        python: 'class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n    }\n}',
      },
    },
    // 20. String - Medium (Group Anagrams)
    {
      id: '20',
      title: 'Group by Anagrams',
      slug: 'group-by-anagrams',
      description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'groupAnagrams',
      testCases: { "Input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\n", "Output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      StarterCode: {
        javascript: 'var groupAnagrams = function(strs) {\n    // Your code here\n};',
        python: 'class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n    }\n}',
      },
    },
    // 21. Linked List - Easy (Merge Two Sorted Lists)
    {
      id: '21',
      title: 'Combine Sorted Lists',
      slug: 'combine-sorted-lists',
      description: 'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.',
      difficulty: Difficulty.EASY,
      functionName: 'mergeTwoLists',
      testCases: { "Input": "[1,2,4]\n[1,3,4]", "Output": "[1,1,2,3,4,4]" },
      StarterCode: {
        javascript: 'var mergeTwoLists = function(list1, list2) {\n    // Your code here\n};',
        python: 'class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n    }\n}',
      },
    },
    // 22. Binary Tree - Easy (Invert Binary Tree)
    {
      id: '22',
      title: 'Mirror a Binary Tree',
      slug: 'mirror-binary-tree',
      description: 'Given the `root` of a binary tree, invert the tree, and return its root. Inverting a tree means swapping the left and right children of every node.',
      difficulty: Difficulty.EASY,
      functionName: 'invertTree',
      testCases: { "Input": "[4,2,7,1,3,6,9]\n", "Output": "[4,7,2,9,6,3,1]" },
      StarterCode: {
        javascript: 'var invertTree = function(root) {\n    // Your code here\n};',
        python: 'class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n    }\n}',
      },
    },
    // 23. Dynamic Programming - Medium (House Robber)
    {
      id: '23',
      title: 'Street Robbery',
      slug: 'street-robbery',
      description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'rob',
      testCases: { "Input": "[2,7,9,3,1]\n", "Output": "12" },
      StarterCode: {
        javascript: 'var rob = function(nums) {\n    // Your code here\n};',
        python: 'class Solution:\n    def rob(self, nums: list[int]) -> int:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public int rob(int[] nums) {\n        // Your code here\n    }\n}',
      },
    },
    // 24. Dynamic Programming - Medium (Longest Increasing Subsequence)
    {
      id: '24',
      title: 'Longest Ascending Sequence',
      slug: 'longest-ascending-sequence',
      description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'lengthOfLIS',
      testCases: { "Input": "[10,9,2,5,3,7,101,18]\n", "Output": "4" },
      StarterCode: {
        javascript: 'var lengthOfLIS = function(nums) {\n    // Your code here\n};',
        python: 'class Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Your code here\n    }\n}',
      },
    },
    // 25. Graph - Medium (Clone Graph)
    {
      id: '25',
      title: 'Duplicate Graph Structure',
      slug: 'duplicate-graph-structure',
      description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value and a list of its neighbors.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'cloneGraph',
      testCases: { "Input": "[[2,4],[1,3],[2,4],[1,3]]\n", "Output": "[[2,4],[1,3],[2,4],[1,3]]" },
      StarterCode: {
        javascript: 'var cloneGraph = function(node) {\n    // Your code here\n};',
        python: 'class Solution:\n    def cloneGraph(self, node: "Node") -> "Node":\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public Node cloneGraph(Node node) {\n        // Your code here\n    }\n}',
      },
    },
    // 26. Graph - Medium (Course Schedule)
    {
      id: '26',
      title: 'Course Completion Check',
      slug: 'course-completion-check',
      description: 'There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'canFinish',
      testCases: { "Input": "2\n[[1,0]]", "Output": "true" },
      StarterCode: {
        javascript: 'var canFinish = function(numCourses, prerequisites) {\n    // Your code here\n};',
        python: 'class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Your code here\n    }\n}',
      },
    },
    // 27. Matrix - Medium (Set Matrix Zeroes)
    {
      id: '27',
      title: 'Zero Out Matrix',
      slug: 'zero-out-matrix',
      description: 'Given an `m x n` integer `matrix`, if an element is 0, set its entire row and column to 0s. You must do this in-place.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'setZeroes',
      testCases: { "Input": "[[1,1,1],[1,0,1],[1,1,1]]\n", "Output": "[[1,0,1],[0,0,0],[1,0,1]]" },
      StarterCode: {
        javascript: 'var setZeroes = function(matrix) {\n    // Your code here\n};',
        python: 'class Solution:\n    def setZeroes(self, matrix: list[list[int]]) -> None:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    void setZeroes(vector<vector<int>>& matrix) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public void setZeroes(int[][] matrix) {\n        // Your code here\n    }\n}',
      },
    },
    // 28. Matrix - Medium (Spiral Matrix)
    {
      id: '28',
      title: 'Spiral Traversal',
      slug: 'spiral-traversal',
      description: 'Given an `m x n` `matrix`, return all elements of the `matrix` in spiral order.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'spiralOrder',
      testCases: { "Input": "[[1,2,3],[4,5,6],[7,8,9]]\n", "Output": "[1,2,3,6,9,8,7,4,5]" },
      StarterCode: {
        javascript: 'var spiralOrder = function(matrix) {\n    // Your code here\n};',
        python: 'class Solution:\n    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Your code here\n    }\n}',
      },
    },
    // 29. Intervals - Medium (Merge Intervals)
    {
      id: '29',
      title: 'Combine Overlapping Intervals',
      slug: 'combine-overlapping-intervals',
      description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'merge',
      testCases: { "Input": "[[1,3],[2,6],[8,10],[15,18]]\n", "Output": "[[1,6],[8,10],[15,18]]" },
      StarterCode: {
        javascript: 'var merge = function(intervals) {\n    // Your code here\n};',
        python: 'class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n    }\n}',
      },
    },
    // 30. Array - Easy (Contains Duplicate)
    {
      id: '30',
      title: 'Find Duplicates in Array',
      slug: 'find-duplicates-in-array',
      description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
      difficulty: Difficulty.EASY,
      functionName: 'containsDuplicate',
      testCases: { "Input": "[1,2,3,1]\n", "Output": "true" },
      StarterCode: {
        javascript: 'var containsDuplicate = function(nums) {\n    // Your code here\n};',
        python: 'class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Your code here\n        pass',
        cpp: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Your code here\n    }\n};',
        java: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n    }\n}',
      },
    },
    // 31. String - Hard (Longest Palindromic Substring)
    {
      id: '31',
      title: 'Longest Palindromic Subsequence',
      slug: 'longest-palindromic-subsequence',
      description: 'Given a string `s`, find the longest palindromic substring in `s`.',
      difficulty: Difficulty.HARD,
      functionName: 'longestPalindrome',
      testCases: { "Input": "babad\n", "Output": "bab" },
      StarterCode: {
          javascript: 'var longestPalindrome = function(s) {\n    // Your code here\n};',
          python: 'class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public String longestPalindrome(String s) {\n        // Your code here\n    }\n}',
      },
    },
    // 32. Linked List - Medium (Remove Nth Node From End of List)
    {
      id: '32',
      title: 'Remove Nth Last Node',
      slug: 'remove-nth-last-node',
      description: 'Given the `head` of a linked list, remove the `n`th node from the end of the list and return its head.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'removeNthFromEnd',
      testCases: { "Input": "[1,2,3,4,5]\n2", "Output": "[1,2,3,5]" },
      StarterCode: {
          javascript: 'var removeNthFromEnd = function(head, n) {\n    // Your code here\n};',
          python: 'class Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Your code here\n    }\n}',
      },
    },
    // 33. Binary Tree - Medium (Kth Smallest Element in a BST)
    {
      id: '33',
      title: 'Kth Smallest in BST',
      slug: 'kth-smallest-in-bst',
      description: 'Given the `root` of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'kthSmallest',
      testCases: { "Input": "[3,1,4,null,2]\n1", "Output": "1" },
      StarterCode: {
          javascript: 'var kthSmallest = function(root, k) {\n    // Your code here\n};',
          python: 'class Solution:\n    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Your code here\n    }\n}',
      },
    },
    // 34. Binary Tree - Medium (Lowest Common Ancestor of a BST)
    {
      id: '34',
      title: 'BST Common Ancestor',
      slug: 'bst-common-ancestor',
      description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants.',
      difficulty: Difficulty.MEDIUM,
      functionName: 'lowestCommonAncestor',
      testCases: { "Input": "[6,2,8,0,4,7,9,null,null,3,5]\n2\n8", "Output": "6" },
      StarterCode: {
          javascript: 'var lowestCommonAncestor = function(root, p, q) {\n    // Your code here\n};',
          python: 'class Solution:\n    def lowestCommonAncestor(self, root: "TreeNode", p: "TreeNode", q: "TreeNode") -> "TreeNode":\n        # Your code here\n        pass',
          cpp: 'class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Your code here\n    }\n};',
          java: 'class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Your code here\n    }\n}',
      },
    },
    // 35. Heap - Hard (Find Median from Data Stream)
    {
      id: '35',
      title: 'Stream Median',
      slug: 'stream-median',
      description: 'The median is the middle value in an ordered integer list. Design a data structure that supports the following two operations: `addNum` which adds an integer number from the data stream to the data structure, and `findMedian` which returns the median of all elements so far.',
      difficulty: Difficulty.HARD,
      functionName: 'MedianFinder',
      testCases: { "Input": "[\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"]\n[[],[1],[2],[],[3],[]]", "Output": "[null,null,null,1.5,null,2.0]" },
      StarterCode: {
          javascript: 'var MedianFinder = function() {\n    // Your code here\n};\nMedianFinder.prototype.addNum = function(num) {\n    // Your code here\n};\nMedianFinder.prototype.findMedian = function() {\n    // Your code here\n};',
          python: 'class MedianFinder:\n\n    def __init__(self):\n        # Your code here\n\n    def addNum(self, num: int) -> None:\n        # Your code here\n\n    def findMedian(self) -> float:\n        # Your code here\n',
          cpp: 'class MedianFinder {\npublic:\n    MedianFinder() {\n        // Your code here\n    }\n    \n    void addNum(int num) {\n        // Your code here\n    }\n    \n    double findMedian() {\n        // Your code here\n    }\n};',
          java: 'class MedianFinder {\n\n    public MedianFinder() {\n        // Your code here\n    }\n    \n    public void addNum(int num) {\n        // Your code here\n    }\n    \n    public double findMedian() {\n        // Your code here\n    }\n}',
      },
    },
  ];

  for (const problemData of problemsToCreate) {
    await prisma.problem.create({
      data: problemData,
    });
  }

  console.log(`Seeding finished. ${problemsToCreate.length} problems created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
