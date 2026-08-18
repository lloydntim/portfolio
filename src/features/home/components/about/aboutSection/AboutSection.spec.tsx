import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutSection } from './AboutSection';

const props = {
  eyebrow: 'ABOUT ME',
  heading: 'Full-stack engineer with a product mindset',
  bio: 'I build and scale digital products.',
  cvLabel: 'Download CV',
  cvHref: '/cv/lloyd-ntim-cv-en.pdf',
  portraitAlt: 'Lloyd Ntim',
  checklist: ['15+ years experience', 'Product & system thinking', 'End-to-end ownership', 'Pragmatic, maintainable code'],
  githubHref: 'https://github.com/lloydntim',
  linkedinHref: 'https://www.linkedin.com/in/lloydntim',
};

describe('AboutSection', () => {
  it('renders the CV download button with analytics tracking', () => {
    render(<AboutSection {...props} />);

    const link = screen.getByRole('link', { name: 'Download CV' });
    expect(link).toHaveAttribute('href', props.cvHref);
    expect(link).toHaveAttribute('data-ph-event', 'cv_download');
  });

  it('renders a GitHub link with an accessible name and analytics tracking', () => {
    render(<AboutSection {...props} />);

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', props.githubHref);
    expect(link).toHaveAttribute('data-ph-event', 'github_click');
  });

  it('renders a LinkedIn link with an accessible name and analytics tracking', () => {
    render(<AboutSection {...props} />);

    const link = screen.getByRole('link', { name: 'LinkedIn' });
    expect(link).toHaveAttribute('href', props.linkedinHref);
    expect(link).toHaveAttribute('data-ph-event', 'linkedin_click');
  });
});
