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

import { LanguageSwitcher } from './LanguageSwitcher';

function renderSwitcher(variant: 'dropdown' | 'inline', onNavigate?: () => void) {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <LanguageSwitcher variant={variant} onNavigate={onNavigate} />
    </NextIntlClientProvider>,
  );
}

describe('LanguageSwitcher', () => {
  describe('dropdown variant', () => {
    it('shows the current locale on the trigger button', () => {
      renderSwitcher('dropdown');

      expect(screen.getByRole('button', { name: /en/i })).toBeInTheDocument();
    });

    it('is closed by default', () => {
      renderSwitcher('dropdown');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens a menu listing every published locale when the trigger is clicked', async () => {
      renderSwitcher('dropdown');

      await userEvent.click(screen.getByRole('button', { name: /en/i }));

      const menu = screen.getByRole('menu');
      expect(screen.getByRole('menuitem', { name: 'EN' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'DE' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'FR' })).toBeInTheDocument();
      expect(menu).toBeInTheDocument();
    });

    it('marks the active locale as current', async () => {
      renderSwitcher('dropdown');

      await userEvent.click(screen.getByRole('button', { name: /en/i }));

      expect(screen.getByRole('menuitem', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
      expect(screen.getByRole('menuitem', { name: 'DE' })).not.toHaveAttribute('aria-current');
    });

    it('closes the menu when a locale option is clicked', async () => {
      renderSwitcher('dropdown');

      await userEvent.click(screen.getByRole('button', { name: /en/i }));
      await userEvent.click(screen.getByRole('menuitem', { name: 'DE' }));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes the menu when clicking outside', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={{}}>
          <div>
            <LanguageSwitcher variant="dropdown" />
            <button type="button">outside</button>
          </div>
        </NextIntlClientProvider>,
      );

      await userEvent.click(screen.getByRole('button', { name: /en/i }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'outside' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes the menu when Escape is pressed', async () => {
      renderSwitcher('dropdown');

      await userEvent.click(screen.getByRole('button', { name: /en/i }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('inline variant', () => {
    it('lists every published locale without needing a trigger', () => {
      renderSwitcher('inline');

      expect(screen.getByRole('link', { name: 'EN' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'DE' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'FR' })).toBeInTheDocument();
    });

    it('marks the active locale as current', () => {
      renderSwitcher('inline');

      expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
      expect(screen.getByRole('link', { name: 'DE' })).not.toHaveAttribute('aria-current');
    });

    it('calls onNavigate when a locale link is clicked', async () => {
      const onNavigate = vi.fn();
      renderSwitcher('inline', onNavigate);

      await userEvent.click(screen.getByRole('link', { name: 'DE' }));

      expect(onNavigate).toHaveBeenCalledOnce();
    });
  });
});
