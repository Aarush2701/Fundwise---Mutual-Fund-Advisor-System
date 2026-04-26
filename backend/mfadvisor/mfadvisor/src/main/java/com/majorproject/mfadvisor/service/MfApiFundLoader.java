package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.MfApiFundDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class MfApiFundLoader {

    private static final String MFAPI_URL =
            "https://api.mfapi.in/mf/latest";

    private final MutualFundRepository mutualFundRepository;

    //@Scheduled(cron = "0 */1 * * * ?")
    @Scheduled(cron = "0 0 0 1 1,7 ?")
    public void loadFunds() {

        RestTemplate restTemplate = new RestTemplate();

        MfApiFundDto[] response =
                restTemplate.getForObject(MFAPI_URL, MfApiFundDto[].class);

        if (response == null) return;
        System.out.println("mfapi fund master load Started");

        Arrays.stream(response).forEach(dto -> {

            MutualFund fund = mutualFundRepository
                    .findBySchemeCode(dto.getSchemeCode())
                    .orElse(new MutualFund());

            fund.setSchemeCode(dto.getSchemeCode());
            fund.setFundName(dto.getSchemeName());
            fund.setAmcName(dto.getFundHouse());
            fund.setSchemeType(dto.getSchemeType());
            fund.setCategory(dto.getSchemeCategory());
            fund.setIsinGrowth(dto.getIsinGrowth());
            fund.setIsinDivReinvestment(dto.getIsinDivReinvestment());

            if (fund.getRiskLevel() == null) {
                fund.setRiskLevel("UNKNOWN");
            }

            mutualFundRepository.save(fund);
        });

        System.out.println("mfapi fund master load completed");
    }
}
