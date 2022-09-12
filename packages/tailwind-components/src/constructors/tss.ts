import { Interpolation, Styles } from "../types"
import { EMPTY_ARRAY } from "../utils/empties"
import flatten from "../utils/flatten"
import interleave from "../utils/interleave"
import isStyleFunction from "../utils/isStyleFunction"

export default function tss<Props>(
  styles: Styles<Props>,
  ...interpolations: Interpolation<Props>[]
) {
  if (isStyleFunction(styles)) {
    flatten<Props>(
      interleave<Props>(EMPTY_ARRAY as TemplateStringsArray, [styles, ...interpolations])
    )
  }

  const styleStringArray = styles as TemplateStringsArray

  if (
    interpolations.length === 0 &&
    styleStringArray.length === 1 &&
    typeof styleStringArray[0] === "string"
  ) {
    return styleStringArray
  }

  return flatten<Props>(interleave<Props>(styleStringArray, interpolations))
}
