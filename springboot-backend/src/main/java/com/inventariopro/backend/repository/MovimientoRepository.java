package com.inventariopro.backend.repository;

import com.inventariopro.backend.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    @Query("SELECT m FROM Movimiento m JOIN FETCH m.producto JOIN FETCH m.usuario ORDER BY m.createdAt DESC, m.id DESC")
    List<Movimiento> findRecientes(Pageable pageable);

    @Query("SELECT m FROM Movimiento m WHERE m.createdAt >= :desde")
    List<Movimiento> findDesde(@Param("desde") LocalDateTime desde);

    long countByProductoId(Long productoId);
}
