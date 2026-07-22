package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.MessageResponse;
import com.inventariopro.backend.exception.ApiException;
import com.inventariopro.backend.model.Producto;
import com.inventariopro.backend.model.Usuario;
import com.inventariopro.backend.repository.ProductoRepository;
import com.inventariopro.backend.repository.UsuarioRepository;
import com.inventariopro.backend.security.JwtAuthFilter;
import com.inventariopro.backend.service.ReporteEmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReporteEmailService reporteEmailService;

    public ReporteController(
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            ReporteEmailService reporteEmailService
    ) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.reporteEmailService = reporteEmailService;
    }

    @PostMapping("/stock")
    public MessageResponse enviarReporteStock(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute(JwtAuthFilter.USER_ID_ATTRIBUTE);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado."));

        List<Producto> productos = productoRepository.findAll();
        byte[] csv = generarCsv(productos);
        String nombreArchivo = "reporte-stock-" + LocalDate.now() + ".csv";

        reporteEmailService.enviarReporteStock(usuario.getEmail(), csv, nombreArchivo);

        return new MessageResponse("Reporte enviado a " + usuario.getEmail() + ".");
    }

    private byte[] generarCsv(List<Producto> productos) {
        StringBuilder sb = new StringBuilder("﻿");
        sb.append("Producto,Categoria,Marca,Stock,Stock minimo,Estado\n");
        for (Producto p : productos) {
            sb.append(csvValor(p.getNombre())).append(',')
                    .append(csvValor(p.getCategoria())).append(',')
                    .append(csvValor(p.getMarca())).append(',')
                    .append(p.getStock()).append(',')
                    .append(p.getStockMinimo()).append(',')
                    .append(csvValor(p.estado())).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvValor(String valor) {
        String texto = valor == null ? "" : valor;
        return "\"" + texto.replace("\"", "\"\"") + "\"";
    }
}
