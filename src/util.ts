import type { PluralOptions } from "./types";

export function normalize(input: string): string;
export function normalize(input: string, plural: boolean): string;
export function normalize(input: string, pluralOptions: PluralOptions): string;
export function normalize(
  input: string,
  pluralOptions?: boolean | PluralOptions,
): string {
  if (!input.trim()) return "";

  const options: PluralOptions =
    typeof pluralOptions === "boolean"
      ? { plural: pluralOptions }
      : pluralOptions || {};

  const { plural = false, suffix, singularize = false } = options;

  const withSeparators = input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  const words = withSeparators
    .split(/[^a-zA-Z0-9]+/g)
    .filter((word) => word.length > 0);

  let pascalCase = words
    .map((word) => {
      const firstChar = word[0]?.toUpperCase() || "";
      const rest = word.slice(1).toLowerCase();
      return firstChar + rest;
    })
    .join("");

  if (singularize && !plural && pascalCase) {
    pascalCase = pascalCase.replace(/s$/, "");
  }

  if (!plural || !pascalCase) return pascalCase;

  return suffix
    ? pascalCase + suffix
    : `${pascalCase}${pascalCase.endsWith("s") ? "es" : "s"}`;
}
