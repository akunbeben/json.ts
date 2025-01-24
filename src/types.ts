export type Parsed = {
  interface: string;
  props: Record<string, string>[];
};

export type Params = string | Record<string, string>;

export type PluralOptions = {
  plural?: boolean;
  suffix?: string;
  singularize?: boolean;
};
