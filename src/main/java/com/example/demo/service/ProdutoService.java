package com.example.demo.service;

import com.example.demo.model.Produto;
import com.example.demo.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Produto salvar(Produto produto) {
        return repository.save(produto);
    }

    // 🔥 ADICIONAR
    public Produto buscarPorId(Long id) {
        return repository.findById(id).orElseThrow();
    }

    // 🔥 ADICIONAR
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}