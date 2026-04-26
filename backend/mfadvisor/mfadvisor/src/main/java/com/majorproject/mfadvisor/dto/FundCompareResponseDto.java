package com.majorproject.mfadvisor.dto;

import lombok.Data;

import java.util.List;

@Data
public class FundCompareResponseDto {
    private List<FundCompareItemDto> funds;
}
