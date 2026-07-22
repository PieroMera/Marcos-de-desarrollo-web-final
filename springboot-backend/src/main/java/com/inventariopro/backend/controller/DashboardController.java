package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.dashboard.DashboardSummaryResponse;
import com.inventariopro.backend.dto.dashboard.DiaResumen;
import com.inventariopro.backend.model.Movimiento;
import com.inventariopro.backend.model.Producto;
import com.inventariopro.backend.repository.MovimientoRepository;
import com.inventariopro.backend.repository.ProductoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProductoRepository productoRepository;
    private final MovimientoRepository movimientoRepository;

    public DashboardController(ProductoRepository productoRepository, MovimientoRepository movimientoRepository) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        List<Producto> productos = productoRepository.findAll();
        int totalProductos = productos.size();
        int alertasActivas = (int) productos.stream().filter(p -> p.getStock() <= p.getStockMinimo()).count();
        int stockTotal = productos.stream().mapToInt(Producto::getStock).sum();
        long totalMovimientos = movimientoRepository.count();

        LocalDate hoy = LocalDate.now();
        LocalDate desde = hoy.minusDays(6);
        List<Movimiento> movimientos = movimientoRepository.findDesde(desde.atStartOfDay());

        List<DiaResumen> semanal = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate fecha = hoy.minusDays(i);
            int entradas = 0;
            int salidas = 0;
            for (Movimiento m : movimientos) {
                if (!m.getCreatedAt().toLocalDate().equals(fecha)) continue;
                if ("Entrada".equals(m.getTipo())) entradas += m.getCantidad();
                else if ("Salida".equals(m.getTipo())) salidas += m.getCantidad();
            }
            String dia = fecha.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("es", "ES"));
            dia = dia.substring(0, 1).toUpperCase() + dia.substring(1, Math.min(3, dia.length()));
            semanal.add(new DiaResumen(fecha.toString(), dia, entradas, salidas, entradas - salidas));
        }

        return new DashboardSummaryResponse(totalProductos, (int) totalMovimientos, alertasActivas, stockTotal, semanal);
    }
}
