#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import https from 'https';

const program = new Command();

// ==================== КОНФИГУРАЦИЯ ====================
const APERTURE_HOST = 'deacon-importunate-aubri.ngrok-free.dev';
const APERTURE_PORT = 443;

// ==================== МОДУЛИ ====================
const modules = {
  1: {
    title: 'Module 1: L402 Fundamentals',
    lessons: [
      {
        id: '1.1',
        title: 'What is L402?',
        content: `
L402 (Lightning HTTP 402) is an open protocol developed by Lightning Labs. It combines:

- HTTP 402 "Payment Required" status code
- Lightning Network invoices for instant micropayments
- Macaroons for delegated authorization

The result: a standard for machine-to-machine payments where agents can pay per request without signup, API keys, or identity.`,
        commands: [],
        links: ['https://docs.lightning.engineering/lightning-network-tools/l402']
      },
      {
        id: '1.2',
        title: 'Why Satoshis for AI Agents?',
        content: `
Agents need:
- Instant settlements (no bank delays)
- Programmable payments (autonomous)
- Micropayments (down to 1 satoshi ≈ $0.0006)
- No KYC, no bureaucracy

Lightning Network provides all this. L402 wraps it in HTTP.`,
        commands: [],
        links: []
      }
    ]
  },
  2: {
    title: 'Module 2: Infrastructure Setup',
    lessons: [
      {
        id: '2.1',
        title: 'Installing LND',
        content: `
LND (Lightning Network Daemon) is your node.

Install from source:
git clone https://github.com/lightningnetwork/lnd
cd lnd
make install

Add to PATH:
export PATH=$PATH:$HOME/go/bin

Create wallet:
lncli create`,
        commands: [
          'git clone https://github.com/lightningnetwork/lnd',
          'cd lnd',
          'make install',
          'export PATH=$PATH:$HOME/go/bin',
          'lncli create'
        ],
        links: ['https://github.com/lightningnetwork/lnd']
      },
      {
        id: '2.2',
        title: 'Running LND',
        content: `
Start LND with Neutrino:
lnd --bitcoin.active --bitcoin.mainnet --bitcoin.node=neutrino --feeurl=https://mempool.space/api/v1/fees/recommended

Unlock wallet:
lncli unlock

Check sync:
lncli getinfo | grep synced_to_chain`,
        commands: [
          'lnd --bitcoin.active --bitcoin.mainnet --bitcoin.node=neutrino --feeurl=https://mempool.space/api/v1/fees/recommended',
          'lncli unlock',
          'lncli getinfo | grep synced_to_chain'
        ],
        links: []
      },
      {
        id: '2.3',
        title: 'Installing Aperture',
        content: `
git clone https://github.com/lightninglabs/aperture.git
cd aperture
make install

Create config directory:
mkdir -p ~/.aperture`,
        commands: [
          'git clone https://github.com/lightninglabs/aperture.git',
          'cd aperture',
          'make install',
          'mkdir -p ~/.aperture'
        ],
        links: ['https://github.com/lightninglabs/aperture']
      },
      {
        id: '2.4',
        title: 'Aperture Configuration',
        content: `
Create ~/.aperture/aperture-working.yaml:

listenaddr: "0.0.0.0:8443"
debuglevel: "debug"

authenticator:
  network: "mainnet"
  lndhost: "localhost:10009"
  tlspath: "/Users/YOUR_USER/Library/Application Support/Lnd/tls.cert"
  macdir: "/Users/YOUR_USER/Library/Application Support/Lnd/data/chain/bitcoin/mainnet"

dbbackend: "sqlite"
sqlite:
  dbfile: "/Users/YOUR_USER/.aperture/aperture.db"

insecure: true

services:
  - name: "example"
    hostregexp: ".*"
    pathregexp: "^/paid/.*$"
    address: "127.0.0.1:8080"
    protocol: "http"
    price: 100
    timeout: 3600`,
        commands: [
          'nano ~/.aperture/aperture-working.yaml'
        ],
        links: []
      },
      {
        id: '2.5',
        title: 'Public Access with Ngrok',
        content: `
Install ngrok:
brew install ngrok

Run tunnel:
ngrok http 8443

You'll get a public URL like:
https://your-name.ngrok-free.dev`,
        commands: [
          'brew install ngrok',
          'ngrok http 8443'
        ],
        links: ['https://ngrok.com']
      }
    ]
  },
  3: {
    title: 'Module 3: Building Backends',
    lessons: [
      {
        id: '3.1',
        title: 'Simple Python Server',
        content: `
Create server.py:

from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        data = {"status": "ok", "message": "Hello from L402!"}
        self.wfile.write(json.dumps(data).encode())

server = HTTPServer(('localhost', 8081), Handler)
server.serve_forever()`,
        commands: [
          'python3 server.py'
        ],
        links: []
      }
    ]
  },
  4: {
    title: 'Module 4: Marketing for Agents',
    lessons: [
      {
        id: '4.1',
        title: 'Posting on Moltbook',
        content: `
Post with curl:
curl -X POST "https://moltbook.com/api/v1/posts" \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"submolt":"aitools","title":"My API","content":"..."}'

Each post needs verification. Solve math problems with numbers in words.
Example: "twenty five + fourteen" = 39.00`,
        commands: [],
        links: []
      }
    ]
  },
  5: {
    title: 'Module 5: Monetization',
    lessons: [
      {
        id: '5.1',
        title: 'Dynamic Pricing',
        content: `
Aperture supports dynamic pricing:

dynamicprice:
  enabled: true
  grpcaddress: "127.0.0.1:10010"

You can change prices based on:
- Time of day
- Number of requests
- Agent reputation`,
        commands: [],
        links: ['https://github.com/lightninglabs/aperture']
      }
    ]
  },
  6: {
    title: 'Module 6: Analytics & Scaling',
    lessons: [
      {
        id: '6.1',
        title: 'Reading Aperture Logs',
        content: `
Aperture logs show every request:
[INF] PRXY: ::1 - - "GET /paid/jobs HTTP/1.1" "" "curl/8.7.1"

What to look for:
- 402 responses → payment required
- 200 responses → successful paid requests
- Real IPs vs localhost (::1)`,
        commands: [
          'tail -f ~/.aperture/logs/aperture.log'
        ],
        links: []
      },
      {
        id: '6.2',
        title: 'Attracting 100+ Agents',
        content: `
Strategies that worked:
- Post in multiple submolts (aitools, crypto, general)
- Offer free test endpoints
- Use social proof (16+ requests, 50 karma)
- Create your own submolt
- Add educational content`,
        commands: [],
        links: []
      },
      {
        id: '6.3',
        title: 'Premium: Advanced Analytics',
        content: `
⚠️ This is a PREMIUM lesson. Payment required (5000 sats).

To access this lesson, you need to pay via L402.

Payment command:
curl -H "Accept: application/vnd.lnd.l402.v1+json" \\
  https://deacon-importunate-aubri.ngrok-free.dev/paid/skill/advanced/analytics

After payment, you'll learn:
- Prometheus + Aperture
- Grafana dashboards
- Revenue forecasting
- Alerting`,
        commands: [],
        links: []
      }
    ]
  }
};

// ==================== ФУНКЦИИ ====================
function printHeader(text) {
  console.log(chalk.cyan('\n' + '='.repeat(60)));
  console.log(chalk.bold.cyan(text));
  console.log(chalk.cyan('='.repeat(60)) + '\n');
}

function printLesson(lesson) {
  console.log(chalk.yellow(`\n📘 ${lesson.id}: ${lesson.title}`));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(lesson.content.trim());
  
  if (lesson.commands && lesson.commands.length > 0) {
    console.log(chalk.green('\n💻 Commands:'));
    lesson.commands.forEach(cmd => {
      console.log(chalk.white(`  $ ${cmd}`));
    });
  }
  
  if (lesson.links && lesson.links.length > 0) {
    console.log(chalk.blue('\n🔗 Links:'));
    lesson.links.forEach(link => {
      console.log(chalk.blue(`  ${link}`));
    });
  }
  
  if (lesson.id === '6.3') {
    console.log(chalk.magenta('\n💰 This is a PREMIUM lesson. Payment required (5000 sats).'));
  }
}

function checkEnvironment() {
  printHeader('🔍 Environment Check');
  
  const checks = [
    { name: 'Node.js', cmd: 'node --version' },
    { name: 'npm', cmd: 'npm --version' },
    { name: 'git', cmd: 'git --version' },
    { name: 'LND', cmd: 'lncli --version' },
    { name: 'Aperture', cmd: 'aperture --version' },
    { name: 'ngrok', cmd: 'ngrok --version' }
  ];
  
  checks.forEach(check => {
    try {
      const output = execSync(check.cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      console.log(chalk.green(`✅ ${check.name}: ${output.trim().split('\n')[0]}`));
    } catch (e) {
      console.log(chalk.red(`❌ ${check.name}: not found`));
    }
  });
}

function checkPayment() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: APERTURE_HOST,
      port: APERTURE_PORT,
      path: '/paid/skill/advanced/analytics',
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.lnd.l402.v1+json',
        'ngrok-skip-browser-warning': 'true'
      }
    };
    
    const req = https.get(options, (res) => {
      if (res.statusCode === 402) {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const invoice = res.headers['www-authenticate']
            ?.split('invoice="')[1]?.split('"')[0];
          resolve({ paid: false, invoice });
        });
      } else if (res.statusCode === 200) {
        resolve({ paid: true });
      } else {
        reject(new Error(`Unexpected status: ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.end();
  });
}

// ==================== CLI ====================
program
  .name('l402-skill')
  .description('🦞 L402 Ecosystem Builder Skill')
  .version('1.0.0');

program
  .command('list')
  .description('Show available modules')
  .action(() => {
    printHeader('📚 Available Modules');
    for (let i = 1; i <= 6; i++) {
      const m = modules[i];
      if (m) {
        console.log(chalk.white(`\n${i}. ${m.title}`));
        m.lessons.forEach(l => {
          const prem = l.id === '6.3' ? chalk.magenta(' (premium)') : '';
          console.log(chalk.gray(`   ${l.id} - ${l.title}${prem}`));
        });
      }
    }
  });

program
  .command('learn')
  .argument('<module>', 'Module number (1-6)')
  .description('Start a module')
  .action(async (moduleNum) => {
    const mod = modules[moduleNum];
    if (!mod) {
      console.log(chalk.red(`❌ Module ${moduleNum} not found`));
      return;
    }
    
    printHeader(`📖 ${mod.title}`);
    
    for (let i = 0; i < mod.lessons.length; i++) {
      const lesson = mod.lessons[i];
      
      if (lesson.id === '6.3') {
        console.log(chalk.yellow('\n⚠️ Checking payment status...'));
        try {
          const payment = await checkPayment();
          if (!payment.paid) {
            console.log(chalk.red('\n❌ Payment required.'));
            console.log(chalk.white(`💳 Invoice: ${payment.invoice}`));
            return;
          }
        } catch (e) {
          console.log(chalk.red(`❌ Payment check failed: ${e.message}`));
          return;
        }
      }
      
      printLesson(lesson);
      
      if (i < mod.lessons.length - 1) {
        const { next } = await inquirer.prompt([{
          type: 'confirm',
          name: 'next',
          message: 'Continue to next lesson?',
          default: true
        }]);
        if (!next) break;
      }
    }
    
    console.log(chalk.green('\n✅ Module completed!'));
  });

program
  .command('check-env')
  .description('Check your development environment')
  .action(() => {
    checkEnvironment();
  });

program.parse(process.argv);
