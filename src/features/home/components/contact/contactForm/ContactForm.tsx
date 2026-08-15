'use client';

import { useState, type FormEvent } from 'react';
import posthog from 'posthog-js';
import {
  contactFormSchema,
  type ContactFormData,
  type ContactFormErrors,
} from '../../../schema';
import { submitContact } from '../../../helpers/contactDelivery';

export type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  validationErrorMessage: string;
  submissionFailureMessage: string;
  honeypotLabel: string;
};

export type ContactFormProps = {
  copy: ContactFormCopy;
};

type Status =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'validation-error'
  | 'submission-failure';

const fieldClass =
  'w-full bg-white/[0.16] px-4.5 py-4 font-body text-[15px] text-white placeholder:text-[#c9c7c4] outline-none focus:outline-2 focus:outline-accent focus:-outline-offset-2';

export function ContactForm({ copy }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactFormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // The honeypot is a spam signal only, per architecture section 2.1/15;
    // a filled-in honeypot is treated as a silent success, never surfaced
    // to whatever is submitting it.
    if (formData.get('bot-field')) {
      setStatus('success');
      return;
    }

    const data: ContactFormData = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    const result = contactFormSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: ContactFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus('validation-error');
      return;
    }

    setErrors({});
    setStatus('submitting');
    const delivery = await submitContact(result.data);
    posthog.capture('contact_form_submitted', { result: delivery.ok ? 'success' : delivery.error });
    setStatus(delivery.ok ? 'success' : 'submission-failure');
    if (delivery.ok) {
      form.reset();
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-base text-[#e0dedb]">
        {copy.successMessage}
      </p>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex max-w-160 flex-col gap-3.5 text-left"
    >
      <input type="hidden" name="form-name" value="contact" />

      <p className="absolute h-px w-px overflow-hidden">
        <label>
          {copy.honeypotLabel}
          <input
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </label>
      </p>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="sr-only">
            {copy.nameLabel}
          </label>
          <input
            id="contact-name"
            className={fieldClass}
            type="text"
            name="name"
            placeholder={copy.nameLabel}
            required
          />
          {errors.name ? (
            <p className="mt-1.5 text-sm text-accent-hover" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="sr-only">
            {copy.emailLabel}
          </label>
          <input
            id="contact-email"
            className={fieldClass}
            type="email"
            name="email"
            placeholder={copy.emailLabel}
            required
          />
          {errors.email ? (
            <p className="mt-1.5 text-sm text-accent-hover" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          {copy.messageLabel}
        </label>
        <textarea
          id="contact-message"
          className={`${fieldClass} min-h-30 resize-y`}
          name="message"
          placeholder={copy.messageLabel}
          rows={5}
          required
        />
        {errors.message ? (
          <p className="mt-1.5 text-sm text-accent-hover" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === 'validation-error' ? (
        <p role="alert" className="text-sm text-accent-hover">
          {copy.validationErrorMessage}
        </p>
      ) : null}
      {status === 'submission-failure' ? (
        <p role="alert" className="text-sm text-accent-hover">
          {copy.submissionFailureMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-accent px-7.5 py-4 text-center font-heading text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-accent-hover-strong disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
      >
        {status === 'submitting' ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
