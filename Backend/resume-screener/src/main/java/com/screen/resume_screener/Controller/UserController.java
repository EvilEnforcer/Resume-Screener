package com.screen.resume_screener.Controller;

import com.screen.resume_screener.Security.JwtUtils;
import com.screen.resume_screener.Service.LoginAuthService;
import com.screen.resume_screener.Service.RegisterAuthService;
import com.screen.resume_screener.dto.UserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private LoginAuthService loginAuthService;

    @Autowired
    private RegisterAuthService registerAuthService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserRequest userRequest) {

        String username = userRequest.getUsername();
        String password = userRequest.getPassword();

        return loginAuthService.authenticateUser(username, password);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody UserRequest userRequest) {

        String username = userRequest.getUsername();
        String password = userRequest.getPassword();

        return registerAuthService.authenticateUser(username, password, userRequest);
    }

}
