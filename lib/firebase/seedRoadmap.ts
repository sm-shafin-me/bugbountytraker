import { db } from './firebaseConfig';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

export interface Resource {
    title: string;
    url: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    resources?: Resource[];
}

export interface Week {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    tasks: Task[];
}

export interface RoadmapData {
    weeks: Week[];
}

const roadmapData: RoadmapData = {
    weeks: [
        {
            id: 'week-1',
            weekNumber: 1,
            title: 'HTTP, Requests, and Web Security Foundations',
            description: 'Understand the mechanism of web request-response and intercept your first request with Burp Suite.',
            tasks: [
                {
                    id: 'w1-t1',
                    title: 'HTTP Protocol and Requests (Days 1-2)',
                    description: 'Master HTTP methods (GET, POST), headers, status codes, and the difference between request body and URL parameters.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: How the web works', url: 'https://portswigger.net/web-security/learning-path' }
                    ]
                },
                {
                    id: 'w1-t2',
                    title: 'Cookies and Sessions (Days 3-4)',
                    description: 'Learn about Cookies, Session IDs, Secure/HttpOnly flags, and practice observing cookie behavior in DevTools.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Session management', url: 'https://portswigger.net/web-security/authentication/session-management' }
                    ]
                },
                {
                    id: 'w1-t3',
                    title: 'Burp Suite Setup & Interception (Days 5-6)',
                    description: 'Install CA certificate, configure Proxy, and intercept/modify your first HTTP request.',
                    completed: false,
                    resources: [
                        { title: 'Burp Suite for Beginners', url: 'https://portswigger.net/burp/documentation/desktop/getting-started' }
                    ]
                },
                {
                    id: 'w1-t4',
                    title: 'Practice and Review (Day 7)',
                    description: 'Setup a test app (DVWA/Juice Shop) and analyze network traffic for simple login/form submissions.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-2',
            weekNumber: 2,
            title: 'OWASP Top 10 & First Vulnerability',
            description: 'Get an overview of OWASP Top 10 and identify your first vulnerability (Reflected XSS/IDOR).',
            tasks: [
                {
                    id: 'w2-t1',
                    title: 'OWASP Top 10 Overview (Days 1-2)',
                    description: 'Understand the significance of the Top 10 risks like Broken Access Control, Injection, etc.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: OWASP Top 10', url: 'https://portswigger.net/web-security/learning-path' }
                    ]
                },
                {
                    id: 'w2-t2',
                    title: 'XSS (Reflected) - First Vulnerability (Days 3-4)',
                    description: 'Learn Reflected XSS, payloads, and its dangers. Practice on PortSwigger labs.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Cross-site scripting', url: 'https://portswigger.net/web-security/cross-site-scripting' }
                    ]
                },
                {
                    id: 'w2-t3',
                    title: 'IDOR (Insecure Direct Object Reference) (Days 5-6)',
                    description: 'Understand how changing IDs can access other user data. Practice with Burp Intruder.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Access control', url: 'https://portswigger.net/web-security/access-control' }
                    ]
                },
                {
                    id: 'w2-t4',
                    title: 'Practice and Pattern Recognition (Day 7)',
                    description: 'Read public bug reports on Reflected XSS or IDOR to understand real-world findings.',
                    completed: false,
                    resources: [
                        { title: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
                    ]
                }
            ],
        },
        {
            id: 'week-3',
            weekNumber: 3,
            title: 'XSS Deep Dive & CSRF',
            description: 'Detailed understanding of Reflected + Stored XSS and introduction to CSRF.',
            tasks: [
                {
                    id: 'w3-t1',
                    title: 'Stored XSS and DOM XSS (Days 1-2)',
                    description: 'Differentiate Stored vs Reflected. Learn DOM-based XSS and common sinks.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Stored XSS', url: 'https://portswigger.net/web-security/cross-site-scripting/stored' }
                    ]
                },
                {
                    id: 'w3-t2',
                    title: 'CSRF (Cross-Site Request Forgery) (Days 3-4)',
                    description: 'Understand how CSRF works, tokens, SameSite cookies, and validation.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: CSRF', url: 'https://portswigger.net/web-security/csrf' }
                    ]
                },
                {
                    id: 'w3-t3',
                    title: 'Advanced XSS Techniques (Days 5-6)',
                    description: 'HTML entity encoding, WAF bypasses, and event handlers.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: XSS contexts', url: 'https://portswigger.net/web-security/cross-site-scripting/contexts' }
                    ]
                },
                {
                    id: 'w3-t4',
                    title: 'Real Bug Report Analysis (Day 7)',
                    description: 'Analyze 3 XSS bug reports (Reflected, Stored, DOM) to understand payloads and fixes.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-4',
            weekNumber: 4,
            title: 'IDOR Deep Dive & Business Logic Flaws',
            description: 'Proficiency in IDOR and introduction to Business Logic vulnerabilities.',
            tasks: [
                {
                    id: 'w4-t1',
                    title: 'IDOR Advanced Techniques (Days 1-2)',
                    description: 'UUIDs, encoded IDs, multiple parameters, and API IDORs.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Access control', url: 'https://portswigger.net/web-security/access-control' }
                    ]
                },
                {
                    id: 'w4-t2',
                    title: 'Business Logic Flaws (Days 3-4)',
                    description: 'Logic bypasses, price manipulation, race conditions, and coupon stacking.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Business logic', url: 'https://portswigger.net/web-security/logic-flaws' }
                    ]
                },
                {
                    id: 'w4-t3',
                    title: 'Information Disclosure (Days 5-6)',
                    description: 'Identifying sensitive data leaks, comments, .git files, and error messages.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger: Information disclosure', url: 'https://portswigger.net/web-security/information-disclosure' }
                    ]
                },
                {
                    id: 'w4-t4',
                    title: 'Bug Report Deep Dive (Day 7)',
                    description: 'Read reports on IDOR, Business Logic, and Info Disclosure. Note severity and impact.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-5',
            weekNumber: 5,
            title: 'Recon & Methodology',
            description: 'Start scanning real websites (with permission) and learn hunting methodology.',
            tasks: [
                {
                    id: 'w5-t1',
                    title: 'Subdomain and Asset Discovery (Days 1-2)',
                    description: 'Scope definition, passive recon, subfinder, and tracking assets.',
                    completed: false,
                    resources: [
                        { title: 'Subfinder Tool', url: 'https://github.com/projectdiscovery/subfinder' }
                    ]
                },
                {
                    id: 'w5-t2',
                    title: 'Web Scanning and Enumeration (Days 3-4)',
                    description: 'Port scanning, tech fingerprinting (Wappalyzer), Site Map in Burp.',
                    completed: false,
                    resources: [
                        { title: 'Wappalyzer', url: 'https://www.wappalyzer.com/' }
                    ]
                },
                {
                    id: 'w5-t3',
                    title: 'Endpoint Analysis & Strategy (Days 5-6)',
                    description: 'Prioritizing endpoints (auth, payment, API) and creating a testing checklist.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w5-t4',
                    title: 'Real Target Setup (Day 7)',
                    description: 'Pick a small target, complete full recon, and map the attack surface.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-6',
            weekNumber: 6,
            title: 'Practical Hunting - Real World',
            description: 'Find your first vulnerability (even if minor) on your recon target.',
            tasks: [
                {
                    id: 'w6-t1',
                    title: 'XSS Hunting on Real Target (Days 1-2)',
                    description: 'Test all input fields for reflections. Try simple payloads and bypasses.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w6-t2',
                    title: 'IDOR Hunting on Real Target (Days 3-4)',
                    description: 'Test numeric IDs, user variations, and API endpoints for unauthorized access.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w6-t3',
                    title: 'Information Disclosure Hunting (Days 5-6)',
                    description: 'Check source code, comments, config files, and API responses for leaks.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w6-t4',
                    title: 'Report Drafting (Day 7)',
                    description: 'Draft a report for any finding, or review testing logs if nothing found.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-7',
            weekNumber: 7,
            title: 'First Valid Report',
            description: 'Submit at least one bug report to a legitimate program.',
            tasks: [
                {
                    id: 'w7-t1',
                    title: 'Target Selection Strategy (Days 1-2)',
                    description: 'Pick 5 small programs, analyze past reports, and select your best shot.',
                    completed: false,
                    resources: [
                        { title: 'Bugcrowd Programs', url: 'https://bugcrowd.com/programs' }
                    ]
                },
                {
                    id: 'w7-t2',
                    title: 'Comprehensive Testing (Days 3-4)',
                    description: 'Deep dive testing on the chosen target. 50% recon, 50% deep testing.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w7-t3',
                    title: 'First Bug Report Submission (Days 5-6)',
                    description: 'Write a clear, professional report with impact and reproduction steps.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w7-t4',
                    title: 'Submission & Communication (Day 7)',
                    description: 'Submit the report and handle any communication professionally.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-8',
            weekNumber: 8,
            title: 'Feedback Loop & Strategy',
            description: 'Learn from feedback and establish an independent hunting strategy.',
            tasks: [
                {
                    id: 'w8-t1',
                    title: 'Report Feedback Analysis (Days 1-2)',
                    description: 'Analyze responses (Valid, Duplicate, N/A). Learn and adapt.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w8-t2',
                    title: 'New Targets Testing (Days 3-4)',
                    description: 'Pick 2 new targets and apply improved fast methodology.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w8-t3',
                    title: 'Parallel Hunting (Days 5-6)',
                    description: 'Maintain activity on 3-4 programs simultaneously.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w8-t4',
                    title: '8-Week Review (Day 7)',
                    description: 'Evaluate against the readiness checklist and plan next 1-3 months.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-9',
            weekNumber: 9,
            title: 'Advanced: Injection & Server-Side',
            description: 'Focus on high-impact/critical bugs: SQLi, SSRF, XXE.',
            tasks: [
                {
                    id: 'w9-t1',
                    title: 'SQL Injection (SQLi)',
                    description: 'Master data theft/deletion via database manipulation.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger SQLi', url: 'https://portswigger.net/web-security/sql-injection' }
                    ]
                },
                {
                    id: 'w9-t2',
                    title: 'SSRF (Server-Side Request Forgery)',
                    description: 'Scanning internal networks via server requests.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger SSRF', url: 'https://portswigger.net/web-security/ssrf' }
                    ]
                },
                {
                    id: 'w9-t3',
                    title: 'XXE (XML External Entity)',
                    description: 'File reading via XML data processing.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger XXE', url: 'https://portswigger.net/web-security/xxe' }
                    ]
                }
            ],
        },
        {
            id: 'week-10',
            weekNumber: 10,
            title: 'Advanced: Auth & Logic Deep Dive',
            description: 'Permissions and modern architecture flaws.',
            tasks: [
                {
                    id: 'w10-t1',
                    title: 'BOLA/IDOR Deep Dive',
                    description: 'Advanced API ID manipulation techniques.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w10-t2',
                    title: 'Mass Assignment',
                    description: 'Updating restricted fields in database objects.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w10-t3',
                    title: 'Race Conditions',
                    description: 'Bypassing limits with concurrent requests.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w10-t4',
                    title: 'Insecure Deserialization',
                    description: 'Executing code via object misuse.',
                    completed: false,
                    resources: [
                        { title: 'PortSwigger Deserialization', url: 'https://portswigger.net/web-security/deserialization' }
                    ]
                }
            ],
        },
        {
            id: 'week-11',
            weekNumber: 11,
            title: 'Advanced: Recon Automation & Cloud',
            description: 'Speed up target discovery and cloud security.',
            tasks: [
                {
                    id: 'w11-t1',
                    title: 'Python for Recon',
                    description: 'Automate subdomain and endpoint finding.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w11-t2',
                    title: 'GitHub Dorking',
                    description: 'Advanced search for sensitive keys/info.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w11-t3',
                    title: 'Cloud Misconfiguration',
                    description: 'AWS S3, GCP checkups.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w11-t4',
                    title: 'JS Analysis',
                    description: 'Finding hidden API endpoints in JavaScript.',
                    completed: false,
                    resources: []
                }
            ],
        },
        {
            id: 'week-12',
            weekNumber: 12,
            title: 'Advanced: Consistent Hunting',
            description: 'Focus on hunting volume and report quality.',
            tasks: [
                {
                    id: 'w12-t1',
                    title: 'Parallel Hunting Strategy',
                    description: 'Active hunting on multiple programs.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w12-t2',
                    title: 'Medium/High Severity Focus',
                    description: 'Prioritizing high impact over low hanging fruit.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w12-t3',
                    title: 'Report Polishing',
                    description: 'Writing reports that guarantee payouts.',
                    completed: false,
                    resources: []
                },
                {
                    id: 'w12-t4',
                    title: 'Daily Write-ups',
                    description: 'Reading advanced write-ups daily.',
                    completed: false,
                    resources: [
                        { title: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
                    ]
                }
            ],
        },
    ],
};

/**
 * Seed the Firestore database with the initial roadmap data
 */
export const seedRoadmap = async () => {
    try {
        console.log('Starting roadmap seed...');

        const batch = writeBatch(db);

        // Create roadmap document
        const roadmapRef = doc(db, 'roadmap', 'main');
        batch.set(roadmapRef, {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalWeeks: roadmapData.weeks.length,
        });

        // Add each week
        roadmapData.weeks.forEach((week) => {
            const weekRef = doc(collection(db, 'roadmap', 'main', 'weeks'), week.id);
            batch.set(weekRef, {
                weekNumber: week.weekNumber,
                title: week.title,
                description: week.description,
                tasks: week.tasks,
            });
        });

        await batch.commit();
        console.log('Roadmap seeded successfully!');
        console.log(`Added ${roadmapData.weeks.length} weeks with tasks`);

        return { success: true, message: 'Roadmap seeded successfully' };
    } catch (error) {
        console.error('Error seeding roadmap:', error);
        return { success: false, error };
    }
};

/**
 * Run this script to seed the database
 * Usage: node -r ts-node/register lib/firebase/seedRoadmap.ts
 */
if (require.main === module) {
    seedRoadmap()
        .then((result) => {
            console.log('Seed result:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seed failed:', error);
            process.exit(1);
        });
}
