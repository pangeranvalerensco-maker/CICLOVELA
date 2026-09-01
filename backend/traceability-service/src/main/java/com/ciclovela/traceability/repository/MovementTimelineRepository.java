package com.ciclovela.traceability.repository;

import com.ciclovela.traceability.entity.MovementTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MovementTimelineRepository extends JpaRepository<MovementTimeline, UUID> {
    
    @Query(value = "SELECT m.* FROM inventory_movements m " +
                   "JOIN inventories i ON m.inventory_id = i.id " +
                   "WHERE i.batch_id = :batchId " +
                   "ORDER BY m.created_at ASC", nativeQuery = true)
    List<MovementTimeline> findTimelineByBatchId(@Param("batchId") UUID batchId);
}
