package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.NavHistoryPointDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FundNavHistoryService {

    private final MutualFundRepository mutualFundRepository;
    private final NavHistoryRepository navHistoryRepository;
    private final MfApiHistoryService mfApiHistoryService;

    public List<NavHistoryPointDto> getNavHistory(
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

        // Load missing history if needed
        mfApiHistoryService.loadHistory(
                schemeCode,
                startDate,
                endDate
        );

        List<NavHistory> navs =
                navHistoryRepository
                        .findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
                                fund, startDate, endDate);

        return navs.stream()
                .map(nav -> {
                    NavHistoryPointDto dto = new NavHistoryPointDto();
                    dto.setDate(nav.getNavDate());
                    dto.setNav(nav.getNavValue());
                    return dto;
                })
                .collect(Collectors.toList());
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
