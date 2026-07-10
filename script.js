// Lead form: builds a brief for Pierre and offers several ways to actually send it.
// mailto: only works if the visitor has a desktop mail app registered as the OS
// default — most Gmail/Outlook-web users on desktop don't, so a bare mailto link
// silently does nothing for them. We attempt it, but always back it with a Gmail
// compose link and a copy-to-clipboard fallback so no visitor is stuck.
(function () {
  var EMAIL = 'lavarietataiwan@gmail.com';
  var form = document.getElementById('lead-form');
  var done = document.getElementById('lead-done');
  var briefText = document.getElementById('brief-text');
  var copyStatus = document.getElementById('copy-status');
  var current = { subject: '', body: '' };

  function buildBrief() {
    var lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      if (f.name && f.value && f.value.trim()) lines.push(f.name + ': ' + f.value.trim());
    });
    var companyField = form.querySelector('[name="Company"]');
    var company = companyField ? companyField.value.trim() : '';
    var subject = 'Sourcing Review Request' + (company ? ' — ' + company : '');
    var body = 'Hello Pierre,\n\nI would like to request a sourcing review.\n\n' + lines.join('\n') + '\n\n(Attach any product photos or specs to this email.)';
    return { subject: subject, body: body };
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

    // best-effort: works for the subset of visitors with a desktop mail app configured
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(current.subject) + '&body=' + encodeURIComponent(current.body);
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

  document.getElementById('open-mailapp').addEventListener('click', function () {
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(current.subject) + '&body=' + encodeURIComponent(current.body);
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
