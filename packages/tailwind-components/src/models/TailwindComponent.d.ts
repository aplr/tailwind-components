import type { ExtensibleObject, TailwindComponentFactory, RuleSet, StyledOptions, StyledTarget } from "../types";
declare function createStyledComponent<Target extends StyledTarget, OuterProps extends ExtensibleObject, Statics = unknown>(target: Target, options: StyledOptions<OuterProps>, rules: RuleSet<OuterProps>): ReturnType<TailwindComponentFactory<Target, OuterProps, Statics>>;
export default createStyledComponent;
