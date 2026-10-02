#!/usr/bin/env node
/*
          _    ____ ___ _
   ___   / \  |  _ \_ _| |_ __ _
  / __| / _ \ | |_) | || __/ _` |
 | (__ / ___ \|  __/| || || (_| |
  \___/_/   \_\_|  |___|\__\__,_|

*/

/**
 * cAPIta server entry
 * Starts the Express app from app.js on PORT (default 4321).
 * @module cAPIta/server
 */

import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT || 4321;

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`cAPIta listening on port ${PORT}`);
});

export { app, server };
export { createApp, CASES } from './app.js';
