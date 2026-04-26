package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundSearchResultDto;
import com.majorproject.mfadvisor.service.FundSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundSearchController {

    private final FundSearchService fundSearchService;

    @GetMapping("/search")
    public List<FundSearchResultDto> search(
            @RequestParam String query) {

        return fundSearchService.searchFunds(query);
    }
}