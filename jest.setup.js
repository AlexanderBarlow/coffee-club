// jest.setup.js
const { TextEncoder, TextDecoder } = require("util");
const fetch = require("node-fetch");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = fetch.Response;
