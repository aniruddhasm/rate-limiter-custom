# Rate Limiter for Express (TypeScript)

A simple **rate-limiter middleware** for Express applications written in **TypeScript**.  
It supports the **Sliding Window Algorithm**, **Fixed Window Algorithm**, **Token Bucket Algorithm**, and **Leaky Bucket Algorithm** for rate limiting.



## Supported Algorithms

- **Sliding Window Algorithm (Default)**:  
  Efficiently tracks and limits requests per IP, ensuring a smooth distribution of allowed requests within a given time frame.  
  Unlike the fixed window approach, it dynamically adjusts the request count, providing a more balanced rate-limiting mechanism.

- **Fixed Window Algorithm**:  
  Enforces a strict request limit within a fixed time window, making it simple and predictable.  
  This method resets counters at the start of each window.

- **Token Bucket Algorithm**:  
  Uses a token-based system where requests consume tokens.  
  Tokens regenerate at a fixed rate, allowing for bursts of requests while preventing sustained high traffic.

- **Leaky Bucket Algorithm**:  
  Processes requests at a constant rate, preventing sudden surges in traffic.  
  If requests arrive faster than they can be processed, excess requests are discarded, mimicking a "leaky bucket" effect.

By default, the middleware uses the **Sliding Window Algorithm**, but you can switch to **Fixed Window**, **Token Bucket**, or **Leaky Bucket Algorithm** by specifying it in the configuration.



## Installation

```
npm install rate-limiter-custom
```



## Usage
## Basic Example

```
import express, { Request, Response } from "express";
import { rateLimiter } from "rate-limiter-custom";

const app = express();

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute per IP
  errorMessage: "Too many attempts! Please wait a moment.", // optional
});

// Use fixed window explicitly
//  const limiter = rateLimiter({
//  windowMs: 60 * 1000, // 1 minute
//  maxRequests: 10, // 10 requests per minute per IP
//  algo: "fixed" // Optional parameter. If not passed the default is sliding window
// });

// Token Bucket (with token refill)
//  const limiter = rateLimiter({
//  windowMs: 60 * 1000, // 1 minute
//  maxRequests: 10, // 10 requests per minute per IP
//  algo: "token" // Optional parameter. If not passed the default is sliding window
//  tokensPerInterval: 5 // Mandatory parameter, if algo is token
// });

// Leaky Bucket (with token refill)
//  const limiter = rateLimiter({
//  windowMs: 60 * 1000, // 1 minute
//  maxRequests: 10, // 10 requests per minute per IP
//  algo: "leaky" // Optional parameter. If not passed the default is sliding window
//  leakRate: 2 // Process 2 requests Mandatory parameter, if algo is leaky
// });


app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(3000, () => console.log("Server running on port 3000"));

```



## **Options**  

| Option             | Type    | Description                                                     | Default         |
|--------------------|---------|-----------------------------------------------------------------|-----------------|
| `windowMs`        | number  | Time window in milliseconds                                     | `60000` (1 min) |
| `maxRequests`     | number  | Maximum requests allowed per IP within the window              | `10`            |
| `algo`            | string  | Rate-limiting algorithm to use: `"sliding"`, `"fixed"`, `"token"`, `"leaky"` | `"sliding"`    |
| `tokensPerInterval` | number | Number of tokens added per interval (only for Token Bucket)    | `maxRequests`   |
| `leakRate`        | number  | Number of requests processed per second (only for Leaky Bucket) | `maxRequests / windowMs` |
| `errorMessage`    | string  | Custom error message when rate limit is exceeded               | `"Too many requests, please try again later."` |



## **How It Works**  

The middleware tracks incoming requests based on the selected rate-limiting algorithm:  

### **1️⃣ Sliding Window Algorithm (Default)**  
- Requests are counted within a rolling time window.  
- Older requests gradually expire, allowing a more dynamic flow.  
- If an IP exceeds the allowed requests within the window, a `429 Too Many Requests` response is sent.  

### **2️⃣ Fixed Window Algorithm**  
- Requests are grouped into fixed time slots (e.g., every 1 minute).  
- If an IP exceeds the request limit within a slot, further requests are blocked until the next slot starts.  
- Less flexible than Sliding Window but simpler to implement.  

### **3️⃣ Token Bucket Algorithm**  
- Each IP gets a "bucket" with a limited number of tokens.  
- Every request consumes a token; tokens regenerate over time.  
- If the bucket is empty, requests are blocked with a `429 Too Many Requests` response.  
- Suitable for APIs that need to handle sudden request bursts efficiently.  

### **4️⃣ Leaky Bucket Algorithm**  
- Requests are added to a queue (bucket), which processes them at a fixed rate.  
- If too many requests arrive too quickly, the bucket overflows, and excess requests are dropped (blocked with `429 Too Many Requests`).  
- Ensures a steady flow of requests instead of handling them in bursts.  
- Ideal for APIs that require smooth request distribution to prevent sudden spikes in traffic.  

After the time window expires (or tokens are refilled, or requests are processed), new requests are allowed based on the chosen algorithm. 🚀



## Error Handling

If a client exceeds the allowed requests, they will receive:
```
{
  "message": "Too many requests, please try again later."
}

```
You can customize the error message using the errorMessage option.



## License

[MIT](./LICENSE)