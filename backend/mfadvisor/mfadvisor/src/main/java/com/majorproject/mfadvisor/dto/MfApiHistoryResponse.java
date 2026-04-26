package com.majorproject.mfadvisor.dto;

import lombok.Data;
import java.util.List;
@Data
public class MfApiHistoryResponse {
    private MfApiMeta meta;
    private List<MfApiNavDto> data;
}