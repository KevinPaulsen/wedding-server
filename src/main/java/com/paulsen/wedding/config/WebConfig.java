package com.paulsen.wedding.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    @EnableWebMvc
    public class WebConfig implements WebMvcConfigurer {

        private static final String[] allowedOrigins = {
                "http://localhost:3000",
                "https://d32ajgyhym5hws.cloudfront.net",
                "https://master.d17kqty0y5q092.amplifyapp.com"
        };

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins(allowedOrigins)
                    .allowCredentials(true)
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specify allowed methods
                    .allowedHeaders("*"); // Optionally specify allowed headers
        }
    }