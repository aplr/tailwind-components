import { AnyComponent, ExecutionProps, Interpolation, RuleSet, TailwindComponent } from "../types"
import getComponentName from "./getComponentName"
import isFunction from "./isFunction"
import isPlainObject from "./isPlainObject"
import isStatelessFunction from "./isStatelessFunction"

/**
 * It's falsish not falsy because 0 is allowed.
 */
const isFalsish = (chunk: any): chunk is undefined | null | false | "" =>
  chunk === undefined || chunk === null || chunk === false || chunk === ""

export default function flatten<Props extends object>(
  chunk: Interpolation<Props>,
  executionContext?: ExecutionProps & Props
): RuleSet<Props> {
  if (Array.isArray(chunk)) {
    return chunk.flatMap(interpolation => {
      const result = flatten<Props>(interpolation, executionContext)
      return result.length === 0 ? [] : [result]
    })
  }

  if (isFalsish(chunk)) {
    return []
  }

  /* Either execute or defer the function */
  if (isFunction(chunk)) {
    if (isStatelessFunction(chunk) && executionContext) {
      const chunkFn = chunk as (props: {}) => Interpolation<Props>
      const result = chunkFn(executionContext)

      if (
        process.env.NODE_ENV !== "production" &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        !isPlainObject(result)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `${getComponentName(
            chunkFn as AnyComponent
          )} is not a tailwind component and cannot be referred to via component selector.`
        )
      }

      return flatten(result, executionContext)
    } else {
      return [chunk as unknown as TailwindComponent<"div", any>]
    }
  }

  return [chunk.toString()]
}
