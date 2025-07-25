import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createInstance } from "i18next";
import i18next from "./i18next.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import Backend from "i18next-fs-backend";
import i18n from "./i18n";
import { resolve } from "node:path";
import "dotenv/config";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  let callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  let instance = createInstance();
  let ns = i18next.getRouteNamespaces(remixContext);
  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng: (() => {
        const pathSegments = new URL(request.url).pathname
          .split("/")
          .filter(Boolean);
        return pathSegments[0];
      })(),
      ns,
      backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    let { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          let body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
