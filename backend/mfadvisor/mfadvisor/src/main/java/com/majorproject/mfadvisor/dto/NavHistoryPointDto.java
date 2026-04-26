package com.majorproject.mfadvisor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class NavHistoryPointDto {

    private LocalDate date;
    private BigDecimal nav;
}