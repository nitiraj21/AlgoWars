import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  // Purane data ko delete karein taaki conflicts na ho
  await prisma.matchParticipant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.problem.deleteMany();

  console.log('Old data deleted successfully.');

  const problemsToCreate = [
    // ----------------- ARRAYS & HASHING -----------------
    {
      id: '1',
      title: 'Indices for Target Sum',
      slug: 'indices-for-target-sum',
      description: 'You are given a list of numbers and a specific target value. Your task is to find two numbers in this list that sum up to the target. Return the indices of these two numbers.',
      tags: ['Array', 'Hash Table'],
      constraints: `
  - 2 <= nums.length <= 10^4
  - -10^9 <= nums[i] <= 10^9
  - -10^9 <= target <= 10^9
  - Only one valid answer exists.
      `,
      difficulty: Difficulty.EASY,
      functionName: 'findPairSum',
      inputSignature: [
        { name: 'nums', type: 'int[]' },
        { name: 'target', type: 'int' },
      ],
      testCases: [
          { Input: '[2,7,11,15]\n9', Output: '[0,1]' },
          { Input: '[3,2,4]\n6', Output: '[1,2]' },
          { Input: '[3,3]\n6', Output: '[0,1]' },
          { Input: '[-1,-5,2,10]\n1', Output: '[0,2]' },
          { Input: '[5,2,4]\n6', Output: '[1,2]' },
          { Input: '[0,4,3,0]\n0', Output: '[0,3]' },
          { Input: '[-3,4,3,90]\n0', Output: '[0,2]' },
          { Input: '[1,2,3,4,5]\n9', Output: '[3,4]' },
          { Input: '[-10,7,19,15]\n9', Output: '[0,2]' },
          { Input: '[1,1,1,1,1,1]\n2', Output: '[0,1]' },
      ],
      starterCode: {
        javascript: `var findPairSum = function(nums, target) {
      // Your code here
  };`,
        python: `class Solution:
      def findPairSum(self, nums: list[int], target: int) -> list[int]:
          # Your code here
          pass`,
        cpp: `class Solution {
  public:
      vector<int> findPairSum(vector<int>& nums, int target) {
          // Your code here
      }
  };`,
        java: `class Solution {
      public int[] findPairSum(int[] nums, int target) {
          // Your code here
      }
  }`,
      },
      driverCode: { /* ... driver code from previous answer ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8');
      const lines = input.trim().split('\\n');
      const nums = JSON.parse(lines[0]);
      const target = parseInt(lines[1], 10);
      const result = findPairSum(nums, target);
      result.sort((a,b) => a - b);
      console.log(JSON.stringify(result));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      lines = sys.stdin.readlines()
      nums = json.loads(lines[0])
      target = int(lines[1])
      solver = Solution()
      result = solver.findPairSum(nums, target)
      result.sort()
      print(json.dumps(result, separators=(',', ':')))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line1 = scanner.nextLine();
          int target = Integer.parseInt(scanner.nextLine().trim());
          scanner.close();
  
          line1 = line1.trim();
          String[] numsStr = line1.substring(1, line1.length() - 1).split(",");
          int[] nums = new int[numsStr.length];
          for(int i = 0; i < numsStr.length; i++) {
              nums[i] = Integer.parseInt(numsStr[i].trim());
          }
  
          Solution sol = new Solution();
          int[] result = sol.findPairSum(nums, target);
          Arrays.sort(result);
          System.out.println(Arrays.toString(result).replace(" ", ""));
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <algorithm>
  // USER_CODE_PLACEHOLDER
  // Helper function to parse a JSON-like array string
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      std::string content = str.substr(1, str.length() - 2);
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          if (!item.empty()) {
              vec.push_back(std::stoi(item));
          }
      }
      return vec;
  }
  
  int main() {
      std::string line1, line2;
      std::getline(std::cin, line1);
      std::getline(std::cin, line2);
  
      std::vector<int> nums = parseVector(line1);
      int target = std::stoi(line2);
  
      Solution sol;
      std::vector<int> result = sol.findPairSum(nums, target);
      std::sort(result.begin(), result.end());
  
      std::cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
      }
      std::cout << "]" << std::endl;
      return 0;
  }` },
    },
    {
      id: '2',
      title: 'Balanced Bracket Sequence',
      slug: 'balanced-bracket-sequence',
      description: "Verify if a string composed of parentheses '()', curly braces '{}', and square brackets '[]' is correctly balanced. An opening bracket must be closed by the same type of bracket and in the correct order.",
      tags: ['String', 'Stack'],
      constraints: `
  - 1 <= s.length <= 10^4
  - s consists of parentheses only '()[]{}'.
      `,
      difficulty: Difficulty.EASY,
      functionName: 'isBalanced',
      inputSignature: [{ name: 's', type: 'string' }],
      testCases: [
          { Input: '"()"', Output: 'true' },
          { Input: '"()[]{}"', Output: 'true' },
          { Input: '"(]"', Output: 'false' },
          { Input: '"([)]"', Output: 'false' },
          { Input: '"{[]}"', Output: 'true' },
          { Input: '""', Output: 'true' },
          { Input: '"{"', Output: 'false' },
          { Input: '")("', Output: 'false' },
          { Input: '"[({(())}[()])]"', Output: 'true' },
          { Input: '"((){]})"', Output: 'false' },
      ],
      starterCode: { /* ... */ javascript: `var isBalanced = function(s) {
      // Your code here
  };`, python: `class Solution:
      def isBalanced(self, s: str) -> bool:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      bool isBalanced(string s) {
          // Your code here
      }
  };`, java: `class Solution {
      public boolean isBalanced(String s) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const s = JSON.parse(input);
      const result = isBalanced(s);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      s = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.isBalanced(s)
      print(str(result).lower())
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String s = scanner.nextLine();
          scanner.close();
          // The input string from stdin is JSON-encoded, so we need to remove the quotes
          s = s.substring(1, s.length() - 1);
  
          Solution sol = new Solution();
          boolean result = sol.isBalanced(s);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <string>
  #include <vector>
  // USER_CODE_PLACEHOLDER
  int main() {
      std::string s;
      std::getline(std::cin, s);
      // The input string from stdin is JSON-encoded, so we need to remove the quotes
      if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
          s = s.substr(1, s.length() - 2);
      }
  
      Solution sol;
      bool result = sol.isBalanced(s);
      std::cout << (result ? "true" : "false") << std::endl;
      return 0;
  }` },
    },
    {
      id: '3',
      title: 'Symmetrical String Check',
      slug: 'symmetrical-string-check',
      description: 'Write a function to check if a given string is a palindrome. The check should be case-insensitive and should only consider alphanumeric characters (letters and numbers), ignoring all other characters like spaces and punctuation.',
      tags: ['String', 'Two Pointers'],
      constraints: `
  - 1 <= s.length <= 2 * 10^5
  - s consists only of printable ASCII characters.
      `,
      difficulty: Difficulty.EASY,
      functionName: 'isSymmetrical',
      inputSignature: [{ name: 's', type: 'string' }],
      testCases: [
            {Input: '"Was it a car or a cat I saw?"', Output: 'true' },
            { Input: '"hello"', Output: 'false' },
          { Input: '"A man, a plan, a canal: Panama"', Output: 'true' },
          { Input: '"race a car"', Output: 'false' },
          { Input: '""', Output: 'true' },
          { Input: '".,"', Output: 'true' },
          { Input: '"0P"', Output: 'false' },
          
          { Input: '"level"', Output: 'true' },
          
          { Input: '"12321"', Output: 'true' },
          { Input: '"ab_a"', Output: 'true' },
      ],
      starterCode: { /* ... */ javascript: `var isSymmetrical = function(s) {
      // Your code here
  };`, python: `class Solution:
      def isSymmetrical(self, s: str) -> bool:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      bool isSymmetrical(string s) {
          // Your code here
      }
  };`, java: `class Solution {
      public boolean isSymmetrical(String s) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const s = JSON.parse(input);
      const result = isSymmetrical(s);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      s = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.isSymmetrical(s)
      print(str(result).lower())
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String s = scanner.nextLine();
          scanner.close();
          if (s.length() >= 2 && s.startsWith("\\"") && s.endsWith("\\"")) {
              s = s.substring(1, s.length() - 1);
          }
  
          Solution sol = new Solution();
          boolean result = sol.isSymmetrical(s);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <string>
  #include <vector>
  // USER_CODE_PLACEHOLDER
  int main() {
      std::string s;
      std::getline(std::cin, s);
      if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
          s = s.substr(1, s.length() - 2);
      }
  
      Solution sol;
      bool result = sol.isSymmetrical(s);
      std::cout << (result ? "true" : "false") << std::endl;
      return 0;
  }` },
    },
    {
      id: '4',
      title: 'Largest Contiguous Subarray Sum',
      slug: 'largest-contiguous-subarray-sum',
      description: 'Given an array of integers, find the contiguous subarray with the largest possible sum. Return this maximum sum. The subarray must contain at least one element.',
      tags: ['Array', 'Dynamic Programming', 'Kadane\'s Algorithm'],
      constraints: `
  - 1 <= nums.length <= 10^5
  - -10^4 <= nums[i] <= 10^4
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'maxSubarraySum',
      inputSignature: [{ name: 'nums', type: 'int[]' }],
      testCases: [
          { Input: '[-2,1,-3,4,-1,2,1,-5,4]', Output: '6' },
          { Input: '[1]', Output: '1' },
          { Input: '[5,4,-1,7,8]', Output: '23' },
          { Input: '[-1]', Output: '-1' },
          { Input: '[-2,-1]', Output: '-1' },
          { Input: '[1,2,3,4,5]', Output: '15' },
          { Input: '[-1,-2,-3,-4,-5]', Output: '-1' },
          { Input: '[0,0,0,0]', Output: '0' },
          { Input: '[8,-19,5,-4,20]', Output: '21' },
          { Input: '[-2,1]', Output: '1' },
      ],
      starterCode: { /* ... */ javascript: `var maxSubarraySum = function(nums) {
      // Your code here
  };`, python: `class Solution:
      def maxSubarraySum(self, nums: list[int]) -> int:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      int maxSubarraySum(vector<int>& nums) {
          // Your code here
      }
  };`, java: `class Solution {
      public int maxSubarraySum(int[] nums) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const nums = JSON.parse(input);
      const result = maxSubarraySum(nums);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      nums = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.maxSubarraySum(nums)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line = scanner.nextLine();
          scanner.close();
  
          line = line.trim();
          String[] numsStr = line.substring(1, line.length() - 1).split(",");
          int[] nums = new int[numsStr.length];
          if (numsStr.length > 0 && !numsStr[0].isEmpty()) {
              for(int i = 0; i < numsStr.length; i++) {
                  nums[i] = Integer.parseInt(numsStr[i].trim());
              }
          } else {
               nums = new int[0];
          }
  
          Solution sol = new Solution();
          int result = sol.maxSubarraySum(nums);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  // USER_CODE_PLACEHOLDER
  // Helper function to parse a JSON-like array string
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      if (str.length() <= 2) return vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          vec.push_back(std::stoi(item));
      }
      return vec;
  }
  
  int main() {
      std::string line;
      std::getline(std::cin, line);
      std::vector<int> nums = parseVector(line);
  
      Solution sol;
      int result = sol.maxSubarraySum(nums);
      std::cout << result << std::endl;
      return 0;
  }` },
    },
    {
      id: '5',
      title: 'Reverse a Linked List',
      slug: 'reverse-a-linked-list',
      description: 'Given the head of a singly linked list, reverse the list, and return the new head of the reversed list.',
      tags: ['Linked List', 'Recursion', 'Iteration'],
      constraints: `
  - The number of nodes in the list is in the range [0, 5000].
  - -5000 <= Node.val <= 5000
      `,
      difficulty: Difficulty.EASY,
      functionName: 'reverseList',
      inputSignature: [{ name: 'head', type: 'ListNode' }],
      testCases: [
          { Input: '[1,2,3,4,5]', Output: '[5,4,3,2,1]' },
          { Input: '[1,2]', Output: '[2,1]' },
          { Input: '[]', Output: '[]' },
          { Input: '[1]', Output: '[1]' },
          { Input: '[10,20]', Output: '[20,10]' },
          { Input: '[1,1,2,2]', Output: '[2,2,1,1]' },
          { Input: '[-1,0,1]', Output: '[1,0,-1]' },
          { Input: '[1,2,3]', Output: '[3,2,1]' },
          { Input: '[100]', Output: '[100]' },
          { Input: '[5,4,3,2,1]', Output: '[1,2,3,4,5]' },
      ],
      starterCode: { /* ... */ javascript: `/**
   * Definition for singly-linked list.
   * function ListNode(val, next) {
   * this.val = (val===undefined ? 0 : val)
   * this.next = (next===undefined ? null : next)
   * }
   */
  var reverseList = function(head) {
      // Your code here
  };`, python: `# Definition for singly-linked list.
  # class ListNode:
  #     def __init__(self, val=0, next=None):
  #         self.val = val
  #         self.next = next
  class Solution:
      def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
          # Your code here
          pass`, cpp: `/**
   * Definition for singly-linked list.
   * struct ListNode {
   * int val;
   * ListNode *next;
   * ListNode() : val(0), next(nullptr) {}
   * ListNode(int x) : val(x), next(nullptr) {}
   * ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* reverseList(ListNode* head) {
          // Your code here
      }
  };`, java: `/**
   * Definition for singly-linked list.
   * public class ListNode {
   * int val;
   * ListNode next;
   * ListNode() {}
   * ListNode(int val) { this.val = val; }
   * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
   * }
   */
  class Solution {
      public ListNode reverseList(ListNode head) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  function ListNode(val, next) {
      this.val = (val===undefined ? 0 : val)
      this.next = (next===undefined ? null : next)
  }
  function arrayToLinkedList(arr) {
      if (!arr || arr.length === 0) return null;
      let head = new ListNode(arr[0]);
      let current = head;
      for (let i = 1; i < arr.length; i++) {
          current.next = new ListNode(arr[i]);
          current = current.next;
      }
      return head;
  }
  function linkedListToArray(head) {
      const arr = [];
      let current = head;
      while (current !== null) {
          arr.push(current.val);
          current = current.next;
      }
      return arr;
  }
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const arr = JSON.parse(input);
      const head = arrayToLinkedList(arr);
      const newHead = reverseList(head);
      const result = linkedListToArray(newHead);
      console.log(JSON.stringify(result));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  from typing import Optional
  
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next
  
  def array_to_linked_list(arr):
      if not arr:
          return None
      head = ListNode(arr[0])
      current = head
      for i in range(1, len(arr)):
          current.next = ListNode(arr[i])
          current = current.next
      return head
  
  def linked_list_to_array(head):
      arr = []
      current = head
      while current:
          arr.append(current.val)
          current = current.next
      return arr
  
  # USER_CODE_PLACEHOLDER
  try:
      arr = json.loads(sys.stdin.readline())
      head = array_to_linked_list(arr)
      solver = Solution()
      new_head = solver.reverseList(head)
      result = linked_list_to_array(new_head)
      print(json.dumps(result, separators=(',', ':')))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line = scanner.nextLine();
          scanner.close();
  
          int[] arr = jsonToArray(line);
          ListNode head = arrayToLinkedList(arr);
  
          Solution sol = new Solution();
          ListNode newHead = sol.reverseList(head);
  
          int[] resultArr = linkedListToArray(newHead);
          System.out.println(Arrays.toString(resultArr).replace(" ", ""));
      }
  
      private static int[] jsonToArray(String json) {
          json = json.trim();
          if (json.equals("[]")) {
              return new int[0];
          }
          String[] items = json.substring(1, json.length() - 1).split(",");
          int[] arr = new int[items.length];
          for (int i = 0; i < items.length; i++) {
              arr[i] = Integer.parseInt(items[i].trim());
          }
          return arr;
      }
  
      private static ListNode arrayToLinkedList(int[] arr) {
          if (arr == null || arr.length == 0) return null;
          ListNode head = new ListNode(arr[0]);
          ListNode current = head;
          for (int i = 1; i < arr.length; i++) {
              current.next = new ListNode(arr[i]);
              current = current.next;
          }
          return head;
      }
  
      private static int[] linkedListToArray(ListNode head) {
          List<Integer> list = new ArrayList<>();
          ListNode current = head;
          while (current != null) {
              list.add(current.val);
              current = current.next;
          }
          return list.stream().mapToInt(i -> i).toArray();
      }
  }
  // USER_CODE_PLACEHOLDER_BEFORE
  class ListNode {
      int val;
      ListNode next;
      ListNode() {}
      ListNode(int val) { this.val = val; }
      ListNode(int val, ListNode next) { this.val = val; this.next = next; }
  }
  // USER_CODE_PLACEHOLDER`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <algorithm>
  
  struct ListNode {
      int val;
      ListNode *next;
      ListNode() : val(0), next(nullptr) {}
      ListNode(int x) : val(x), next(nullptr) {}
      ListNode(int x, ListNode *next) : val(x), next(next) {}
  };
  
  // USER_CODE_PLACEHOLDER
  
  ListNode* arrayToLinkedList(const std::vector<int>& arr) {
      if (arr.empty()) return nullptr;
      ListNode* head = new ListNode(arr[0]);
      ListNode* current = head;
      for (size_t i = 1; i < arr.size(); ++i) {
          current->next = new ListNode(arr[i]);
          current = current->next;
      }
      return head;
  }
  
  std::vector<int> linkedListToArray(ListNode* head) {
      std::vector<int> arr;
      ListNode* current = head;
      while (current != nullptr) {
          arr.push_back(current->val);
          current = current->next;
      }
      return arr;
  }
  
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      if (str.length() <= 2) return vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          vec.push_back(std::stoi(item));
      }
      return vec;
  }
  
  int main() {
      std::string line;
      std::getline(std::cin, line);
      std::vector<int> arr = parseVector(line);
      ListNode* head = arrayToLinkedList(arr);
  
      Solution sol;
      ListNode* newHead = sol.reverseList(head);
  
      std::vector<int> result = linkedListToArray(newHead);
  
      std::cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
      }
      std::cout << "]" << std::endl;
  
      // Clean up memory
      ListNode* current = newHead;
      while(current != nullptr) {
          ListNode* temp = current;
          current = current->next;
          delete temp;
      }
  
      return 0;
  }` },
    },
    {
      id: '6',
      title: 'Staircase Climbing Ways',
      slug: 'staircase-climbing-ways',
      description: 'You are climbing a staircase that takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      tags: ['Dynamic Programming', 'Memoization', 'Fibonacci'],
      constraints: `
  - 1 <= n <= 45
      `,
      difficulty: Difficulty.EASY,
      functionName: 'climbStairs',
      inputSignature: [{ name: 'n', type: 'int' }],
      testCases: [
          { Input: '1', Output: '1' },
          { Input: '2', Output: '2' },
          { Input: '3', Output: '3' },
          { Input: '4', Output: '5' },
          { Input: '5', Output: '8' },
          { Input: '6', Output: '13' },
          { Input: '10', Output: '89' },
          { Input: '20', Output: '10946' },
          { Input: '30', Output: '1346269' },
          { Input: '45', Output: '1836311903' },
      ],
      starterCode: { /* ... */ javascript: `var climbStairs = function(n) {
      // Your code here
  };`, python: `class Solution:
      def climbStairs(self, n: int) -> int:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      int climbStairs(int n) {
          // Your code here
      }
  };`, java: `class Solution {
      public int climbStairs(int n) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const n = parseInt(fs.readFileSync(0, 'utf-8').trim(), 10);
      const result = climbStairs(n);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  # USER_CODE_PLACEHOLDER
  try:
      n = int(sys.stdin.readline())
      solver = Solution()
      result = solver.climbStairs(n)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          int n = scanner.nextInt();
          scanner.close();
  
          Solution sol = new Solution();
          int result = sol.climbStairs(n);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  // USER_CODE_PLACEHOLDER
  int main() {
      int n;
      std::cin >> n;
  
      Solution sol;
      int result = sol.climbStairs(n);
      std::cout << result << std::endl;
      return 0;
  }` },
    },
    {
      id: '7',
      title: 'Find in Rotated Sorted Array',
      slug: 'find-in-rotated-sorted-array',
      description: 'An array sorted in ascending order is rotated at some unknown pivot. For example, `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`. Given a target value, find its index in the array. If the target is not found, return -1. Assume no duplicates exist in the array.',
      tags: ['Array', 'Binary Search'],
      constraints: `
  - 1 <= nums.length <= 5000
  - -10^4 <= nums[i] <= 10^4
  - All values of nums are unique.
  - nums is an ascending array that is possibly rotated.
  - -10^4 <= target <= 10^4
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'search',
      inputSignature: [
        { name: 'nums', type: 'int[]' },
        { name: 'target', type: 'int' },
      ],
      testCases: [
          { Input: '[4,5,6,7,0,1,2]\n0', Output: '4' },
          { Input: '[4,5,6,7,0,1,2]\n3', Output: '-1' },
          { Input: '[1]\n0', Output: '-1' },
          { Input: '[1]\n1', Output: '0' },
          { Input: '[5,1,3]\n5', Output: '0' },
          { Input: '[5,1,3]\n3', Output: '2' },
          { Input: '[3,1]\n1', Output: '1' },
          { Input: '[1,3,5]\n5', Output: '2' },
          { Input: '[7,8,1,2,3,4,5,6]\n2', Output: '3' },
          { Input: '[10,20,30,1,2,3]\n40', Output: '-1' },
      ],
      starterCode: { /* ... */ javascript: `var search = function(nums, target) {
      // Your code here
  };`, python: `class Solution:
      def search(self, nums: list[int], target: int) -> int:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      int search(vector<int>& nums, int target) {
          // Your code here
      }
  };`, java: `class Solution {
      public int search(int[] nums, int target) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8');
      const lines = input.trim().split('\\n');
      const nums = JSON.parse(lines[0]);
      const target = parseInt(lines[1], 10);
      const result = search(nums, target);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      lines = sys.stdin.readlines()
      nums = json.loads(lines[0])
      target = int(lines[1])
      solver = Solution()
      result = solver.search(nums, target)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line1 = scanner.nextLine();
          int target = Integer.parseInt(scanner.nextLine().trim());
          scanner.close();
  
          line1 = line1.trim();
          String[] numsStr = line1.substring(1, line1.length() - 1).split(",");
          int[] nums = new int[numsStr.length];
          if (numsStr.length > 0 && !numsStr[0].isEmpty()) {
            for(int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
          } else {
            nums = new int[0];
          }
  
          Solution sol = new Solution();
          int result = sol.search(nums, target);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  // USER_CODE_PLACEHOLDER
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      if (str.length() <= 2) return vec;
      std::string content = str.substr(1, str.length() - 2);
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          if (!item.empty()) vec.push_back(std::stoi(item));
      }
      return vec;
  }
  
  int main() {
      std::string line1, line2;
      std::getline(std::cin, line1);
      std::getline(std::cin, line2);
  
      std::vector<int> nums = parseVector(line1);
      int target = std::stoi(line2);
  
      Solution sol;
      int result = sol.search(nums, target);
      std::cout << result << std::endl;
      return 0;
  }` },
    },
    {
      id: '8',
      title: 'In-Order Tree Traversal',
      slug: 'in-order-tree-traversal',
      description: "Given the root of a binary tree, your task is to traverse its nodes in 'in-order' sequence (left, root, right) and return an array containing the values of the nodes in that order.",
      tags: ['Tree', 'Binary Tree', 'DFS', 'Stack', 'Recursion'],
      constraints: `
  - The number of nodes in the tree is in the range [0, 100].
  - -100 <= Node.val <= 100
      `,
      difficulty: Difficulty.EASY,
      functionName: 'inorderTraversal',
      inputSignature: [{ name: 'root', type: 'TreeNode' }],
      testCases: [
          { Input: '[1,null,2,3]', Output: '[1,3,2]' },
          { Input: '[]', Output: '[]' },
          { Input: '[1]', Output: '[1]' },
          { Input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', Output: '[7,11,2,4,5,13,8,4,1]' },
          { Input: '[1,2,3,4,5,6,7]', Output: '[4,2,5,1,6,3,7]' },
          { Input: '[10,5,15,null,null,6,20]', Output: '[5,10,6,15,20]' },
          { Input: '[3,1,null,null,2]', Output: '[1,2,3]' },
          { Input: '[2,3,null,1]', Output: '[1,3,2]' },
          { Input: '[1,null,2]', Output: '[1,2]' },
          { Input: '[1,2,null,3]', Output: '[3,2,1]' },
      ],
      starterCode: { /* ... */ javascript: `/**
   * Definition for a binary tree node.
   * function TreeNode(val, left, right) {
   * this.val = (val===undefined ? 0 : val)
   * this.left = (left===undefined ? null : left)
   * this.right = (right===undefined ? null : right)
   * }
   */
  var inorderTraversal = function(root) {
      // Your code here
  };`, python: `# Definition for a binary tree node.
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None):
  #         self.val = val
  #         self.left = left
  #         self.right = right
  class Solution:
      def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
          # Your code here
          pass`, cpp: `/**
   * Definition for a binary tree node.
   * struct TreeNode {
   * int val;
   * TreeNode *left;
   * TreeNode *right;
   * TreeNode() : val(0), left(nullptr), right(nullptr) {}
   * TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
   * TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
   * };
   */
  class Solution {
  public:
      vector<int> inorderTraversal(TreeNode* root) {
          // Your code here
      }
  };`, java: `/**
   * Definition for a binary tree node.
   * public class TreeNode {
   * int val;
   * TreeNode left;
   * TreeNode right;
   * TreeNode() {}
   * TreeNode(int val) { this.val = val; }
   * TreeNode(int val, TreeNode left, TreeNode right) {
   * this.val = val;
   * this.left = left;
   * this.right = right;
   * }
   * }
   */
  class Solution {
      public List<Integer> inorderTraversal(TreeNode root) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  function TreeNode(val, left, right) {
      this.val = (val===undefined ? 0 : val);
      this.left = (left===undefined ? null : left);
      this.right = (right===undefined ? null : right);
  }
  function buildTree(nodes) {
      if (!nodes || nodes.length === 0 || nodes[0] === null) return null;
      let root = new TreeNode(nodes[0]);
      let queue = [root];
      let i = 1;
      while (queue.length > 0 && i < nodes.length) {
          let currentNode = queue.shift();
          if (nodes[i] !== null) {
              currentNode.left = new TreeNode(nodes[i]);
              queue.push(currentNode.left);
          }
          i++;
          if (i < nodes.length && nodes[i] !== null) {
              currentNode.right = new TreeNode(nodes[i]);
              queue.push(currentNode.right);
          }
          i++;
      }
      return root;
  }
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const nodes = JSON.parse(fs.readFileSync(0, 'utf-8').trim());
      const root = buildTree(nodes);
      const result = inorderTraversal(root);
      console.log(JSON.stringify(result));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys, json, collections
  from typing import Optional, List
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right
  def build_tree(nodes):
      if not nodes:
          return None
      root = TreeNode(nodes[0])
      queue = collections.deque([root])
      i = 1
      while queue and i < len(nodes):
          node = queue.popleft()
          if nodes[i] is not None:
              node.left = TreeNode(nodes[i])
              queue.append(node.left)
          i += 1
          if i < len(nodes) and nodes[i] is not None:
              node.right = TreeNode(nodes[i])
              queue.append(node.right)
          i += 1
      return root
  # USER_CODE_PLACEHOLDER
  try:
      nodes = json.loads(sys.stdin.readline())
      root = build_tree(nodes)
      solver = Solution()
      result = solver.inorderTraversal(root)
      print(json.dumps(result, separators=(',', ':')))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  import java.io.*;
  
  // USER_CODE_PLACEHOLDER_BEFORE
  class TreeNode {
      int val;
      TreeNode left;
      TreeNode right;
      TreeNode(int val) { this.val = val; }
  }
  // USER_CODE_PLACEHOLDER
  
  public class Main {
      public static TreeNode buildTree(Integer[] nodes) {
          if (nodes == null || nodes.length == 0 || nodes[0] == null) return null;
          TreeNode root = new TreeNode(nodes[0]);
          Queue<TreeNode> queue = new LinkedList<>();
          queue.add(root);
          int i = 1;
          while (!queue.isEmpty() && i < nodes.length) {
              TreeNode current = queue.poll();
              if (nodes[i] != null) {
                  current.left = new TreeNode(nodes[i]);
                  queue.add(current.left);
              }
              i++;
              if (i < nodes.length && nodes[i] != null) {
                  current.right = new TreeNode(nodes[i]);
                  queue.add(current.right);
              }
              i++;
          }
          return root;
      }
  
      public static Integer[] parseJsonArray(String json) {
          json = json.trim().substring(1, json.length() - 1);
          if (json.isEmpty()) return new Integer[0];
          String[] parts = json.split(",");
          Integer[] arr = new Integer[parts.length];
          for (int i = 0; i < parts.length; i++) {
              String part = parts[i].trim();
              if (part.equals("null")) {
                  arr[i] = null;
              } else {
                  arr[i] = Integer.parseInt(part);
              }
          }
          return arr;
      }
  
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line = scanner.nextLine();
          scanner.close();
  
          Integer[] nodes = parseJsonArray(line);
          TreeNode root = buildTree(nodes);
  
          Solution sol = new Solution();
          List<Integer> result = sol.inorderTraversal(root);
  
          System.out.print("[");
          for (int i = 0; i < result.size(); i++) {
              System.out.print(result.get(i));
              if (i < result.size() - 1) {
                  System.out.print(",");
              }
          }
          System.out.println("]");
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <queue>
  #include <algorithm>
  #include <optional>
  
  struct TreeNode {
      int val;
      TreeNode *left;
      TreeNode *right;
      TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  };
  // USER_CODE_PLACEHOLDER
  
  TreeNode* buildTree(const std::vector<std::optional<int>>& nodes) {
      if (nodes.empty() || !nodes[0].has_value()) return nullptr;
      TreeNode* root = new TreeNode(nodes[0].value());
      std::queue<TreeNode*> q;
      q.push(root);
      size_t i = 1;
      while (!q.empty() && i < nodes.size()) {
          TreeNode* current = q.front();
          q.pop();
          if (i < nodes.size() && nodes[i].has_value()) {
              current->left = new TreeNode(nodes[i].value());
              q.push(current->left);
          }
          i++;
          if (i < nodes.size() && nodes[i].has_value()) {
              current->right = new TreeNode(nodes[i].value());
              q.push(current->right);
          }
          i++;
      }
      return root;
  }
  std::vector<std::optional<int>> parseVector(const std::string& str) {
      std::vector<std::optional<int>> vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          if (item == "null") {
              vec.push_back(std::nullopt);
          } else {
              vec.push_back(std::stoi(item));
          }
      }
      return vec;
  }
  int main() {
      std::string line;
      std::getline(std::cin, line);
      auto nodes = parseVector(line);
      TreeNode* root = buildTree(nodes);
      Solution sol;
      std::vector<int> result = sol.inorderTraversal(root);
      std::cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
      }
      std::cout << "]" << std::endl;
      // Memory cleanup would be needed in a real application
      return 0;
  }` },
    },
    {
      id: '9',
      title: 'Maximum Depth of Binary Tree',
      slug: 'maximum-depth-of-binary-tree',
      description: 'Given the root of a binary tree, find its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
      tags: ['Tree', 'Binary Tree', 'DFS', 'BFS', 'Recursion'],
      constraints: `
  - The number of nodes in the tree is in the range [0, 10^4].
  - -100 <= Node.val <= 100
      `,
      difficulty: Difficulty.EASY,
      functionName: 'maxDepth',
      inputSignature: [{ name: 'root', type: 'TreeNode' }],
      testCases: [
          { Input: '[3,9,20,null,null,15,7]', Output: '3' },
          { Input: '[1,null,2]', Output: '2' },
          { Input: '[]', Output: '0' },
          { Input: '[0]', Output: '1' },
          { Input: '[1,2,3,4,5]', Output: '3' },
          { Input: '[1,2,null,3,null,4]', Output: '4' },
          { Input: '[1,2,3,4,null,null,5,6,null,null,null,null,null,7]', Output: '5' },
          { Input: '[2,null,3,null,4,null,5]', Output: '4' },
          { Input: '[1,1,1,1,1]', Output: '3' },
          { Input: '[5,3,6,2,4,null,7]', Output: '3' },
      ],
      starterCode: { /* ... */ javascript: `/**
   * Definition for a binary tree node.
   * function TreeNode(val, left, right) {
   * this.val = (val===undefined ? 0 : val)
   * this.left = (left===undefined ? null : left)
   * this.right = (right===undefined ? null : right)
   * }
   */
  var maxDepth = function(root) {
      // Your code here
  };`, python: `# Definition for a binary tree node.
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None):
  #         self.val = val
  #         self.left = left
  #         self.right = right
  class Solution:
      def maxDepth(self, root: Optional[TreeNode]) -> int:
          # Your code here
          pass`, cpp: `/**
   * Definition for a binary tree node.
   * struct TreeNode {
   * int val;
   * TreeNode *left;
   * TreeNode *right;
   * TreeNode() : val(0), left(nullptr), right(nullptr) {}
   * TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
   * TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
   * };
   */
  class Solution {
  public:
      int maxDepth(TreeNode* root) {
          // Your code here
      }
  };`, java: `/**
   * Definition for a binary tree node.
   * public class TreeNode {
   * int val;
   * TreeNode left;
   * TreeNode right;
   * TreeNode() {}
   * TreeNode(int val) { this.val = val; }
   * TreeNode(int val, TreeNode left, TreeNode right) {
   * this.val = val;
   * this.left = left;
   * this.right = right;
   * }
   * }
   */
  class Solution {
      public int maxDepth(TreeNode root) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  function TreeNode(val, left, right) {
      this.val = (val===undefined ? 0 : val);
      this.left = (left===undefined ? null : left);
      this.right = (right===undefined ? null : right);
  }
  function buildTree(nodes) {
      if (!nodes || nodes.length === 0 || nodes[0] === null) return null;
      let root = new TreeNode(nodes[0]);
      let queue = [root];
      let i = 1;
      while (queue.length > 0 && i < nodes.length) {
          let currentNode = queue.shift();
          if (nodes[i] !== null) {
              currentNode.left = new TreeNode(nodes[i]);
              queue.push(currentNode.left);
          }
          i++;
          if (i < nodes.length && nodes[i] !== null) {
              currentNode.right = new TreeNode(nodes[i]);
              queue.push(currentNode.right);
          }
          i++;
      }
      return root;
  }
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const nodes = JSON.parse(fs.readFileSync(0, 'utf-8').trim());
      const root = buildTree(nodes);
      const result = maxDepth(root);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys, json, collections
  from typing import Optional
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right
  def build_tree(nodes):
      if not nodes:
          return None
      root = TreeNode(nodes[0])
      queue = collections.deque([root])
      i = 1
      while queue and i < len(nodes):
          node = queue.popleft()
          if i < len(nodes) and nodes[i] is not None:
              node.left = TreeNode(nodes[i])
              queue.append(node.left)
          i += 1
          if i < len(nodes) and nodes[i] is not None:
              node.right = TreeNode(nodes[i])
              queue.append(node.right)
          i += 1
      return root
  # USER_CODE_PLACEHOLDER
  try:
      nodes = json.loads(sys.stdin.readline())
      root = build_tree(nodes)
      solver = Solution()
      result = solver.maxDepth(root)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER_BEFORE
  class TreeNode {
      int val;
      TreeNode left;
      TreeNode right;
      TreeNode(int val) { this.val = val; }
  }
  // USER_CODE_PLACEHOLDER
  
  public class Main {
      public static TreeNode buildTree(Integer[] nodes) {
          if (nodes == null || nodes.length == 0 || nodes[0] == null) return null;
          TreeNode root = new TreeNode(nodes[0]);
          Queue<TreeNode> queue = new LinkedList<>();
          queue.add(root);
          int i = 1;
          while (!queue.isEmpty() && i < nodes.length) {
              TreeNode current = queue.poll();
              if (i < nodes.length && nodes[i] != null) {
                  current.left = new TreeNode(nodes[i]);
                  queue.add(current.left);
              }
              i++;
              if (i < nodes.length && nodes[i] != null) {
                  current.right = new TreeNode(nodes[i]);
                  queue.add(current.right);
              }
              i++;
          }
          return root;
      }
  
      public static Integer[] parseJsonArray(String json) {
          json = json.trim().substring(1, json.length() - 1);
          if (json.isEmpty()) return new Integer[0];
          String[] parts = json.split(",");
          Integer[] arr = new Integer[parts.length];
          for (int i = 0; i < parts.length; i++) {
              String part = parts[i].trim();
              if (part.equals("null")) {
                  arr[i] = null;
              } else {
                  arr[i] = Integer.parseInt(part);
              }
          }
          return arr;
      }
  
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line = scanner.nextLine();
          scanner.close();
  
          Integer[] nodes = parseJsonArray(line);
          TreeNode root = buildTree(nodes);
  
          Solution sol = new Solution();
          int result = sol.maxDepth(root);
  
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <queue>
  #include <optional>
  
  struct TreeNode {
      int val;
      TreeNode *left;
      TreeNode *right;
      TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  };
  // USER_CODE_PLACEHOLDER
  
  TreeNode* buildTree(const std::vector<std::optional<int>>& nodes) {
      if (nodes.empty() || !nodes[0].has_value()) return nullptr;
      TreeNode* root = new TreeNode(nodes[0].value());
      std::queue<TreeNode*> q;
      q.push(root);
      size_t i = 1;
      while (!q.empty() && i < nodes.size()) {
          TreeNode* current = q.front();
          q.pop();
          if (i < nodes.size() && nodes[i].has_value()) {
              current->left = new TreeNode(nodes[i].value());
              q.push(current->left);
          }
          i++;
          if (i < nodes.size() && nodes[i].has_value()) {
              current->right = new TreeNode(nodes[i].value());
              q.push(current->right);
          }
          i++;
      }
      return root;
  }
  std::vector<std::optional<int>> parseVector(const std::string& str) {
      std::vector<std::optional<int>> vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          if (item == "null") {
              vec.push_back(std::nullopt);
          } else {
              vec.push_back(std::stoi(item));
          }
      }
      return vec;
  }
  int main() {
      std::string line;
      std::getline(std::cin, line);
      auto nodes = parseVector(line);
      TreeNode* root = buildTree(nodes);
      Solution sol;
      int result = sol.maxDepth(root);
      std::cout << result << std::endl;
      // Memory cleanup needed
      return 0;
  }` },
    },
    {
      id: '10',
      title: 'Coin Change Combinations',
      slug: 'coin-change-combinations',
      description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
      tags: ['Dynamic Programming', 'Array', 'BFS'],
      constraints: `
  - 1 <= coins.length <= 12
  - 1 <= coins[i] <= 2^31 - 1
  - 0 <= amount <= 10^4
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'coinChange',
      inputSignature: [
        { name: 'coins', type: 'int[]' },
        { name: 'amount', type: 'int' },
      ],
      testCases: [
          { Input: '[1,2,5]\n11', Output: '3' },
          { Input: '[2]\n3', Output: '-1' },
          { Input: '[1]\n0', Output: '0' },
          { Input: '[1]\n1', Output: '1' },
          { Input: '[1]\n2', Output: '2' },
          { Input: '[186,419,83,408]\n6249', Output: '20' },
          { Input: '[1,5,10,25]\n100', Output: '4' },
          { Input: '[3,5]\n7', Output: '-1' },
          { Input: '[2,5,10,1]\n27', Output: '4' },
          { Input: '[474,83,404,3]\n264', Output: '2' },
      ],
      starterCode: { /* ... */ javascript: `var coinChange = function(coins, amount) {
      // Your code here
  };`, python: `class Solution:
      def coinChange(self, coins: list[int], amount: int) -> int:
          # Your code here
          pass`, cpp: `class Solution {
  public:
      int coinChange(vector<int>& coins, int amount) {
          // Your code here
      }
  };`, java: `class Solution {
      public int coinChange(int[] coins, int amount) {
          // Your code here
      }
  }` },
      driverCode: { /* ... */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8');
      const lines = input.trim().split('\\n');
      const coins = JSON.parse(lines[0]);
      const amount = parseInt(lines[1], 10);
      const result = coinChange(coins, amount);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      lines = sys.stdin.readlines()
      coins = json.loads(lines[0])
      amount = int(lines[1])
      solver = Solution()
      result = solver.coinChange(coins, amount)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line1 = scanner.nextLine();
          int amount = Integer.parseInt(scanner.nextLine().trim());
          scanner.close();
  
          line1 = line1.trim();
          String[] coinsStr = line1.substring(1, line1.length() - 1).split(",");
          int[] coins = new int[coinsStr.length];
          if (coinsStr.length > 0 && !coinsStr[0].isEmpty()) {
              for(int i = 0; i < coinsStr.length; i++) {
                  coins[i] = Integer.parseInt(coinsStr[i].trim());
              }
          } else {
              coins = new int[0];
          }
  
          Solution sol = new Solution();
          int result = sol.coinChange(coins, amount);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  // USER_CODE_PLACEHOLDER
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      if (str.length() <= 2) return vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          vec.push_back(std::stoi(item));
      }
      return vec;
  }
  
  int main() {
      std::string line1, line2;
      std::getline(std::cin, line1);
      std::getline(std::cin, line2);
  
      std::vector<int> coins = parseVector(line1);
      int amount = std::stoi(line2);
  
      Solution sol;
      int result = sol.coinChange(coins, amount);
      std::cout << result << std::endl;
      return 0;
  }` },
    },
    
    // 20 New Problems
    {
      id: '11',
      title: 'Longest Unique Character Substring',
      slug: 'longest-unique-character-substring',
      description: 'Given a string, find the length of the longest substring that does not contain repeating characters.',
      tags: ['String', 'Sliding Window', 'Hash Table'],
      constraints: `
  - 0 <= s.length <= 5 * 10^4
  - s consists of English letters, digits, symbols and spaces.
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'lengthOfLongestSubstring',
      inputSignature: [{ name: 's', type: 'string' }],
      testCases: [
          { Input: '"abcabcbb"', Output: '3' },
          { Input: '"bbbbb"', Output: '1' },
          { Input: '"pwwkew"', Output: '3' },
          { Input: '""', Output: '0' },
          { Input: '" "', Output: '1' },
          { Input: '"au"', Output: '2' },
          { Input: '"dvdf"', Output: '3' },
          { Input: '"aab"', Output: '2' },
          { Input: '"tmmzuxt"', Output: '5' },
          { Input: '"abcdefg"', Output: '7' },
      ],
      starterCode: {
          javascript: `var lengthOfLongestSubstring = function(s) {
      // Your code here
  };`,
          python: `class Solution:
      def lengthOfLongestSubstring(self, s: str) -> int:
          # Your code here
          pass`,
          cpp: `class Solution {
  public:
      int lengthOfLongestSubstring(string s) {
          // Your code here
      }
  };`,
          java: `class Solution {
      public int lengthOfLongestSubstring(String s) {
          // Your code here
      }
  }`,
      },
      driverCode: { /* Similar to problem 2 */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const s = JSON.parse(input);
      const result = lengthOfLongestSubstring(s);
      console.log(result);
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      s = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.lengthOfLongestSubstring(s)
      print(result)
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String s = scanner.nextLine();
          scanner.close();
          s = s.substring(1, s.length() - 1);
  
          Solution sol = new Solution();
          int result = sol.lengthOfLongestSubstring(s);
          System.out.println(result);
      }
  }`, cpp: `
  #include <iostream>
  #include <string>
  #include <vector>
  // USER_CODE_PLACEHOLDER
  int main() {
      std::string s;
      std::getline(std::cin, s);
      if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
          s = s.substr(1, s.length() - 2);
      }
  
      Solution sol;
      int result = sol.lengthOfLongestSubstring(s);
      std::cout << result << std::endl;
      return 0;
  }` },
    },
    {
      id: '12',
      title: 'Product of Array Except Self',
      slug: 'product-of-array-except-self',
      description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.',
      tags: ['Array', 'Prefix Sum'],
      constraints: `
  - 2 <= nums.length <= 10^5
  - -30 <= nums[i] <= 30
  - The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'productExceptSelf',
      inputSignature: [{ name: 'nums', type: 'int[]' }],
      testCases: [
          { Input: '[1,2,3,4]', Output: '[24,12,8,6]' },
          { Input: '[-1,1,0,-3,3]', Output: '[0,0,9,0,0]' },
          { Input: '[1,2]', Output: '[2,1]' },
          { Input: '[1,0]', Output: '[0,1]' },
          { Input: '[0,0]', Output: '[0,0]' },
          { Input: '[1,1,1,1]', Output: '[1,1,1,1]' },
          { Input: '[-1,-1,-1,-1]', Output: '[-1,-1,-1,-1]' },
          { Input: '[2,3,5,0]', Output: '[0,0,0,30]' },
          { Input: '[1,2,3,0,5]', Output: '[0,0,0,30,0]' },
          { Input: '[1,2,3,4,5]', Output: '[120,60,40,30,24]' },
      ],
      starterCode: {
          javascript: `var productExceptSelf = function(nums) {
      // Your code here
  };`,
          python: `class Solution:
      def productExceptSelf(self, nums: list[int]) -> list[int]:
          # Your code here
          pass`,
          cpp: `class Solution {
  public:
      vector<int> productExceptSelf(vector<int>& nums) {
          // Your code here
      }
  };`,
          java: `class Solution {
      public int[] productExceptSelf(int[] nums) {
          // Your code here
      }
  }`,
      },
      driverCode: { /* Similar to problem 4 */ javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const nums = JSON.parse(input);
      const result = productExceptSelf(nums);
      console.log(JSON.stringify(result));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`, python: `
  import sys
  import json
  # USER_CODE_PLACEHOLDER
  try:
      nums = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.productExceptSelf(nums)
      print(json.dumps(result, separators=(',', ':')))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`, java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String line = scanner.nextLine();
          scanner.close();
  
          line = line.trim();
          String[] numsStr = line.substring(1, line.length() - 1).split(",");
          int[] nums = new int[numsStr.length];
          if (numsStr.length > 0 && !numsStr[0].isEmpty()) {
              for(int i = 0; i < numsStr.length; i++) {
                  nums[i] = Integer.parseInt(numsStr[i].trim());
              }
          } else {
               nums = new int[0];
          }
  
          Solution sol = new Solution();
          int[] result = sol.productExceptSelf(nums);
          System.out.println(Arrays.toString(result).replace(" ", ""));
      }
  }`, cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  // USER_CODE_PLACEHOLDER
  // Helper function to parse a JSON-like array string
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      if (str.length() <= 2) return vec;
      std::string content = str.substr(1, str.length() - 2);
      if (content.empty()) return vec;
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          vec.push_back(std::stoi(item));
      }
      return vec;
  }
  
  int main() {
      std::string line;
      std::getline(std::cin, line);
      std::vector<int> nums = parseVector(line);
  
      Solution sol;
      std::vector<int> result = sol.productExceptSelf(nums);
      
      std::cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
      }
      std::cout << "]" << std::endl;
      return 0;
  }` },
    },
    {
      id: '13',
      title: 'Implement Trie (Prefix Tree)',
      slug: 'implement-trie-prefix-tree',
      description: 'Implement a Trie data structure with `insert`, `search`, and `startsWith` methods.',
      tags: ['Trie', 'Design', 'Hash Table', 'String'],
      constraints: `
  - 1 <= word.length, prefix.length <= 2000
  - word and prefix consist only of lowercase English letters.
  - At most 3 * 10^4 calls will be made to insert, search, and startsWith.
      `,
      difficulty: Difficulty.MEDIUM,
      functionName: 'Trie',
      inputSignature: [
        { name: 'operations', type: 'string[]' },
        { name: 'values', type: 'string[]' },
      ],
      testCases: [
          { Input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', Output: '[null,null,true,false,true,null,true]' },
          { Input: '["Trie","insert","search"]\n[[],["hello"],["hell"]]', Output: '[null,null,false]' },
          { Input: '["Trie","startsWith"]\n[[],["a"]]', Output: '[null,false]' },
          { Input: '["Trie","insert","startsWith","search"]\n[[],["word"],["wo"],["word"]]', Output: '[null,null,true,true]' },
          { Input: '["Trie","insert","insert","search","startsWith"]\n[[],["abc"],["ab"],["abc"],["ab"]]', Output: '[null,null,null,true,true]' },
          { Input: '["Trie","search"]\n[[],["a"]]', Output: '[null,false]'},
          { Input: '["Trie","insert","insert","insert","search","search","search","startsWith","startsWith","startsWith"]\n[[],["a"],["b"],["c"],["a"],["b"],["c"],["a"],["b"],["c"]]', Output: '[null,null,null,null,true,true,true,true,true,true]'},
          { Input: '["Trie","insert","search","startsWith"]\n[[],["there"],["the"],["the"]]', Output: '[null,null,false,true]'},
          { Input: '["Trie","insert","search"]\n[[],["there"],["there"]]', Output: '[null,null,true]'},
          { Input: '["Trie","insert","insert","startsWith","startsWith","search","search"]\n[[],["app"],["apple"],["ap"],["app"],["apple"],["apply"]]', Output: '[null,null,null,true,true,true,false]'},
      ],
      starterCode: {
          javascript: `class Trie {
      constructor() {
          // Your code here
      }
      insert(word) {
          // Your code here
      }
      search(word) {
          // Your code here
      }
      startsWith(prefix) {
          // Your code here
      }
  };`,
          python: `class Trie:
      def __init__(self):
          # Your code here
          pass
      def insert(self, word: str) -> None:
          # Your code here
          pass
      def search(self, word: str) -> bool:
          # Your code here
          pass
      def startsWith(self, prefix: str) -> bool:
          # Your code here
          pass`,
          cpp: `class Trie {
  public:
      Trie() {
          // Your code here
      }
      
      void insert(string word) {
          // Your code here
      }
      
      bool search(string word) {
          // Your code here
      }
      
      bool startsWith(string prefix) {
          // Your code here
      }
  };`,
          java: `class Trie {
      public Trie() {
          // Your code here
      }
      
      public void insert(String word) {
          // Your code here
      }
      
      public boolean search(String word) {
          // Your code here
      }
      
      public boolean startsWith(String prefix) {
          // Your code here
      }
  }`,
      },
      driverCode: {
        javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8');
      const lines = input.trim().split('\\n');
      const ops = JSON.parse(lines[0]);
      const vals = JSON.parse(lines[1]);
      
      let trie;
      const results = [];
  
      for (let i = 0; i < ops.length; i++) {
          const op = ops[i];
          const val = vals[i][0];
          
          if (op === "Trie") {
              trie = new Trie();
              results.push(null);
          } else if (op === "insert") {
              trie.insert(val);
              results.push(null);
          } else if (op === "search") {
              results.push(trie.search(val));
          } else if (op === "startsWith") {
              results.push(trie.startsWith(val));
          }
      }
      console.log(JSON.stringify(results));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`,
        python: `
  import sys, json
  # USER_CODE_PLACEHOLDER
  
  try:
      lines = sys.stdin.readlines()
      ops = json.loads(lines[0])
      vals = json.loads(lines[1])
      
      trie = None
      results = []
  
      for i in range(len(ops)):
          op = ops[i]
          val = vals[i][0] if vals[i] else None
          
          if op == "Trie":
              trie = Trie()
              results.append(None)
          elif op == "insert":
              trie.insert(val)
              results.append(None)
          elif op == "search":
              results.append(trie.search(val))
          elif op == "startsWith":
              results.append(trie.startsWith(val))
      
      print(json.dumps(results).replace("None", "null").replace("False", "false").replace("True", "true"))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")
  `,
        cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  // USER_CODE_PLACEHOLDER
  
  // Simple JSON parser for this specific problem format
  void parse_trie_input(const std::string& line, std::vector<std::string>& vec) {
      std::string content = line.substr(1, line.length() - 2);
      std::stringstream ss(content);
      std::string item;
      while(std::getline(ss, item, ',')) {
          if(item.length() > 2) {
              vec.push_back(item.substr(1, item.length() - 2));
          }
      }
  }
  void parse_trie_values(const std::string& line, std::vector<std::vector<std::string>>& vec) {
      std::string content = line.substr(1, line.length() - 2);
      std::stringstream ss(content);
      std::string item;
      while(std::getline(ss, item, ']')) {
          if(item.empty()) continue;
          size_t start = item.find('[');
          if (start != std::string::npos) {
              item = item.substr(start + 1);
          }
          std::vector<std::string> sub_vec;
          if (!item.empty()) {
              size_t quote_start = item.find('"');
              size_t quote_end = item.rfind('"');
              if (quote_start != std::string::npos && quote_end != std::string::npos && quote_start != quote_end) {
                   sub_vec.push_back(item.substr(quote_start + 1, quote_end - quote_start - 1));
              }
          }
          vec.push_back(sub_vec);
      }
  }
  int main() {
      std::string ops_line, vals_line;
      std::getline(std::cin, ops_line);
      std::getline(std::cin, vals_line);
      
      std::vector<std::string> ops;
      parse_trie_input(ops_line, ops);
      std::vector<std::vector<std::string>> vals;
      parse_trie_values(vals_line, vals);
  
      Trie* trie = nullptr;
      std::cout << "[";
      for(size_t i = 0; i < ops.size(); ++i) {
          if(ops[i] == "Trie") {
              trie = new Trie();
              std::cout << "null";
          } else if (ops[i] == "insert") {
              trie->insert(vals[i][0]);
              std::cout << "null";
          } else if (ops[i] == "search") {
              std::cout << (trie->search(vals[i][0]) ? "true" : "false");
          } else if (ops[i] == "startsWith") {
              std::cout << (trie->startsWith(vals[i][0]) ? "true" : "false");
          }
          if (i < ops.size() - 1) std::cout << ",";
      }
      std::cout << "]" << std::endl;
      delete trie;
      return 0;
  }`,
        java: `
  import java.util.*;
  // USER_CODE_PLACEHOLDER
  
  public class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String opsLine = scanner.nextLine();
          String valsLine = scanner.nextLine();
          scanner.close();
  
          String[] ops = parseJsonStringArray(opsLine);
          String[][] vals = parseJsonNestedStringArray(valsLine);
  
          Trie trie = null;
          List<String> results = new ArrayList<>();
          
          for (int i = 0; i < ops.length; i++) {
              String op = ops[i];
              String val = (vals[i].length > 0) ? vals[i][0] : null;
  
              if (op.equals("Trie")) {
                  trie = new Trie();
                  results.add("null");
              } else if (op.equals("insert")) {
                  trie.insert(val);
                  results.add("null");
              } else if (op.equals("search")) {
                  results.add(String.valueOf(trie.search(val)));
              } else if (op.equals("startsWith")) {
                  results.add(String.valueOf(trie.startsWith(val)));
              }
          }
          System.out.println("[" + String.join(",", results) + "]");
      }
      
      private static String[] parseJsonStringArray(String json) {
          json = json.substring(1, json.length() - 1);
          if (json.isEmpty()) return new String[0];
          String[] parts = json.split(",");
          for (int i=0; i<parts.length; i++) {
              parts[i] = parts[i].trim().replace("\\"", "");
          }
          return parts;
      }
  
      private static String[][] parseJsonNestedStringArray(String json) {
          json = json.substring(1, json.length() - 1);
          if (json.isEmpty()) return new String[0][0];
          List<String[]> list = new ArrayList<>();
          int level = 0;
          int start = 0;
          for (int i = 0; i < json.length(); i++) {
              if (json.charAt(i) == '[') {
                  if (level == 0) start = i;
                  level++;
              } else if (json.charAt(i) == ']') {
                  level--;
                  if (level == 0) {
                      String sub = json.substring(start, i + 1);
                      sub = sub.substring(1, sub.length() - 1);
                      if (sub.isEmpty()) {
                          list.add(new String[0]);
                      } else {
                          list.add(new String[]{sub.replace("\\"", "")});
                      }
                  }
              }
          }
          return list.toArray(new String[0][]);
      }
  }`},

},
{
    id: '14',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    constraints: `
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'maxSubArray',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[-2,1,-3,4,-1,2,1,-5,4]', Output: '6' },
      { Input: '[1]', Output: '1' },
      { Input: '[5,4,-1,7,8]', Output: '23' },
      { Input: '[-1]', Output: '-1' },
      { Input: '[-2,-1]', Output: '-1' },
      { Input: '[1,2,3,4,5]', Output: '15' },
      { Input: '[-1,-2,-3,-4,-5]', Output: '-1' },
      { Input: '[0,0,0,0]', Output: '0' },
      { Input: '[8,-19,5,-4,20]', Output: '21' },
      { Input: '[-2,1]', Output: '1' },
    ],
    starterCode: {
      javascript: `var maxSubArray = function(nums) {
  // Your code here
};`,
      python: `class Solution:
  def maxSubArray(self, nums: List[int]) -> int:
      # Your code here
      pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  int maxSubArray(vector<int>& nums) {
      // Your code here
  }
};`,
      java: `class Solution {
  public int maxSubArray(int[] nums) {
      // Your code here
  }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
  const fs = require('fs');
  const input = fs.readFileSync(0, 'utf-8').trim();
  const nums = JSON.parse(input);
  const result = maxSubArray(nums);
  console.log(result);
} catch (e) {
  console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
  nums = json.loads(sys.stdin.readline())
  solver = Solution()
  result = solver.maxSubArray(nums)
  print(result)
except Exception as e:
  print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      String line = scanner.nextLine();
      scanner.close();

      line = line.trim();
      String[] numsStr = line.substring(1, line.length() - 1).split(",");
      int[] nums = new int[numsStr.length];
      for(int i = 0; i < numsStr.length; i++) {
          nums[i] = Integer.parseInt(numsStr[i].trim());
      }

      Solution sol = new Solution();
      int result = sol.maxSubArray(nums);
      System.out.println(result);
  }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

std::vector<int> parseVector(const std::string& str) {
  std::vector<int> vec;
  std::string content = str.substr(1, str.length() - 2);
  std::stringstream ss(content);
  std::string item;
  while (std::getline(ss, item, ',')) {
      if (!item.empty()) {
          vec.push_back(std::stoi(item));
      }
  }
  return vec;
}

int main() {
  std::string line;
  std::getline(std::cin, line);
  std::vector<int> nums = parseVector(line);

  Solution sol;
  int result = sol.maxSubArray(nums);
  std::cout << result << std::endl;
  return 0;
}`
    },
  },
 
  {
    id: '15',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that contains the most water.',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    constraints: '- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4',
    difficulty: Difficulty.MEDIUM,
    functionName: 'maxArea',
    inputSignature: [{ name: 'height', type: 'int[]' }],
    testCases: [
      { Input: '[1,8,6,2,5,4,8,3,7]', Output: '49' },
      { Input: '[1,1]', Output: '1' },
      { Input: '[1,2,1]', Output: '2' },
      { Input: '[1,2,4,3]', Output: '4' },
      { Input: '[2,1]', Output: '1' },
    ],
    starterCode: {
      javascript: `var maxArea = function(height) { /* Your code here */ };`,
      python: `class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        # Your code here\n        pass`,
      cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n    }\n}`,
    },
    driverCode: {
      javascript: `// USER_CODE_PLACEHOLDER\ntry {\n    const fs = require('fs');\n    const nums = JSON.parse(fs.readFileSync(0, 'utf-8').trim());\n    console.log(maxArea(nums));\n} catch (e) {\n    console.log("CAUGHT_ERROR: " + e.message);\n}`,
      python: `import sys, json\nfrom typing import List\n# USER_CODE_PLACEHOLDER\ntry:\n    height = json.loads(sys.stdin.readline())\n    print(Solution().maxArea(height))\nexcept Exception as e:\n    print(f"CAUGHT_ERROR: {e}")`,
      java: `import java.util.*;\n// USER_CODE_PLACEHOLDER\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.substring(1, line.length()-1).split(",");\n        int[] height = new int[parts.length];\n        for(int i=0; i<parts.length; i++) height[i] = Integer.parseInt(parts[i].trim());\n        System.out.println(new Solution().maxArea(height));\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\n// USER_CODE_PLACEHOLDER\nint main() {\n    std::string line;\n    std::getline(std::cin, line);\n    std::vector<int> height;\n    std::string content = line.substr(1, line.length() - 2);\n    std::stringstream ss(content);\n    std::string item;\n    while (std::getline(ss, item, ',')) {\n        height.push_back(std::stoi(item));\n    }\n    Solution sol;\n    std::cout << sol.maxArea(height) << std::endl;\n    return 0;\n}`
    },
  },
  {
    id: '16',
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.',
    tags: ['Array', 'Two Pointers'],
    constraints: '- 1 <= nums.length <= 3 * 10^4\n- -100 <= nums[i] <= 100\n- nums is sorted in non-decreasing order.',
    difficulty: Difficulty.EASY,
    functionName: 'removeDuplicates',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[1,1,2]', Output: '2' },
      { Input: '[0,0,1,1,1,2,2,3,3,4]', Output: '5' },
      { Input: '[1,2,3]', Output: '3' },
      { Input: '[1]', Output: '1' },
      { Input: '[1,1,1]', Output: '1' },
    ],
    starterCode: {
      javascript: `var removeDuplicates = function(nums) { /* Your code here */ };`,
      python: `class Solution:\n    def removeDuplicates(self, nums: List[int]) -> int:\n        # Your code here\n        pass`,
      cpp: `class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        // Your code here\n    }\n}`,
    },
    driverCode: {
      javascript: `// USER_CODE_PLACEHOLDER\ntry {\n    const fs = require('fs');\n    const nums = JSON.parse(fs.readFileSync(0, 'utf-8').trim());\n    console.log(removeDuplicates(nums));\n} catch (e) {\n    console.log("CAUGHT_ERROR: " + e.message);\n}`,
      python: `import sys, json\nfrom typing import List\n# USER_CODE_PLACEHOLDER\ntry:\n    nums = json.loads(sys.stdin.readline())\n    print(Solution().removeDuplicates(nums))\nexcept Exception as e:\n    print(f"CAUGHT_ERROR: {e}")`,
      java: `import java.util.*;\n// USER_CODE_PLACEHOLDER\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.substring(1, line.length()-1).split(",");\n        int[] nums = new int[parts.length];\n        for(int i=0; i<parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());\n        System.out.println(new Solution().removeDuplicates(nums));\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\n// USER_CODE_PLACEHOLDER\nint main() {\n    std::string line;\n    std::getline(std::cin, line);\n    std::vector<int> nums;\n    std::string content = line.substr(1, line.length() - 2);\n    std::stringstream ss(content);\n    std::string item;\n    while (std::getline(ss, item, ',')) nums.push_back(std::stoi(item));\n    Solution sol;\n    std::cout << sol.removeDuplicates(nums) << std::endl;\n    return 0;\n}`
    },
  },
  {
    id: '17',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    constraints: `
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'numIslands',
    inputSignature: [{ name: 'grid', type: 'char[][]' }],
    testCases: [
      { Input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', Output: '1' },
      { Input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', Output: '3' },
      { Input: '[["1","0","1","1","1"],["1","0","1","0","1"],["1","1","1","0","1"]]', Output: '1' },
      { Input: '[["0","1","0"],["1","0","1"],["0","1","0"]]', Output: '4' },
      { Input: '[["1"]]', Output: '1' },
      { Input: '[["0"]]', Output: '0' },
      { Input: '[["1","1"],["1","1"]]', Output: '1' },
      { Input: '[["1","0"],["0","1"]]', Output: '2' },
      { Input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', Output: '1' },
      { Input: '[["0","0","0"],["0","0","0"],["0","0","0"]]', Output: '0' },
    ],
    starterCode: {
      javascript: `var numIslands = function(grid) {
  // Your code here
};`,
      python: `class Solution:
  def numIslands(self, grid: List[List[str]]) -> int:
      # Your code here
      pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
  int numIslands(vector<vector<char>>& grid) {
      // Your code here
  }
};`,
      java: `class Solution {
  public int numIslands(char[][] grid) {
      // Your code here
  }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
  const fs = require('fs');
  const input = fs.readFileSync(0, 'utf-8').trim();
  const grid = JSON.parse(input);
  const result = numIslands(grid);
  console.log(result);
} catch (e) {
  console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
  grid = json.loads(sys.stdin.readline())
  solver = Solution()
  result = solver.numIslands(grid)
  print(result)
except Exception as e:
  print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      String line = scanner.nextLine();
      scanner.close();

      char[][] grid = parseJsonCharArray(line);
      Solution sol = new Solution();
      int result = sol.numIslands(grid);
      System.out.println(result);
  }
  
  private static char[][] parseJsonCharArray(String json) {
      json = json.substring(1, json.length() - 1);
      if (json.isEmpty()) return new char[0][0];
      List<char[]> list = new ArrayList<>();
      int level = 0;
      int start = 0;
      for (int i = 0; i < json.length(); i++) {
          if (json.charAt(i) == '[') {
              if (level == 0) start = i;
              level++;
          } else if (json.charAt(i) == ']') {
              level--;
              if (level == 0) {
                  String sub = json.substring(start + 1, i);
                  String[] parts = sub.split(",");
                  char[] row = new char[parts.length];
                  for (int j = 0; j < parts.length; j++) {
                      String part = parts[j].trim();
                      if (part.startsWith("\\"") && part.endsWith("\\"")) {
                          part = part.substring(1, part.length() - 1);
                      }
                      row[j] = part.charAt(0);
                  }
                  list.add(row);
              }
          }
      }
      return list.toArray(new char[0][]);
  }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

std::vector<std::vector<char>> parseCharMatrix(const std::string& str) {
  std::vector<std::vector<char>> matrix;
  std::string content = str.substr(1, str.length() - 2);
  if (content.empty()) return matrix;
  
  std::string row_str;
  int bracket_count = 0;
  for (char c : content) {
      if (c == '[') {
          bracket_count++;
          if (bracket_count == 1) {
              row_str = "";
              continue;
          }
      } else if (c == ']') {
          bracket_count--;
          if (bracket_count == 0) {
              std::vector<char> row;
              std::stringstream ss(row_str);
              std::string item;
              while (std::getline(ss, item, ',')) {
                  // Remove quotes and spaces
                  item.erase(std::remove(item.begin(), item.end(), '"'), item.end());
                  item.erase(std::remove(item.begin(), item.end(), ' '), item.end());
                  if (!item.empty()) {
                      row.push_back(item[0]);
                  }
              }
              matrix.push_back(row);
              continue;
          }
      }
      if (bracket_count == 1) {
          row_str += c;
      }
  }
  return matrix;
}

int main() {
  std::string line;
  std::getline(std::cin, line);
  std::vector<std::vector<char>> grid = parseCharMatrix(line);

  Solution sol;
  int result = sol.numIslands(grid);
  std::cout << result << std::endl;
  return 0;
}`
    },
  },
  {
    id: '18',
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    tags: ['Math'],
    constraints: '- -2^31 <= x <= 2^31 - 1',
    difficulty: Difficulty.EASY,
    functionName: 'isPalindrome',
    inputSignature: [{ name: 'x', type: 'int' }],
    testCases: [
      { Input: '121', Output: 'true' },
      { Input: '-121', Output: 'false' },
      { Input: '10', Output: 'false' },
      { Input: '0', Output: 'true' },
      { Input: '1221', Output: 'true' },
    ],
    starterCode: {
      javascript: `var isPalindrome = function(x) { /* Your code here */ };`,
      python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        # Your code here\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n    }\n}`,
    },
    driverCode: {
      javascript: `// USER_CODE_PLACEHOLDER\ntry {\n    const fs = require('fs');\n    const x = parseInt(fs.readFileSync(0, 'utf-8').trim());\n    console.log(isPalindrome(x));\n} catch (e) {\n    console.log("CAUGHT_ERROR: " + e.message);\n}`,
      python: `import sys\n# USER_CODE_PLACEHOLDER\ntry:\n    x = int(sys.stdin.readline())\n    print(str(Solution().isPalindrome(x)).lower())\nexcept Exception as e:\n    print(f"CAUGHT_ERROR: {e}")`,
      java: `import java.util.*;\n// USER_CODE_PLACEHOLDER\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        System.out.println(new Solution().isPalindrome(x));\n    }\n}`,
      cpp: `#include <iostream>\n// USER_CODE_PLACEHOLDER\nint main() {\n    int x;\n    std::cin >> x;\n    Solution sol;\n    std::cout << (sol.isPalindrome(x) ? "true" : "false") << std::endl;\n    return 0;\n}`
    },
  },
  {
    id: '19',
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap', 'Bucket Sort', 'Counting', 'Quickselect'],
    constraints: `
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- k is in the range [1, the number of unique elements in the array].`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'topKFrequent',
    inputSignature: [
      { name: 'nums', type: 'int[]' },
      { name: 'k', type: 'int' },
    ],
    testCases: [
      { Input: '[1,1,1,2,2,3]\n2', Output: '[1,2]' },
      { Input: '[1]\n1', Output: '[1]' },
      { Input: '[1,2]\n2', Output: '[1,2]' },
      { Input: '[4,1,-1,2,-1,2,3]\n2', Output: '[-1,2]' },
      { Input: '[1,1,1,1]\n1', Output: '[1]' },
      { Input: '[1,2,3,4,5]\n3', Output: '[1,2,3]' },
      { Input: '[3,0,1,0]\n1', Output: '[0]' },
      { Input: '[5,3,1,1,1,3,73,1]\n2', Output: '[1,3]' },
      { Input: '[7,10,11,5,2,5,5,7,11,8,9]\n4', Output: '[5,7,11,10]' },
      { Input: '[-1,-1]\n1', Output: '[-1]' },
    ],
    starterCode: {
      javascript: `var topKFrequent = function(nums, k) {
  // Your code here
};`,
      python: `class Solution:
  def topKFrequent(self, nums: List[int], k: int) -> List[int]:
      # Your code here
      pass`,
      cpp: `#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
      // Your code here
  }
};`,
      java: `import java.util.*;

class Solution {
  public int[] topKFrequent(int[] nums, int k) {
      // Your code here
  }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
  const fs = require('fs');
  const input = fs.readFileSync(0, 'utf-8');
  const lines = input.trim().split('\\n');
  const nums = JSON.parse(lines[0]);
  const k = parseInt(lines[1], 10);
  const result = topKFrequent(nums, k);
  result.sort((a, b) => a - b);
  console.log(JSON.stringify(result));
} catch (e) {
  console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List
from collections import Counter

# USER_CODE_PLACEHOLDER

try:
  lines = sys.stdin.readlines()
  nums = json.loads(lines[0])
  k = int(lines[1])
  solver = Solution()
  result = solver.topKFrequent(nums, k)
  result.sort()
  print(json.dumps(result, separators=(',', ':')))
except Exception as e:
  print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      String line1 = scanner.nextLine();
      int k = Integer.parseInt(scanner.nextLine().trim());
      scanner.close();

      line1 = line1.trim();
      String[] numsStr = line1.substring(1, line1.length() - 1).split(",");
      int[] nums = new int[numsStr.length];
      for(int i = 0; i < numsStr.length; i++) {
          nums[i] = Integer.parseInt(numsStr[i].trim());
      }

      Solution sol = new Solution();
      int[] result = sol.topKFrequent(nums, k);
      Arrays.sort(result);
      System.out.println(Arrays.toString(result).replace(" ", ""));
  }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// USER_CODE_PLACEHOLDER

std::vector<int> parseVector(const std::string& str) {
  std::vector<int> vec;
  std::string content = str.substr(1, str.length() - 2);
  std::stringstream ss(content);
  std::string item;
  while (std::getline(ss, item, ',')) {
      if (!item.empty()) {
          vec.push_back(std::stoi(item));
      }
  }
  return vec;
}

int main() {
  std::string line1, line2;
  std::getline(std::cin, line1);
  std::getline(std::cin, line2);

  std::vector<int> nums = parseVector(line1);
  int k = std::stoi(line2);

  Solution sol;
  std::vector<int> result = sol.topKFrequent(nums, k);
  std::sort(result.begin(), result.end());

  std::cout << "[";
  for (size_t i = 0; i < result.size(); ++i) {
      std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
  }
  std::cout << "]" << std::endl;
  return 0;
}`
    },
  },
  {
    id: '20',
    title: 'Three Sum Problem',
    slug: 'three-sum-problem',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    constraints: `
  - 3 <= nums.length <= 3000
  - -10^5 <= nums[i] <= 10^5`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'threeSum',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[-1,0,1,2,-1,-4]', Output: '[[-1,-1,2],[-1,0,1]]' },
      { Input: '[0,1,1]', Output: '[]' },
      { Input: '[0,0,0]', Output: '[[0,0,0]]' },
      { Input: '[-2,0,1,1,2]', Output: '[[-2,0,2],[-2,1,1]]' },
      { Input: '[-1,0,1,2,-1,-4,-2,-3,3,0,4,1]', Output: '[[-4,0,4],[-4,1,3],[-3,-1,4],[-3,0,3],[-3,1,2],[-2,-1,3],[-2,0,2],[-1,-1,2],[-1,0,1]]' },
      { Input: '[1,2,-2,-1]', Output: '[]' },
      { Input: '[0,0,0,0]', Output: '[[0,0,0]]' },
      { Input: '[-2,0,0,2,2]', Output: '[[-2,0,2]]' },
      { Input: '[1,-1,-1,0]', Output: '[[-1,0,1]]' },
      { Input: '[-1,0,1]', Output: '[[-1,0,1]]' },
    ],
    starterCode: {
      javascript: `var threeSum = function(nums) {
      // Your code here
  };`,
      python: `class Solution:
      def threeSum(self, nums: List[int]) -> List[List[int]]:
          # Your code here
          pass`,
      cpp: `#include <vector>
  #include <algorithm>
  using namespace std;
  
  class Solution {
  public:
      vector<vector<int>> threeSum(vector<int>& nums) {
          // Your code here
      }  
  };`,
      java: `import java.util.*;
  
  class Solution {
      public List<List<Integer>> threeSum(int[] nums) {
          // Your code here
      }
  }`,
    },
    driverCode: {
      javascript: `
  // USER_CODE_PLACEHOLDER
  try {
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim();
      const nums = JSON.parse(input);
      const result = threeSum(nums);
      result.sort((a, b) => {
          for (let i = 0; i < 3; i++) {
              if (a[i] !== b[i]) return a[i] - b[i];
          }
          return 0;
      });
      console.log(JSON.stringify(result));
  } catch (e) {
      console.log("CAUGHT_ERROR: " + e.message);
  }`,
      python: `
  import sys
  import json
  from typing import List
  
  # USER_CODE_PLACEHOLDER
  
  try:
      nums = json.loads(sys.stdin.readline())
      solver = Solution()
      result = solver.threeSum(nums)
      result.sort()
      print(json.dumps(result, separators=(',', ':')))
  except Exception as e:
      print(f"CAUGHT_ERROR: {e}")`,
      java: `
  import java.util.*;
  
  // USER_CODE_PLACEHOLDER
  
  public class Main {
      public static void main(String[] args) {
          try {
              Scanner scanner = new Scanner(System.in);
              String line = scanner.nextLine();
              scanner.close();
  
              line = line.trim();
              String[] numsStr = line.substring(1, line.length() - 1).split(",");
              int[] nums = new int[numsStr.length];
              for(int i = 0; i < numsStr.length; i++) {
                  nums[i] = Integer.parseInt(numsStr[i].trim());
              }
  
              Solution sol = new Solution();
              List<List<Integer>> result = sol.threeSum(nums);
              
              result.sort((a, b) -> {
                  for (int i = 0; i < 3; i++) {
                      if (!a.get(i).equals(b.get(i))) {
                          return a.get(i).compareTo(b.get(i));
                      }
                  }
                  return 0;
              });
              
              System.out.println(listToJsonString(result));
          } catch (Exception e) {
              System.out.println("CAUGHT_ERROR: " + e.getMessage());
          }
      }
      
      private static String listToJsonString(List<List<Integer>> list) {
          StringBuilder sb = new StringBuilder("[");
          for (int i = 0; i < list.size(); i++) {
              sb.append("[");
              for (int j = 0; j < list.get(i).size(); j++) {
                  sb.append(list.get(i).get(j));
                  if (j < list.get(i).size() - 1) sb.append(",");
              }
              sb.append("]");
              if (i < list.size() - 1) sb.append(",");
          }
          sb.append("]");
          return sb.toString();
      }
  }`,
      cpp: `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <algorithm>
  
  // USER_CODE_PLACEHOLDER
  
  std::vector<int> parseVector(const std::string& str) {
      std::vector<int> vec;
      std::string content = str.substr(1, str.length() - 2);
      std::stringstream ss(content);
      std::string item;
      while (std::getline(ss, item, ',')) {
          if (!item.empty()) {
              vec.push_back(std::stoi(item));
          }
      }
      return vec;
  }
  
  std::string vectorToString(const std::vector<std::vector<int>>& result) {
      std::ostringstream oss;
      oss << "[";
      for (size_t i = 0; i < result.size(); i++) {
          oss << "[";
          for (size_t j = 0; j < result[i].size(); j++) {
              oss << result[i][j];
              if (j < result[i].size() - 1) oss << ",";
          }
          oss << "]";
          if (i < result.size() - 1) oss << ",";
      }
      oss << "]";
      return oss.str();
  }
  
  int main() {
      try {
          std::string line;
          std::getline(std::cin, line);
          
          std::vector<int> nums = parseVector(line);
          Solution solution;
          std::vector<std::vector<int>> result = solution.threeSum(nums);
          
          std::sort(result.begin(), result.end());
          
          std::cout << vectorToString(result) << std::endl;
      } catch (const std::exception& e) {
          std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
      }
      
      return 0;
  }`
    }
  },
  {
    id: '21',
    title: 'Matrix Diagonal Sum Calculator',
    slug: 'matrix-diagonal-sum-calculator',
    description: 'Given a square matrix mat, calculate the sum of all elements on both primary and secondary diagonals. If an element is on both diagonals (center element in odd-sized matrix), count it only once.',
    tags: ['Array', 'Matrix', 'Math'],
    constraints: `
- n == mat.length == mat[i].length
- 1 <= n <= 100
- 1 <= mat[i][j] <= 100`,
    difficulty: Difficulty.EASY,
    functionName: 'diagonalSum',
    inputSignature: [{ name: 'mat', type: 'int[][]' }],
    testCases: [
      { Input: '[[1,2,3],[4,5,6],[7,8,9]]', Output: '25' },
      { Input: '[[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]', Output: '8' },
      { Input: '[[5]]', Output: '5' },
      { Input: '[[7,3],[2,4]]', Output: '16' },
      { Input: '[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]', Output: '101' },
      { Input: '[[2,5],[1,6]]', Output: '14' },
      { Input: '[[10,20,30],[40,50,60],[70,80,90]]', Output: '200' },
      { Input: '[[3,6,9,12],[15,18,21,24],[27,30,33,36],[39,42,45,48]]', Output: '126' },
      { Input: '[[1]]', Output: '1' },
      { Input: '[[8,4],[3,6]]', Output: '21' },
    ],
    starterCode: {
      javascript: `var diagonalSum = function(mat) {
    // Your code here
};`,
      python: `class Solution:
    def diagonalSum(self, mat: List[List[int]]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int diagonalSum(vector<vector<int>>& mat) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int diagonalSum(int[][] mat) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const mat = JSON.parse(input);
    const result = diagonalSum(mat);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: 
`
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    mat = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.diagonalSum(mat)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            String[] rows = line.substring(2, line.length() - 2).split("\\],\\[");
            int[][] mat = new int[rows.length][];
            for (int i = 0; i < rows.length; i++) {
                String[] nums = rows[i].split(",");
                mat[i] = new int[nums.length];
                for (int j = 0; j < nums.length; j++) {
                    mat[i][j] = Integer.parseInt(nums[j]);
                }
            }
            
            Solution sol = new Solution();
            int result = sol.diagonalSum(mat);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<std::vector<int>> mat;
        line = line.substr(2, line.length() - 4);
        std::stringstream ss(line);
        std::string row;
        
        while (std::getline(ss, row, ']')) {
            if (row.back() == ',') row.pop_back();
            if (row.front() == ',') row = row.substr(1);
            if (row.front() == '[') row = row.substr(1);
            
            std::vector<int> matRow;
            std::stringstream rowSs(row);
            std::string num;
            while (std::getline(rowSs, num, ',')) {
                matRow.push_back(std::stoi(num));
            }
            if (!matRow.empty()) mat.push_back(matRow);
        }
        
        Solution solution;
        int result = solution.diagonalSum(mat);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '22',
    title: 'Binary Search in Array',
    slug: 'binary-search-in-array',
    description: 'Given a sorted array of integers nums and a target value, implement binary search to find the index of target. If target is not found, return -1. The array contains unique elements and is sorted in ascending order.',
    tags: ['Array', 'Binary Search'],
    constraints: `
- 1 <= nums.length <= 10^4
- -10^4 <= nums[i], target <= 10^4
- All integers in nums are unique
- nums is sorted in ascending order`,
    difficulty: Difficulty.EASY,
    functionName: 'search',
    inputSignature: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }],
    testCases: [
      { Input: '[-1,0,3,5,9,12]\n9', Output: '4' },
      { Input: '[-1,0,3,5,9,12]\n2', Output: '-1' },
      { Input: '[5]\n5', Output: '0' },
      { Input: '[5]\n-5', Output: '-1' },
      { Input: '[1,2,3,4,5,6,7]\n4', Output: '3' },
      { Input: '[1,2,3,4,5,6,7]\n8', Output: '-1' },
      { Input: '[-5,-2,0,3,7,11]\n3', Output: '3' },
      { Input: '[2,5,6,0,0,1,2]\n0', Output: '-1' },
      { Input: '[1]\n1', Output: '0' },
      { Input: '[1,3,5,7,9]\n1', Output: '0' },
    ],
    starterCode: {
      javascript: `var search = function(nums, target) {
    // Your code here
};`,
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const nums = JSON.parse(input[0]);
    const target = parseInt(input[1]);
    const result = search(nums, target);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    nums = json.loads(lines[0])
    target = int(lines[1])
    solver = Solution()
    result = solver.search(nums, target)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String numsLine = scanner.nextLine();
            int target = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            String[] numsStr = numsLine.substring(1, numsLine.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            int result = sol.search(nums, target);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string numsLine, targetLine;
        std::getline(std::cin, numsLine);
        std::getline(std::cin, targetLine);
        
        std::vector<int> nums;
        std::string content = numsLine.substr(1, numsLine.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        int target = std::stoi(targetLine);
        
        Solution solution;
        int result = solution.search(nums, target);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '23',
    title: 'First Non-Repeating Character',
    slug: 'first-non-repeating-character',
    description: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. The string contains only lowercase English letters.',
    tags: ['String', 'Hash Table'],
    constraints: `
- 1 <= s.length <= 10^5
- s consists of only lowercase English letters`,
    difficulty: Difficulty.EASY,
    functionName: 'firstUniqChar',
    inputSignature: [{ name: 's', type: 'string' }],
    testCases: [
      { Input: '"leetcode"', Output: '0' },
      { Input: '"loveleetcode"', Output: '2' },
      { Input: '"aabb"', Output: '-1' },
      { Input: '"z"', Output: '0' },
      { Input: '"abcdef"', Output: '0' },
      { Input: '"abccba"', Output: '-1' },
      { Input: '"abcabc"', Output: '-1' },
      { Input: '"raceacar"', Output: '0' },
      { Input: '"programming"', Output: '0' },
      { Input: '"aabcc"', Output: '4' },
    ],
    starterCode: {
      javascript: `var firstUniqChar = function(s) {
    // Your code here
};`,
      python: `class Solution:
    def firstUniqChar(self, s: str) -> int:
        # Your code here
        pass`,
      cpp: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int firstUniqChar(string s) {
        // Your code here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int firstUniqChar(String s) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const s = JSON.parse(input);
    const result = firstUniqChar(s);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    s = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.firstUniqChar(s)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            String s = line.substring(1, line.length() - 1);
            Solution sol = new Solution();
            int result = sol.firstUniqChar(s);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <string>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::string s = line.substr(1, line.length() - 2);
        Solution solution;
        int result = solution.firstUniqChar(s);
        
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '24',
    title: 'Rotate Array Elements',
    slug: 'rotate-array-elements',
    description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Try to solve this problem in-place with O(1) extra memory.',
    tags: ['Array', 'Math', 'Two Pointers'],
    constraints: `
- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^5`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'rotate',
    inputSignature: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
    testCases: [
      { Input: '[1,2,3,4,5,6,7]\n3', Output: '[5,6,7,1,2,3,4]' },
      { Input: '[-1,-100,3,99]\n2', Output: '[3,99,-1,-100]' },
      { Input: '[1,2]\n1', Output: '[2,1]' },
      { Input: '[1]\n1', Output: '[1]' },
      { Input: '[1,2,3]\n4', Output: '[3,1,2]' },
      { Input: '[1,2,3,4,5]\n2', Output: '[4,5,1,2,3]' },
      { Input: '[1,2,3,4,5,6]\n0', Output: '[1,2,3,4,5,6]' },
      { Input: '[1,2,3,4]\n2', Output: '[3,4,1,2]' },
      { Input: '[1,2,3,4,5,6,7,8,9]\n4', Output: '[6,7,8,9,1,2,3,4,5]' },
      { Input: '[1,2,3,4,5]\n10', Output: '[1,2,3,4,5]' },
    ],
    starterCode: {
      javascript: `var rotate = function(nums, k) {
    // Your code here
};`,
      python: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        # Your code here
        # Do not return anything, modify nums in-place instead
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        // Your code here
    }
};`,
      java: `class Solution {
    public void rotate(int[] nums, int k) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const nums = JSON.parse(input[0]);
    const k = parseInt(input[1]);
    rotate(nums, k);
    console.log(JSON.stringify(nums));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    nums = json.loads(lines[0])
    k = int(lines[1])
    solver = Solution()
    solver.rotate(nums, k)
    print(json.dumps(nums))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String numsLine = scanner.nextLine();
            int k = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            String[] numsStr = numsLine.substring(1, numsLine.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            sol.rotate(nums, k);
            
            System.out.print("[");
            for (int i = 0; i < nums.length; i++) {
                System.out.print(nums[i]);
                if (i < nums.length - 1) System.out.print(",");
            }
            System.out.println("]");
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string numsLine, kLine;
        std::getline(std::cin, numsLine);
        std::getline(std::cin, kLine);
        
        std::vector<int> nums;
        std::string content = numsLine.substr(1, numsLine.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        int k = std::stoi(kLine);
        
        Solution solution;
        solution.rotate(nums, k);
        
        std::cout << "[";
        for (size_t i = 0; i < nums.size(); i++) {
            std::cout << nums[i];
            if (i < nums.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '25',
    title: 'Find Peak Element Index',
    slug: 'find-peak-element-index',
    description: 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element and return its index. If the array contains multiple peaks, return the index to any of the peaks. You may imagine that nums[-1] = nums[n] = -∞.',
    tags: ['Array', 'Binary Search'],
    constraints: `
- 1 <= nums.length <= 1000
- -2^31 <= nums[i] <= 2^31 - 1
- nums[i] != nums[i + 1] for all valid i`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'findPeakElement',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[1,2,3,1]', Output: '2' },
      { Input: '[1,2,1,3,5,6,4]', Output: '5' },
      { Input: '[1]', Output: '0' },
      { Input: '[1,2]', Output: '1' },
      { Input: '[2,1]', Output: '0' },
      { Input: '[1,3,2,1]', Output: '1' },
      { Input: '[6,5,4,3,2,3,2]', Output: '0' },
      { Input: '[1,2,3,4,5]', Output: '4' },
      { Input: '[5,4,3,2,1]', Output: '0' },
      { Input: '[3,4,3,2,1]', Output: '1' },
    ],
    starterCode: {
      javascript: `var findPeakElement = function(nums) {
    // Your code here
};`,
      python: `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int findPeakElement(int[] nums) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const nums = JSON.parse(input);
    const result = findPeakElement(nums);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    nums = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.findPeakElement(nums)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            String[] numsStr = line.substring(1, line.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            int result = sol.findPeakElement(nums);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<int> nums;
        std::string content = line.substr(1, line.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        Solution solution;
        int result = solution.findPeakElement(nums);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '26',
    title: 'String Pattern Matching',
    slug: 'string-pattern-matching',
    description: 'Given two strings - a text and a pattern, determine if the pattern appears as a substring in the text. Return the starting index of the first occurrence of pattern in text, or -1 if pattern is not found. Implement this without using built-in string search functions.',
    tags: ['String', 'Sliding Window'],
    constraints: `
- 1 <= text.length <= 10^4
- 1 <= pattern.length <= 100
- text and pattern consist of only lowercase English letters`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'strStr',
    inputSignature: [{ name: 'text', type: 'string' }, { name: 'pattern', type: 'string' }],
    testCases: [
      { Input: '"hello"\n"ll"', Output: '2' },
      { Input: '"aaaaa"\n"bba"', Output: '-1' },
      { Input: '""\n""', Output: '0' },
      { Input: '"programming"\n"gram"', Output: '3' },
      { Input: '"abcdef"\n"def"', Output: '3' },
      { Input: '"mississippi"\n"issip"', Output: '4' },
      { Input: '"a"\n"a"', Output: '0' },
      { Input: '"abc"\n"c"', Output: '2' },
      { Input: '"aaabaaaba"\n"aaaba"', Output: '0' },
      { Input: '"leetcode"\n"code"', Output: '4' },
    ],
    starterCode: {
      javascript: `var strStr = function(text, pattern) {
    // Your code here
};`,
      python: `class Solution:
    def strStr(self, text: str, pattern: str) -> int:
        # Your code here
        pass`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int strStr(string text, string pattern) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int strStr(String text, String pattern) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const text = JSON.parse(input[0]);
    const pattern = JSON.parse(input[1]);
    const result = strStr(text, pattern);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    text = json.loads(lines[0])
    pattern = json.loads(lines[1])
    solver = Solution()
    result = solver.strStr(text, pattern)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String textLine = scanner.nextLine();
            String patternLine = scanner.nextLine();
            scanner.close();
            
            String text = textLine.substring(1, textLine.length() - 1);
            String pattern = patternLine.substring(1, patternLine.length() - 1);
            
            Solution sol = new Solution();
            int result = sol.strStr(text, pattern);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <string>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string textLine, patternLine;
        std::getline(std::cin, textLine);
        std::getline(std::cin, patternLine);
        
        std::string text = textLine.substr(1, textLine.length() - 2);
        std::string pattern = patternLine.substr(1, patternLine.length() - 2);
        
        Solution solution;
        int result = solution.strStr(text, pattern);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '27',
    title: 'Group Anagram Strings',
    slug: 'group-anagram-strings',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    constraints: `
- 1 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters only`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'groupAnagrams',
    inputSignature: [{ name: 'strs', type: 'string[]' }],
    testCases: [
      { Input: '["eat","tea","tan","ate","nat","bat"]', Output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { Input: '[""]', Output: '[[""]]' },
      { Input: '["a"]', Output: '[["a"]]' },
      { Input: '["abc","bca","cab","xyz"]', Output: '[["abc","bca","cab"],["xyz"]]' },
      { Input: '["listen","silent","hello","world"]', Output: '[["listen","silent"],["hello"],["world"]]' },
      { Input: '["rat","tar","art","god","dog"]', Output: '[["rat","tar","art"],["god","dog"]]' },
      { Input: '["aab","aba","baa"]', Output: '[["aab","aba","baa"]]' },
      { Input: '["race","care","acre","dear","read"]', Output: '[["race","care","acre"],["dear","read"]]' },
      { Input: '["stop","tops","pots","opts"]', Output: '[["stop","tops","pots","opts"]]' },
      { Input: '["abc","def","fed","cba"]', Output: '[["abc","cba"],["def","fed"]]' },
    ],
    starterCode: {
      javascript: `var groupAnagrams = function(strs) {
    // Your code here
};`,
      python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Your code here
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const strs = JSON.parse(input);
    const result = groupAnagrams(strs);
    result.sort((a, b) => a.length - b.length || a[0].localeCompare(b[0]));
    result.forEach(group => group.sort());
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    strs = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.groupAnagrams(strs)
    result.sort(key=lambda x: (len(x), x[0]))
    for group in result:
        group.sort()
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            line = line.substring(1, line.length() - 1);
            List<String> strList = new ArrayList<>();
            if (!line.isEmpty()) {
                String[] parts = line.split("\",\"");
                for (String part : parts) {
                    part = part.replace("\"", "");
                    strList.add(part);
                }
            }
            String[] strs = strList.toArray(new String[0]);
            
            Solution sol = new Solution();
            List<List<String>> result = sol.groupAnagrams(strs);
            
            result.sort((a, b) -> {
                if (a.size() != b.size()) return a.size() - b.size();
                return a.get(0).compareTo(b.get(0));
            });
            result.forEach(Collections::sort);
            
            System.out.println(listToJsonString(result));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    
    private static String listToJsonString(List<List<String>> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("[");
            for (int j = 0; j < list.get(i).size(); j++) {
                sb.append("\"").append(list.get(i).get(j)).append("\"");
                if (j < list.get(i).size() - 1) sb.append(",");
            }
            sb.append("]");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<std::string> strs;
        if (line.length() > 2) {
            std::string content = line.substr(1, line.length() - 2);
            std::stringstream ss(content);
            std::string item;
            while (std::getline(ss, item, ',')) {
                if (item.front() == '"') item = item.substr(1);
                if (item.back() == '"') item = item.substr(0, item.length() - 1);
                strs.push_back(item);
            }
        }
        
        Solution solution;
        std::vector<std::vector<std::string>> result = solution.groupAnagrams(strs);
        
        std::sort(result.begin(), result.end(), [](const auto& a, const auto& b) {
            if (a.size() != b.size()) return a.size() < b.size();
            return a[0] < b[0];
        });
        for (auto& group : result) {
            std::sort(group.begin(), group.end());
        }
        
        std::cout << "[";
        for (size_t i = 0; i < result.size(); i++) {
            std::cout << "[";
            for (size_t j = 0; j < result[i].size(); j++) {
                std::cout << "\"" << result[i][j] << "\"";
                if (j < result[i].size() - 1) std::cout << ",";
            }
            std::cout << "]";
            if (i < result.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '28',
    title: 'Missing Number in Sequence',
    slug: 'missing-number-in-sequence',
    description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array. The array contains all numbers from 0 to n except one.',
    tags: ['Array', 'Hash Table', 'Math', 'Bit Manipulation'],
    constraints: `
- n == nums.length
- 1 <= n <= 10^4
- 0 <= nums[i] <= n
- All numbers in nums are unique`,
    difficulty: Difficulty.EASY,
    functionName: 'missingNumber',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[3,0,1]', Output: '2' },
      { Input: '[0,1]', Output: '2' },
      { Input: '[9,6,4,2,3,5,7,0,1]', Output: '8' },
      { Input: '[0]', Output: '1' },
      { Input: '[1]', Output: '0' },
      { Input: '[1,2,3,4,5]', Output: '0' },
      { Input: '[0,1,2,3,4,6,7,8]', Output: '5' },
      { Input: '[2,3,4,5,6,7,8,9,10]', Output: '0' },
      { Input: '[0,1,3,4,5,6,7,8,9]', Output: '2' },
      { Input: '[1,0,3]', Output: '2' },
    ],
    starterCode: {
      javascript: `var missingNumber = function(nums) {
    // Your code here
};`,
      python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int missingNumber(int[] nums) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const nums = JSON.parse(input);
    const result = missingNumber(nums);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    nums = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.missingNumber(nums)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            String[] numsStr = line.substring(1, line.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            int result = sol.missingNumber(nums);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<int> nums;
        std::string content = line.substr(1, line.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        Solution solution;
        int result = solution.missingNumber(nums);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '29',
    title: 'Single Element in Sorted Array',
    slug: 'single-element-in-sorted-array',
    description: 'You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element that appears only once. Your solution must run in O(log n) time and O(1) space.',
    tags: ['Array', 'Binary Search'],
    constraints: `
- 1 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^5
- nums is sorted in ascending order`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'singleNonDuplicate',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[1,1,2,3,3,4,4,8,8]', Output: '2' },
      { Input: '[3,3,7,7,10,11,11]', Output: '10' },
      { Input: '[1]', Output: '1' },
      { Input: '[1,1,2]', Output: '2' },
      { Input: '[1,2,2]', Output: '1' },
      { Input: '[1,1,2,2,3]', Output: '3' },
      { Input: '[0,1,1,2,2,3,3]', Output: '0' },
      { Input: '[1,1,3,3,4,4,5,5,6]', Output: '6' },
      { Input: '[2,2,3,3,4,5,5,6,6]', Output: '4' },
      { Input: '[1,1,2,2,3,3,4]', Output: '4' },
    ],
    starterCode: {
      javascript: `var singleNonDuplicate = function(nums) {
    // Your code here
};`,
      python: `class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int singleNonDuplicate(vector<int>& nums) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int singleNonDuplicate(int[] nums) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const nums = JSON.parse(input);
    const result = singleNonDuplicate(nums);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    nums = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.singleNonDuplicate(nums)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();
            
            String[] numsStr = line.substring(1, line.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            int result = sol.singleNonDuplicate(nums);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<int> nums;
        std::string content = line.substr(1, line.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        Solution solution;
        int result = solution.singleNonDuplicate(nums);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '30',
    title: 'Kth Largest Element Finder',
    slug: 'kth-largest-element-finder',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting the entire array?',
    tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'],
    constraints: `
- 1 <= k <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'findKthLargest',
    inputSignature: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
    testCases: [
      { Input: '[3,2,1,5,6,4]\n2', Output: '5' },
      { Input: '[3,2,3,1,2,4,5,5,6]\n4', Output: '4' },
      { Input: '[1]\n1', Output: '1' },
      { Input: '[7,10,4,3,20,15]\n3', Output: '10' },
      { Input: '[2,1]\n1', Output: '2' },
      { Input: '[3,2,3,1,2,4,5,5,6]\n1', Output: '6' },
      { Input: '[1,2,3,4,5,6]\n3', Output: '4' },
      { Input: '[5,2,4,1,3,6,0]\n4', Output: '3' },
      { Input: '[99,99]\n1', Output: '99' },
      { Input: '[1,2,3,4,5]\n5', Output: '1' },
    ],
    starterCode: {
      javascript: `var findKthLargest = function(nums, k) {
    // Your code here
};`,
      python: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const nums = JSON.parse(input[0]);
    const k = parseInt(input[1]);
    const result = findKthLargest(nums, k);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    nums = json.loads(lines[0])
    k = int(lines[1])
    solver = Solution()
    result = solver.findKthLargest(nums, k)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String numsLine = scanner.nextLine();
            int k = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            String[] numsStr = numsLine.substring(1, numsLine.length() - 1).split(",");
            int[] nums = new int[numsStr.length];
            for (int i = 0; i < numsStr.length; i++) {
                nums[i] = Integer.parseInt(numsStr[i].trim());
            }
            
            Solution sol = new Solution();
            int result = sol.findKthLargest(nums, k);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string numsLine, kLine;
        std::getline(std::cin, numsLine);
        std::getline(std::cin, kLine);
        
        std::vector<int> nums;
        std::string content = numsLine.substr(1, numsLine.length() - 2);
        std::stringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ',')) {
            nums.push_back(std::stoi(item));
        }
        
        int k = std::stoi(kLine);
        
        Solution solution;
        int result = solution.findKthLargest(nums, k);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    
    return 0;
}`
    }
  },
  {
    id: '31',
    title: 'Replicate Graph Connectivity',
    slug: 'replicate-graph-connectivity',
    description: 'You are given a starting node of a connected, undirected graph. Your task is to construct a complete and independent copy of this graph. This means creating a new node for each node in the original graph and ensuring that the connectivity (edges) between the new nodes mirrors the original structure exactly. The returned node should be the node in your new graph that corresponds to the given starting node.',
    tags: ['Graph', 'Depth-First Search', 'Breadth-First Search', 'Hash Table'],
    constraints: `- The number of nodes in the graph is in the range \`[0, 100]\`.\n- \`1 <= Node.val <= 100\`.\n- \`Node.val\` is unique for each node.\n- The graph is connected and undirected.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'cloneGraph',
    inputSignature: [{ name: 'node', type: 'Node' }],
    testCases: [
      { Input: '[[2,5],[1,3],[2,4],[3,5],[1,4]]', Output: '[[2,5],[1,3],[2,4],[3,5],[1,4]]' },
      { Input: '[[]]', Output: '[[]]' },
      { Input: '[]', Output: '[]' },
      { Input: '[[2],[1]]', Output: '[[2],[1]]' }
    ],
    starterCode: {
      javascript: `/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 * this.val = val === undefined ? 0 : val;
 * this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

var cloneGraph = function(node) {
    // Your code here
};`,
      python: `"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

from typing import Optional
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        # Your code here
        pass`,
      cpp: `/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};*/

class Solution {
public:
    Node* cloneGraph(Node* node) {
        // Your code here
    }
};`,
      java: `/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}*/

class Solution {
    public Node cloneGraph(Node node) {
        // Your code here
    }
};`
    },
    driverCode: {
        javascript: `function Node(val, neighbors) { this.val = val === undefined ? 0 : val; this.neighbors = neighbors === undefined ? [] : neighbors; }
function buildGraph(adjList) { if (!adjList || adjList.length === 0) return null; const nodes = adjList.map((_, i) => new Node(i + 1)); for (let i = 0; i < adjList.length; i++) { for (const neighborVal of adjList[i]) { nodes[i].neighbors.push(nodes[neighborVal - 1]); } } return nodes[0]; }
function graphToAdjList(node) { if (!node) return []; const adjList = []; const q = [node]; const visited = new Map([[node.val, node]]); while (q.length > 0) { const curr = q.shift(); const neighbors = []; for (const neighbor of curr.neighbors) { neighbors.push(neighbor.val); if (!visited.has(neighbor.val)) { visited.set(neighbor.val, neighbor); q.push(neighbor); } } adjList[curr.val - 1] = neighbors.sort((a,b)=>a-b); } return adjList; }
// USER_CODE_PLACEHOLDER
try { const fs = require('fs'); const input = fs.readFileSync(0, 'utf-8').trim(); const adjList = JSON.parse(input); const graph = buildGraph(adjList); const clonedGraph = cloneGraph(graph); const resultAdjList = graphToAdjList(clonedGraph); console.log(JSON.stringify(resultAdjList)); } catch (e) { console.log('CAUGHT_ERROR: ' + e.message); }`,
        python: `import sys, json
from collections import deque
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def build_graph(adj_list):
    if not adj_list: return None
    nodes = {i + 1: Node(i + 1) for i in range(len(adj_list))}
    for i, neighbors in enumerate(adj_list):
        for neighbor_val in neighbors:
            nodes[i + 1].neighbors.append(nodes[neighbor_val])
    return nodes[1] if nodes else None

def graph_to_adj_list(node):
    if not node: return []
    adj_list_map = {}
    q = deque([node])
    visited = {node.val}
    while q:
        curr = q.popleft()
        neighbors_vals = sorted([n.val for n in curr.neighbors])
        adj_list_map[curr.val] = neighbors_vals
        for neighbor in curr.neighbors:
            if neighbor.val not in visited:
                visited.add(neighbor.val)
                q.append(neighbor)
    return [adj_list_map[i] for i in sorted(adj_list_map.keys())]

# USER_CODE_PLACEHOLDER

try:
    adj_list_input = json.loads(sys.stdin.readline())
    graph_node = build_graph(adj_list_input)
    solver = Solution()
    cloned_node = solver.cloneGraph(graph_node)
    result_adj_list = graph_to_adj_list(cloned_node)
    print(json.dumps(result_adj_list, separators=(',', ':')))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
        java: `import java.util.*;
class Node { public int val; public List<Node> neighbors; public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            Node graph = buildGraph(scanner.nextLine());
            Solution sol = new Solution();
            Node clonedGraph = sol.cloneGraph(graph);
            System.out.println(graphToAdjListString(clonedGraph));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }

    private static Node buildGraph(String line) {
        line = line.substring(1, line.length() - 1);
        if (line.isEmpty()) return null;
        if (line.equals("[]")) return new Node(1);
        String[] adjListStr = line.substring(1, line.length() - 1).split("\\\\],\\\\[");
        Map<Integer, Node> nodes = new HashMap<>();
        for (int i = 1; i <= adjListStr.length; i++) nodes.put(i, new Node(i));
        for (int i = 0; i < adjListStr.length; i++) {
            String current = adjListStr[i].replaceAll("\\\\[|\\\\]", "");
            if(!current.isEmpty()) {
                String[] neighbors = current.split(",");
                for (String neighbor : neighbors) {
                     nodes.get(i + 1).neighbors.add(nodes.get(Integer.parseInt(neighbor.trim())));
                }
            }
        }
        return nodes.get(1);
    }

    private static String graphToAdjListString(Node node) {
        if (node == null) return "[]";
        Map<Integer, List<Integer>> adjList = new TreeMap<>();
        Queue<Node> q = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        q.add(node);
        visited.add(node.val);
        while (!q.isEmpty()) {
            Node curr = q.poll();
            List<Integer> neighbors = new ArrayList<>();
            for (Node n : curr.neighbors) {
                neighbors.add(n.val);
                if (!visited.contains(n.val)) { visited.add(n.val); q.add(n); }
            }
            Collections.sort(neighbors);
            adjList.put(curr.val, neighbors);
        }
        if (adjList.isEmpty() && visited.size() == 1) adjList.put(node.val, new ArrayList<>());
        StringBuilder sb = new StringBuilder("[");
        for (int i = 1; i <= adjList.size(); i++) {
            sb.append(adjList.get(i).toString().replaceAll(" ", ""));
            if (i < adjList.size()) sb.append(",");
        }
        return sb.append("]").toString();
    }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <queue>
#include <algorithm>
#include <set>
class Node { public: int val; std::vector<Node*> neighbors; Node(int _val) : val(_val) {} };
// USER_CODE_PLACEHOLDER
Node* buildGraph(const std::string& line) {
    if (line == "[]") return nullptr;
    if (line == "[[]]") return new Node(1);
    std::string content = line.substr(1, line.length() - 2);
    std::vector<std::vector<int>> adjListVec;
    std::stringstream ss(content.substr(1, content.length() - 2));
    std::string segment;
    while(std::getline(ss, segment, ']')){
        if(segment.empty()) continue;
        if(segment[0] == ',' && segment.length() > 1) segment = segment.substr(2);
        else if(segment[0] == '[') segment = segment.substr(1);
        std::vector<int> neighbors;
        std::stringstream ss2(segment);
        std::string num_str;
        while(std::getline(ss2, num_str, ',')) if(!num_str.empty()) neighbors.push_back(stoi(num_str));
        adjListVec.push_back(neighbors);
    }
    std::map<int, Node*> nodes;
    for(int i = 1; i <= adjListVec.size(); ++i) nodes[i] = new Node(i);
    for(int i = 0; i < adjListVec.size(); ++i) for(int neighbor_val : adjListVec[i]) nodes[i+1]->neighbors.push_back(nodes[neighbor_val]);
    return nodes.count(1) ? nodes[1] : nullptr;
}
void printGraph(Node* node) {
    if(!node) { std::cout << "[]" << std::endl; return; }
    std::map<int, std::vector<int>> adjList;
    std::queue<Node*> q;
    std::set<int> visited;
    q.push(node);
    visited.insert(node->val);
    while(!q.empty()) {
        Node* curr = q.front(); q.pop();
        for(Node* n : curr->neighbors) {
            adjList[curr->val].push_back(n->val);
            if(visited.find(n->val) == visited.end()) { visited.insert(n->val); q.push(n); }
        }
        if(adjList.find(curr->val) == adjList.end()) adjList[curr->val] = {};
        std::sort(adjList[curr->val].begin(), adjList[curr->val].end());
    }
    std::cout << "[";
    for(auto it = adjList.begin(); it != adjList.end(); ++it) {
        std::cout << "[";
        for(size_t i = 0; i < it->second.size(); ++i) std::cout << it->second[i] << (i == it->second.size() - 1 ? "" : ",");
        std::cout << "]";
        if (std::next(it) != adjList.end()) std::cout << ",";
    }
    std::cout << "]" << std::endl;
}
int main() { std::string line; std::getline(std::cin, line); Node* graph = buildGraph(line); Solution sol; Node* cloned = sol.cloneGraph(graph); printGraph(cloned); return 0; }`
    }
  },
  {
    id: '32',
    title: 'Binary Tree Traversal by Level',
    slug: 'binary-tree-traversal-by-level',
    description: 'Your function will receive the root node of a binary tree. It should produce a list of lists, where each inner list contains the values of the nodes at a specific level of the tree. The traversal should proceed from the root downwards, and for each level, the nodes should be visited from left to right.',
    tags: ['Tree', 'Breadth-First Search'],
    constraints: `- The number of nodes in the tree is in the range \`[0, 2000]\`.\n- \`-1000 <= Node.val <= 1000\`.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'levelOrder',
    inputSignature: [{ name: 'root', type: 'TreeNode' }],
    testCases: [
      { Input: '[10,5,15,null,null,6,20]', Output: '[[10],[5,15],[6,20]]' },
      { Input: '[8]', Output: '[[8]]' },
      { Input: '[]', Output: '[]' },
      { Input: '[1,2,null,3,null,4,null,5]', Output: '[[1],[2],[3],[4],[5]]' }
    ],
    starterCode: {
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 * this.val = (val===undefined ? 0 : val)
 * this.left = (left===undefined ? null : left)
 * this.right = (right===undefined ? null : right)
 * }
 */
var levelOrder = function(root) {
    // Your code here
};`,
        python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Your code here
        pass`,
        cpp: `#include <vector>
#include <queue>

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 * int val;
 * TreeNode *left;
 * TreeNode *right;
 * TreeNode() : val(0), left(nullptr), right(nullptr) {}
 * TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    std::vector<std::vector<int>> levelOrder(TreeNode* root) {
        // Your code here
    }
};`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 * int val;
 * TreeNode left;
 * TreeNode right;
 * TreeNode() {}
 * TreeNode(int val) { this.val = val; }
 * TreeNode(int val, TreeNode left, TreeNode right) {
 * this.val = val;
 * this.left = left;
 * this.right = right;
 * }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Your code here
    }
};`
    },
    driverCode: {
        javascript: `function TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }
function arrayToTree(arr) { if (!arr || arr.length === 0) return null; const root = new TreeNode(arr[0]); const q = [root]; for (let i = 1; i < arr.length; i += 2) { const parent = q.shift(); if (arr[i] !== null) { parent.left = new TreeNode(arr[i]); q.push(parent.left); } if (i + 1 < arr.length && arr[i + 1] !== null) { parent.right = new TreeNode(arr[i + 1]); q.push(parent.right); } } return root; }
// USER_CODE_PLACEHOLDER
try { const fs = require('fs'); const input = fs.readFileSync(0, 'utf-8').trim(); const arr = JSON.parse(input); const root = arrayToTree(arr); const result = levelOrder(root); console.log(JSON.stringify(result)); } catch (e) { console.log('CAUGHT_ERROR: ' + e.message); }`,
        python: `import sys, json
from collections import deque
from typing import Optional, List
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def array_to_tree(arr: List[Optional[int]]) -> Optional[TreeNode]:
    if not arr: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root
# USER_CODE_PLACEHOLDER
try:
    arr = json.loads(sys.stdin.readline())
    root = array_to_tree(arr)
    solver = Solution()
    result = solver.levelOrder(root)
    print(json.dumps(result, separators=(',', ':')))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
        java: `import java.util.*;
class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            TreeNode root = arrayToTree(scanner.nextLine());
            Solution sol = new Solution();
            List<List<Integer>> result = sol.levelOrder(root);
            System.out.println(listToJsonString(result));
        } catch (Exception e) { System.out.println("CAUGHT_ERROR: " + e.getMessage()); }
    }
    private static TreeNode arrayToTree(String line) {
        String content = line.substring(1, line.length() - 1);
        if (content.isEmpty()) return null;
        String[] nodes = content.split(",");
        if (nodes[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(nodes[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nodes.length) {
            TreeNode curr = q.poll();
            if (i < nodes.length && !nodes[i].equals("null")) { curr.left = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.left); }
            i++;
            if (i < nodes.length && !nodes[i].equals("null")) { curr.right = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.right); }
            i++;
        }
        return root;
    }
    private static String listToJsonString(List<List<Integer>> list) { 
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i).toString().replaceAll(" ", ""));
            if (i < list.size() - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>
#include <algorithm>
struct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };
// USER_CODE_PLACEHOLDER
TreeNode* arrayToTree(const std::string& line) { std::string content = line.substr(1, line.length() - 2); if(content.empty()) return nullptr; std::stringstream ss(content); std::string item; std::vector<TreeNode*> nodes; while(std::getline(ss, item, ',')) { if(item == "null") nodes.push_back(nullptr); else nodes.push_back(new TreeNode(stoi(item))); } if(nodes.empty() || !nodes[0]) return nullptr; TreeNode* root = nodes[0]; std::queue<TreeNode*> q; q.push(root); int i = 1; while(!q.empty() && i < nodes.size()) { TreeNode* curr = q.front(); q.pop(); if(curr) { if (i < nodes.size()) { curr->left = nodes[i++]; if(curr->left) q.push(curr->left); } if (i < nodes.size()) { curr->right = nodes[i++]; if(curr->right) q.push(curr->right); } } } return root; }
void printResult(const std::vector<std::vector<int>>& result) { std::cout << "["; for (size_t i = 0; i < result.size(); ++i) { std::cout << "["; for (size_t j = 0; j < result[i].size(); ++j) { std::cout << result[i][j] << (j == result[i].size() - 1 ? "" : ","); } std::cout << "]" << (i == result.size() - 1 ? "" : ","); } std::cout << "]" << std::endl; }
int main() { std::string line; std::getline(std::cin, line); TreeNode* root = arrayToTree(line); Solution sol; std::vector<std::vector<int>> result = sol.levelOrder(root); printResult(result); return 0; }`
    }
  },
  {
    id: '33',
    title: 'Generate All Possible Subsets',
    slug: 'generate-all-possible-subsets',
    description: 'Write a function that takes an array of unique integers as input and generates its power set. The power set is the set of all possible subsets of the input array, including the empty set and the set itself. The order of subsets in the output list and the order of elements within each subset do not matter, but the output will be sorted for validation.',
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
    constraints: `- \`1 <= nums.length <= 10\`\n- \`-10 <= nums[i] <= 10\`\n- All the numbers of \`nums\` are unique.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'subsets',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[4,5,6]', Output: '[[],[4],[4,5],[4,5,6],[4,6],[5],[5,6],[6]]' },
      { Input: '[9]', Output: '[[],[9]]' },
      { Input: '[]', Output: '[[]]' },
      { Input: '[1,5]', Output: '[[],[1],[1,5],[5]]' }
    ],
    starterCode: {
        javascript: `var subsets = function(nums) {
    // Your code here
};`,
        python: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        # Your code here
        pass`,
        cpp: `#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        // Your code here
    }
};`,
        java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Your code here
    }
};`
    },
    driverCode: {
      javascript: `// USER_CODE_PLACEHOLDER
try { const fs = require('fs'); const nums = JSON.parse(fs.readFileSync(0, 'utf-8').trim()); let result = subsets(nums); result.forEach(sub => sub.sort((a,b) => a-b)); result.sort((a,b) => { for(let i=0; i<Math.min(a.length, b.length); i++){ if(a[i] !== b[i]) return a[i]-b[i]; } return a.length - b.length; }); console.log(JSON.stringify(result)); } catch (e) { console.log('CAUGHT_ERROR: ' + e.message); }`,
      python: `import sys, json
from typing import List
# USER_CODE_PLACEHOLDER
try:
    nums = json.loads(sys.stdin.readline())
    solver = Solution()
    result = solver.subsets(nums)
    for sub in result:
        sub.sort()
    result.sort()
    print(json.dumps(result, separators=(',', ':')))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
      java: `import java.util.*;
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            String line = scanner.nextLine();
            String[] numsStr = line.substring(1, line.length() - 1).split(",");
            int[] nums = new int[numsStr.length == 1 && numsStr[0].isEmpty() ? 0 : numsStr.length];
            if(nums.length > 0) { for(int i=0; i<nums.length; i++) nums[i] = Integer.parseInt(numsStr[i].trim()); }
            Solution sol = new Solution();
            List<List<Integer>> result = sol.subsets(nums);
            result.forEach(Collections::sort);
            result.sort((a,b) -> { for(int i=0; i<Math.min(a.size(), b.size()); i++){ int cmp = a.get(i).compareTo(b.get(i)); if(cmp != 0) return cmp; } return Integer.compare(a.size(), b.size()); });
            System.out.println(listToJsonString(result));
        } catch(Exception e) { System.out.println("CAUGHT_ERROR: " + e.getMessage()); }
    }
    private static String listToJsonString(List<List<Integer>> list) { 
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i).toString().replaceAll(" ", ""));
            if (i < list.size() - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
// USER_CODE_PLACEHOLDER
std::vector<int> parseVector(const std::string& str) { std::vector<int> vec; if(str.length() <= 2) return vec; std::string content = str.substr(1, str.length() - 2); if(content.empty()) return vec; std::stringstream ss(content); std::string item; while (std::getline(ss, item, ',')) vec.push_back(std::stoi(item)); return vec; }
void printResult(std::vector<std::vector<int>>& result) { for(auto& sub : result) std::sort(sub.begin(), sub.end()); std::sort(result.begin(), result.end()); std::cout << "["; for (size_t i = 0; i < result.size(); ++i) { std::cout << "["; for (size_t j = 0; j < result[i].size(); ++j) { std::cout << result[i][j] << (j == result[i].size() - 1 ? "" : ","); } std::cout << "]" << (i == result.size() - 1 ? "" : ","); } std::cout << "]" << std::endl; }
int main() { std::string line; std::getline(std::cin, line); std::vector<int> nums = parseVector(line); Solution sol; std::vector<std::vector<int>> result = sol.subsets(nums); printResult(result); return 0; }`
    }
  },
  {
    id: '34',
    title: 'Detect Cycle in a Linked List',
    slug: 'detect-cycle-in-linked-list',
    description: 'You are provided with the head of a singly linked list. Your task is to determine if this list contains a cycle. A cycle exists if any node\'s `next` pointer eventually points back to a node that has already been visited in the traversal from the head. Your function should return `true` if a cycle is present, and `false` otherwise.',
    tags: ['Linked List', 'Two Pointers', 'Hash Table'],
    constraints: `- The number of the nodes in the list is in the range \`[0, 10^4]\`.\n- \`-10^5 <= Node.val <= 10^5\`.\n- \`pos\` is \`-1\` or a valid index in the linked-list.`,
    difficulty: Difficulty.EASY,
    functionName: 'hasCycle',
    inputSignature: [{ name: 'head', type: 'ListNode' }],
    testCases: [
      { Input: '[10,20,30,40,50]\n2', Output: 'true' },
      { Input: '[5,8]\n0', Output: 'true' },
      { Input: '[7]\n-1', Output: 'false' },
      { Input: '[]\n-1', Output: 'false' }
    ],
    starterCode: {
        javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 * this.val = val;
 * this.next = null;
 * }
 */
var hasCycle = function(head) {
    // Your code here
};`,
        python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # Your code here
        pass`,
        cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 * int val;
 * ListNode *next;
 * ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    bool hasCycle(ListNode *head) {
        // Your code here
    }
};`,
        java: `/**
 * Definition for singly-linked list.
 * class ListNode {
 * int val;
 * ListNode next;
 * ListNode(int x) {
 * val = x;
 * next = null;
 * }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        // Your code here
    }
}`
    },
    driverCode: {
      javascript: `function ListNode(val) { this.val = val; this.next = null; }
function buildListWithCycle(arr, pos) { if (!arr || arr.length === 0) return null; let head = new ListNode(arr[0]); let current = head; let cycleNode = null; if (pos === 0) cycleNode = head; const nodes = [head]; for (let i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; nodes.push(current); } if (pos !== -1) current.next = nodes[pos]; return head; }
// USER_CODE_PLACEHOLDER
try { const fs = require('fs'); const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n'); const arr = JSON.parse(lines[0]); const pos = parseInt(lines[1]); const head = buildListWithCycle(arr, pos); const result = hasCycle(head); console.log(result); } catch (e) { console.log('CAUGHT_ERROR: ' + e.message); }`,
      python: `import sys, json
from typing import Optional, List
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None
def build_list_with_cycle(arr: List[int], pos: int) -> Optional[ListNode]:
    if not arr: return None
    head = ListNode(arr[0])
    current = head
    nodes = [head]
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
        nodes.append(current)
    if pos != -1: current.next = nodes[pos]
    return head
# USER_CODE_PLACEHOLDER
try:
    lines = sys.stdin.readlines()
    arr = json.loads(lines[0]) if lines[0].strip() else []
    pos = int(lines[1]) if len(lines) > 1 else -1
    head = build_list_with_cycle(arr, pos)
    solver = Solution()
    result = solver.hasCycle(head)
    print(str(result).lower())
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
      java: `import java.util.*;
class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int[] arr = jsonArrayToIntArray(scanner.nextLine());
            int pos = -1;
            if (scanner.hasNextLine()) pos = Integer.parseInt(scanner.nextLine());
            ListNode head = buildListWithCycle(arr, pos);
            Solution sol = new Solution();
            System.out.println(sol.hasCycle(head));
        } catch (Exception e) { System.out.println("CAUGHT_ERROR: " + e.getMessage()); }
    }
    private static int[] jsonArrayToIntArray(String json) { String content = json.substring(1, json.length() - 1).trim(); if (content.isEmpty()) return new int[0]; String[] parts = content.split(","); int[] arr = new int[parts.length]; for (int i=0; i<parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim()); return arr; }
    private static ListNode buildListWithCycle(int[] arr, int pos) { if (arr == null || arr.length == 0) return null; ListNode head = new ListNode(arr[0]); List<ListNode> nodes = new ArrayList<>(); nodes.add(head); ListNode current = head; for (int i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; nodes.add(current); } if (pos != -1) current.next = nodes.get(pos); return head; }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(NULL) {} };
// USER_CODE_PLACEHOLDER
std::vector<int> parseVector(const std::string& str) { std::vector<int> vec; if(str.length()<=2) return vec; std::string content = str.substr(1, str.length() - 2); if(content.empty()) return vec; std::stringstream ss(content); std::string item; while (std::getline(ss, item, ',')) vec.push_back(std::stoi(item)); return vec; }
ListNode* buildListWithCycle(const std::vector<int>& arr, int pos) { if (arr.empty()) return nullptr; std::vector<ListNode*> nodes; for (int val : arr) nodes.push_back(new ListNode(val)); for (size_t i = 0; i < nodes.size() - 1; ++i) nodes[i]->next = nodes[i + 1]; if (pos != -1 && !nodes.empty()) nodes.back()->next = nodes[pos]; return nodes.empty() ? nullptr : nodes[0]; }
int main() { std::string line1, line2; std::getline(std::cin, line1); if(std::cin.peek() != EOF) std::getline(std::cin, line2); else line2 = "-1"; std::vector<int> arr = parseVector(line1); int pos = std::stoi(line2); ListNode* head = buildListWithCycle(arr, pos); Solution sol; std::cout << std::boolalpha << sol.hasCycle(head) << std::endl; return 0; }`
    }
  },
  {
    id: '35',
    title: 'Real-time Median Calculator',
    slug: 'real-time-median-calculator',
    description: 'Design a data structure that supports the following two operations efficiently:\n- `addNum(int num)`: Adds a new integer to the collection.\n- `findMedian()`: Returns the median of all integers added so far.\n\nThe median is the central value of a sorted dataset. If the dataset has an odd number of values, the median is the middle one. If it has an even number, the median is the average of the two central values.',
    tags: ['Heap (Priority Queue)', 'Two Heaps', 'Design'],
    constraints: `- \`-10^5 <= num <= 10^5\`\n- There will be at least one element in the data structure before calling \`findMedian\`.\n- At most \`5 * 10^4\` calls will be made to \`addNum\` and \`findMedian\`.`,
    difficulty: Difficulty.HARD,
    functionName: 'MedianFinder',
    inputSignature: [],
    testCases: [
      { Input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[6],[10],[],[2],[]]', Output: '[null,null,null,8.0,null,6.0]' },
      { Input: '["MedianFinder","addNum","findMedian","addNum","findMedian"]\n[[],[-1],[],[-2],[]]', Output: '[null,null,-1.0,null,-1.5]' },
      { Input: '["MedianFinder","addNum","findMedian"]\n[[],[5],[]]', Output: '[null,null,5.0]' }
    ],
    starterCode: {
        javascript: `var MedianFinder = function() {
    // Your code here
};

MedianFinder.prototype.addNum = function(num) {
    // Your code here
};

MedianFinder.prototype.findMedian = function() {
    // Your code here
};`,
        python: `import heapq

class MedianFinder:

    def __init__(self):
        # Your code here
        pass

    def addNum(self, num: int) -> None:
        # Your code here
        pass

    def findMedian(self) -> float:
        # Your code here
        pass`,
        cpp: `#include <queue>
#include <vector>

class MedianFinder {
public:
    MedianFinder() {
        // Your code here
    }
    
    void addNum(int num) {
        // Your code here
    }
    
    double findMedian() {
        // Your code here
    }
};`,
        java: `import java.util.PriorityQueue;
import java.util.Collections;

class MedianFinder {

    public MedianFinder() {
        // Your code here
    }
    
    public void addNum(int num) {
        // Your code here
    }
    
    public double findMedian() {
        // Your code here
    }
}`
    },
    driverCode: {
      javascript: `// USER_CODE_PLACEHOLDER
try { const fs = require('fs'); const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n'); const commands = JSON.parse(lines[0]); const values = JSON.parse(lines[1]); let obj = null; const output = []; for (let i = 0; i < commands.length; i++) { if (commands[i] === 'MedianFinder') { obj = new MedianFinder(); output.push(null); } else if (commands[i] === 'addNum') { obj.addNum(values[i][0]); output.push(null); } else if (commands[i] === 'findMedian') { const res = obj.findMedian(); output.push(res); } } console.log(JSON.stringify(output.map(v => v === -0 ? 0 : v))); } catch (e) { console.log('CAUGHT_ERROR: ' + e.message); }`,
      python: `import sys, json
# USER_CODE_PLACEHOLDER
try:
    lines = sys.stdin.readlines()
    commands = json.loads(lines[0])
    values = json.loads(lines[1])
    output = []
    obj = None
    for i in range(len(commands)):
        if commands[i] == 'MedianFinder':
            obj = MedianFinder()
            output.append(None)
        elif commands[i] == 'addNum':
            obj.addNum(values[i][0])
            output.append(None)
        elif commands[i] == 'findMedian':
            res = obj.findMedian()
            output.append(res)
    # The replace is a simple way to handle -0.0 for JSON consistency
    print(json.dumps(output, separators=(',', ':')).replace('-0.0', '0.0'))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
      java: `import java.util.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            Gson gson = new Gson();
            List<String> commands = gson.fromJson(scanner.nextLine(), new TypeToken<List<String>>(){}.getType());
            List<List<Integer>> values = gson.fromJson(scanner.nextLine(), new TypeToken<List<List<Integer>>>(){}.getType());
            List<Object> output = new ArrayList<>();
            MedianFinder obj = null;
            for (int i = 0; i < commands.size(); i++) {
                switch (commands.get(i)) {
                    case "MedianFinder":
                        obj = new MedianFinder();
                        output.add(null);
                        break;
                    case "addNum":
                        obj.addNum(values.get(i).get(0));
                        output.add(null);
                        break;
                    case "findMedian":
                        double median = obj.findMedian();
                        // Handle -0.0 case
                        output.add(median == -0.0 ? 0.0 : median);
                        break;
                }
            }
            System.out.println(gson.toJson(output));
        } catch (Exception e) { System.out.println("CAUGHT_ERROR: " + e.getMessage()); }
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
// USER_CODE_PLACEHOLDER
// This is a simplified parser for the specific test case format.
std::vector<std::string> parse_str_vec(const std::string& s) { std::vector<std::string> v; if(s.length() <= 2) return v; std::string content = s.substr(1, s.length()-2); std::stringstream ss(content); std::string item; while(getline(ss, item, ',')) { v.push_back(item.substr(1, item.length()-2)); } return v; }
std::vector<std::vector<int>> parse_int_vec(const std::string& s) { std::vector<std::vector<int>> v; if(s.length() <= 2) return v; std::string content = s.substr(1, s.length()-2); if(content.empty()) return v; std::stringstream ss(content); std::string item; while(getline(ss, item, ']')) { if(item.find('[') != std::string::npos) item = item.substr(item.find('[')+1); if(item.empty()) continue; std::vector<int> inner; std::stringstream ss2(item); std::string num; while(getline(ss2, num, ',')) if(!num.empty()) inner.push_back(stoi(num)); v.push_back(inner); } return v; }
int main() { std::string line1, line2; std::getline(std::cin, line1); std::getline(std::cin, line2); auto commands = parse_str_vec(line1); auto values = parse_int_vec(line2); MedianFinder* obj = nullptr; std::cout << std::fixed << std::setprecision(1) << "["; for (size_t i = 0; i < commands.size(); ++i) { if (commands[i] == "MedianFinder") { obj = new MedianFinder(); std::cout << "null"; } else if (commands[i] == "addNum") { obj->addNum(values[i][0]); std::cout << "null"; } else if (commands[i] == "findMedian") { double res = obj->findMedian(); std::cout << res; } if (i < commands.size() - 1) std::cout << ","; } std::cout << "]" << std::endl; delete obj; return 0; }`
    }
  },
  {
    id: '36',
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node\'s key.\n- The right subtree of a node contains only nodes with keys greater than the node\'s key.\n- Both the left and right subtrees must also be binary search trees.',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Recursion'],
    constraints: `
- The number of nodes in the tree is in the range [1, 10^4].
- -2^31 <= Node.val <= 2^31 - 1`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'isValidBST',
    inputSignature: [{ name: 'root', type: 'TreeNode' }],
    testCases: [
      { Input: '[2,1,3]', Output: 'true' },
      { Input: '[5,1,4,null,null,3,6]', Output: 'false' },
      { Input: '[1,1]', Output: 'false' },
      { Input: '[10,5,15,null,null,6,20]', Output: 'false' },
      { Input: '[2147483647]', Output: 'true' },
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 * this.val = (val===undefined ? 0 : val)
 * this.left = (left===undefined ? null : left)
 * this.right = (right===undefined ? null : right)
 * }
 */
var isValidBST = function(root) {
    // Your code here
};`,
      python: `
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <climits>

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // Your code here
    }
};`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 * int val;
 * TreeNode left;
 * TreeNode right;
 * TreeNode() {}
 * TreeNode(int val) { this.val = val; }
 * TreeNode(int val, TreeNode left, TreeNode right) {
 * this.val = val;
 * this.left = left;
 * this.right = right;
 * }
 * }
 */
class Solution {
    public boolean isValidBST(TreeNode root) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
function TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }
function arrayToTree(arr) { if (!arr || arr.length === 0) return null; const root = new TreeNode(arr[0]); const q = [root]; for (let i = 1; i < arr.length; i += 2) { const parent = q.shift(); if (arr[i] !== null) { parent.left = new TreeNode(arr[i]); q.push(parent.left); } if (i + 1 < arr.length && arr[i + 1] !== null) { parent.right = new TreeNode(arr[i + 1]); q.push(parent.right); } } return root; }
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const arr = JSON.parse(input);
    const root = arrayToTree(arr);
    const result = isValidBST(root);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys, json
from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_tree(arr: List[Optional[int]]) -> Optional[TreeNode]:
    if not arr: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root
# USER_CODE_PLACEHOLDER
try:
    arr = json.loads(sys.stdin.readline())
    root = array_to_tree(arr)
    solver = Solution()
    result = solver.isValidBST(root)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            TreeNode root = arrayToTree(line);
            Solution sol = new Solution();
            boolean result = sol.isValidBST(root);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    private static TreeNode arrayToTree(String line) {
        String content = line.substring(1, line.length() - 1);
        if (content.isEmpty()) return null;
        String[] nodes = content.split(",");
        if (nodes[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(nodes[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nodes.length) {
            TreeNode curr = q.poll();
            if (i < nodes.length && !nodes[i].equals("null")) { curr.left = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.left); }
            i++;
            if (i < nodes.length && !nodes[i].equals("null")) { curr.right = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.right); }
            i++;
        }
        return root;
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>

// Definition for a binary tree node provided in starter code
#ifndef TREENODE_DEFINITION
#define TREENODE_DEFINITION
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
#endif
// USER_CODE_PLACEHOLDER
TreeNode* arrayToTree(const std::string& line) { std::string content = line.substr(1, line.length() - 2); if(content.empty()) return nullptr; std::stringstream ss(content); std::string item; std::vector<TreeNode*> nodes; while(std::getline(ss, item, ',')) { if(item == "null") nodes.push_back(nullptr); else nodes.push_back(new TreeNode(stoi(item))); } if(nodes.empty() || !nodes[0]) return nullptr; TreeNode* root = nodes[0]; std::queue<TreeNode*> q; q.push(root); int i = 1; while(!q.empty() && i < nodes.size()) { TreeNode* curr = q.front(); q.pop(); if(curr) { if (i < nodes.size()) { curr->left = nodes[i++]; if(curr->left) q.push(curr->left); } if (i < nodes.size()) { curr->right = nodes[i++]; if(curr->right) q.push(curr->right); } } } return root; }
int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        TreeNode* root = arrayToTree(line);
        Solution sol;
        bool result = sol.isValidBST(root);
        std::cout << std::boolalpha << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '37',
    title: 'Merge Overlapping Intervals',
    slug: 'merge-overlapping-intervals',
    description: 'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    tags: ['Array', 'Sorting', 'Intervals'],
    constraints: `
- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^4`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'merge',
    inputSignature: [{ name: 'intervals', type: 'int[][]' }],
    testCases: [
      { Input: '[[1,3],[2,6],[8,10],[15,18]]', Output: '[[1,6],[8,10],[15,18]]' },
      { Input: '[[1,4],[4,5]]', Output: '[[1,5]]' },
      { Input: '[[1,4],[2,3]]', Output: '[[1,4]]' },
      { Input: '[[1,5]]', Output: '[[1,5]]' },
      { Input: '[[1,4],[0,4]]', Output: '[[0,4]]' },
    ],
    starterCode: {
      javascript: `var merge = function(intervals) {
    // Your code here
};`,
      python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Your code here
    }
};`,
      java: `import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const intervals = JSON.parse(input);
    const result = merge(intervals);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    intervals = json.loads(sys.stdin.read().strip())
    solver = Solution()
    result = solver.merge(intervals)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();

            // Custom parser for 2D array
            line = line.substring(2, line.length() - 2);
            String[] pairs = line.split("\\],\\s*\\[");
            int[][] intervals = new int[pairs.length][];
            if (line.isEmpty()) {
                intervals = new int[0][0];
            } else {
                for (int i = 0; i < pairs.length; i++) {
                    String[] nums = pairs[i].split(",");
                    intervals[i] = new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())};
                }
            }
            
            Solution sol = new Solution();
            int[][] result = sol.merge(intervals);
            System.out.println(Arrays.deepToString(result).replaceAll("\\s", ""));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// USER_CODE_PLACEHOLDER

// Custom parser for 2D vector from string like "[[1,3],[2,6]]"
std::vector<std::vector<int>> parse2DVector(const std::string& str) {
    std::vector<std::vector<int>> result;
    if (str.length() <= 2) return result;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return result;
    
    std::stringstream ss(content);
    std::string segment;
    while(std::getline(ss, segment, '[')) {
        if(segment.find(']') != std::string::npos) {
            segment = segment.substr(0, segment.find(']'));
            std::stringstream ss2(segment);
            std::string item_str;
            std::vector<int> inner_vec;
            while(std::getline(ss2, item_str, ',')) {
                if(!item_str.empty()) inner_vec.push_back(std::stoi(item_str));
            }
            if(!inner_vec.empty()) result.push_back(inner_vec);
        }
    }
    return result;
}

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<std::vector<int>> intervals = parse2DVector(line);
        
        Solution solution;
        std::vector<std::vector<int>> result = solution.merge(intervals);
        
        std::cout << "[";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << "[" << result[i][0] << "," << result[i][1] << "]";
            if (i < result.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '38',
    title: 'Generate All Permutations',
    slug: 'generate-all-permutations',
    description: 'Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.',
    tags: ['Array', 'Backtracking', 'Recursion'],
    constraints: `
- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- All the integers of nums are unique.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'permute',
    inputSignature: [{ name: 'nums', type: 'int[]' }],
    testCases: [
      { Input: '[1,2,3]', Output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { Input: '[0,1]', Output: '[[0,1],[1,0]]' },
      { Input: '[1]', Output: '[[1]]' },
    ],
    starterCode: {
      javascript: `var permute = function(nums) {
    // Your code here
};`,
      python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        // Your code here
    }
};`,
      java: `import java.util.List;
import java.util.ArrayList;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const nums = JSON.parse(input);
    const result = permute(nums);
    // Sort for consistent output
    result.forEach(p => p.sort((a,b) => a-b));
    result.sort((a,b) => {
        for(let i=0; i<a.length; ++i) {
            if(a[i] !== b[i]) return a[i] - b[i];
        }
        return 0;
    });
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List
import itertools

# USER_CODE_PLACEHOLDER

try:
    nums = json.loads(sys.stdin.read().strip())
    solver = Solution()
    result = solver.permute(nums)
    # Sort for consistent output
    result.sort()
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String numsLine = scanner.nextLine();
            scanner.close();
            
            String[] numsStr = numsLine.substring(1, numsLine.length() - 1).split(",");
            int[] nums = new int[numsStr.length == 1 && numsStr[0].isEmpty() ? 0 : numsStr.length];
            if (nums.length > 0) {
              for (int i = 0; i < numsStr.length; i++) {
                  nums[i] = Integer.parseInt(numsStr[i].trim());
              }
            }
            
            Solution sol = new Solution();
            List<List<Integer>> result = sol.permute(nums);
            
            // Sort for consistent output
            result.sort((l1, l2) -> {
                for (int i = 0; i < l1.size(); i++) {
                    int cmp = l1.get(i).compareTo(l2.get(i));
                    if (cmp != 0) return cmp;
                }
                return 0;
            });

            System.out.println(result.toString().replaceAll("\\s", ""));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// USER_CODE_PLACEHOLDER

std::vector<int> parseVector(const std::string& str) {
    std::vector<int> vec;
    if (str.length() <= 2) return vec;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return vec;
    std::stringstream ss(content);
    std::string item;
    while (std::getline(ss, item, ',')) {
        vec.push_back(std::stoi(item));
    }
    return vec;
}

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<int> nums = parseVector(line);
        
        Solution solution;
        std::vector<std::vector<int>> result = solution.permute(nums);
        
        // Sort for consistent output
        std::sort(result.begin(), result.end());

        std::cout << "[";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << "[";
            for (size_t j = 0; j < result[i].size(); ++j) {
                std::cout << result[i][j] << (j == result[i].size() - 1 ? "" : ",");
            }
            std::cout << "]" << (i == result.size() - 1 ? "" : ",");
        }
        std::cout << "]" << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '39',
    title: 'Word Break Problem',
    slug: 'word-break-problem',
    description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.',
    tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie'],
    constraints: `
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20
- s and wordDict[i] consist of only lowercase English letters.
- All the strings of wordDict are unique.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'wordBreak',
    inputSignature: [{ name: 's', type: 'string' }, { name: 'wordDict', type: 'string[]' }],
    testCases: [
      { Input: '"leetcode"\n["leet","code"]', Output: 'true' },
      { Input: '"applepenapple"\n["apple","pen"]', Output: 'true' },
      { Input: '"catsandog"\n["cats","dog","sand","and","cat"]', Output: 'false' },
      { Input: '"a"\n["a"]', Output: 'true' },
      { Input: '"cars"\n["car","ca","rs"]', Output: 'true' },
    ],
    starterCode: {
      javascript: `var wordBreak = function(s, wordDict) {
    // Your code here
};`,
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        // Your code here
    }
};`,
      java: `import java.util.List;
import java.util.Set;
import java.util.HashSet;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const s = JSON.parse(input[0]);
    const wordDict = JSON.parse(input[1]);
    const result = wordBreak(s, wordDict);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    s = json.loads(lines[0])
    wordDict = json.loads(lines[1])
    solver = Solution()
    result = solver.wordBreak(s, wordDict)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String s = scanner.nextLine();
            s = s.substring(1, s.length() - 1);
            String dictLine = scanner.nextLine();
            scanner.close();
            
            String[] dictStr = dictLine.substring(1, dictLine.length() - 1).replace("\"", "").split(",");
            List<String> wordDict = new ArrayList<>(Arrays.asList(dictStr));
            
            Solution sol = new Solution();
            boolean result = sol.wordBreak(s, wordDict);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

// Custom parser for vector of strings like "["leet","code"]"
std::vector<std::string> parseStringVector(const std::string& str) {
    std::vector<std::string> result;
    if (str.length() <= 2) return result;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return result;
    
    std::stringstream ss(content);
    std::string item;
    while (std::getline(ss, item, ',')) {
        size_t first = item.find_first_of('"');
        size_t last = item.find_last_of('"');
        result.push_back(item.substr(first + 1, last - first - 1));
    }
    return result;
}

int main() {
    try {
        std::string sLine, dictLine;
        std::getline(std::cin, sLine);
        std::getline(std::cin, dictLine);

        // remove quotes from s
        sLine = sLine.substr(1, sLine.length() - 2);

        std::vector<std::string> wordDict = parseStringVector(dictLine);
        
        Solution solution;
        bool result = solution.wordBreak(sLine, wordDict);
        std::cout << std::boolalpha << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '40',
    title: 'Lowest Common Ancestor of a Binary Tree',
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    description: 'Given the root of a binary tree and two nodes `p` and `q` that are in the tree, find the lowest common ancestor (LCA) of the two nodes. The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in the tree that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree', 'Recursion'],
    constraints: `
- The number of nodes in the tree is in the range [2, 10^5].
- -10^9 <= Node.val <= 10^9
- All Node.val are unique.
- p != q
- p and q will exist in the tree.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'lowestCommonAncestor',
    inputSignature: [{ name: 'root', type: 'TreeNode' }, { name: 'p', type: 'TreeNode' }, { name: 'q', type: 'TreeNode' }],
    testCases: [
        { Input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n1', Output: '3' },
        { Input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n4', Output: '5' },
        { Input: '[1,2]\n1\n2', Output: '1' }
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 * this.val = val;
 * this.left = this.right = null;
 * }
 */
var lowestCommonAncestor = function(root, p, q) {
    // Your code here
};`,
      python: `
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Your code here
        pass`,
      cpp: `#include <vector>
// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Your code here
    }
};`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 * int val;
 * TreeNode left;
 * TreeNode right;
 * TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
function TreeNode(val) { this.val = val; this.left = this.right = null; }
function arrayToTree(arr) { if (!arr || arr.length === 0 || arr[0] === null) return null; let root = new TreeNode(arr[0]); let q = [root]; for (let i = 1; i < arr.length; i += 2) { let parent = q.shift(); if (arr[i] !== null) { parent.left = new TreeNode(arr[i]); q.push(parent.left); } if (i + 1 < arr.length && arr[i + 1] !== null) { parent.right = new TreeNode(arr[i + 1]); q.push(parent.right); } } return root; }
function findNode(root, val) { if (!root) return null; if (root.val === val) return root; return findNode(root.left, val) || findNode(root.right, val); }
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const arr = JSON.parse(input[0]);
    const p_val = parseInt(input[1]);
    const q_val = parseInt(input[2]);
    const root = arrayToTree(arr);
    const p_node = findNode(root, p_val);
    const q_node = findNode(root, q_val);
    const result_node = lowestCommonAncestor(root, p_node, q_node);
    console.log(JSON.stringify(result_node ? result_node.val : null));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys, json
from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

def array_to_tree(arr: List[Optional[int]]) -> Optional[TreeNode]:
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root

def find_node(root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
    if not root: return None
    if root.val == val: return root
    return find_node(root.left, val) or find_node(root.right, val)
# USER_CODE_PLACEHOLDER
try:
    lines = sys.stdin.read().strip().split('\\n')
    arr = json.loads(lines[0])
    p_val = int(lines[1])
    q_val = int(lines[2])
    root = array_to_tree(arr)
    p_node = find_node(root, p_val)
    q_node = find_node(root, q_val)
    solver = Solution()
    result_node = solver.lowestCommonAncestor(root, p_node, q_node)
    print(json.dumps(result_node.val if result_node else None))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int x) { val = x; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String treeLine = scanner.nextLine();
            int pVal = Integer.parseInt(scanner.nextLine());
            int qVal = Integer.parseInt(scanner.nextLine());
            TreeNode root = arrayToTree(treeLine);
            TreeNode pNode = findNode(root, pVal);
            TreeNode qNode = findNode(root, qVal);
            Solution sol = new Solution();
            TreeNode result = sol.lowestCommonAncestor(root, pNode, qNode);
            System.out.println(result != null ? result.val : "null");
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    private static TreeNode findNode(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        TreeNode left = findNode(root.left, val);
        return left != null ? left : findNode(root.right, val);
    }
    private static TreeNode arrayToTree(String line) {
        String content = line.substring(1, line.length() - 1);
        if (content.isEmpty() || content.equals("null")) return null;
        String[] nodes = content.split(",");
        if (nodes[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(nodes[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nodes.length) {
            TreeNode curr = q.poll();
            if (i < nodes.length && !nodes[i].equals("null")) { curr.left = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.left); }
            i++;
            if (i < nodes.length && !nodes[i].equals("null")) { curr.right = new TreeNode(Integer.parseInt(nodes[i])); q.add(curr.right); }
            i++;
        }
        return root;
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>

#ifndef TREENODE_DEFINITION_LCA
#define TREENODE_DEFINITION_LCA
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
#endif
// USER_CODE_PLACEHOLDER
TreeNode* arrayToTree(const std::string& line) { std::string content = line.substr(1, line.length() - 2); if(content.empty()) return nullptr; std::stringstream ss(content); std::string item; std::vector<TreeNode*> nodes; while(std::getline(ss, item, ',')) { if(item == "null") nodes.push_back(nullptr); else nodes.push_back(new TreeNode(stoi(item))); } if(nodes.empty() || !nodes[0]) return nullptr; TreeNode* root = nodes[0]; std::queue<TreeNode*> q; q.push(root); int i = 1; while(!q.empty() && i < nodes.size()) { TreeNode* curr = q.front(); q.pop(); if(curr) { if (i < nodes.size()) { curr->left = nodes[i++]; if(curr->left) q.push(curr->left); } if (i < nodes.size()) { curr->right = nodes[i++]; if(curr->right) q.push(curr->right); } } } return root; }
TreeNode* findNode(TreeNode* root, int val) { if (!root) return nullptr; if (root->val == val) return root; TreeNode* left = findNode(root->left, val); return left ? left : findNode(root->right, val); }

int main() {
    try {
        std::string treeLine, pLine, qLine;
        std::getline(std::cin, treeLine);
        std::getline(std::cin, pLine);
        std::getline(std::cin, qLine);
        TreeNode* root = arrayToTree(treeLine);
        TreeNode* p = findNode(root, std::stoi(pLine));
        TreeNode* q = findNode(root, std::stoi(qLine));
        Solution sol;
        TreeNode* result = sol.lowestCommonAncestor(root, p, q);
        std::cout << (result ? std::to_string(result->val) : "null") << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '41',
    title: 'Rotting Oranges',
    slug: 'rotting-oranges',
    description: 'You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.',
    tags: ['Array', 'Breadth-First Search', 'Matrix', 'Graph'],
    constraints: `
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 10
- grid[i][j] is 0, 1, or 2.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'orangesRotting',
    inputSignature: [{ name: 'grid', type: 'int[][]' }],
    testCases: [
      { Input: '[[2,1,1],[1,1,0],[0,1,1]]', Output: '4' },
      { Input: '[[2,1,1],[0,1,1],[1,0,1]]', Output: '-1' },
      { Input: '[[0,2]]', Output: '0' },
      { Input: '[[1]]', Output: '-1' },
      { Input: '[[0]]', Output: '0' },
    ],
    starterCode: {
      javascript: `var orangesRotting = function(grid) {
    // Your code here
};`,
      python: `from typing import List

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        // Your code here
    }
};`,
      java: `import java.util.Queue;
import java.util.LinkedList;

class Solution {
    public int orangesRotting(int[][] grid) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const grid = JSON.parse(input);
    const result = orangesRotting(grid);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    grid = json.loads(sys.stdin.read().strip())
    solver = Solution()
    result = solver.orangesRotting(grid)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String line = scanner.nextLine();
            scanner.close();

            // Custom parser for 2D array
            line = line.substring(1, line.length() - 1).trim();
            if (line.isEmpty()) {
                 System.out.println(new Solution().orangesRotting(new int[0][0]));
                 return;
            }
            String[] rows = line.substring(1, line.length() - 1).split("\\\\],\\\\[");
            int numRows = rows.length;
            int numCols = rows[0].split(",").length;
            int[][] grid = new int[numRows][numCols];

            for (int i = 0; i < numRows; i++) {
                String[] nums = rows[i].split(",");
                for (int j = 0; j < numCols; j++) {
                    grid[i][j] = Integer.parseInt(nums[j].trim());
                }
            }
            
            Solution sol = new Solution();
            int result = sol.orangesRotting(grid);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

// Custom parser for 2D vector from string like "[[2,1,1],[1,1,0]]"
std::vector<std::vector<int>> parse2DVector(const std::string& str) {
    std::vector<std::vector<int>> result;
    if (str.length() <= 2 || str == "[[]]") return result;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return result;
    
    std::stringstream ss(content);
    std::string segment;
    while(std::getline(ss, segment, '[')) {
        size_t pos = segment.find(']');
        if(pos != std::string::npos) {
            segment = segment.substr(0, pos);
            std::stringstream ss2(segment);
            std::string item_str;
            std::vector<int> inner_vec;
            while(std::getline(ss2, item_str, ',')) {
                if(!item_str.empty()) inner_vec.push_back(std::stoi(item_str));
            }
            if(!inner_vec.empty()) result.push_back(inner_vec);
        }
    }
    return result;
}

int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<std::vector<int>> grid = parse2DVector(line);
        
        Solution solution;
        int result = solution.orangesRotting(grid);
        std::cout << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '42',
    title: 'Edit Distance',
    slug: 'edit-distance',
    description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character',
    tags: ['String', 'Dynamic Programming'],
    constraints: `
- 0 <= word1.length, word2.length <= 500
- word1 and word2 consist of lowercase English letters.`,
    difficulty: Difficulty.HARD,
    functionName: 'minDistance',
    inputSignature: [{ name: 'word1', type: 'string' }, { name: 'word2', type: 'string' }],
    testCases: [
      { Input: '"horse"\n"ros"', Output: '3' },
      { Input: '"intention"\n"execution"', Output: '5' },
      { Input: '""\n"a"', Output: '1' },
      { Input: '"a"\n""', Output: '1' },
      { Input: '"zoologicoarchaeologist"\n"zoogeologist"', Output: '10' },
    ],
    starterCode: {
      javascript: `var minDistance = function(word1, word2) {
    // Your code here
};`,
      python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        # Your code here
        pass`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        // Your code here
    }
};`,
      java: `import java.lang.Math;

class Solution {
    public int minDistance(String word1, String word2) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const word1 = JSON.parse(input[0]);
    const word2 = JSON.parse(input[1]);
    const result = minDistance(word1, word2);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    word1 = json.loads(lines[0])
    word2 = json.loads(lines[1])
    solver = Solution()
    result = solver.minDistance(word1, word2)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String word1 = scanner.nextLine();
            word1 = word1.substring(1, word1.length() - 1);
            String word2 = scanner.nextLine();
            word2 = word2.substring(1, word2.length() - 1);
            scanner.close();
            
            Solution sol = new Solution();
            int result = sol.minDistance(word1, word2);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <string>
#include <vector>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line1, line2;
        std::getline(std::cin, line1);
        std::getline(std::cin, line2);
        
        std::string word1 = line1.substr(1, line1.length() - 2);
        std::string word2 = line2.substr(1, line2.length() - 2);
        
        Solution solution;
        int result = solution.minDistance(word1, word2);
        std::cout << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '43',
    title: 'Kth Smallest Element in a BST',
    slug: 'kth-smallest-element-in-a-bst',
    description: 'Given the `root` of a binary search tree (BST), and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'In-Order Traversal'],
    constraints: `
- The number of nodes in the tree is n.
- 1 <= k <= n <= 10^4
- 0 <= Node.val <= 10^4`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'kthSmallest',
    inputSignature: [{ name: 'root', type: 'TreeNode' }, { name: 'k', type: 'int' }],
    testCases: [
      { Input: '[3,1,4,null,2]\n1', Output: '1' },
      { Input: '[5,3,6,2,4,null,null,1]\n3', Output: '3' },
      { Input: '[2,1]\n2', Output: '2' },
      { Input: '[1]\n1', Output: '1' },
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 * this.val = (val===undefined ? 0 : val)
 * this.left = (left===undefined ? null : left)
 * this.right = (right===undefined ? null : right)
 * }
 */
var kthSmallest = function(root, k) {
    // Your code here
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
from typing import Optional

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        # Your code here
        pass`,
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 * int val;
 * TreeNode *left;
 * TreeNode *right;
 * TreeNode() : val(0), left(nullptr), right(nullptr) {}
 * TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
#include <vector>

class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        // Your code here
    }
};`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 * int val;
 * TreeNode left;
 * TreeNode right;
 * TreeNode() {}
 * TreeNode(int val) { this.val = val; }
 * TreeNode(int val, TreeNode left, TreeNode right) {
 * this.val = val;
 * this.left = left;
 * this.right = right;
 * }
 * }
 */
import java.util.ArrayList;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
function TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }
function arrayToTree(arr) { if (!arr || arr.length === 0 || arr[0] === null) return null; let root = new TreeNode(arr[0]); let q = [root]; for (let i = 1; i < arr.length; i += 2) { let parent = q.shift(); if (i < arr.length && arr[i] !== null) { parent.left = new TreeNode(arr[i]); q.push(parent.left); } if (i + 1 < arr.length && arr[i + 1] !== null) { parent.right = new TreeNode(arr[i + 1]); q.push(parent.right); } } return root; }
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const arr = JSON.parse(input[0]);
    const k = parseInt(input[1]);
    const root = arrayToTree(arr);
    const result = kthSmallest(root, k);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys, json
from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_tree(arr: List[Optional[int]]) -> Optional[TreeNode]:
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root
# USER_CODE_PLACEHOLDER
try:
    lines = sys.stdin.read().strip().split('\\n')
    arr = json.loads(lines[0])
    k = int(lines[1])
    root = array_to_tree(arr)
    solver = Solution()
    result = solver.kthSmallest(root, k)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String treeLine = scanner.nextLine();
            int k = Integer.parseInt(scanner.nextLine());
            TreeNode root = arrayToTree(treeLine);
            Solution sol = new Solution();
            int result = sol.kthSmallest(root, k);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    private static TreeNode arrayToTree(String line) {
        String content = line.substring(1, line.length() - 1).trim();
        if (content.isEmpty() || content.equals("null")) return null;
        String[] nodes = content.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(nodes[0].trim()));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nodes.length) {
            TreeNode curr = q.poll();
            if (i < nodes.length && !nodes[i].trim().equals("null")) { curr.left = new TreeNode(Integer.parseInt(nodes[i].trim())); q.add(curr.left); }
            i++;
            if (i < nodes.length && !nodes[i].trim().equals("null")) { curr.right = new TreeNode(Integer.parseInt(nodes[i].trim())); q.add(curr.right); }
            i++;
        }
        return root;
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>

#ifndef TREENODE_DEFINITION
#define TREENODE_DEFINITION
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
#endif
// USER_CODE_PLACEHOLDER
TreeNode* arrayToTree(const std::string& line) { std::string content = line.substr(1, line.length() - 2); if(content.empty()) return nullptr; std::stringstream ss(content); std::string item; std::vector<TreeNode*> nodes; while(std::getline(ss, item, ',')) { if(item == "null") nodes.push_back(nullptr); else nodes.push_back(new TreeNode(stoi(item))); } if(nodes.empty() || !nodes[0]) return nullptr; TreeNode* root = nodes[0]; std::queue<TreeNode*> q; q.push(root); int i = 1; while(!q.empty() && i < nodes.size()) { TreeNode* curr = q.front(); q.pop(); if(curr) { if (i < nodes.size() && nodes[i]) { curr->left = nodes[i]; q.push(curr->left); } i++; if (i < nodes.size() && nodes[i]) { curr->right = nodes[i]; q.push(curr->right); } i++; } } return root; }
int main() {
    try {
        std::string treeLine, kLine;
        std::getline(std::cin, treeLine);
        std::getline(std::cin, kLine);
        TreeNode* root = arrayToTree(treeLine);
        int k = std::stoi(kLine);
        Solution sol;
        int result = sol.kthSmallest(root, k);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '44',
    title: 'Reorder List',
    slug: 'reorder-list',
    description: 'You are given the head of a singly linked-list. The list can be represented as: `L0 -> L1 -> ... -> Ln-1 -> Ln`\n\nReorder the list to be on the following form: `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...`\n\nYou may not modify the values in the list\'s nodes. Only nodes themselves may be changed.',
    tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
    constraints: `
- The number of nodes in the list is in the range [1, 5 * 10^4].
- 1 <= Node.val <= 1000`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'reorderList',
    inputSignature: [{ name: 'head', type: 'ListNode' }],
    testCases: [
      { Input: '[1,2,3,4]', Output: '[1,4,2,3]' },
      { Input: '[1,2,3,4,5]', Output: '[1,5,2,4,3]' },
      { Input: '[1]', Output: '[1]' },
      { Input: '[1,2]', Output: '[1,2]' },
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 * this.val = (val===undefined ? 0 : val)
 * this.next = (next===undefined ? null : next)
 * }
 */
var reorderList = function(head) {
    // Your code here
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
from typing import Optional

class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        """
        Do not return anything, modify head in-place instead.
        """
        # Your code here
        pass`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 * int val;
 * ListNode *next;
 * ListNode() : val(0), next(nullptr) {}
 * ListNode(int x) : val(x), next(nullptr) {}
 * ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    void reorderList(ListNode* head) {
        // Your code here
    }
};`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 * int val;
 * ListNode next;
 * ListNode() {}
 * ListNode(int val) { this.val = val; }
 * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public void reorderList(ListNode head) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
function arrayToLinkedList(arr) { if (!arr || arr.length === 0) return null; let head = new ListNode(arr[0]); let current = head; for (let i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; } return head; }
function linkedListToArray(head) { const arr = []; let current = head; while (current) { arr.push(current.val); current = current.next; } return arr; }
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const arr = JSON.parse(input);
    const head = arrayToLinkedList(arr);
    reorderList(head);
    const resultArray = linkedListToArray(head);
    console.log(JSON.stringify(resultArray));
} catch (e) {
    console.log('CAUGHT_ERROR: ' + e.message);
}`,
      python: `
import sys, json
from typing import Optional, List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def array_to_linked_list(arr: List[int]) -> Optional[ListNode]:
    if not arr: return None
    head = ListNode(arr[0])
    current = head
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
    return head

def linked_list_to_array(head: Optional[ListNode]) -> List[int]:
    arr = []
    current = head
    while current:
        arr.append(current.val)
        current = current.next
    return arr
# USER_CODE_PLACEHOLDER
try:
    arr = json.loads(sys.stdin.readline())
    head = array_to_linked_list(arr)
    solver = Solution()
    solver.reorderList(head)
    result_arr = linked_list_to_array(head)
    print(json.dumps(result_arr, separators=(',', ':')))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
      java: `
import java.util.*;
class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int[] arr = jsonArrayToIntArray(scanner.nextLine());
            ListNode head = arrayToLinkedList(arr);
            Solution sol = new Solution();
            sol.reorderList(head);
            System.out.println(linkedListToJsonArray(head));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    private static int[] jsonArrayToIntArray(String json) { String content = json.substring(1, json.length() - 1).trim(); if (content.isEmpty()) return new int[0]; String[] parts = content.split(","); int[] arr = new int[parts.length]; for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim()); return arr; }
    private static ListNode arrayToLinkedList(int[] arr) { if (arr == null || arr.length == 0) return null; ListNode head = new ListNode(arr[0]); ListNode current = head; for (int i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; } return head; }
    private static String linkedListToJsonArray(ListNode head) { if (head == null) return "[]"; StringBuilder sb = new StringBuilder("["); ListNode current = head; while (current != null) { sb.append(current.val); if (current.next != null) sb.append(','); current = current.next; } sb.append(']'); return sb.toString(); }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

#ifndef LISTNODE_DEFINITION
#define LISTNODE_DEFINITION
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};
#endif
// USER_CODE_PLACEHOLDER
std::vector<int> parseVector(const std::string& str) { std::vector<int> vec; if(str.length()<=2) return vec; std::string content = str.substr(1, str.length() - 2); std::stringstream ss(content); std::string item; while (std::getline(ss, item, ',')) vec.push_back(std::stoi(item)); return vec; }
ListNode* arrayToLinkedList(const std::vector<int>& arr) { if (arr.empty()) return nullptr; ListNode* head = new ListNode(arr[0]); ListNode* current = head; for (size_t i = 1; i < arr.size(); ++i) { current->next = new ListNode(arr[i]); current = current.next; } return head; }
void printList(ListNode* head) { if (!head) { std::cout << "[]" << std::endl; return; } std::cout << "["; ListNode* current = head; while (current) { std::cout << current->val; if (current->next) std::cout << ","; current = current->next; } std::cout << "]" << std::endl; }
int main() { 
    try { 
        std::string line; 
        std::getline(std::cin, line); 
        std::vector<int> arr = parseVector(line); 
        ListNode* head = arrayToLinkedList(arr); 
        Solution sol; 
        sol.reorderList(head); 
        printList(head); 
    } catch (const std::exception& e) { 
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl; 
    } 
    return 0; 
}`
    }
  },
  {
    id: '45',
    title: 'Sum of Two Integers',
    slug: 'sum-of-two-integers',
    description: 'Given two integers `a` and `b`, return the sum of the two integers without using the operators `+` and `-`.',
    tags: ['Bit Manipulation', 'Math'],
    constraints: `
- -1000 <= a, b <= 1000`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'getSum',
    inputSignature: [{ name: 'a', type: 'int' }, { name: 'b', type: 'int' }],
    testCases: [
      { Input: '1\n2', Output: '3' },
      { Input: '20\n30', Output: '50' },
      { Input: '-1\n1', Output: '0' },
      { Input: '-12\n-8', Output: '-20' },
      { Input: '0\n0', Output: '0' },
    ],
    starterCode: {
      javascript: `var getSum = function(a, b) {
    // Your code here
};`,
      python: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        # Your code here
        pass`,
      cpp: `class Solution {
public:
    int getSum(int a, int b) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int getSum(int a, int b) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const a = parseInt(input[0]);
    const b = parseInt(input[1]);
    const result = getSum(a, b);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    a = int(lines[0])
    b = int(lines[1])
    solver = Solution()
    result = solver.getSum(a, b)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            int a = Integer.parseInt(scanner.nextLine());
            int b = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            Solution sol = new Solution();
            int result = sol.getSum(a, b);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <string>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line1, line2;
        std::getline(std::cin, line1);
        std::getline(std::cin, line2);
        
        int a = std::stoi(line1);
        int b = std::stoi(line2);
        
        Solution solution;
        int result = solution.getSum(a, b);
        std::cout << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '46',
    title: 'Maximums in a Moving Subarray',
    slug: 'maximums-in-a-moving-subarray',
    description: 'Imagine a long sequence of sensor readings. You need to analyze this data through a moving viewport of a fixed size, `k`. As this viewport slides along the sequence from left to right, one reading at a time, your task is to find the highest reading within the viewport at each position. Return an array containing these maximum values for every position of the viewport.',
    tags: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Monotonic Queue'],
    constraints: `
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length`,
    difficulty: Difficulty.HARD,
    functionName: 'maxSlidingWindow',
    inputSignature: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
    testCases: [
      { Input: '[10,20,5,15,25]\n3', Output: '[20,20,25]' },
      { Input: '[8,7,6,5,4,3,2,1]\n2', Output: '[8,7,6,5,4,3,2]' },
      { Input: '[5]\n1', Output: '[5]' },
      { Input: '[9,8,10,7,11,6,12]\n4', Output: '[10,11,11,12]' },
    ],
    starterCode: {
      javascript: `var maxSlidingWindow = function(nums, k) {
    // Your code here
};`,
      python: `from typing import List
import collections

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        // Your code here
    }
};`,
      java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const nums = JSON.parse(input[0]);
    const k = parseInt(input[1]);
    const result = maxSlidingWindow(nums, k);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    nums = json.loads(lines[0])
    k = int(lines[1])
    solver = Solution()
    result = solver.maxSlidingWindow(nums, k)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String numsLine = scanner.nextLine();
            int k = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            String[] numsStr = numsLine.substring(1, numsLine.length() - 1).split(",");
            int[] nums = new int[numsStr.length == 1 && numsStr[0].isEmpty() ? 0 : numsStr.length];
            if (nums.length > 0) {
              for (int i = 0; i < numsStr.length; i++) {
                  nums[i] = Integer.parseInt(numsStr[i].trim());
              }
            }
            
            Solution sol = new Solution();
            int[] result = sol.maxSlidingWindow(nums, k);
            System.out.println(Arrays.toString(result).replaceAll("\\s", ""));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

std::vector<int> parseVector(const std::string& str) {
    std::vector<int> vec;
    if (str.length() <= 2) return vec;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return vec;
    std::stringstream ss(content);
    std::string item;
    while (std::getline(ss, item, ',')) {
        vec.push_back(std::stoi(item));
    }
    return vec;
}

int main() {
    try {
        std::string numsLine, kLine;
        std::getline(std::cin, numsLine);
        std::getline(std::cin, kLine);
        
        std::vector<int> nums = parseVector(numsLine);
        int k = std::stoi(kLine);
        
        Solution solution;
        std::vector<int> result = solution.maxSlidingWindow(nums, k);

        std::cout << "[";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << result[i] << (i == result.size() - 1 ? "" : ",");
        }
        std::cout << "]" << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '47',
    title: 'Target Sum with Reusable Numbers',
    slug: 'target-sum-with-reusable-numbers',
    description: 'You are given a set of distinct positive integers, which you can think of as coin denominations. You have an infinite supply of each coin type. Your goal is to find all the unique sets of coins that add up to a specific target amount. A set is considered unique if the count of at least one coin denomination is different. The order of coins within a set does not matter.',
    tags: ['Array', 'Backtracking'],
    constraints: `
- 1 <= candidates.length <= 30
- 2 <= candidates[i] <= 40
- All elements of candidates are distinct.
- 1 <= target <= 40`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'combinationSum',
    inputSignature: [{ name: 'candidates', type: 'int[]' }, { name: 'target', type: 'int' }],
    testCases: [
      { Input: '[3,4,5]\n11', Output: '[[3,3,5],[3,4,4]]' },
      { Input: '[8,3]\n10', Output: '[]' },
      { Input: '[5]\n15', Output: '[[5,5,5]]' },
      { Input: '[2,4,8]\n8', Output: '[[2,2,2,2],[2,2,4],[4,4],[8]]' },
    ],
    starterCode: {
      javascript: `var combinationSum = function(candidates, target) {
    // Your code here
};`,
      python: `from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        // Your code here
    }
};`,
      java: `import java.util.List;
import java.util.ArrayList;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const candidates = JSON.parse(input[0]);
    const target = parseInt(input[1]);
    let result = combinationSum(candidates, target);
    result.forEach(sub => sub.sort((a,b) => a-b));
    result.sort((a,b) => {
        for(let i=0; i<Math.min(a.length, b.length); i++){
            if(a[i] !== b[i]) return a[i]-b[i];
        }
        return a.length - b.length;
    });
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    candidates = json.loads(lines[0])
    target = int(lines[1])
    solver = Solution()
    result = solver.combinationSum(candidates, target)
    for r in result:
        r.sort()
    result.sort()
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String candidatesLine = scanner.nextLine();
            int target = Integer.parseInt(scanner.nextLine());
            scanner.close();

            String[] candidatesStr = candidatesLine.substring(1, candidatesLine.length() - 1).split(",");
            int[] candidates = new int[candidatesStr.length == 1 && candidatesStr[0].isEmpty() ? 0 : candidatesStr.length];
            if (candidates.length > 0) {
              for (int i = 0; i < candidatesStr.length; i++) {
                  candidates[i] = Integer.parseInt(candidatesStr[i].trim());
              }
            }
            
            Solution sol = new Solution();
            List<List<Integer>> result = sol.combinationSum(candidates, target);

            for (List<Integer> list : result) {
                Collections.sort(list);
            }
            result.sort((l1, l2) -> {
                for (int i = 0; i < Math.min(l1.size(), l2.size()); i++) {
                    int cmp = l1.get(i).compareTo(l2.get(i));
                    if (cmp != 0) return cmp;
                }
                return Integer.compare(l1.size(), l2.size());
            });

            System.out.println(result.toString().replaceAll("\\s", ""));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// USER_CODE_PLACEHOLDER

std::vector<int> parseVector(const std::string& str) {
    std::vector<int> vec;
    if (str.length() <= 2) return vec;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return vec;
    std::stringstream ss(content);
    std::string item;
    while (std::getline(ss, item, ',')) {
        vec.push_back(std::stoi(item));
    }
    return vec;
}

int main() {
    try {
        std::string candidatesLine, targetLine;
        std::getline(std::cin, candidatesLine);
        std::getline(std::cin, targetLine);
        
        std::vector<int> candidates = parseVector(candidatesLine);
        int target = std::stoi(targetLine);
        
        Solution solution;
        std::vector<std::vector<int>> result = solution.combinationSum(candidates, target);

        for(auto& v : result) {
            std::sort(v.begin(), v.end());
        }
        std::sort(result.begin(), result.end());
        
        std::cout << "[";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << "[";
            for (size_t j = 0; j < result[i].size(); ++j) {
                std::cout << result[i][j] << (j == result[i].size() - 1 ? "" : ",");
            }
            std::cout << "]" << (i == result.size() - 1 ? "" : ",");
        }
        std::cout << "]" << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '48',
    title: 'Signal Propagation Time',
    slug: 'signal-propagation-time',
    description: 'Consider a system of `n` interconnected servers, numbered from `1` to `n`. You\'re given a list of one-way connection times, where each entry `(u, v, w)` represents a signal taking `w` milliseconds to travel from server `u` to server `v`. A broadcast is initiated from a specific server, `k`. Determine the total time required for the signal to reach every server in the system. If at least one server is unreachable from the source, report this by returning -1.',
    tags: ['Graph', 'Heap (Priority Queue)', 'Shortest Path', 'Dijkstra'],
    constraints: `
- 1 <= k <= n <= 100
- 1 <= times.length <= 6000
- times[i].length == 3
- 1 <= u_i, v_i <= n
- 1 <= w_i <= 100
- All the pairs (u_i, v_i) are unique.`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'networkDelayTime',
    inputSignature: [{ name: 'times', type: 'int[][]' }, { name: 'n', type: 'int' }, { name: 'k', type: 'int' }],
    testCases: [
      { Input: '[[1,2,5],[2,3,2],[1,3,10]]\n3\n1', Output: '7' },
      { Input: '[[1,2,1]]\n3\n1', Output: '-1' },
      { Input: '[[1,2,1],[2,1,3]]\n2\n2', Output: '3' },
      { Input: '[[1,2,1],[2,3,1],[3,1,1]]\n3\n1', Output: '2' },
    ],
    starterCode: {
      javascript: `var networkDelayTime = function(times, n, k) {
    // Your code here
};`,
      python: `from typing import List
import heapq

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Your code here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const times = JSON.parse(input[0]);
    const n = parseInt(input[1]);
    const k = parseInt(input[2]);
    const result = networkDelayTime(times, n, k);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json
from typing import List

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    times = json.loads(lines[0])
    n = int(lines[1])
    k = int(lines[2])
    solver = Solution()
    result = solver.networkDelayTime(times, n, k)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String timesLine = scanner.nextLine();
            int n = Integer.parseInt(scanner.nextLine());
            int k = Integer.parseInt(scanner.nextLine());
            scanner.close();

            String[] pairs = timesLine.substring(2, timesLine.length() - 2).split("\\\\],\\\\[");
            int[][] times = new int[pairs.length][];
            if (timesLine.equals("[]")) {
                times = new int[0][0];
            } else {
                for (int i = 0; i < pairs.length; i++) {
                    String[] nums = pairs[i].split(",");
                    times[i] = new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim()), Integer.parseInt(nums[2].trim())};
                }
            }
            
            Solution sol = new Solution();
            int result = sol.networkDelayTime(times, n, k);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// USER_CODE_PLACEHOLDER

std::vector<std::vector<int>> parse2DVector(const std::string& str) {
    std::vector<std::vector<int>> result;
    if (str.length() <= 2) return result;
    std::string content = str.substr(1, str.length() - 2);
    if (content.empty()) return result;
    
    std::stringstream ss(content);
    std::string segment;
    while(std::getline(ss, segment, '[')) {
        size_t pos = segment.find(']');
        if(pos != std::string::npos) {
            segment = segment.substr(0, pos);
            std::stringstream ss2(segment);
            std::string item_str;
            std::vector<int> inner_vec;
            while(std::getline(ss2, item_str, ',')) {
                if(!item_str.empty()) inner_vec.push_back(std::stoi(item_str));
            }
            if(!inner_vec.empty()) result.push_back(inner_vec);
        }
    }
    return result;
}

int main() {
    try {
        std::string timesLine, nLine, kLine;
        std::getline(std::cin, timesLine);
        std::getline(std::cin, nLine);
        std::getline(std::cin, kLine);
        
        std::vector<std::vector<int>> times = parse2DVector(timesLine);
        int n = std::stoi(nLine);
        int k = std::stoi(kLine);
        
        Solution solution;
        int result = solution.networkDelayTime(times, n, k);
        std::cout << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  },
  {
    id: '49',
    title: 'Combine Multiple Sorted Linked Lists',
    slug: 'combine-multiple-sorted-linked-lists',
    description: 'You are tasked with consolidating data from multiple sources. Each source provides its data as a sorted singly linked list of integers. Your function will receive an array containing the head nodes of these `k` sorted lists. Produce a single, new sorted linked list that contains all the elements from the input lists in non-decreasing order.',
    tags: ['Linked List', 'Heap (Priority Queue)', 'Divide and Conquer', 'Merge Sort'],
    constraints: `
- k == lists.length
- 0 <= k <= 10^4
- 0 <= lists[i].length <= 500
- -10^4 <= lists[i][j] <= 10^4
- lists[i] is sorted in ascending order.
- The sum of lists[i].length will not exceed 10^4.`,
    difficulty: Difficulty.HARD,
    functionName: 'mergeKLists',
    inputSignature: [{ name: 'lists', type: 'ListNode[]' }],
    testCases: [
      { Input: '[[10,20],[15,25],[5,30]]', Output: '[5,10,15,20,25,30]' },
      { Input: '[[],[]]', Output: '[]' },
      { Input: '[]', Output: '[]' },
      { Input: '[[1,2,3],[],[4,5]]', Output: '[1,2,3,4,5]' },
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 * this.val = (val===undefined ? 0 : val)
 * this.next = (next===undefined ? null : next)
 * }
 */
var mergeKLists = function(lists) {
    // Your code here
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
from typing import List, Optional

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        # Your code here
        pass`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 * int val;
 * ListNode *next;
 * ListNode() : val(0), next(nullptr) {}
 * ListNode(int x) : val(x), next(nullptr) {}
 * ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Your code here
    }
};`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 * int val;
 * ListNode next;
 * ListNode() {}
 * ListNode(int val) { this.val = val; }
 * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
import java.util.PriorityQueue;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
function arrayToLinkedList(arr) { if (!arr || arr.length === 0) return null; let head = new ListNode(arr[0]); let current = head; for (let i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; } return head; }
function linkedListToArray(head) { const arr = []; let current = head; while (current) { arr.push(current.val); current = current.next; } return arr; }
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const arrays = JSON.parse(fs.readFileSync(0, 'utf-8').trim());
    const lists = arrays.map(arr => arrayToLinkedList(arr));
    const resultHead = mergeKLists(lists);
    const resultArray = linkedListToArray(resultHead);
    console.log(JSON.stringify(resultArray));
} catch (e) {
    console.log('CAUGHT_ERROR: ' + e.message);
}`,
      python: `
import sys, json
from typing import Optional, List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def array_to_linked_list(arr: List[int]) -> Optional[ListNode]:
    if not arr: return None
    head = ListNode(arr[0])
    current = head
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
    return head

def linked_list_to_array(head: Optional[ListNode]) -> List[int]:
    arr = []
    current = head
    while current:
        arr.append(current.val)
        current = current.next
    return arr
# USER_CODE_PLACEHOLDER
try:
    arrays = json.loads(sys.stdin.readline())
    lists = [array_to_linked_list(arr) for arr in arrays]
    solver = Solution()
    result_head = solver.mergeKLists(lists)
    result_arr = linked_list_to_array(result_head)
    print(json.dumps(result_arr, separators=(',', ':')))
except Exception as e:
    print(f'CAUGHT_ERROR: {e}')`,
      java: `
import java.util.*;
class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }
// USER_CODE_PLACEHOLDER
public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int[][] arrays = parse2DIntArray(scanner.nextLine());
            ListNode[] lists = new ListNode[arrays.length];
            for(int i=0; i<arrays.length; ++i) {
                lists[i] = arrayToLinkedList(arrays[i]);
            }
            Solution sol = new Solution();
            ListNode resultHead = sol.mergeKLists(lists);
            System.out.println(linkedListToJsonArray(resultHead));
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
    private static int[][] parse2DIntArray(String line) {
        line = line.substring(1, line.length() - 1).trim();
        if (line.isEmpty()) return new int[0][0];
        if (line.equals("[]")) return new int[][]{{}};
        String[] rows = line.substring(1, line.length() - 1).split("\\\\],\\\\[");
        int[][] result = new int[rows.length][];
        for(int i=0; i<rows.length; ++i) {
            String[] nums = rows[i].split(",");
            if(nums.length == 1 && nums[0].isEmpty()) {
                result[i] = new int[0];
                continue;
            }
            result[i] = new int[nums.length];
            for(int j=0; j<nums.length; ++j) {
                result[i][j] = Integer.parseInt(nums[j].trim());
            }
        }
        return result;
    }
    private static ListNode arrayToLinkedList(int[] arr) { if (arr == null || arr.length == 0) return null; ListNode head = new ListNode(arr[0]); ListNode current = head; for (int i = 1; i < arr.length; i++) { current.next = new ListNode(arr[i]); current = current.next; } return head; }
    private static String linkedListToJsonArray(ListNode head) { if (head == null) return "[]"; StringBuilder sb = new StringBuilder("["); ListNode current = head; while (current != null) { sb.append(current.val); if (current.next != null) sb.append(','); current = current.next; } sb.append(']'); return sb.toString(); }
}`,
      cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

#ifndef LISTNODE_DEFINITION
#define LISTNODE_DEFINITION
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
};
#endif
// USER_CODE_PLACEHOLDER
std::vector<std::vector<int>> parse2DVector(const std::string& str) { std::vector<std::vector<int>> result; if (str.length() <= 2) return result; std::string content = str.substr(1, str.length() - 2); if (content.empty()) { result.push_back({}); return result;} std::stringstream ss(content); std::string segment; while(std::getline(ss, segment, '[')) { size_t pos = segment.find(']'); if(pos != std::string::npos) { segment = segment.substr(0, pos); std::stringstream ss2(segment); std::string item_str; std::vector<int> inner_vec; while(std::getline(ss2, item_str, ',')) { if(!item_str.empty()) inner_vec.push_back(std::stoi(item_str)); } result.push_back(inner_vec); } } return result; }
ListNode* arrayToLinkedList(const std::vector<int>& arr) { if (arr.empty()) return nullptr; ListNode* head = new ListNode(arr[0]); ListNode* current = head; for (size_t i = 1; i < arr.size(); ++i) { current->next = new ListNode(arr[i]); current = current->next; } return head; }
void printList(ListNode* head) { if (!head) { std::cout << "[]" << std::endl; return; } std::cout << "["; ListNode* current = head; while (current) { std::cout << current->val; if (current->next) std::cout << ","; current = current.next; } std::cout << "]" << std::endl; }
int main() { 
    try { 
        std::string line; 
        std::getline(std::cin, line); 
        std::vector<std::vector<int>> arrays = parse2DVector(line);
        std::vector<ListNode*> lists;
        for(const auto& arr : arrays) {
            lists.push_back(arrayToLinkedList(arr));
        }
        Solution sol; 
        ListNode* result = sol.mergeKLists(lists); 
        printList(result); 
    } catch (const std::exception& e) { 
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl; 
    } 
    return 0; 
}`
    }
  },
  {
    id: '50',
    title: 'Robot Grid Traversal',
    slug: 'robot-grid-traversal',
    description: 'A small robot is placed on the top-left cell of a rectangular grid with `m` rows and `n` columns. The robot\'s objective is to reach the bottom-right cell. At any point, the robot is only allowed to move one step down or one step right. Calculate the total number of distinct paths the robot can take to get to its destination.',
    tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    constraints: `
- 1 <= m, n <= 100`,
    difficulty: Difficulty.MEDIUM,
    functionName: 'uniquePaths',
    inputSignature: [{ name: 'm', type: 'int' }, { name: 'n', type: 'int' }],
    testCases: [
      { Input: '3\n3', Output: '6' },
      { Input: '2\n2', Output: '2' },
      { Input: '1\n5', Output: '1' },
      { Input: '4\n4', Output: '20' },
      { Input: '3\n7', Output: '28' },
    ],
    starterCode: {
      javascript: `var uniquePaths = function(m, n) {
    // Your code here
};`,
      python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        // Your code here
    }
};`,
      java: `class Solution {
    public int uniquePaths(int m, int n) {
        // Your code here
    }
}`,
    },
    driverCode: {
      javascript: `
// USER_CODE_PLACEHOLDER
try {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const m = parseInt(input[0]);
    const n = parseInt(input[1]);
    const result = uniquePaths(m, n);
    console.log(JSON.stringify(result));
} catch (e) {
    console.log("CAUGHT_ERROR: " + e.message);
}`,
      python: `
import sys
import json

# USER_CODE_PLACEHOLDER

try:
    lines = sys.stdin.read().strip().split('\\n')
    m = int(lines[0])
    n = int(lines[1])
    solver = Solution()
    result = solver.uniquePaths(m, n)
    print(json.dumps(result))
except Exception as e:
    print(f"CAUGHT_ERROR: {e}")`,
      java: `
import java.util.*;

// USER_CODE_PLACEHOLDER

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            int m = Integer.parseInt(scanner.nextLine());
            int n = Integer.parseInt(scanner.nextLine());
            scanner.close();
            
            Solution sol = new Solution();
            int result = sol.uniquePaths(m, n);
            System.out.println(result);
        } catch (Exception e) {
            System.out.println("CAUGHT_ERROR: " + e.getMessage());
        }
    }
}`,
      cpp: `
#include <iostream>
#include <string>

// USER_CODE_PLACEHOLDER

int main() {
    try {
        std::string line1, line2;
        std::getline(std::cin, line1);
        std::getline(std::cin, line2);
        
        int m = std::stoi(line1);
        int n = std::stoi(line2);
        
        Solution solution;
        int result = solution.uniquePaths(m, n);
        std::cout << result << std::endl;

    } catch (const std::exception& e) {
        std::cout << "CAUGHT_ERROR: " << e.what() << std::endl;
    }
    return 0;
}`
    }
  }

  

    
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
