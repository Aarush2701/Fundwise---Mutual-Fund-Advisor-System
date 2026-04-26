package com.majorproject.mfadvisor.service;
import com.majorproject.mfadvisor.dto.InvestmentCalculatorRequestDto;
import com.majorproject.mfadvisor.dto.InvestmentCalculatorResponseDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.service.MfApiHistoryService;
import com.majorproject.mfadvisor.service.analytics.CagrCalculatorService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
@Service
@RequiredArgsConstructor
public class InvestmentCalculatorService {

    private final MutualFundRepository mutualFundRepository;
    private final CagrCalculatorService cagrCalculatorService;
    private final MfApiHistoryService mfApiHistoryService;

    public InvestmentCalculatorResponseDto calculate(
            InvestmentCalculatorRequestDto request) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(request.getSchemeCode())
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        if (!Boolean.TRUE.equals(fund.getHasNav())
                || fund.getLatestNavDate() == null) {
            throw new RuntimeException("NAV data not available for this fund");
        }

        if (request.getYears() == null || request.getYears() <= 0) {
            throw new RuntimeException("Investment duration must be positive");
        }

        if (!"SIP".equalsIgnoreCase(request.getType())
                && !"LUMPSUM".equalsIgnoreCase(request.getType())) {
            throw new RuntimeException("Invalid investment type");
        }

        // 🔹 Determine date range
        LocalDate endDate = fund.getLatestNavDate();
        LocalDate startDate = endDate.minusYears(request.getYears());

        // 🔹 Ensure historical NAV exists
        mfApiHistoryService.loadHistory(
                fund.getSchemeCode(),
                startDate,
                endDate
        );

        // 🔹 Calculate CAGR
        BigDecimal cagr =
                cagrCalculatorService.calculateCagr(
                        fund, request.getYears());

        if (cagr == null) {
            throw new RuntimeException(
                    "Insufficient historical data for "
                            + request.getYears() + " years");
        }

        BigDecimal invested;
        BigDecimal finalValue;

        if ("SIP".equalsIgnoreCase(request.getType())) {

            finalValue = calculateSip(
                    request.getAmount(), cagr, request.getYears());

            invested = BigDecimal.valueOf(
                    request.getAmount() * 12L * request.getYears());

        } else {

            invested = BigDecimal.valueOf(request.getAmount());

            finalValue = calculateLumpsum(
                    request.getAmount(), cagr, request.getYears());
        }

        InvestmentCalculatorResponseDto dto =
                new InvestmentCalculatorResponseDto();

        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setType(request.getType());

        dto.setInvestedAmount(
                invested.setScale(2, RoundingMode.HALF_UP));

        dto.setExpectedValue(
                finalValue.setScale(2, RoundingMode.HALF_UP));

        dto.setTotalGains(
                finalValue.subtract(invested)
                        .setScale(2, RoundingMode.HALF_UP));

        return dto;
    }

    private BigDecimal calculateSip(
            Double monthlyAmount,
            BigDecimal cagr,
            Integer years) {

        double r = cagr.doubleValue() / 12 / 100;
        int n = years * 12;

        double fv = monthlyAmount *
                ((Math.pow(1 + r, n) - 1) / r) *
                (1 + r);

        return BigDecimal.valueOf(fv);
    }

    private BigDecimal calculateLumpsum(
            Double amount,
            BigDecimal cagr,
            Integer years) {

        double r = cagr.doubleValue() / 100;
        double fv = amount * Math.pow(1 + r, years);

        return BigDecimal.valueOf(fv);
    }
}
