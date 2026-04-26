package com.majorproject.mfadvisor.dto;

import lombok.Data;

@Data
public class SignupRequest {

    private String name;
    private String email;
    private String password;

    private int age;
    private double monthlyIncome;

    // preference inputs
    private int investmentHorizon; // years
    private String investmentGoal; // WEALTH / RETIREMENT / SAVINGS
    private int marketExperience;  // 1–5
}
