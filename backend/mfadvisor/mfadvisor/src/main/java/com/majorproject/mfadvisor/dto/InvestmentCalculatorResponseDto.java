package com.majorproject.mfadvisor.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvestmentCalculatorResponseDto {

    private String schemeCode;
    private String fundName;
    private String type;

    private BigDecimal investedAmount;
    private BigDecimal expectedValue;
    private BigDecimal totalGains;
}
