import { twMerge } from "tailwind-merge"
import { ExecutionProps, RuleSet } from "../types"
import flatten from "../utils/flatten"

const clean = (chunks: string[]) =>
  chunks
    .join(" ")
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .split(" ")
    .filter(c => c !== ",")

export class TailwindStyles<Props extends object> {
  rules: RuleSet<Props>
  baseStyle?: TailwindStyles<Props>

  constructor(rules: RuleSet<any>, baseStyle?: TailwindStyles<Props>) {
    this.rules = rules
    this.baseStyle = baseStyle
  }

  generateClasses(executionContext: ExecutionProps & Props, inheritedClasses?: string): string {
    const baseGeneratedClasses = this.baseStyle?.generateClasses(executionContext) ?? []
    const generatedClasses = clean(flatten(this.rules, executionContext) as string[])
    return twMerge([baseGeneratedClasses, ...generatedClasses, inheritedClasses].filter(Boolean))
  }
}
