# Assistente de Acessibilidade (IA local com Ollama)

## O que faz
Na tela de cadastro/edição de produto (`/anunciar`, `/anuncio/editar/{id}`) o botão
**"Analisar acessibilidade com IA"** envia nome, descrição, categoria, marca, medidas e texto alternativo
para um modelo local (Ollama). O retorno mostra: resumo, pontos positivos, oportunidades com prioridade
(alta/média/baixa), dados a confirmar, sugestão de descrição revisada e sugestão de texto alternativo.

Ações: **Aplicar sugestão**, **Editar sugestão**, **Manter descrição original**, **Analisar novamente**.
Nada é gravado até o vendedor clicar em salvar o produto.

## Proteções contra informações inventadas
- Prompt com regras explícitas (somente fatos informados, colchetes para dados ausentes, temperatura 0.2).
- Resposta exigida em JSON Schema (`format` do Ollama) e validada no Java (`AcessibilidadeService`).
- Verificação automática: números e características sensíveis (cores, materiais, compatibilidades, garantia,
  voltagem etc.) que aparecem na sugestão mas não nos dados informados geram um **aviso** visível.
- A IA não acessa banco, SQL ou comandos: recebe só o texto do formulário.

## Instalação do Ollama
1. Baixe em https://ollama.com/download e instale.
2. `ollama pull llama3.1:8b`
3. Garanta que o serviço está ativo (`ollama serve` no Linux; no Windows/macOS o app inicia sozinho).
4. Verifique: `curl http://localhost:11434/api/tags` (deve listar `llama3.1:8b`).

## Configuração (`application.properties`)
```
shopmix.ia.enabled=true
shopmix.ia.ollama.base-url=http://localhost:11434
shopmix.ia.ollama.model=llama3.1:8b
shopmix.ia.ollama.connect-timeout=3s
shopmix.ia.ollama.request-timeout=180s
```
Pode sobrescrever na execução: `./mvnw spring-boot:run -Dspring-boot.run.arguments="--shopmix.ia.ollama.model=qwen2.5:7b"`.

## Endpoints (autenticados, CSRF obrigatório no POST)
- `GET  /ia/acessibilidade/status` → `{habilitado, disponivel, modelo}`
- `POST /ia/acessibilidade/analisar` (JSON) → resultado; `400` sem descrição; `503` se a IA estiver indisponível.

## Se o Ollama estiver desligado
A tela mostra "Assistente indisponível... O cadastro funciona normalmente" e o produto pode ser salvo.

## Limitações
- Em CPU, o `llama3.1:8b` pode levar de 1 a 3 minutos (a primeira chamada carrega o modelo). Com GPU é bem mais rápido.
- Modelos pequenos (ex.: `qwen2.5:1.5b`) inventam mais dados; os avisos ajudam, mas a revisão humana é obrigatória.
- Recomendação automatizada; não é certificação de acessibilidade.

## Arquivos
- `service/AcessibilidadeService.java` — comunicação com o Ollama, prompt, schema, validação e avisos
- `controller/AcessibilidadeController.java` — endpoints REST e tratamento de indisponibilidade
- `dto/AnaliseAcessibilidadeRequest.java`, `dto/AnaliseAcessibilidadeResultado.java`
- `static/js/assistente-ia.js`, `static/css/assistente-ia.css`, `templates/anunciar.html`
