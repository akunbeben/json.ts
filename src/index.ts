import { write } from "bun";
import type { Params, Parsed } from "./types";
import { normalize } from "./util";
import { recursiveParse, templating } from "./parser";

async function run(
  url: string,
  payload: Params,
  resource: string = "default",
  outDir: string = "./out",
) {
  if (typeof payload === "object") {
    payload = new URLSearchParams(payload).toString();
  }

  const res = await fetch(`${url}?${payload}`);
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
}

run(
  "http://toyota-backend.test/api/public/car_variants",
  "include=car,productAvailability,engineType,carVariantUsp,carVariantProductType,media",
  "variant",
);
