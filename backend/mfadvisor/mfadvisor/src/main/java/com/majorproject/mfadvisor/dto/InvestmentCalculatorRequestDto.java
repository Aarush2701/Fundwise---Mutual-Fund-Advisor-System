package com.majorproject.mfadvisor.dto;

import lombok.Data;

@Data
public class InvestmentCalculatorRequestDto {

    private String schemeCode;

    private String type;   // SIP or LUMPSUM
    private Double amount; // monthly for SIP, total for lumpsum
    private Integer years; // investment duration
}
