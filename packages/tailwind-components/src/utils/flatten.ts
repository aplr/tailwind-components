import { AnyComponent, ExecutionContext, Interpolation, RuleSet } from "../types"
import getComponentName from "./getComponentName"
import isFunction from "./isFunction"
import isPlainObject from "./isPlainObject"
import isStatelessFunction from "./isStatelessFunction"

/**
 * It's falsish not falsy because 0 is allowed.
 */
const isFalsish = (chunk: any): chunk is undefined | null | false | "" =>
  chunk === undefined || chunk === null || chunk === false || chunk === ""

export default function flatten<Props = unknown>(
  chunk: Interpolation<Props>,
  executionContext?: ExecutionContext & Props
): Interpolation<Props> {
  if (Array.isArray(chunk)) {
    return chunk.flatMap((interpolation) => {
      const result = flatten<Props>(interpolation, executionContext)
      if (result === "") return []
      else if (Array.isArray(result)) return result
      else return [result]
    })
  }

  if (isFalsish(chunk)) {
    return ""
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
          )} is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.`
        )
      }

      return flatten(result, executionContext)
    } else {
      return chunk
    }
  }

  return chunk.toString()
}
