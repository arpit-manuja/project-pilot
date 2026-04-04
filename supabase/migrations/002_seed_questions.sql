-- ============================================================
-- Seed: 30 starter questions
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run (upserts on id)
-- ============================================================

insert into public.questions (id, topic_id, title, difficulty, tags, description, hint, solution) values

-- ── DSA ──────────────────────────────────────────────────────────────────────
('dsa-1','dsa','Two Sum','easy',array['array','hash map'],
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution and you may not use the same element twice.',
'Use a hash map to store each number''s index as you iterate. For each element, check if target - element already exists in the map.',
E'// O(n) time, O(n) space\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'),

('dsa-2','dsa','Reverse a Linked List','easy',array['linked list','pointers'],
'Given the head of a singly linked list, reverse the list and return the reversed list''s head.',
'Use three pointers: prev, curr, and next. Iterate through the list, reversing each link as you go.',
E'// O(n) time, O(1) space\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}'),

('dsa-3','dsa','Valid Parentheses','easy',array['stack','string'],
'Given a string s containing only (, ), {, }, [, ], determine if the input string is valid. Every open bracket must be closed by the same type in the correct order.',
'Use a stack. Push opening brackets. For closing brackets, check if the top of the stack is the matching opening bracket.',
E'// O(n) time\nfunction isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (const ch of s) {\n    if ("({[".includes(ch)) stack.push(ch);\n    else if (stack.pop() !== map[ch]) return false;\n  }\n  return stack.length === 0;\n}'),

('dsa-4','dsa','Binary Search','easy',array['binary search','array'],
'Given an array of integers nums sorted in ascending order and a target value, return the index of target if it exists, otherwise return -1. Must run in O(log n).',
'Maintain left and right pointers. Compare the mid element with target and discard half the array each iteration.',
E'// O(log n) time, O(1) space\nfunction search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}'),

('dsa-5','dsa','Maximum Subarray (Kadane''s Algorithm)','medium',array['array','dynamic programming'],
'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
'Keep track of the current running sum. If it drops below 0, reset it. Track the maximum seen so far.',
E'// O(n) time, O(1) space\nfunction maxSubArray(nums) {\n  let maxSum = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    maxSum = Math.max(maxSum, curr);\n  }\n  return maxSum;\n}'),

('dsa-6','dsa','Merge Two Sorted Lists','easy',array['linked list','recursion'],
'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
'Compare the heads of both lists. Pick the smaller one and recursively merge the rest.',
E'// O(n+m) time\nfunction mergeTwoLists(l1, l2) {\n  if (!l1) return l2;\n  if (!l2) return l1;\n  if (l1.val <= l2.val) { l1.next = mergeTwoLists(l1.next, l2); return l1; }\n  l2.next = mergeTwoLists(l1, l2.next);\n  return l2;\n}'),

('dsa-7','dsa','Climbing Stairs','easy',array['dynamic programming','fibonacci'],
'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
'This is a Fibonacci sequence problem. ways(n) = ways(n-1) + ways(n-2).',
E'// O(n) time, O(1) space\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}'),

('dsa-8','dsa','Level Order Traversal (BFS)','medium',array['tree','BFS','queue'],
'Given the root of a binary tree, return the level order traversal of its nodes'' values (left to right, level by level).',
'Use a queue. Enqueue the root, then for each level process all nodes currently in the queue and enqueue their children.',
E'// O(n) time\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length) {\n    const level = [], size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}'),

('dsa-9','dsa','Number of Islands','medium',array['graph','DFS','matrix'],
'Given an m x n 2D binary grid where 1 represents land and 0 represents water, return the number of islands.',
'Use DFS. When you find a 1, increment the count, then flood-fill all connected land cells.',
E'// O(m*n) time\nfunction numIslands(grid) {\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  for (let r = 0; r < grid.length; r++)\n    for (let c = 0; c < grid[0].length; c++)\n      if (grid[r][c] === "1") { count++; dfs(r, c); }\n  return count;\n}'),

('dsa-10','dsa','Longest Common Subsequence','hard',array['dynamic programming','string'],
'Given two strings text1 and text2, return the length of their longest common subsequence.',
'Use a 2D DP table. If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
E'// O(m*n) time and space\nfunction longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m+1 }, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}'),

-- ── CS Fundamentals ───────────────────────────────────────────────────────────
('cs-1','cs-fundamentals','What are the 4 pillars of OOP?','easy',array['OOP','concepts'],
'Explain the four fundamental principles of Object-Oriented Programming with a real-world example for each.',
'Think: Encapsulation, Abstraction, Inheritance, Polymorphism.',
E'1. Encapsulation - Bundling data and methods in a class, hiding internal state.\n2. Abstraction - Hiding complexity, showing only essentials.\n3. Inheritance - A child class inherits properties/methods from a parent.\n4. Polymorphism - Same method behaves differently for different objects.'),

('cs-2','cs-fundamentals','Stack vs Heap Memory','easy',array['memory','runtime'],
'Explain the difference between Stack and Heap memory. When is each used and what are the implications?',
'Think about scope, size, speed, and who manages each.',
E'Stack: stores local variables, auto-managed (LIFO), fast, fixed size.\nHeap: dynamically allocated objects, managed by GC or manually, flexible size, shared across threads.'),

('cs-3','cs-fundamentals','Process vs Thread','easy',array['OS','concurrency'],
'What is the difference between a Process and a Thread? When would you use one over the other?',
'Think about memory sharing, isolation, and overhead.',
E'Process: independent program, own memory, high isolation, expensive context switch.\nThread: lightweight unit within a process, shares memory, faster but risks race conditions.'),

('cs-4','cs-fundamentals','What is a Deadlock? How do you prevent it?','medium',array['OS','concurrency','deadlock'],
'Define deadlock. Explain the four Coffman conditions. Describe at least two prevention strategies.',
'Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
E'Deadlock: threads blocked forever, each waiting for a resource held by the other.\nCoffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.\nPrevention: always acquire locks in a fixed order; use tryLock with timeouts.'),

('cs-5','cs-fundamentals','What is Big O Notation?','easy',array['complexity','algorithms'],
'Explain Big O notation. List the most common complexities from best to worst with an example of each.',
'Big O describes the worst-case growth rate of time/space as input size n grows.',
E'O(1) - Constant: array index access\nO(log n) - Binary search\nO(n) - Linear scan\nO(n log n) - Merge sort\nO(n^2) - Nested loops\nO(2^n) - Recursive Fibonacci\nRule: drop constants and lower-order terms.'),

-- ── System Design ─────────────────────────────────────────────────────────────
('sd-1','system-design','Design a URL Shortener (like bit.ly)','medium',array['system design','hashing','database'],
'Design a URL shortening service that takes a long URL and returns a short one, redirects users, handles millions of requests per day, and optionally tracks analytics.',
'Think about: API design, URL generation (hash vs counter), database schema, caching, and scalability.',
E'API: POST /shorten -> shortUrl, GET /{code} -> 301 redirect\nURL Generation: Base62 encode auto-increment ID (6 chars = 56B unique URLs)\nDB: urls(id, short_code, long_url, created_at, clicks)\nCache: Redis for popular short_code -> long_url mappings\nScale: stateless API servers, read replicas, CDN'),

('sd-2','system-design','Design a Rate Limiter','medium',array['system design','algorithms','API'],
'Design a rate limiter that restricts users to N requests per time window. Discuss different algorithms and how you would implement it at scale.',
'Consider: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log.',
E'Algorithms: Token Bucket (allows bursting), Fixed Window Counter (simple), Sliding Window Log (accurate), Leaky Bucket (constant rate).\nImplementation: Redis INCR + EXPIRE for counters. Lua scripts for atomic check-and-increment.\nReturn 429 with Retry-After header when limit exceeded.'),

('sd-3','system-design','Design a Notification System','hard',array['system design','messaging','push notifications'],
'Design a scalable notification system that sends push, email, and SMS to millions of users with delivery guarantees and user preference filtering.',
'Think about decoupling producers and consumers using message queues. Consider retry logic and deduplication.',
E'Components: API Service -> Message Queue (Kafka) -> Workers (push/email/SMS) -> 3rd Party (FCM/SendGrid/Twilio)\nReliability: retry with exponential backoff, idempotency keys, delivery status in DB\nScale: partition Kafka by user_id, horizontal scaling of workers'),

-- ── Behavioral ───────────────────────────────────────────────────────────────
('beh-1','behavioral','Tell me about yourself','easy',array['introduction','HR'],
'Give a structured, concise answer covering your background, key experience, and why you are interested in this role.',
'Structure: Present -> Past -> Future. Keep it to 90 seconds. End by connecting to the role.',
E'Present: I am currently a [role] at [company], where I [key responsibility].\nPast: Before that, I [relevant experience].\nFuture: I am excited about this role because [specific reason tied to company/role].'),

('beh-2','behavioral','Describe a challenging project and how you handled it','medium',array['STAR method','problem solving'],
'Use the STAR method (Situation, Task, Action, Result) to describe a difficult project and how you overcame the challenges.',
'Choose a story where YOU made a real impact. Quantify the result if possible.',
E'Situation: Set context briefly.\nTask: Your specific responsibility.\nAction: Steps YOU took (most important part).\nResult: Quantify the outcome (e.g., reduced load time by 40%).'),

('beh-3','behavioral','How do you handle disagreements with teammates?','easy',array['teamwork','conflict resolution'],
'Show that you can work collaboratively, handle conflict professionally, and arrive at good outcomes even during disagreement.',
'Show that you listen first, focus on data over opinions, and prioritize the team goal over being right.',
E'Key principles: active listening, data-driven discussion, find common ground, know when to escalate.\nAnchor disagreements to concrete requirements rather than personal preferences.'),

('beh-4','behavioral','Where do you see yourself in 5 years?','easy',array['career goals','HR'],
'This question tests your ambition, self-awareness, and whether your goals align with what the company can offer.',
'Be honest but strategic. Show ambition without seeming like you will leave in 6 months.',
E'In 5 years, I see myself having grown from a strong IC into someone who can lead technical projects and mentor junior developers. I want to develop deep expertise in [domain] and eventually own the architecture of critical product features.'),

-- ── Frontend ──────────────────────────────────────────────────────────────────
('fe-1','frontend','Explain the Virtual DOM','easy',array['React','DOM','performance'],
'What is the Virtual DOM? How does React use it to update the UI efficiently? What is the reconciliation process?',
'Compare Virtual DOM to the real DOM. Think about why direct DOM manipulation is expensive.',
E'Virtual DOM: lightweight JS object representation of the real DOM kept in memory.\nFlow: state change -> new VDOM tree -> diff with previous tree (reconciliation) -> apply minimum changes to real DOM.\nResult: fewer real DOM operations = better performance.'),

('fe-2','frontend','What is CSS Box Model?','easy',array['CSS','layout'],
'Explain the CSS Box Model, its components, and the difference between box-sizing: content-box and border-box.',
'Every HTML element is a rectangular box with 4 layers.',
E'Layers (inside out): Content, Padding, Border, Margin.\ncontent-box (default): total width = content + padding + border + margin.\nborder-box: total width = set width (padding and border included inside).\nBest practice: always use box-sizing: border-box globally.'),

-- ── Backend ───────────────────────────────────────────────────────────────────
('be-1','backend','REST vs GraphQL','medium',array['API','REST','GraphQL'],
'Compare REST and GraphQL APIs. What are the key differences? When would you choose one over the other?',
'Think about over-fetching, under-fetching, versioning, and use cases.',
E'REST: multiple endpoints, fixed data shape, HTTP caching works naturally, great for public APIs.\nGraphQL: single endpoint, client specifies exact data needed, no over/under-fetching, harder to cache.\nChoose REST for simple CRUD and public APIs. Choose GraphQL for complex UIs and mobile apps.'),

('be-2','backend','What is JWT and how does it work?','easy',array['authentication','JWT','security'],
'Explain what a JSON Web Token is, its structure, and how it is used for authentication. What are its advantages and risks?',
'JWT has 3 parts separated by dots. Think about stateless auth.',
E'Structure: header.payload.signature (Base64-encoded)\nFlow: login -> server creates JWT signed with secret -> client stores it -> sends in Authorization header -> server verifies without DB lookup.\nRisks: cannot invalidate before expiry; never store sensitive data in payload; prefer httpOnly cookies over localStorage.'),

-- ── Database ──────────────────────────────────────────────────────────────────
('db-1','database','Find employees earning above average salary','easy',array['SQL','subquery','aggregate'],
'Given an employees table with columns id, name, department, salary, write a SQL query to find all employees whose salary is above the company average.',
'Use a subquery with AVG() in the WHERE clause.',
E'SELECT id, name, department, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;'),

('db-2','database','What is Database Indexing?','medium',array['database','performance','indexing'],
'Explain what database indexes are, how they work internally, and the trade-offs. When should you add an index?',
'Think of an index like a book table of contents. What data structure is typically used?',
E'Index: B-Tree data structure storing sorted copy of columns with pointers to rows.\nWithout index: O(n) full scan. With index: O(log n) B-Tree lookup.\nAdd when: frequently used in WHERE, JOIN, ORDER BY, high cardinality columns.\nAvoid when: small tables, low cardinality (e.g. boolean), rarely queried columns.'),

-- ── OS ────────────────────────────────────────────────────────────────────────
('os-1','os','What is Virtual Memory?','medium',array['OS','memory','paging'],
'Explain virtual memory. Why does it exist? What is paging? What happens during a page fault?',
'Think about how an OS lets programs use more memory than physically available.',
E'Virtual Memory: gives each process illusion of its own large private address space.\nPaging: physical memory divided into frames; virtual memory divided into pages; OS maintains page table mapping.\nPage Fault: process accesses page not in RAM -> OS loads it from disk -> updates page table -> resumes process.\nToo many page faults = thrashing.'),

-- ── Networking ───────────────────────────────────────────────────────────────
('net-1','networking','What happens when you type a URL in a browser?','medium',array['networking','HTTP','DNS'],
'Describe the complete sequence of events from typing https://www.google.com to the page being rendered.',
'Cover: DNS resolution, TCP connection, TLS handshake, HTTP request/response, rendering.',
E'1. URL Parsing\n2. DNS Resolution (cache -> OS -> resolver -> root NS -> TLD -> domain NS)\n3. TCP 3-way handshake (SYN, SYN-ACK, ACK)\n4. TLS handshake\n5. HTTP GET request\n6. Server processes and returns 200 OK with HTML\n7. Browser builds DOM + CSSOM -> Render tree -> Layout -> Paint\n8. Sub-resources fetched (CSS, JS, images)')

on conflict (id) do update set
  title       = excluded.title,
  description = excluded.description,
  hint        = excluded.hint,
  solution    = excluded.solution,
  difficulty  = excluded.difficulty,
  tags        = excluded.tags;
