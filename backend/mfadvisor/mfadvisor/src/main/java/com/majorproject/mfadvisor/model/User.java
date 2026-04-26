package com.majorproject.mfadvisor.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    private String email;
    private String password;
    private int age;
    private double monthlyIncome;
    private int riskScore;
    private String investorType;
}
