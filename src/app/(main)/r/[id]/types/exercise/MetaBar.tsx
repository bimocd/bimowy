import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCheckIcon,
  FlagIcon,
  LogOutIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  UndoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/cpn/main/button";
import { Spinner } from "@/cpn/ui/spinner";
import {
  type ExerciseInstance,
  ExerciseState,
  type InputInstance,
  PageState,
  useExerciseStore,
} from "./store";

const strokeWidth = 3;

export function MetaBar() {
  return (
    <div className={`py-1 flex flex-col items-end justify-between gap-3`}>
      <LeftBottomBar />
      <RightBottomBar />
    </div>
  );
}

function LeftBottomBar() {
  const [time, exercises, exercisesLength, currentIndex, pageState] = [
    useExerciseStore((state) => state.getFormattedTime()),
    useExerciseStore((state) => state.exercises),
    useExerciseStore((state) => state.exercises.length),
    useExerciseStore((state) => state.currentIndex),
    useExerciseStore((state) => state.pageState),
  ];

  return !exercisesLength ? (
    <></>
  ) : (
    <div className="flex flex-col gap-2 justify-center items-end 
    bg-white/5 rounded-md p-2 ring-1 ring-ring/30">
      <Box className="font-mono">{time}</Box>
      {pageState !== PageState.End && (
        <>
          <Box className="font-mono">
            {currentIndex + 1}/{exercises.length}
          </Box>
          <div className="flex gap-0.5 flex-row sm:flex-col overflow-auto">
            {exercises.map((exercise, i) => (
              <LeftBottomExerciseButton key={i} {...{ exercise, i }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeftBottomExerciseButton({
  exercise,
  i,
}: {
  i: number;
  exercise: ExerciseInstance;
}) {
  const [currentIndex, pageState, setCurrentExerciseIndex] = [
    useExerciseStore((state) => state.currentIndex),
    useExerciseStore((state) => state.pageState),
    useExerciseStore((state) => state.setCurrentExerciseIndex),
  ];
  const isCurrent = i === currentIndex;

  const inputs = Object.values(exercise.inputs);
  return (
    <button
      className={`enabled:cursor-pointer disabled:cursor-progress
        duration-75
        enabled:hover:scale-110 enabled:data-[current=true]:scale-125
        disabled:grayscale-50`}
      data-current={isCurrent}
      disabled={
        pageState === PageState.Loading ||
        exercise.state === ExerciseState.Correcting
      }
      onClick={(ev) => {
        if (!ev.currentTarget.disabled) setCurrentExerciseIndex(i);
      }}
      type="button"
    >
      <LeftBottomExerciseButtonEmoji {...{ exercise, inputs, isCurrent }} />
    </button>
  );
}

function LeftBottomExerciseButtonEmoji({
  exercise,
  inputs,
  isCurrent,
}: {
  exercise: ExerciseInstance;
  inputs: InputInstance[];
  isCurrent: boolean;
}) {
  if (exercise.state === ExerciseState.Correcting) return "✒️";
  if (exercise.state === ExerciseState.OnGoing && isCurrent) return "✏️";
  const isNotCorrectedYet = inputs.every((inp) => !inp.correction.corrected);
  if (isNotCorrectedYet) return isCurrent ? "⬜" : "⚪";
  const isAllCorrect = inputs.every(
    (inp) => inp.correction.corrected && inp.correction.correct,
  );
  if (isAllCorrect) return isCurrent ? "🟩" : "🟢";
  return isCurrent ? "🟥" : "🔴";
}
function RightBottomBar() {
  const [
    pageState,
    exercises,
    exerciseState,
    isFullyCorrect,
    isLastExercise,
    isFirstExercise,
    start,
    correct,
    previous,
    next,
    retry,
    loadNewExercise,
    end,
  ] = [
      useExerciseStore((state) => state.pageState),
      useExerciseStore((state) => state.exercises),
      useExerciseStore((state) => state.getCurrentExercise()?.state),
      useExerciseStore((state) => state.getIsCurrentExerciseFullyCorrect()),
      useExerciseStore(
        (state) => state.currentIndex === state.exercises.length - 1,
      ),
      useExerciseStore((state) => state.currentIndex === 0),
      useExerciseStore((state) => state.start),
      useExerciseStore((state) => state.correct),
      useExerciseStore((state) => state.previous),
      useExerciseStore((state) => state.next),
      useExerciseStore((state) => state.retry),
      useExerciseStore((state) => state.loadNewExercise),
      useExerciseStore((state) => state.end),
    ];

  type ButtonData = {
    id: string;
    variant?: Parameters<typeof Button>[0]["variant"];
    disabled?: boolean;
    icon: any; // TODO fix
    text?: string;
    onClick?: () => any | Promise<any>;
  } & ({ disabled: true } | { onClick?: () => void });

  const buttonsData: {
    main: ButtonData | null;
    secondary: ButtonData[];
  } = {
    main: null,
    secondary: [],
  };

  let areAllButtonsLocked = false;

  const router = useRouter();

  if (pageState === PageState.End) {
    buttonsData.main = {
      icon: RotateCcwIcon,
      id: "redo",
      onClick: () => location.reload(),
      text: "Redo",
    };
    buttonsData.secondary = [
      {
        icon: LogOutIcon,
        id: "quit",
        onClick: () => router.back(),
        text: "Quit",
      },
    ];
  } else if (pageState === PageState.Options) {
    buttonsData.main = {
      icon: PlayIcon,
      id: "start",
      onClick: () => start(),
      text: "Start",
    };
  } else if (
    pageState === PageState.Loading ||
    exerciseState === ExerciseState.Correcting
  ) {
    buttonsData.main = {
      disabled: true,
      icon: Spinner,
      id: "loading",
    };
    areAllButtonsLocked = true;
  } else if (exerciseState === ExerciseState.Corrected && isLastExercise) {
    if (isFullyCorrect) {
      buttonsData.main = {
        icon: PlusIcon,
        id: "add",
        onClick: () => loadNewExercise(),
        text: "Add",
      };
    } else {
      buttonsData.main = {
        icon: UndoIcon,
        id: "try-again",
        onClick: () => retry(),
        text: "Try again",
      };
    }
  } else if (exerciseState === ExerciseState.OnGoing) {
    buttonsData.main = {
      icon: CheckCheckIcon,
      id: "correct",
      onClick: () => correct(),
      text: "Correct",
    };
  }
  if (exercises.length && pageState !== PageState.End) {
    buttonsData.secondary.push({
      icon: FlagIcon,
      id: "end",
      onClick: () => end(),
      text: "End",
    });
    buttonsData.secondary.push({
      disabled: isFirstExercise,
      icon: ArrowLeftIcon,
      id: "previous",
      onClick: () => previous(),
    });
    const nextButton = {
      disabled: isLastExercise,
      icon: ArrowRightIcon,
      id: "next",
      onClick: () => next(),
    };
    if (!buttonsData.main) buttonsData.main = nextButton;
    else buttonsData.secondary.push(nextButton);
  }

  return (
    <div
      className={`flex flex-col-reverse
        gap-3 ${areAllButtonsLocked ? "cursor-progress" : ""}`}
    >
      {buttonsData.main && <BottomButton {...buttonsData.main} />}
      {buttonsData.secondary.map((b) => (
        <BottomButton
          {...b}
          disabled={areAllButtonsLocked || b.disabled}
          key={b.id}
          variant="secondary"
        />
      ))}
    </div>
  );
}

function BottomButton({
  id,
  variant,
  disabled,
  onClick,
  icon: Icon,
  text,
}: {
  id: string;
  variant?: Parameters<typeof Button>[0]["variant"];
  disabled?: boolean;
  onClick?: () => void;
  icon: any;
  text?: string;
}) {
  return (
    <Button
      {...{ disabled, variant }}
      id={id}
      onClick={() => {
        if (disabled) return;
        if (onClick) return onClick();
      }}
    >
      <Icon {...{ strokeWidth }} />
      {text}
    </Button>
  );
}

export function Box({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className: string;
  props?: HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className={twMerge(
        className,
        `border-border border
        leading-none
        p-1.5 px-2 rounded-sm bg-white/5`,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
