package com.majorproject.mfadvisor.scheduler;

import com.majorproject.mfadvisor.model.MutualFund;
import com.majorproject.mfadvisor.model.NavHistory;
import com.majorproject.mfadvisor.repository.MutualFundRepository;
import com.majorproject.mfadvisor.repository.NavHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AmfiNavScheduler {

    private static final String AMFI_URL =
            "https://portal.amfiindia.com/spages/NAVAll.txt";

    private final MutualFundRepository mutualFundRepository;
    private final NavHistoryRepository navHistoryRepository;

    // Daily at 11 PM IST
    @Scheduled(cron = "0 0 23 * * ?")
    // For testing:
    //@Scheduled(cron = "0 */1 * * * ?")
    public void fetchNavData() {

        System.out.println("AMFI NAV Scheduler started");

        try (BufferedReader reader =
                     new BufferedReader(
                             new InputStreamReader(
                                     new URL(AMFI_URL).openStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {

                line = line.trim();

                // Skip empty or non-data lines
                if (line.isEmpty() || !line.matches("^\\d+;.*")) {
                    continue;
                }

                String[] data = line.split(";");
                if (data.length < 6) continue;

                String schemeCode = data[0].trim();
                double navValue = Double.parseDouble(data[4].trim());

                LocalDate navDate = LocalDate.parse(
                        data[5].trim(),
                        DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH)
                );

                Optional<MutualFund> fundOpt =
                        mutualFundRepository.findBySchemeCode(schemeCode);

                // Fund must already exist (created by mfapi loader)
                if (fundOpt.isEmpty()) {
                    continue;
                }

                MutualFund fund = fundOpt.get();

                // Insert NAV history if not present
                if (!navHistoryRepository.existsByMutualFundAndNavDate(fund, navDate)) {

                    NavHistory nav = new NavHistory();
                    nav.setMutualFund(fund);
                    nav.setNavDate(navDate);
                    nav.setNavValue(BigDecimal.valueOf(navValue));

                    navHistoryRepository.save(nav);
                }

                // Update latest NAV snapshot
                if (fund.getLatestNavDate() == null ||
                        navDate.isAfter(fund.getLatestNavDate())) {

                    fund.setLatestNav(BigDecimal.valueOf(navValue));
                    fund.setLatestNavDate(navDate);
                }

                // Mark fund as having NAV
                if (fund.getHasNav() == null || !fund.getHasNav()) {
                    fund.setHasNav(true);
                }

                mutualFundRepository.save(fund);
            }

            System.out.println("AMFI NAV Scheduler completed");

        } catch (Exception e) {
            System.err.println("Error while fetching AMFI NAV");
            e.printStackTrace();
        }
    }
}
