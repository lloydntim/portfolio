import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactForm, type ContactFormCopy } from './ContactForm';
import * as contactDelivery from '../../../helpers/contactDelivery';

const copy: ContactFormCopy = {
  nameLabel: 'Your name',
  emailLabel: 'Email',
  messageLabel: 'Message',
  submitLabel: 'Send message',
  submittingLabel: 'Sending…',
  successMessage: 'Thanks, your message has been sent.',
  validationErrorMessage: 'Please check the highlighted fields and try again.',
  submissionFailureMessage: 'Something went wrong sending your message.',
  honeypotLabel: "Leave this field empty",
};

async function fillAndSubmit({ name, email, message }: { name: string; email: string; message: string }) {
  const user = userEvent.setup();
  if (name) await user.type(screen.getByPlaceholderText('Your name'), name);
  if (email) await user.type(screen.getByPlaceholderText('Email'), email);
  if (message) await user.type(screen.getByPlaceholderText('Message'), message);
  await user.click(screen.getByRole('button', { name: 'Send message' }));
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows validation errors and does not call the delivery abstraction for invalid input', async () => {
    const submitSpy = vi.spyOn(contactDelivery, 'submitContact');
    render(<ContactForm copy={copy} />);

    await fillAndSubmit({ name: '', email: 'not-an-email', message: '' });

    expect(await screen.findByText('Please check the highlighted fields and try again.')).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('shows a success message when delivery succeeds', async () => {
    vi.spyOn(contactDelivery, 'submitContact').mockResolvedValue({ ok: true });
    render(<ContactForm copy={copy} />);

    await fillAndSubmit({ name: 'Lloyd', email: 'lloyd@example.com', message: 'Hello' });

    await waitFor(() => {
      expect(screen.getByText('Thanks, your message has been sent.')).toBeInTheDocument();
    });
  });

  it('shows a submission-failure message when delivery fails', async () => {
    vi.spyOn(contactDelivery, 'submitContact').mockResolvedValue({ ok: false, error: 'network-error' });
    render(<ContactForm copy={copy} />);

    await fillAndSubmit({ name: 'Lloyd', email: 'lloyd@example.com', message: 'Hello' });

    expect(await screen.findByText('Something went wrong sending your message.')).toBeInTheDocument();
  });
});
