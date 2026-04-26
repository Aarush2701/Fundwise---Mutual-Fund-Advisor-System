package com.majorproject.mfadvisor.service.analytics;

import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CagrCalculatorService {

    private final NavHistoryRepository navHistoryRepository;

    public BigDecimal calculateCagr(MutualFund fund, int years) {

        List<NavHistory> navs =
                navHistoryRepository.findByMutualFundOrderByNavDateAsc(fund);

        if (navs.size() < 2) {
            return null; // Not enough data
        }

        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = endDate.minusYears(years);

        NavHistory startNav = null;
        NavHistory endNav = null;

        for (NavHistory nav : navs) {

            // find closest NAV on or before startDate
            if (!nav.getNavDate().isAfter(startDate)) {
                startNav = nav;
            }

            // find closest NAV on or before endDate
            if (!nav.getNavDate().isAfter(endDate)) {
                endNav = nav;
            }
        }

        if (startNav == null || endNav == null) {
            return null; // Insufficient history
        }

        BigDecimal beginningNav = startNav.getNavValue();
        BigDecimal endingNav = endNav.getNavValue();

        long days =
                ChronoUnit.DAYS.between(startNav.getNavDate(), endNav.getNavDate());

        double actualYears = days / 365.0;

        double cagr =
                Math.pow(
                        endingNav.doubleValue() / beginningNav.doubleValue(),
                        1 / actualYears
                ) - 1;

        return BigDecimal.valueOf(cagr * 100)
                .setScale(2, RoundingMode.HALF_UP); // percentage
    }
}
