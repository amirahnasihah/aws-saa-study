export type LabTask = {
  title: string
  steps: string[]
}

export type Lab = {
  slug: string
  title: string
  level: 'Fundamental' | 'Intermediate' | 'Advanced'
  services: string[]
  summary: string
  duration: string
  completedOn: string
  tasks: LabTask[]
  takeaways: string[]
}

export const labs: Lab[] = [
  {
    slug: 'ec2-intro',
    title: 'Introduction to Amazon EC2',
    level: 'Fundamental',
    services: ['EC2', 'VPC', 'IAM'],
    summary: 'Provisioned a default VPC, launched a t2.micro EC2 instance, SSH’d in, and published a test page through Apache.',
    duration: '00:30:00',
    completedOn: '2026-06-08',
    tasks: [
      {
        title: 'Sign in and set the working region',
        steps: [
          'Signed in to the AWS Management Console with the provided IAM credentials, leaving the account ID untouched.',
          'Switched the default region to US East (N. Virginia) — us-east-1 — since the rest of the lab assumes resources live there.',
        ],
      },
      {
        title: 'Re-provision the default VPC',
        steps: [
          'Opened the VPC console and located the VPC flagged "yes" under Default VPC.',
          'Deleted it (Actions → Delete VPC, confirmed the acknowledgement, typed the confirmation phrase).',
          'Recreated it via Actions → Create default VPC, which also recreates the default subnets, route table, and internet gateway automatically.',
        ],
      },
      {
        title: 'Launch a t2.micro EC2 instance',
        steps: [
          'From EC2 → Instances → Launch instances, named the instance MyEC2Server.',
          'Picked Amazon Linux 2023 (kernel-6.1 AMI) and the t2.micro instance type — 1 vCPU / 1GB RAM, free-tier eligible and enough for a lightweight web server.',
          'Created a new RSA key pair (.pem format) for SSH login — the public half stays on the instance, the private half on my machine.',
          'Edited network settings: enabled auto-assign public IP, created a new security group and added an HTTP rule (source: anywhere) alongside the default SSH rule.',
          'Launched with everything else left at defaults, then waited on the Instances page until status checks showed 2/2 passed and the instance was Running.',
          'Copied the public IPv4 address from the instance details for later steps.',
        ],
      },
      {
        title: 'Connect over SSH',
        steps: [
          'Selected the running instance, clicked Connect, and used EC2 Instance Connect (browser-based SSH) with the default settings — no need to manage the .pem file locally for this path.',
        ],
      },
      {
        title: 'Install and start Apache',
        steps: [
          'Switched to root: sudo su',
          'Updated packages: dnf update -y',
          'Installed the web server: dnf install httpd -y',
          'Started it: systemctl start httpd, then enabled it on boot: systemctl enable httpd',
          'Confirmed it was active: systemctl status httpd',
          'Verified from a browser by visiting the instance’s public IPv4 address — the Apache test page loaded, confirming the server and security group rules were correct.',
        ],
      },
      {
        title: 'Publish a custom page',
        steps: [
          'Wrote a minimal HTML page straight to the document root: echo "<html>Hi, I am a public page</html>" > /var/www/html/index.html',
          'Restarted the service to be safe: systemctl restart httpd',
          'Loaded http://<public-ipv4>/index.html in the browser (http, not https — there’s no TLS listener on this box) and saw the custom content render.',
        ],
      },
    ],
    takeaways: [
      'The default VPC isn’t magic — deleting and recreating it showed me exactly what AWS provisions for you (subnets, route table, IGW) and why a custom VPC setup needs to replace all of that by hand.',
      'Security group rules are the first thing to check when a service "isn’t loading" — the Apache test page only appeared after the HTTP inbound rule was in place.',
      'EC2 Instance Connect removes the friction of managing .pem files for quick browser-based access, but a real deployment would still want key-based SSH or SSM Session Manager.',
      'http vs https tripped me up once — a fresh instance has no certificate, so https just hangs. Worth remembering for the exam’s "why can’t I reach my instance" scenarios.',
    ],
  },
]
