package com.example.demo.controller;

import com.example.demo.dto.AnaliseAcessibilidadeRequest;
import com.example.demo.service.AcessibilidadeService;
import com.example.demo.service.AcessibilidadeService.IaIndisponivelException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ia/acessibilidade")
public class AcessibilidadeController {

    private static final Logger log = LoggerFactory.getLogger(AcessibilidadeController.class);
    private static final String MSG_INDISPONIVEL =
            "O assistente de IA está indisponível no momento. Você pode continuar cadastrando o produto normalmente.";

    private final AcessibilidadeService service;

    public AcessibilidadeController(AcessibilidadeService service) {
        this.service = service;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "habilitado", service.isHabilitado(),
                "disponivel", service.isDisponivel(),
                "modelo", service.getModelo());
    }

    @PostMapping("/analisar")
    public ResponseEntity<?> analisar(@RequestBody AnaliseAcessibilidadeRequest dados) {
        if (dados == null || dados.descricao() == null || dados.descricao().trim().length() < 3) {
            return ResponseEntity.badRequest().body(Map.of(
                    "erro", "DESCRICAO_VAZIA",
                    "mensagem", "Escreva uma descrição do produto antes de solicitar a análise."));
        }
        return ResponseEntity.ok(service.analisar(dados));
    }

    @ExceptionHandler(IaIndisponivelException.class)
    public ResponseEntity<Map<String, String>> indisponivel(IaIndisponivelException e) {
        log.warn("Assistente de IA indisponível: {}", e.getMessage());
        return ResponseEntity.status(503).body(Map.of("erro", "IA_INDISPONIVEL", "mensagem", MSG_INDISPONIVEL));
    }
}
