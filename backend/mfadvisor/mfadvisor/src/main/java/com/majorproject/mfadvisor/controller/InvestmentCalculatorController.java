package com.majorproject.mfadvisor.controller;

import com.majorproject.mfadvisor.dto.InvestmentCalculatorRequestDto;
import com.majorproject.mfadvisor.dto.InvestmentCalculatorResponseDto;
import com.majorproject.mfadvisor.service.InvestmentCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class InvestmentCalculatorController {

    private final InvestmentCalculatorService calculatorService;

    @PostMapping("/calculate")
    public InvestmentCalculatorResponseDto calculateInvestment(
            @RequestBody InvestmentCalculatorRequestDto request) {

        return calculatorService.calculate(request);
    }
}
