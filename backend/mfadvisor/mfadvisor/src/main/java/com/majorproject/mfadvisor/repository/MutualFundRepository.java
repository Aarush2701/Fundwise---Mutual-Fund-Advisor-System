package com.majorproject.mfadvisor.repository;

import com.majorproject.mfadvisor.model.MutualFund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MutualFundRepository extends JpaRepository<MutualFund, Long> {
    Optional<MutualFund> findBySchemeCode(String schemeCode);
    List<MutualFund>
    findTop10ByFundNameContainingIgnoreCaseOrderByFundNameAsc(
            String keyword);

}

