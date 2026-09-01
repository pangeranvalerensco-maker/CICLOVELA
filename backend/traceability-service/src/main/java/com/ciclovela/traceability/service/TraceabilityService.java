package com.ciclovela.traceability.service;

import com.ciclovela.traceability.dto.response.TraceabilityResponse;
import com.ciclovela.traceability.entity.MovementTimeline;
import com.ciclovela.traceability.entity.ProductTraceabilityView;
import com.ciclovela.traceability.exception.ResourceNotFoundException;
import com.ciclovela.traceability.repository.MovementTimelineRepository;
import com.ciclovela.traceability.repository.ProductTraceabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TraceabilityService {

    private final ProductTraceabilityRepository traceabilityRepository;
    private final MovementTimelineRepository timelineRepository;

    @Transactional(readOnly = true)
    public TraceabilityResponse getTraceabilityByBatchId(UUID batchId) {
        ProductTraceabilityView view = traceabilityRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Data traceability tidak ditemukan untuk batch tersebut"));

        return buildResponse(view);
    }

    @Transactional(readOnly = true)
    public TraceabilityResponse getTraceabilityByBatchCode(String batchCode) {
        ProductTraceabilityView view = traceabilityRepository.findByBatchCode(batchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Data traceability tidak ditemukan untuk kode batch tersebut"));

        return buildResponse(view);
    }

    private TraceabilityResponse buildResponse(ProductTraceabilityView view) {
        List<MovementTimeline> movements = timelineRepository.findTimelineByBatchId(view.getBatchId());

        List<TraceabilityResponse.TimelineEvent> timeline = movements.stream()
                .map(m -> TraceabilityResponse.TimelineEvent.builder()
                        .timestamp(m.getCreatedAt())
                        .eventType(m.getMovementType())
                        .quantity(m.getQuantity())
                        .description(m.getDescription())
                        .build())
                .toList();

        return TraceabilityResponse.builder()
                .batchId(view.getBatchId())
                .batchCode(view.getBatchCode())
                .productName(view.getProductName())
                .farmerName(view.getFarmerName())
                .harvestDate(view.getHarvestDate())
                .expiryDate(view.getExpiryDate())
                .initialQuantity(view.getInitialQuantity())
                .unit(view.getUnit())
                .qualityGrade(view.getQualityGrade())
                .batchStatus(view.getBatchStatus())
                .timeline(timeline)
                .build();
    }
}
