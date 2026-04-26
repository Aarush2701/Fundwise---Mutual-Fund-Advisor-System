package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundRiskDto;
import com.majorproject.mfadvisor.service.FundRiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundRiskController {

    private final FundRiskService fundRiskService;

    @GetMapping("/{schemeCode}/risk")
    public FundRiskDto getFundRisk(
            @PathVariable String schemeCode,
            @RequestParam String range) {

        return fundRiskService.getFundRisk(
                schemeCode, range);
    }
}
