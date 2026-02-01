#!/usr/bin/env node
/*
 * cAPIta demo
 * Run: npm run demo
 */

import { createApp, CASES } from './index.js';

const app = createApp();
const PORT = 4322; // Use different port for demo

const server = app.listen(PORT, async () => {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                      cAPIta demo                               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log(`📍 Server running on port ${PORT}\n`);
  console.log(`📝 ${CASES.length} capitalization styles available:\n`);

  const testString = 'hello world';

  // Group styles
  const styleGroups = {
    'Case Styles': ['upper', 'lower', 'title', 'sentence', 'proper'],
    'Code Styles': ['camel', 'pascal', 'snake', 'kebab', 'constant', 'dot', 'path'],
    'Fun Styles': ['leet', 'reverse', 'sponge', 'swap', 'crazy', 'random'],
    'Utility': ['same', 'none', 'slug', 'alternate']
  };

  for (const [group, styles] of Object.entries(styleGroups)) {
    console.log(`\n${group}:`);
    console.log('─'.repeat(50));

    for (const style of styles) {
      try {
        const url = `http://localhost:${PORT}/${style}/${encodeURIComponent(testString)}.json`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(`  ${style.padEnd(12)} │ "${testString}" → "${data.output}"`);
      } catch {
        console.log(`  ${style.padEnd(12)} │ (error)`);
      }
    }
  }

  console.log('\n\n🔮 Spell Check:');
  console.log('─'.repeat(50));
  const spellTests = ['helo wrld', 'teh quik brwn fox'];
  for (const test of spellTests) {
    const url = `http://localhost:${PORT}/spell/${encodeURIComponent(test)}.json`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(`  "${test}" → "${data.output}"`);
  }

  console.log('\n\n📋 API Endpoints:');
  console.log('─'.repeat(50));
  console.log('  GET /:style/:text         Transform text');
  console.log('  GET /:style/:text.:ext    With format (json/txt/html)');
  console.log('  GET /spell/:text          Spell check');
  console.log('  GET /styles               List all styles');
  console.log('  GET /badge/:style/:text   Generate SVG badge');

  console.log('\n');
  server.close();
  process.exit(0);
});
