package com.paulsen.wedding.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private static final String[] allowedOrigins = {
      "http://localhost:3000",
      "https://kevinlovesolivia.com",
      "https://api.kevinlovesolivia.com",
      "https://www.kevinlovesolivia.com",
      "https://www.api.kevinlovesolivia.com"
  };

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(allowedOrigins)
        .allowCredentials(true)
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*");
  }
}