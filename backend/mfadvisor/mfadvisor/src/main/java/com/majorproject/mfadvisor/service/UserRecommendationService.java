package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundRecommendationDto;
import com.majorproject.mfadvisor.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserRecommendationService {

    private final CurrentUserService currentUserService;
    private final FundRecommendationService fundRecommendationService;

    public List<FundRecommendationDto> recommendForCurrentUser() {

        User user = currentUserService.getCurrentUser();

        String risk = user.getInvestorType(); // CONSERVATIVE / MODERATE / AGGRESSIVE
        String range = "3Y";                  // fixed for now
        System.out.println("User risk: " + user.getInvestorType());
        return fundRecommendationService.recommend(risk, range);
    }
}
