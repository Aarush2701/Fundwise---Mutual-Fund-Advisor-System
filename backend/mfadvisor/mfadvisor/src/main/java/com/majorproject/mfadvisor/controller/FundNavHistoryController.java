package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.NavHistoryPointDto;
import com.majorproject.mfadvisor.service.FundNavHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundNavHistoryController {

    private final FundNavHistoryService fundNavHistoryService;

    @GetMapping("/{schemeCode}/nav-history")
    public List<NavHistoryPointDto> getNavHistory(
            @PathVariable String schemeCode,
            @RequestParam String range) {

        return fundNavHistoryService.getNavHistory(
                schemeCode, range);
    }
}
