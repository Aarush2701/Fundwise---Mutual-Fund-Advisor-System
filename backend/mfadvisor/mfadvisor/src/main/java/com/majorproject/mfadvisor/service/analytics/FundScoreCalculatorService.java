package com.majorproject.mfadvisor.service.analytics;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class FundScoreCalculatorService {

    public Integer calculateScore(
            BigDecimal cagr,
            BigDecimal sharpe,
            BigDecimal volatility) {

        if (cagr == null || sharpe == null || volatility == null) {
            return null;
        }

        int cagrScore = normalizeCagr(cagr);
        int sharpeScore = normalizeSharpe(sharpe);
        int volatilityScore = normalizeVolatility(volatility);

        // Weighted score
        return Math.min(100,
                (int) (
                        cagrScore * 0.4 +
                                sharpeScore * 0.4 +
                                volatilityScore * 0.2
                ));
    }

    // ---------- Normalization ----------

    private int normalizeCagr(BigDecimal cagr) {
        double v = cagr.doubleValue();
        if (v >= 20) return 100;
        if (v >= 15) return 80;
        if (v >= 10) return 60;
        if (v >= 5) return 40;
        return 20;
    }

    private int normalizeSharpe(BigDecimal sharpe) {
        double v = sharpe.doubleValue();
        if (v >= 1.0) return 100;
        if (v >= 0.75) return 80;
        if (v >= 0.5) return 60;
        if (v >= 0.25) return 40;
        return 20;
    }

    private int normalizeVolatility(BigDecimal volatility) {
        double v = volatility.doubleValue();
        if (v <= 10) return 100;
        if (v <= 15) return 80;
        if (v <= 20) return 60;
        if (v <= 25) return 40;
        return 20;
    }
}
