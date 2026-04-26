package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.LoginRequest;
import com.majorproject.mfadvisor.dto.SignupRequest;
import com.majorproject.mfadvisor.model.User;
import com.majorproject.mfadvisor.repository.UserRepository;
import com.majorproject.mfadvisor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RiskProfilingService riskProfilingService;

    // -------- SIGNUP --------
    public String signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

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

        return jwtUtil.generateToken(user.getEmail());
    }

    // -------- LOGIN --------
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Google user case
        if (user.getPassword() == null) {
            throw new RuntimeException("Use Google Sign-In for this account");
        }

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}
