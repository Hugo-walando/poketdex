import * as Sentry from '@sentry/nextjs';
import { AxiosError } from 'axios';

export function logErrorToSentry(
  error: unknown,
  context?: Record<string, string>,
) {
  if (error instanceof AxiosError) {
    Sentry.captureException(error, {
      tags: { type: 'axios' },
      extra: {
        status: error.response?.status,
        url: error.config?.url,
        ...context,
      },
    });
  } else {
    Sentry.captureException(error, {
      tags: { type: 'unknown' },
      extra: context,
    });
  }
}
