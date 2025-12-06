import type { LearningTemplate } from '../../types/templates';

export const SECURITY_TEMPLATES: LearningTemplate[] = [
  {
    id: 'cybersecurity-fundamentals',
    name: 'Cybersecurity Fundamentals',
    description:
      'Develop a security mindset, understand common attack vectors and defensive patterns',
    duration: '8 weeks',
    level: 'beginner',
    category: 'Security',
    topics: [
      'Security Basics & Terminology',
      'Linux Fundamentals for Secure Ops',
      'Network Security & Firewalls',
      'Cryptography Essentials',
      'Identity & Access Management',
      'OWASP Top 10',
      'Secure Coding Practices',
      'Threat Modeling & Risk Assessment',
      'Incident Response',
    ],
    skills: ['Security Awareness', 'Threat Modeling', 'Incident Response'],
  },
  {
    id: 'cybersecurity-for-developers',
    name: 'Security for Developers — Beginner-Friendly',
    description:
      'Essential security knowledge for developers, focusing on secure coding, web app vulnerabilities, and practical mitigations',
    duration: '4 weeks',
    level: 'beginner',
    category: 'Security',
    topics: [
      'OWASP Top 10',
      'Authentication & sessions',
      'Secure dependency management',
      'Logging & secure error handling',
    ],
    skills: ['Secure coding', 'OWASP awareness'],
  },
  {
    id: 'cybersecurity-networking-basics',
    name: 'Security & Networking — Beginner Basics',
    description:
      'Understand network fundamentals, firewalls, and common attacks at the network layer',
    duration: '3 weeks',
    level: 'beginner',
    category: 'Security',
    topics: ['OSI model', 'TCP/UDP', 'Firewalls & NAT', 'TLS basics'],
    skills: ['Network security basics', 'Debugging network issues'],
  },
  {
    id: 'cybersecurity-intro-linux',
    name: 'Linux for Security — Beginner Sysadmin Basics',
    description:
      'Get comfortable with Linux for security: permissions, logs, SSH hardening, and system monitoring',
    duration: '3 weeks',
    level: 'beginner',
    category: 'Security',
    topics: ['File permissions', 'SSH hardening', 'Logging & journalctl', 'Process monitoring'],
    skills: ['Secure sysadmin basics', 'Monitoring & hardening'],
  },
  {
    id: 'cybersecurity-red-team',
    name: 'Offensive Security — Red Team Basics',
    description:
      'Learn the fundamentals of offensive security: recon, exploitation, and responsible testing',
    duration: '8 weeks',
    level: 'advanced',
    category: 'Security',
    topics: [
      'Reconnaissance',
      'Web exploitation',
      'Privilege escalation',
      'Reporting & remediation',
    ],
    skills: ['Pentesting', 'Scripting & automation', 'Exploit analysis'],
  },
  {
    id: 'cybersecurity-blue-team',
    name: 'Blue Team & Detection — Advanced',
    description:
      'Defensive techniques, threat hunting, detection engineering, and incident response for blue team roles',
    duration: '8 weeks',
    level: 'advanced',
    category: 'Security',
    topics: [
      'SIEM fundamentals',
      'Detection engineering',
      'Forensics basics',
      'Incident response playbooks',
    ],
    skills: ['Threat detection', 'Forensics', 'Incident handling'],
  },
  {
    id: 'devsecops-advanced',
    name: 'DevSecOps — Advanced',
    description:
      'Integrate security across the software delivery lifecycle with automated controls and runtime protections',
    duration: '10 weeks',
    level: 'advanced',
    category: 'DevSecOps',
    topics: ['SAST/DAST/SCA', 'IaC scanning', 'Runtime protection', 'Supply chain security'],
    skills: ['Secure pipelines', 'Tooling & automation', 'Policy & runtime security'],
  },
];
