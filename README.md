# Rate Limiter for Express (TypeScript)

A simple rate-limiter middleware for Express applications written in TypeScript. It helps prevent excessive requests from clients by limiting requests per IP within a specific time window.

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
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(3000, () => console.log("Server running on port 3000"));

```

## **Options**  

| Option       | Type   | Description                                         | Default       |
|-------------|--------|-----------------------------------------------------|--------------|
| `windowMs`  | number | Time window in milliseconds                         | `60000` (1 min) |
| `maxRequests` | number | Maximum requests allowed per IP within the window  | `10`         |




## How It Works

The middleware tracks incoming requests by IP address.
If an IP exceeds the allowed number of requests within the time window, a 429 Too Many Requests response is sent.
After the time window expires, the request count resets.


## Error Handling

If a client exceeds the allowed requests, they will receive:
```
{
  "message": "Too many requests, please try again later."
}

```

## License

[MIT](./LICENSE)

