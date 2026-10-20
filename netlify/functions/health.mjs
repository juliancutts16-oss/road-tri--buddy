// Tells the app which online services are switched on (never returns the keys themselves).
import { json } from "../lib/common.mjs";

export default async () =>
  json({
    maps: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    dvla: Boolean(process.env.DVLA_API_KEY),
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
    passcode: Boolean(process.env.APP_PASSCODE),
  });

export const config = { path: "/api/health" };
