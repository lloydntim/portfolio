import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button and handles clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send message</Button>);

    const button = screen.getByRole('button', { name: 'Send message' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as an anchor when href is provided', () => {
    render(<Button href="/cv/lloyd-ntim-cv-en.pdf">Download CV</Button>);

    const link = screen.getByRole('link', { name: 'Download CV' });
    expect(link).toHaveAttribute('href', '/cv/lloyd-ntim-cv-en.pdf');
  });
});
