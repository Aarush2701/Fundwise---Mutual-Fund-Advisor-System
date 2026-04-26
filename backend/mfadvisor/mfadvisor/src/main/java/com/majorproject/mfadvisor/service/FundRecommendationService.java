package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundRecommendationDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class FundRecommendationService {

    private final MutualFundRepository mutualFundRepository;

    public List<FundRecommendationDto> recommend(
            String risk,
            String range) {

        return mutualFundRepository.findAll().stream()
                .filter(MutualFund::getHasNav)
                .filter(f -> f.getSharpe3y() != null)
                .peek(f ->
                        System.out.println("Fund risk: " + f.getRiskLevel())
                )
                .filter(f -> isRiskCompatible(risk, f.getRiskLevel()))
                .sorted(Comparator.comparing(
                        MutualFund::getSharpe3y,
                        Comparator.reverseOrder()))
                .limit(5)
                .map(this::mapToDto)
                .toList();

    }

    private boolean isRiskCompatible(String userRisk, String fundRisk) {

        if (userRisk == null || fundRisk == null) {
            return false;
        }

        return switch (userRisk.toUpperCase()) {
            case "AGGRESSIVE" ->
                    fundRisk.equalsIgnoreCase("HIGH")
                            || fundRisk.equalsIgnoreCase("MODERATE");

            case "MODERATE" ->
                    fundRisk.equalsIgnoreCase("MODERATE")
                            || fundRisk.equalsIgnoreCase("LOW");

            case "CONSERVATIVE" ->
                    fundRisk.equalsIgnoreCase("LOW");

            default -> false;
        };
    }



    private FundRecommendationDto mapToDto(MutualFund fund) {
        FundRecommendationDto dto = new FundRecommendationDto();
        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setAmcName(fund.getAmcName());
        dto.setCategory(fund.getCategory());
        dto.setCagr(fund.getCagr3y());
        dto.setVolatility(fund.getVolatility3y());
        dto.setSharpeRatio(fund.getSharpe3y());
        dto.setRiskLevel(fund.getRiskLevel());
        dto.setExplanation(buildExplanation(fund));
        dto.setFundScore(fund.getFundScore());
        return dto;
    }

    private String buildExplanation(MutualFund fund) {

        StringBuilder sb = new StringBuilder();

        sb.append("This ")
                .append(fund.getRiskLevel().toLowerCase())
                .append(" risk fund ");

        if (fund.getSharpe3y().doubleValue() > 0.7) {
            sb.append("offers excellent risk-adjusted returns ");
        } else if (fund.getSharpe3y().doubleValue() > 0.4) {
            sb.append("provides stable risk-adjusted performance ");
        } else {
            sb.append("has higher volatility compared to peers ");
        }

        sb.append("with a 3-year CAGR of ")
                .append(fund.getCagr3y())
                .append("%.");

        return sb.toString();
    }
}