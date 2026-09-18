export type Frequency = Record<string, number>;
export interface ElementStyle { tag:string; role:string|null; classes:string[]; text:string; width:number; height:number; styles:Record<string,string>; }
export interface PageCapture { url:string; title:string; viewport:{width:number;height:number}; cssVariables:Record<string,string>; mediaQueries:string[]; elements:ElementStyle[]; }
export interface Token { name:string; value:string; count:number; source:"css-variable"|"computed"; }
export interface ComponentSummary { kind:string; count:number; variants:string[]; states:string[]; }
export interface DesignSystem { meta:{source:string;generatedAt:string;generator:string;llmCalls:0;viewports:number}; tokens:{colors:Token[];typography:Token[];spacing:Token[];radii:Token[];shadows:Token[]}; breakpoints:string[]; components:ComponentSummary[]; captures:PageCapture[]; }
