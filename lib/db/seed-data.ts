import { Month, Project, Resource, Topic } from '../types';

// Helper to calculate tomorrow's date YYYY-MM-DD
export function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to add days to a date string YYYY-MM-DD
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

const tomorrowDate = getTomorrowDate();

export const INITIAL_USER = {
  id: 'usr_lead_learner_01',
  name: 'Abhinav Giri',
  email: 'abhinavgiri461@gmail.com',
  created_at: new Date().toISOString(),
};

export const INITIAL_ROADMAP = {
  id: 'rdmp_9mo_fullstack_data_ai',
  name: '9-Month Data Engineering, AI & Full-Stack Mastery',
  description: 'Rigorous 3-hours/day roadmap covering SQL, Advanced DBs, Python DE, Stats & Anomaly, Forecasting, LLMs & Text-to-SQL, AI Agents & Airflow, Go Backend, React, and DevOps.',
  total_months: 9,
  daily_hours: 3,
  start_date: tomorrowDate, // Starts tomorrow from Day 1!
  end_date: addDays(tomorrowDate, 270),
  status: 'ACTIVE' as const,
  created_at: new Date().toISOString(),
};

export const MONTHS_SEED: Omit<Month, 'roadmap_id'>[] = [
  {
    id: 'm1',
    month_number: 1,
    title: 'SQL Foundations',
    description: 'Relational query language fundamentals, aggregations, filtering, multi-table joins, subqueries, CTEs, and string/date manipulation.',
    goal: 'Gain absolute fluency in writing, debugging, and combining SQL queries from single table aggregations to complex CTE joins.',
    technology: 'SQL',
    status: 'IN_PROGRESS',
    project_id: 'proj_m1',
  },
  {
    id: 'm2',
    month_number: 2,
    title: 'Advanced SQL + Database Engineering',
    description: 'Window functions, execution plans, indexing strategies, recursive queries, stored procedures, transactions, ACID, and query optimization.',
    goal: 'Master analytics query design, window partitioning, and database engine internals for high-throughput enterprise pipelines.',
    technology: 'Database Engineering',
    status: 'NOT_STARTED',
    project_id: 'proj_m2',
  },
  {
    id: 'm3',
    month_number: 3,
    title: 'Python + Data Engineering',
    description: 'Python OOP, robust file handling, JSON/APIs, typing, NumPy, Pandas transformations, vectorization, and Postgres ETL pipelines.',
    goal: 'Construct resilient data ingestion and ETL scripts handling messy real-world schemas and automated loads.',
    technology: 'Python & Pandas',
    status: 'NOT_STARTED',
    project_id: 'proj_m3',
  },
  {
    id: 'm4',
    month_number: 4,
    title: 'Statistics + Data Quality + Anomaly Detection',
    description: 'Descriptive stats, distributions, Z-score, IQR, referential checks, moving averages, and unsupervised Isolation Forests for anomaly detection.',
    goal: 'Build an automated data reliability engine that validates freshness, volume, distribution drift, and outliers.',
    technology: 'Statistics & Quality',
    status: 'NOT_STARTED',
    project_id: 'proj_m4',
  },
  {
    id: 'm5',
    month_number: 5,
    title: 'Forecasting + Analytics',
    description: 'Time series decomposition, stationarity, ARIMA, exponential smoothing, moving averages, train-test splits, and forecast accuracy metrics (MAPE, RMSE).',
    goal: 'Design a predictive forecasting service that cleans historical telemetry and delivers actionable demand projections.',
    technology: 'Time Series & ML',
    status: 'NOT_STARTED',
    project_id: 'proj_m5',
  },
  {
    id: 'm6',
    month_number: 6,
    title: 'AI / LLM / Text-to-SQL',
    description: 'LLM APIs, prompt engineering, structured JSON outputs, function calling, hallucination mitigation, semantic schema validation, and Text-to-SQL.',
    goal: 'Build an enterprise Natural-Language-to-SQL engine with schema injection, AST validation, and safety guardrails.',
    technology: 'AI & LLMs',
    status: 'NOT_STARTED',
    project_id: 'proj_m6',
  },
  {
    id: 'm7',
    month_number: 7,
    title: 'AI Agents + Pipeline Orchestration',
    description: 'Autonomous planning, tool calling, state recovery, human-in-the-loop validation, Apache Airflow DAGs, tasks, sensor dependencies, and monitoring.',
    goal: 'Orchestrate an 8-stage enterprise autonomous data pipeline with retries, alerts, and agentic error recovery.',
    technology: 'Airflow & Agents',
    status: 'NOT_STARTED',
    project_id: 'proj_m7',
  },
  {
    id: 'm8',
    month_number: 8,
    title: 'Go Backend + React Frontend',
    description: 'Idiomatic Go REST APIs, middleware, JWT auth, Postgres connection pooling, goroutines, combined with modern React, TypeScript, and charts.',
    goal: 'Develop a high-performance full-stack data portal capable of serving sub-millisecond API responses to an interactive React UI.',
    technology: 'Go & React',
    status: 'NOT_STARTED',
    project_id: 'proj_m8',
  },
  {
    id: 'm9',
    month_number: 9,
    title: 'Production + DevOps',
    description: 'Docker containerization, Compose orchestration, volume persistence, networking, CI/CD GitHub Actions, Linux administration, and cloud deployment.',
    goal: 'Deploy the unified multi-tier data architecture to production cloud containers with monitoring and health checks.',
    technology: 'Docker & Cloud DevOps',
    status: 'NOT_STARTED',
    project_id: 'proj_m9',
  },
];

export const PROJECTS_SEED: Project[] = [
  {
    id: 'proj_m1',
    month_number: 1,
    title: 'SQL Data Explorer',
    description: 'Complete relational exploration suite over e-commerce datasets with aggregations, multi-joins, and complex subqueries.',
    progress_percentage: 0,
    status: 'IN_PROGRESS',
    checklist: [
      { id: 'c1_1', title: 'Database schema & sample relational tables created', completed: false },
      { id: 'c1_2', title: 'Data import & CSV loading scripts written', completed: false },
      { id: 'c1_3', title: 'Basic filtering (WHERE, LIKE, IN, BETWEEN) queries', completed: false },
      { id: 'c1_4', title: 'Multi-column aggregations & HAVING clauses implemented', completed: false },
      { id: 'c1_5', title: 'Multi-table INNER, LEFT, and SELF JOIN analytics', completed: false },
      { id: 'c1_6', title: 'Subquery and CTE financial breakdown queries', completed: false },
      { id: 'c1_7', title: 'Final project documentation & query portfolio published', completed: false },
    ],
  },
  {
    id: 'proj_m2',
    month_number: 2,
    title: '4-Tier Analytics Database Engine',
    description: 'Production architecture transforming raw ingestion into staging, clean deduplicated data, and materialized analytics tables.',
    architecture_diagram: 'Raw Tables -> Staging Tables -> Clean Tables -> Analytics Tables',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c2_1', title: 'Raw tables ingestion schema with audit timestamps', completed: false },
      { id: 'c2_2', title: 'Staging layer with cast validations & normalization', completed: false },
      { id: 'c2_3', title: 'Clean layer with window functions (ROW_NUMBER deduplication)', completed: false },
      { id: 'c2_4', title: 'Materialized analytics tables with cumulative metrics', completed: false },
      { id: 'c2_5', title: 'B-Tree & composite index performance tuning with EXPLAIN', completed: false },
      { id: 'c2_6', title: 'ACID transactional procedures with rollback triggers', completed: false },
    ],
  },
  {
    id: 'proj_m3',
    month_number: 3,
    title: 'CSV -> Python -> Data Profiling -> Postgres ETL',
    description: 'Automated ingestion pipeline that validates incoming CSVs, profiles column distributions, transforms types, and batch loads to PostgreSQL.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c3_1', title: 'Python environment, type hints & dataclasses setup', completed: false },
      { id: 'c3_2', title: 'Pandas automated cleaning module (fillna, drop_duplicates)', completed: false },
      { id: 'c3_3', title: 'Data profiling statistics generator with JSON output', completed: false },
      { id: 'c3_4', title: 'Postgres bulk insertion engine with psycopg3 / SQLAlchemy', completed: false },
    ],
  },
  {
    id: 'proj_m4',
    month_number: 4,
    title: 'Data Quality & Anomaly Detection Engine',
    description: 'Automated telemetry validator detecting null spikes, volume changes, invalid ranges, and multivariate outliers via Isolation Forest.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c4_1', title: 'Distribution metric suite (Mean, Z-score, IQR, Rolling avg)', completed: false },
      { id: 'c4_2', title: 'Referential integrity & schema drift assertions', completed: false },
      { id: 'c4_3', title: 'Scikit-learn Isolation Forest anomaly scoring model', completed: false },
      { id: 'c4_4', title: 'Automated alert trigger and validation reporting', completed: false },
    ],
  },
  {
    id: 'proj_m5',
    month_number: 5,
    title: 'End-to-End Time Series Forecasting System',
    description: 'Historical trend decomposition, stationarity testing, and ARIMA/Exponential Smoothing forecasting with backtested error metrics.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c5_1', title: 'Time series cleaning, resample, and seasonality decomposition', completed: false },
      { id: 'c5_2', title: 'Stationarity transformation (differencing, Dickey-Fuller)', completed: false },
      { id: 'c5_3', title: 'ARIMA & Exponential Smoothing model training', completed: false },
      { id: 'c5_4', title: 'Evaluation metrics benchmark (MAE, MSE, RMSE, MAPE)', completed: false },
    ],
  },
  {
    id: 'proj_m6',
    month_number: 6,
    title: 'Natural Language to Validated SQL Engine',
    description: 'Schema-aware text-to-SQL engine with JSON tool schema, SQL AST verification, execution sandbox, and natural language result explanation.',
    architecture_diagram: 'User Question -> Schema Context -> LLM -> Generated SQL -> AST Validation -> DB Execution -> Result -> AI Explanation',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c6_1', title: 'Schema extraction and prompt context manager', completed: false },
      { id: 'c6_2', title: 'LLM structured output with Gemini function calling', completed: false },
      { id: 'c6_3', title: 'SQL safety validator & read-only AST parser', completed: false },
      { id: 'c6_4', title: 'Interactive natural language QA with tabular results', completed: false },
    ],
  },
  {
    id: 'proj_m7',
    month_number: 7,
    title: 'Airflow Orchestrated 8-Stage Autonomous Pipeline',
    description: 'INGEST -> PROFILE -> CLEAN -> TRANSFORM -> VALIDATE -> ANOMALY -> FORECAST -> REPORT orchestrated with custom Airflow operators and agentic recovery.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c7_1', title: 'Airflow local standalone setup & DAG definition', completed: false },
      { id: 'c7_2', title: 'Task dependencies, retry schedules, and Slack/email alerts', completed: false },
      { id: 'c7_3', title: 'Agentic recovery worker inspecting task failures', completed: false },
      { id: 'c7_4', title: 'End-to-end multi-stage pipeline run & report export', completed: false },
    ],
  },
  {
    id: 'proj_m8',
    month_number: 8,
    title: 'High-Throughput Go REST API & React Dashboard',
    description: 'Go backend with chi/gin router, JWT auth, connection pool, and Goroutines serving an analytical React UI with dynamic charts.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c8_1', title: 'Go HTTP server structure, middleware, and JWT validation', completed: false },
      { id: 'c8_2', title: 'Postgres connection pooling and concurrent queries', completed: false },
      { id: 'c8_3', title: 'React frontend with TypeScript, custom hooks, and Tailwind', completed: false },
      { id: 'c8_4', title: 'Interactive analytical data tables and time-series charts', completed: false },
    ],
  },
  {
    id: 'proj_m9',
    month_number: 9,
    title: 'Multi-Service Containerized Cloud Deployment',
    description: 'Production Dockerfile, multi-stage builds, Docker Compose stack for React + Go + Airflow + Postgres, with GitHub Actions CI/CD.',
    progress_percentage: 0,
    status: 'NOT_STARTED',
    checklist: [
      { id: 'c9_1', title: 'Multi-stage Dockerfiles for frontend, Go backend, and Python tasks', completed: false },
      { id: 'c9_2', title: 'Docker Compose networking, volume persistence, and env config', completed: false },
      { id: 'c9_3', title: 'GitHub Actions automated build, lint, and test workflow', completed: false },
      { id: 'c9_4', title: 'Production Cloud deployment with health checks & log telemetry', completed: false },
    ],
  },
];

export const TOPICS_SEED: Topic[] = [
  // Month 1: SQL Foundations
  { id: 'top_select_from', name: 'SELECT & FROM', description: 'Table projection and foundational relational queries.', technology: 'SQL', difficulty: 'BEGINNER', base_importance: 85, base_difficulty: 30, estimated_minutes: 60, quiz_accuracy: 98, completed_tasks_count: 5, total_tasks_count: 5 },
  { id: 'top_where_ops', name: 'WHERE & Comparison Operators', description: 'Filtering rows with AND, OR, NOT, IN, BETWEEN, and NULL handling.', technology: 'SQL', difficulty: 'BEGINNER', base_importance: 90, base_difficulty: 35, estimated_minutes: 90, quiz_accuracy: 95, completed_tasks_count: 6, total_tasks_count: 6 },
  { id: 'top_sort_limit', name: 'ORDER BY & LIMIT / DISTINCT', description: 'Ordering result sets, deduplicating records, and pagination.', technology: 'SQL', difficulty: 'BEGINNER', base_importance: 80, base_difficulty: 30, estimated_minutes: 60, quiz_accuracy: 94, completed_tasks_count: 4, total_tasks_count: 4 },
  { id: 'top_aggregations', name: 'GROUP BY & Aggregations', description: 'COUNT, SUM, AVG, MIN, MAX, and HAVING filter conditions.', technology: 'SQL', difficulty: 'BEGINNER', base_importance: 95, base_difficulty: 55, estimated_minutes: 120, quiz_accuracy: 91, completed_tasks_count: 8, total_tasks_count: 8 },
  { id: 'top_joins', name: 'INNER, LEFT, RIGHT & FULL JOINs', description: 'Relational algebra joins, cardinality, join keys, and multi-table joins.', technology: 'SQL', difficulty: 'INTERMEDIATE', base_importance: 98, base_difficulty: 65, estimated_minutes: 180, quiz_accuracy: 88, completed_tasks_count: 10, total_tasks_count: 10 },
  { id: 'top_subqueries_ctes', name: 'Subqueries & CTEs', description: 'Common Table Expressions (WITH clauses), correlated subqueries, and modular query design.', technology: 'SQL', difficulty: 'INTERMEDIATE', base_importance: 92, base_difficulty: 70, estimated_minutes: 150, quiz_accuracy: 74, completed_tasks_count: 7, total_tasks_count: 10 },
  
  // Month 2: Advanced SQL + Database Engineering
  { id: 'top_window_functions', name: 'SQL Window Functions', description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and OVER(PARTITION BY ... ORDER BY).', technology: 'Database Engineering', difficulty: 'ADVANCED', base_importance: 95, base_difficulty: 85, estimated_minutes: 240, quiz_accuracy: 61, completed_tasks_count: 5, total_tasks_count: 12 },
  { id: 'top_recursive_ctes', name: 'Recursive CTEs & Hierarchies', description: 'Recursive queries for tree traversal, organizational charts, and graph pathfinding.', technology: 'Database Engineering', difficulty: 'ADVANCED', base_importance: 82, base_difficulty: 88, estimated_minutes: 120, quiz_accuracy: 68, completed_tasks_count: 2, total_tasks_count: 5 },
  { id: 'top_indexes_plans', name: 'Query Plans & B-Tree Indexing', description: 'EXPLAIN ANALYZE, index scan vs sequential scan, composite indexes, and index selectivity.', technology: 'Database Engineering', difficulty: 'ADVANCED', base_importance: 90, base_difficulty: 80, estimated_minutes: 180, quiz_accuracy: 65, completed_tasks_count: 3, total_tasks_count: 6 },
  { id: 'top_transactions_acid', name: 'Transactions & ACID Guarantees', description: 'Isolation levels, dirty reads, non-repeatable reads, phantom reads, and WAL logging.', technology: 'Database Engineering', difficulty: 'ADVANCED', base_importance: 88, base_difficulty: 75, estimated_minutes: 120, quiz_accuracy: 70, completed_tasks_count: 2, total_tasks_count: 4 },

  // Month 3: Python Data Engineering
  { id: 'top_python_fundamentals', name: 'Python OOP & Type Hints', description: 'Classes, dunder methods, inheritance, type annotations, and custom exception handling.', technology: 'Python & Pandas', difficulty: 'BEGINNER', base_importance: 85, base_difficulty: 45, estimated_minutes: 150, quiz_accuracy: 88, completed_tasks_count: 4, total_tasks_count: 8 },
  { id: 'top_pandas_transformations', name: 'Pandas DataFrames & Vectorization', description: 'read_csv, read_json, merge, groupby, apply, fillna, drop_duplicates, and vectorized logic.', technology: 'Python & Pandas', difficulty: 'INTERMEDIATE', base_importance: 96, base_difficulty: 65, estimated_minutes: 240, quiz_accuracy: 80, completed_tasks_count: 3, total_tasks_count: 10 },

  // Month 4: Statistics & Data Quality
  { id: 'top_data_quality_stats', name: 'Descriptive Stats & Z-Score / IQR', description: 'Mean, variance, standard deviation, distributions, outlier detection with Z-score and IQR.', technology: 'Statistics & Quality', difficulty: 'INTERMEDIATE', base_importance: 90, base_difficulty: 68, estimated_minutes: 180, quiz_accuracy: 72, completed_tasks_count: 2, total_tasks_count: 8 },
  { id: 'top_anomaly_detection', name: 'Isolation Forests & Drift Detection', description: 'Unsupervised outlier detection, schema drift, referential completeness, and freshness monitoring.', technology: 'Statistics & Quality', difficulty: 'ADVANCED', base_importance: 92, base_difficulty: 82, estimated_minutes: 180, quiz_accuracy: 65, completed_tasks_count: 1, total_tasks_count: 7 },

  // Month 5: Forecasting
  { id: 'top_time_series_arima', name: 'Time Series Decomposition & ARIMA', description: 'Trend, seasonality, noise, stationarity tests (ADF), differencing, and ARIMA parameter tuning.', technology: 'Time Series & ML', difficulty: 'ADVANCED', base_importance: 88, base_difficulty: 85, estimated_minutes: 200, quiz_accuracy: 60, completed_tasks_count: 0, total_tasks_count: 6 },

  // Month 6: AI / LLM / Text-to-SQL
  { id: 'top_llm_fundamentals', name: 'LLM APIs, Prompting & Function Calling', description: 'Prompt structuring, JSON schema enforcement, tool invocation, token management, and grounding.', technology: 'AI & LLMs', difficulty: 'INTERMEDIATE', base_importance: 94, base_difficulty: 70, estimated_minutes: 180, quiz_accuracy: 75, completed_tasks_count: 1, total_tasks_count: 7 },
  { id: 'top_text_to_sql', name: 'Schema-Aware Text-to-SQL & Validation', description: 'Database catalog extraction, schema grounding, AST verification, and execution guardrails.', technology: 'AI & LLMs', difficulty: 'ADVANCED', base_importance: 96, base_difficulty: 85, estimated_minutes: 240, quiz_accuracy: 68, completed_tasks_count: 0, total_tasks_count: 8 },

  // Month 7: Airflow & Agents
  { id: 'top_airflow_dags', name: 'Apache Airflow DAGs & Operators', description: 'DAG authoring, PythonOperator, BashOperator, sensor tasks, XComs, scheduling, and SLAs.', technology: 'Airflow & Agents', difficulty: 'ADVANCED', base_importance: 95, base_difficulty: 80, estimated_minutes: 220, quiz_accuracy: 62, completed_tasks_count: 0, total_tasks_count: 8 },
  { id: 'top_ai_agents_orchestration', name: 'Autonomous Agents & Human-in-the-Loop', description: 'ReAct patterns, planning loops, error diagnosis, automated recovery, and state persistence.', technology: 'Airflow & Agents', difficulty: 'ADVANCED', base_importance: 92, base_difficulty: 88, estimated_minutes: 200, quiz_accuracy: 55, completed_tasks_count: 0, total_tasks_count: 6 },

  // Month 8: Go Backend & React
  { id: 'top_go_rest_api', name: 'Go HTTP, Routing & Goroutines', description: 'net/http, chi router, structs, JSON serialization, middleware, and concurrent worker pools.', technology: 'Go & React', difficulty: 'INTERMEDIATE', base_importance: 90, base_difficulty: 75, estimated_minutes: 220, quiz_accuracy: 70, completed_tasks_count: 1, total_tasks_count: 8 },
  { id: 'top_react_dashboard', name: 'React 19, TypeScript & Charts', description: 'Component state, custom data hooks, loading states, error boundaries, and Recharts integration.', technology: 'Go & React', difficulty: 'INTERMEDIATE', base_importance: 90, base_difficulty: 65, estimated_minutes: 200, quiz_accuracy: 82, completed_tasks_count: 2, total_tasks_count: 7 },

  // Month 9: DevOps & Cloud
  { id: 'top_docker_containers', name: 'Docker, Multi-Stage Builds & Compose', description: 'Writing efficient Dockerfiles, layer caching, bridge networks, volumes, and multi-container Compose.', technology: 'Docker & Cloud DevOps', difficulty: 'INTERMEDIATE', base_importance: 94, base_difficulty: 72, estimated_minutes: 180, quiz_accuracy: 78, completed_tasks_count: 0, total_tasks_count: 7 },
  { id: 'top_cicd_cloud_deploy', name: 'GitHub Actions CI/CD & Cloud Run', description: 'Automated test pipelines, secret injection, container registry pushes, and zero-downtime deploys.', technology: 'Docker & Cloud DevOps', difficulty: 'ADVANCED', base_importance: 92, base_difficulty: 80, estimated_minutes: 200, quiz_accuracy: 70, completed_tasks_count: 0, total_tasks_count: 6 },
];

export const RESOURCES_SEED: Resource[] = [
  {
    id: 'res_sql_basics_01',
    topic_id: 'top_select_from',
    topic_name: 'SELECT & FROM',
    title: 'SQL Basics for Beginners: Learn SQL In 20 Minutes',
    url: 'https://www.youtube.com/watch?v=27axs9dO7AE',
    platform: 'YouTube',
    channel: 'Alex The Analyst',
    duration_minutes: 20,
    difficulty: 'BEGINNER',
    relevance_score: 99,
    published_at: '2024-02-10',
    is_recommended: true,
  },
  {
    id: 'res_sql_select_02',
    topic_id: 'top_select_from',
    topic_name: 'SELECT & FROM',
    title: 'SQL SELECT and Column Aliasing: Core Database Foundations',
    url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
    platform: 'YouTube',
    channel: 'Programming with Mosh',
    duration_minutes: 25,
    difficulty: 'BEGINNER',
    relevance_score: 96,
    published_at: '2024-01-15',
    is_recommended: true,
  },
  {
    id: 'res_window_func_01',
    topic_id: 'top_window_functions',
    topic_name: 'SQL Window Functions',
    title: 'SQL Window Functions Explained: Complete Visual Guide',
    url: 'https://www.youtube.com/watch?v=Ww71knvhQ-s',
    platform: 'YouTube',
    channel: 'Alex The Analyst',
    duration_minutes: 28,
    difficulty: 'INTERMEDIATE',
    relevance_score: 98,
    published_at: '2024-03-15',
    is_recommended: true,
  },
  {
    id: 'res_window_func_02',
    topic_id: 'top_window_functions',
    topic_name: 'SQL Window Functions',
    title: 'ROW_NUMBER vs RANK vs DENSE_RANK in Depth with Practical Queries',
    url: 'https://www.youtube.com/watch?v=T_s_Pj8L5E4',
    platform: 'YouTube',
    channel: 'Luke Barousse',
    duration_minutes: 18,
    difficulty: 'BEGINNER',
    relevance_score: 95,
    published_at: '2024-05-10',
    is_recommended: true,
  },
  {
    id: 'res_window_func_03',
    topic_id: 'top_window_functions',
    topic_name: 'SQL Window Functions',
    title: 'Advanced SQL Window Functions: LAG, LEAD, Moving Averages & Frames',
    url: 'https://www.youtube.com/watch?v=D5h3qf_8W9E',
    platform: 'YouTube',
    channel: 'Seattle Data Guy',
    duration_minutes: 42,
    difficulty: 'ADVANCED',
    relevance_score: 91,
    published_at: '2024-06-20',
    is_recommended: true,
  },
  {
    id: 'res_cte_01',
    topic_id: 'top_subqueries_ctes',
    topic_name: 'Subqueries & CTEs',
    title: 'Mastering SQL CTEs (Common Table Expressions) and Recursive Logic',
    url: 'https://www.youtube.com/watch?v=7h1s9mJ4m_M',
    platform: 'YouTube',
    channel: 'Hussein Nasser',
    duration_minutes: 32,
    difficulty: 'INTERMEDIATE',
    relevance_score: 94,
    published_at: '2024-01-18',
    is_recommended: true,
  },
  {
    id: 'res_airflow_01',
    topic_id: 'top_airflow_dags',
    topic_name: 'Apache Airflow DAGs & Operators',
    title: 'Apache Airflow Complete Crash Course for Data Engineers',
    url: 'https://www.youtube.com/watch?v=IH1-0hwFBRQ',
    platform: 'YouTube',
    channel: 'Marc Lamberti',
    duration_minutes: 45,
    difficulty: 'INTERMEDIATE',
    relevance_score: 96,
    published_at: '2024-04-02',
    is_recommended: true,
  },
  {
    id: 'res_llm_sql_01',
    topic_id: 'top_text_to_sql',
    topic_name: 'Schema-Aware Text-to-SQL & Validation',
    title: 'Building Production Text-to-SQL Systems: LLM Schema Validation & AST Guardrails',
    url: 'https://www.youtube.com/watch?v=F3G8nJ5P3rQ',
    platform: 'YouTube',
    channel: 'DataTalksClub',
    duration_minutes: 38,
    difficulty: 'ADVANCED',
    relevance_score: 97,
    published_at: '2024-07-11',
    is_recommended: true,
  },
];
