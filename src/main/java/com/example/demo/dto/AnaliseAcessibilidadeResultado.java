package com.example.demo.dto;

import java.util.List;

public record AnaliseAcessibilidadeResultado(
        String resumo,
        List<String> pontosPositivos,
        List<Oportunidade> oportunidades,
        List<String> dadosAConfirmar,
        String sugestaoDescricao,
        String sugestaoTextoAlternativo,
        List<String> avisos,
        String modelo) {

    public record Oportunidade(String problema, String motivo, String recomendacao, String prioridade) {
    }
}
