// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

type Redirect = { from?: string; to?: string; status?: number; conditions?: string };

// Reads netlify.toml's [[redirects]] blocks as plain text. Deliberately not a
// TOML parser: it only needs to understand the single-line keys this repo
// writes, and avoids adding a dependency just for a test.
function readRedirects(): Redirect[] {
  const toml = readFileSync(join(process.cwd(), 'netlify.toml'), 'utf8');
  return toml
    .split('[[redirects]]')
    .slice(1)
    .map((block) => ({
      from: block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1],
      to: block.match(/^\s*to\s*=\s*"([^"]+)"/m)?.[1],
      status: Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1]),
      conditions: block.match(/^\s*conditions\s*=\s*(.+)$/m)?.[1],
    }));
}

describe('netlify.toml CV redirects', () => {
  const cvRules = readRedirects().filter((rule) => rule.from === '/cv/en');

  it('sends UK visitors to the UK CV before the fallback applies', () => {
    expect(cvRules).toHaveLength(2);
    expect(cvRules[0]).toMatchObject({ to: '/cv/lloyd-ntim-cv-uk.pdf' });
    expect(cvRules[0].conditions).toMatch(/Country\s*=\s*\["GB"\]/);
  });

  it('sends everyone else to the English version of the German CV', () => {
    expect(cvRules[1]).toMatchObject({ to: '/cv/lloyd-ntim-cv-en.pdf' });
    expect(cvRules[1].conditions).toBeUndefined();
  });

  it('uses temporary redirects so no country decision is cached', () => {
    expect(cvRules.map((rule) => rule.status)).toEqual([302, 302]);
  });

  it('points only at CV files that exist', () => {
    for (const rule of cvRules) {
      expect(existsSync(join(process.cwd(), 'public', rule.to ?? ''))).toBe(true);
    }
  });
});
