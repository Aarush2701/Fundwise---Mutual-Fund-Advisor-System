package com.majorproject.mfadvisor.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FundRiskDto {

    private String schemeCode;
    private String fundName;

    private BigDecimal volatility; // annualized %
    private String riskLevel;       // LOW / MODERATE / HIGH
}
