package com.inventariopro.backend.dto.producto;

public record ProductoRequest(
        String nombre,
        String categoria,
        String marca,
        Integer stock,
        Integer stockMinimo
) {
}
