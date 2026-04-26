package com.majorproject.mfadvisor.service.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;

@Service
@RequiredArgsConstructor
public class SharpeRatioService {

    // 6% assumed risk-free rate
    private static final BigDecimal RISK_FREE_RATE =
            BigDecimal.valueOf(6.0);

    public BigDecimal calculateSharpeRatio(
            BigDecimal annualReturn,
            BigDecimal volatility) {

        if (annualReturn == null || volatility == null ||
                volatility.doubleValue() == 0.0) {
            return null;
        }

        BigDecimal excessReturn =
                annualReturn.subtract(RISK_FREE_RATE);

        BigDecimal sharpe =
                excessReturn.divide(volatility, MathContext.DECIMAL64);

        return sharpe.round(new MathContext(4));
    }

    public String classifySharpe(BigDecimal sharpe) {

        if (sharpe == null) return "UNKNOWN";

        double s = sharpe.doubleValue();

        if (s >= 1.5) return "EXCELLENT";
        if (s >= 1.0) return "GOOD";
        if (s >= 0.5) return "AVERAGE";
        return "POOR";
    }
}
