import { glossary } from '../data/glossary'
import { writeFileSync } from 'fs'

const categoryMap: Record<string, string> = {
  'PBS': 'compute', 'Slurm': 'compute', 'LSF': 'compute',
  'SSM': 'services', 'Athena': 'services', 'IMDSv2': 'services',
  'IMDS': 'services', 'STS': 'services', 'CRR': 'services',
  'IAM': 'services', 'AMI': 'services', 'EC2': 'services',
  'ALB': 'services', 'CloudFront': 'services', 'CDN': 'services',
  'RDS': 'services', 'SSO': 'services',
  'EC2 fleet': 'compute', 'Fleet': 'compute', 'Spot Instances': 'compute',
  'Reserved Instances': 'compute', 'Savings Plans': 'compute',
  'Spot': 'compute', 'On-Demand': 'compute',
  'SSL/TLS': 'networking', 'non-transitive': 'networking', 'transitive': 'networking',
  'Transit Gateway': 'networking', 'VPC Peering': 'networking',
  'VPC Endpoint': 'networking', 'VPC': 'networking', 'Internet Gateway': 'networking',
  'IGW': 'networking', 'NAT Gateway': 'networking', 'BGP': 'networking',
  'IPSec': 'networking', 'CIDR': 'networking', 'octet': 'networking',
  'subnet': 'networking', 'inbound': 'networking', 'outbound': 'networking',
  'deep packet inspection': 'networking', 'intrusion prevention': 'networking',
  'domain filtering': 'networking',
  'AES-256': 'security', 'SSL': 'security', 'TLS': 'security',
  'NACL': 'security', 'DDoS': 'security', 'SQL injection': 'security',
  'XSS': 'security', 'WAF': 'security', 'DRT': 'security',
  'Layer 7': 'security', 'Layer 3': 'security', 'Layer 4': 'security',
  'KMS': 'encryption', 'SSE-KMS': 'encryption', 'CMK': 'encryption',
  'WORM': 'encryption', 'envelope encryption': 'encryption',
  'Compliance mode': 'encryption', 'Governance mode': 'encryption',
  'legal hold': 'encryption', 'retention period': 'encryption',
  'Multi-AZ': 'database', 'Read Replica': 'database',
  'Availability Zone': 'database', 'RPO': 'database', 'RTO': 'database',
  'EBS': 'storage', 'EFS': 'storage', 'IOPS': 'storage',
  'stateful': 'architecture', 'stateless': 'architecture',
  'bastion host': 'security', 'jump host': 'security',
  'Elastic IP': 'networking', 'penetration testing': 'security', 'AUP': 'security',
}

const escape = (s: string) => s.replace(/'/g, "''")

const rows = Object.entries(glossary).map(([term, definition]) => {
  const category = categoryMap[term] ?? 'general'
  return `INSERT OR IGNORE INTO glossary (term, definition, category) VALUES ('${escape(term)}', '${escape(definition)}', '${category}');`
})

const sql = rows.join('\n')
writeFileSync('scripts/glossary-seed.sql', sql)
console.log(`Generated ${rows.length} glossary INSERT statements → scripts/glossary-seed.sql`)
