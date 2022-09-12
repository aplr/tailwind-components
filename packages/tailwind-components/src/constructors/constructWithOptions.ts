import {
  Attrs,
  ExecutionContext,
  ExtensibleObject,
  Interpolation,
  TailwindComponent,
  TailwindComponentFactory,
  KnownTarget,
  RuleSet,
  StyledOptions,
  StyledTarget,
  Styles,
} from "../types"
import { EMPTY_OBJECT } from "../utils/empties"
import styledError from "../utils/error"
import tss from "./tss"

export interface Styled<
  Target extends StyledTarget,
  DerivedProps = Target extends KnownTarget ? React.ComponentProps<Target> : unknown,
  OuterProps = unknown,
  OuterStatics = unknown
> {
  <Props = unknown, Statics = unknown>(
    initialStyles: Styles<DerivedProps & OuterProps & Props>,
    ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & Props>[]
  ): TailwindComponent<Target, DerivedProps & OuterProps & Props> & OuterStatics & Statics
  attrs(
    attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps>
  ): Styled<Target, DerivedProps, OuterProps, OuterStatics>
  withConfig(
    config: StyledOptions<DerivedProps & OuterProps>
  ): Styled<Target, DerivedProps, OuterProps, OuterStatics>
}

export default function constructWithOptions<
  Target extends StyledTarget,
  DerivedProps = Target extends KnownTarget ? React.ComponentProps<Target> : unknown,
  OuterProps = unknown, // used for styled<{}>().attrs() so attrs() gets the generic prop context
  OuterStatics = unknown
>(
  componentConstructor: TailwindComponentFactory<any, any, any>,
  tag: Target,
  options: StyledOptions<DerivedProps & OuterProps> = EMPTY_OBJECT as StyledOptions<
    DerivedProps & OuterProps
  >
) {
  // We trust that the tag is a valid component as long as it isn't falsish
  // Typically the tag here is a string or function (i.e. class or pure function component)
  // However a component may also be an object if it uses another utility, e.g. React.memo
  // React will output an appropriate warning however if the `tag` isn't valid
  if (!tag) {
    throw styledError("Cannot create styled-component for component: %s.\n\n", tag)
  }

  /* This is callable directly as a template function */
  const templateFunction = <Props = unknown, Statics = unknown>(
    initialStyles: Styles<DerivedProps & OuterProps & Props>,
    ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & Props>[]
  ) =>
    componentConstructor(
      tag,
      options as unknown as StyledOptions<DerivedProps & OuterProps & Props>,
      tss<ExecutionContext & DerivedProps & OuterProps & Props>(
        initialStyles,
        ...interpolations
      ) as RuleSet<DerivedProps & OuterProps & Props>
    ) as ReturnType<
      TailwindComponentFactory<Target, DerivedProps & OuterProps & Props, OuterStatics & Statics>
    >

  /* Modify/inject new props at runtime */
  templateFunction.attrs = (attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps>) =>
    constructWithOptions<Target, DerivedProps & OuterProps, OuterStatics>(
      componentConstructor,
      tag,
      {
        ...options,
        attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
      }
    )

  /**
   * If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = (config: StyledOptions<DerivedProps & OuterProps>) =>
    constructWithOptions<Target, DerivedProps, OuterProps, OuterStatics>(
      componentConstructor,
      tag,
      {
        ...options,
        ...config,
      }
    )

  return templateFunction
}
