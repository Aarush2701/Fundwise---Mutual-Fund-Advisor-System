package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundSharpeDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import com.majorproject.mfadvisor.service.analytics.CagrCalculatorService;
import com.majorproject.mfadvisor.service.analytics.RiskCalculatorService;
import com.majorproject.mfadvisor.service.analytics.SharpeRatioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FundSharpeService {

    private final MutualFundRepository mutualFundRepository;
    private final CagrCalculatorService cagrCalculatorService;
    private final RiskCalculatorService riskCalculatorService;
    private final MfApiHistoryService mfApiHistoryService;
    private final SharpeRatioService sharpeRatioService;
    private final NavHistoryRepository navHistoryRepository;

    public FundSharpeDto getSharpeRatio(
            String schemeCode,
            String range) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        if (!Boolean.TRUE.equals(fund.getHasNav())
                || fund.getLatestNavDate() == null) {
            throw new RuntimeException("NAV data not available");
        }

        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = calculateStartDate(endDate, range);

        // Ensure history exists
        mfApiHistoryService.loadHistory(
                schemeCode, startDate, endDate);

        // Returns (CAGR)
        int years = extractYears(range);
        BigDecimal annualReturn =
                cagrCalculatorService.calculateCagr(fund, years);

        // Volatility
        BigDecimal volatility =
                riskCalculatorService.calculateAnnualizedVolatility(
                        navHistoryRepository
                                .findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
                                        fund, startDate, endDate));

        BigDecimal sharpe =
                sharpeRatioService.calculateSharpeRatio(
                        annualReturn, volatility);

        FundSharpeDto dto = new FundSharpeDto();
        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setSharpeRatio(sharpe);
        dto.setPerformance(
                sharpeRatioService.classifySharpe(sharpe));

        return dto;
    }

    private int extractYears(String range) {
        return switch (range.toUpperCase()) {
            case "1Y" -> 1;
            case "3Y" -> 3;
            case "5Y" -> 5;
            default -> 1;
        };
    }

    private LocalDate calculateStartDate(LocalDate endDate, String range) {
        return switch (range.toUpperCase()) {
            case "1M" -> endDate.minusMonths(1);
            case "6M" -> endDate.minusMonths(6);
            case "1Y" -> endDate.minusYears(1);
            case "3Y" -> endDate.minusYears(3);
            case "5Y" -> endDate.minusYears(5);
            default -> throw new RuntimeException("Invalid range");
        };
    }
}
