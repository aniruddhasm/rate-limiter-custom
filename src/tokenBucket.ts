import { Request, Response, NextFunction } from "express";
import { RateLimiterOptions } from "./config";

const tokenBuckets = new Map<string, { tokens: number; lastRefill: number }>();

export function tokenBucketRateLimiter(options: RateLimiterOptions) {
    const tokensPerInterval = options.tokensPerInterval || options.maxRequests;

    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip ?? "unknown";
        const currentTime = Date.now();

        if (!tokenBuckets.has(ip)) {
            tokenBuckets.set(ip, { tokens: tokensPerInterval, lastRefill: currentTime });
        }

        const bucket = tokenBuckets.get(ip)!;
        const timeElapsed = currentTime - bucket.lastRefill;

        // Refill tokens based on elapsed time
        const newTokens = Math.floor(timeElapsed / options.windowMs) * tokensPerInterval;
        bucket.tokens = Math.min(bucket.tokens + newTokens, tokensPerInterval);
        bucket.lastRefill = currentTime;

        if (bucket.tokens > 0) {
            bucket.tokens--;
            return next();
        }

        return res.status(429).json({ message: options.errorMessage || "Too many requests, please try again later." });
    };
}
