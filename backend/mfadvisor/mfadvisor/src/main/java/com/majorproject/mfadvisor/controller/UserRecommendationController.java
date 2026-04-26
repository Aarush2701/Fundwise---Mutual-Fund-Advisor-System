package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundRecommendationDto;
import com.majorproject.mfadvisor.service.UserRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserRecommendationController {

    private final UserRecommendationService userRecommendationService;
    // User-specific personalized recommendations
    @GetMapping("/recommendations")
    public List<FundRecommendationDto> getMyRecommendations() {
        return userRecommendationService.recommendForCurrentUser();
    }
}
