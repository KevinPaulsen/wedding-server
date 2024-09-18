package com.paulsen.wedding;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class WebController {
    @GetMapping("/") 
    public String getMessage()
    {
        return "r u coming to the wedding? yes ... or no?";
    }
}
