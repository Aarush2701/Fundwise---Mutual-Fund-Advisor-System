package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundDetailsDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FundDetailsService {

    private final MutualFundRepository mutualFundRepository;

    public FundDetailsDto getFundDetails(String schemeCode) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        FundDetailsDto dto = new FundDetailsDto();

        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setAmcName(fund.getAmcName());
        dto.setCategory(fund.getCategory());
        dto.setSchemeType(fund.getSchemeType());

        dto.setLatestNav(fund.getLatestNav());
        dto.setLatestNavDate(fund.getLatestNavDate());

        dto.setCagr1y(fund.getCagr1y());
        dto.setCagr3y(fund.getCagr3y());
        dto.setCagr5y(fund.getCagr5y());

        dto.setVolatility3y(fund.getVolatility3y());
        dto.setSharpe3y(fund.getSharpe3y());

        dto.setRiskLevel(fund.getRiskLevel());
        dto.setFundScore(fund.getFundScore());

        dto.setExplanation(buildExplanation(fund));

        return dto;
    }

    private String buildExplanation(MutualFund fund) {

        if (fund.getFundScore() == null) {
            return "Insufficient historical data to generate analytics.";
        }

        return "This " + fund.getRiskLevel().toLowerCase()
                + " risk fund has a fund score of "
                + fund.getFundScore()
                + " based on strong risk-adjusted performance.";
    }
}
