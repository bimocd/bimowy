import * as z from "zod";
import { BSTType } from "../nodes";

export type BSTOptionNode = BSTTogglablesOption | BSTIntervalOption;

export type SerializedOptionNode<O extends BSTOptionNode = BSTOptionNode> =
  Omit<O, "_zodtype"> & {
    _zodtype: z.core.JSONSchema.BaseSchema;
  };

export type BSTTogglablesOption<T extends string[] = string[]> = {
  _bsttype: BSTType.TogglablesOption;
  _zodtype: z.ZodArray<z.ZodEnum<Record<T[number], T[number]>>>;
  togglables: T;
  name: string;
  defaultValue: T[number][];
};

export type BSTIntervalOption = {
  _bsttype: BSTType.IntervalOption;
  _zodtype: z.ZodType<[number, number]>;
  name: string;
  min?: number;
  max?: number;
  defaultValue: [number, number];
};
const TogglablesOptionHelpers = {
  togl: <const T extends string[]>(
    name: string,
    values: T,
    defaultValues: T[number][] = [],
  ): BSTTogglablesOption<T> => ({
    _bsttype: BSTType.TogglablesOption,
    _zodtype: z.array(z.enum(values)).min(1),
    togglables: values,
    name,
    defaultValue: defaultValues,
  }),
};
const IntervalOptionHelpers = {
  intervaloption: (
    name: string,
    defaultValue: [number, number],
    extra?: { min?: number; max?: number },
  ): BSTIntervalOption => ({
    _bsttype: BSTType.IntervalOption,
    _zodtype: z.tuple([z.number(), z.number()]),
    defaultValue,
    name,
    ...extra,
  }),
};
export const OptionHelpers = {
  ...TogglablesOptionHelpers,
  ...IntervalOptionHelpers,
};
