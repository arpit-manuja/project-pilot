import { TopicId } from "./types";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  topicId: TopicId;
  title: string;
  description: string;
  hint?: string;
  solution: string;
  difficulty: Difficulty;
  tags: string[];
}

export const QUESTIONS: Question[] = [

  // ─── DSA ───────────────────────────────────────────────────────────────────
  {
    id: "dsa-1",
    topicId: "dsa",
    title: "Two Sum",
    difficulty: "easy",
    tags: ["array", "hash map"],
    description:
      "Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to target. You may assume that each input has exactly one solution and you may not use the same element twice.",
    hint: "Use a hash map to store each number's index as you iterate. For each element, check if `target - element` already exists in the map.",
    solution: `// O(n) time, O(n) space
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    id: "dsa-2",
    topicId: "dsa",
    title: "Reverse a Linked List",
    difficulty: "easy",
    tags: ["linked list", "pointers"],
    description:
      "Given the head of a singly linked list, reverse the list and return the reversed list's head.",
    hint: "Use three pointers: prev, curr, and next. Iterate through the list, reversing each link as you go.",
    solution: `// O(n) time, O(1) space
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
  },
  {
    id: "dsa-3",
    topicId: "dsa",
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["stack", "string"],
    description:
      "Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. A string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    hint: "Use a stack. Push opening brackets. For closing brackets, check if the top of the stack is the matching opening bracket.",
    solution: `// O(n) time, O(n) space
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if ('({['.includes(ch)) stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}`,
  },
  {
    id: "dsa-4",
    topicId: "dsa",
    title: "Binary Search",
    difficulty: "easy",
    tags: ["binary search", "array"],
    description:
      "Given an array of integers `nums` sorted in ascending order, and a `target` value, return the index of `target` if it exists, otherwise return `-1`. You must write an algorithm with O(log n) runtime.",
    hint: "Maintain `left` and `right` pointers. Compare `mid` element with target and discard half the array each iteration.",
    solution: `// O(log n) time, O(1) space
function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  },
  {
    id: "dsa-5",
    topicId: "dsa",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "medium",
    tags: ["array", "dynamic programming"],
    description:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the **largest sum** and return its sum.",
    hint: "Keep track of the current running sum. If it drops below 0, reset it to 0. Track the maximum seen so far.",
    solution: `// O(n) time, O(1) space
function maxSubArray(nums) {
  let maxSum = nums[0];
  let curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSum = Math.max(maxSum, curr);
  }
  return maxSum;
}`,
  },
  {
    id: "dsa-6",
    topicId: "dsa",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    tags: ["linked list", "recursion"],
    description:
      "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    hint: "Compare the heads of both lists. Pick the smaller one and recursively merge the rest.",
    solution: `// O(n+m) time
function mergeTwoLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  }
  l2.next = mergeTwoLists(l1, l2.next);
  return l2;
}`,
  },
  {
    id: "dsa-7",
    topicId: "dsa",
    title: "Climbing Stairs",
    difficulty: "easy",
    tags: ["dynamic programming", "fibonacci"],
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    hint: "This is a Fibonacci sequence problem. ways(n) = ways(n-1) + ways(n-2).",
    solution: `// O(n) time, O(1) space
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
  },
  {
    id: "dsa-8",
    topicId: "dsa",
    title: "Level Order Traversal (BFS)",
    difficulty: "medium",
    tags: ["tree", "BFS", "queue"],
    description:
      "Given the root of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).",
    hint: "Use a queue. Enqueue the root, then for each level process all nodes currently in the queue and enqueue their children.",
    solution: `// O(n) time
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
  },
  {
    id: "dsa-9",
    topicId: "dsa",
    title: "Number of Islands",
    difficulty: "medium",
    tags: ["graph", "DFS", "BFS", "matrix"],
    description:
      "Given an `m x n` 2D binary grid where `'1'` represents land and `'0'` represents water, return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    hint: "Use DFS. When you find a '1', increment the count, then flood-fill (mark as visited) all connected land cells.",
    solution: `// O(m*n) time
function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark visited
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}`,
  },
  {
    id: "dsa-10",
    topicId: "dsa",
    title: "Longest Common Subsequence",
    difficulty: "hard",
    tags: ["dynamic programming", "string"],
    description:
      "Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is a sequence derived from another sequence by deleting some elements without changing the order of the remaining elements.",
    hint: "Use a 2D DP table. If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    solution: `// O(m*n) time and space
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m+1 }, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = text1[i-1] === text2[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}`,
  },

  // ─── CS Fundamentals ───────────────────────────────────────────────────────
  {
    id: "cs-1",
    topicId: "cs-fundamentals",
    title: "What are the 4 pillars of OOP?",
    difficulty: "easy",
    tags: ["OOP", "concepts"],
    description:
      "Explain the four fundamental principles of Object-Oriented Programming with a real-world example for each.",
    hint: "Think: Encapsulation, Abstraction, Inheritance, Polymorphism.",
    solution: `**1. Encapsulation** – Bundling data and methods in a class, hiding internal state. E.g., a BankAccount class hides balance and exposes deposit/withdraw methods.

**2. Abstraction** – Hiding complexity, showing only essentials. E.g., a Car class exposes drive() without exposing engine internals.

**3. Inheritance** – A child class inherits properties/methods from a parent. E.g., Dog extends Animal, inheriting eat() and sleep().

**4. Polymorphism** – Same method behaves differently for different objects. E.g., shape.draw() works for Circle, Square, Triangle each drawing differently.`,
  },
  {
    id: "cs-2",
    topicId: "cs-fundamentals",
    title: "Stack vs Heap Memory",
    difficulty: "easy",
    tags: ["memory", "runtime"],
    description:
      "Explain the difference between Stack and Heap memory. When is each used and what are the implications?",
    hint: "Think about scope, size, speed, and who manages each.",
    solution: `**Stack:**
- Stores local variables and function call frames
- Memory is automatically allocated/freed (LIFO)
- Fast access, fixed size, limited space
- Each thread has its own stack

**Heap:**
- Stores dynamically allocated objects (new, malloc)
- Managed by GC (Java/Python) or manually (C/C++)
- Slower, large, flexible size
- Shared across threads (needs synchronization)

**Key difference:** Stack is auto-managed and fast; Heap is flexible but can cause memory leaks if not handled properly.`,
  },
  {
    id: "cs-3",
    topicId: "cs-fundamentals",
    title: "Process vs Thread",
    difficulty: "easy",
    tags: ["OS", "concurrency"],
    description:
      "What is the difference between a Process and a Thread? When would you use one over the other?",
    hint: "Think about memory sharing, isolation, and overhead.",
    solution: `**Process:**
- Independent program with its own memory space
- Isolated — one crash doesn't affect others
- Higher overhead (context switching is expensive)
- Communication via IPC (pipes, sockets)

**Thread:**
- Lightweight unit within a process
- Shares memory with other threads in the same process
- Lower overhead, faster context switch
- Risk: race conditions, deadlocks

**Use Process when:** isolation and security matter (e.g., browser tabs).
**Use Thread when:** performance matters and shared memory is needed (e.g., web servers).`,
  },
  {
    id: "cs-4",
    topicId: "cs-fundamentals",
    title: "What is a Deadlock? How do you prevent it?",
    difficulty: "medium",
    tags: ["OS", "concurrency", "deadlock"],
    description:
      "Define deadlock. Explain the four Coffman conditions required for deadlock. Describe at least two prevention strategies.",
    hint: "Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
    solution: `**Deadlock:** Two or more threads are blocked forever, each waiting for a resource held by the other.

**Coffman Conditions (all 4 must hold):**
1. Mutual Exclusion – resources can't be shared
2. Hold and Wait – thread holds one resource while waiting for another
3. No Preemption – resources can't be forcibly taken
4. Circular Wait – circular chain of threads each waiting on the next

**Prevention Strategies:**
- **Break Circular Wait:** Always acquire locks in a fixed global order
- **Break Hold and Wait:** Acquire all needed resources at once or release before acquiring new ones
- **Timeouts:** Use tryLock with timeout — if it fails, release all and retry
- **Banker's Algorithm:** Proactively check if granting a resource leads to unsafe state`,
  },
  {
    id: "cs-5",
    topicId: "cs-fundamentals",
    title: "What is Big O Notation?",
    difficulty: "easy",
    tags: ["complexity", "algorithms"],
    description:
      "Explain Big O notation. What does it measure? List the most common complexities from best to worst with an example of each.",
    hint: "Big O describes the worst-case growth rate of time/space as input size n grows.",
    solution: `**Big O** describes how the runtime (or space) of an algorithm grows as the input size n increases — always the worst case.

| Complexity | Name | Example |
|---|---|---|
| O(1) | Constant | Array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Loop through array |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Nested loops |
| O(2ⁿ) | Exponential | Recursive Fibonacci |
| O(n!) | Factorial | Travelling salesman brute force |

**Rule of thumb:** Drop constants and lower-order terms. O(2n + 5) → O(n).`,
  },

  // ─── System Design ─────────────────────────────────────────────────────────
  {
    id: "sd-1",
    topicId: "system-design",
    title: "Design a URL Shortener (like bit.ly)",
    difficulty: "medium",
    tags: ["system design", "hashing", "database"],
    description:
      "Design a URL shortening service. It should: (1) take a long URL and return a short one, (2) redirect users from the short URL to the original, (3) handle millions of requests per day, (4) optionally track click analytics.",
    hint: "Think about: API design, URL generation (hash vs counter), database schema, caching, and scalability.",
    solution: `**Requirements:**
- Functional: shorten URL, redirect, analytics
- Non-functional: low latency, high availability, scalable

**API Design:**
- POST /shorten { longUrl } → { shortUrl }
- GET /{shortCode} → 301 redirect to longUrl

**URL Generation:**
- Use Base62 encoding of an auto-increment ID (a-z, A-Z, 0-9)
- 6 chars = 62^6 ≈ 56 billion unique URLs

**Database Schema:**
- Table: urls(id BIGINT PK, short_code VARCHAR(8), long_url TEXT, created_at, user_id, clicks)

**Caching:**
- Cache popular short_code → long_url mappings in Redis
- 80/20 rule: 20% URLs = 80% traffic

**Scalability:**
- Stateless API servers behind load balancer
- Read replicas for DB
- CDN for serving redirects globally`,
  },
  {
    id: "sd-2",
    topicId: "system-design",
    title: "Design a Rate Limiter",
    difficulty: "medium",
    tags: ["system design", "algorithms", "API"],
    description:
      "Design a rate limiter that restricts users to N requests per time window. Discuss different algorithms and how you'd implement it at scale.",
    hint: "Consider: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log.",
    solution: `**Purpose:** Protect APIs from abuse and overload.

**Algorithms:**
1. **Token Bucket** – Tokens refill at fixed rate. Request consumes a token. Allows bursting. Most popular.
2. **Fixed Window Counter** – Count requests per window (e.g., per minute). Simple but edge-case issue at window boundary.
3. **Sliding Window Log** – Store timestamps of requests. More accurate, more memory.
4. **Leaky Bucket** – Requests processed at constant rate, excess queued or dropped.

**Implementation at Scale:**
- Store counters in Redis (atomic INCR + EXPIRE)
- Use Lua scripts for atomic check-and-increment
- Redis key: "rate:userId:windowTimestamp"

**Response:** Return 429 Too Many Requests with Retry-After header when limit exceeded.`,
  },
  {
    id: "sd-3",
    topicId: "system-design",
    title: "Design a Notification System",
    difficulty: "hard",
    tags: ["system design", "messaging", "push notifications"],
    description:
      "Design a scalable notification system that sends push, email, and SMS notifications to millions of users. It should handle different notification types, user preferences, and delivery guarantees.",
    hint: "Think about decoupling producers and consumers using message queues. Consider retry logic, deduplication, and user preference filtering.",
    solution: `**Components:**
1. **API Service** – Accepts notification requests from internal services
2. **Message Queue (Kafka/SQS)** – Decouples producers from consumers, handles spikes
3. **Notification Workers** – One per channel (push, email, SMS)
4. **Third-party Services** – FCM (push), SendGrid (email), Twilio (SMS)
5. **User Preference Store** – Redis/DB to check if user opted out

**Flow:**
Event → API → Queue → Worker → Check User Prefs → 3rd Party Provider → Delivery

**Reliability:**
- Retry failed deliveries with exponential backoff
- Store notification status in DB (sent, failed, delivered)
- Idempotency keys to prevent duplicate sends

**Scale:**
- Partition Kafka by user_id for ordering guarantees
- Horizontal scaling of workers per channel`,
  },

  // ─── Behavioral ────────────────────────────────────────────────────────────
  {
    id: "beh-1",
    topicId: "behavioral",
    title: "Tell me about yourself",
    difficulty: "easy",
    tags: ["introduction", "HR"],
    description:
      "This is typically the first question in any interview. Give a structured, concise answer that covers your background, key experience, and why you're interested in this role.",
    hint: "Structure: Present → Past → Future. Keep it to 90 seconds. End by connecting to the role you're applying for.",
    solution: `**Structure (Present → Past → Future):**

**Present:** Start with your current role/status.
"I'm currently a [role] at [company/college], where I [key responsibility/achievement]."

**Past:** Briefly mention relevant past experience.
"Before that, I [key project/role that's relevant]."

**Future:** Connect to the role you're interviewing for.
"I'm excited about this role because [specific reason tied to company/role]."

**Example for freshers:**
"I'm a final-year CS student at XYZ College, currently building a full-stack e-commerce app using React and Node.js. My internship at ABC Corp gave me hands-on experience with REST APIs and agile workflows. I'm excited about this role because I want to work on large-scale systems with an experienced team."`,
  },
  {
    id: "beh-2",
    topicId: "behavioral",
    title: "Describe a challenging project and how you handled it",
    difficulty: "medium",
    tags: ["STAR method", "problem solving"],
    description:
      "Use the STAR method (Situation, Task, Action, Result) to describe a difficult technical or team project and how you overcame the challenges.",
    hint: "Choose a story where YOU made a real impact. Quantify the result if possible (e.g., reduced load time by 40%).",
    solution: `**STAR Framework:**

**Situation:** Set the context briefly (1-2 sentences).
"During my internship, our team had to migrate a monolithic app to microservices in 6 weeks before a major product launch."

**Task:** What was your specific responsibility?
"I was responsible for breaking out the authentication service and ensuring zero downtime during migration."

**Action:** What steps did YOU take? (This is the most important part)
"I first mapped all auth-related endpoints, wrote a strangler fig pattern to route traffic gradually, set up feature flags for rollback, and wrote comprehensive integration tests."

**Result:** Quantify the outcome.
"We successfully migrated with 0 downtime, and the new service handled 3x the previous load. The team adopted my feature-flag approach for all subsequent migrations."`,
  },
  {
    id: "beh-3",
    topicId: "behavioral",
    title: "How do you handle disagreements with teammates?",
    difficulty: "easy",
    tags: ["teamwork", "conflict resolution"],
    description:
      "Interviewers want to see that you can work collaboratively, handle conflict professionally, and arrive at good outcomes even when there's disagreement.",
    hint: "Show that you listen first, focus on data/facts over opinions, and always prioritize the team's goal over being right.",
    solution: `**Key principles to demonstrate:**
1. Active listening — understand their point fully before responding
2. Data-driven discussion — present facts, not just opinions
3. Find common ground — focus on shared goals
4. Know when to escalate — involve a manager if stuck

**Sample Answer (STAR):**
"In a project, my teammate and I disagreed on whether to use REST or GraphQL for our API. I advocated for REST for simplicity, they preferred GraphQL for flexibility.

Instead of debating, I suggested we both write a brief technical doc outlining pros/cons for our specific use case, then review together. Looking at our requirements objectively — simple CRUD operations, no complex nested queries — REST was clearly the better fit. My teammate agreed once we evaluated against actual needs, not preferences.

I've learned that most technical disagreements resolve themselves when you anchor the discussion to concrete requirements."`,
  },
  {
    id: "beh-4",
    topicId: "behavioral",
    title: "Where do you see yourself in 5 years?",
    difficulty: "easy",
    tags: ["career goals", "HR"],
    description:
      "This question tests your ambition, self-awareness, and whether your goals align with what the company can offer.",
    hint: "Be honest but strategic. Show ambition without seeming like you'll leave in 6 months. Tie your growth to the company's growth.",
    solution: `**What interviewers want to hear:**
- You have a clear sense of direction
- You're ambitious but realistic
- Your goals align with what this role can offer
- You're planning to grow *with* the company

**Sample Answer:**
"In 5 years, I see myself having grown from a strong individual contributor into someone who can lead technical projects and mentor junior developers. I want to develop deep expertise in distributed systems and eventually own the architecture of critical product features.

I'm particularly drawn to this company because of your investment in engineering excellence and the scale of the problems you're solving. I believe the challenges here will give me the breadth of experience I need to reach those goals."

**Avoid saying:**
- "I want to start my own company" (signals you'll leave)
- "I'm not sure" (signals no ambition)
- "I want your job" (awkward)`,
  },

  // ─── Frontend ──────────────────────────────────────────────────────────────
  {
    id: "fe-1",
    topicId: "frontend",
    title: "Explain the Virtual DOM",
    difficulty: "easy",
    tags: ["React", "DOM", "performance"],
    description:
      "What is the Virtual DOM? How does React use it to update the UI efficiently? What is the reconciliation process?",
    hint: "Compare Virtual DOM to the real DOM. Think about why direct DOM manipulation is expensive.",
    solution: `**Real DOM:** Updating it is slow — every change triggers reflow and repaint of the browser's rendering engine.

**Virtual DOM:** A lightweight JavaScript object representation of the real DOM tree kept in memory.

**How React uses it:**
1. When state/props change, React creates a new Virtual DOM tree
2. React **diffs** the new tree against the previous one (reconciliation)
3. React calculates the **minimum set of changes** needed
4. Only those changes are applied to the real DOM (called "committing")

**Reconciliation Rules:**
- Different element types → tear down old tree, build new
- Same element type → update only changed attributes
- Lists with keys → match elements by key for efficient reordering

**Result:** Fewer real DOM operations → better performance.`,
  },
  {
    id: "fe-2",
    topicId: "frontend",
    title: "What is CSS Box Model?",
    difficulty: "easy",
    tags: ["CSS", "layout"],
    description:
      "Explain the CSS Box Model. What are its components? What is the difference between `box-sizing: content-box` and `box-sizing: border-box`?",
    hint: "Every HTML element is a rectangular box with 4 layers.",
    solution: `**CSS Box Model (inside out):**
1. **Content** – The actual text/image content
2. **Padding** – Space between content and border (inside)
3. **Border** – The edge of the element
4. **Margin** – Space outside the border (outside, between elements)

**Total width formula:**
\`content-box\` (default): total width = content + padding + border + margin
\`border-box\`: total width = set width (padding and border included inside)

**Example:**
\`\`\`css
/* border-box makes layout math easier */
* { box-sizing: border-box; }

.box {
  width: 200px;   /* includes padding + border */
  padding: 20px;
  border: 2px solid;
}
\`\`\`

**Best practice:** Always use \`box-sizing: border-box\` globally — it makes sizing predictable.`,
  },

  // ─── Backend ───────────────────────────────────────────────────────────────
  {
    id: "be-1",
    topicId: "backend",
    title: "REST vs GraphQL",
    difficulty: "medium",
    tags: ["API", "REST", "GraphQL"],
    description:
      "Compare REST and GraphQL APIs. What are the key differences? When would you choose one over the other?",
    hint: "Think about over-fetching, under-fetching, versioning, and use cases.",
    solution: `**REST:**
- Multiple endpoints, each returning fixed data shape
- Can over-fetch (too much data) or under-fetch (need multiple calls)
- Stateless, cacheable (HTTP caching works naturally)
- Simple, widely understood, great for public APIs

**GraphQL:**
- Single endpoint, client specifies exactly what data it needs
- No over/under-fetching
- Strongly typed schema
- Harder to cache, steeper learning curve
- Great for complex UIs with varying data needs

**Choose REST when:**
- Public API, external developers, simple CRUD
- HTTP caching is important
- Team is more familiar with REST

**Choose GraphQL when:**
- Mobile apps (minimize data transfer)
- Complex data relationships (e.g., social graph)
- Rapid UI iteration where data needs change frequently`,
  },
  {
    id: "be-2",
    topicId: "backend",
    title: "What is JWT and how does it work?",
    difficulty: "easy",
    tags: ["authentication", "JWT", "security"],
    description:
      "Explain what a JSON Web Token (JWT) is, its structure, and how it is used for authentication. What are its advantages and risks?",
    hint: "JWT has 3 parts separated by dots. Think about stateless auth.",
    solution: `**JWT Structure:** \`header.payload.signature\` (Base64-encoded, dot-separated)

- **Header:** Algorithm type (\`{"alg":"HS256","typ":"JWT"}\`)
- **Payload:** Claims/data (\`{"sub":"userId","role":"admin","exp":1234567}\`)
- **Signature:** HMAC(header + "." + payload, secret) — proves authenticity

**Auth Flow:**
1. User logs in → server validates credentials
2. Server creates JWT signed with secret key → sends to client
3. Client stores JWT (localStorage or httpOnly cookie)
4. Client sends JWT in \`Authorization: Bearer <token>\` header
5. Server verifies signature → extracts user data → no DB lookup needed

**Advantages:**
- Stateless — no session storage needed on server
- Works across microservices (shared secret or public key)

**Risks:**
- Can't invalidate a JWT before expiry (use short expiry + refresh tokens)
- Never store sensitive data in payload (it's only encoded, not encrypted)
- XSS risk if stored in localStorage → prefer httpOnly cookies`,
  },

  // ─── Database ──────────────────────────────────────────────────────────────
  {
    id: "db-1",
    topicId: "database",
    title: "Write a SQL query: Find employees earning above average",
    difficulty: "easy",
    tags: ["SQL", "subquery", "aggregate"],
    description:
      "Given an `employees` table with columns `id`, `name`, `department`, `salary`, write a SQL query to find all employees whose salary is above the company average.",
    hint: "Use a subquery with AVG() in the WHERE clause.",
    solution: `SELECT id, name, department, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;

-- Explanation:
-- The subquery (SELECT AVG(salary) FROM employees) runs first
-- and returns the average salary.
-- The outer query then filters employees above that average.`,
  },
  {
    id: "db-2",
    topicId: "database",
    title: "What is Database Indexing?",
    difficulty: "medium",
    tags: ["database", "performance", "indexing"],
    description:
      "Explain what database indexes are, how they work internally, and the trade-offs of using them. When should you add an index?",
    hint: "Think of an index like a book's table of contents. What data structure is typically used?",
    solution: `**What is an Index?**
A data structure (usually a B-Tree) that stores a sorted copy of one or more columns, along with a pointer to the full row.

**How it works:**
Without index: full table scan O(n) — reads every row.
With index: B-Tree lookup O(log n) — jumps directly to matching rows.

**Trade-offs:**
✅ Faster SELECT queries on indexed columns
✅ Faster ORDER BY, GROUP BY, JOIN on indexed columns
❌ Slower INSERT/UPDATE/DELETE (index must be updated)
❌ Uses extra disk space

**When to add an index:**
- Columns frequently used in WHERE clauses
- Foreign key columns (for JOINs)
- Columns used in ORDER BY or GROUP BY
- Columns with high cardinality (many unique values)

**When NOT to:**
- Small tables (full scan is fast enough)
- Columns rarely queried
- Columns with low cardinality (e.g., boolean — index rarely helps)`,
  },

  // ─── OS ───────────────────────────────────────────────────────────────────
  {
    id: "os-1",
    topicId: "os",
    title: "What is Virtual Memory?",
    difficulty: "medium",
    tags: ["OS", "memory", "paging"],
    description:
      "Explain virtual memory. Why does it exist? What is paging? What happens during a page fault?",
    hint: "Think about how an OS lets programs use more memory than physically available.",
    solution: `**Virtual Memory:** An abstraction that gives each process the illusion of having its own large, private address space, independent of physical RAM.

**Why it exists:**
- Programs can be larger than available RAM
- Processes are isolated from each other (security)
- Simplifies memory management for developers

**Paging:**
- Physical memory is divided into fixed-size frames
- Virtual memory is divided into pages (same size)
- OS maintains a **page table** mapping virtual pages → physical frames
- Not all pages need to be in RAM — some can be on disk (swap space)

**Page Fault:**
1. Process accesses a virtual address
2. If that page isn't in RAM → page fault interrupt fires
3. OS finds the page on disk
4. OS loads it into a free RAM frame
5. Updates page table
6. Resumes process execution

**Too many page faults → "Thrashing"** — system spends more time swapping than executing.`,
  },

  // ─── Networking ──────────────────────────────────────────────────────────
  {
    id: "net-1",
    topicId: "networking",
    title: "What happens when you type a URL in a browser?",
    difficulty: "medium",
    tags: ["networking", "HTTP", "DNS"],
    description:
      "Describe the complete sequence of events that occurs from the moment a user types `https://www.google.com` and presses Enter, to when the page is rendered.",
    hint: "Cover: DNS resolution, TCP connection, TLS handshake, HTTP request/response, rendering.",
    solution: `**Step-by-step flow:**

1. **URL Parsing** – Browser parses protocol (https), domain (google.com), path (/)

2. **DNS Resolution** – Browser checks cache → OS cache → Router cache → DNS Resolver → Root NS → TLD NS (.com) → Google's NS → gets IP address (142.250.x.x)

3. **TCP Connection** – Browser opens TCP connection to port 443 (HTTPS) via 3-way handshake: SYN → SYN-ACK → ACK

4. **TLS Handshake** – Client and server negotiate encryption, exchange certificates, agree on session keys

5. **HTTP Request** – Browser sends GET / HTTP/1.1 with headers (Host, User-Agent, Accept, etc.)

6. **Server Processing** – Google's load balancer routes request, backend generates response

7. **HTTP Response** – Server returns 200 OK with HTML, CSS, JS files

8. **Browser Rendering:**
   - Parse HTML → build DOM tree
   - Parse CSS → build CSSOM
   - Combine → Render tree
   - Layout (calculate positions) → Paint (draw pixels)

9. **Sub-resources** – Browser fetches CSS, JS, images (additional HTTP requests)`,
  },
];

// ─── Utility Functions ────────────────────────────────────────────────────────

export function getQuestionsByTopic(topicId: TopicId): Question[] {
  return QUESTIONS.filter((q) => q.topicId === topicId);
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByTopics(topicIds: TopicId[]): Question[] {
  return QUESTIONS.filter((q) => topicIds.includes(q.topicId));
}

export function getTopicQuestionCount(topicId: TopicId): number {
  return QUESTIONS.filter((q) => q.topicId === topicId).length;
}
