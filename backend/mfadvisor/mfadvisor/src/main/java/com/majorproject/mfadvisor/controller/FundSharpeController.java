package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundSharpeDto;
import com.majorproject.mfadvisor.service.FundSharpeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundSharpeController {

    private final FundSharpeService fundSharpeService;

    @GetMapping("/{schemeCode}/sharpe")
    public FundSharpeDto getSharpeRatio(
            @PathVariable String schemeCode,
            @RequestParam String range) {

        return fundSharpeService.getSharpeRatio(
                schemeCode, range);
    }
}
