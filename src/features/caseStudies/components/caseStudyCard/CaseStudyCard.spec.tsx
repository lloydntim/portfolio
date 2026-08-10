import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { CaseStudyCard } from './CaseStudyCard';

describe('CaseStudyCard', () => {
  it('renders the case study title and a link to its page', async () => {
    const element = await CaseStudyCard({ slug: 'vocapp', locale: 'en', linkLabel: 'Case study →' });

    render(<NextIntlClientProvider locale="en" messages={{}}>{element}</NextIntlClientProvider>);

    expect(screen.getByRole('heading', { name: 'VocApp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Case study →' })).toHaveAttribute(
      'href',
      '/en/case-studies/vocapp',
    );
  });
});
