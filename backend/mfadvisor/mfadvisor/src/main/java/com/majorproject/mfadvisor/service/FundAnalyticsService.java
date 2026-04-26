package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundReturnsDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.service.analytics.CagrCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FundAnalyticsService {

    private final MutualFundRepository mutualFundRepository;
    private final CagrCalculatorService cagrCalculatorService;
    private final MfApiHistoryService mfApiHistoryService;

    public FundReturnsDto getFundReturns(String schemeCode) {

        // 1️⃣ Fetch fund first
        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        // 2️⃣ Validate NAV availability
        if (!Boolean.TRUE.equals(fund.getHasNav())
                || fund.getLatestNavDate() == null) {
            throw new RuntimeException("NAV data not available for this fund");
        }

        // 3️⃣ Determine history range
        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = endDate.minusYears(5);

        // 4️⃣ Load historical NAV (idempotent & cached)
        mfApiHistoryService.loadHistory(
                schemeCode,
                startDate,
                endDate
        );

        // 5️⃣ Calculate returns
        FundReturnsDto dto = new FundReturnsDto();
        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());

        dto.setOneYearCagr(
                cagrCalculatorService.calculateCagr(fund, 1));
        dto.setThreeYearCagr(
                cagrCalculatorService.calculateCagr(fund, 3));
        dto.setFiveYearCagr(
                cagrCalculatorService.calculateCagr(fund, 5));

        return dto;
    }
}
