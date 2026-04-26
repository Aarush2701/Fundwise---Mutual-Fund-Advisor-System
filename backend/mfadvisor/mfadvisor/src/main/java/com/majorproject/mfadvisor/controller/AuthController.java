package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.AuthResponse;
import com.majorproject.mfadvisor.dto.LoginRequest;
import com.majorproject.mfadvisor.dto.SignupRequest;
import com.majorproject.mfadvisor.model.User;
import com.majorproject.mfadvisor.repository.UserRepository;
import com.majorproject.mfadvisor.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {

        String token = authService.signup(request);

        User user = userRepository.findByEmail(request.getEmail()).get();

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        User user = userRepository.findByEmail(request.getEmail()).get();

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName()
        );
    }
}
