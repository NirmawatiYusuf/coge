import test from 'node:test';
import assert from 'node:assert/strict';
import { handleChat, handleStatus } from '../lib/chat.js';

const env = {};

function makeRequest(path, options = {}) {
  return new Request(`https://cognexy.test${path}`, options);
}

function chatRequest(payload) {
  return makeRequest('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

test('status reports whether Gemini is configured without exposing the key', async () => {
  const response = await handleStatus(makeRequest('/api/status'), { ...env, GEMINI_API_KEY: 'never-return-this' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { configured: true, model: 'gemini-3.8-flash' });
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
});

test('status defaults safely when no API key is configured', async () => {
  const response = await handleStatus(makeRequest('/api/status'), env);
  assert.deepEqual(await response.json(), { configured: false, model: 'gemini-3.8-flash' });
});

test('invalid chat payload is rejected before calling Gemini', async () => {
  const response = await handleChat(chatRequest({ question: 'Hai', sources: [] }), env);
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /sumber/i);
});

test('chat calls Gemini with a server-side key and disables interaction storage', async (t) => {
  const originalFetch = globalThis.fetch;
  let upstreamRequest;
  globalThis.fetch = async (url, options) => {
    upstreamRequest = { url, options };
    return new Response(JSON.stringify({
      status: 'completed',
      steps: [{ type: 'model_output', content: [{ type: 'text', text: 'Retur dapat diajukan dalam 7 hari.' }] }],
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const response = await handleChat(chatRequest({
    question: 'Berapa lama retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
    history: [{ role: 'user', text: 'Halo' }],
  }), { ...env, GEMINI_API_KEY: 'server-secret' });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    answer: 'Retur dapat diajukan dalam 7 hari.',
    model: 'gemini-3.8-flash',
    sources: [{ id: 'source-1', title: 'Kebijakan retur' }],
  });
  assert.equal(upstreamRequest.url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
  assert.equal(upstreamRequest.options.headers['x-goog-api-key'], 'server-secret');
  assert.equal(upstreamRequest.options.headers.authorization, undefined);
  const body = JSON.parse(upstreamRequest.options.body);
  assert.equal(body.store, false);
  assert.equal(body.model, 'gemini-3.8-flash');
  assert.match(body.system_instruction, /jangan menebak/i);
  assert.match(body.input, /Kebijakan retur/);
});

test('chat explains missing API key without contacting Gemini', async () => {
  const response = await handleChat(chatRequest({
    question: 'Bagaimana retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
  }), env);
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /GEMINI_API_KEY/);
});

test('upstream quota errors are translated to a safe user-facing message', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'private upstream detail' } }), { status: 429 });
  t.after(() => { globalThis.fetch = originalFetch; });

  const response = await handleChat(chatRequest({
    question: 'Berapa lama retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
  }), { ...env, GEMINI_API_KEY: 'server-secret' });
  assert.equal(response.status, 429);
  const result = await response.json();
  assert.match(result.error, /kuota/i);
  assert.doesNotMatch(JSON.stringify(result), /private upstream detail|server-secret/);
});

test('status rejects non-GET methods', async () => {
  const response = handleStatus(makeRequest('/api/status', { method: 'POST' }), env);
  assert.equal(response.status, 405);
});