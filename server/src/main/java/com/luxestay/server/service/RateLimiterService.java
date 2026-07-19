package com.luxestay.server.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Simple in-memory sliding-window rate limiter.
 * Tracks timestamps of requests per key and rejects calls that exceed
 * the configured limit within the time window.
 */
@Service
public class RateLimiterService {

    private final ConcurrentHashMap<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    /**
     * Check whether a request identified by {@code key} is allowed.
     *
     * @param key           the rate-limit key (e.g. an email address)
     * @param maxRequests   maximum number of requests allowed in the window
     * @param windowSeconds size of the sliding window in seconds
     * @return {@code true} if the request is within limits, {@code false} if it should be rejected
     */
    public boolean isAllowed(String key, int maxRequests, long windowSeconds) {
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(windowSeconds);

        Deque<Instant> timestamps = requestLog.computeIfAbsent(
                key.toLowerCase(), k -> new ConcurrentLinkedDeque<>());

        // Evict expired entries
        while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(windowStart)) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxRequests) {
            return false;
        }

        timestamps.addLast(now);
        return true;
    }
}
