import { describe, expect, it, vi, beforeEach } from 'vitest';
import posthog from 'posthog-js';
import { handleDelegatedClick } from './trackDelegatedClicks';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

describe('handleDelegatedClick', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.mocked(posthog.capture).mockClear();
  });

  it('captures the event named on the clicked element', () => {
    document.body.innerHTML = '<a href="/cv.pdf" data-ph-event="cv_download">Download</a>';
    const link = document.querySelector('a')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), link);

    expect(posthog.capture).toHaveBeenCalledWith('cv_download');
  });

  it('captures the event when the click target is a descendant of the tagged element', () => {
    document.body.innerHTML = '<a href="/cv.pdf" data-ph-event="cv_download"><span>Download</span></a>';
    const span = document.querySelector('span')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), span);

    expect(posthog.capture).toHaveBeenCalledWith('cv_download');
  });

  it('does not capture when no ancestor has data-ph-event', () => {
    document.body.innerHTML = '<button>Untracked</button>';
    const button = document.querySelector('button')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), button);

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
