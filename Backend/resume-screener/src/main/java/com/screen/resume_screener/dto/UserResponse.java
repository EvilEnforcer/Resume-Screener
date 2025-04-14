package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public class UserResponse {

    @Schema(description = "Jwt Token", example = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN0ZXIyIiwiaWF0IjoxNzQ0NTY1Njk1LCJle" +
            "HAiOjE3NDQ1NjkyOTV9.aEObtyTI6KbiEzelROgn-Zy1pPk3gQkIBN8rZChJfTjNFuL1uN-Sr5wGUG8_5h_W")
    private String jwtToken;

    @Schema(description = "Username of the user", example = "john23")
    private String username;

    @Schema(description = "Role of the user", example = "admin")
    private List<String> roles;

    public UserResponse(String username, List<String> roles, String jwtToken) {
        this.username = username;
        this.roles = roles;
        this.jwtToken = jwtToken;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getRoles() {
        return roles;
    }
}
