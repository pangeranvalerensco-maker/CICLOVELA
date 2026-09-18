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
    private List<ExpiringBatch> expiringBatches;
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    public static class ChartData {
        private String name;
        private long masuk;
        private long keluar;
        private long limbah;
    }

    @Data
    @Builder
    public static class ExpiringBatch {
        private String id;
        private String product;
        private long daysLeft;
        private String qty;
    }

    @Data
    @Builder
    public static class RecentActivity {
        private String id;
        private String action;
        private String target;
        private String time;
        private String status;
        private String eventType;
    }
}
