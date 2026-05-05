package com.example.demo.controller;

import com.example.demo.service.PedidoService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping("/entregar/{id}")
    public String entregar(@PathVariable Long id) {

        service.marcarComoEntregue(id);

        
        return "redirect:/home?sucesso=true";
    }
}