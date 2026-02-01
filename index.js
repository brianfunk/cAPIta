/*
          _    ____ ___ _
   ___   / \  |  _ \_ _| |_ __ _
  / __| / _ \ | |_) | || __/ _` |
 | (__ / ___ \|  __/| || || (_| |
  \___/_/   \_\_|  |___|\__\__,_|

*/

/**
 * cAPIta - Capitalization API
 * REST API powered by capstring
 * @module cAPIta
 */

import 'dotenv/config';
import express from 'express';
import capstring, { STYLES, isValidStyle } from 'capstring';
import nspell from 'nspell';
import dictionary from 'dictionary-en';

const PORT = process.env.PORT || 4321;

/** Maximum input length to prevent abuse */
const MAX_INPUT_LENGTH = 10000;

/** Fetch timeout in milliseconds */
const FETCH_TIMEOUT = 5000;

/** Supported output formats */
const EXTS = Object.freeze(['json', 'jsonp', 'html', 'txt', 'xml', 'yaml', 'yml', 'csv']);

/** Lorem Ipsum base text */
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

/** @type {import('nspell').default|null} */
let spellChecker = null;

/**
 * Initialize the spell checker with the English dictionary
 */
const initSpellChecker = () => {
  if (spellChecker) return;
  spellChecker = nspell(dictionary);
};

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
const escapeHtml = (str) => {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};

/**
 * Spell check and correct text using nspell
 * @param {string} text - Text to spell check
 * @returns {string} Corrected text
 */
const spellCheckText = (text) => {
  initSpellChecker();

  // Split into words while preserving spacing and punctuation
  const words = text.split(/(\s+)/);

  const corrected = words.map((word) => {
    // Skip whitespace
    if (/^\s*$/.test(word)) return word;

    // Extract punctuation from word
    const match = word.match(/^([^a-zA-Z]*)([a-zA-Z]+)([^a-zA-Z]*)$/);
    if (!match) return word;

    const [, prefix, core, suffix] = match;

    // Check if word is spelled correctly
    if (spellChecker.correct(core)) {
      return word;
    }

    // Get suggestions
    const suggestions = spellChecker.suggest(core);
    if (suggestions.length > 0) {
      return prefix + suggestions[0] + suffix;
    }

    return word;
  });

  return corrected.join('');
};

/**
 * Format and send response based on extension/content type
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {string} input - Original input
 * @param {string} output - Transformed output
 * @param {string} cap - Capitalization type
 * @param {string|false} ext - File extension or false for content negotiation
 */
const outResponse = (req, res, input, output, cap, ext) => {
  const safeOutput = escapeHtml(output);
  const outHtml = `<head><title></title></head><body><p><strong><em>${safeOutput}</em></strong></p></body>`;
  const outJson = { input, output, cap };

  if (ext) {
    if (!EXTS.includes(ext)) {
      res.status(400).send('error - invalid ext');
      return;
    }

    switch (ext) {
      case 'txt':
        res.type('text');
        res.send(output);
        break;
      case 'html':
        res.type('html');
        res.send(outHtml);
        break;
      case 'json':
        res.json(outJson);
        break;
      case 'jsonp':
        res.jsonp(outJson);
        break;
      case 'xml':
        res.type('application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<result>\n  <input>${escapeHtml(input)}</input>\n  <output>${safeOutput}</output>\n  <cap>${cap}</cap>\n</result>`);
        break;
      case 'yaml':
      case 'yml':
        res.type('text/yaml');
        // YAML escape: handle quotes, newlines, special chars
        const yamlEscape = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        res.send(`input: "${yamlEscape(input)}"\noutput: "${yamlEscape(output)}"\ncap: "${cap}"`);
        break;
      case 'csv':
        res.type('text/csv');
        // CSV escape: double quotes and handle newlines (wrap in quotes)
        const csvEscape = (s) => s.replace(/"/g, '""').replace(/[\r\n]/g, ' ');
        res.send(`input,output,cap\n"${csvEscape(input)}","${csvEscape(output)}","${cap}"`);
        break;
    }
  } else {
    res.format({
      text: () => res.send(output),
      html: () => res.send(outHtml),
      json: () => res.json(outJson),
      jsonp: () => res.jsonp(outJson)
    });
  }
};

/**
 * Create and configure the Express app
 * @returns {express.Application} Configured Express app
 */
export const createApp = () => {
  const app = express();

  // Root route
  app.get('/', (_req, res) => {
    res.send('cAPIta');
  });

  // List available styles
  app.get('/styles', (_req, res) => {
    res.json({
      styles: STYLES,
      count: STYLES.length
    });
  });

  // Badge route
  app.get('/badge/:cap/:string', async (req, res) => {
    const { cap, string } = req.params;

    if (!isValidStyle(cap)) {
      res.status(400).send('error - invalid case');
      return;
    }

    if (string.length > MAX_INPUT_LENGTH) {
      res.status(400).send('error - input too long');
      return;
    }

    const cs = capstring(string, cap);
    const badgeUrl = `https://img.shields.io/badge/cAPIta%20${capstring(cap, cap)}-${encodeURIComponent(cs)}-b5d4ff.svg`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch(badgeUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        res.status(502).send('error - badge service unavailable');
        return;
      }
      res.type('image/svg+xml');
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch {
      res.status(502).send('error - badge service unavailable');
    }
  });

  // Word and character count
  app.get('/count/:string.:ext?', (req, res) => {
    const { string, ext } = req.params;

    if (string.length > MAX_INPUT_LENGTH) {
      res.status(400).send('error - input too long');
      return;
    }

    const words = string.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = string.length;
    const charsNoSpaces = string.replace(/\s/g, '').length;

    const result = {
      input: string,
      words: words.length,
      characters: chars,
      charactersNoSpaces: charsNoSpaces
    };

    if (ext === 'json' || !ext) {
      res.json(result);
    } else if (ext === 'txt') {
      res.type('text');
      res.send(`words: ${words.length}, chars: ${chars}, chars (no spaces): ${charsNoSpaces}`);
    } else if (ext === 'html') {
      const safeInput = escapeHtml(string);
      res.type('html');
      res.send(`<head><title>Count</title></head><body><p>Input: <em>${safeInput}</em></p><p>Words: ${words.length}</p><p>Characters: ${chars}</p><p>Characters (no spaces): ${charsNoSpaces}</p></body>`);
    } else {
      res.status(400).send('error - invalid ext');
    }
  });

  // Lorem ipsum generator
  app.get('/lorem/:count?.:ext?', (req, res) => {
    const parsedCount = parseInt(req.params.count, 10);
    const count = isNaN(parsedCount) ? 50 : parsedCount;
    const { ext } = req.params;

    if (count < 1 || count > 1000) {
      res.status(400).send('error - count must be 1-1000');
      return;
    }

    // Generate lorem ipsum words
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    const lorem = words.join(' ') + '.';

    if (ext === 'json' || !ext) {
      res.json({ lorem, wordCount: count });
    } else if (ext === 'txt') {
      res.type('text');
      res.send(lorem);
    } else if (ext === 'html') {
      res.type('html');
      res.send(`<head><title>Lorem Ipsum</title></head><body><p>${lorem}</p></body>`);
    } else {
      res.status(400).send('error - invalid ext');
    }
  });

  // Batch/bulk transformation (POST)
  app.use(express.json());
  app.post('/batch', (req, res) => {
    const { inputs, style } = req.body;

    if (!Array.isArray(inputs)) {
      res.status(400).json({ error: 'inputs must be an array' });
      return;
    }

    if (inputs.length > 100) {
      res.status(400).json({ error: 'maximum 100 inputs per batch' });
      return;
    }

    if (!isValidStyle(style)) {
      res.status(400).json({ error: 'invalid style', validStyles: [...STYLES] });
      return;
    }

    const results = inputs.map(input => {
      if (typeof input !== 'string') {
        return { input, output: null, error: 'input must be string' };
      }
      if (input.length > MAX_INPUT_LENGTH) {
        return { input: input.slice(0, 50) + '...', output: null, error: 'input too long' };
      }
      const output = capstring(input, style);
      return { input, output };
    });

    res.json({ style, results, count: results.length });
  });

  // Chain multiple transformations
  app.get('/chain/:styles/:string.:ext?', (req, res) => {
    const { styles, string, ext } = req.params;

    if (string.length > MAX_INPUT_LENGTH) {
      res.status(400).send('error - input too long');
      return;
    }

    const styleList = styles.split('+');
    if (styleList.length > 10) {
      res.status(400).send('error - maximum 10 chained styles');
      return;
    }

    for (const s of styleList) {
      if (!isValidStyle(s)) {
        res.status(400).send(`error - invalid style: ${s}`);
        return;
      }
    }

    let result = string;
    for (const s of styleList) {
      result = capstring(result, s);
      if (result === false) {
        res.status(400).send('error - transformation failed');
        return;
      }
    }

    outResponse(req, res, string, result, styleList.join('+'), ext || false);
  });

  // Spell check with extension
  app.get('/spell/:string.:ext', (req, res) => {
    const { string, ext } = req.params;

    try {
      const cs = spellCheckText(string);
      outResponse(req, res, string, cs, 'spell', ext);
    } catch {
      res.status(500).send('error - spell check failed');
    }
  });

  // Spell check without extension
  app.get('/spell/:string', (req, res) => {
    const { string } = req.params;

    try {
      const cs = spellCheckText(string);
      outResponse(req, res, string, cs, 'spell', false);
    } catch {
      res.status(500).send('error - spell check failed');
    }
  });

  // Capitalize with extension
  app.get('/:cap/:string.:ext', (req, res) => {
    const { cap, string, ext } = req.params;

    if (!isValidStyle(cap)) {
      res.status(400).send('error - invalid case');
      return;
    }

    if (string.length > MAX_INPUT_LENGTH) {
      res.status(400).send('error - input too long');
      return;
    }

    const cs = capstring(string, cap);
    if (!cs && cap !== 'none') {
      res.status(400).send('error - invalid string');
      return;
    }

    outResponse(req, res, string, cs, cap, ext);
  });

  // Capitalize without extension
  app.get('/:cap/:string', (req, res) => {
    const { cap, string } = req.params;

    if (!isValidStyle(cap)) {
      res.status(400).send('error - invalid case');
      return;
    }

    if (string.length > MAX_INPUT_LENGTH) {
      res.status(400).send('error - input too long');
      return;
    }

    const cs = capstring(string, cap);
    if (!cs && cap !== 'none') {
      res.status(400).send('error - invalid string');
      return;
    }

    outResponse(req, res, string, cs, cap, false);
  });

  return app;
};

// Start server if run directly
const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`cAPIta listening on port ${PORT}`);
});

export { app, server, STYLES as CASES };
export default app;
