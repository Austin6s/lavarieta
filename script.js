// Lead form: builds a pre-filled mailto brief for Pierre, then shows the confirmation card.
(function () {
  var form = document.getElementById('lead-form');
  var done = document.getElementById('lead-done');

  document.getElementById('submit-brief').addEventListener('click', function () {
    var lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      if (f.name && f.value && f.value.trim()) lines.push(f.name + ': ' + f.value.trim());
    });
    var companyField = form.querySelector('[name="Company"]');
    var company = companyField ? companyField.value : '';
    var subject = 'Sourcing Review Request' + (company && company.trim() ? ' — ' + company.trim() : '');
    var body = 'Hello Pierre,\n\nI would like to request a sourcing review.\n\n' + lines.join('\n') + '\n\n(Attach any product photos or specs to this email.)';
    window.location.href = 'mailto:lavarietataiwan@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    // the form's inline display:grid would override the hidden attribute
    form.style.display = 'none';
    done.hidden = false;
  });

  document.getElementById('reset-brief').addEventListener('click', function () {
    done.hidden = true;
    form.style.display = 'grid';
  });
})();
