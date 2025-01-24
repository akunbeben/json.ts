import { write } from "bun";
import type { Params, Parsed } from "./types";
import { normalize } from "./util";
import { recursiveParse, templating } from "./parser";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    url: {
      type: "string",
    },
    payload: {
      type: "string",
    },
    resource: {
      type: "string",
    },
    outDir: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { url, payload, resource, outDir } = values;

run({
  url: `${url}`,
  payload,
  resource: `${resource}`,
  outDir: `${outDir}`,
});

async function run({
  url,
  payload = undefined,
  resource = "default",
  outDir = "./out",
}: {
  url: string;
  payload?: Params;
  resource?: string;
  outDir?: string;
}) {
  if (typeof payload === "object") {
    payload = new URLSearchParams(payload).toString();
  }

  const formatURL = !payload ? url : `${url}?${payload}`;

  const res = await fetch(formatURL);

  if (!res.ok) {
    throw new Error("Invalid URL");
  }

  const data = await res.json();

  if (resource.endsWith("/")) {
    resource = resource.substring(0, resource.length - 1);
  }

  resource = normalize(resource, { singularize: true });

  if (outDir.endsWith("/")) {
    outDir = outDir.substring(0, outDir.length - 1);
  }

  let results: Parsed[] = [];

  recursiveParse(data, resource, results);

  const templateOutput = "";

  await write(`${outDir}/types.ts`, templating(results, templateOutput));

  return;
}
