// La Varieta — lightweight "Quick Questions" helper.
//
// Deliberately NOT an AI chatbot: it's a self-contained, client-side FAQ helper
// with tappable questions plus best-effort keyword matching on typed input. Every
// answer is drawn from the site's own copy, and anything it can't match hands off
// to Pierre (WhatsApp / brief) rather than dead-ending with "I didn't understand."
// No backend, no API key, no external requests. Remove the <script> tag in
// index.html to disable it entirely.
(function () {
  'use strict';

  var EMAIL = 'lavarietataiwan@gmail.com';
  var WA_NUMBER = '886976271060';
  var WA_URL = 'https://wa.me/' + WA_NUMBER + '?text=' +
    encodeURIComponent('Hello Pierre, I have a question about sourcing with La Varieta.');

  // Answers use the site's own FAQ / section copy — no new claims.
  var QA = [
    { id: 'source', q: 'What can Pierre source?',
      a: 'Almost anything manufactured in Taiwan or China. Pierre’s deepest factory relationships are in fans, hygiene products, and LED — but over 40 years he has sourced everything from warehouse racking to construction materials. Send your product details and he will tell you honestly whether it is a fit.',
      keys: ['source', 'sourcing', 'make', 'made', 'product', 'products', 'fan', 'fans', 'wipe', 'wipes', 'led', 'manufactur', 'what can', 'what do you', 'category', 'categories', 'goods'] },
    { id: 'cost', q: 'How much does a Sourcing Review cost?',
      a: 'The initial review is a paid service for serious buyers. Send your product details and we will give you a clear quote before any commitment.',
      keys: ['cost', 'costs', 'price', 'pricing', 'fee', 'fees', 'how much', 'pay', 'payment', 'quote', 'expensive', 'charge', 'rate', 'budget'] },
    { id: 'moq', q: 'What’s the minimum order quantity?',
      a: 'MOQ depends on the product and the factory. Tell us your target quantity in your brief — Pierre will tell you honestly whether it is realistic.',
      keys: ['moq', 'minimum', 'minimums', 'quantity', 'quantities', 'order quantity', 'how many', 'units', 'volume', 'small order', 'low quantity'] },
    { id: 'shipping', q: 'Do you handle shipping and logistics?',
      a: 'Yes. La Varieta coordinates quality control and the shipping handoff — export documents, freight coordination, and delivery follow-up — so your order does not stall at the port.',
      keys: ['ship', 'shipping', 'logistic', 'logistics', 'freight', 'deliver', 'delivery', 'export', 'customs', 'port', 'import', 'transport', 'qc', 'quality control'] },
    { id: 'existing', q: 'Can Pierre review suppliers I already found?',
      a: 'Yes. Many buyers come to us with a shortlist. Pierre reviews the suppliers, quotes, and samples, and helps you judge which factory is actually right — before money is committed.',
      keys: ['supplier', 'suppliers', 'factory', 'factories', 'shortlist', 'already', 'found', 'vet', 'verify', 'verification', 'compare', 'audit', 'existing', 'my own'] },
    { id: 'where', q: 'Where is La Varieta based?',
      a: 'New Taipei City, Taiwan — working alongside High Sun Group in Hong Kong and mainland China, with family in the United States supporting American clients in their own time zone.',
      keys: ['where', 'located', 'location', 'based', 'country', 'taiwan', 'office', 'address', 'china', 'hong kong', 'based in'] },
    { id: 'start', q: 'How do I get started?',
      a: 'Tell Pierre what you want to source: send your details through the form and he reviews every project personally — or message him directly on WhatsApp.',
      keys: ['start', 'begin', 'get started', 'how do i', 'first step', 'next step', 'brief', 'sign up', 'onboard', 'process', 'how does it work', 'how it works'] },
    { id: 'contact', q: 'How can I reach Pierre?',
      a: 'Message Pierre on WhatsApp for the fastest reply, email ' + EMAIL + ', or send a full brief through the form — he reviews every project personally.',
      keys: ['contact', 'reach', 'email', 'whatsapp', 'phone', 'call', 'talk', 'speak', 'message', 'get in touch', 'reach out'] }
  ];

  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.45-9.43a9.38 9.38 0 0 1 6.67 2.77 9.35 9.35 0 0 1 2.76 6.67c-.01 5.2-4.24 9.43-9.42 9.43zm8.02-17.45A11.32 11.32 0 0 0 12.04.72C5.8.72.72 5.8.72 12.03c0 2 .52 3.95 1.52 5.67L.63 23.5l5.94-1.56a11.3 11.3 0 0 0 5.46 1.39h.01c6.24 0 11.32-5.08 11.32-11.31a11.25 11.25 0 0 0-3.29-7.97z"/></svg>';
  var CHAT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var SEND_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  var CSS =
    '.lvchat-launch{position:fixed;right:22px;bottom:22px;z-index:9998;display:inline-flex;align-items:center;gap:9px;background:#6E2131;color:#F8F3E9;border:none;cursor:pointer;font-family:Karla,sans-serif;font-size:14px;font-weight:700;letter-spacing:.02em;padding:13px 20px;border-radius:999px;box-shadow:0 10px 30px rgba(42,51,66,.28);transition:background .18s,transform .18s}' +
    '.lvchat-launch:hover{background:#571825;transform:translateY(-1px)}' +
    '.lvchat-launch svg{width:19px;height:19px;flex:none}' +
    '.lvchat-launch.lvchat-hidden{opacity:0;visibility:hidden;pointer-events:none}' +
    '.lvchat-panel{position:fixed;right:22px;bottom:22px;z-index:9999;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 44px);display:flex;flex-direction:column;background:#FDFAF3;border:1px solid rgba(183,139,68,.5);border-radius:12px;box-shadow:0 24px 60px rgba(42,51,66,.32);overflow:hidden;opacity:0;transform:translateY(12px) scale(.98);transition:opacity .2s,transform .2s;pointer-events:none}' +
    '.lvchat-panel.lvchat-open{opacity:1;transform:none;pointer-events:auto}' +
    '.lvchat-head{background:#6E2131;color:#F8F3E9;padding:15px 16px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex:none}' +
    '.lvchat-head h3{font-family:\'Cormorant Garamond\',serif;font-weight:600;font-size:21px;margin:0;color:#F8F3E9;line-height:1.1}' +
    '.lvchat-head p{font-size:12px;color:rgba(248,243,233,.82);margin:4px 0 0;line-height:1.4}' +
    '.lvchat-close{background:transparent;border:none;color:rgba(248,243,233,.85);cursor:pointer;font-size:24px;line-height:1;padding:0 2px;border-radius:4px;flex:none}' +
    '.lvchat-close:hover{color:#F8F3E9}' +
    '.lvchat-body{flex:1 1 auto;overflow-y:auto;padding:15px 15px 8px;-webkit-overflow-scrolling:touch}' +
    '.lvchat-intro{font-size:13.5px;line-height:1.6;color:#5A5346;margin:0 0 13px}' +
    '.lvchat-q{display:block;width:100%;text-align:left;background:#fff;border:1px solid rgba(183,139,68,.4);color:#2A3342;cursor:pointer;font-family:Karla,sans-serif;font-size:13.5px;font-weight:600;padding:11px 13px;border-radius:8px;margin:0 0 8px;transition:border-color .15s,background .15s}' +
    '.lvchat-q:hover{border-color:#B78B44;background:#F8F3E9}' +
    '.lvchat-back{display:inline-flex;align-items:center;gap:5px;background:transparent;border:none;color:#6E2131;cursor:pointer;font-family:Karla,sans-serif;font-size:12.5px;font-weight:700;padding:0;margin:0 0 12px}' +
    '.lvchat-back:hover{color:#B78B44}' +
    '.lvchat-asked{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#B78B44;margin:0 0 6px}' +
    '.lvchat-asked span{display:block;text-transform:none;letter-spacing:0;font-weight:600;font-size:14px;color:#2A3342;margin-top:3px}' +
    '.lvchat-ans-q{font-family:\'Cormorant Garamond\',serif;font-weight:600;font-size:22px;color:#6E2131;margin:0 0 8px;line-height:1.15}' +
    '.lvchat-ans-a{font-size:14px;line-height:1.7;color:#4A4636;margin:0}' +
    '.lvchat-foot{flex:none;border-top:1px solid rgba(183,139,68,.35);padding:11px 13px;background:#F8F3E9}' +
    '.lvchat-cta{display:flex;gap:8px;margin-bottom:9px}' +
    '.lvchat-cta a{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;font-family:Karla,sans-serif;font-size:12.5px;font-weight:700;padding:10px 8px;border-radius:6px;text-align:center;line-height:1.1}' +
    '.lvchat-cta a svg{width:15px;height:15px;flex:none}' +
    '.lvchat-cta .lvchat-wa{background:#25D366;color:#0B3D1E}' +
    '.lvchat-cta .lvchat-wa:hover{background:#1EBE5B}' +
    '.lvchat-cta .lvchat-brief{background:#6E2131;color:#F8F3E9}' +
    '.lvchat-cta .lvchat-brief:hover{background:#571825}' +
    '.lvchat-inputrow{display:flex;gap:8px;align-items:center}' +
    '.lvchat-input{flex:1;font-family:Karla,sans-serif;font-size:13.5px;padding:10px 12px;border:1px solid rgba(42,51,66,.25);border-radius:6px;background:#fff;color:#2A3342;min-width:0}' +
    '.lvchat-input::placeholder{color:#A79E8C}' +
    '.lvchat-input:focus{outline:none;border-color:#B78B44}' +
    '.lvchat-send{flex:none;background:#B78B44;border:none;color:#fff;cursor:pointer;width:38px;height:38px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center}' +
    '.lvchat-send:hover{background:#a07835}' +
    '.lvchat-send svg{width:17px;height:17px}' +
    '@media (max-width:520px){.lvchat-panel{top:12px;right:12px;left:12px;bottom:12px;width:auto;max-width:none;height:auto;max-height:none}.lvchat-launch{right:14px;bottom:14px}}' +
    '@media (prefers-reduced-motion:reduce){.lvchat-panel,.lvchat-launch{transition:none}}';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function ctaHtml() {
    return '<a class="lvchat-wa" href="' + WA_URL + '" target="_blank" rel="noopener">' + WA_SVG + 'WhatsApp</a>' +
      '<a class="lvchat-brief" href="#contact">Request a Review</a>';
  }

  function matchQuestion(text) {
    // normalize to single-spaced, then require each key to begin at a word
    // boundary (leading space). Prefix-style so stems match ("logistic" ->
    // "logistics") without false hits mid-word ("led" won't match "handled").
    var t = ' ' + text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    var best = null, bestScore = 0;
    QA.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) {
        if (t.indexOf(' ' + k) !== -1) score += k.length; // longer key match = stronger signal
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore > 0 ? best : null;
  }

  function init() {
    // inject styles
    var style = el('style');
    style.setAttribute('data-lvchat', '');
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);

    // launcher
    var launch = el('button', 'lvchat-launch', CHAT_SVG + '<span>Questions?</span>');
    launch.type = 'button';
    launch.setAttribute('aria-haspopup', 'dialog');
    launch.setAttribute('aria-expanded', 'false');
    launch.setAttribute('aria-label', 'Open quick questions');

    // panel
    var panel = el('div', 'lvchat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Quick questions about La Varieta');
    panel.setAttribute('tabindex', '-1');

    var head = el('div', 'lvchat-head');
    head.appendChild(el('div', null,
      '<h3>Quick questions</h3><p>Common answers, instantly — or message Pierre.</p>'));
    var closeBtn = el('button', 'lvchat-close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    head.appendChild(closeBtn);

    var body = el('div', 'lvchat-body');

    var foot = el('div', 'lvchat-foot');
    var cta = el('div', 'lvchat-cta', ctaHtml());
    var inputRow = el('div', 'lvchat-inputrow');
    var input = el('input', 'lvchat-input');
    input.type = 'text';
    input.placeholder = 'Type your question…';
    input.setAttribute('aria-label', 'Type your question');
    var send = el('button', 'lvchat-send', SEND_SVG);
    send.type = 'button';
    send.setAttribute('aria-label', 'Send question');
    inputRow.appendChild(input);
    inputRow.appendChild(send);
    foot.appendChild(cta);
    foot.appendChild(inputRow);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(foot);

    document.body.appendChild(launch);
    document.body.appendChild(panel);

    // ---- views ----
    function renderMenu() {
      body.textContent = '';
      body.appendChild(el('p', 'lvchat-intro',
        'Hi! I can answer common questions about sourcing with Pierre. Pick one below, or type your own.'));
      QA.forEach(function (item) {
        var b = el('button', 'lvchat-q');
        b.type = 'button';
        b.textContent = item.q;
        b.addEventListener('click', function () { showAnswer(item, null); });
        body.appendChild(b);
      });
      body.scrollTop = 0;
    }

    function backRow() {
      var back = el('button', 'lvchat-back',
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg><span>All questions</span>');
      back.type = 'button';
      back.addEventListener('click', renderMenu);
      return back;
    }

    // asked === null for a tapped question; a string for typed input (echoed safely)
    function showAnswer(item, asked) {
      body.textContent = '';
      body.appendChild(backRow());
      if (asked) {
        var askedEl = el('div', 'lvchat-asked', 'You asked');
        var s = el('span');
        s.textContent = '“' + asked + '”';
        askedEl.appendChild(s);
        body.appendChild(askedEl);
      }
      body.appendChild(el('div', 'lvchat-ans-q')).textContent = item.q;
      body.appendChild(el('div', 'lvchat-ans-a')).textContent = item.a;
      body.scrollTop = 0;
    }

    function showFallback(asked) {
      body.textContent = '';
      body.appendChild(backRow());
      var askedEl = el('div', 'lvchat-asked', 'You asked');
      var s = el('span');
      s.textContent = '“' + asked + '”';
      askedEl.appendChild(s);
      body.appendChild(askedEl);
      body.appendChild(el('div', 'lvchat-ans-q')).textContent = 'Best to ask Pierre directly';
      body.appendChild(el('div', 'lvchat-ans-a')).textContent =
        'I don’t have a quick answer for that one — but Pierre does. The fastest way is to message him on WhatsApp below, or send a short brief and he will reply personally.';
      body.scrollTop = 0;
    }

    function submitInput() {
      var text = input.value.trim();
      if (!text) return;
      var match = matchQuestion(text);
      if (match) showAnswer(match, text);
      else showFallback(text);
      input.value = '';
    }

    // ---- open / close ----
    var isOpen = false;
    function open() {
      if (isOpen) return;
      isOpen = true;
      renderMenu();
      panel.classList.add('lvchat-open');
      launch.classList.add('lvchat-hidden');
      launch.setAttribute('aria-expanded', 'true');
      panel.focus();
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onDocClick, true);
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('lvchat-open');
      launch.classList.remove('lvchat-hidden');
      launch.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick, true);
      launch.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    function onDocClick(e) {
      if (!panel.contains(e.target) && !launch.contains(e.target)) close();
    }

    launch.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    send.addEventListener('click', submitInput);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitInput(); }
    });
    // closing via a CTA / in-answer anchor (e.g. Request a Review → #contact)
    panel.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
