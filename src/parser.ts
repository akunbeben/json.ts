import type { Parsed } from "./types";
import { normalize } from "./util";

export function recursiveParse(
  data: Record<string, any>,
  resource: string,
  results: Parsed[] = [],
  processed: Set<string> = new Set(),
): Parsed[] {
  if (processed.has(resource)) return results;
  processed.add(resource);

  const dict: { key: string; type: string }[] = [];

  for (const [key, value] of Object.entries(data)) {
    const type = value === null ? "string | null" : typeof value;
    let resolvedType = type;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const nestedResource = normalize(key, { singularize: true });
        resolvedType = `${nestedResource}[]`;

        recursiveParse(value[0], nestedResource, results, processed);
      } else {
        resolvedType = "any[]";
      }
    } else if (type === "object" && value !== null) {
      const nestedResource = normalize(key, { singularize: true });
      resolvedType = nestedResource;

      recursiveParse(value, nestedResource, results, processed);
    }

    dict.push({ key, type: resolvedType });
  }

  if (!results.some((r) => r.interface === resource)) {
    results.push({
      interface: normalize(resource, { singularize: true }),
      props: dict,
    });
  }

  return results;
}

export function templating(data: Parsed[], templateOutput: string) {
  data.forEach((d) => {
    const outputType = d.props
      .map((p, index) => {
        const format = `\t${p.key}: ${p.type};`;

        if (index === d.props.length - 1) {
          return `${format}\n`;
        }

        return format;
      })
      .join("\n");

    const template = `export interface ${d.interface} {\n${outputType}}\n`;

    templateOutput = `${templateOutput}${template}\n`;
  });

  return templateOutput;
}
