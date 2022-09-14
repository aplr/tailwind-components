import { createElement, Ref, forwardRef } from "react"
import type {
  AnyComponent,
  Attrs,
  ExecutionContext,
  ExtensibleObject,
  TailwindComponent,
  TailwindComponentFactory,
  IStyledStatics,
  OmitNever,
  RuleSet,
  StyledOptions,
  StyledTarget,
} from "../types"
import domElements from "../utils/domElements"
import { EMPTY_ARRAY } from "../utils/empties"
import generateDisplayName from "../utils/generateDisplayName"
import hoist from "../utils/hoist"
import isTailwindComponent from "../utils/isTailwindComponent"
import isTag from "../utils/isTag"
import joinStrings from "../utils/joinStrings"
import { TailwindStyles } from "./TailwindStyles"

function mergeAttr<Props = unknown>(key: string, value: any, context: ExecutionContext & Props) {
  switch (key) {
    case "className":
      return joinStrings(context[key], value)
    case "style":
      return { ...context[key], ...value }
    default:
      return value
  }
}

function useResolvedAttrs<Props = unknown>(props: Props, attrs: Attrs<Props>[]) {
  // NOTE: can't memoize this
  // returns [context, resolvedAttrs]
  // where resolvedAttrs is only the things injected by the attrs themselves
  const context = props as ExecutionContext & Props

  const resolvedAttrs = attrs.reduce((acc, attrDef) => {
    const resolvedAttrDef = typeof attrDef === "function" ? attrDef(context) : attrDef

    const attrs = Object.entries(resolvedAttrDef).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: mergeAttr(key, value, context),
      }),
      {} as Props
    )

    return { ...acc, ...attrs }
  }, {} as Props)

  Object.assign(context, resolvedAttrs)

  return context
}

function useStyledComponentImpl<Target extends StyledTarget, Props extends ExtensibleObject>(
  forwardedComponent: TailwindComponent<Target, Props>,
  props: Props,
  forwardedRef: Ref<Element>
) {
  const { attrs: componentAttrs, target, tailwindStyles } = forwardedComponent

  const context = useResolvedAttrs<Props>(props, componentAttrs)

  const refToForward = forwardedRef

  const elementToBeCreated: StyledTarget = context.$as || context.as || target

  const isTargetTag = isTag(elementToBeCreated)
  const propsForElement: ExtensibleObject = {}

  // eslint-disable-next-line guard-for-in
  for (const key in context) {
    if (key[0] === "$" || key === "as") {
      continue
    } else if (key === "forwardedAs") {
      propsForElement.as = context[key]
    } else {
      // Don't pass through non HTML tags through to HTML elements
      propsForElement[key] = context[key]
    }
  }

  const generatedClasses = tailwindStyles.generateClasses(context, context["className"])

  // handle custom elements which React doesn't properly alias
  const classPropName =
    isTargetTag &&
    domElements.indexOf(elementToBeCreated as unknown as Extract<typeof domElements, string>) === -1
      ? "class"
      : "className"

  propsForElement[classPropName] = generatedClasses

  propsForElement.ref = refToForward

  return createElement(elementToBeCreated, propsForElement)
}

function createStyledComponent<
  Target extends StyledTarget,
  OuterProps extends ExtensibleObject,
  Statics = unknown
>(
  target: Target,
  options: StyledOptions<OuterProps>,
  rules: RuleSet<OuterProps>
): ReturnType<TailwindComponentFactory<Target, OuterProps, Statics>> {
  const isTargetStyledComp = isTailwindComponent(target)
  const styledComponentTarget = target as TailwindComponent<Target, OuterProps>
  const isCompositeComponent = !isTag(target)

  const { attrs = EMPTY_ARRAY, displayName = generateDisplayName(target) } = options

  // fold the underlying StyledComponent attrs up (implicit extend)
  const finalAttrs =
    isTargetStyledComp && styledComponentTarget.attrs
      ? styledComponentTarget.attrs.concat(attrs as unknown as Attrs<OuterProps>[]).filter(Boolean)
      : (attrs as Attrs<OuterProps>[])

  const tailwindStyles = new TailwindStyles(rules)

  // statically styled-components don't need to build an execution context object,
  // and shouldn't be increasing the number of class names
  function twForwardRef(props: OuterProps, ref: Ref<Element>) {
    // eslint-disable-next-line
    return useStyledComponentImpl<Target, OuterProps>(WrappedStyledComponent, props, ref)
  }

  twForwardRef.displayName = displayName

  /**
   * forwardRef creates a new interim component, which we'll take advantage of
   * instead of extending ParentComponent to create _another_ interim class
   */
  let WrappedStyledComponent = forwardRef(twForwardRef) as unknown as TailwindComponent<
    typeof target,
    OuterProps
  > &
    Statics

  WrappedStyledComponent.attrs = finalAttrs
  WrappedStyledComponent.tailwindStyles = tailwindStyles
  WrappedStyledComponent.displayName = displayName

  // fold the underlying StyledComponent target up since we folded the styles
  WrappedStyledComponent.target = isTargetStyledComp ? styledComponentTarget.target : target

  if (isCompositeComponent) {
    const compositeComponentTarget = target as AnyComponent

    hoist<typeof WrappedStyledComponent, typeof compositeComponentTarget>(
      WrappedStyledComponent,
      compositeComponentTarget,
      {
        // all SC-specific things should not be hoisted
        attrs: true,
        displayName: true,
        target: true,
        tailwindStyles: true,
      } as { [key in keyof OmitNever<IStyledStatics<OuterProps>>]: true }
    )
  }

  return WrappedStyledComponent
}

export default createStyledComponent
