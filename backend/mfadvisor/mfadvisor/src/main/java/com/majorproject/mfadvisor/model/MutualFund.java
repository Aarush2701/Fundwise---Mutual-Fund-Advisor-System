package com.majorproject.mfadvisor.model;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mutual_fund")
@Data
public class MutualFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fundId;

    @Column(name = "scheme_code", unique = true, nullable = false)
    private String schemeCode;

    @Column(name = "fund_name", length = 255)
    private String fundName;

    @Column(name = "amc_name", length = 255)
    private String amcName;

    @Column(name = "scheme_type", length = 100)
    private String schemeType;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "isin_growth", length = 50)
    private String isinGrowth;

    @Column(name = "isin_div_reinvestment", length = 50)
    private String isinDivReinvestment;

    @Column(name = "latest_nav", precision = 18, scale = 4)
    private BigDecimal latestNav;

    @Column(name = "latest_nav_date")
    private LocalDate latestNavDate;

    @Column(name = "risk_level", length = 50)
    private String riskLevel;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "has_nav")
    private Boolean hasNav = false;

    @Column(name = "cagr_1y", precision = 6, scale = 2)
    private BigDecimal cagr1y;

    @Column(name = "cagr_3y", precision = 6, scale = 2)
    private BigDecimal cagr3y;

    @Column(name = "cagr_5y", precision = 6, scale = 2)
    private BigDecimal cagr5y;

    @Column(name = "volatility_3y", precision = 6, scale = 2)
    private BigDecimal volatility3y;

    @Column(name = "sharpe_3y", precision = 6, scale = 2)
    private BigDecimal sharpe3y;

    @Column(name = "fund_score")
    private Integer fundScore;

}