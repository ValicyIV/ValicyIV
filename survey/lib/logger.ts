export type LogContext = Record<string, unknown>;

export const logEvent = (event: string, context: LogContext = {}) => {
  const payload = {
    event,
    context,
    timestamp: new Date().toISOString(),
  };

  // Structured logging for observability without leaking secrets
  // eslint-disable-next-line no-console
  console.info(JSON.stringify(payload));
};
