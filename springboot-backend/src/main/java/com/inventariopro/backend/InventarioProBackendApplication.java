package com.inventariopro.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class InventarioProBackendApplication {

	public static void main(String[] args) {
		new File("data").mkdirs();
		SpringApplication.run(InventarioProBackendApplication.class, args);
	}

}
