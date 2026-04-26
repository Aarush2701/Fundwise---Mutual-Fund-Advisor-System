package com.majorproject.mfadvisor.service.analytics;

import com.majorproject.mfadvisor.model.NavHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskCalculatorService {

    public BigDecimal calculateAnnualizedVolatility(
            List<NavHistory> navs) {

        if (navs == null || navs.size() < 2) {
            return null;
        }

        List<Double> returns = new ArrayList<>();

        for (int i = 1; i < navs.size(); i++) {

            double prev = navs.get(i - 1).getNavValue().doubleValue();
            double curr = navs.get(i).getNavValue().doubleValue();

            if (prev <= 0 || curr <= 0) continue;

            double ratio = curr / prev;
            if (ratio <= 0 || Double.isNaN(ratio) || Double.isInfinite(ratio))
                continue;

            double dailyReturn = Math.log(ratio);
            if (Double.isNaN(dailyReturn) || Double.isInfinite(dailyReturn))
                continue;

            returns.add(dailyReturn);
        }

        if (returns.size() < 2) return null;

        double mean = returns.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(Double.NaN);

        if (Double.isNaN(mean) || Double.isInfinite(mean)) return null;

        double variance = returns.stream()
                .mapToDouble(r -> Math.pow(r - mean, 2))
                .sum() / (returns.size() - 1);

        if (Double.isNaN(variance) || Double.isInfinite(variance)) return null;

        double dailyVolatility = Math.sqrt(variance);
        if (Double.isNaN(dailyVolatility) || Double.isInfinite(dailyVolatility))
            return null;

        double annualizedVolatility = dailyVolatility * Math.sqrt(252);
        if (Double.isNaN(annualizedVolatility)
                || Double.isInfinite(annualizedVolatility))
            return null;

        return BigDecimal.valueOf(annualizedVolatility * 100)
                .setScale(2, RoundingMode.HALF_UP);
    }

    // ✅ ADD THIS METHOD
    public String classifyRisk(BigDecimal volatility) {

        if (volatility == null) {
            return "UNKNOWN";
        }

        double v = volatility.doubleValue();

        if (v < 12) {
            return "LOW";
        } else if (v < 20) {
            return "MODERATE";
        } else {
            return "HIGH";
        }
    }
}
