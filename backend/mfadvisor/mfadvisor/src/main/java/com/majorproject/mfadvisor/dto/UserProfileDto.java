package com.majorproject.mfadvisor.dto;

import com.majorproject.mfadvisor.model.User;
import lombok.Data;

@Data
public class UserProfileDto {

    private String name;
    private String email;
    private int age;
    private double monthlyIncome;
    private int riskScore;
    private String investorType;

    public static UserProfileDto from(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setMonthlyIncome(user.getMonthlyIncome());
        dto.setRiskScore(user.getRiskScore());
        dto.setInvestorType(user.getInvestorType());
        return dto;
    }
}
