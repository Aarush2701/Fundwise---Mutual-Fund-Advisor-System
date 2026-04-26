package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.MfApiHistoryResponse;
import com.majorproject.mfadvisor.dto.MfApiNavDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class MfApiHistoryService {

    private final MutualFundRepository mutualFundRepository;
    private final NavHistoryRepository navHistoryRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public void loadHistory(String schemeCode,
                            LocalDate startDate,
                            LocalDate endDate) {

        MutualFund fund = mutualFundRepository
                .findBySchemeCode(schemeCode)
                .orElseThrow();

        String url = String.format(
                "https://api.mfapi.in/mf/%s?startDate=%s&endDate=%s",
                schemeCode, startDate, endDate
        );

        MfApiHistoryResponse response =
                restTemplate.getForObject(url, MfApiHistoryResponse.class);

        if (response == null || response.getData() == null) return;

        for (MfApiNavDto dto : response.getData()) {

            if (dto.getNav() == null || dto.getNav().equals("-")) continue;

            LocalDate navDate =
                    LocalDate.parse(dto.getDate(), FORMATTER);

            BigDecimal navValue =
                    new BigDecimal(dto.getNav());

            if (!navHistoryRepository
                    .existsByMutualFundAndNavDate(fund, navDate)) {

                NavHistory nh = new NavHistory();
                nh.setMutualFund(fund);
                nh.setNavDate(navDate);
                nh.setNavValue(navValue);

                navHistoryRepository.save(nh);
            }
        }
    }
}
