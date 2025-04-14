package com.screen.resume_screener.Controller;

import com.screen.resume_screener.Security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Tester", description = "Test API for user roles")
public class TesterController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/hello")
    @Operation(summary = "Basic test",
                description = "Test to see if application is running, along with authentication")
    public String greet() {
        return "Hello";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    @Operation(summary = "User role test",
                description = "Test to see if the user role is working")
    public String userEnd() {
        return "Hello User";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    @Operation(summary = "Admin role test",
            description = "Test to see if the admin role is working")
    public String adminEnd() {
        return "Hello Admin";
    }

}
