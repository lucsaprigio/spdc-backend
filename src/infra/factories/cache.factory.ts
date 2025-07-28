import { NodeCacheProvider } from "../cache/NodeCacheProvider";

export function cacheFactory(ttl?: number) {
    return new NodeCacheProvider(ttl || 500)
}