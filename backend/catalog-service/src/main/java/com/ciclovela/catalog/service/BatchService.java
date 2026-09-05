package com.ciclovela.catalog.service;

import com.ciclovela.catalog.dto.request.BatchRequest;
import com.ciclovela.catalog.dto.response.BatchResponse;
import com.ciclovela.catalog.entity.Batch;
import com.ciclovela.catalog.entity.Product;
import com.ciclovela.catalog.enums.BatchQuality;
import com.ciclovela.catalog.enums.BatchStatus;
import com.ciclovela.catalog.exception.BadRequestException;
import com.ciclovela.catalog.exception.DuplicateResourceException;
import com.ciclovela.catalog.exception.ResourceNotFoundException;
import com.ciclovela.catalog.repository.BatchRepository;
import com.ciclovela.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<BatchResponse> getAllBatches(String search, UUID productId, UUID farmerId, BatchStatus status, Pageable pageable) {
        return batchRepository.findAllWithFilters(search, productId, farmerId, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BatchResponse getBatch(UUID id) {
        return batchRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Batch tidak ditemukan"));
    }

    @Transactional
    public BatchResponse createBatch(BatchRequest request, UUID farmerId) {
        if (batchRepository.existsByBatchCodeIgnoreCase(request.getBatchCode())) {
            throw new DuplicateResourceException("Kode batch sudah digunakan");
        }

        if (request.getExpiryDate().isBefore(request.getHarvestDate())) {
            throw new BadRequestException("Tanggal kedaluwarsa tidak boleh sebelum tanggal panen");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        Batch batch = Batch.builder()
                .batchCode(request.getBatchCode())
                .product(product)
                .farmerId(farmerId)
                .harvestDate(request.getHarvestDate())
                .initialQuantity(request.getInitialQuantity())
                .unit(request.getUnit())
                .qualityGrade(request.getQualityGrade() != null ? request.getQualityGrade() : BatchQuality.A)
                .expiryDate(request.getExpiryDate())
                .status(BatchStatus.ACTIVE)
                .build();

        return toResponse(batchRepository.save(batch));
    }

    @Transactional
    public BatchResponse updateBatch(UUID id, BatchRequest request, UUID farmerId) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch tidak ditemukan"));

        if (!batch.getFarmerId().equals(farmerId)) {
            throw new com.ciclovela.catalog.exception.AccessDeniedException("Anda tidak memiliki hak untuk mengubah batch ini");
        }

        if (!request.getBatchCode().equalsIgnoreCase(batch.getBatchCode()) &&
                batchRepository.existsByBatchCodeIgnoreCase(request.getBatchCode())) {
            throw new DuplicateResourceException("Kode batch sudah digunakan");
        }

        if (request.getExpiryDate().isBefore(request.getHarvestDate())) {
            throw new BadRequestException("Tanggal kedaluwarsa tidak boleh sebelum tanggal panen");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        batch.setBatchCode(request.getBatchCode());
        batch.setProduct(product);
        batch.setHarvestDate(request.getHarvestDate());
        
        // Aturan: initial_quantity tidak boleh diubah setelah pembuatan.
        // Penghapusan batch.setInitialQuantity() dan batch.setUnit().
        
        if (request.getQualityGrade() != null) {
            batch.setQualityGrade(request.getQualityGrade());
        }
        batch.setExpiryDate(request.getExpiryDate());

        return toResponse(batchRepository.save(batch));
    }

    @Transactional
    public void softDeleteBatch(UUID id, UUID farmerId) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch tidak ditemukan"));
        
        if (!batch.getFarmerId().equals(farmerId)) {
            throw new com.ciclovela.catalog.exception.AccessDeniedException("Anda tidak memiliki hak untuk menghapus batch ini");
        }

        batch.setDeletedAt(OffsetDateTime.now());
        batch.setStatus(BatchStatus.CANCELLED);
        batchRepository.save(batch);
    }

    private BatchResponse toResponse(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .batchCode(batch.getBatchCode())
                .productId(batch.getProduct().getId())
                .productName(batch.getProduct().getName())
                .farmerId(batch.getFarmerId())
                .harvestDate(batch.getHarvestDate())
                .initialQuantity(batch.getInitialQuantity())
                .unit(batch.getUnit().name())
                .qualityGrade(batch.getQualityGrade().name())
                .expiryDate(batch.getExpiryDate())
                .status(batch.getStatus().name())
                .createdAt(batch.getCreatedAt())
                .build();
    }
}
