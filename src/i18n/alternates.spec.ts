import { describe, expect, it } from 'vitest';
import { buildLocaleAlternates } from './alternates';

describe('buildLocaleAlternates', () => {
  it('builds a self-referencing canonical for the homepage', () => {
    expect(buildLocaleAlternates('en').canonical).toBe('https://lloydntim.com/en');
    expect(buildLocaleAlternates('de').canonical).toBe('https://lloydntim.com/de');
  });

  it('builds a self-referencing canonical for a nested path', () => {
    expect(buildLocaleAlternates('fr', '/case-studies/vocapp').canonical).toBe(
      'https://lloydntim.com/fr/case-studies/vocapp',
    );
  });

  it('lists every published locale in the language alternates, regardless of which locale was requested', () => {
    const { languages } = buildLocaleAlternates('en', '/case-studies/vocapp');
    expect(languages.en).toBe('https://lloydntim.com/en/case-studies/vocapp');
    expect(languages.de).toBe('https://lloydntim.com/de/case-studies/vocapp');
    expect(languages.fr).toBe('https://lloydntim.com/fr/case-studies/vocapp');
  });

  it('points x-default at the un-prefixed path, not a hardcoded locale', () => {
    expect(buildLocaleAlternates('en').languages['x-default']).toBe('https://lloydntim.com');
    expect(buildLocaleAlternates('de', '/case-studies/vocapp').languages['x-default']).toBe(
      'https://lloydntim.com/case-studies/vocapp',
    );
  });
});
