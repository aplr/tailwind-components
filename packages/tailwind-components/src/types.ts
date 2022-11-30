import { ComponentType, ElementType, ExoticComponent, ReactElement } from "react"
import { TailwindStyles } from "./models/TailwindStyles"
import { IsTwElement } from "./utils/isTailwindComponent"

interface ExoticComponentWithDisplayName<Props = any> extends ExoticComponent<Props> {
  defaultProps?: Partial<Props>
  displayName?: string
}

export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

export type AnyComponent<Props = any> = ExoticComponentWithDisplayName<Props> | ComponentType<Props>

export interface StyledOptions<Props extends object> {
  attrs?: AttrsArg<Props>[]
  displayName?: string
}

export type Dict<T> = { [key: string]: T }

export type KnownTarget<Props = any> = ElementType<Props> | AnyComponent<Props>

export type StyledTarget =
  | string // allow custom elements, etc.
  | KnownTarget

export interface ExecutionProps {
  as?: KnownTarget
  forwardedAs?: KnownTarget
}

export interface ExecutionContext extends ExecutionProps {}

export interface StyleFunction<Props extends object> {
  (executionContext: Omit<ExecutionContext, keyof Props> & Props): Interpolation<Props>
}

export type Interpolation<Props extends object> =
  | StyleFunction<Props>
  | TemplateStringsArray
  | string
  | number
  | boolean
  | undefined
  | null
  | OmitSignatures<TailwindComponent<any, any>>
  | Interpolation<Props>[]

export type AttrsArg<Props extends object> =
  | (Omit<ExecutionProps, keyof Props> & Props)
  | ((props: Omit<ExecutionContext, keyof Props> & Props) => Partial<Props>)

export type Attrs = object | ((...args: any) => object)

export type RuleSet<Props extends object> = Interpolation<Props>[]

export interface IStyledStatics<Props extends object> {
  attrs: AttrsArg<Props>[]
  target: StyledTarget
  tailwindStyles: TailwindStyles<Props>
}

export type Styles<Props extends object> = TemplateStringsArray | StyleFunction<Props>

export type PolymorphicComponentProps<E extends StyledTarget, P extends object> = Omit<
  E extends KnownTarget ? P & Omit<React.ComponentPropsWithRef<E>, keyof P> : P,
  "as"
> & {
  as?: P extends { as?: string | AnyComponent } ? P["as"] : E
}

type OmitSignatures<T> = Pick<T, keyof T>

export interface PolymorphicComponent<P extends object, FallbackComponent extends StyledTarget>
  extends OmitSignatures<React.ForwardRefExoticComponent<P>> {
  <E extends StyledTarget = FallbackComponent>(
    props: PolymorphicComponentProps<E, P>
  ): ReactElement | null
}

export interface TailwindComponent<Target extends StyledTarget, Props extends object>
  extends PolymorphicComponent<Props, Target>,
    IStyledStatics<Props>,
    IsTwElement {
  defaultProps?: Partial<
    (Target extends KnownTarget
      ? ExecutionProps & Omit<React.ComponentProps<Target>, keyof ExecutionProps>
      : ExecutionProps) &
      Props
  >
}

export interface TailwindComponentFactory<
  Target extends StyledTarget,
  OuterProps extends object,
  OuterStatics extends object = object
> {
  <Props extends object = object, Statics extends object = object>(
    target: Target,
    options: StyledOptions<OuterProps>,
    rules: RuleSet<OuterProps & Props>
  ): TailwindComponent<Target, OuterProps & Props> & OuterStatics & Statics
}
