import { RateLimiterOptions } from "./config";
import { slidingWindowRateLimiter } from "./slidingWindow";
import { fixedWindowRateLimiter } from "./fixedWindow";
import { tokenBucketRateLimiter } from "./tokenBucket";

export function rateLimiter(options: RateLimiterOptions) {
    const algorithm = options.algo || "sliding"; // Default to sliding window

    switch (algorithm) {
        case "fixed":
            return fixedWindowRateLimiter(options);
        case "token":
            return tokenBucketRateLimiter(options);
        case "leaky":
            return leakyBucketLimiter(options);  
        default:
            return slidingWindowRateLimiter(options);
    }
}
