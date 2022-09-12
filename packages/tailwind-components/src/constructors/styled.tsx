import createStyledComponent from "../models/TailwindComponent"
import { StyledTarget } from "../types"
import domElements from "../utils/domElements"
import constructWithOptions, { Styled } from "./constructWithOptions"

function baseStyled<Target extends StyledTarget>(tag: Target) {
  return constructWithOptions<Target>(createStyledComponent, tag)
}

export type IntrinsicElementsTemplateFunctionsMap = {
  [E in keyof JSX.IntrinsicElements]: Styled<E, JSX.IntrinsicElements[E]>
}

interface TailwindInterface extends IntrinsicElementsTemplateFunctionsMap {
  <Target extends StyledTarget>(tag: Target): Styled<Target>
}

const intrinsicElementsMap = domElements.reduce(
  (acc, element) => ({
    ...acc,
    [element]: baseStyled(element),
  }),
  {} as IntrinsicElementsTemplateFunctionsMap
)

const twc = baseStyled as TailwindInterface

Object.assign(twc, intrinsicElementsMap)

export default twc
