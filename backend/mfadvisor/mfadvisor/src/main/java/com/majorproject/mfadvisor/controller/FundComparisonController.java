package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundCompareRequestDto;
import com.majorproject.mfadvisor.dto.FundCompareResponseDto;
import com.majorproject.mfadvisor.service.FundComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundComparisonController {

    private final FundComparisonService fundComparisonService;

    @PostMapping("/compare")
    public FundCompareResponseDto compareFunds(
            @RequestBody FundCompareRequestDto request) {

        return fundComparisonService.compareFunds(
                request.getSchemeCodes());
    }
}
