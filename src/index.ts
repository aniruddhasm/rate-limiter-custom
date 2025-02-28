import { Request, Response, NextFunction } from "express";

interface RateLimiterOptions {
    windowMs: number;
    maxRequests: number;
}

const rateLimitMap = new Map<string, { count: number; startTime: number }>();

export function rateLimiter(options: RateLimiterOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip ?? "unknown"; // Ensure IP is always a string
        const currentTime = Date.now();

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 1, startTime: currentTime });
            return next();
        }

        const userData = rateLimitMap.get(ip)!;
        if (currentTime - userData.startTime > options.windowMs) {
            rateLimitMap.set(ip, { count: 1, startTime: currentTime });
            return next();
        }

        if (userData.count >= options.maxRequests) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }

        userData.count++;
        next();
    };
}
