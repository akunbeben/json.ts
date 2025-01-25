import type { Parsed } from "./types";
import { normalize } from "./util";

export function recursiveParse(
  data: Record<string, any> | Record<number, any>[],
  resource: string,
  results: Parsed[] = [],
  processed: Set<string> = new Set(),
): Parsed[] {
  if (Array.isArray(data)) {
    recursiveParse(data[0], resource, results);

    return results;
  }

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
  return data.reduce((output, d) => {
    const outputType = d.props
      .map((p, index) => {
        const format = `\t${p.key}: ${p.type};`;
        return index === d.props.length - 1 ? `${format}\n` : format;
      })
      .join("\n");

    return `${output}export interface ${d.interface} {\n${outputType}}\n\n`;
  }, templateOutput);
}
