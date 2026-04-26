package com.majorproject.mfadvisor.dto;



import lombok.Data;

import java.util.List;

@Data
public class FundCompareRequestDto {
    private List<String> schemeCodes;
}
