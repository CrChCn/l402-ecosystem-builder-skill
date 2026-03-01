#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// ==================== КОНТЕНТ МОДУЛЕЙ ====================
const modules = {
  1: {
    title: 'Module 1: L402 Fundamentals',
    lessons: [
      {
        id: '1.1',
        title: 'What is L402?',
        content: `
L402 (Lightning HTTP 402) is an open protocol developed by Lightning Labs. It combines:

- HTTP 402 "Payment Required" status code (unused for decades)
- Lightning Network invoices for instant micropayments
- Macaroons for delegated authorization

The result: a standard for machine-to-machine payments where agents can pay per request without signup, API keys, or identity.
        `,
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

Lightning Network provides all this. L402 wraps it in HTTP.
        `,
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
lncli create
        `,
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
lncli getinfo | grep synced_to_chain
        `,
        commands: [
          'lnd --bitcoin.active --bitcoin.mainnet --bitcoin.node=neutrino --feeurl=https://mempool.space/api/v1/fees/recommended',
          'lncli unlock',
          'lncli getinfo | grep synced_to_chain'
        ],
        links: []
      }
    ]
  },
  3: {
    title: 'Module 3: Building Backends',
    lessons: [
      {
        id: '3.1',
        title: 'CryptoAI Pro (Python)',
        content: `
Simple Python server that returns predictions:

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time

class CryptoAIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/paid/BTC':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = {
                "asset": "BTC",
                "prediction": "BULLISH",
                "confidence": 92,
                "price": 85432
            }
            self.wfile.write(json.dumps(data).encode())

server = HTTPServer(('localhost', 8081), CryptoAIHandler)
server.serve_forever()
        `,
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
Example: "twenty five + fourteen" = 39.00
        `,
        commands: [
          'curl -X POST "https://moltbook.com/api/v1/posts" -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" -d \'{"submolt":"aitools","title":"Test","content":"Test"}\''
        ],
        links: []
      }
    ]
  },
  5: {
    title: 'Module 5: Monetization',
    lessons: [
      {
        id: '5.1',
        title: 'Aperture Configuration',
        content: `
Example config with multiple services:

services:
  - name: "crypto-paid"
    hostregexp: ".*"
    pathregexp: "^/paid/.*$"
    address: "127.0.0.1:8081"
    price: 500
  - name: "jobs-paid"
    hostregexp: ".*"
    pathregexp: "^/paid/jobs/.*$"
    address: "127.0.0.1:8083"
    price: 1000
        `,
        commands: [
          'nano ~/.aperture/aperture-working.yaml'
        ],
        links: []
      }
    ]
  }
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
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
}

function checkEnvironment() {
  printHeader('🔍 Environment Check');
  
  const checks = [
    { name: 'Node.js', cmd: 'node --version', async: false },
    { name: 'npm', cmd: 'npm --version', async: false },
    { name: 'git', cmd: 'git --version', async: false },
    { name: 'LND', cmd: 'lncli --version', async: false },
    { name: 'Aperture', cmd: 'aperture --version', async: false },
    { name: 'ngrok', cmd: 'ngrok --version', async: false }
  ];
  
  checks.forEach(check => {
    try {
      const { execSync } = require('child_process');
      const output = execSync(check.cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      console.log(chalk.green(`✅ ${check.name}: ${output.trim().split('\n')[0]}`));
    } catch (e) {
      console.log(chalk.red(`❌ ${check.name}: not found`));
    }
  });
}

// ==================== ОСНОВНАЯ ПРОГРАММА ====================
program
  .name('l402-skill')
  .description('🦞 L402 Ecosystem Builder Skill')
  .version('1.0.0');

program
  .command('list')
  .description('Show available modules')
  .action(() => {
    printHeader('📚 Available Modules');
    for (let i = 1; i <= 5; i++) {
      const module = modules[i];
      if (module) {
        console.log(chalk.white(`\n${i}. ${module.title}`));
        module.lessons.forEach(lesson => {
          console.log(chalk.gray(`   ${lesson.id} - ${lesson.title}`));
        });
      }
    }
  });

program
  .command('learn')
  .argument('<module>', 'Module number (1-5)')
  .description('Start a module')
  .action(async (moduleNum) => {
    const module = modules[moduleNum];
    if (!module) {
      console.log(chalk.red(`❌ Module ${moduleNum} not found`));
      return;
    }
    
    printHeader(`📖 ${module.title}`);
    
    for (let i = 0; i < module.lessons.length; i++) {
      const lesson = module.lessons[i];
      printLesson(lesson);
      
      if (i < module.lessons.length - 1) {
        const { next } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'next',
            message: 'Continue to next lesson?',
            default: true
          }
        ]);
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
