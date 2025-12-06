import type { LearningTemplate } from '../../types/templates';

export const DEVOPS_TEMPLATES: LearningTemplate[] = [
  {
    id: 'devops-fundamentals',
    name: 'DevOps Fundamentals',
    description: 'Learn DevOps culture, practices, and principles for modern software delivery',
    duration: '6 weeks',
    level: 'beginner',
    category: 'DevOps',
    topics: [
      'DevOps Culture & Mindset',
      'Agile & Lean Principles',
      'CI & CD basics',
      'Infrastructure as Code',
      'Monitoring & Observability',
      'Collaboration & Communication',
    ],
    skills: ['DevOps culture', 'CI/CD basics', 'IaC', 'Monitoring'],
  },
  {
    id: 'ci-cd-pipelines',
    name: 'CI/CD Pipeline Engineering',
    description:
      'Build robust CI/CD pipelines with Jenkins, GitLab CI, GitHub Actions, and modern deployment strategies',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'DevOps',
    topics: [
      'Pipeline as code',
      'Testing in pipelines',
      'Containerization in CI',
      'Artifact management',
      'Deployment strategies',
    ],
    skills: ['Pipeline design', 'Automation', 'Container Integration'],
  },
  {
    id: 'docker-containerization',
    name: 'Docker & Containerization',
    description:
      'Master Docker for containerization, orchestration basics, and container-native development',
    duration: '6 weeks',
    level: 'intermediate',
    category: 'DevOps',
    topics: [
      'Docker fundamentals',
      'Dockerfile & Best practices',
      'Networking & Volumes',
      'Security & Registries',
    ],
    skills: ['Containerization', 'Image optimization', 'Docker operations'],
  },
  {
    id: 'monitoring-observability',
    name: 'Monitoring & Observability',
    description:
      'Implement comprehensive monitoring solutions with Prometheus, Grafana, ELK stack, and observability practices',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'DevOps',
    topics: [
      'Metrics, Logs & Tracing',
      'Prometheus & Alerting',
      'Grafana Dashboarding',
      'Distributed Tracing (Jaeger)',
      'SLOs & SLIs',
    ],
    skills: ['Metrics collection', 'Log analysis', 'Observability'],
  },
  {
    id: 'configuration-management',
    name: 'Configuration Management',
    description:
      'Master infrastructure automation with Ansible, Puppet, and Chef for scalable configuration management',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'DevOps',
    topics: [
      'Ansible & Playbooks',
      'Puppet & Chef basics',
      'Idempotent operations',
      'Testing configurations',
    ],
    skills: ['Config management', 'Automation', 'Testing'],
  },
  {
    id: 'site-reliability-engineering',
    name: 'Site Reliability Engineering (SRE)',
    description:
      'Learn SRE principles, error budgets, service level objectives, and reliability engineering practices',
    duration: '10 weeks',
    level: 'advanced',
    category: 'DevOps',
    topics: [
      'SRE fundamentals',
      'Service Level Objectives (SLOs)',
      'Error budgets',
      'Incident management & postmortems',
      'Chaos engineering & automation',
    ],
    skills: ['Reliability engineering', 'Incident response', 'Capacity planning'],
  },
  {
    id: 'devsecops-fundamentals',
    name: 'DevSecOps Fundamentals',
    description:
      'Integrate security into DevOps practices with automated security testing and compliance',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'DevSecOps',
    topics: [
      'SAST & DAST integration',
      'SCA & dependency management',
      'CI/CD security',
      'Secrets management & IaC security',
    ],
    skills: ['Security integration', 'Automated security testing'],
  },
];
