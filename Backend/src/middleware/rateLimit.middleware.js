const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX = 100;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function getKey(req, keyGenerator) {
  if (typeof keyGenerator === "function") {
    return keyGenerator(req) || "unknown";
  }
  return getClientIp(req);
}

export function createRateLimiter(options = {}) {
  const windowMs = Number(options.windowMs) || DEFAULT_WINDOW_MS;
  const max = Number(options.max) || DEFAULT_MAX;
  const message = options.message || "Too many requests. Please try again later.";
  const keyGenerator = options.keyGenerator;

  const store = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = getKey(req, keyGenerator);
    const record = store.get(key);

    if (!record || now - record.windowStart >= windowMs) {
      store.set(key, { count: 1, windowStart: now });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - record.windowStart)) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(429).json({ message });
    }

    record.count += 1;
    store.set(key, record);
    return next();
  };
}
