import { TailwindComponent } from "../types";
export declare const isTwElement: unique symbol;
export declare type IsTwElement = {
    [isTwElement]: true;
};
export default function isTailwindComponent(target: any): target is TailwindComponent<any>;
