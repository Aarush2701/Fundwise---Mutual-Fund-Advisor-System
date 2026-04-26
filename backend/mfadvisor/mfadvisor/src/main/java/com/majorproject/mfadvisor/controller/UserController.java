package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.UserProfileDto;
import com.majorproject.mfadvisor.dto.UserUpdateRequest;
import com.majorproject.mfadvisor.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public UserProfileDto getProfile() {
        return userService.getProfile();
    }

    @PutMapping
    public UserProfileDto updateProfile(
            @RequestBody UserUpdateRequest request) {
        return userService.updateProfile(request);
    }

    @DeleteMapping
    public void deleteAccount() {
        userService.deleteAccount();
    }
}
