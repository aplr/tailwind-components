import React, { ComponentPropsWithRef } from "react"
import {
  Attrs,
  AttrsArg,
  Interpolation,
  TailwindComponent,
  TailwindComponentFactory,
  KnownTarget,
  StyledOptions,
  StyledTarget,
  Styles,
} from "../types"
import { EMPTY_OBJECT } from "../utils/empties"
import styledError from "../utils/error"
import tss from "./tss"

type OptionalIntersection<A, B> = {
  [K in Extract<keyof A, keyof B>]?: A[K]
}

type MarkPropsSatisfiedByAttrs<T extends Attrs, Props extends object> = T extends (
  ...args: any
) => infer P
  ? Omit<Props, keyof P> & OptionalIntersection<Props, P>
  : Omit<Props, keyof T> & Partial<T>

export interface Styled<
  Target extends StyledTarget,
  OuterProps extends object = Target extends KnownTarget
    ? ComponentPropsWithRef<Target>
    : JSX.IntrinsicElements["div"],
  OuterStatics extends object = object
> {
  <Props extends object = object, Statics extends object = object>(
    initialStyles: Styles<OuterProps & Props>,
    ...interpolations: Interpolation<OuterProps & Props>[]
  ): TailwindComponent<Target, OuterProps & Props> & OuterStatics & Statics

  <Props extends object = object, Statics extends object = object>(
    initialStyles: Styles<OuterProps & Props>,
    ...interpolations: Interpolation<OuterProps & Props>[]
  ): TailwindComponent<Target, OuterProps & Props> & OuterStatics & Statics

  attrs: <T extends Attrs>(
    attrs: AttrsArg<T extends (...args: any) => infer P ? OuterProps & P : OuterProps & T>
  ) => Styled<Target, MarkPropsSatisfiedByAttrs<T, OuterProps>, OuterStatics>

  withConfig: (config: StyledOptions<OuterProps>) => Styled<Target, OuterProps, OuterStatics>
}

export default function constructWithOptions<
  Target extends StyledTarget,
  OuterProps extends object = Target extends KnownTarget
    ? ComponentPropsWithRef<Target>
    : JSX.IntrinsicElements["div"],
  OuterStatics extends object = object
>(
  componentConstructor: TailwindComponentFactory<Target, OuterProps, OuterStatics>,
  tag: Target,
  options: StyledOptions<OuterProps> = EMPTY_OBJECT
): Styled<Target, OuterProps, OuterStatics> {
  // We trust that the tag is a valid component as long as it isn't falsish
  // Typically the tag here is a string or function (i.e. class or pure function component)
  // However a component may also be an object if it uses another utility, e.g. React.memo
  // React will output an appropriate warning however if the `tag` isn't valid
  if (!tag) {
    throw styledError("Cannot create tailwind component for: %s.", tag)
  }

  /* This is callable directly as a template function */
  const templateFunction = <Props extends object = object, Statics extends object = object>(
    initialStyles: Styles<OuterProps & Props>,
    ...interpolations: Interpolation<OuterProps & Props>[]
  ) => componentConstructor<Props, Statics>(tag, options, tss(initialStyles, ...interpolations))

  /* Modify/inject new props at runtime */
  templateFunction.attrs = <T extends Attrs>(
    attrs: AttrsArg<T extends (...args: any) => infer P ? OuterProps & P : OuterProps & T>
  ) =>
    constructWithOptions<Target, MarkPropsSatisfiedByAttrs<T, OuterProps>, OuterStatics>(
      componentConstructor as unknown as TailwindComponentFactory<
        Target,
        MarkPropsSatisfiedByAttrs<T, OuterProps>,
        OuterStatics
      >,
      tag,
      {
        ...options,
        attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
      }
    )

  /**
   * If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = (config: StyledOptions<OuterProps>) =>
    constructWithOptions<Target, OuterProps, OuterStatics>(componentConstructor, tag, {
      ...options,
      ...config,
    })

  return templateFunction
}
