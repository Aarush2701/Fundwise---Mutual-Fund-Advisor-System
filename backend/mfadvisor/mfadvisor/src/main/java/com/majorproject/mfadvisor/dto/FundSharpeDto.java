package com.majorproject.mfadvisor.dto;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundSharpeDto {

    private String schemeCode;
    private String fundName;

    private BigDecimal sharpeRatio;
    private String performance; // EXCELLENT / GOOD / AVERAGE / POOR
}
