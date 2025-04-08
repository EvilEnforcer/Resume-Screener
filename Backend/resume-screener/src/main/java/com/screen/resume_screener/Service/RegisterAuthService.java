package com.screen.resume_screener.Service;

import com.screen.resume_screener.Security.JwtUtils;
import com.screen.resume_screener.dto.ErrorResponse;
import com.screen.resume_screener.dto.UserRequest;
import com.screen.resume_screener.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;

@Service
public class RegisterAuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> authenticateUser(String username, String password, UserRequest userRequest) {

        Authentication authentication;

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Username and password must be provided."));
        }

        if (username.length() > 50 || password.length() > 100) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(new ErrorResponse("Username or password exceeds allowed length."));
        }

        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);

        if (userDetailsManager.userExists(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("User already exists."));
        }

        UserDetails user = User.withUsername(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .roles("USER") // default role
                .build();

        userDetailsManager.createUser(user);


        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(username, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return ResponseEntity.ok(new UserResponse(userDetails.getUsername(), roles, jwtToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Unexpected error."));
        }
    }

}
