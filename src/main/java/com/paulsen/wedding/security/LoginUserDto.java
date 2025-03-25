package com.paulsen.wedding.security;

public class LoginUserDto {

  private String username;
  private String password;

  public String getUsername() {
    return username.toLowerCase();
  }

  public void setUsername(String username) {
    this.username = username.toLowerCase();
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
