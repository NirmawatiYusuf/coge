import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SOURCES, bestExcerpt, highlightParts, rankSources, tokens } from '../lib/retrieval.js';

test('tokens drops stopwords and duplicates', () => {
  assert.deepEqual(tokens('Berapa lama pengiriman pengiriman?'), ['lama', 'pengiriman']);
});

test('rankSources finds the returns policy for a return question', () => {
  const ranked = rankSources('Bagaimana aturan retur?', DEFAULT_SOURCES);
  assert.equal(ranked[0].src.id, 'sample-returns');
});

test('rankSources returns nothing for unrelated questions', () => {
  assert.deepEqual(rankSources('cuaca besok di bandung', DEFAULT_SOURCES), []);
});

test('bestExcerpt prefers the sentence that matches the terms', () => {
  const src = DEFAULT_SOURCES.find((s) => s.id === 'sample-returns');
  assert.match(bestExcerpt(src, ['ongkos', 'rusak']), /ongkos kirim retur/);
});

test('highlightParts marks matched terms only', () => {
  const parts = highlightParts('Retur maksimal 7 hari', ['retur']);
  assert.deepEqual(parts, [
    { text: 'Retur', hit: true },
    { text: ' maksimal 7 hari', hit: false },
  ]);
});
