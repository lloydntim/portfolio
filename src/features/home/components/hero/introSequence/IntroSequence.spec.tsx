import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { IntroSequence } from './IntroSequence';

const props = {
  webmSrc: '/logo-intro.webm',
  mp4Src: '/logo-intro.mp4',
  posterSrc: '/poster.webp',
};

describe('IntroSequence', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders the video with a poster and high fetch priority, discoverable without JS gating', () => {
    render(<IntroSequence {...props} />);

    const video = document.querySelector('video');
    expect(video).toHaveAttribute('poster', props.posterSrc);
    expect(video).toHaveAttribute('fetchpriority', 'high');
    expect(video).toHaveAttribute('width', '1920');
    expect(video?.querySelector('source[type="video/webm"]')).toHaveAttribute('src', props.webmSrc);
    expect(video?.querySelector('source[type="video/mp4"]')).toHaveAttribute('src', props.mp4Src);
  });

  it('dismisses on skip and records the session so it will not replay', async () => {
    const user = userEvent.setup();
    render(<IntroSequence {...props} />);

    await user.click(screen.getByRole('button', { name: /skip/i }));

    expect(document.querySelector('#intro-sequence')).not.toBeInTheDocument();
    expect(sessionStorage.getItem('introPlayed')).toBe('1');
  });
});
