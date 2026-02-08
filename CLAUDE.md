# Claude Code Instructions for cAPIta

## Project Context

cAPIta is a REST API for text transformation and capitalization. It wraps the `capstring` library in an Express server with multiple output formats and spell checking.

## Development Commands

```bash
npm install           # Install dependencies
npm start             # Start the server (port 4321)
npm run demo          # Run interactive demo
npm test              # Run Vitest tests
npm run lint          # Run ESLint
npm run lint:report   # Generate HTML lint report
npm run test:coverage # Run tests with coverage
```

## Code Style

- ES2022+ syntax (const/let, arrow functions, async/await)
- ESM modules only (`import`/`export`)
- Full JSDoc documentation
- Express.js patterns

## Architecture

```
index.js
├── Imports (capstring, nspell, express)
├── Spell checker initialization
├── Helper functions
│   ├── escapeHtml() - XSS prevention
│   ├── spellCheckText() - Spell correction
│   └── outResponse() - Format output by type
├── createApp() - Express app factory
│   ├── GET / - Root route
│   ├── GET /styles - List all styles
│   ├── GET /badge/:cap/:string - SVG badges
│   ├── GET /spell/:string - Spell check
│   └── GET /:cap/:string - Main transform
└── Server startup
```

## Key Dependencies

- **capstring** - Core text transformation library (29 styles)
- **nspell** - Spell checking (no API key needed)
- **dictionary-en** - English dictionary for nspell
- **express** - Web framework

## Security Considerations

- **XSS Prevention**: `escapeHtml()` escapes `<`, `>`, `&`, `"`, `'` in HTML output
- **Input validation**: Validates style against capstring's STYLES
- **No SQL/NoSQL**: Pure in-memory operations

## When Making Changes

1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Run linter: `npm run lint`
4. Test manually: `npm start` then `curl http://localhost:4321/title/test`
5. Update CHANGELOG.md for user-facing changes
6. Preserve the fun flair (ASCII art header)

## Related Projects

- **capstring** - The core library (https://github.com/brianfunk/capstring)

---

## Working Style

### Think First, Code Second
For anything non-trivial, plan the approach before writing code. Identify which files change, what the edge cases are, and how to verify it works. A solid plan means fewer iterations and cleaner implementations.

### Own the Problem
When something's broken - CI failing, bug reported, error in logs - just go fix it. Read the error, trace the cause, implement the fix. Don't wait for instructions on each step.

### Verify, Don't Assume
After making changes, prove they work. Run the tests. Check the output. If asked to review code, be genuinely critical - find the issues, don't just approve.

### When Stuck or Wrong
If a solution feels hacky, stop. Rethink from scratch using what you learned. If corrected on a mistake, suggest a CLAUDE.md update to prevent it happening again - be specific about what to avoid.

### Stay Focused
Use subagents for research, exploration, or isolated subtasks. Keep the main conversation for coordinating and making decisions.
