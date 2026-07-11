// Lead form: builds a brief for Pierre and offers several ways to actually send it.
//
// mailto: only works if the visitor has a desktop mail app registered as the OS
// default — most Gmail/Outlook-web users on desktop don't, so a bare mailto link
// silently does nothing for them. On mobile the mail app is (almost) always
// present, so we auto-open it there. On desktop we DON'T auto-fire mailto (it
// would just look like nothing happened); instead we present webmail options
// (Gmail, Outlook), the mail-app link for those who do have one, WhatsApp, and a
// copy-to-clipboard fallback so no visitor is ever stuck.
(function () {
  var EMAIL = 'lavarietataiwan@gmail.com';
  // WhatsApp number in international format, digits only (no +, spaces, or dashes).
  // Placeholder — swap for Pierre's WhatsApp-capable mobile number when available.
  var WHATSAPP = '18606340433';

  var form = document.getElementById('lead-form');
  var done = document.getElementById('lead-done');
  var briefText = document.getElementById('brief-text');
  var copyStatus = document.getElementById('copy-status');
  var sendIntro = document.getElementById('send-intro');
  var whatsappLink = document.getElementById('open-whatsapp');
  var mailAppBtn = document.getElementById('open-mailapp');
  var current = { subject: '', body: '', waText: '' };

  // "Open in Mail App" relies on mailto:, which does nothing on a desktop with no
  // registered mail client — most desktop visitors use webmail, so the button just
  // looks broken. Show it only on mobile, where a mail app is reliably present and
  // it's the fallback for the auto-open. Desktop users who use a mail client still
  // have the "Email Pierre directly" mailto link at the foot of the panel.
  if (!isMobileDevice()) mailAppBtn.style.display = 'none';

  // iPhones/Androids reliably have a mail app; iPadOS reports as "Macintosh" but
  // has touch points, so treat multi-touch Macs as tablets too.
  function isMobileDevice() {
    var ua = navigator.userAgent || '';
    if (/Android|iPhone|iPod|iPad|IEMobile|BlackBerry|Opera Mini|Mobile/i.test(ua)) return true;
    return navigator.maxTouchPoints > 1 && /Macintosh/.test(ua);
  }

  function collectLines() {
    var lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      if (f.name && f.value && f.value.trim()) lines.push(f.name + ': ' + f.value.trim());
    });
    return lines;
  }

  function buildBrief() {
    var lines = collectLines();
    var companyField = form.querySelector('[name="Company"]');
    var company = companyField ? companyField.value.trim() : '';
    var subject = 'Sourcing Review Request' + (company ? ' — ' + company : '');
    var body = 'Hello Pierre,\n\nI would like to request a sourcing review.\n\n' + lines.join('\n') + '\n\n(Attach any product photos or specs to this email.)';
    // WhatsApp has no subject line and no attachments prompt, so fold the subject
    // into the first line and adjust the closing note.
    var waText = subject + '\n\nHello Pierre, I would like to request a sourcing review.\n\n' + lines.join('\n') + '\n\n(I can share product photos, specs, or samples.)';
    return { subject: subject, body: body, waText: waText };
  }

  function mailtoUrl() {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(current.subject) + '&body=' + encodeURIComponent(current.body);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // fallback for browsers without the async Clipboard API
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
    return Promise.resolve();
  }

  document.getElementById('submit-brief').addEventListener('click', function () {
    current = buildBrief();
    briefText.value = 'To: ' + EMAIL + '\nSubject: ' + current.subject + '\n\n' + current.body;
    copyStatus.textContent = '';

    // point the WhatsApp button at a pre-filled chat with Pierre
    whatsappLink.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(current.waText);

    if (isMobileDevice()) {
      // mobile: the mail app is reliably present, so open it pre-filled
      sendIntro.textContent = 'We’ve opened your mail app with the brief ready to send. If nothing opened, choose an option below.';
      window.location.href = mailtoUrl();
    } else {
      // desktop: firing mailto here would look like nothing happened for the many
      // visitors on Gmail/Outlook web, so let them pick a channel instead
      sendIntro.textContent = 'Pick how you’d like to send your brief to Pierre.';
    }

    // best-effort: silently succeeds or fails depending on clipboard permissions
    copyToClipboard(briefText.value).catch(function () {});

    // the form's inline display:grid would override the hidden attribute
    form.style.display = 'none';
    done.hidden = false;
  });

  document.getElementById('open-gmail').addEventListener('click', function () {
    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) +
      '&su=' + encodeURIComponent(current.subject) + '&body=' + encodeURIComponent(current.body);
    window.open(url, '_blank', 'noopener');
  });

  document.getElementById('open-outlook').addEventListener('click', function () {
    var url = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(EMAIL) +
      '&subject=' + encodeURIComponent(current.subject) + '&body=' + encodeURIComponent(current.body);
    window.open(url, '_blank', 'noopener');
  });

  document.getElementById('open-mailapp').addEventListener('click', function () {
    window.location.href = mailtoUrl();
  });

  document.getElementById('copy-brief').addEventListener('click', function () {
    copyToClipboard(briefText.value).then(function () {
      copyStatus.textContent = 'Copied!';
    }, function () {
      briefText.focus();
      briefText.select();
      copyStatus.textContent = 'Couldn’t auto-copy — text is selected, press Ctrl/Cmd+C.';
    });
  });

  document.getElementById('reset-brief').addEventListener('click', function () {
    done.hidden = true;
    copyStatus.textContent = '';
    form.style.display = 'grid';
  });
})();
