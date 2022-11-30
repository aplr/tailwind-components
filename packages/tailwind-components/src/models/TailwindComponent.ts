import { createElement, Ref, forwardRef } from "react"
import type {
  AnyComponent,
  AttrsArg,
  Dict,
  ExecutionContext,
  ExecutionProps,
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

type ResolveAttrsContext<
  Target extends StyledTarget,
  Props extends ExecutionProps
> = ExecutionContext &
  Props & { class?: string; className?: string; ref?: React.Ref<Target>; style?: object }

function mergeAttr<Target extends StyledTarget, Props extends ExecutionProps>(
  key: string,
  value: any,
  context: ResolveAttrsContext<Target, Props>
) {
  switch (key) {
    case "className":
      return joinStrings(context[key], value)
    case "style":
      return { ...context[key], ...value }
    default:
      return value
  }
}

function useResolvedAttrs<Target extends StyledTarget, Props extends ExecutionProps>(
  props: Props,
  attrs: AttrsArg<Props>[]
) {
  return attrs.reduce<ResolveAttrsContext<Target, Props>>((acc, attrDef) => {
    const resolvedAttrDef = typeof attrDef === "function" ? attrDef(acc) : attrDef

    const attrs = Object.entries(resolvedAttrDef).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: mergeAttr(key, value, acc),
      }),
      {} as ResolveAttrsContext<Target, Props>
    )

    return { ...acc, ...attrs }
  }, props)
}

function useStyledComponentImpl<Target extends StyledTarget, Props extends ExecutionProps>(
  forwardedComponent: TailwindComponent<Target, Props>,
  props: Props,
  forwardedRef: Ref<Element>
) {
  const { attrs: componentAttrs, tailwindStyles, target } = forwardedComponent

  const context = useResolvedAttrs<Target, Props>(props, componentAttrs)

  const refToForward = forwardedRef

  const elementToBeCreated: StyledTarget = context.as || target

  const isTargetTag = isTag(elementToBeCreated)
  const propsForElement: Dict<any> = {}

  // eslint-disable-next-line guard-for-in
  for (const key in context) {
    // @ts-expect-error for..in iterates strings instead of keyof
    if (context[key] === undefined) {
      // Omit undefined values from props passed to wrapped element.
      // This enables using .attrs() to remove props, for example.
    } else if (key[0] === "$" || key === "as") {
      // Omit transient props and execution props.
      continue
    } else if (key === "forwardedAs") {
      propsForElement.as = context.forwardedAs
    } else {
      // @ts-expect-error for..in iterates strings instead of keyof
      propsForElement[key] = context[key]
    }
  }

  const generatedClasses = tailwindStyles.generateClasses(context, context.className)

  // handle custom elements which React doesn't properly alias
  const classPropName =
    isTargetTag &&
    domElements.indexOf(elementToBeCreated as Extract<typeof domElements, string>) === -1
      ? "class"
      : "className"

  propsForElement[classPropName] = generatedClasses

  propsForElement.ref = refToForward

  return createElement(elementToBeCreated, propsForElement)
}

function createStyledComponent<
  Target extends StyledTarget,
  OuterProps extends object,
  Statics extends object = object
>(
  target: Target,
  options: StyledOptions<OuterProps>,
  rules: RuleSet<OuterProps>
): ReturnType<TailwindComponentFactory<Target, OuterProps, Statics>> {
  const isTargetTailwindComp = isTailwindComponent(target)
  const tailwindComponentTarget = target as TailwindComponent<Target, OuterProps>
  const isCompositeComponent = !isTag(target)

  const { attrs = EMPTY_ARRAY, displayName = generateDisplayName(target) } = options

  // fold the underlying StyledComponent attrs up (implicit extend)
  const finalAttrs =
    isTargetTailwindComp && tailwindComponentTarget.attrs
      ? tailwindComponentTarget.attrs
          .concat(attrs as unknown as AttrsArg<OuterProps>[])
          .filter(Boolean)
      : (attrs as AttrsArg<OuterProps>[])

  const tailwindStyles = new TailwindStyles(
    rules,
    isTargetTailwindComp ? tailwindComponentTarget.tailwindStyles : undefined
  )

  // statically styled-components don't need to build an execution context object,
  // and shouldn't be increasing the number of class names
  function twForwardRef(props: ExecutionProps & OuterProps, ref: Ref<Element>) {
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

  // fold the underlying TailwindComponent target up since we folded the styles
  WrappedStyledComponent.target = isTargetTailwindComp ? tailwindComponentTarget.target : target

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
