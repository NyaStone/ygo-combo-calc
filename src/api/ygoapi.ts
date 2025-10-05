import { YgoApi } from "ygoapi";
import { requestQueue } from "./requestQueue";

/**
 * Singleton YgoApi client instance configured with the request queue.
 */
export const ygoapi = new YgoApi({ requestQueue });