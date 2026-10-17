import { UserProfile, DailyRoutineTask, Application, ScrapedJob, BragItem, DeepPrepTopic } from "@/types";

// ==========================================
// 1. RAHUL'S ADMIN & PRIVATE ACCOUNT EMAILS
// (Both emails unlock private Fidelity seed data)
// ==========================================
export const RAHUL_ADMIN_EMAILS = [
  "rahulprasannats@gmail.com",
  "prasannarahul22@gmail.com",
];

export function isRahulUser(email?: string | null): boolean {
  if (!email) return false;
  return RAHUL_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// ==========================================
// 2. RAHUL'S PRIVATE PRODUCTION DATA
// (Loaded ONLY when one of Rahul's Google accounts signs in)
// ==========================================
export const RAHUL_PRIVATE_PROFILE: UserProfile = {
  name: "Rahul Prasanna T S",
  email: "prasannarahul22@gmail.com",
  currentRole: "Software Engineer",
  company: "Fidelity Investments India (Communications Orchestration Platform)",
  totalExperience: "2+ Years (Full-time since Aug 2024; Software Engineering Intern Jan 2024 – Jul 2024)",
  education: "B.Tech in Information Technology, Thiagarajar College of Engineering (Graduated 2024, CGPA: 9.1/10.0)",
  shiftHours: "11:00 AM – 8:00 PM IST",
  targetRoles: [
    "Software Engineer",
    "Backend Software Engineer",
    "Distributed Systems Engineer",
    "Cloud Platform Engineer"
  ],
  targetLocations: ["Bengaluru, India", "Chennai, India"],
  currentCompensation: "13.68 LPA Base + 15% Bonus (~15.73 LPA CTC)",
  targetCompensation: "22 to 45+ LPA (Tier-1 Product, FinTechs, GCCs)",
  skills: [
    "Java 17/21",
    "Spring Boot",
    "Micronaut",
    "Distributed Systems",
    "Microservices",
    "AWS (S3, SQS, SNS, Lambda, EC2, EKS, RDS, IAM, KMS, MRAP)",
    "Kubernetes",
    "Docker",
    "KEDA",
    "PostgreSQL",
    "DynamoDB",
    "Oracle",
    "REST APIs",
    "JavaScript",
    "Python",
    "SQL",
    "Datadog",
    "Splunk",
    "Terraform",
    "CI/CD",
    "Git"
  ],
  achievements: [
    "Scaled platform to process 2.1B+ annual communications, retiring legacy mainframes by transitioning to cloud-native REST APIs and Java microservices.",
    "Cut backend batch execution time by 90% (to under 2 hours) and accelerated disposition processing 60x via parallelized Kubernetes orchestrator-worker model.",
    "Reduced batch insert runtimes by 67% and unblocked migration of 15M+ monthly statements by optimizing PostgreSQL with partitioned summary tables, GIN indexes, and index pruning.",
    "Eliminated data loss in a KEDA-scaled AWS SQS consumer pipeline by resolving Kubernetes scale-down race conditions via graceful SIGTERM handling and dynamic visibility timeouts.",
    "Architected multi-region active-active backend pipeline on AWS Multi-Region Access Points (MRAP) with automatic cross-region failover, plus AI-assisted sidecar monitoring system."
  ]
};

// ==========================================
// 2. SANITIZED PUBLIC DEMO GUEST PROFILE
// (Loaded for anonymous visitors in Guest Preview Mode)
// ==========================================
export const DEMO_GUEST_PROFILE: UserProfile = {
  name: "Alex Chen (Demo)",
  email: "demo.engineer@first50.app",
  currentRole: "Backend Software Engineer",
  company: "High-Growth FinTech (Distributed Payments Platform)",
  totalExperience: "3+ Years",
  education: "B.Tech in Computer Science & Engineering",
  shiftHours: "10:00 AM – 7:00 PM IST",
  targetRoles: [
    "Software Engineer",
    "Backend Software Engineer",
    "Distributed Systems Engineer",
    "Cloud Infrastructure Engineer"
  ],
  targetLocations: ["Bengaluru, India", "Hyderabad, India", "Remote"],
  currentCompensation: "18 LPA Base",
  targetCompensation: "28 to 45 LPA (Tier-1 Product, FinTechs, GCCs)",
  skills: [
    "Java 17/21",
    "Go",
    "Spring Boot",
    "Distributed Systems",
    "Kafka",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Kubernetes",
    "Docker",
    "REST APIs",
    "Microservices",
    "CI/CD"
  ],
  achievements: [
    "Architected an asynchronous event-driven payment processing pipeline handling 50M+ daily events with 99.99% availability.",
    "Reduced p99 API latency from 450ms to 45ms by implementing a distributed multi-tier Redis caching topology with write-through invalidation.",
    "Engineered a distributed rate limiter and circuit breaker using Redis token buckets, preventing downstream service cascades during peak flash-sales."
  ]
};

// Default profile for fallback
export const SEED_PROFILE: UserProfile = DEMO_GUEST_PROFILE;

export const DEFAULT_DAILY_TASKS: DailyRoutineTask[] = [
  {
    id: "task-1-prep",
    timeBlock: "08:30 – 09:15 AM",
    title: "Deep Prep Block",
    description: "Solve 1 Medium/Hard DSA problem or review 1 Distributed Systems pattern (Kafka vs SQS, Consistent Hashing, KEDA, DB Partitioning).",
    completed: false,
    category: "prep",
    actionLabel: "Open Deep Prep Studio"
  },
  {
    id: "task-2-strike",
    timeBlock: "09:15 – 09:45 AM",
    title: "First-50 Application Strike",
    description: "Check Morning AI Job Radar + launch Past-4-Hours (f_TPR=r14400) LinkedIn filters. Apply to 3–5 fresh roles to land in top 50 applicants.",
    completed: false,
    category: "strike",
    actionLabel: "Launch Strike Links"
  },
  {
    id: "task-3-refresh",
    timeBlock: "09:55 – 10:00 AM",
    title: "Naukri Profile Refresh",
    description: "Update 1 skill or tweak headline period on Naukri so your profile ranks #1 in recruiter 'Recently Updated' candidate searches at 10:00 AM.",
    completed: false,
    category: "refresh",
    actionLabel: "Open Naukri",
    actionUrl: "https://www.naukri.com/mnjuser/profile"
  },
  {
    id: "task-4-dm",
    timeBlock: "10:00 – 10:30 AM",
    title: "3 Direct EM / Senior Dev DMs",
    description: "Send 3 customized pitches to Engineering Managers or SDE-3s on hiring teams before applying on portals. Cite 2.1B+ scale & 90% latency reduction.",
    completed: false,
    category: "dm",
    actionLabel: "Generate HM Pitches"
  },
  {
    id: "task-5-office",
    timeBlock: "11:00 AM – 08:00 PM",
    title: "Core Office Shift",
    description: "Focus on Fidelity platform work; log any production scale, resilience, or latency wins into brag sheet for upcoming interviews.",
    completed: false,
    category: "office",
    actionLabel: "Open Brag Sheet"
  },
  {
    id: "task-6-pipeline",
    timeBlock: "08:30 – 09:00 PM",
    title: "Evening Pipeline Triage",
    description: "Follow up on 3-day-old referral requests (72h follow-up due) and bookmark fresh roles for tomorrow morning's 8:30 AM strike.",
    completed: false,
    category: "pipeline",
    actionLabel: "Check 72h Follow-ups"
  }
];

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_SCRAPED_JOBS: ScrapedJob[] = [];

export const RAHUL_PRIVATE_BRAG_ITEMS: BragItem[] = [
  {
    id: "brag-1-scale",
    title: "Communications Orchestration Platform Scale (2.1B+ Events)",
    category: "Scaling",
    metric: "2.1B+ Annual Communications",
    situation: "Fidelity's legacy mainframe communications system suffered from high licensing costs, rigid batch schedules, and inability to handle burst customer traffic.",
    task: "Modernize backend communication pipelines into cloud-native Java 17/21 microservices capable of processing over 2.1 billion critical financial alerts annually.",
    action: "Architected event-driven microservices on AWS (SQS, SNS, Lambda, EKS) replacing mainframe batch jobs. Designed standardized JSON REST APIs with Micronaut/Spring Boot and asynchronous consumer clusters.",
    result: "Successfully retired costly mainframe pipelines and scaled platform to sustain 2.1B+ communications with 99.99% availability across global trading hours.",
    starSummary: "When Fidelity needed to retire legacy mainframe batch communications, I helped architect cloud-native Java 17 microservices on AWS EKS and SQS/SNS that now process over 2.1 billion communications annually with sub-second dispatch latency.",
    resumeBullet: "Scaled core communications platform to process 2.1B+ annual transactions, retiring legacy mainframes by architecting high-throughput Java microservices on AWS EKS and SQS.",
    tags: ["Java 21", "Microservices", "AWS EKS", "SQS", "High Scale"],
    dateAdded: "2026-08-15"
  },
  {
    id: "brag-2-latency",
    title: "90% Batch Execution Latency Reduction & 60x Disposition Acceleration",
    category: "Performance",
    metric: "90% Runtime Reduction (<2h) & 60x Speedup",
    situation: "End-of-day disposition processing took over 20+ hours on legacy sequential scripts, routinely breaching internal client SLAs.",
    task: "Re-engineer batch processing architecture to complete within a strict 2-hour SLA window without increasing cloud compute costs exponentially.",
    action: "Redesigned processing into a parallelized Kubernetes orchestrator-worker architecture. Implemented chunking, asynchronous thread pool executors in Java, and dynamic task scheduling.",
    result: "Cut batch execution time by 90% (from 20+ hours down to under 2 hours) and accelerated disposition processing 60x, unblocking real-time downstream accounting.",
    starSummary: "Faced with a 20-hour batch processing bottleneck that frequently breached SLAs, I re-architected the legacy batch engine into a parallel Kubernetes orchestrator-worker model with Java concurrency, slashing runtime by 90% to under 2 hours and accelerating disposition processing 60x.",
    resumeBullet: "Slashing batch execution time by 90% (to under 2 hours) and accelerating disposition processing 60x via a parallelized Kubernetes orchestrator-worker model.",
    tags: ["Performance", "Kubernetes", "Concurrency", "Batch Processing", "Java 17"],
    dateAdded: "2026-09-01"
  },
  {
    id: "brag-3-database",
    title: "PostgreSQL Database Partitioning & 67% Batch Insert Optimization",
    category: "Database",
    metric: "67% Insert Runtime Cut & 15M+ Statements Unblocked",
    situation: "A core PostgreSQL transaction database was choking on 15M+ monthly statement inserts, causing table bloat, lock contention, and high I/O wait times.",
    task: "Optimize database ingestion pipeline to support 15M+ monthly statements without increasing AWS RDS instance sizing.",
    action: "Engineered monthly declarative range-partitioned tables, optimized GIN and B-Tree indexes, pruned redundant composite indexes, and implemented batch-pipelined JDBC inserts.",
    result: "Reduced batch insert runtimes by 67%, eliminated lock contention, and unblocked the critical migration of 15M+ monthly statements while cutting RDS storage IOPS by 40%.",
    starSummary: "When 15 million monthly statements caused severe I/O bottlenecks in PostgreSQL, I implemented declarative range-partitioning, pruned dead indexes, and tuned GIN indexes, cutting batch write runtimes by 67% and unblocking migration without upgrading hardware.",
    resumeBullet: "Reduced PostgreSQL batch insert runtimes by 67% and unblocked migration of 15M+ monthly statements by architecting partitioned summary tables, GIN indexes, and index pruning.",
    tags: ["PostgreSQL", "Database Optimization", "Table Partitioning", "Indexing", "RDS"],
    dateAdded: "2026-09-15"
  },
  {
    id: "brag-4-resilience",
    title: "Zero Data Loss in KEDA Auto-Scaling AWS SQS Pipeline",
    category: "Resilience",
    metric: "0 Message Loss During Rapid Scale-Down",
    situation: "During traffic spikes, Kubernetes Event-driven Autoscaling (KEDA) scaled SQS consumer pods up and down rapidly. Abrupt pod terminations caused in-flight SQS messages to fail, triggering duplicate retries and intermittent poison-pill message loss.",
    task: "Eliminate message drops and duplicate processing during rapid K8s pod termination and scale-down events.",
    action: "Implemented graceful SIGTERM shutdown hooks in Spring Boot/Micronaut consumers, combined with dynamic SQS visibility timeout heartbeats to return in-flight tasks cleanly to the queue before container termination.",
    result: "Eliminated 100% of scale-down message loss, reduced DLQ (Dead Letter Queue) churn by 98%, and ensured zero duplicate executions.",
    starSummary: "To resolve SQS message loss caused by KEDA Kubernetes pods scaling down while processing in-flight tasks, I engineered graceful SIGTERM termination handling and dynamic visibility heartbeats, achieving zero data loss during autoscaling spikes.",
    resumeBullet: "Eliminated data loss in a KEDA-scaled AWS SQS consumer pipeline by resolving Kubernetes scale-down race conditions via graceful SIGTERM handling and dynamic visibility timeouts.",
    tags: ["KEDA", "AWS SQS", "Kubernetes", "Resilience", "Spring Boot"],
    dateAdded: "2026-10-01"
  },
  {
    id: "brag-5-mrap",
    title: "Multi-Region Active-Active Pipeline on AWS MRAP & AI SLA Sidecar",
    category: "Cloud Architecture",
    metric: "Sub-Second Automatic Cross-Region Failover",
    situation: "Single-region cloud deployments posed compliance risks for Fidelity's mission-critical client communications in case of regional AWS outages.",
    task: "Design an active-active multi-region backend with automated cross-region failover and SLA observability.",
    action: "Architected multi-region routing using AWS Multi-Region Access Points (MRAP) with active-active S3 and DynamoDB Global Tables. Built an AI-assisted sidecar monitoring agent running in EKS to detect degradation patterns and enforce SLA compliance.",
    result: "Delivered sub-second automated cross-region failover with zero manual intervention and achieved 99.999% SLA adherence.",
    starSummary: "Architected an active-active multi-region backend pipeline utilizing AWS Multi-Region Access Points (MRAP) with automatic cross-region failover, complemented by an AI-assisted sidecar monitoring system enforcing strict SLA compliance.",
    resumeBullet: "Architected multi-region active-active backend pipeline on AWS Multi-Region Access Points (MRAP) with automatic cross-region failover, plus AI-assisted sidecar monitoring system.",
    tags: ["AWS MRAP", "Multi-Region", "Active-Active", "High Availability", "Observability"],
    dateAdded: "2026-10-10"
  }
];

// Generic demo brag items for guest preview
export const DEMO_GUEST_BRAG_ITEMS: BragItem[] = [
  {
    id: "demo-brag-1",
    title: "Asynchronous Payment Processing Engine (50M+ Events/Day)",
    category: "Scaling",
    metric: "50M+ Daily Events & 99.99% Availability",
    situation: "During peak transaction bursts, synchronous payment webhooks led to high database connection thread exhaustion and downstream gateway timeouts.",
    task: "Re-architect payment ingestion pipeline to decouple synchronous checkout APIs from payment settlement workflows.",
    action: "Engineered an event-driven architecture using Kafka clusters with idempotency keys and asynchronous worker pools in Java and Go, backed by Redis distributed locks.",
    result: "Sustained 50M+ daily events with sub-200ms API response time, zero dropped transactions, and 99.99% system availability.",
    starSummary: "When transaction bursts overwhelmed our synchronous payments gateway, I re-architected the pipeline into an event-driven Kafka consumer topology with idempotent deduplication, scaling capacity to 50M+ events daily with zero transaction loss.",
    resumeBullet: "Architected an event-driven payment processing pipeline on Kafka and Redis handling 50M+ daily transactions with 99.99% availability.",
    tags: ["Kafka", "Java", "Event-Driven", "High Scale", "Distributed Systems"],
    dateAdded: "2026-09-01"
  },
  {
    id: "demo-brag-2",
    title: "Distributed Multi-Tier Caching (90% p99 Latency Reduction)",
    category: "Performance",
    metric: "90% Latency Drop (450ms -> 45ms)",
    situation: "High-frequency merchant dashboard queries repeatedly hammered primary PostgreSQL read replicas, causing elevated p99 latency during morning reporting peaks.",
    task: "Design a high-speed caching tier capable of servicing 85%+ of read traffic without serving stale settlement data.",
    action: "Implemented a two-tier caching architecture with in-memory Caffeine local cache synchronized with a Redis cluster via Kafka pub/sub invalidation events.",
    result: "Slashed p99 read query latency by 90% (from 450ms down to 45ms) and reduced database CPU utilization from 82% to 26%.",
    starSummary: "To relieve database replica pressure during reporting spikes, I implemented a two-tier caching strategy with Caffeine and Redis cluster backed by pub/sub cache invalidation, cutting p99 read latency from 450ms to 45ms.",
    resumeBullet: "Cut p99 read latency by 90% (to 45ms) and lowered database CPU load from 82% to 26% by engineering a multi-tier Redis and in-memory cache architecture.",
    tags: ["Redis", "Caching", "PostgreSQL", "Latency Optimization", "Performance"],
    dateAdded: "2026-09-20"
  },
  {
    id: "demo-brag-3",
    title: "Multi-Tenant Distributed Rate Limiter & Circuit Breaker",
    category: "Resilience",
    metric: "100% Prevention of Cascading Service Outages",
    situation: "Sudden traffic surges from a rogue API client consumed downstream service pools, resulting in noisy-neighbor outages for other tenants.",
    task: "Build a low-overhead, multi-tenant rate limiter capable of enforcing per-tenant quotas across 20+ microservice instances.",
    action: "Built a distributed sliding-window rate limiter using Redis Lua scripts and integrated Resilience4j circuit breakers for graceful fallback degradation.",
    result: "Enforced strict per-tenant fair-use quotas with <2ms latency overhead and prevented 100% of cascading outages during high-traffic sales events.",
    starSummary: "To solve noisy-neighbor outages caused by rogue API traffic, I built a low-overhead distributed sliding-window rate limiter with Redis Lua scripts and circuit breakers, ensuring 100% fair-share isolation under load.",
    resumeBullet: "Engineered a low-latency distributed rate limiter using Redis Lua scripts, eliminating cascading outages and guaranteeing multi-tenant isolation under traffic spikes.",
    tags: ["Rate Limiter", "Resilience", "Redis Lua", "Circuit Breaker", "Microservices"],
    dateAdded: "2026-10-05"
  }
];

export const INITIAL_BRAG_ITEMS: BragItem[] = DEMO_GUEST_BRAG_ITEMS;

export const ROTATING_PREP_TOPICS: DeepPrepTopic[] = [
  {
    id: "prep-mon",
    dayOfWeek: "Monday",
    dsaTitle: "LRU Cache (Design & Concurrency)",
    dsaDifficulty: "Medium",
    dsaPattern: "Doubly Linked List + Hash Map (O(1) Get & Put)",
    dsaUrl: "https://leetcode.com/problems/lru-cache/",
    dsaKeyInsight: "Use dummy head and tail nodes to eliminate edge cases when inserting/deleting. For advanced follow-up: Explain thread-safety via ReentrantReadWriteLock vs ConcurrentLinkedQueue.",
    distSysTitle: "Distributed Caching & Eviction Policies",
    distSysCategory: "Caching Architecture",
    distSysReadingUrl: "https://github.com/donnemartin/system-design-primer#distributed-cache",
    distSysReadingTitle: "System Design Primer: Distributed Caching",
    distSysSummary: "Comparing Redis Cluster (hash slots, sentinel, master-replica) vs Memcached. Trade-offs between Cache-Aside, Write-Through, Write-Behind (Write-Back), and Cache Stampede mitigation (mutex locks, probabilistic early expiration).",
    fidelityConnection: "Connect this to your high-throughput microservices: how Redis reduces database read pressure during 2.1B+ communications bursts.",
    interviewTip: "When asked about cache consistency, always mention the two-phase commit vs eventual consistency trade-off and why cache invalidation is hard."
  },
  {
    id: "prep-tue",
    dayOfWeek: "Tuesday",
    dsaTitle: "Course Schedule II / Topological Sort",
    dsaDifficulty: "Medium",
    dsaPattern: "Kahn's Algorithm (BFS) / DFS Cycle Detection",
    dsaUrl: "https://leetcode.com/problems/course-schedule-ii/",
    dsaKeyInsight: "Maintain in-degree array. If all courses cannot be processed, a cycle exists. Crucial for dependency resolution in orchestrators.",
    distSysTitle: "Message Queues: AWS SQS vs Apache Kafka",
    distSysCategory: "Messaging & Streaming",
    distSysReadingUrl: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
    distSysReadingTitle: "AWS SQS Deep Dive: Visibility Timeouts & Dead-Letter Queues",
    distSysSummary: "Kafka is a distributed append-only log with partitioned consumer groups and offset tracking. SQS is a distributed ephemeral queue with message visibility timeouts and individual message acknowledgments. In-flight messages in SQS need heartbeats; Kafka needs partition rebalancing control.",
    fidelityConnection: "Directly relates to your SQS KEDA achievement: why visibility timeouts prevent race conditions during Kubernetes scale-down.",
    interviewTip: "Clarify whether the interviewer needs total ordering (Kafka partition) vs independent task processing (SQS). Top engineers know exactly when to choose which."
  },
  {
    id: "prep-wed",
    dayOfWeek: "Wednesday",
    dsaTitle: "Merge K Sorted Lists",
    dsaDifficulty: "Hard",
    dsaPattern: "Min-Heap / PriorityQueue or Divide and Conquer (O(N log K))",
    dsaUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
    dsaKeyInsight: "Use a PriorityQueue of size K or pairwise divide-and-conquer merge. Essential for merging distributed log streams or sorted shards.",
    distSysTitle: "Database Partitioning & High-Scale Indexing",
    distSysCategory: "Database Engineering",
    distSysReadingUrl: "https://www.postgresql.org/docs/current/ddl-partitioning.html",
    distSysReadingTitle: "PostgreSQL Official Docs: Table Partitioning",
    distSysSummary: "Declarative Partitioning (Range, List, Hash). Partition pruning enables the query planner to scan only relevant partitions. Trade-offs between B-Tree (range scans, high cardinality) vs GIN/BRIN indexes (inverted arrays, timestamp sequences on millions of records).",
    fidelityConnection: "Your exact PostgreSQL achievement: cutting insert runtimes 67% on 15M+ statements by pruning indexes and using monthly partitioned tables.",
    interviewTip: "Always discuss table bloat, autovacuum locks during concurrent writes, and why unpruned indexes severely degrade write throughput."
  },
  {
    id: "prep-thu",
    dayOfWeek: "Thursday",
    dsaTitle: "Design In-Memory File System",
    dsaDifficulty: "Hard",
    dsaPattern: "Trie / Tree Data Structure with Directory & File Nodes",
    dsaUrl: "https://leetcode.com/problems/design-in-memory-file-system/",
    dsaKeyInsight: "Represent directories and files as nested map/tree structures. Useful for namespace resolution in object storage and distributed file systems.",
    distSysTitle: "Active-Active Multi-Region Replication & Conflict Resolution",
    distSysCategory: "High Availability",
    distSysReadingUrl: "https://aws.amazon.com/s3/features/multi-region-access-points/",
    distSysReadingTitle: "AWS Architecture: Multi-Region Access Points (MRAP)",
    distSysSummary: "Cross-region active-active replication challenges: CAP theorem, network partitions, split-brain, and eventual consistency. Conflict resolution mechanisms: Last-Write-Wins (LWW), Vector Clocks, and CRDTs (Conflict-free Replicated Data Types).",
    fidelityConnection: "Your AWS MRAP pipeline: routing user requests dynamically to the nearest healthy region with automated failover.",
    interviewTip: "Highlight the cost and latency trade-offs of synchronous multi-region replication vs asynchronous replication with compensation workflows."
  },
  {
    id: "prep-fri",
    dayOfWeek: "Friday",
    dsaTitle: "Design Hit Counter / Rate Limiter",
    dsaDifficulty: "Medium",
    dsaPattern: "Sliding Window / Queue / Circular Buffer (Fixed Window vs Sliding Log)",
    dsaUrl: "https://leetcode.com/problems/design-hit-counter/",
    dsaKeyInsight: "A circular array of size 300 with bucket timestamps avoids storing individual timestamps and achieves O(1) memory and time.",
    distSysTitle: "Distributed Rate Limiting & Resiliency Patterns",
    distSysCategory: "API Gateway Architecture",
    distSysReadingUrl: "https://stripe.com/blog/rate-limiters",
    distSysReadingTitle: "Stripe Engineering: Scaling Your API with Rate Limiters",
    distSysSummary: "Token Bucket vs Leaky Bucket vs Sliding Window Counter in Redis (using Lua scripts for atomicity). Circuit Breaker Pattern (Resilience4j) with Closed, Open, and Half-Open states to prevent cascading failures in microservices.",
    fidelityConnection: "How your communication orchestration platform protects downstream email/SMS gateways from being overwhelmed during market volatility.",
    interviewTip: "Explain why client-side retries must always include exponential backoff with full jitter to avoid the 'thundering herd' problem."
  },
  {
    id: "prep-sat",
    dayOfWeek: "Saturday",
    dsaTitle: "Task Scheduler",
    dsaDifficulty: "Medium",
    dsaPattern: "Greedy / Max-Heap / Frequency Counting with Cooling Period",
    dsaUrl: "https://leetcode.com/problems/task-scheduler/",
    dsaKeyInsight: "Formula: (maxFreq - 1) * (n + 1) + countOfMaxFreq. Math + Greedy approach gives O(N) without simulating the entire queue.",
    distSysTitle: "Distributed Locking & Payment Idempotency",
    distSysCategory: "Distributed Concurrency",
    distSysReadingUrl: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html",
    distSysReadingTitle: "Martin Kleppmann: How to Do Distributed Locking Safely",
    distSysSummary: "Why Redis Redlock can be unsafe with clock skew and garbage collection pauses. Solving idempotency in financial transactions using idempotent request tokens, database unique keys, and distributed leases with fencing tokens.",
    fidelityConnection: "Ensuring zero double-dispatches of critical financial statements even if a microservice worker crashes mid-execution.",
    interviewTip: "In payment interviews (Razorpay, Stripe), idempotency is mandatory. Walk through the idempotency-key lifecycle: storing payload hash and response."
  },
  {
    id: "prep-sun",
    dayOfWeek: "Sunday",
    dsaTitle: "Longest Substring Without Repeating Characters",
    dsaDifficulty: "Medium",
    dsaPattern: "Sliding Window with Hash Map / Character Index Tracking",
    dsaUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    dsaKeyInsight: "Move right pointer; when duplicate is seen, jump left pointer to max(left, lastSeenIndex + 1). O(N) single pass.",
    distSysTitle: "Kubernetes KEDA & Event-Driven Autoscaling",
    distSysCategory: "Kubernetes & Cloud Infrastructure",
    distSysReadingUrl: "https://keda.sh/docs/latest/scalers/aws-sqs/",
    distSysReadingTitle: "KEDA Documentation: SQS Scaler Internals",
    distSysSummary: "How KEDA acts as a Kubernetes Custom Metrics APIServer to scale pods based on external metrics (SQS queue length, Kafka consumer lag) rather than CPU/Memory. Graceful termination lifecycle: SIGTERM, preStop hooks, and terminationGracePeriodSeconds.",
    fidelityConnection: "Your exact production win: eliminating data loss in KEDA SQS scaling by tuning visibility timeouts and handling SIGTERM.",
    interviewTip: "Explain why standard CPU-based HPA fails for queue consumers (pods consume 100% CPU on empty polling or drop to 0% during queue backlog)."
  }
];
