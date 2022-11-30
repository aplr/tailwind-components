import { Interpolation, RuleSet, StyleFunction, Styles } from "../types"
import { EMPTY_ARRAY } from "../utils/empties"
import flatten from "../utils/flatten"
import interleave from "../utils/interleave"
import isStyleFunction from "../utils/isStyleFunction"

const addTag = <T extends RuleSet<any>>(arg: T): T & { isTss: true } =>
  Object.assign(arg, { isTss: true } as const)

// function tss(styles: Styles<object>, ...interpolations: Interpolation<object>[]): RuleSet<object>
function tss<Props extends object = object>(
  styles: Styles<Props>,
  ...interpolations: Interpolation<Props>[]
): RuleSet<Props> {
  if (isStyleFunction(styles)) {
    return addTag(
      flatten<Props>(
        interleave<Props>(EMPTY_ARRAY, [styles as StyleFunction<Props>, ...interpolations])
      )
    )
  }

  const styleStringArray = styles as TemplateStringsArray

  if (
    interpolations.length === 0 &&
    styleStringArray.length === 1 &&
    typeof styleStringArray[0] === "string"
  ) {
    return flatten<Props>(styleStringArray)
  }

  return addTag(flatten<Props>(interleave<Props>(styleStringArray, interpolations)))
}

export default tss
