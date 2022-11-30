import { TailwindComponent } from "../types"

export const isTwElement = Symbol("isTwElement?")

export type IsTwElement = { [isTwElement]: true }

export default function isTailwindComponent(target: any): target is TailwindComponent<any, any> {
  return typeof target === "object" && target[isTwElement] === true
}
