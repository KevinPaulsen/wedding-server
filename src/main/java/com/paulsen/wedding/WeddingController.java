package com.paulsen.wedding;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WeddingController {
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }

    @GetMapping("/rsvp")
    public String rsvp() {
        return "rsvp";
    }

    @PostMapping("/submit-rsvp")
    public String summitRsvp(@RequestParam String name, @RequestParam String email, @RequestParam String attending, Model model) {
        // Process RSVP data, e.g., save to database

        // Add data to model for confirmation page
        model.addAttribute("name", name);
        model.addAttribute("email", email);
        model.addAttribute("attending", attending);
        return "success";
    }
}
