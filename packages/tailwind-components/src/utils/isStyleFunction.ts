import { StyleFunction } from "../types"

export default function isFunction(test: any): test is StyleFunction {
  return typeof test === "function"
}
