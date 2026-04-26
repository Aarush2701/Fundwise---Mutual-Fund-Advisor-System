package com.majorproject.mfadvisor.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {

    private String name;
    private int age;
    private double monthlyIncome;

    private int investmentHorizon;
    private int marketExperience;
    private String investmentGoal;
}
