#!/usr/bin/env node
import { command, run, positional } from "@drizzle-team/brocli";
import { sync } from "./sync.js";

const syncCommand = command({
  name: "sync",
  desc: "Synchronize radio data from RadioBrowser API with pagination (200 items per batch)",
  options: {
    type: positional().desc("What to sync: countries, stations, or both"),
  },
  handler: async (options = {}) => {
    const { type } = options;
    console.log(
      `${"\x1b[38;5;208m"}\nStarting paginated synchronization for:`,
      type || "all",
    );
    console.log(
      `${"\x1b[36m"}Using batch size: 200 items per request${"\x1b[0m"}`,
    );
    await sync(type || "all");
  },
});

run([syncCommand], {
  name: "pronto",
  description: "PRONTO CLI - Radio data synchronization with pagination",
  version: "1.0.0",
});
