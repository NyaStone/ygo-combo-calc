import { SignalBasedQueue } from "ygoapi";

/**
 * Singleton request queue to limit concurrent requests.
 */
export const requestQueue: SignalBasedQueue = new SignalBasedQueue(50);
