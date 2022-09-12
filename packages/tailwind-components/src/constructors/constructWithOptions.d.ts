/// <reference types="react" />
import { Attrs, ExecutionContext, ExtensibleObject, Interpolation, TailwindComponent, TailwindComponentFactory, KnownTarget, StyledOptions, StyledTarget, Styles } from "../types";
export interface Styled<Target extends StyledTarget, DerivedProps = Target extends KnownTarget ? React.ComponentProps<Target> : unknown, OuterProps = unknown, OuterStatics = unknown> {
    <Props = unknown, Statics = unknown>(initialStyles: Styles<DerivedProps & OuterProps & Props>, ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & Props>[]): TailwindComponent<Target, DerivedProps & OuterProps & Props> & OuterStatics & Statics;
    attrs(attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps>): Styled<Target, DerivedProps, OuterProps, OuterStatics>;
    withConfig(config: StyledOptions<DerivedProps & OuterProps>): Styled<Target, DerivedProps, OuterProps, OuterStatics>;
}
export default function constructWithOptions<Target extends StyledTarget, DerivedProps = Target extends KnownTarget ? React.ComponentProps<Target> : unknown, OuterProps = unknown, // used for styled<{}>().attrs() so attrs() gets the generic prop context
OuterStatics = unknown>(componentConstructor: TailwindComponentFactory<any, any, any>, tag: Target, options?: StyledOptions<DerivedProps & OuterProps>): {
    <Props = unknown, Statics = unknown>(initialStyles: Styles<DerivedProps & OuterProps & Props>, ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & Props>[]): TailwindComponent<Target, DerivedProps & OuterProps & Props> & OuterStatics & Statics;
    attrs(attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps>): {
        <Props_1 = unknown, Statics_1 = unknown>(initialStyles: Styles<DerivedProps & OuterProps & OuterStatics & Props_1>, ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & OuterStatics & Props_1>[]): TailwindComponent<Target, DerivedProps & OuterProps & OuterStatics & Props_1> & Statics_1;
        attrs(attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps & OuterStatics>): {
            <Props_2 = unknown, Statics_2 = unknown>(initialStyles: Styles<DerivedProps & OuterProps & OuterStatics & Props_2>, ...interpolations: Interpolation<ExecutionContext & DerivedProps & OuterProps & OuterStatics & Props_2>[]): TailwindComponent<Target, DerivedProps & OuterProps & OuterStatics & Props_2> & Statics_2;
            attrs(attrs: Attrs<ExtensibleObject & DerivedProps & OuterProps & OuterStatics>): any;
            /**
             * If config methods are called, wrap up a new template function and merge options */
            withConfig(config: StyledOptions<DerivedProps & OuterProps & OuterStatics>): any;
        };
        /**
         * If config methods are called, wrap up a new template function and merge options */
        withConfig(config: StyledOptions<DerivedProps & OuterProps & OuterStatics>): any;
    };
    /**
     * If config methods are called, wrap up a new template function and merge options */
    withConfig(config: StyledOptions<DerivedProps & OuterProps>): any;
};
