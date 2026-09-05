package com.ciclovela.order.repository;

import com.ciclovela.order.entity.BusinessEntityRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BusinessEntityRefRepository extends JpaRepository<BusinessEntityRef, UUID> {
}
