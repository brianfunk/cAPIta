# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-01

### Breaking Changes

- **Node.js 18+ required** - Dropped support for older Node.js versions
- **ESM only** - Package now uses ES modules (`import`/`export`)
- **HTML output is now XSS-escaped** - Special characters (`<`, `>`, `&`, `"`, `'`) are escaped in HTML responses
- **Spell check now uses nspell** - Replaced Bing Spell Check API with open-source nspell (no API key required)

### Added

- **29 capitalization styles** - All styles powered by capstring v1.0.0
- **New Endpoints**
  - `GET /count/:string` - Word and character count
  - `GET /lorem/:count?` - Lorem ipsum generator
  - `POST /batch` - Batch transform up to 100 strings
  - `GET /chain/:styles/:string` - Chain multiple transformations (e.g., `/chain/upper+reverse/hello`)
- **New output formats** - XML, YAML, YML, CSV in addition to JSON, JSONP, HTML, TXT
- `GET /styles` endpoint to list all available styles
- `createApp()` export for testing and programmatic use
- Open-source spell checking with nspell (Hunspell-compatible)
- Full test suite with supertest (78 tests)
- XSS protection for HTML output
- GitHub Actions CI
- Vitest test framework with 84% coverage
- ESLint 9 with flat config
- PR and issue templates

### Fixed

- **XSS vulnerability** - HTML output now properly escapes user input
- **Security hardening** - Added fetch timeout (5s), input length limits (10k chars), batch limits (100 items)
- Fixed YAML/CSV escaping for newlines and special characters
- Extracted duplicate spell-check logic to shared function

### Changed

- Complete ES2022+ rewrite (const/let, arrow functions, async/await, template literals)
- Replaced deprecated `request` package with native `fetch` (Node 18+)
- Migrated from callbacks to async/await

### Removed

- `async` dependency (unused)
- `request` dependency (replaced with native fetch)
- CommonJS support (`require()`)

## [0.0.1] - 2016

- Initial release
