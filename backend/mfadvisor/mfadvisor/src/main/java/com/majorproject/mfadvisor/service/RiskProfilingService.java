package com.majorproject.mfadvisor.service;

import org.springframework.stereotype.Service;

@Service
public class RiskProfilingService {

    public int calculateRiskScore(
            int age,
            double income,
            int horizon,
            int experience) {

        int score = 0;

        // Age factor
        if (age < 30) score += 30;
        else if (age < 45) score += 20;
        else score += 10;

        // Income factor
        if (income > 50000) score += 25;
        else if (income > 30000) score += 15;
        else score += 5;

        // Horizon factor
        if (horizon >= 5) score += 25;
        else if (horizon >= 3) score += 15;
        else score += 5;

        // Experience factor
        score += experience * 4; // max 20

        return Math.min(score, 100);
    }

    public String classifyInvestor(int riskScore) {

        if (riskScore >= 70) return "AGGRESSIVE";
        if (riskScore >= 40) return "MODERATE";
        return "CONSERVATIVE";
    }
}