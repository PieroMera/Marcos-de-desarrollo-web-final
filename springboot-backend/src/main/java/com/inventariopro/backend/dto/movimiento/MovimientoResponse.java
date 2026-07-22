package com.inventariopro.backend.dto.movimiento;

import com.inventariopro.backend.model.Movimiento;

public record MovimientoResponse(
        Long id,
        Long productoId,
        String productoNombre,
        String tipo,
        int cantidad,
        Long responsableId,
        String responsableNombre,
        String createdAt
) {
    public static MovimientoResponse from(Movimiento m) {
        return new MovimientoResponse(
                m.getId(),
                m.getProducto().getId(),
                m.getProducto().getNombre(),
                m.getTipo(),
                m.getCantidad(),
                m.getUsuario().getId(),
                m.getUsuario().nombreCompleto(),
                m.getCreatedAt().toString()
        );
    }
}
