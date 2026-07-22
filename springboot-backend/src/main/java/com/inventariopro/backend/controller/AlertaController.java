package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.alerta.AlertaResponse;
import com.inventariopro.backend.model.Producto;
import com.inventariopro.backend.repository.ProductoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final ProductoRepository productoRepository;

    public AlertaController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public Map<String, Object> listar() {
        List<Producto> productos = productoRepository.findAll();
        List<AlertaResponse> alertas = new ArrayList<>();

        for (Producto p : productos) {
            if (p.getStock() <= 0) {
                alertas.add(new AlertaResponse(
                        "agotado-" + p.getId(),
                        "danger",
                        "bi-x-circle",
                        p.getNombre() + " agotado. Se recomienda reabastecer."
                ));
            } else if (p.getStock() <= p.getStockMinimo()) {
                alertas.add(new AlertaResponse(
                        "bajo-" + p.getId(),
                        "warning",
                        "bi-exclamation-triangle",
                        p.getNombre() + " por debajo del stock minimo (" + p.getStock() + "/" + p.getStockMinimo() + ")."
                ));
            }
        }

        if (alertas.isEmpty()) {
            alertas.add(new AlertaResponse(
                    "sin-alertas",
                    "info",
                    "bi-info-circle",
                    "No hay alertas activas. El stock se encuentra en niveles saludables."
            ));
        }

        return Map.of("alertas", alertas);
    }
}
