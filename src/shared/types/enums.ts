export interface EnumItem {
  value: string | number;
  text: string;
}

export type EnumsResponse = Record<string, EnumItem[]>;
