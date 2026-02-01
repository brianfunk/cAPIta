# AI Agent Instructions for cAPIta

## Overview

`cAPIta` is a REST API for text capitalization and transformation. Powered by capstring, it provides 24 different capitalization styles, spell checking, and multiple output formats.

## API Endpoints

### Text Transformation
```
GET /:style/:string          # With content negotiation
GET /:style/:string.:ext     # With explicit format
```

**Styles (24 total):**
- Case: `upper`, `lower`, `title`, `sentence`, `proper`, `swap`
- Code: `camel`, `pascal`, `snake`, `kebab`, `slug`, `constant`, `python`, `dot`, `path`
- Fun: `leet`, `reverse`, `sponge`, `mock`, `alternate`, `crazy`, `random`
- Utility: `same`, `none`

**Extensions:** `json`, `jsonp`, `html`, `txt`, `xml`, `yaml`, `yml`, `csv`

### Spell Check
```
GET /spell/:string
GET /spell/:string.:ext
```

### Badge Generation
```
GET /badge/:style/:string    # Returns SVG
```

### List Styles
```
GET /styles                  # Returns all available styles
```

## Usage Examples

```bash
# Title case as JSON
curl http://localhost:4321/title/hello%20world.json

# Snake case as text
curl http://localhost:4321/snake/hello%20world.txt

# Spell check
curl http://localhost:4321/spell/helo%20wrld.json

# Get all styles
curl http://localhost:4321/styles
```

## Programmatic Usage

```javascript
import { createApp } from 'capita';

const app = createApp();
app.listen(3000);
```

## Important Notes

- XSS protection: HTML output automatically escapes special characters
- Spell checking uses nspell (Hunspell-compatible), no API key needed
- Default port is 4321, configurable via `PORT` env var
- ESM-only package
- All 24 styles come from the capstring library

## Testing

```bash
npm test              # Run tests
npm run lint          # Run ESLint
npm run test:coverage # Run with coverage
npm start             # Start server
```

## Architecture

- `index.js` - Express server with all routes
- `createApp()` - Factory function for testability
- Uses `capstring` package for all transformations
- Uses `nspell` + `dictionary-en` for spell checking

## Related

- **capstring** - Core library (https://github.com/brianfunk/capstring)
