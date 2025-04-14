package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class UserRequest {

    @Schema(description = "Username of the user", example = "john23")
    private String username;

    @Schema(description = "Password of the user")
    private String password;

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

}
