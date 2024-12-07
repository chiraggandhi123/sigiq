export interface MockServerArgs  {
    mode: "APPEND" | "WRITE" | "ANNOTATE",
    payload:{[key:string]:string | number | RegExp}
}