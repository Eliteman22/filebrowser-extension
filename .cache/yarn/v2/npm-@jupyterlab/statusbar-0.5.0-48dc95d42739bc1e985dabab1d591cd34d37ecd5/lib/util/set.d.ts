export declare namespace SetExt {
    function union<T>(a: Set<T>, b: Set<T>): Set<T>;
    function intersection<T>(a: Set<T>, b: Set<T>): Set<T>;
    function difference<T>(a: Set<T>, b: Set<T>): Set<T>;
    function addAll<T>(set: Set<T>, values: T[]): void;
    function deleteAll<T>(set: Set<T>, values: T[]): void;
}
