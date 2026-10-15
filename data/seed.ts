import { UserProfile, DailyRoutineTask, Application, ScrapedJob } from "@/types";

export const SEED_PROFILE: UserProfile = {
  name: "Rahul Prasanna T S",
  email: "rahulprasannats@gmail.com",
  currentRole: "Software Engineer",
  company: "Fidelity Investments India (Communications Orchestration Platform)",
  totalExperience: "2+ Years (Full-time since Aug 2024; Software Engineering Intern Jan 2024 – Jul 2024)",
  education: "B.Tech in Information Technology, Thiagarajar College of Engineering (Graduated 2024, CGPA: 9.1/10.0)",
  shiftHours: "11:00 AM – 8:00 PM IST",
  targetRoles: [
    "SDE-1 (Lateral)",
    "SDE-2",
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

export const DEFAULT_DAILY_TASKS: DailyRoutineTask[] = [
  {
    id: "task-1-prep",
    timeBlock: "08:30 – 09:15 AM",
    title: "Deep Prep Block",
    description: "Solve 1 Medium/Hard DSA problem or review 1 Distributed Systems pattern (Kafka vs SQS, Consistent Hashing, KEDA, DB Partitioning).",
    completed: false,
    category: "prep",
    actionLabel: "Open LeetCode",
    actionUrl: "https://leetcode.com/problemset/all/"
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
    category: "office"
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

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-seed-1",
    company: "Razorpay",
    roleTitle: "Software Development Engineer II - Core Payments",
    jobIdOrUrl: "RZP-PAY-8821",
    location: "Bengaluru",
    status: "HM DM Sent",
    contactName: "Arun Kumar (Engineering Manager)",
    appliedDate: new Date(Date.now() - 74 * 3600 * 1000).toISOString(), // >72 hrs ago for testing follow-up alert!
    followUpDueDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    pitchUsed: "Hi Arun, saw your team is scaling Razorpay's payments platform. I'm a Software Engineer at Fidelity running Java/K8s microservices processing 2.1B+ annual communications—recently cut batch latency 90% via KEDA + partitioned PostgreSQL. RZP-PAY-8821 aligns closely. Open to a quick chat?",
    notes: "Sent connection request with personalized note on LinkedIn at 10:15 AM."
  },
  {
    id: "app-seed-2",
    company: "Swiggy",
    roleTitle: "Backend Software Engineer - Order Platform",
    jobIdOrUrl: "SWG-ENG-491",
    location: "Bengaluru",
    status: "Referred",
    contactName: "Pooja V (Senior SDE)",
    appliedDate: new Date(Date.now() - 80 * 3600 * 1000).toISOString(), // >72 hrs ago
    followUpDueDate: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    pitchUsed: "Hi Pooja, noticed your work on Swiggy's order dispatch pipeline. I operate AWS MRAP and high-throughput SQS consumers at Fidelity handling 2.1B+ transactions. Would appreciate an internal referral for SWG-ENG-491.",
    notes: "Referral submitted on workday portal; waiting on recruiter screening call."
  },
  {
    id: "app-seed-3",
    company: "Postman",
    roleTitle: "Software Engineer (Backend Systems)",
    jobIdOrUrl: "PST-4920",
    location: "Bengaluru",
    status: "Applied (<4h)",
    contactName: "Direct Portal (First-50 Strike)",
    appliedDate: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    followUpDueDate: new Date(Date.now() + 58 * 3600 * 1000).toISOString(),
    pitchUsed: "Standard First-50 fast-strike application within 2 hours of posting.",
    notes: "Submitted via Greenhouse with tailored ATS resume emphasizing KEDA and multi-region AWS."
  },
  {
    id: "app-seed-4",
    company: "Amazon Web Services (AWS)",
    roleTitle: "Software Development Engineer - Cloud Storage",
    jobIdOrUrl: "AWS-291881",
    location: "Chennai",
    status: "Interviewing",
    contactName: "Vikram R (Recruiter)",
    appliedDate: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    followUpDueDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    pitchUsed: "Referral from ex-TCE senior on AWS S3 / MRAP teams.",
    notes: "Cleared Online Assessment (2/2 all test cases). Technical Round 1 scheduled for next week on System Design & Distributed Caching."
  }
];

export const INITIAL_SCRAPED_JOBS: ScrapedJob[] = [
  {
    id: "job-seed-1",
    company: "Stripe",
    title: "Software Engineer, Backend (India Infrastructure)",
    location: "Bengaluru, India",
    source: "Greenhouse",
    applyUrl: "https://boards.greenhouse.io/stripe/jobs/6192831",
    postedAt: "Today, 07:45 AM IST (Within 2 Hours)",
    matchScore: 94,
    matchingSkills: ["Java", "Distributed Systems", "PostgreSQL", "AWS", "High Throughput"],
    missingKeywords: ["gRPC", "Kafka Partition Rebalancing"],
    aiPitch: "Hi [EM], saw your team scaling Stripe India's backend. At Fidelity I run Java microservices handling 2.1B+ communications and cut batch latency 90% via KEDA. Job #6192831 is a direct match with my distributed systems background. Open to passing my CV to the team?",
    status: "new"
  },
  {
    id: "job-seed-2",
    company: "Cred",
    title: "Backend Engineer II - Transactions & Settlement",
    location: "Bengaluru, India",
    source: "Lever",
    applyUrl: "https://jobs.lever.co/cred/7b29e1c3",
    postedAt: "Today, 08:10 AM IST (Within 1 Hour)",
    matchScore: 91,
    matchingSkills: ["Spring Boot", "K8s", "AWS SQS/MRAP", "PostgreSQL Optimization"],
    missingKeywords: ["Redis Cluster", "Cassandra"],
    aiPitch: "Hi [EM], noticed your team scaling CRED's high-concurrency settlement engine. At Fidelity, I architected active-active AWS MRAP pipelines and tuned Postgres partitioned tables cutting runtime 67%. Would love to connect regarding the Backend II role!",
    status: "new"
  },
  {
    id: "job-seed-3",
    company: "Chargebee",
    title: "Senior Software Engineer - Platform & Billing",
    location: "Chennai, India",
    source: "Greenhouse",
    applyUrl: "https://boards.greenhouse.io/chargebee/jobs/5928172",
    postedAt: "Yesterday, 06:30 PM IST",
    matchScore: 88,
    matchingSkills: ["Java 17", "Spring Boot", "Microservices", "Docker", "RDS"],
    missingKeywords: ["Elasticsearch", "Event Sourcing"],
    aiPitch: "Hi [EM], saw Chargebee Chennai is expanding the core billing platform. At Fidelity I cut batch processing time by 90% on Java/K8s microservices handling 2.1B+ events. Role #5928172 matches my stack. Would love to share my resume before applying.",
    status: "saved"
  }
];
