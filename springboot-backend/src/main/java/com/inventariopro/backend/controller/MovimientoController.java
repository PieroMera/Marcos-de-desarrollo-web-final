package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.movimiento.MovimientoRequest;
import com.inventariopro.backend.dto.movimiento.MovimientoResponse;
import com.inventariopro.backend.exception.ApiException;
import com.inventariopro.backend.model.Movimiento;
import com.inventariopro.backend.model.Producto;
import com.inventariopro.backend.model.Usuario;
import com.inventariopro.backend.repository.MovimientoRepository;
import com.inventariopro.backend.repository.ProductoRepository;
import com.inventariopro.backend.repository.UsuarioRepository;
import com.inventariopro.backend.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private static final Set<String> TIPOS_VALIDOS = Set.of("Entrada", "Salida");

    private final MovimientoRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public MovimientoController(
            MovimientoRepository movimientoRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.movimientoRepository = movimientoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestParam(required = false) Integer limit) {
        int size = limit == null ? 20 : Math.min(limit, 100);
        List<Movimiento> movimientos = movimientoRepository.findRecientes(PageRequest.of(0, size));
        List<MovimientoResponse> dto = movimientos.stream().map(MovimientoResponse::from).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("movimientos", dto));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(HttpServletRequest request, @RequestBody MovimientoRequest req) {
        if (req.productoId() == null || req.tipo() == null || req.cantidad() == null) {
            throw ApiException.badRequest("Producto, tipo y cantidad son obligatorios.");
        }
        if (!TIPOS_VALIDOS.contains(req.tipo())) {
            throw ApiException.badRequest("El tipo de movimiento debe ser Entrada o Salida.");
        }
        if (req.cantidad() <= 0) {
            throw ApiException.badRequest("La cantidad debe ser un numero mayor a cero.");
        }

        Long userId = (Long) request.getAttribute(JwtAuthFilter.USER_ID_ATTRIBUTE);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado."));

        if (req.tipo().equals("Entrada") && "Vendedor".equals(usuario.getRol())) {
            throw ApiException.forbidden("Un vendedor solo puede registrar salidas de stock.");
        }

        Producto producto = productoRepository.findById(req.productoId())
                .orElseThrow(() -> ApiException.notFound("Producto no encontrado."));

        if (req.tipo().equals("Salida") && producto.getStock() < req.cantidad()) {
            throw ApiException.badRequest("Stock insuficiente. Disponible: " + producto.getStock() + ".");
        }

        int nuevoStock = req.tipo().equals("Entrada")
                ? producto.getStock() + req.cantidad()
                : producto.getStock() - req.cantidad();
        producto.setStock(nuevoStock);
        producto.setUpdatedAt(LocalDateTime.now());
        productoRepository.save(producto);

        Movimiento m = new Movimiento();
        m.setProducto(producto);
        m.setUsuario(usuario);
        m.setTipo(req.tipo());
        m.setCantidad(req.cantidad());
        movimientoRepository.save(m);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("movimiento", MovimientoResponse.from(m)));
    }
}
