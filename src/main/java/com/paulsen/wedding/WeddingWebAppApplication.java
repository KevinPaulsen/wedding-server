package com.paulsen.wedding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages="com.paulsen.wedding") public class WeddingWebAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeddingWebAppApplication.class, args);
    }
}
