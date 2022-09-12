import { RuleSet } from "../types";
export declare class TailwindStyles {
    rules: RuleSet<any>;
    constructor(rules: RuleSet<any>);
    generateClasses(executionContext: Object): string;
}
