package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundDetailsDto;
import com.majorproject.mfadvisor.service.FundDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundDetailsController {

    private final FundDetailsService fundDetailsService;

    @GetMapping("/{schemeCode}/details")
    public FundDetailsDto getDetails(
            @PathVariable String schemeCode) {

        return fundDetailsService.getFundDetails(schemeCode);
    }
}