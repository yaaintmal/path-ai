/**
 * Dispatch a custom event with optional detail payload.
 * Handles browsers with CustomEvent support via try-catch fallback.
 * @param eventName - The name of the event to dispatch
 * @param detail - Optional data to pass with the event
 */
export function dispatchCustomEvent(
  eventName: string,
  detail?: Record<string, unknown> | undefined
): void {
  try {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  } catch {
    // Fallback for browsers without CustomEvent support
    window.dispatchEvent(new Event(eventName));
  }
}
