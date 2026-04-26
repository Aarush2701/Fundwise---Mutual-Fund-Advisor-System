package com.majorproject.mfadvisor.dto;



import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundCompareItemDto {

    private String schemeCode;
    private String fundName;
    private String amcName;
    private String category;

    private BigDecimal latestNav;

    private BigDecimal oneYearCagr;
    private BigDecimal threeYearCagr;
    private BigDecimal fiveYearCagr;

    private Boolean bestInComparison;
    private BigDecimal sharpeRatio;

}
