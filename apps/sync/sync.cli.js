#!/usr/bin/env node
import { command, run, positional } from "@drizzle-team/brocli";
import { sync } from "./sync.js";

const syncCommand = command({
  name: "sync",
  desc: "Synchronize radio data from RadioBrowser API with ultra-defensive memory management",
  options: {
    type: positional().desc("What to sync: countries, stations, or both"),
  },
  handler: async (options = {}) => {
    const { type } = options;
    console.log(
      `${"\x1b[38;5;208m"}\nStarting ultra-defensive synchronization for:`,
      type || "all",
    );
    console.log(
      `${"\x1b[36m"}Using ultra-conservative batch sizes: 25 countries, 3 stations per chunk (defensive memory management)${"\x1b[0m"}`,
    );

    // Enable garbage collection if available
    if (global.gc) {
      console.log(
        `${"\x1b[36m"}Garbage collection enabled for memory optimization${"\x1b[0m"}`,
      );
    }

    await sync(type || "all");
  },
});

run([syncCommand], {
  name: "pronto",
  description:
    "PRONTO CLI - Radio data synchronization with ultra-defensive memory management",
  version: "1.0.0",
});
