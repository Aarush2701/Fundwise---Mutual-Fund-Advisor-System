package com.majorproject.mfadvisor.scheduler;

import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import com.majorproject.mfadvisor.service.analytics.CagrCalculatorService;
import com.majorproject.mfadvisor.service.analytics.FundScoreCalculatorService;
import com.majorproject.mfadvisor.service.analytics.RiskCalculatorService;
import com.majorproject.mfadvisor.service.analytics.SharpeRatioService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FundAnalyticsScheduler {

    private final MutualFundRepository mutualFundRepository;
    private final CagrCalculatorService cagrCalculatorService;
    private final RiskCalculatorService riskCalculatorService;
    private final SharpeRatioService sharpeRatioService;
    private final NavHistoryRepository navHistoryRepository;
    private final FundScoreCalculatorService fundScoreCalculatorService;


    //@Scheduled(cron = "0 */1 * * * ?")
    @Scheduled(cron = "0 30 1 * * ?") // 1:30 AM daily
    public void computeAnalytics() {

        List<MutualFund> funds = mutualFundRepository.findAll();
        System.out.println("Fund Analytics Scheduler started");

        for (MutualFund fund : funds) {

            if (!Boolean.TRUE.equals(fund.getHasNav())
                    || fund.getLatestNavDate() == null) {
                continue;
            }

            LocalDate end = fund.getLatestNavDate();
            LocalDate start3y = end.minusYears(3);

            BigDecimal cagr3y =
                    cagrCalculatorService.calculateCagr(fund, 3);

            if (cagr3y == null) {
                continue;
            }

            List<NavHistory> navs =
                    navHistoryRepository
                            .findByMutualFundAndNavDateBetweenOrderByNavDateAsc(
                                    fund, start3y, end);

            if (navs.size() < 2) {
                continue;
            }

            // ✅ SAFE VOLATILITY CALCULATION
            BigDecimal volatility =
                    riskCalculatorService
                            .calculateAnnualizedVolatility(navs);

            if (volatility == null) {
                continue;
            }

            // ✅ SAFE SHARPE CALCULATION
            BigDecimal sharpe =
                    sharpeRatioService
                            .calculateSharpeRatio(cagr3y, volatility);

            if (sharpe == null) {
                continue;
            }

            Integer score =
                    fundScoreCalculatorService.calculateScore(
                            cagr3y,
                            sharpe,
                            volatility
                    );

            fund.setCagr3y(cagr3y);
            fund.setVolatility3y(volatility);
            fund.setSharpe3y(sharpe);
            fund.setFundScore(score);

            fund.setRiskLevel(
                    riskCalculatorService.classifyRisk(volatility));

            mutualFundRepository.save(fund);
        }
        System.out.println("Fund Analytics Scheduler completed");
    }
}