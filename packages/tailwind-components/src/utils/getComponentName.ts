import { StyledTarget } from "../types"

export default function getComponentName(target: StyledTarget) {
  return (
    (typeof target === "string" && target) ||
    (target as Exclude<StyledTarget, string>).displayName ||
    (target as Function).name ||
    "tw.Component"
  )
}
