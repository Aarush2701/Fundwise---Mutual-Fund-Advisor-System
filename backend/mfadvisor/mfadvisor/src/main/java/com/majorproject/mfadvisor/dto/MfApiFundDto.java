package com.majorproject.mfadvisor.dto;

import lombok.Data;

@Data
public class MfApiFundDto {

    private String schemeCode;
    private String schemeName;
    private String fundHouse;
    private String schemeType;
    private String schemeCategory;
    private String isinGrowth;
    private String isinDivReinvestment;
}
