import { describe, expect, it } from 'vitest';
import { config } from './proxy';

describe('proxy matcher', () => {
  const matcher = new RegExp(`^${config.matcher}$`);

  it('excludes /ingest so PostHog proxy requests skip locale routing', () => {
    expect(matcher.test('/ingest/e/')).toBe(false);
    expect(matcher.test('/ingest/static/1.417.1/web-vitals.js')).toBe(false);
    expect(matcher.test('/ingest/array/token/config.js')).toBe(false);
  });

  it('still matches ordinary page paths', () => {
    expect(matcher.test('/en')).toBe(true);
    expect(matcher.test('/en/case-studies/vorwerk')).toBe(true);
  });

  it('still excludes api, _next, and _vercel', () => {
    expect(matcher.test('/api/whatever')).toBe(false);
    expect(matcher.test('/_next/static/chunk.js')).toBe(false);
    expect(matcher.test('/_vercel/insights')).toBe(false);
  });
});
