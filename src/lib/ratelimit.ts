import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"

// Sliding window limiter: 10 requests per 10 seconds default
export const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})

// Strict limiter for authentication & credential stuffing: 5 requests per 60 seconds
export const authRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:auth",
})

// Strict limiter for file uploads / B2B submissions: 3 requests per 60 seconds
export const submissionRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:submission",
})

// Strict limiter for account creation to prevent automated signup spam: 5 requests per 60 seconds
export const signupRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:signup",
})

// Limiter for the public contact form to prevent spam/abuse: 3 requests per 60 seconds
export const contactRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:contact",
})