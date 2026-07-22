package com.inventariopro.backend.dto.producto;

import com.inventariopro.backend.model.Producto;

public record ProductoResponse(
        Long id,
        String nombre,
        String categoria,
        String marca,
        int stock,
        int stockMinimo,
        String estado,
        String createdAt,
        String updatedAt
) {
    public static ProductoResponse from(Producto p) {
        return new ProductoResponse(
                p.getId(),
                p.getNombre(),
                p.getCategoria(),
                p.getMarca(),
                p.getStock(),
                p.getStockMinimo(),
                p.estado(),
                p.getCreatedAt().toString(),
                p.getUpdatedAt().toString()
        );
    }
}
