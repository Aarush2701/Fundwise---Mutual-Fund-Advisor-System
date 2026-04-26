package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundRiskDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import com.majorproject.mfadvisor.service.analytics.RiskCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FundRiskService {

    private final MutualFundRepository mutualFundRepository;
    private final NavHistoryRepository navHistoryRepository;
    private final MfApiHistoryService mfApiHistoryService;
    private final RiskCalculatorService riskCalculatorService;

    public FundRiskDto getFundRisk(String schemeCode, String range) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        if (!Boolean.TRUE.equals(fund.getHasNav())
                || fund.getLatestNavDate() == null) {
            throw new RuntimeException("NAV data not available");
        }

        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = calculateStartDate(endDate, range);

        // ensure history
        mfApiHistoryService.loadHistory(
                schemeCode,
                startDate,
                endDate
        );

        List<NavHistory> navs =
                navHistoryRepository
                        .findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
                                fund, startDate, endDate);

        BigDecimal volatility =
                riskCalculatorService.calculateAnnualizedVolatility(navs);

        FundRiskDto dto = new FundRiskDto();
        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setVolatility(volatility);
        dto.setRiskLevel(
                riskCalculatorService.classifyRisk(volatility));

        return dto;
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
