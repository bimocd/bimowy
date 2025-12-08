import {
  MathJax,
  MathJaxContext,
  type MathJaxContextProps,
} from "better-react-mathjax";
import type { HTMLAttributes, ReactNode } from "react";

export function LatexText({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <MathJax inline {...props}>
      {children}
    </MathJax>
  );
}

export function LatexProvider({
  children,
  ...props
}: MathJaxContextProps & { children: ReactNode }) {
  return <MathJaxContext {...props}>{children}</MathJaxContext>;
}
