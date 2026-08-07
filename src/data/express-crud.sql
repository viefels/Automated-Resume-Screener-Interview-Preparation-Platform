DROP TABLE IF EXISTS "public"."Users";
DROP TABLE IF EXISTS "public"."Resumes";
DROP TABLE IF EXISTS "public"."JobQuestions";
DROP TABLE IF EXISTS "public"."Jobs";
-- Sequence and defined type
DROP TYPE IF EXISTS "public"."enum_Users_role";
CREATE TYPE "public"."enum_Users_role" AS ENUM ('candidate', 'recruiter');

-- Table Definition
CREATE TABLE "public"."Users" (
    "id" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "passwordHash" varchar(255) NOT NULL,
    "role" "public"."enum_Users_role" NOT NULL,
    "hasResume" bool DEFAULT false,
    "resumeOverview" jsonb,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."Resumes" (
    "userId" varchar(255) NOT NULL,
    "basics" jsonb,
    "skills" jsonb,
    "workExperience" jsonb,
    "education" jsonb,
    "projects" jsonb,
    "certifications" jsonb,
    "languages" jsonb,
    "feedback" jsonb,
    "keywords" jsonb,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    PRIMARY KEY ("userId")
);

-- Table Definition
CREATE TABLE "public"."JobQuestions" (
    "jobId" varchar(255) NOT NULL,
    "questions" jsonb,
    PRIMARY KEY ("jobId")
);

-- Table Definition
CREATE TABLE "public"."Jobs" (
    "id" varchar(255) NOT NULL,
    "recruiterId" varchar(255),
    "jobTitle" varchar(255),
    "companyName" varchar(255),
    "jobDescription" text,
    "salaryRange" jsonb,
    "location" varchar(255),
    "keywords" jsonb,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "jobType" varchar(255),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."Users" ("id", "email", "passwordHash", "role", "hasResume", "resumeOverview", "createdAt", "updatedAt") VALUES
('user-0f2843df-7e52-4e93-bd14-2df71738e16a', 'oliveiramigul@angel.com', '$2b$10$jmQtSpbu0TbxvFqMLMgeE.YBK.Rm8eddhx1zqyNIFvryjtg6vIsu2', 'candidate', 'f', NULL, '2026-08-05 00:20:41.351+00', '2026-08-06 21:38:54.234+00'),
('user-45ffe10b-567e-430a-8588-cf7cd809e8cb', 'oliveiramigu@angel.com', '$2b$10$GDjYKgvQ0yWwRczlTO2Wh.dxLkRNu4EN6FEFxGbDonOs7hCp5IFpm', 'recruiter', 'f', NULL, '2026-08-05 00:28:47.889+00', '2026-08-06 21:38:54.241+00'),
('user-4ada2356-9f9b-43d8-adf9-d9931661a592', 'oliveiramigu@ange.com', '$2b$10$nVR.y9Wi3yA7t0e2zHgYxe4kd9LAAG1K0iSgr0iCdTOvmNOXPaxDO', 'recruiter', 'f', NULL, '2026-08-06 23:25:43.809+00', '2026-08-06 23:25:43.809+00'),
('user-7bb59cf2-c102-421f-9bb6-7835c31cab6c', 'user@example.com', '$2b$10$mti9UIErgphvihNvohEfS.AaMeNjw11L35eg.8b9gp6zMJgVknh8m', 'candidate', 't', NULL, '2026-08-06 21:52:20.032+00', '2026-08-06 23:14:20.512+00'),
('user-ef380f59-10e4-4938-be9c-670fd96e3930', 'oliveiramiguel@angel.com', '$2b$10$BqSbjnzQI9ElWhdXWnYFde6zfmiYHxi/Fe.uUK5V.gddy99CFSfVa', 'candidate', 'f', NULL, '2026-08-04 15:33:36.698+00', '2026-08-06 21:38:54.217+00');
INSERT INTO "public"."Resumes" ("userId", "basics", "skills", "workExperience", "education", "projects", "certifications", "languages", "feedback", "keywords", "createdAt", "updatedAt") VALUES
('user-7bb59cf2-c102-421f-9bb6-7835c31cab6c', '{"dob": "10/21/1992", "email": "olimiguellldls888@gmail.com", "links": [], "phone": [], "summary": "Highly motivated Data Scientist with expertise in machine learning, statistical modeling, and big data analytics, specializing in remote-based projects and international collaborations. Experienced in delivering data-driven insights for businesses in technology, finance, healthcare, and e-commerce sectors. Passionate about leveraging data to optimize operations, forecast trends, and build predictive models.", "fullName": "OLIVEIRA MIGUEL ANGEL", "location": {"city": "ALTON", "country": "United States"}, "fullAddress": "3714 E HARDING AVE ALTON, Texas 78573", "nationality": ["American"], "maritalStatus": "Single", "totalYearsExperience": 4.5}', '{"technical": ["Python", "R", "SQL", "MATLAB", "Machine Learning", "scikit-learn", "TensorFlow", "PyTorch", "MySQL", "PostgreSQL", "MongoDB"], "toolsAndFrameworks": ["Tableau", "Power BI", "Matplotlib", "Seaborn"]}', '[{"company": "Freelance (Global Clients)", "endDate": "Present", "jobTitle": "Remote Data Scientist", "location": "Remote", "startDate": "2022-01", "highlights": ["Delivered data-driven business insights for startups across North America, Europe, and Asia.", "Developed and deployed machine learning models for customer segmentation, demand forecasting, and fraud detection.", "Built interactive dashboards and data visualization reports using Power BI and Tableau.", "Increased business efficiency for clients by up to 30% through data-informed recommendations."]}, {"company": "Texas FinTech Solutions", "endDate": "2021-12", "jobTitle": "Junior Data Scientist", "location": "Austin", "startDate": "2020-06", "highlights": ["Assisted in credit risk modeling using logistic regression and random forest.", "Conducted real-time transaction data analysis to detect anomalies and fraud cases.", "Implemented data pipelines for ETL processes using Python and SQL.", "Collaborated remotely with cross-border teams for predictive analytics projects."]}, {"company": "North America Digital Research Hub", "endDate": "2020-05", "jobTitle": "Data Analyst Intern", "location": "Houston", "startDate": "2019-08", "highlights": ["Performed exploratory data analysis (EDA) on large datasets.", "Cleaned, pre-processed, and structured raw data for modeling.", "Prepared monthly reports on consumer digital behavior.", "Presented insights to researchers and partner companies."]}]', '[{"gpa": "3.85/4.0", "degree": "Bachelor of Science", "honors": null, "endDate": "2021", "startDate": "2017", "institution": "University of Texas at Austin (UT Austin)", "fieldOfStudy": "Data Science & Big Data Analytics"}]', '[{"link": null, "name": "E-Commerce Sales Forecasting", "description": "Built a time-series forecasting model (ARIMA, Prophet) to predict monthly sales. Helped an e-commerce client improve inventory management and reduce overstock by 18%.", "technologiesUsed": ["ARIMA", "Prophet"]}, {"link": null, "name": "Healthcare Predictive Analytics", "description": "Collaborated with a remote healthcare startup to develop a predictive model for patient readmission. Used Python (scikit-learn, XGBoost) to improve accuracy to 92%.", "technologiesUsed": ["Python", "scikit-learn", "XGBoost"]}, {"link": null, "name": "Fraud Detection Model", "description": "Designed a real-time fraud detection system for a fintech company. Reduced false positives by 25%, saving operational costs.", "technologiesUsed": []}, {"link": null, "name": "Social Media Sentiment Analysis", "description": "Scraped and analyzed Twitter and Facebook data for brand monitoring. Conducted NLP-based sentiment analysis with Python''s NLTK and spaCy.", "technologiesUsed": ["Python", "NLTK", "spaCy"]}]', '[]', '[{"fluency": "Native", "language": "English"}, {"fluency": "Fluent", "language": "Spanish"}, {"fluency": "Intermediate", "language": "Japanese"}]', '{"targetRole": "Data Scientist", "overallMatch": {"score": "88%", "remarks": "Strong profile for Data Scientist roles with solid hands-on experience in predictive modeling, statistical analysis, and remote teamwork.", "sectionScores": {"keywords": "85%", "formatting": "92%", "actionVerbs": "87%"}}, "keyHighlights": ["Clear quantifiable achievements across work and project experiences.", "Solid educational background in Data Science with a high GPA.", "Broad stack covering ML algorithms, visualization tools, and database systems."], "actionableFeedback": ["Include candidate personal phone number in the contact header.", "Add direct URLs to project repositories or portfolio demonstrations.", "Provide specific certifications if available to strengthen technical credibility."]}', '["Data Scientist", "Machine Learning", "Python", "SQL", "R", "MATLAB", "scikit-learn", "TensorFlow", "PyTorch", "Tableau", "Power BI", "MySQL", "PostgreSQL", "MongoDB", "ETL", "ARIMA", "Prophet", "XGBoost", "NLP", "spaCy", "NLTK", "Predictive Analytics", "Fraud Detection", "Time-Series Forecasting"]', '2026-08-06 22:53:42.42+00', '2026-08-06 23:11:32.634+00'),
('user-ef380f59-10e4-4938-be9c-670fd96e3930', '{"dob": "10/21/1990", "email": "olimiguel888@gmail.com", "links": [], "phone": [], "summary": "Highly motivated Data Scientist with expertise in machine learning, statistical modeling, and big data analytics, specializing in remote-based projects and international collaborations. Experienced in delivering data-driven insights for businesses in technology, finance, healthcare, and e-commerce sectors.", "fullName": "OLIVEIRA MIGUEL ANGEL", "location": {"city": "ALTON", "country": "United States"}, "fullAddress": "3714 E HARDING AVE ALTON, Texas 78573", "nationality": ["American"], "maritalStatus": "Single", "totalYearsExperience": 4.5}', '{"technical": ["Python", "R", "SQL", "MATLAB", "Machine Learning", "scikit-learn", "TensorFlow", "PyTorch", "Statistical Modeling", "ETL", "NLP", "Predictive Analytics"], "toolsAndFrameworks": ["Tableau", "Power BI", "Matplotlib", "Seaborn", "MySQL", "PostgreSQL", "MongoDB"]}', '[{"company": "Freelance (Global Clients)", "endDate": "Present", "jobTitle": "Remote Data Scientist", "location": "Remote", "startDate": "2022-01", "highlights": ["Delivered data-driven business insights for startups across North America, Europe, and Asia.", "Developed and deployed machine learning models for customer segmentation, demand forecasting, and fraud detection.", "Built interactive dashboards and data visualization reports using Power BI and Tableau.", "Increased business efficiency for clients by up to 30% through data-informed recommendations."]}, {"company": "Texas FinTech Solutions", "endDate": "2021-12", "jobTitle": "Junior Data Scientist", "location": "Austin", "startDate": "2020-06", "highlights": ["Assisted in credit risk modeling using logistic regression and random forest.", "Conducted real-time transaction data analysis to detect anomalies and fraud cases.", "Implemented data pipelines for ETL processes using Python and SQL.", "Collaborated remotely with cross-border teams for predictive analytics projects."]}, {"company": "North America Digital Research Hub", "endDate": "2020-05", "jobTitle": "Data Analyst Intern", "location": "Houston", "startDate": "2019-08", "highlights": ["Performed exploratory data analysis (EDA) on large datasets.", "Cleaned, pre-processed, and structured raw data for modeling.", "Prepared monthly reports on consumer digital behavior.", "Presented insights to researchers and partner companies."]}]', '[{"gpa": "3.85/4.0", "degree": "Bachelor of Science", "honors": null, "endDate": "2021", "startDate": "2017", "institution": "University of Texas at Austin (UT Austin)", "fieldOfStudy": "Data Science & Big Data Analytics"}]', '[{"link": null, "name": "E-Commerce Sales Forecasting", "description": "Built a time-series forecasting model (ARIMA, Prophet) to predict monthly sales. Helped an e-commerce client improve inventory management and reduce overstock by 18%.", "technologiesUsed": ["ARIMA", "Prophet", "Python"]}, {"link": null, "name": "Healthcare Predictive Analytics", "description": "Collaborated with a remote healthcare startup to develop a predictive model for patient readmission. Used Python to improve accuracy to 92%.", "technologiesUsed": ["Python", "scikit-learn", "XGBoost"]}, {"link": null, "name": "Fraud Detection Model", "description": "Designed a real-time fraud detection system for a fintech company. Reduced false positives by 25%, saving operational costs.", "technologiesUsed": ["Python", "Machine Learning"]}, {"link": null, "name": "Social Media Sentiment Analysis", "description": "Scraped and analyzed Twitter and Facebook data for brand monitoring. Conducted NLP-based sentiment analysis.", "technologiesUsed": ["Python", "NLTK", "spaCy"]}]', '[]', '[{"fluency": "Native", "language": "English"}, {"fluency": "Fluent", "language": "Spanish"}, {"fluency": "Intermediate", "language": "Japanese"}]', '{"targetRole": "Data Scientist", "overallMatch": {"score": "88%", "remarks": "Strong background in data science, predictive modeling, and analytics with solid practical project experience.", "sectionScores": {"keywords": "85%", "formatting": "90%", "actionVerbs": "88%"}}, "keyHighlights": ["Strong technical stack including Python, SQL, TensorFlow, and Tableau", "Demonstrated impact with quantified achievements (e.g., 30% efficiency increase, 18% overstock reduction)", "Solid academic foundation in Data Science with a 3.85 GPA"], "actionableFeedback": ["Include explicit metrics for machine learning deployment environments", "Add links to GitHub or portfolio to showcase open-source contributions and Kaggle projects"]}', '["Data Scientist", "Data Analyst", "Machine Learning", "Python", "SQL", "R", "TensorFlow", "PyTorch", "scikit-learn", "Tableau", "Power BI", "ETL", "Predictive Analytics", "Big Data", "NLP", "Exploratory Data Analysis"]', '2026-08-06 21:38:54.246+00', '2026-08-06 21:38:54.246+00');
INSERT INTO "public"."JobQuestions" ("jobId", "questions") VALUES
('009', '[{"id": "q1", "hints": ["Focus on high volume of failed logins from distinct IPs targeting multiple accounts within a short timeframe.", "Mention specific fields like source IP, user agent, HTTP status codes, and failure counts.", "Discuss thresholding and aggregation techniques in Splunk SPL or Elasticsearch KQL/EQL."], "context": "Evaluates hands-on log analysis skills using industry-standard SIEM tools and the candidate''s understanding of authentication threat patterns.", "category": "SIEM & Log Analysis", "question": "How do you construct a SIEM search query in Splunk or Elastic to detect a potential credential stuffing attack on an authentication endpoint?", "evaluationRubric": {"levels": {"1": "Shows minimal understanding of SIEM concepts; unable to explain basic query logic.", "2": "Understands credential stuffing theoretically but struggles to formulate specific SIEM queries or logic.", "3": "Provides a working basic query structure identifying failed logins by IP or account threshold.", "4": "Formulates an accurate, optimized query grouping by IP/User Agent with time-charting and dynamic thresholding.", "5": "Demonstrates advanced query crafting, accounts for false positives (e.g., NAT gateways), and details follow-up automated alerting/response."}, "scoringScale": "1-5"}}, {"id": "q2", "hints": ["Consider immediate containment actions like revoking active sessions or disabling keys.", "Explain how to check CloudTrail logs to trace actions performed by the compromised key.", "Address root cause isolation (e.g., exposed instance metadata service, hardcoded credentials)."], "context": "Assesses practical AWS security knowledge, incident response procedures, and familiarity with AWS native security tools.", "category": "AWS Security", "question": "If AWS GuardDuty triggers an alert stating that an IAM access key associated with a production EC2 instance is being used from an unknown external IP address, what steps do you take to investigate and remediate?", "evaluationRubric": {"levels": {"1": "Fails to identify appropriate AWS tools or escalation pathways for key compromise.", "2": "Suggests basic remediation like deleting the key, but misses log analysis or root cause investigation.", "3": "Outlines a sound standard incident response process: containment (key deactivation), investigation (CloudTrail), and remediation.", "4": "Provides a comprehensive response including CloudTrail analysis, evaluation of Instance Metadata Service (IMDSv2), and policy adjustments.", "5": "Covers end-to-end response including automated containment scripts (AWS Lambda/GuardDuty integration), forensic logging, and post-incident prevention."}, "scoringScale": "1-5"}}, {"id": "q3", "hints": ["Mention key `boto3` methods for checking S3 bucket ACLs and Public Access Blocks.", "Discuss error handling, multi-region/multi-account handling, and reporting formats (JSON/CSV).", "Consider how to execute the script securely without embedding static credentials."], "context": "Evaluates proficiency in writing operational security scripts using Python to automate security audits in AWS.", "category": "Python Automation", "question": "Walk me through how you would write a Python script using `boto3` to automatically identify and flag all publicly accessible S3 buckets across an AWS organization.", "evaluationRubric": {"levels": {"1": "Lacks basic Python or AWS SDK knowledge required to script cloud interactions.", "2": "Understands `boto3` conceptually but cannot explain how to inspect S3 bucket policies or access controls programmatically.", "3": "Outlines a working Python script that iterates through buckets and checks public ACLs or bucket policies.", "4": "Describes a robust script evaluating both bucket policies and S3 Block Public Access settings with proper exception handling.", "5": "Designs an efficient, scalable script utilizing IAM roles, handling multi-account pagination, and integrating with notification queues (e.g., SNS or Slack alerts)."}, "scoringScale": "1-5"}}, {"id": "q4", "hints": ["Reference MITRE ATT&CK techniques associated with lateral movement (e.g., Pass-the-Hash, PsExec, SSH key misuse, RDP hijacking).", "Discuss data sources required such as Windows Event Logs (4624/4625), endpoint EDR, and network flow logs.", "Explain how hypothesis-driven hunting differs from reactive alert triage."], "context": "Tests candidate''s experience in proactive threat hunting, knowledge of attacker techniques (MITRE ATT&CK), and log requirements.", "category": "Threat Hunting", "question": "Describe your methodology for conducting a proactive threat hunt for lateral movement within an enterprise environment.", "evaluationRubric": {"levels": {"1": "Confuses threat hunting with basic alert monitoring or reactive patch management.", "2": "Mentions basic network logs but lacks a structured framework or understanding of lateral movement indicators.", "3": "Outlines a valid hypothesis-based threat hunting process referencing core logs (e.g., authentication, process creation) and basic attacker techniques.", "4": "Aligns hunting strategies directly with MITRE ATT&CK matrix, specifying detailed event IDs and behavioral anomalies.", "5": "Demonstrates advanced hunting techniques combining endpoint, network, and cloud telemetry, and details how hunt results feed back into automated detection engineering."}, "scoringScale": "1-5"}}, {"id": "q5", "hints": ["Distinguish between scan severity scores (CVSS) and actual contextual risk to the business.", "Explain techniques for manual verification/proof-of-concept testing without causing downtime.", "Discuss strategies to minimize alert fatigue for development and operations teams."], "context": "Assesses hands-on vulnerability assessment experience, penetration testing mindset, and ability to eliminate false positives.", "category": "Penetration Testing & Vulnerability Management", "question": "How do you prioritize and validate critical vulnerabilities identified by an automated network/infrastructure vulnerability scanner before reporting them to engineering teams?", "evaluationRubric": {"levels": {"1": "Relies entirely on raw scanner output without contextual analysis or validation.", "2": "Understands CVSS scores but relies heavily on manual effort without clear prioritization criteria.", "3": "Explains practical steps for manual validation (e.g., using safe exploits or banner grabbing) and contextual risk scoring.", "4": "Demonstrates strong pen-testing methodology to verify exploitability while explaining contextual factors like network exposure and compensating controls.", "5": "Articulates a refined vulnerability pipeline integrating automated validation, risk-weighted scoring, clear remediation advice, and actionable PoC demonstrations."}, "scoringScale": "1-5"}}, {"id": "q6", "hints": ["Mention network segmentation policies, service meshes (Istio/Linkerd), and mTLS.", "Discuss AWS VPC CNI, security groups for pods/tasks, and zero-trust principles.", "Include monitoring network traffic flow logs for anomalous container communication."], "context": "Evaluates network security expertise in modern containerized cloud architectures.", "category": "Network Security", "question": "How do you approach securing microservices communicating across containerized environments (e.g., Kubernetes or AWS ECS) at the network layer?", "evaluationRubric": {"levels": {"1": "Has limited understanding of network security outside traditional perimeter firewalls.", "2": "Understands basic cloud network concepts (VPCs, Security Groups) but struggles with microservices security.", "3": "Describes effective network segmentation techniques using container network policies and mTLS.", "4": "Provides clear architecture strategies utilizing Service Mesh for encryption in transit, strict ingress/egress controls, and flow log analysis.", "5": "Designs a comprehensive zero-trust container network security architecture integrating identity-aware proxies, dynamic policy enforcement, and runtime anomaly detection."}, "scoringScale": "1-5"}}, {"id": "q7", "hints": ["Use the STAR method (Situation, Task, Action, Result).", "Focus on clear risk communication, finding temporary compensating controls, and adhering to incident leadership processes.", "Highlight business alignment and post-incident relationship management."], "context": "Tests communication skills, business acumen, crisis management, and ability to balance risk against operational downtime.", "category": "Behavioral & Incident Response", "question": "Describe a time when you were handling an active security incident and encountered pushback from a key operational or development team regarding containment measures (e.g., taking a system offline). How did you manage the situation?", "evaluationRubric": {"levels": {"1": "Displays poor communication skills or advocates for ignoring business impacts completely.", "2": "Gives a vague account without demonstrating effective negotiation or clear risk evaluation.", "3": "Describes a specific situation where risk was explained clearly, resulting in a mutually agreed containment approach.", "4": "Demonstrates strong leadership, presenting alternative mitigation options to minimize downtime while maintaining effective containment.", "5": "Exemplifies high emotional intelligence and executive communication under pressure, leveraging established incident response governance and building lasting trust with operations."}, "scoringScale": "1-5"}}, {"id": "q8", "hints": ["Pick a practical security problem: log parsing, certificate renewal tracking, automated patch verification, or IP reputation enrichment.", "Highlight script architecture, dependencies, error handling, and deployment (e.g., cron job, Lambda).", "Quantify time saved or reduction in manual oversight."], "context": "Evaluates hands-on experience in scripting for operational efficiency and security task automation.", "category": "Operational Scripting & Automation", "question": "Can you share an example of an operational security task you completely automated using Bash or Python? What was the problem, how did you build the script, and what was the impact?", "evaluationRubric": {"levels": {"1": "Unable to provide a concrete example of self-authored security scripts.", "2": "Describes simple, one-liner administrative scripts with limited security operational value.", "3": "Provides a clear example of a Python/Bash script solving an operational security issue with measurable efficiency gains.", "4": "Details a well-architected script featuring proper logging, robust error handling, secure credential management, and clear impact metrics.", "5": "Describes an enterprise-grade automation solution integrated into existing workflows (e.g., CI/CD, SIEM API, SOAR), demonstrating strong software engineering standards."}, "scoringScale": "1-5"}}]');
INSERT INTO "public"."Jobs" ("id", "recruiterId", "jobTitle", "companyName", "jobDescription", "salaryRange", "location", "keywords", "createdAt", "updatedAt", "jobType") VALUES
('001', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Data Scientist', 'DataPulse Analytics', 'We are seeking a Data Scientist to help turn complex dataset patterns into actionable business insights. You will work closely with product and marketing teams to build predictive models and automated dashboards.

Key Requirements:
- 3+ years of experience analyzing large datasets using Python and SQL.
- Practical experience building machine learning models for classification and regression.
- Ability to turn complex technical output into clear business insights.
- Expertise in data visualization tools like Tableau or PowerBI.

Bonus Points:
- Knowledge of BigQuery or Snowflake.
- Experience running A/B experiments at scale.', '{"max": 150000, "min": 115000}', 'Remote', '["Python", "SQL", "Scikit-Learn", "Pandas", "Tableau", "Data Scientist", "Machine Learning", "Predictive Modeling", "Data Visualization", "A/B Testing"]', '2026-08-02 09:15:00+00', '2026-08-06 21:38:54.254+00', 'Full-time'),
('002', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Backend Software Engineer', 'CloudScale Systems', 'We need a Backend Engineer to build scalable microservices for our core payment infrastructure. You will handle database architecture, system reliability, and API integrations.

Key Requirements:
- 4+ years of backend development experience with Node.js or Go.
- Solid experience with relational databases like PostgreSQL and caching with Redis.
- Hands-on practice building RESTful APIs and gRPC services.
- Deep understanding of system performance and concurrency.

Bonus Points:
- Experience handling financial transactions or payment gateway integrations.
- Familiarity with Kubernetes.', '{"max": 165000, "min": 125000}', 'San Francisco, CA (Hybrid)', '["Node.js", "Go", "PostgreSQL", "Docker", "Redis", "Backend Engineer", "Microservices", "REST API", "gRPC", "System Architecture"]', '2026-08-02 11:30:12.1+00', '2026-08-06 21:38:54.257+00', 'Full-time'),
('003', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Data Engineer', 'StreamData Co', 'Looking for a Data Engineer to design, build, and maintain real-time data pipelines. You will optimize our data warehouse and make sure data is clean and accessible across the company.

Key Requirements:
- 4+ years building ETL and ELT data pipelines.
- Advanced SQL skills and proficiency in Python.
- Direct experience with Apache Spark, Airflow, and cloud data warehouses like Snowflake or Redshift.
- Practice with data modeling principles and pipeline automation.

Bonus Points:
- Familiarity with streaming tools like Apache Kafka.
- Knowledge of dbt for data transformation.', '{"max": 170000, "min": 130000}', 'Remote', '["Apache Spark", "Python", "SQL", "Airflow", "Snowflake", "Data Engineer", "ETL", "ELT", "Data Warehousing", "Kafka"]', '2026-08-02 14:45:22.5+00', '2026-08-06 21:38:54.261+00', 'Full-time'),
('004', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'DevOps / Infrastructure Engineer', 'Nexus Cloud', 'Join our team as a DevOps Engineer to manage our cloud infrastructure, scale automated pipelines, and maintain uptime for microservices.

Key Requirements:
- 3+ years running cloud operations on AWS.
- Production experience using Terraform for Infrastructure as Code.
- Expertise in Kubernetes management and container orchestration.
- Solid background with CI/CD tools like GitHub Actions or GitLab CI.

Bonus Points:
- Experience with monitoring setups like Prometheus and Grafana.
- AWS DevOps certification.', '{"max": 160000, "min": 120000}', 'Austin, TX', '["AWS", "Terraform", "Kubernetes", "Docker", "CI/CD", "DevOps", "Infrastructure", "Cloud Operations", "GitHub Actions", "Prometheus"]', '2026-08-03 08:10:05+00', '2026-08-06 21:38:54.266+00', 'Full-time'),
('005', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Machine Learning Engineer', 'AI Vision Labs', 'We are hiring a Machine Learning Engineer to take computer vision models from research into production environment APIs. You will focus on model deployment, monitoring, and optimization.

Key Requirements:
- 3+ years writing Python for deep learning frameworks (PyTorch or TensorFlow).
- Track record of deploying ML models into real-time production systems.
- Experience wrapping models in light microservices using FastAPI or Flask.
- Familiarity with MLOps pipelines using MLflow or Weights & Biases.

Bonus Points:
- Experience running model quantization or edge deployments.
- Experience with GPU cluster management.', '{"max": 190000, "min": 140000}', 'New York, NY (Hybrid)', '["PyTorch", "Python", "MLflow", "FastAPI", "Docker", "Machine Learning Engineer", "MLOps", "Deep Learning", "Computer Vision", "Model Deployment"]', '2026-08-03 10:00:00.34+00', '2026-08-06 21:38:54.269+00', 'Full-time'),
('006', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Full Stack Engineer', 'BrightApp Solutions', 'We need a product-minded Full Stack Engineer to lead features from UI design to database integrations. You will work across modern React codebases and Node.js microservices.

Key Requirements:
- 3+ years building full stack web apps with React, Node.js, and TypeScript.
- Comfortable designing REST APIs and configuring NoSQL databases like MongoDB.
- Clear understanding of authorization flows, user sessions, and web security.
- Skill with Git workflows and modern deployment practices.

Bonus Points:
- Native mobile app development with React Native.
- Experience in consumer SaaS products.', '{"max": 150000, "min": 110000}', 'Remote', '["React", "Node.js", "TypeScript", "MongoDB", "Express", "Full Stack Engineer", "REST API", "NoSQL", "SaaS", "Web Security"]', '2026-08-03 13:20:44+00', '2026-08-06 21:38:54.273+00', 'Full-time'),
('007', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Data Analyst', 'Metrics HQ', 'Looking for a Data Analyst to handle internal reporting, clean core metrics datasets, and present findings to management.

Key Requirements:
- 2+ years experience querying databases using advanced SQL joins and window functions.
- Skilled in building interactive PowerBI or Tableau dashboards.
- Practical knowledge of exploratory data analysis using Python or R.
- Solid background in basic statistical concepts.

Bonus Points:
- Experience writing automated scripts for data cleaning.
- Experience in fintech or e-commerce industries.', '{"max": 110000, "min": 85000}', 'Chicago, IL', '["SQL", "Excel", "PowerBI", "Python", "Statistics", "Data Analyst", "Dashboarding", "Business Intelligence", "Data Cleaning", "Reporting"]', '2026-08-03 16:05:19.8+00', '2026-08-06 21:38:54.28+00', 'Full-time'),
('008', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Site Reliability Engineer (SRE)', 'EverGreen Tech', 'Join our infrastructure group as an SRE focused on system uptime, incident response, and performance monitoring.

Key Requirements:
- 4+ years of experience supporting production web applications at scale.
- Hands-on Unix/Linux system administration skills.
- Deep familiarity with incident response, root cause analysis, and post-mortems.
- Automation mindset using Python, Bash, or Go.

Bonus Points:
- Experience establishing Service Level Objectives (SLOs) and Error Budgets.
- Experience with zero-downtime database migrations.', '{"max": 175000, "min": 135000}', 'Remote', '["Linux", "Python", "Kubernetes", "Datadog", "Terraform", "Site Reliability Engineer", "SRE", "Monitoring", "Incident Management", "Automation"]', '2026-08-04 07:45:00.12+00', '2026-08-06 21:38:54.284+00', 'Full-time'),
('009', 'user-45ffe10b-567e-430a-8588-cf7cd809e8cb', 'Cybersecurity Engineer', 'Shield Security', 'We are looking for a Cybersecurity Engineer to protect infrastructure, lead vulnerability assessments, and handle threat detection.

Key Requirements:
- 3+ years of experience in information security, threat hunting, and system monitoring.
- Good understanding of cloud security standards, specifically in AWS.
- Hands-on work using SIEM tools (Splunk, Elastic) for log analysis.
- Proficiency in writing operational security scripts using Python or Bash.

Bonus Points:
- Security certifications such as CISSP, CEH, or AWS Security Specialty.
- Penetration testing experience.', '{"max": 160000, "min": 125000}', 'Seattle, WA', '["Python", "Network Security", "AWS Security", "SIEM", "Penetration Testing", "Cybersecurity Engineer", "Threat Detection", "Splunk", "Vulnerability Assessment", "Information Security"]', '2026-08-04 12:00:00+00', '2026-08-06 21:38:54.288+00', 'Full-time'),
('010', 'user-ef380f59-10e4-4938-be9c-670fd96e3930', 'Lead Mobile Engineer (iOS/Android)', 'Appify Studios', 'We are seeking a Lead Mobile Engineer to direct app architecture across cross-platform frameworks and manage app store release setups.

Key Requirements:
- 5+ years of mobile app development using Flutter/Dart or React Native.
- Successful track record of releasing high-traffic apps to Apple App Store and Google Play Store.
- Understanding of mobile UI patterns, state management, and offline-first storage.
- Ability to guide cross-functional technical teams.

Bonus Points:
- Native Swift or Kotlin development experience.
- Experience with mobile CI/CD tools like Fastlane or Bitrise.', '{"max": 185000, "min": 145000}', 'Remote', '["Flutter", "Dart", "React Native", "iOS", "Android", "Lead Mobile Engineer", "Mobile Development", "Swift", "Kotlin", "App Store Deployment"]', '2026-08-04 18:30:10.5+00', '2026-08-06 21:38:54.292+00', 'Full-time'),
('011', 'user-4ada2356-9f9b-43d8-adf9-d9931661a592', 'Frontend Engineer', 'Apex Digital Solutions', 'We are looking for a Frontend Engineer to help us build fast, clean user interfaces for our analytics dashboard. You will work closely with design and product teams to turn user needs into smooth Web apps.

Key Requirements:
- 3+ years of experience with modern JavaScript, HTML, and CSS.
- Hands-on experience with React or Vue.js.
- Good grasp of state management and web performance.
- Experience working with REST APIs and modern UI libraries.

Bonus Points:
- Experience with Next.js or TypeScript.
- Knowledge of design systems and accessibility standards.', '{"max": 145000, "min": 110000}', 'Nigeria', '["Frontend Engineer", "Frontend", "JavaScript", "HTML", "CSS", "React", "Vue.js", "State Management", "Web Performance", "REST APIs", "UI Libraries", "Next.js", "TypeScript", "Design Systems", "Accessibility", "User Interfaces", "Analytics Dashboard"]', '2026-08-07 00:18:58.668+00', '2026-08-07 00:18:58.668+00', 'Full-time'),
('012', 'user-4ada2356-9f9b-43d8-adf9-d9931661a592', 'Frontend Engineer', 'Apex Digital Solutions', 'We are looking for a Frontend Engineer to help us build fast, clean user interfaces for our analytics dashboard. You will work closely with design and product teams to turn user needs into smooth Web apps.

Key Requirements:
- 3+ years of experience with modern JavaScript, HTML, and CSS.
- Hands-on experience with React or Vue.js.
- Good grasp of state management and web performance.
- Experience working with REST APIs and modern UI libraries.

Bonus Points:
- Experience with Next.js or TypeScript.
- Knowledge of design systems and accessibility standards.', '{"max": 145000, "min": 110000}', 'Nigeria', '["Frontend Engineer", "Frontend", "JavaScript", "HTML", "CSS", "React", "Vue.js", "State management", "Web performance", "REST APIs", "UI libraries", "Next.js", "TypeScript", "Design systems", "Accessibility standards", "Analytics dashboard", "User interfaces"]', '2026-08-07 00:20:52.436+00', '2026-08-07 00:20:52.436+00', 'Full-time'),
('013', 'user-4ada2356-9f9b-43d8-adf9-d9931661a592', 'Frontend Engineer', 'Apex Digital Solutions', 'We are looking for a Frontend Engineer to help us build fast, clean user interfaces for our analytics dashboard. You will work closely with design and product teams to turn user needs into smooth Web apps.

Key Requirements:
- 3+ years of experience with modern JavaScript, HTML, and CSS.
- Hands-on experience with React or Vue.js.
- Good grasp of state management and web performance.
- Experience working with REST APIs and modern UI libraries.

Bonus Points:
- Experience with Next.js or TypeScript.
- Knowledge of design systems and accessibility standards.', '{"max": 145000, "min": 110000}', 'Nigeria', '["Frontend Engineer", "Frontend", "JavaScript", "HTML", "CSS", "React", "Vue.js", "State management", "Web performance", "REST APIs", "UI libraries", "Next.js", "TypeScript", "Design systems", "Accessibility standards", "Analytics dashboard", "User interfaces", "Web apps"]', '2026-08-07 00:22:21.726+00', '2026-08-07 00:22:21.726+00', 'Remote'),
('014', 'user-4ada2356-9f9b-43d8-adf9-d9931661a592', 'Frontend Engineer', 'Apex Digital Solutions', 'We are looking for a Frontend Engineer to help us build fast, clean user interfaces for our analytics dashboard. You will work closely with design and product teams to turn user needs into smooth Web apps.

Key Requirements:
- 3+ years of experience with modern JavaScript, HTML, and CSS.
- Hands-on experience with React or Vue.js.
- Good grasp of state management and web performance.
- Experience working with REST APIs and modern UI libraries.

Bonus Points:
- Experience with Next.js or TypeScript.
- Knowledge of design systems and accessibility standards.', '{"max": 145000, "min": 110000}', 'Nigeria', '["Frontend Engineer", "Frontend", "JavaScript", "HTML", "CSS", "React", "Vue.js", "State Management", "Web Performance", "REST APIs", "UI Libraries", "Next.js", "TypeScript", "Design Systems", "Accessibility", "User Interfaces", "Analytics Dashboard"]', '2026-08-07 00:23:34.154+00', '2026-08-07 00:23:34.154+00', 'Remote');


-- Indices
CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);

ALTER TABLE "public"."Resumes" ADD FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."JobQuestions" ADD FOREIGN KEY ("jobId") REFERENCES "public"."Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Jobs" ADD FOREIGN KEY ("recruiterId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

