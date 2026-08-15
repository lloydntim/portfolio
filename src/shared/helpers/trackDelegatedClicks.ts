import posthog from 'posthog-js';

export function handleDelegatedClick(_event: MouseEvent, eventTarget: EventTarget | null): void {
  if (!(eventTarget instanceof Element)) return;

  const trigger = eventTarget.closest<HTMLElement>('[data-ph-event]');
  if (!trigger) return;

  const eventName = trigger.dataset.phEvent;
  if (!eventName) return;

  posthog.capture(eventName);
}
