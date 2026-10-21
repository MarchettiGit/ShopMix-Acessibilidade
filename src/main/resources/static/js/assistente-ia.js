(function () {
    "use strict";

    var $ = function (id) { return document.getElementById(id); };
    var btnAnalisar = $("ia-analisar");
    if (!btnAnalisar) { return; }

    var descricao = $("descricao");
    var altInput = $("imagemAlt");
    var status = $("ia-status");
    var mensagem = $("ia-mensagem");
    var resultado = $("ia-resultado");
    var sugestao = $("ia-sugestao");
    var btnEditar = $("ia-editar");
    var spinner = $("ia-spinner");
    var textoBtn = $("ia-analisar-texto");

    var csrfToken = document.querySelector('meta[name="_csrf"]');
    var csrfHeader = document.querySelector('meta[name="_csrf_header"]');

    function valor(id) {
        var el = $(id);
        return el && el.value ? el.value.trim() : "";
    }

    function avisar(texto, tipo) {
        mensagem.innerHTML = "";
        if (!texto) { return; }
        var div = document.createElement("div");
        div.className = "alert alert-" + (tipo || "info") + " py-2 mb-0";
        div.textContent = texto;
        mensagem.appendChild(div);
    }

    function carregando(ativo) {
        btnAnalisar.disabled = ativo;
        btnAnalisar.setAttribute("aria-busy", ativo ? "true" : "false");
        spinner.classList.toggle("d-none", !ativo);
        textoBtn.textContent = ativo ? "Analisando..." : "Analisar acessibilidade com IA";
    }

    function preencherLista(id, itens, vazio) {
        var ul = $(id);
        ul.innerHTML = "";
        (itens && itens.length ? itens : [vazio]).forEach(function (t) {
            var li = document.createElement("li");
            li.textContent = t;
            ul.appendChild(li);
        });
    }

    var ROTULO = { ALTA: "Prioridade alta", MEDIA: "Prioridade média", BAIXA: "Prioridade baixa" };

    function preencherOportunidades(lista) {
        var ol = $("ia-oportunidades");
        ol.innerHTML = "";
        if (!lista || !lista.length) {
            var vazio = document.createElement("li");
            vazio.textContent = "Nenhuma oportunidade relevante identificada.";
            ol.appendChild(vazio);
            return;
        }
        lista.forEach(function (o) {
            var li = document.createElement("li");
            var badge = document.createElement("span");
            badge.className = "ia-prioridade ia-prioridade-" + o.prioridade;
            badge.textContent = ROTULO[o.prioridade] || o.prioridade;
            var titulo = document.createElement("strong");
            titulo.textContent = o.problema;
            li.appendChild(badge);
            li.appendChild(titulo);
            if (o.motivo) {
                var m = document.createElement("div");
                m.className = "small";
                m.textContent = "Por que importa: " + o.motivo;
                li.appendChild(m);
            }
            if (o.recomendacao) {
                var r = document.createElement("div");
                r.className = "small";
                r.textContent = "Recomendação: " + o.recomendacao;
                li.appendChild(r);
            }
            ol.appendChild(li);
        });
    }

    function definirEdicao(ativa) {
        sugestao.readOnly = !ativa;
        btnEditar.setAttribute("aria-pressed", ativa ? "true" : "false");
        btnEditar.textContent = ativa ? "Concluir edição" : "Editar sugestão";
        if (ativa) { sugestao.focus(); }
    }

    function mostrar(dados) {
        $("ia-resumo").textContent = dados.resumo || "";
        var avisos = $("ia-avisos");
        avisos.innerHTML = "";
        (dados.avisos || []).forEach(function (a) {
            var div = document.createElement("div");
            div.className = "alert alert-warning py-2";
            div.setAttribute("role", "note");
            div.textContent = a;
            avisos.appendChild(div);
        });
        preencherLista("ia-positivos", dados.pontosPositivos, "Nenhum ponto positivo destacado.");
        preencherLista("ia-confirmar", dados.dadosAConfirmar, "Nenhum dado pendente identificado.");
        preencherOportunidades(dados.oportunidades);
        sugestao.value = dados.sugestaoDescricao || "";
        definirEdicao(false);

        var altBloco = $("ia-alt-bloco");
        if (altInput && dados.sugestaoTextoAlternativo) {
            $("ia-sugestao-alt").value = dados.sugestaoTextoAlternativo;
            altBloco.classList.remove("d-none");
        } else {
            altBloco.classList.add("d-none");
        }
        resultado.classList.remove("d-none");
        resultado.focus();
    }

    function analisar() {
        if (valor("descricao").length < 3) {
            avisar("Escreva uma descrição do produto antes de solicitar a análise.", "warning");
            descricao.focus();
            return;
        }
        carregando(true);
        avisar("Analisando a descrição. Isso pode levar alguns segundos; você pode continuar editando o formulário.", "info");

        var headers = { "Content-Type": "application/json", "Accept": "application/json" };
        if (csrfToken && csrfHeader) { headers[csrfHeader.content] = csrfToken.content; }

        fetch("/ia/acessibilidade/analisar", {
            method: "POST",
            headers: headers,
            credentials: "same-origin",
            body: JSON.stringify({
                nome: valor("nome"), descricao: valor("descricao"), categoria: valor("categoria"),
                subcategoria: valor("subcategoria"), marca: valor("marca"), peso: valor("peso"),
                altura: valor("altura"), largura: valor("largura"), comprimento: valor("comprimento"),
                unidadeMedida: valor("unidadeMedida"), imagemAlt: valor("imagemAlt")
            })
        }).then(function (resp) {
            return resp.json().catch(function () { return {}; }).then(function (corpo) {
                if (!resp.ok) { throw new Error(corpo.mensagem || "Não foi possível concluir a análise agora. Você pode salvar o produto normalmente."); }
                return corpo;
            });
        }).then(function (dados) {
            avisar("Análise concluída. Revise as sugestões abaixo antes de aplicar.", "success");
            mostrar(dados);
        }).catch(function (erro) {
            avisar(erro.message || "Não foi possível concluir a análise agora.", "warning");
        }).finally(function () {
            carregando(false);
        });
    }

    function atualizarStatus() {
        fetch("/ia/acessibilidade/status", { credentials: "same-origin", headers: { "Accept": "application/json" } })
            .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
            .then(function (s) {
                if (!s.habilitado) {
                    status.textContent = "Assistente desativado na configuração do sistema.";
                } else if (s.disponivel) {
                    status.textContent = "Assistente disponível (modelo local " + s.modelo + ").";
                } else {
                    status.textContent = "Assistente indisponível: o Ollama local não foi encontrado ou o modelo "
                        + s.modelo + " não está instalado. O cadastro funciona normalmente.";
                }
            })
            .catch(function () {
                status.textContent = "Não foi possível verificar o assistente. O cadastro funciona normalmente.";
            });
    }

    btnAnalisar.addEventListener("click", analisar);
    $("ia-reanalisar").addEventListener("click", analisar);

    $("ia-aplicar").addEventListener("click", function () {
        var texto = sugestao.value.trim();
        if (!texto) { avisar("Não há sugestão para aplicar.", "warning"); return; }
        descricao.value = texto;
        descricao.dispatchEvent(new Event("input", { bubbles: true }));
        definirEdicao(false);
        var pendente = /\[[^\]]+\]/.test(texto);
        avisar(pendente
            ? "Sugestão aplicada à descrição. Substitua os trechos entre colchetes pelos dados reais antes de salvar."
            : "Sugestão aplicada à descrição. Revise o texto e salve o produto quando quiser.", "success");
        descricao.focus();
    });

    btnEditar.addEventListener("click", function () {
        definirEdicao(sugestao.readOnly);
    });

    $("ia-manter").addEventListener("click", function () {
        resultado.classList.add("d-none");
        avisar("Descrição original mantida. Nenhuma alteração foi feita.", "secondary");
        descricao.focus();
    });

    $("ia-aplicar-alt").addEventListener("click", function () {
        var texto = $("ia-sugestao-alt").value.trim();
        if (!texto || !altInput) { return; }
        altInput.value = texto;
        altInput.dispatchEvent(new Event("input", { bubbles: true }));
        avisar("Texto alternativo da imagem atualizado.", "success");
        altInput.focus();
    });

    atualizarStatus();
})();
