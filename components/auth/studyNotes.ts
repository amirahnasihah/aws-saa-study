export type StudyNote = {
  service: string
  note: string
  icon: string
  /** text color token, e.g. "text-c1" */
  color: string
  /** icon tile background tint, e.g. "bg-c1/15" */
  tint: string
}

/** Quick-hit SAA-C03 reminders that stream through the auth showcase. */
export const studyNotes: StudyNote[] = [
  { service: 'S3',         note: 'Eleven 9s durability — lifecycle rules tier cold data to Glacier.', icon: '📦', color: 'text-c2', tint: 'bg-c2/15' },
  { service: 'EC2',        note: 'Spot for batch, Reserved for steady-state, On-Demand for spiky.',   icon: '🖥️', color: 'text-c1', tint: 'bg-c1/15' },
  { service: 'VPC',        note: 'Security groups are stateful; NACLs are stateless.',                icon: '🌐', color: 'text-c1', tint: 'bg-c1/15' },
  { service: 'RDS',        note: 'Multi-AZ = HA failover. Read Replicas = scale reads.',              icon: '🗄️', color: 'text-c2', tint: 'bg-c2/15' },
  { service: 'DynamoDB',   note: 'Single-digit ms latency — design around the partition key.',        icon: '⚡', color: 'text-c3', tint: 'bg-c3/15' },
  { service: 'Lambda',     note: '15-minute max timeout; scales out automatically.',                  icon: '🔧', color: 'text-c4', tint: 'bg-c4/15' },
  { service: 'Route 53',   note: 'Latency, geolocation, and weighted routing policies.',              icon: '🧭', color: 'text-c1', tint: 'bg-c1/15' },
  { service: 'SQS',        note: 'Decouple tiers — FIFO queues give exactly-once ordering.',          icon: '📨', color: 'text-c6', tint: 'bg-c6/15' },
  { service: 'CloudFront', note: 'Edge caching; OAC locks the S3 origin to the distribution.',        icon: '🚀', color: 'text-c3', tint: 'bg-c3/15' },
  { service: 'IAM',        note: 'Least privilege — prefer roles over long-lived access keys.',       icon: '🔑', color: 'text-c5', tint: 'bg-c5/15' },
]
