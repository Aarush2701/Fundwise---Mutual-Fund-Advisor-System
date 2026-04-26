package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.FundRecommendationDto;
import com.majorproject.mfadvisor.service.FundRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundRecommendationController {

    private final FundRecommendationService recommendationService;
    // Generic fund recommendation API (non-user-specific)
    @GetMapping("/recommendations")
    public List<FundRecommendationDto> recommendFunds(
            @RequestParam String risk,
            @RequestParam String range) {

        if (!List.of("LOW", "MODERATE", "HIGH").contains(risk.toUpperCase())) {
            throw new RuntimeException("Invalid risk level");
        }

        if (!List.of("1Y", "3Y", "5Y").contains(range.toUpperCase())) {
            throw new RuntimeException("Invalid range");
        }

        return recommendationService.recommend(
                risk.toUpperCase(),
                range.toUpperCase());
    }
}
