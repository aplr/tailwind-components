import { twMerge } from "tailwind-merge"
import { RuleSet } from "../types"
import flatten from "../utils/flatten"

const clean = (chunks: string[]) =>
  chunks
    .join(" ")
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .split(" ")
    .filter(c => c !== ",")

export class TailwindStyles {
  rules: RuleSet<any>

  constructor(rules: RuleSet<any>) {
    this.rules = rules
  }

  generateClasses(executionContext: Object, inheritedClasses: string): string {
    const generatedClasses = clean(flatten(this.rules, executionContext) as string[])
    return twMerge(...generatedClasses.concat(inheritedClasses))
  }
}
