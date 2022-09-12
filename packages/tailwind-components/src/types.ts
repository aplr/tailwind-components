import {
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  ExoticComponent,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactElement,
} from "react"
import { TailwindStyles } from "./models/TailwindStyles"
import { IsTwElement } from "./utils/isTailwindComponent"

interface ExoticComponentWithDisplayName<Props = unknown> extends ExoticComponent<Props> {
  defaultProps?: Partial<Props>
  displayName?: string
}

export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

export type AnyComponent<Props = any> = ExoticComponentWithDisplayName<Props> | ComponentType<Props>

export interface StyledOptions<Props> {
  attrs?: Attrs<Props>[]
  displayName?: string
}

export type KnownTarget<Props = any> = ElementType<Props> | AnyComponent<Props>

export type StyledTarget =
  | string // allow custom elements, etc.
  | KnownTarget

export interface BaseExtensibleObject {
  [key: string]: any
}

export interface ExtensibleObject extends BaseExtensibleObject {
  $as?: KnownTarget
  $forwardedAs?: KnownTarget
  as?: KnownTarget
  forwardedAs?: KnownTarget
}

export interface ExecutionContext extends ExtensibleObject {}

export interface StyleFunction<Props = BaseExtensibleObject> {
  (executionContext: ExecutionContext & Props): Interpolation<Props>
}

export type Interpolation<Props> =
  | StyleFunction<Props>
  | TemplateStringsArray
  | string
  | number
  | boolean
  | undefined
  | null
  | Interpolation<Props>[]

export type Attrs<Props> =
  | (ExtensibleObject & Props)
  | ((props: ExecutionContext & Props) => Partial<Props>)

export type RuleSet<Props> = Interpolation<Props>[]

export interface IStyledStatics<Props> {
  attrs: Attrs<Props>[]
  target: StyledTarget
  tailwindStyles: TailwindStyles
}

export type Styles<Props> = TemplateStringsArray | StyleFunction<Props>

type PolymorphicComponentProps<
  ActualComponent extends StyledTarget,
  PropsToBeInjectedIntoActualComponent extends {},
  ActualComponentProps = ActualComponent extends KnownTarget
    ? ComponentPropsWithRef<ActualComponent>
    : {}
> = HTMLAttributes<ActualComponent> &
  Omit<PropsToBeInjectedIntoActualComponent, keyof ActualComponentProps | "as" | "$as"> &
  ActualComponentProps &
  (
    | {
        // if "$as" is passed it takes precendence over "as"
        $as: ActualComponent
        as?: AnyComponent
      }
    | {
        as?: AnyComponent
      }
  )

interface PolymorphicComponent<
  FallbackComponent extends StyledTarget,
  ExpectedProps = unknown,
  PropsToBeInjectedIntoActualComponent = unknown
> extends ForwardRefExoticComponent<ExpectedProps> {
  <ActualComponent extends StyledTarget = FallbackComponent>(
    props: PolymorphicComponentProps<
      ActualComponent,
      ExpectedProps & PropsToBeInjectedIntoActualComponent & {}
    >
  ): ReactElement<
    PolymorphicComponentProps<
      ActualComponent,
      ExecutionContext & ExpectedProps & PropsToBeInjectedIntoActualComponent
    >,
    ActualComponent
  >
}

export interface TailwindComponent<Target extends StyledTarget, Props = unknown>
  extends PolymorphicComponent<Target, Props, ExecutionContext>,
    IStyledStatics<Props>,
    IsTwElement {
  defaultProps?: Partial<
    ExtensibleObject & (Target extends KnownTarget ? React.ComponentProps<Target> : {}) & Props
  >
}

export interface TailwindComponentFactory<
  Target extends StyledTarget,
  Props = unknown,
  Statics = unknown
> {
  (target: Target, options: StyledOptions<Props>, rules: RuleSet<Props>): TailwindComponent<
    Target,
    Props
  > &
    Statics
}