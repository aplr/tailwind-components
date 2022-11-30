import {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  ExoticComponent,
  ForwardRefExoticComponent,
  ReactElement,
} from "react"
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

export type KnownTarget = keyof JSX.IntrinsicElements | AnyComponent

export type StyledTarget =
  | string // allow custom elements, etc.
  | KnownTarget

export type Dict<T> = { [key: string]: T }

export interface ExecutionProps {
  as?: KnownTarget
  forwardedAs?: KnownTarget
}

export interface StyleFunction<Props extends object> {
  (executionContext: Omit<ExecutionProps, keyof Props> & Props): Interpolation<Props>
}

export type Interpolation<Props extends object> =
  | StyleFunction<Props>
  | TemplateStringsArray
  | string
  | number
  | false
  | undefined
  | null
  | OmitSignatures<TailwindComponent<any, any>>
  | Interpolation<Props>[]

export type AttrsArg<Props extends object> =
  | (Omit<ExecutionProps, keyof Props> & Props)
  | ((props: Omit<ExecutionProps, keyof Props> & Props) => Partial<Props>)

export type Attrs = object | ((...args: any) => object)

export type RuleSet<Props extends object> = Interpolation<Props>[]

export type Styles<Props extends object> = TemplateStringsArray | StyleFunction<Props>

export interface Flattener<Props extends object> {
  (
    chunks: Interpolation<Props>[],
    executionContext: Object | null | undefined
  ): Interpolation<Props>[]
}

export type FlattenerResult<Props extends object> =
  | RuleSet<Props>
  | number
  | string
  | string[]
  | TailwindComponent<any, any>

export interface IStyledStatics<OuterProps extends object> {
  attrs: AttrsArg<OuterProps>[]
  target: StyledTarget
  tailwindStyles: TailwindStyles<OuterProps>
}

export type PolymorphicComponentProps<E extends StyledTarget, P extends object> = Omit<
  E extends KnownTarget ? P & Omit<ComponentPropsWithRef<E>, keyof P> : P,
  "as"
> & {
  as?: P extends { as?: string | AnyComponent } ? P["as"] : E
}

type OmitSignatures<T> = Pick<T, keyof T>

export interface PolymorphicComponent<Props extends object, FallbackComponent extends StyledTarget>
  extends OmitSignatures<ForwardRefExoticComponent<Props>> {
  <E extends StyledTarget = FallbackComponent>(
    props: PolymorphicComponentProps<E, Props>
  ): ReactElement | null
}

export interface TailwindComponent<Target extends StyledTarget, Props extends object>
  extends PolymorphicComponent<Props, Target>,
    IStyledStatics<Props>,
    IsTwElement {
  defaultProps?: Partial<
    (Target extends KnownTarget
      ? ExecutionProps & Omit<ComponentProps<Target>, keyof ExecutionProps>
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
