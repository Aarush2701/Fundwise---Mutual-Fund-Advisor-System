package com.majorproject.mfadvisor.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class FundReturnsDto {

    private String schemeCode;
    private String fundName;

    private BigDecimal oneYearCagr;
    private BigDecimal threeYearCagr;
    private BigDecimal fiveYearCagr;
}