package com.inventariopro.backend.dto.movimiento;

public record MovimientoRequest(
        Long productoId,
        String tipo,
        Integer cantidad
) {
}
