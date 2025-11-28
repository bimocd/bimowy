import { createContext, useContext } from "react";
import { create, useStore } from "zustand";
import { fetchAPICorrect } from "@/app/api/r/[id]/correct/route";
import { fetchAPIGenerate } from "@/app/api/r/[id]/generate/route";
import type {
  BuiltExerciseResource,
  ExerciseResourceBuilder,
} from "@/lib/resources";
import type { BSTOptionInterval } from "@/lib/resources/builders/bst/nodes/interval-option";

export type ExerciseStoreProps = {
  resource: BuiltExerciseResource;
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
  data: ReturnType<ExerciseResourceBuilder["generateExercise"]>;
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

  setOptionValue: (
    id: string,
    value: BSTOptionInterval["defaultValue"],
  ) => void;
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
  optionValues: Record<string, number[]>; // TODO, not necessarly an interval. Remove hardcodance
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

export const createExerciseStore = ({ resource }: ExerciseStoreProps) =>
  create<ExerciseStoreData>()((setState, getCurrentState) => ({
    currentIndex: 0,
    pageState: PageState.Options,
    atLeastOneFetched: false,
    exercises: [],
    resource,
    optionValues: Object.entries(resource.options).reduce(
      (prev, [id, opt]) => ({ ...prev, [id]: opt.defaultValue }),
      {},
    ),

    time: 0,
    startTimeInterval() {
      const interval = setInterval(() => {
        setState((s) => ({ time: s.time + 1 }));
      }, 1000);
      setState({ interval });
    },
    stopTimeInterval() {
      clearInterval(getCurrentState().interval);
    },

    async fetchCorrection() {
      const state = getCurrentState();
      if (!state.atLeastOneFetched) throw Error();

      const exercise = state.getCurrentExercise();
      const inputs = state.getCurrentExercise().inputs;

      const inputValues = Object.entries(inputs).reduce(
        (prev, [id, inp]) => ({ ...prev, [id]: Number(inp.value) }),
        {},
      );
      const correction: Record<string, boolean> = await fetchAPICorrect(
        state.resource.id,
        exercise.data.seed,
        inputValues,
      );

      console.log({ emoji: "💚", correction });

      const correctionObj: Record<string, InputInstance["correction"]> = {};

      for (const [id, inp] of Object.entries(exercise.inputs)) {
        const isCorrect = correction[id];
        correctionObj[id] = {
          correct: isCorrect,
          corrected: true,
          correctOnFirstTry: inp.correction.corrected
            ? inp.correction.correctOnFirstTry
            : isCorrect,
          tries: 1 + (inp.correction.corrected ? inp.correction.tries : 0),
        };
      }
      return correctionObj;
    },
    async fetchNewExercise() {
      const { optionValues, resource } = getCurrentState();

      const fetchedExercise = await fetchAPIGenerate(
        resource.id,
        optionValues,
      ).then((data) => ({
        data,
        inputs: {},
        state: ExerciseState.OnGoing,
      }));

      console.log({ emoji: "💚", fetchedExercise });

      return fetchedExercise;
    },
    async correct() {
      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        newExercises[state.currentIndex!] = {
          ...newExercises[state.currentIndex!],
          state: ExerciseState.Correcting,
        };
        return { exercises: newExercises };
      });
      const state = getCurrentState();
      const correction = await state.fetchCorrection();

      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        const currentExercise = newExercises[state.currentIndex!];
        const newInputs = Object.entries(currentExercise.inputs).reduce(
          (prev, [id, input]) => {
            return {
              ...prev,
              [id]: {
                ...input,
                correction: correction[id],
              },
            };
          },
          {},
        );

        newExercises[state.currentIndex!] = {
          ...currentExercise,
          inputs: newInputs,
          state: ExerciseState.Corrected,
        };

        return { exercises: newExercises };
      });
    },
    end() {
      getCurrentState().stopTimeInterval();
      setState({ pageState: PageState.End });
    },
    getCurrentExercise() {
      const state = getCurrentState();
      return state.exercises[state.currentIndex];
    },
    getCurrentExerciseInputFromID(id) {
      return getCurrentState().getCurrentExercise().inputs[id];
    },
    getFormattedTime() {
      const { time, interval } = getCurrentState();
      if (!interval) return;
      const s = String(time % 60).padStart(2, "0");
      const m = String(Math.floor(time / 60)).padStart(2, "0");
      return `${m}:${s}`;
    },
    getInputCorrection(id) {
      return getCurrentState().getCurrentExerciseInputFromID(id)?.correction;
    },
    getIsCurrentExerciseFullyCorrect() {
      const ex = getCurrentState().getCurrentExercise();
      if (!ex) return false;
      for (const inp of Object.values(ex.inputs)) {
        if (inp.correction.corrected && !inp.correction.correct) return false;
      }
      return true;
    },
    hasCurrentExerciseBeenCorrectedOnce() {
      const ex = getCurrentState().getCurrentExercise();
      for (const inp of Object.values(ex.inputs)) {
        if (inp.correction.corrected) return true;
      }
      return false;
    },
    initExerciseInputRef(id, ref) {
      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        const currentInputs = { ...newExercises[state.currentIndex!].inputs };
        if (currentInputs[id]) {
          // Update only the ref, keep other properties
          currentInputs[id] = {
            ...currentInputs[id],
            ref,
          };
        } else {
          // Create new input entry
          currentInputs[id] = {
            correction: {
              corrected: false,
            },
            ref,
            value: "",
          };
        }
        newExercises[state.currentIndex!].inputs = currentInputs;
        return { exercises: newExercises };
      });
    },
    async loadNewExercise() {
      const state = getCurrentState();
      if (!state.atLeastOneFetched) throw Error();

      setState({ pageState: PageState.Loading });

      const ex = await getCurrentState().fetchNewExercise();

      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises, ex];
        return { exercises: newExercises, pageState: PageState.OnGoing };
      });

      state.next();
    },
    setCurrentExerciseIndex(i) {
      return setState({ currentIndex: i });
    },
    next() {
      return this.setCurrentExerciseIndex(getCurrentState().currentIndex + 1);
    },
    previous() {
      return this.setCurrentExerciseIndex(getCurrentState().currentIndex - 1);
    },
    retry() {
      return setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        newExercises[state.currentIndex!].state = ExerciseState.OnGoing;
        return { exercises: newExercises };
      });
    },
    setCurrentExerciseInputValue(id, newValue) {
      setState((state) => {
        const newExercises = [...state.exercises];

        // clone the specific exercise object
        const exIndex = state.currentIndex;
        const oldEx = newExercises[exIndex];
        const newEx = { ...oldEx };

        // clone inputs object
        const oldInputs = newEx.inputs || {};
        const newInputs = { ...oldInputs };

        // clone the specific input
        const oldInput = newInputs[id] || {};
        const newInput = { ...oldInput };

        // update value
        newInput.value = typeof newValue === "number" ? `${newValue}` : "";

        // reassemble
        newInputs[id] = newInput;
        newEx.inputs = newInputs;
        newExercises[exIndex] = newEx;

        return { exercises: newExercises };
      });
    },
    setOptionValue(id, value) {
      setState((state) => ({
        optionValues: { ...state.optionValues, [id]: value },
      }));
    },
    async start() {
      const state = getCurrentState();
      setState({ pageState: PageState.Loading });
      const ex = await state.fetchNewExercise();
      state.startTimeInterval();
      return setState({
        atLeastOneFetched: true,
        exercises: [ex],
        pageState: PageState.OnGoing,
      });
    },
  }));

export type ExerciseStore = ReturnType<typeof createExerciseStore>;
export const ExerciseContext = createContext<ExerciseStore | null>(null);

export function useExerciseStore<T>(
  selector: (state: ExerciseStoreData) => T,
): T {
  const store = useContext(ExerciseContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  return useStore(store, selector);
}
