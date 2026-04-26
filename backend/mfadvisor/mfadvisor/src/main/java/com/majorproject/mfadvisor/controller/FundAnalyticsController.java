package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundReturnsDto;
import com.majorproject.mfadvisor.service.FundAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundAnalyticsController {

    private final FundAnalyticsService fundAnalyticsService;

    @GetMapping("/{schemeCode}/returns")
    public FundReturnsDto getFundReturns(
            @PathVariable String schemeCode) {

        return fundAnalyticsService.getFundReturns(schemeCode);
    }
}
