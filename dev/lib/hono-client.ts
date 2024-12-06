import type { AppRouter } from "@/server/_app";
import { publicConfig } from "@/src/config.public";
import { hc } from "hono/client";

export const honoClient = hc<AppRouter>(`${publicConfig.BASE_ORIGIN}/api`);
