package com.example.demo.dto;

public record AnaliseAcessibilidadeRequest(
        String nome,
        String descricao,
        String categoria,
        String subcategoria,
        String marca,
        String peso,
        String altura,
        String largura,
        String comprimento,
        String unidadeMedida,
        String imagemAlt) {
}
