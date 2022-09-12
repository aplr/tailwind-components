import { Interpolation, Styles } from "../types";
export default function tss<Props>(styles: Styles<Props>, ...interpolations: Interpolation<Props>[]): Interpolation<Props>;
