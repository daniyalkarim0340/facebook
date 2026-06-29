export function scoreRouting({ predicted, userFeedback }) {
  // If user explicitly overrides → wrong
  if (userFeedback?.correctAgent && userFeedback.correctAgent !== predicted) {
    return 0;
  }

  // If user regenerates response → likely wrong
  if (userFeedback?.regenerated) {
    return 0.3;
  }

  // If accepted without change → good
  if (userFeedback?.accepted) {
    return 1;
  }

  // default uncertain
  return 0.5;
}