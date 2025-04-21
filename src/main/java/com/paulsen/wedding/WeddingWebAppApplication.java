package com.paulsen.wedding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages="com.paulsen.wedding")
@EnableAsync
public class WeddingWebAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeddingWebAppApplication.class, args);
    }
}
