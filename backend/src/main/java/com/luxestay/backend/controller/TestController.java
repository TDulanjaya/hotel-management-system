package com.luxestay.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "LuxeStay Backend is running!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "Test API is working!";
    }
}
