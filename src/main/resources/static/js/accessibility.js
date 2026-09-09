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

    var state = { fontScale: DEFAULT, highContrast: false, theme: null, readOnFocus: false };

    // ---- Leitura por voz (Web Speech API nativa do navegador) ----
    var speechSupported = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
    var ptVoice = null;

    function loadVoices() {
        if (!speechSupported) { return; }
        var voices = window.speechSynthesis.getVoices() || [];
        ptVoice = voices.filter(function (v) { return /pt(-|_)?br/i.test(v.lang); })[0]
            || voices.filter(function (v) { return /^pt/i.test(v.lang); })[0]
            || null;
    }

    function stopSpeak() {
        if (speechSupported) { window.speechSynthesis.cancel(); }
    }

    function speak(text) {
        if (!speechSupported || !text) { return; }
        var clean = String(text).replace(/\s+/g, ' ').trim();
        if (!clean) { return; }
        stopSpeak();
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = ptVoice ? ptVoice.lang : 'pt-BR';
        if (ptVoice) { u.voice = ptVoice; }
        u.rate = 1;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
    }

    function readMain() {
        if (!speechSupported) {
            announce('Leitura por voz não é suportada neste navegador.');
            return;
        }
        var main = document.getElementById('conteudo-principal') || document.querySelector('main') || document.body;
        speak(main.innerText || main.textContent);
        announce('Iniciando leitura da página.');
    }

    // Nome acessível de um elemento para a leitura sob foco/mouse
    function accessibleName(el) {
        if (!el || el === document || el === document.body) { return ''; }
        if (el.getAttribute && el.getAttribute('aria-label')) { return el.getAttribute('aria-label'); }
        if (el.tagName === 'IMG' && el.getAttribute('alt')) { return el.getAttribute('alt'); }
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
            var id = el.getAttribute('id');
            if (id) {
                var lbl = document.querySelector('label[for="' + id + '"]');
                if (lbl) { return lbl.textContent; }
            }
            return el.getAttribute('placeholder') || el.getAttribute('name') || '';
        }
        var txt = (el.innerText || el.textContent || '').trim();
        return txt.length > 240 ? txt.slice(0, 240) : txt;
    }

    var focusReadTimer = null;
    function onFocusRead(e) {
        var name = accessibleName(e.target);
        if (name) { speak(name); }
    }
    function onHoverRead(e) {
        var el = e.target;
        if (!el || !el.closest) { return; }
        var interactive = el.closest('a, button, input, select, textarea, [role="button"], h1, h2, h3, .card');
        if (!interactive) { return; }
        clearTimeout(focusReadTimer);
        focusReadTimer = setTimeout(function () {
            var name = accessibleName(interactive);
            if (name) { speak(name); }
        }, 250);
    }

    function applyReadOnFocus() {
        var btn = document.getElementById('a11y-readfocus-btn');
        if (btn) { btn.setAttribute('aria-pressed', String(state.readOnFocus)); }
        document.removeEventListener('focusin', onFocusRead, true);
        document.removeEventListener('mouseover', onHoverRead, true);
        if (state.readOnFocus && speechSupported) {
            document.addEventListener('focusin', onFocusRead, true);
            document.addEventListener('mouseover', onHoverRead, true);
        }
    }

    function toggleReadOnFocus() {
        if (!speechSupported) {
            announce('Leitura por voz não é suportada neste navegador.');
            return;
        }
        state.readOnFocus = !state.readOnFocus;
        applyReadOnFocus(); save();
        announce(state.readOnFocus ? 'Leitura ao focar itens ativada.' : 'Leitura ao focar itens desativada.');
    }

    function load() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && typeof saved === 'object') {
                if (typeof saved.fontScale === 'number') { state.fontScale = saved.fontScale; }
                if (typeof saved.highContrast === 'boolean') { state.highContrast = saved.highContrast; }
                if (saved.theme === 'light' || saved.theme === 'dark') { state.theme = saved.theme; }
                if (typeof saved.readOnFocus === 'boolean') { state.readOnFocus = saved.readOnFocus; }
            }
        } catch (e) { /* ignora armazenamento indisponível */ }
    }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    // Tema efetivo: a escolha salva ou, na 1ª visita, a preferência do sistema.
    function effectiveTheme() {
        if (state.theme === 'light' || state.theme === 'dark') { return state.theme; }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { return 'dark'; }
        return 'light';
    }

    function updateThemeButton() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) { return; }
        var isDark = effectiveTheme() === 'dark';
        var sun = btn.querySelector('.theme-icon-light');
        var moon = btn.querySelector('.theme-icon-dark');
        var text = btn.querySelector('.theme-toggle-text');
        // Em modo escuro, o botão oferece voltar ao claro (mostra sol).
        if (sun) { sun.hidden = !isDark; }
        if (moon) { moon.hidden = isDark; }
        if (text) { text.textContent = isDark ? 'Modo claro' : 'Modo escuro'; }
        btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
        btn.setAttribute('aria-pressed', String(isDark));
    }

    function apply() {
        document.documentElement.style.fontSize = state.fontScale + '%';
        document.documentElement.classList.toggle('a11y-high-contrast', state.highContrast);
        document.documentElement.setAttribute('data-bs-theme', effectiveTheme());
        var contrastBtn = document.getElementById('a11y-contrast-btn');
        if (contrastBtn) { contrastBtn.setAttribute('aria-pressed', String(state.highContrast)); }
        updateThemeButton();
    }

    function toggleTheme() {
        state.theme = (effectiveTheme() === 'dark') ? 'light' : 'dark';
        apply(); save();
        announce(state.theme === 'dark' ? 'Modo escuro ativado.' : 'Modo claro ativado.');
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
        stopSpeak();
        state = { fontScale: DEFAULT, highContrast: false, theme: null, readOnFocus: false };
        apply(); applyReadOnFocus(); save();
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

        var themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) { themeBtn.addEventListener('click', toggleTheme); }

        // Leitura por voz
        if (speechSupported) {
            loadVoices();
            if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
        var readBtn = document.getElementById('a11y-read-btn');
        var stopBtn = document.getElementById('a11y-stop-btn');
        var readFocusBtn = document.getElementById('a11y-readfocus-btn');
        var voiceGroup = document.getElementById('a11y-voice-group');

        if (!speechSupported && voiceGroup) {
            voiceGroup.setAttribute('hidden', '');
        }
        if (readBtn) { readBtn.addEventListener('click', readMain); }
        if (stopBtn) { stopBtn.addEventListener('click', function () { stopSpeak(); announce('Leitura interrompida.'); }); }
        if (readFocusBtn) { readFocusBtn.addEventListener('click', toggleReadOnFocus); }
        applyReadOnFocus();

        // Fechar com Esc e devolver o foco ao botão
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                stopSpeak();
                var panel = document.getElementById('a11y-panel');
                if (panel && !panel.hasAttribute('hidden')) {
                    togglePanel(false);
                    if (fab) { fab.focus(); }
                }
            }
        });
    }

    // Aplica o tamanho e o tema o quanto antes para evitar "flash" de layout.
    load();
    if (document.documentElement) {
        document.documentElement.style.fontSize = state.fontScale + '%';
        document.documentElement.classList.toggle('a11y-high-contrast', state.highContrast);
        document.documentElement.setAttribute('data-bs-theme', effectiveTheme());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
