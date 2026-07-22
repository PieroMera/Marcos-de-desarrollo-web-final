package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.MessageResponse;
import com.inventariopro.backend.dto.producto.ProductoRequest;
import com.inventariopro.backend.dto.producto.ProductoResponse;
import com.inventariopro.backend.exception.ApiException;
import com.inventariopro.backend.model.Producto;
import com.inventariopro.backend.model.Usuario;
import com.inventariopro.backend.repository.ProductoRepository;
import com.inventariopro.backend.security.CurrentUserResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private static final String ADMIN = "Administrador";
    private static final String ENCARGADO = "Encargado de almacen";

    private final ProductoRepository productoRepository;
    private final CurrentUserResolver currentUserResolver;

    public ProductoController(ProductoRepository productoRepository, CurrentUserResolver currentUserResolver) {
        this.productoRepository = productoRepository;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String disponibilidad
    ) {
        List<Producto> productos = productoRepository.findAll().stream()
                .sorted((a, b) -> a.getNombre().compareToIgnoreCase(b.getNombre()))
                .filter(p -> search == null || search.isBlank()
                        || p.getNombre().toLowerCase().contains(search.trim().toLowerCase()))
                .filter(p -> categoria == null || categoria.isBlank() || categoria.equals("Todas")
                        || categoria.equals(p.getCategoria()))
                .filter(p -> marca == null || marca.isBlank() || marca.equals("Todas")
                        || marca.equals(p.getMarca()))
                .filter(p -> disponibilidad == null || disponibilidad.isBlank() || disponibilidad.equals("Todos")
                        || disponibilidad.equals(p.estado()))
                .collect(Collectors.toList());

        List<ProductoResponse> dto = productos.stream().map(ProductoResponse::from).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("productos", dto));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(HttpServletRequest request, @RequestBody ProductoRequest req) {
        Usuario usuario = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(usuario, ADMIN, ENCARGADO);

        if (req.nombre() == null || req.nombre().isBlank()) {
            throw ApiException.badRequest("El nombre del producto es obligatorio.");
        }

        Producto p = new Producto();
        p.setNombre(req.nombre().trim());
        p.setCategoria(req.categoria() == null ? "" : req.categoria().trim());
        p.setMarca(req.marca() == null ? "" : req.marca().trim());
        p.setStock(req.stock() == null ? 0 : req.stock());
        p.setStockMinimo(req.stockMinimo() == null ? 0 : req.stockMinimo());
        productoRepository.save(p);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("producto", ProductoResponse.from(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            HttpServletRequest request, @PathVariable Long id, @RequestBody ProductoRequest req
    ) {
        Usuario usuario = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(usuario, ADMIN, ENCARGADO);

        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Producto no encontrado."));

        if (req.nombre() != null && !req.nombre().isBlank()) p.setNombre(req.nombre().trim());
        if (req.categoria() != null) p.setCategoria(req.categoria().trim());
        if (req.marca() != null) p.setMarca(req.marca().trim());
        if (req.stock() != null) p.setStock(req.stock());
        if (req.stockMinimo() != null) p.setStockMinimo(req.stockMinimo());
        p.setUpdatedAt(LocalDateTime.now());
        productoRepository.save(p);

        return ResponseEntity.ok(Map.of("producto", ProductoResponse.from(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> eliminar(HttpServletRequest request, @PathVariable Long id) {
        Usuario usuario = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(usuario, ADMIN);

        if (!productoRepository.existsById(id)) {
            throw ApiException.notFound("Producto no encontrado.");
        }
        productoRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Producto eliminado."));
    }
}
