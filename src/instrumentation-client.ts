import posthog from 'posthog-js';
import { handleDelegatedClick } from '@/shared/helpers/trackDelegatedClicks';

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-05-30',
    cookieless_mode: 'always',
    person_profiles: 'never',
    disable_session_recording: true,
    capture_pageview: 'history_change',
  });

  document.addEventListener('click', (event) => {
    handleDelegatedClick(event, event.target);
  });
}
