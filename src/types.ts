export type Parsed = {
  interface: string;
  props: Record<string, string>[];
};

export type Params = Record<string, string> | string | undefined;

export type PluralOptions = {
  plural?: boolean;
  suffix?: string;
  singularize?: boolean;
};
