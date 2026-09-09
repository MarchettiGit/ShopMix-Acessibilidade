/* =========================================================
   ShopMix - Painel de Acessibilidade
   Controla: tamanho do texto, alto contraste e restauração.
   As preferências ficam salvas no navegador (localStorage).
   ========================================================= */
(function () {
    'use strict';

    var STORAGE_KEY = 'shopmix-a11y';
    var MIN = 87.5;      // menor tamanho de texto (%)
    var MAX = 150;       // maior tamanho de texto (%)
    var STEP = 12.5;     // passo de aumento/diminuição
    var DEFAULT = 100;   // tamanho padrão

    var state = { fontScale: DEFAULT, highContrast: false };

    function load() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && typeof saved === 'object') {
                if (typeof saved.fontScale === 'number') { state.fontScale = saved.fontScale; }
                if (typeof saved.highContrast === 'boolean') { state.highContrast = saved.highContrast; }
            }
        } catch (e) { /* ignora armazenamento indisponível */ }
    }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function apply() {
        document.documentElement.style.fontSize = state.fontScale + '%';
        document.documentElement.classList.toggle('a11y-high-contrast', state.highContrast);
        var contrastBtn = document.getElementById('a11y-contrast-btn');
        if (contrastBtn) { contrastBtn.setAttribute('aria-pressed', String(state.highContrast)); }
    }

    function announce(msg) {
        var region = document.getElementById('a11y-status');
        if (region) { region.textContent = msg; }
    }

    function increase() {
        state.fontScale = Math.min(MAX, state.fontScale + STEP);
        apply(); save();
        announce('Tamanho do texto: ' + Math.round(state.fontScale) + ' por cento.');
    }
    function decrease() {
        state.fontScale = Math.max(MIN, state.fontScale - STEP);
        apply(); save();
        announce('Tamanho do texto: ' + Math.round(state.fontScale) + ' por cento.');
    }
    function toggleContrast() {
        state.highContrast = !state.highContrast;
        apply(); save();
        announce(state.highContrast ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
    }
    function reset() {
        state = { fontScale: DEFAULT, highContrast: false };
        apply(); save();
        announce('Configurações de acessibilidade restauradas.');
    }

    function togglePanel(open) {
        var panel = document.getElementById('a11y-panel');
        var fab = document.getElementById('a11y-fab');
        if (!panel || !fab) { return; }
        var willOpen = (typeof open === 'boolean') ? open : panel.hasAttribute('hidden');
        if (willOpen) {
            panel.removeAttribute('hidden');
            fab.setAttribute('aria-expanded', 'true');
            var first = panel.querySelector('button');
            if (first) { first.focus(); }
        } else {
            panel.setAttribute('hidden', '');
            fab.setAttribute('aria-expanded', 'false');
        }
    }

    function init() {
        load();
        apply();

        var fab = document.getElementById('a11y-fab');
        if (fab) { fab.addEventListener('click', function () { togglePanel(); }); }

        var inc = document.getElementById('a11y-increase-btn');
        var dec = document.getElementById('a11y-decrease-btn');
        var con = document.getElementById('a11y-contrast-btn');
        var res = document.getElementById('a11y-reset-btn');

        if (inc) { inc.addEventListener('click', increase); }
        if (dec) { dec.addEventListener('click', decrease); }
        if (con) { con.addEventListener('click', toggleContrast); }
        if (res) { res.addEventListener('click', reset); }

        // Fechar com Esc e devolver o foco ao botão
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                var panel = document.getElementById('a11y-panel');
                if (panel && !panel.hasAttribute('hidden')) {
                    togglePanel(false);
                    if (fab) { fab.focus(); }
                }
            }
        });
    }

    // Aplica o tamanho o quanto antes para evitar "flash" de layout.
    load();
    if (document.documentElement) {
        document.documentElement.style.fontSize = state.fontScale + '%';
        document.documentElement.classList.toggle('a11y-high-contrast', state.highContrast);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
