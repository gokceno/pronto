#!/usr/bin/env node
import { command, run, positional } from "@drizzle-team/brocli";
import { sync } from "./sync.js";

const syncCommand = command({
  name: "sync",
  desc: "Synchronize radio data from RadioBrowser API",
  options: {
    type: positional().desc("What to sync: countries, stations, or both"),
  },
  handler: async (options = {}) => {
    const { type } = options;

    await sync(type || "all");
  },
});

run([syncCommand], {
  name: "pronto",
  description:
    "PRONTO CLI - Radio data synchronization with ultra-defensive memory management",
  version: "1.0.0",
});
