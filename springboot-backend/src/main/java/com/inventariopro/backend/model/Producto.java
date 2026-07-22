package com.inventariopro.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String categoria = "";

    @Column(nullable = false)
    private String marca = "";

    @Column(nullable = false)
    private int stock = 0;

    @Column(name = "stock_minimo", nullable = false)
    private int stockMinimo = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String estado() {
        if (stock <= 0) return "Agotado";
        if (stock <= stockMinimo) return "Stock bajo";
        return "Disponible";
    }
}
