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

test('status reports Claude when CLAUDE_API_KEY is configured', async () => {
  const response = await handleStatus(makeRequest('/api/status'), { ...env, CLAUDE_API_KEY: 'sk-ant-test' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    configured: true,
    provider: 'claude',
    model: 'claude-4-8-sonnet',
    fallback: false,
  });
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
});

test('status reports Gemini when only GEMINI_API_KEY is configured', async () => {
  const response = await handleStatus(makeRequest('/api/status'), { ...env, GEMINI_API_KEY: 'gemini-key' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    configured: true,
    provider: 'gemini',
    model: 'gemini-3.8-flash',
    fallback: false,
  });
});

test('status defaults safely to unconfigured when no key is set', async () => {
  const response = await handleStatus(makeRequest('/api/status'), env);
  assert.deepEqual(await response.json(), {
    configured: false,
    provider: 'claude',
    model: 'claude-4-8-sonnet',
    fallback: false,
  });
});

test('invalid chat payload is rejected before calling AI', async () => {
  const response = await handleChat(chatRequest({ question: 'Hai', sources: [] }), env);
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /sumber/i);
});

test('chat calls Claude Messages API with x-api-key and system prompt', async (t) => {
  const originalFetch = globalThis.fetch;
  let upstreamRequest;
  globalThis.fetch = async (url, options) => {
    upstreamRequest = { url, options };
    return new Response(JSON.stringify({
      id: 'msg_123',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: 'Retur maksimal 7 hari kerja.' }],
      model: 'claude-4-8-sonnet',
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const response = await handleChat(chatRequest({
    question: 'Berapa lama retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
    history: [{ role: 'user', text: 'Halo' }],
  }), { ...env, CLAUDE_API_KEY: 'sk-ant-secret' });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    answer: 'Retur maksimal 7 hari kerja.',
    model: 'claude-4-8-sonnet',
    provider: 'claude',
    sources: [{ id: 'source-1', title: 'Kebijakan retur' }],
  });
  assert.equal(upstreamRequest.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(upstreamRequest.options.headers['x-api-key'], 'sk-ant-secret');
  assert.equal(upstreamRequest.options.headers['anthropic-version'], '2023-06-01');

  const body = JSON.parse(upstreamRequest.options.body);
  assert.equal(body.model, 'claude-4-8-sonnet');
  assert.match(body.system, /jangan pernah menebak/i);
  assert.match(body.messages[1].content, /Kebijakan retur/);
});

test('chat falls back to Gemini if Claude fails and Gemini key is provided', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.includes('anthropic.com')) {
      return new Response(JSON.stringify({ error: { message: 'rate limit' } }), { status: 429 });
    }
    return new Response(JSON.stringify({
      status: 'completed',
      steps: [{ type: 'model_output', content: [{ type: 'text', text: 'Jawaban dari Gemini cadangan.' }] }],
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const response = await handleChat(chatRequest({
    question: 'Berapa lama retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
  }), { ...env, CLAUDE_API_KEY: 'sk-ant-limit', GEMINI_API_KEY: 'gemini-fallback' });

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.provider, 'gemini');
  assert.equal(data.fallback, true);
  assert.equal(data.answer, 'Jawaban dari Gemini cadangan.');
  assert.equal(calls.length, 2);
});

test('chat explains missing API key when no keys are provided', async () => {
  const response = await handleChat(chatRequest({
    question: 'Bagaimana retur?',
    sources: [{ id: 'source-1', title: 'Kebijakan retur', text: 'Retur maksimal 7 hari.' }],
  }), env);
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /CLAUDE_API_KEY/);
});

test('status rejects non-GET methods', async () => {
  const response = handleStatus(makeRequest('/api/status', { method: 'POST' }), env);
  assert.equal(response.status, 405);
});