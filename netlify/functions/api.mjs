/**
 * Netlify Function wrapping the Express app.
 * netlify.toml redirects every non-static path here.
 *
 * Uses Netlify's Request/Response function API (bundled as ESM, which
 * dictionary-en needs for its top-level await) and bridges to the Express
 * app through serverless-http's API Gateway style event/result shape.
 */

import serverless from 'serverless-http';
import { createApp } from '../../app.js';

const handler = serverless(createApp(), { binary: ['image/svg+xml'] });

/**
 * Convert a fetch Request into an API Gateway v1 style event
 * @param {Request} request
 * @returns {Promise<object>}
 */
const toEvent = async (request) => {
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers);
  const queryStringParameters = Object.fromEntries(url.searchParams);
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.text() : null;
  return {
    httpMethod: request.method,
    path: url.pathname,
    rawUrl: request.url,
    headers,
    multiValueHeaders: {},
    queryStringParameters,
    multiValueQueryStringParameters: {},
    body,
    isBase64Encoded: false
  };
};

export default async (request) => {
  const result = await handler(await toEvent(request), {});
  const status = result.statusCode;
  // Response() rejects a body on 1xx/204/205/304
  const bodiless = status < 200 || status === 204 || status === 205 || status === 304;
  const body = bodiless ? null : result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body;
  return new Response(body, { status, headers: result.headers });
};
