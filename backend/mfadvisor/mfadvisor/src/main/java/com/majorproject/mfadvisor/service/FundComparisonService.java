package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundCompareItemDto;
import com.majorproject.mfadvisor.dto.FundCompareResponseDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.service.analytics.CagrCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FundComparisonService {

    private final MutualFundRepository mutualFundRepository;
    private final CagrCalculatorService cagrCalculatorService;
    private final MfApiHistoryService mfApiHistoryService;

    public FundCompareResponseDto compareFunds(List<String> schemeCodes) {

        if (schemeCodes == null || schemeCodes.size() < 2 || schemeCodes.size() > 3) {
            throw new RuntimeException("Please compare 2 or 3 funds only");
        }

        List<FundCompareItemDto> result = new ArrayList<>();

        for (String schemeCode : schemeCodes) {

            MutualFund fund = mutualFundRepository
                    .findBySchemeCode(schemeCode)
                    .orElseThrow(() ->
                            new RuntimeException("Fund not found: " + schemeCode));

            if (!Boolean.TRUE.equals(fund.getHasNav())
                    || fund.getLatestNavDate() == null) {
                continue; // skip funds without NAV
            }

            // Ensure historical NAV exists
            LocalDate endDate = fund.getLatestNavDate();
            LocalDate startDate = endDate.minusYears(5);

            mfApiHistoryService.loadHistory(
                    schemeCode,
                    startDate,
                    endDate
            );

            FundCompareItemDto dto = new FundCompareItemDto();
            dto.setSchemeCode(fund.getSchemeCode());
            dto.setFundName(fund.getFundName());
            dto.setAmcName(fund.getAmcName());
            dto.setCategory(fund.getCategory());
            dto.setLatestNav(fund.getLatestNav());

            dto.setOneYearCagr(
                    cagrCalculatorService.calculateCagr(fund, 1));
            dto.setThreeYearCagr(
                    cagrCalculatorService.calculateCagr(fund, 3));
            dto.setFiveYearCagr(
                    cagrCalculatorService.calculateCagr(fund, 5));

            result.add(dto);
        }

        result.sort(
                Comparator.comparing(
                        FundCompareItemDto::getThreeYearCagr,
                        Comparator.nullsLast(Comparator.reverseOrder())
                )
        );

        if (!result.isEmpty() && result.get(0).getThreeYearCagr() != null) {
            result.get(0).setBestInComparison(true);
            for (int i = 1; i < result.size(); i++) {
                result.get(i).setBestInComparison(false);
            }
        }



        FundCompareResponseDto response = new FundCompareResponseDto();
        response.setFunds(result);
        return response;
    }
}
