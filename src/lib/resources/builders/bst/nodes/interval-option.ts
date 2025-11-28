import type * as z from "zod";
import type { BSTType } from "../nodes";

export type BSTOptionInterval = {
  _bsttype: BSTType.OptionInterval;
  _zodtype: z.ZodType<[number, number]>;
  name: string;
  min?: number;
  max?: number;
  defaultValue: [number, number];
};
