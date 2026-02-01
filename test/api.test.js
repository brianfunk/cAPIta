import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../index.js';

const app = createApp();

describe('cAPIta API', () => {
  describe('GET /', () => {
    it('returns cAPIta', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('cAPIta');
    });
  });

  describe('GET /styles', () => {
    it('returns list of available styles', async () => {
      const res = await request(app).get('/styles');
      expect(res.status).toBe(200);
      expect(res.body.styles).toContain('title');
      expect(res.body.styles).toContain('kebab');
      expect(res.body.count).toBeGreaterThan(20);
    });
  });

  describe('Capitalization endpoints', () => {
    describe('GET /:cap/:string (JSON format)', () => {
      it('returns title case', async () => {
        const res = await request(app).get('/title/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('Hello World');
        expect(res.body.cap).toBe('title');
      });

      it('returns upper case', async () => {
        const res = await request(app).get('/upper/hello.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('HELLO');
      });

      it('returns lower case', async () => {
        const res = await request(app).get('/lower/HELLO.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello');
      });

      it('returns same case', async () => {
        const res = await request(app).get('/same/HeLLo.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('HeLLo');
      });

      it('returns sentence case', async () => {
        const res = await request(app).get('/sentence/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('Hello world');
      });

      it('returns proper case', async () => {
        const res = await request(app).get('/proper/hello.json');
        expect(res.status).toBe(200);
        // capstring 'proper' returns lowercase (it capitalizes first letter of each word, but hello is one word)
        expect(res.body.output).toBe('hello');
      });

      it('returns camel case', async () => {
        const res = await request(app).get('/camel/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('helloWorld');
      });

      it('returns pascal case', async () => {
        const res = await request(app).get('/pascal/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('HelloWorld');
      });

      it('returns snake case', async () => {
        const res = await request(app).get('/snake/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello_world');
      });

      it('returns python case', async () => {
        const res = await request(app).get('/python/hello%20world.json');
        expect(res.status).toBe(200);
        // capstring 'python' returns SCREAMING_SNAKE_CASE
        expect(res.body.output).toBe('HELLO_WORLD');
      });

      it('returns reverse case', async () => {
        const res = await request(app).get('/reverse/hello.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('olleh');
      });

      it('returns leet case', async () => {
        const res = await request(app).get('/leet/leet.json');
        expect(res.status).toBe(200);
        // capstring 'leet' uses £ for l
        expect(res.body.output).toBe('£33t');
      });

      it('returns 400 for invalid case', async () => {
        const res = await request(app).get('/invalid/hello');
        expect(res.status).toBe(400);
        expect(res.text).toBe('error - invalid case');
      });

      // New custom styles
      it('returns kebab case', async () => {
        const res = await request(app).get('/kebab/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello-world');
      });

      it('returns slug case (alias for kebab)', async () => {
        const res = await request(app).get('/slug/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello-world');
      });

      it('returns dot case', async () => {
        const res = await request(app).get('/dot/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello.world');
      });

      it('returns path case', async () => {
        const res = await request(app).get('/path/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hello/world');
      });

      it('returns constant case', async () => {
        const res = await request(app).get('/constant/hello%20world.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('HELLO_WORLD');
      });

      it('returns sponge case (starts uppercase)', async () => {
        const res = await request(app).get('/sponge/hello.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('HeLlO');
      });

      it('returns swap case', async () => {
        const res = await request(app).get('/swap/Hello%20World.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hELLO wORLD');
      });

      it('returns alternate case', async () => {
        const res = await request(app).get('/alternate/hello.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('hElLo');
      });
    });

    describe('GET /:cap/:string.:ext', () => {
      it('returns JSON format', async () => {
        const res = await request(app).get('/title/hello.json');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body.output).toBe('Hello');
      });

      it('returns text format', async () => {
        const res = await request(app).get('/upper/hello.txt');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/plain');
        expect(res.text).toBe('HELLO');
      });

      it('returns HTML format', async () => {
        const res = await request(app).get('/title/hello.html');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
        expect(res.text).toContain('<em>Hello</em>');
      });

      it('returns 400 for invalid extension', async () => {
        const res = await request(app).get('/title/hello.pdf');
        expect(res.status).toBe(400);
        expect(res.text).toBe('error - invalid ext');
      });

      it('returns XML format', async () => {
        const res = await request(app).get('/title/hello%20world.xml');
        expect(res.status).toBe(200);
        expect(res.type).toBe('application/xml');
        expect(res.text).toContain('<output>Hello World</output>');
      });

      it('returns YAML format', async () => {
        const res = await request(app).get('/title/hello%20world.yaml');
        expect(res.status).toBe(200);
        expect(res.text).toContain('output: "Hello World"');
      });

      it('returns CSV format', async () => {
        const res = await request(app).get('/title/hello%20world.csv');
        expect(res.status).toBe(200);
        expect(res.type).toBe('text/csv');
        expect(res.text).toContain('Hello World');
      });

      it('returns 400 for invalid case with extension', async () => {
        const res = await request(app).get('/notacase/hello.json');
        expect(res.status).toBe(400);
        expect(res.text).toBe('error - invalid case');
      });

      it('returns JSONP format', async () => {
        const res = await request(app).get('/upper/hello.jsonp?callback=myFunc');
        expect(res.status).toBe(200);
        expect(res.text).toContain('myFunc');
        expect(res.text).toContain('HELLO');
      });

      it('returns empty for none case', async () => {
        const res = await request(app).get('/none/hello.json');
        expect(res.status).toBe(200);
        expect(res.body.output).toBe('');
        expect(res.body.cap).toBe('none');
      });
    });
  });

  describe('XSS Prevention', () => {
    it('escapes HTML in HTML output', async () => {
      const res = await request(app).get('/same/test%3Cscript%3Ealert(1)%3C%2Fscript%3E.html');
      expect(res.status).toBe(200);
      expect(res.text).not.toContain('<script>');
      expect(res.text).toContain('&lt;script&gt;');
    });

    it('escapes angle brackets', async () => {
      const res = await request(app).get('/same/%3Cb%3Ebold%3C%2Fb%3E.html');
      expect(res.status).toBe(200);
      expect(res.text).not.toContain('<b>');
      expect(res.text).toContain('&lt;b&gt;');
    });

    it('escapes ampersands', async () => {
      const res = await request(app).get('/same/foo%26bar.html');
      expect(res.status).toBe(200);
      expect(res.text).toContain('&amp;');
    });

    it('escapes double quotes', async () => {
      const res = await request(app).get('/same/%22quoted%22.html');
      expect(res.status).toBe(200);
      expect(res.text).toContain('&quot;');
    });

    it('escapes single quotes', async () => {
      const res = await request(app).get("/same/%27quoted%27.html");
      expect(res.status).toBe(200);
      expect(res.text).toContain('&#39;');
    });

    it('does not escape JSON output (no HTML context)', async () => {
      const res = await request(app).get('/same/%3Cscript%3E.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('<script>');
    });

    it('does not escape text output (no HTML context)', async () => {
      const res = await request(app).get('/same/%3Cscript%3E.txt');
      expect(res.status).toBe(200);
      expect(res.text).toBe('<script>');
    });
  });

  describe('Content Negotiation', () => {
    it('returns JSON when Accept header is application/json', async () => {
      const res = await request(app)
        .get('/title/hello')
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });

    it('returns text when Accept header is text/plain', async () => {
      const res = await request(app)
        .get('/title/hello')
        .set('Accept', 'text/plain');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/plain');
    });

    it('returns HTML when Accept header is text/html', async () => {
      const res = await request(app)
        .get('/title/hello')
        .set('Accept', 'text/html');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });

  });

  describe('Edge Cases', () => {
    it('handles special characters', async () => {
      const res = await request(app).get('/upper/hello%21%3F.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('HELLO!?');
    });

    it('handles numbers in string', async () => {
      const res = await request(app).get('/upper/test123.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('TEST123');
    });

    it('handles URL encoded spaces', async () => {
      const res = await request(app).get('/title/hello%20world.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('Hello World');
    });

    it('handles crazy case (randomized)', async () => {
      const res = await request(app).get('/crazy/hello.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBeTruthy();
      expect(res.body.cap).toBe('crazy');
    });

    it('handles random case', async () => {
      const res = await request(app).get('/random/hello.json');
      expect(res.status).toBe(200);
      expect(res.body.cap).toBe('random');
    });
  });
});

describe('Spell Check endpoints (nspell)', () => {
  describe('GET /spell/:string', () => {
    it('returns corrected spelling', async () => {
      const res = await request(app)
        .get('/spell/helo')
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.cap).toBe('spell');
      expect(res.body.input).toBe('helo');
      // nspell should suggest 'hello' for 'helo'
      expect(res.body.output).toBe('hello');
    });

    it('preserves correctly spelled words', async () => {
      const res = await request(app)
        .get('/spell/hello%20world')
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('hello world');
    });

    it('handles multiple misspelled words', async () => {
      const res = await request(app)
        .get('/spell/teh%20quik%20brwn%20fox')
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.cap).toBe('spell');
      // Words are corrected (exact corrections depend on dictionary)
      expect(res.body.output).toBeTruthy();
      expect(res.body.input).toBe('teh quik brwn fox');
    });
  });

  describe('GET /spell/:string.:ext', () => {
    it('returns corrected spelling as JSON', async () => {
      const res = await request(app).get('/spell/helo.json');
      expect(res.status).toBe(200);
      expect(res.body.cap).toBe('spell');
      expect(res.body.output).toBe('hello');
    });

    it('returns corrected spelling as text', async () => {
      const res = await request(app).get('/spell/helo.txt');
      expect(res.status).toBe(200);
      expect(res.text).toBe('hello');
    });

    it('returns corrected spelling as HTML', async () => {
      const res = await request(app).get('/spell/helo.html');
      expect(res.status).toBe(200);
      expect(res.text).toContain('hello');
    });
  });
});

describe('Badge endpoint', () => {
  describe('GET /badge/:cap/:string', () => {
    it('returns 400 for invalid case', async () => {
      const res = await request(app).get('/badge/invalid/hello');
      expect(res.status).toBe(400);
      expect(res.text).toBe('error - invalid case');
    });

    // Note: Success case skipped as it requires external shields.io service
    it.skip('returns SVG badge', async () => {
      const res = await request(app).get('/badge/upper/hello');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('svg');
    });
  });
});

describe('Count endpoint', () => {
  describe('GET /count/:string', () => {
    it('counts words and characters', async () => {
      const res = await request(app).get('/count/hello%20world');
      expect(res.status).toBe(200);
      expect(res.body.words).toBe(2);
      expect(res.body.characters).toBe(11);
      expect(res.body.charactersNoSpaces).toBe(10);
    });

    it('returns JSON by default', async () => {
      const res = await request(app).get('/count/test');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });

    it('returns text format', async () => {
      const res = await request(app).get('/count/hello.txt');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/plain');
      expect(res.text).toContain('words: 1');
    });

    it('returns HTML format', async () => {
      const res = await request(app).get('/count/hello.html');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('Words: 1');
    });

    it('returns 400 for invalid extension', async () => {
      const res = await request(app).get('/count/hello.pdf');
      expect(res.status).toBe(400);
      expect(res.text).toBe('error - invalid ext');
    });
  });
});

describe('Lorem endpoint', () => {
  describe('GET /lorem/:count?', () => {
    it('generates lorem ipsum with default count', async () => {
      const res = await request(app).get('/lorem');
      expect(res.status).toBe(200);
      expect(res.body.wordCount).toBe(50);
      expect(res.body.lorem).toContain('Lorem');
    });

    it('generates lorem ipsum with custom count', async () => {
      const res = await request(app).get('/lorem/10');
      expect(res.status).toBe(200);
      expect(res.body.wordCount).toBe(10);
    });

    it('returns text format', async () => {
      const res = await request(app).get('/lorem/5.txt');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/plain');
      expect(res.text).toContain('Lorem');
    });

    it('returns HTML format', async () => {
      const res = await request(app).get('/lorem/5.html');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });

    it('returns 400 for count out of range', async () => {
      const res = await request(app).get('/lorem/0');
      expect(res.status).toBe(400);
      expect(res.text).toContain('count must be 1-1000');
    });

    it('returns 400 for count too high', async () => {
      const res = await request(app).get('/lorem/1001');
      expect(res.status).toBe(400);
    });

    it('returns 400 for invalid extension', async () => {
      const res = await request(app).get('/lorem/10.pdf');
      expect(res.status).toBe(400);
    });
  });
});

describe('Batch endpoint', () => {
  describe('POST /batch', () => {
    it('transforms multiple inputs', async () => {
      const res = await request(app)
        .post('/batch')
        .send({ inputs: ['hello', 'world'], style: 'upper' });
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.results[0].output).toBe('HELLO');
      expect(res.body.results[1].output).toBe('WORLD');
    });

    it('returns 400 for non-array inputs', async () => {
      const res = await request(app)
        .post('/batch')
        .send({ inputs: 'hello', style: 'upper' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('inputs must be an array');
    });

    it('returns 400 for too many inputs', async () => {
      const inputs = Array(101).fill('test');
      const res = await request(app)
        .post('/batch')
        .send({ inputs, style: 'upper' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('maximum 100 inputs per batch');
    });

    it('returns 400 for invalid style', async () => {
      const res = await request(app)
        .post('/batch')
        .send({ inputs: ['hello'], style: 'invalid' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid style');
      expect(res.body.validStyles).toBeDefined();
    });

    it('handles non-string inputs gracefully', async () => {
      const res = await request(app)
        .post('/batch')
        .send({ inputs: ['hello', 123, null], style: 'upper' });
      expect(res.status).toBe(200);
      expect(res.body.results[0].output).toBe('HELLO');
      expect(res.body.results[1].error).toBe('input must be string');
      expect(res.body.results[2].error).toBe('input must be string');
    });
  });
});

describe('Chain endpoint', () => {
  describe('GET /chain/:styles/:string', () => {
    it('chains multiple transformations', async () => {
      const res = await request(app).get('/chain/upper+reverse/hello.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('OLLEH');
      expect(res.body.cap).toBe('upper+reverse');
    });

    it('chains three transformations', async () => {
      const res = await request(app).get('/chain/lower+title+reverse/HELLO%20WORLD.json');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('dlroW olleH');
    });

    it('returns 400 for invalid style in chain', async () => {
      const res = await request(app).get('/chain/upper+invalid/hello');
      expect(res.status).toBe(400);
      expect(res.text).toContain('invalid style');
    });

    it('returns 400 for too many chained styles', async () => {
      const styles = Array(11).fill('upper').join('+');
      const res = await request(app).get(`/chain/${styles}/hello`);
      expect(res.status).toBe(400);
      expect(res.text).toContain('maximum 10');
    });

    it('returns text format', async () => {
      const res = await request(app).get('/chain/upper+reverse/hello.txt');
      expect(res.status).toBe(200);
      expect(res.text).toBe('OLLEH');
    });
  });
});

describe('Input validation', () => {
  it('returns 400 for input too long', async () => {
    const longInput = 'a'.repeat(10001);
    const res = await request(app).get(`/upper/${longInput}.json`);
    expect(res.status).toBe(400);
    expect(res.text).toBe('error - input too long');
  });
});
