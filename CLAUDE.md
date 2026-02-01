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

- **capstring** - Core text transformation library (24 styles)
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

## How Claude Should Work

### Planning Before Coding
For complex tasks, thoroughly plan before writing code. Create a clear implementation plan, identify affected files, and consider edge cases. A well-thought-out plan enables one-shot implementations with fewer iterations.

### Self-Improvement
When corrected on a mistake, propose an update to this CLAUDE.md file to prevent the same mistake in future sessions. Be specific about what went wrong and how to avoid it.

### Autonomous Problem Solving
When asked to fix bugs or failing tests, investigate independently. Check CI logs, read error messages, trace the issue, and fix it without requiring step-by-step guidance. Use subagents for complex multi-file investigations to keep the main context focused.

### Code Review Mindset
When asked to review changes, be critical and thorough. Identify potential issues, suggest improvements, and verify the solution actually works. Don't just rubber-stamp changes - challenge assumptions and prove correctness.

### Iterative Refinement
If an initial solution feels hacky or overly complex, step back and reconsider. Sometimes the best approach is to scrap a mediocre implementation and design a cleaner solution from scratch, using everything learned from the first attempt.

### Context Efficiency
Offload discrete subtasks to subagents to preserve main context for high-level coordination. This is especially useful for research, file exploration, and isolated fixes that don't need full conversation history.
