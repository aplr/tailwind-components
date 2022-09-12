/// <reference types="react" />
import { StyledTarget } from "../types";
import { Styled } from "./constructWithOptions";
export declare type IntrinsicElementsTemplateFunctionsMap = {
    [E in keyof JSX.IntrinsicElements]: Styled<E, JSX.IntrinsicElements[E]>;
};
interface TailwindInterface extends IntrinsicElementsTemplateFunctionsMap {
    <Target extends StyledTarget>(tag: Target): Styled<Target>;
}
declare const twc: TailwindInterface;
export default twc;
