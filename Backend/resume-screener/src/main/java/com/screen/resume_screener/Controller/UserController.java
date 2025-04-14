package com.screen.resume_screener.Controller;

import com.screen.resume_screener.Security.JwtUtils;
import com.screen.resume_screener.Service.LoginAuthService;
import com.screen.resume_screener.Service.RegisterAuthService;
import com.screen.resume_screener.dto.ErrorResponse;
import com.screen.resume_screener.dto.UserRequest;
import com.screen.resume_screener.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "API for login and register functions")
public class UserController {

    @Autowired
    private LoginAuthService loginAuthService;

    @Autowired
    private RegisterAuthService registerAuthService;

    @Autowired
    private JwtUtils jwtUtils;

    @Operation(summary = "Login user",
                description = "Authenticates user using username and password and returns a JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),

            @ApiResponse(responseCode = "400", description = "Bad request – missing username or password",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Username and password must be provided.\"}"
                            )
                    )
            ),

            @ApiResponse(responseCode = "401", description = "Unauthorized – invalid credentials",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Invalid credentials\"}"
                            )
                    )
            ),

            @ApiResponse(responseCode = "500", description = "Unexpected server error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Unexpected error.\"}"
                            )
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserRequest userRequest) {

        String username = userRequest.getUsername();
        String password = userRequest.getPassword();

        return loginAuthService.authenticateUser(username, password);
    }

    @Operation(summary = "Register user",
                description = "Registers a new user with username and password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),

            @ApiResponse(responseCode = "400", description = "Bad request – missing username or password",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Username and password must be provided.\"}"
                            )
                    )
            ),

            @ApiResponse(responseCode = "409", description = "Conflict – user already exists",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"User already exists.\"}"
                            )
                    )
            ),

            @ApiResponse(responseCode = "413", description = "Payload too large – username or password too long",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Username or password exceeds allowed length.\"}"
                            )
                    )
            ),

            @ApiResponse(responseCode = "500", description = "Unexpected server error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = "{\"message\": \"Unexpected error.\"}"
                            )
                    )
            )
    })
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody UserRequest userRequest) {

        String username = userRequest.getUsername();
        String password = userRequest.getPassword();

        return registerAuthService.authenticateUser(username, password, userRequest);
    }

}
