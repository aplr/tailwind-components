import { ExecutionContext, Interpolation } from "../types";
export default function flatten<Props = unknown>(chunk: Interpolation<Props>, executionContext?: ExecutionContext & Props): Interpolation<Props>;
