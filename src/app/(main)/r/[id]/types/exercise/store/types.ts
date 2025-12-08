import type { BSTOptionNode } from "@/lib/resources/builders/bst/nodes/option";
import type {
  BuiltExerciseTemplateResource,
  ExerciseTemplateResourceBuilder,
} from "@/lib/resources/builders/exercise";

export type ExerciseStoreProps = {
  resource: BuiltExerciseTemplateResource;
};

export enum ExerciseState {
  OnGoing, // Student is working on it
  Correcting, // API is getting called to correct
  Corrected, // API has answered and UI is waiting for user to click on "Retry" or "Next"
}
export enum PageState {
  Options,
  Loading,
  OnGoing,
  End,
}

export type InputInstance = {
  ref: HTMLInputElement | null;
  value: string;
  correction:
    | {
        corrected: false;
      }
    | {
        tries: number;
        corrected: true;
        correct: boolean;
        correctOnFirstTry: boolean;
      };
};

export type ExerciseInstance = {
  data: ReturnType<ExerciseTemplateResourceBuilder["generateExercise"]>;
  inputs: Record<string, InputInstance>;
  state: ExerciseState;
};

export type ExerciseStoreActions = {
  start: () => void;
  correct: () => void;
  retry: () => void;
  next: () => void;
  previous: () => void;
  end: () => void;

  setCurrentExerciseIndex(i: number): void;

  fetchCorrection(): Promise<Record<string, InputInstance["correction"]>>;
  fetchNewExercise(): Promise<ExerciseInstance>;

  loadNewExercise: () => void;

  setOptionValue: (id: string, value: BSTOptionNode["defaultValue"]) => void;
  setCurrentExerciseInputValue: (
    id: string,
    newValue: number | undefined,
  ) => void;

  initExerciseInputRef: (id: string, ref: HTMLInputElement | null) => void;

  startTimeInterval: () => void;
  stopTimeInterval: () => void;

  getCurrentExercise: () => ExerciseInstance;
  getCurrentExerciseInputFromID: (id: string) => InputInstance;
  getInputCorrection: (id: string) => InputInstance["correction"];
  getIsCurrentExerciseFullyCorrect(): boolean;
  getFormattedTime(): string | undefined;

  hasCurrentExerciseBeenCorrectedOnce(): boolean;
};

export type ExerciseStoreAttributes = {
  optionValues: Record<string, BSTOptionNode["defaultValue"]>; // Not necessarly defaultvalue, try to use _zodtype idk?
  currentIndex: number;
  time: number;
  interval?: ReturnType<typeof setInterval>;
} & (
  | {
      atLeastOneFetched: false;
      exercises: [];
      pageState: PageState.Options | PageState.Loading;
    }
  | {
      atLeastOneFetched: true;
      exercises: ExerciseInstance[];
      pageState: PageState.End | PageState.Loading | PageState.OnGoing;
    }
);

export type ExerciseStoreData = ExerciseStoreProps &
  ExerciseStoreActions &
  ExerciseStoreAttributes;
