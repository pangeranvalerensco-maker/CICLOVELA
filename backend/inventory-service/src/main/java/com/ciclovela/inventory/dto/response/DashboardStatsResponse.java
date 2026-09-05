package com.ciclovela.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {

    private long totalInventoryQuantity;
    private int inboundTransactions;
    private int outboundTransactions;
    private long totalWasteRecorded;

    private List<ChartData> inventoryTrend;

    @Data
    @Builder
    public static class ChartData {
        private String name; // e.g. "Sen", "Sel"
        private long masuk;
        private long keluar;
        private long limbah;
    }
}
