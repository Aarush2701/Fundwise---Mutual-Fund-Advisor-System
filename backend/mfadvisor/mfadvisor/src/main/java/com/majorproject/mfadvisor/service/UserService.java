package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.UserProfileDto;
import com.majorproject.mfadvisor.dto.UserUpdateRequest;
import com.majorproject.mfadvisor.model.User;
import com.majorproject.mfadvisor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CurrentUserService currentUserService;
    private final RiskProfilingService riskProfilingService;
    private final UserRepository userRepository;

    public UserProfileDto getProfile() {

        User user = currentUserService.getCurrentUser();
        return UserProfileDto.from(user);
    }

    public UserProfileDto updateProfile(UserUpdateRequest request) {

        User user = currentUserService.getCurrentUser();

        user.setName(request.getName());
        user.setAge(request.getAge());
        user.setMonthlyIncome(request.getMonthlyIncome());

        int riskScore =
                riskProfilingService.calculateRiskScore(
                        request.getAge(),
                        request.getMonthlyIncome(),
                        request.getInvestmentHorizon(),
                        request.getMarketExperience()
                );

        String investorType =
                riskProfilingService.classifyInvestor(riskScore);

        user.setRiskScore(riskScore);
        user.setInvestorType(investorType);

        userRepository.save(user);

        return UserProfileDto.from(user);
    }

    public void deleteAccount() {

        User user = currentUserService.getCurrentUser();
        userRepository.delete(user);
    }
}
