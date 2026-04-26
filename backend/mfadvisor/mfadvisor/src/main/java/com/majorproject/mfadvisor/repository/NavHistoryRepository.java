package com.majorproject.mfadvisor.repository;

import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface NavHistoryRepository extends JpaRepository<NavHistory, Long> {
    List<NavHistory> findByMutualFund(MutualFund fund);
    List<NavHistory> findByMutualFundOrderByNavDateAsc(MutualFund mutualFund);

    boolean existsByMutualFundAndNavDate(
            MutualFund mutualFund,
            LocalDate navDate);

    List<NavHistory> findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
            MutualFund fund,
            LocalDate startDate,
            LocalDate endDate
    );

}
