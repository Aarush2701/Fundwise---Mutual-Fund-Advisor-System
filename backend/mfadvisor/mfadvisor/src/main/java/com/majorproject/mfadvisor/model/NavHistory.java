package com.majorproject.mfadvisor.model;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "nav_history",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"fund_id", "nav_date"})
        }
)
@Data
public class NavHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long navId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund mutualFund;

    @Column(name = "nav_date", nullable = false)
    private LocalDate navDate;

    @Column(name = "nav_value", precision = 18, scale = 4)
    private BigDecimal navValue;
}
