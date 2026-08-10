import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { CaseStudyArticle } from './CaseStudyArticle';

describe('CaseStudyArticle', () => {
  it('renders the case study title and a link to the next case study', async () => {
    const element = await CaseStudyArticle({ slug: 'vocapp', locale: 'en' });

    render(<NextIntlClientProvider locale="en" messages={{}}>{element}</NextIntlClientProvider>);

    expect(screen.getByRole('heading', { level: 1, name: 'VocApp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next: Vorwerk/ })).toHaveAttribute(
      'href',
      '/en/case-studies/vorwerk',
    );
  });

  it('omits the next link for the last case study', async () => {
    const element = await CaseStudyArticle({ slug: 'guilds', locale: 'en' });

    render(<NextIntlClientProvider locale="en" messages={{}}>{element}</NextIntlClientProvider>);

    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
  });
});
