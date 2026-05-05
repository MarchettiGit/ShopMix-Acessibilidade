package com.example.demo.controller;

import com.example.demo.model.Produto;
import com.example.demo.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Produto;
import com.example.demo.service.ProdutoService;
import org.springframework.ui.Model;

@Controller
public class HomeController {

    @Autowired
    private ProdutoService service;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/login")
    public String fazerLogin() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String homePage(Model model) {
        model.addAttribute("produtos", service.listar());
        model.addAttribute("anuncios", service.listar());
        return "home";
    }

    @GetMapping("/anunciar")
    public String paginaAnuncio() {
        return "anunciar";
    }

    @PostMapping("/anunciar")
    public String salvarProduto(Produto produto) {
        service.salvar(produto);
        return "redirect:/home";
    }

    // 🔥 EDITAR (carregar dados)
    @GetMapping("/anuncio/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        model.addAttribute("anuncio", service.buscarPorId(id));
        return "editar-anuncio";
    }

    // 🔥 EDITAR (salvar)
    @PostMapping("/anuncio/editar")
    public String atualizar(Produto produto) {
        service.salvar(produto);
        return "redirect:/home";
    }

    // 🔥 EXCLUIR
    @PostMapping("/anuncio/delete/{id}")
    public String deletar(@PathVariable Long id) {
        service.deletar(id);
        return "redirect:/home";
    }




}