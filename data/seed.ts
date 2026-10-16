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

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_SCRAPED_JOBS: ScrapedJob[] = [];
