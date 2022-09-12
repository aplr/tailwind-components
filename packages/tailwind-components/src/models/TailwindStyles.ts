import { RuleSet } from "../types"
import flatten from "../utils/flatten"

export class TailwindStyles {
  rules: RuleSet<any>

  constructor(rules: RuleSet<any>) {
    this.rules = rules
  }

  generateClasses(executionContext: Object): string {
    return (flatten(this.rules, executionContext) as string[]).join("")
  }
}
