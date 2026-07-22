package com.inventariopro.backend.dto.dashboard;

import java.util.List;

public record DashboardSummaryResponse(
        int totalProductos,
        int totalMovimientos,
        int alertasActivas,
        int stockTotal,
        List<DiaResumen> semanal
) {
}
