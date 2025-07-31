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
          { Input: '"A man, a plan, a canal: Panama"', Output: 'true' },
          { Input: '"race a car"', Output: 'false' },
          { Input: '""', Output: 'true' },
          { Input: '".,"', Output: 'true' },
          { Input: '"0P"', Output: 'false' },
          { Input: '"Was it a car or a cat I saw?"', Output: 'true' },
          { Input: '"level"', Output: 'true' },
          { Input: '"hello"', Output: 'false' },
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

}
    // Add more problems here to reach 90-100 by following the pattern
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
