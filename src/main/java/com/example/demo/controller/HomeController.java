package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/login")
    public String fazerLogin() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String homePage() {
        return "home";
    }
}