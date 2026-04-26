package com.majorproject.mfadvisor.dto;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class FundRecommendationDto {

    private String schemeCode;
    private String fundName;
    private String amcName;
    private String category;

    private BigDecimal cagr;
    private BigDecimal volatility;
    private BigDecimal sharpeRatio;

    private String riskLevel;
    private String explanation;
    private Integer fundScore;
}
