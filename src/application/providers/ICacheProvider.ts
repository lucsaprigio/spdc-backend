export interface ICacheProvider {
    get<T>(key: string): T | undefined;
    set(key: string, value: any, ttl: number): void;
    del(key: string): void;
    flush(): void;
}