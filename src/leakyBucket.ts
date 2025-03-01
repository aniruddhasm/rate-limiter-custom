import { Request, Response, NextFunction } from "express";
import { RateLimiterOptions } from "./config";

const leakyBuckets = new Map<string, { queue: number; lastProcessed: number }>();


export function leakyBucketLimiter(options: RateLimiterOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip ?? "unknown"; // Ensure IP is always a string
	    const leakRate = options.leakRate ?? 1; // Requests processed per second

	    if (!leakyBuckets.has(ip)) {
	        leakyBuckets.set(ip, { queue: 0, lastProcessed: currentTime });
	    }

	    const bucket = leakyBuckets.get(ip)!;
	    const timeElapsed = (currentTime - bucket.lastProcessed) / 1000; // Convert ms to seconds
	    const leakedRequests = Math.floor(timeElapsed * leakRate);

	    bucket.queue = Math.max(0, bucket.queue - leakedRequests);
	    bucket.lastProcessed = currentTime;

	    if (bucket.queue >= options.maxRequests) {
            return res.status(429).json({ message: options.errorMessage || "Too many requests, please try again later." });
	    }

	    bucket.queue++;
	    next();
    };
}
