export function formatStationName(name) {
  const words = name.split(" ").filter(Boolean);
  const firstTwoWords = words.slice(0, 2);

  if (words.length === 1) {
    return words[0].replace(/[!@#$()'^+%&=?*-,."]/g, "").slice(0, 2);
  }

  return firstTwoWords
    .map((word) => word.replace(/[!@#$()'^+%&=?*-,."]/g, "").slice(0, 1))
    .join("");
}

export function formatStationTag(tag) {
  const words = tag.split(" ").filter(Boolean);
  const firstWord = words[0] || "";
  const secondWord = words[1] || "";
  const formattedTag = `${firstWord} ${
    secondWord.slice(0, 3) ? secondWord.slice(0, 3) + ".." : ""
  }`;

  return formattedTag.trim();
}

export function isBadFavicon(faviconUrl) {
  return (
    !faviconUrl ||
    faviconUrl === "" ||
    faviconUrl === null ||
    faviconUrl.includes("badImage") ||
    faviconUrl.includes("default") ||
    faviconUrl.includes("404") ||
    faviconUrl.includes("not-found") ||
    faviconUrl.includes("error") ||
    faviconUrl.endsWith(".gif") ||
    faviconUrl.includes("placeholder") ||
    faviconUrl.includes("tunein.com") ||
    faviconUrl.includes("cdn-profiles.tunein.com") ||
    faviconUrl.includes("iheart.com") ||
    faviconUrl.includes("i.iheart.com") ||
    faviconUrl.includes("logod.jpg") ||
    faviconUrl.includes("broken") ||
    faviconUrl.includes("unavailable") ||
    faviconUrl.includes("temp") ||
    faviconUrl.includes("expired") ||
    faviconUrl.includes("invalid") ||
    faviconUrl.includes("ssl") ||
    faviconUrl.includes("cert") ||
    faviconUrl.includes("secure") ||
    faviconUrl.includes("localhost") ||
    faviconUrl.includes("127.0.0.1") ||
    faviconUrl.includes("radiobrowser") ||
    faviconUrl.includes("shoutcast") ||
    faviconUrl.includes("icecast") ||
    faviconUrl.match(/\.(php|aspx|jsp)(\?|$)/) ||
    (faviconUrl.startsWith("http://") &&
      (faviconUrl.includes("cdn-") ||
        faviconUrl.includes("assets-") ||
        faviconUrl.includes("static-")))
  );
}
