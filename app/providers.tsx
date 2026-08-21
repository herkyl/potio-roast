'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

let initialized = false;

// Same PostHog project as potio.cc. posthog-js sets a first-party cookie
// scoped to the whole domain by default, so a visitor who hits potio.cc and
// then roast.potio.cc is tracked as one person across both.
export function PostHogInit() {
  useEffect(() => {
    if (initialized) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    initialized = true;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? '/ingest',
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
    });
  }, []);

  return null;
}
