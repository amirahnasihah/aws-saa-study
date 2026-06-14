import type { Lab } from '@/lib/labs'

export type { Lab, LabTask, LabStepContent, LabLevel } from '@/lib/labs'

export const labs: Lab[] = [
  {
    slug: 'iam-intro',
    title: 'Introduction to AWS Identity & Access Management (IAM)',
    level: 'Fundamental',
    services: ['IAM'],
    summary: 'Created IAM users and groups, attached permission policies, and organized access by team — Dev vs HR — without ever sharing root credentials.',
    duration: '00:30:00',
    completedOn: '2026-06-08',
    source: 'manual',
    tasks: [
      {
        title: 'Sign in and set the working region',
        steps: [
          { text: 'Signed in to the AWS Management Console with the provided IAM credentials, leaving the 12-digit account ID untouched.' },
          { text: 'Switched the default region to US East (N. Virginia) — us-east-1 — to keep things consistent with the rest of my lab notes.' },
        ],
      },
      {
        title: 'Create IAM users',
        steps: [
          { text: 'Opened IAM (under Security, Identity, & Compliance) and went to Users → Create user.' },
          { text: 'For each user (John, Sarah, Ted, Rita): set a username, enabled console access, chose a custom password, and unchecked "user must create a new password at next sign-in" since this is a lab environment.' },
          { text: 'Left permissions at default on the "set permissions" step — access gets handled later through groups, not per-user.' },
          { text: 'Tagged John and Sarah with Dev-Team / Developers, and Ted and Rita with HR-Team / HR — tags make it easy to filter/audit users later.' },
          { text: 'Confirmed creation and returned to the user list before repeating for the next user.' },
        ],
      },
      {
        title: 'Create IAM groups and attach policies',
        steps: [
          { text: 'Went to User groups → Create group, named it Dev-Team, and added John and Sarah as members.' },
          { text: 'Attached AmazonEC2ReadOnlyAccess and AmazonS3ReadOnlyAccess — read-only policies so the dev team can inspect EC2/S3 without being able to modify anything.' },
          { text: 'Created a second group, HR-Team, added Ted and Rita, and attached the Billing policy — scoped strictly to what HR actually needs.' },
          { text: 'Reviewed each group’s summary before creating it to make sure the right users and policies were attached.' },
        ],
      },
      {
        title: 'Validate the lab',
        steps: [
          { text: 'Opened the lab validation panel and ran the check — it confirmed 4 users and 2 groups existed with the expected memberships and policies attached.' },
        ],
      },
    ],
    takeaways: [
      'Groups are the right unit for managing permissions, not individual users — attach policies once to a group and every member inherits them, which scales far better than per-user policies.',
      'The principle of least privilege showed up concretely here: Dev-Team only got read-only EC2/S3 access, HR-Team only got Billing — neither could touch what the other needed.',
      'Tagging users (Dev-Team/Developers, HR-Team/HR) at creation time makes later auditing and cost allocation much easier than retrofitting tags after the fact.',
      'IAM users are for people; IAM roles are for things that need to assume an identity temporarily without permanent credentials — a distinction worth keeping straight for the exam.',
    ],
  },
  {
    slug: 'ec2-intro',
    title: 'Introduction to Amazon EC2',
    level: 'Fundamental',
    services: ['EC2', 'VPC', 'IAM'],
    summary: 'Provisioned a default VPC, launched a t2.micro EC2 instance, SSH’d in, and published a test page through Apache.',
    duration: '00:30:00',
    completedOn: '2026-06-08',
    source: 'manual',
    tasks: [
      {
        title: 'Sign in and set the working region',
        steps: [
          { text: 'Signed in to the AWS Management Console with the provided IAM credentials, leaving the account ID untouched.' },
          { text: 'Switched the default region to US East (N. Virginia) — us-east-1 — since the rest of the lab assumes resources live there.' },
        ],
      },
      {
        title: 'Re-provision the default VPC',
        steps: [
          { text: 'Opened the VPC console and located the VPC flagged "yes" under Default VPC.' },
          { text: 'Deleted it (Actions → Delete VPC, confirmed the acknowledgement, typed the confirmation phrase).' },
          { text: 'Recreated it via Actions → Create default VPC, which also recreates the default subnets, route table, and internet gateway automatically.' },
        ],
      },
      {
        title: 'Launch a t2.micro EC2 instance',
        steps: [
          { text: 'From EC2 → Instances → Launch instances, named the instance MyEC2Server.' },
          { text: 'Picked Amazon Linux 2023 (kernel-6.1 AMI) and the t2.micro instance type — 1 vCPU / 1GB RAM, free-tier eligible and enough for a lightweight web server.' },
          { text: 'Created a new RSA key pair (.pem format) for SSH login — the public half stays on the instance, the private half on my machine.' },
          { text: 'Edited network settings: enabled auto-assign public IP, created a new security group and added an HTTP rule (source: anywhere) alongside the default SSH rule.' },
          { text: 'Launched with everything else left at defaults, then waited on the Instances page until status checks showed 2/2 passed and the instance was Running.' },
          { text: 'Copied the public IPv4 address from the instance details for later steps.' },
        ],
      },
      {
        title: 'Connect over SSH',
        steps: [
          { text: 'Selected the running instance, clicked Connect, and used EC2 Instance Connect (browser-based SSH) with the default settings — no need to manage the .pem file locally for this path.' },
        ],
      },
      {
        title: 'Install and start Apache',
        steps: [
          { text: 'Switched to root: sudo su' },
          { text: 'Updated packages: dnf update -y' },
          { text: 'Installed the web server: dnf install httpd -y' },
          { text: 'Started it: systemctl start httpd, then enabled it on boot: systemctl enable httpd' },
          { text: 'Confirmed it was active: systemctl status httpd' },
          { text: 'Verified from a browser by visiting the instance’s public IPv4 address — the Apache test page loaded, confirming the server and security group rules were correct.' },
        ],
      },
      {
        title: 'Publish a custom page',
        steps: [
          { text: 'Wrote a minimal HTML page straight to the document root: echo "<html>Hi, I am a public page</html>" > /var/www/html/index.html' },
          { text: 'Restarted the service to be safe: systemctl restart httpd' },
          { text: 'Loaded http://<public-ipv4>/index.html in the browser (http, not https — there’s no TLS listener on this box) and saw the custom content render.' },
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
