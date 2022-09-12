import { StyledTarget } from "../types"

export default function isTag(target: StyledTarget): target is string {
  return typeof target === "string"
}
