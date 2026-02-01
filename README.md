[![cAPIta](https://img.shields.io/badge/cAPIta-CaPiTaLiZaTiOn%20API-b5d4ff.svg)](https://github.com/brianfunk/cAPIta)
[![npm version](https://img.shields.io/npm/v/capita.svg)](https://www.npmjs.com/package/capita)
[![npm downloads](https://img.shields.io/npm/dm/capita.svg)](https://www.npmjs.com/package/capita)
[![CI](https://github.com/brianfunk/cAPIta/actions/workflows/ci.yml/badge.svg)](https://github.com/brianfunk/cAPIta/actions/workflows/ci.yml)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![LinkedIn](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/brianrandyfunk)

# cAPIta

> cAPIta - Capitalization API

A blazing-fast REST API for text transformation. Convert any string to 29 different styles including camelCase, snake_case, kebab-case, and more! Powered by [capstring](https://github.com/brianfunk/capstring).

## Why cAPIta?

- **29 capitalization styles** - More than any other text transform API!
- **Multiple output formats** - JSON, JSONP, HTML, TXT, XML, YAML, CSV
- **Built-in spell check** - Powered by nspell (no API key required!)
- **Batch processing** - Transform up to 100 strings at once
- **Chain transformations** - Apply multiple styles in sequence
- **Word/char count** - Built-in text analytics
- **Lorem ipsum generator** - Generate placeholder text
- **XSS-safe HTML output** - Security built in
- **Content negotiation** - Automatic format based on Accept header

## Quick Start

```bash
# Install
npm install capita

# Start the server
npm start

# Try it out!
curl http://localhost:4321/title/hello%20world.json
# {"input":"hello world","output":"Hello World","cap":"title"}

# See all available styles
curl http://localhost:4321/styles
```

## API Endpoints

### Transform Text

```
GET /:style/:string
GET /:style/:string.:ext
```

### Chain Multiple Transformations

```
GET /chain/:styles/:string
```

Chain styles with `+`:

```bash
curl http://localhost:4321/chain/upper+reverse/hello.json
# {"input":"hello","output":"OLLEH","cap":"upper+reverse"}

curl http://localhost:4321/chain/lower+title+kebab/HELLO%20WORLD.txt
# hello-world
```

### Batch Processing

```
POST /batch
```

Transform multiple strings at once:

```bash
curl -X POST http://localhost:4321/batch \
  -H "Content-Type: application/json" \
  -d '{"inputs": ["hello", "world"], "style": "upper"}'
# {"style":"upper","results":[{"input":"hello","output":"HELLO"},{"input":"world","output":"WORLD"}],"count":2}
```

### Word/Character Count

```
GET /count/:string
GET /count/:string.:ext
```

```bash
curl http://localhost:4321/count/hello%20world.json
# {"input":"hello world","words":2,"characters":11,"charactersNoSpaces":10}
```

### Lorem Ipsum Generator

```
GET /lorem/:count?
GET /lorem/:count?.:ext
```

```bash
curl http://localhost:4321/lorem/10.json
# {"lorem":"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do.","wordCount":10}
```

### All 29 Capitalization Styles

#### Case Styles
| Style | Input | Output |
|-------|-------|--------|
| `upper` | hello world | HELLO WORLD |
| `lower` | HELLO WORLD | hello world |
| `title` | hello world | Hello World |
| `sentence` | hello world | Hello world |
| `swap` | Hello World | hELLO wORLD |

#### Code Styles
| Style | Input | Output |
|-------|-------|--------|
| `camel` | hello world | helloWorld |
| `pascal` | hello world | HelloWorld |
| `snake` | hello world | hello_world |
| `kebab` | hello world | hello-world |
| `constant` | hello world | HELLO_WORLD |
| `dot` | hello world | hello.world |
| `path` | hello world | hello/world |
| `train` | hello world | Hello-World |

#### Fun Styles
| Style | Input | Output |
|-------|-------|--------|
| `leet` | elite | 3£1t3 |
| `reverse` | hello | olleh |
| `sponge` | hello | HeLlO |
| `hashtag` | hello world | #HelloWorld |
| `acronym` | as soon as possible | ASAP |
| `rot13` | hello | uryyb |
| `flip` | hello | ollǝɥ |

### Output Formats

| Extension | Content-Type | Example |
|-----------|--------------|---------|
| `.json` | application/json | `{"input":"hello","output":"HELLO","cap":"upper"}` |
| `.jsonp` | application/javascript | Callback wrapper |
| `.html` | text/html | `<em>HELLO</em>` |
| `.txt` | text/plain | `HELLO` |
| `.xml` | application/xml | `<result><output>HELLO</output></result>` |
| `.yaml` | text/yaml | `output: "HELLO"` |
| `.csv` | text/csv | `input,output,cap` |

### Spell Check

```
GET /spell/:string
GET /spell/:string.:ext
```

Uses [nspell](https://github.com/wooorm/nspell) with the English Hunspell dictionary. No API key required!

```bash
curl http://localhost:4321/spell/helo%20wrld.json
# {"input":"helo wrld","output":"hello world","cap":"spell"}
```

### Generate Badges

```
GET /badge/:style/:string
```

Returns an SVG badge via shields.io. Perfect for README files!

### List Available Styles

```
GET /styles
```

Returns all available styles and their count.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4321` |

## Security

- **XSS Prevention** - HTML output is escaped
- **Input Limits** - Max 10,000 characters per request
- **Batch Limits** - Max 100 items per batch request
- **Chain Limits** - Max 10 transformations per chain
- **Fetch Timeout** - 5 second timeout on badge requests

## Development

```bash
npm install        # Install dependencies
npm start          # Start server
npm run demo       # Run interactive demo
npm test           # Run tests
npm run lint       # Run linter
npm run test:coverage # Test with coverage (84%+)
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests.

## Versioning

This project uses [Semantic Versioning 2.0](http://semver.org/spec/v2.0.0.html).

## Related Projects

- **[capstring](https://github.com/brianfunk/capstring)** - The core library that powers cAPIta

## Requirements

- Node.js 18+
- ES modules (`import`/`export`)

## License

MIT
