import NodeCache from "node-cache";
import { ICacheProvider } from "@/application/providers/ICacheProvider";

export class NodeCacheProvider implements ICacheProvider {
    private cache: NodeCache;

    constructor(ttlSeconds: number = 300) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds })
    }

    get<T>(key: string): T | undefined {
        return this.cache.get(key);
    }

    set(key: string, value: any, ttl: number): void {
        this.cache.set(key, value, ttl);
    }

    del(key: string): void {
        this.cache.del(key);
    }

    flush(): void {
        this.cache.flushAll();
    }
}