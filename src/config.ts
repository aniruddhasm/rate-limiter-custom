export interface RateLimiterOptions {
    windowMs: number;
    maxRequests: number;
    algo?: "sliding" | "fixed" | "token"; // Default: "sliding"
    tokensPerInterval?: number; // Required for token bucket
    leakRate?: number; // Only for Leaky Bucket
    errorMessage?: string; // Custom error message
}
