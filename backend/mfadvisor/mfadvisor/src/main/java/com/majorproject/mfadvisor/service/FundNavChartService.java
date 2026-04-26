package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.NavChartPointDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FundNavChartService {

    private final MutualFundRepository mutualFundRepository;
    private final NavHistoryRepository navHistoryRepository;

    public List<NavChartPointDto> getNavChart(
            String schemeCode,
            String range) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        if (!Boolean.TRUE.equals(fund.getHasNav())) {
            throw new RuntimeException("NAV data not available");
        }

        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = calculateStartDate(endDate, range);

        List<NavHistory> navs =
                navHistoryRepository
                        .findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
                                fund, startDate, endDate);

        return navs.stream().map(n -> {
            NavChartPointDto dto = new NavChartPointDto();
            dto.setDate(n.getNavDate());
            dto.setNav(n.getNavValue());
            return dto;
        }).toList();
    }

    private LocalDate calculateStartDate(
            LocalDate end, String range) {

        return switch (range.toUpperCase()) {
            case "1M" -> end.minusMonths(1);
            case "6M" -> end.minusMonths(6);
            case "1Y" -> end.minusYears(1);
            case "3Y" -> end.minusYears(3);
            case "5Y" -> end.minusYears(5);
            default -> end.minusYears(1);
        };
    }
}
