package com.majorproject.mfadvisor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FundDetailsDto {

    private String schemeCode;
    private String fundName;
    private String amcName;
    private String category;
    private String schemeType;

    private BigDecimal latestNav;
    private LocalDate latestNavDate;

    private BigDecimal cagr1y;
    private BigDecimal cagr3y;
    private BigDecimal cagr5y;

    private BigDecimal volatility3y;
    private BigDecimal sharpe3y;

    private String riskLevel;
    private Integer fundScore;

    private String explanation;
}
