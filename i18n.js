/* ============================================
   scRNA-seq Tutorial — i18n Engine
   ============================================ */
(function(){
  const STORAGE_KEY = 'scrna_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'zh';
  let pageTranslations = { zh: {}, en: {} };

  // Shared translations (nav, footer, common labels)
  const shared = {
    zh: {
      brand: 'scRNA-seq 教學',
      footer: '© Charlene — scRNA-seq Interactive Tutorial',
      prev: '← 上一步', next: '下一步 →',
      prevAdv: '← 上一個主題', nextAdv: '下一個主題 →',
      home: '🏠 回到首頁', homeTitle: '教學首頁',
      quizTitle: '📝 自我檢測',
      correct: '✅ 正確！', wrong: '❌ 正確答案已標示為綠色。',
      codeR: 'R / Seurat', codePy: 'Python / Scanpy',
      interactive: '⚡ 互動',
      kept: '保留', removed: '剔除',
    },
    en: {
      brand: 'scRNA-seq Tutorial',
      footer: '© Charlene — scRNA-seq Interactive Tutorial',
      prev: '← Previous', next: 'Next →',
      prevAdv: '← Previous Topic', nextAdv: 'Next Topic →',
      home: '🏠 Back to Home', homeTitle: 'Tutorial Home',
      quizTitle: '📝 Self-Check',
      correct: '✅ Correct!', wrong: '❌ The correct answer is highlighted in green.',
      codeR: 'R / Seurat', codePy: 'Python / Scanpy',
      interactive: '⚡ Interactive',
      kept: 'Kept', removed: 'Removed',
    }
  };

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    const dict = { ...shared[lang], ...pageTranslations[lang] };

    // Update all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    // Update all [data-i18n-html] elements
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // Update toggle button
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';

    // Update interactive panel labels
    document.querySelectorAll('.interactive-panel').forEach(p => {
      const lbl = p.querySelector('.interactive-label');
      if (lbl) lbl.textContent = dict.interactive || '';
    });

    // Fire custom event for page-specific JS to react
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function toggleLang() {
    applyLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  function registerTranslations(t) {
    if (t.zh) Object.assign(pageTranslations.zh, t.zh);
    if (t.en) Object.assign(pageTranslations.en, t.en);
  }

  function getLang() { return currentLang; }

  // Inject toggle button into nav
  function injectToggle() {
    const nav = document.querySelector('.top-nav-inner');
    if (!nav || document.getElementById('langToggle')) return;
    const btn = document.createElement('button');
    btn.id = 'langToggle';
    btn.className = 'lang-toggle';
    btn.textContent = currentLang === 'zh' ? 'EN' : '中';
    btn.onclick = toggleLang;
    nav.appendChild(btn);
  }

  // Auto-init
  document.addEventListener('DOMContentLoaded', () => {
    injectToggle();
    // Small delay to let page scripts register translations first
    setTimeout(() => applyLang(currentLang), 10);
  });

  // Expose API
  window.I18n = { applyLang, toggleLang, registerTranslations, getLang, shared };
})();
