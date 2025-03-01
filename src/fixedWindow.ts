import { Request, Response, NextFunction } from "express";
import { RateLimiterOptions } from "./config";

const requestCounts = new Map<string, number>();

export function fixedWindowRateLimiter(options: RateLimiterOptions) {
    setInterval(() => {
        requestCounts.clear(); // Reset every windowMs
    }, options.windowMs);

    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip ?? "unknown";

        const currentCount = requestCounts.get(ip) || 0;
        if (currentCount >= options.maxRequests) {
            return res.status(429).json({ message: options.errorMessage || "Too many requests, please try again later." });
        }

        requestCounts.set(ip, currentCount + 1);
        next();
    };
}
