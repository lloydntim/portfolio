import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return {
    ...actual,
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useParams: () => ({}),
  };
});

import { SiteNavigation } from './SiteNavigation';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
];

function renderNav() {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <SiteNavigation logoSrc="/logos/logo.svg" logoAlt="Lloyd Ntim" links={links} />
    </NextIntlClientProvider>,
  );
}

describe('SiteNavigation', () => {
  it('toggles the mobile menu open state', async () => {
    renderNav();

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu after a link is clicked', async () => {
    renderNav();

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
