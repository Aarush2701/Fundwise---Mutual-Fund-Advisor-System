package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.NavChartPointDto;
import com.majorproject.mfadvisor.service.FundNavChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundNavChartController {

    private final FundNavChartService navChartService;

    @GetMapping("/{schemeCode}/nav-chart")
    public List<NavChartPointDto> getNavChart(
            @PathVariable String schemeCode,
            @RequestParam String range) {

        return navChartService.getNavChart(schemeCode, range);
    }
}
