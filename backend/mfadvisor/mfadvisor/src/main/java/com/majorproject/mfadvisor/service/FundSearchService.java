package com.majorproject.mfadvisor.service;

import com.majorproject.mfadvisor.dto.FundSearchResultDto;
import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FundSearchService {

    private final MutualFundRepository mutualFundRepository;

    public List<FundSearchResultDto> searchFunds(String query) {

        return mutualFundRepository
                .findTop10ByFundNameContainingIgnoreCaseOrderByFundNameAsc(query)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private FundSearchResultDto mapToDto(MutualFund fund) {
        FundSearchResultDto dto = new FundSearchResultDto();
        dto.setSchemeCode(fund.getSchemeCode());
        dto.setFundName(fund.getFundName());
        dto.setAmcName(fund.getAmcName());
        dto.setCategory(fund.getCategory());
        return dto;
    }
}
