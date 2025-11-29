import type * as z from "zod";
import type { BSTType } from "../nodes";

export type BSTOptionTogglables<T extends string[] = string[]> = {
  _bsttype: BSTType.OptionTogglables;
  _zodtype: z.ZodArray<z.ZodEnum<Record<T[number], T[number]>>>;
  togglables: T;
  name: string;
  defaultValue: T[number][];
};
