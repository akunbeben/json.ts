import type { Params, Parsed } from "./types";
import { normalize } from "./util";
import { recursiveParse, writeToFile } from "./parser";
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

const {
  url,
  payload = undefined,
  resource = "default",
  outDir = "./out",
} = values;

await run({
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

  const file = Bun.file(`${outDir}/${resource}.ts`);
  const writer = file.writer();

  writeToFile(results, templateOutput, writer).finally(() => writer.end());

  await Bun.write(Bun.stdout, "Lorem ipsum\n");
}
