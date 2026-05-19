(function () {
  var form = document.getElementById("vw-contact-form");
  if (!form) return;

  var errorEl = document.getElementById("vw-form-error");
  var submitBtn = form.querySelector('button[type="submit"]');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  }

  function showSuccess() {
    form.innerHTML =
      '<div class="form-sent">' +
      '  <div class="tick" aria-hidden="true">' +
      '    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">' +
      '      <path d="M4 10 L9 15 L17 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="square"/>' +
      "    </svg>" +
      "  </div>" +
      "  <h4>Inquiry received.</h4>" +
      "  <p>Thank you. A member of the Veridor Works team will respond within two business days.</p>" +
      "</div>";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showError("");

    var required = ["f-name", "f-email", "f-topic", "f-message"];
    var ok = true;
    required.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || !el.value || !el.value.trim()) {
        if (el) el.style.borderBottomColor = "#C9A767";
        ok = false;
      } else {
        el.style.borderBottomColor = "";
      }
    });

    var emailEl = document.getElementById("f-email");
    if (
      emailEl &&
      emailEl.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)
    ) {
      emailEl.style.borderBottomColor = "#C9A767";
      ok = false;
    }
    if (!ok) {
      showError("Please complete all required fields.");
      return;
    }

    var websiteEl = document.getElementById("f-website");
    var payload = {
      name: document.getElementById("f-name").value.trim(),
      company: (document.getElementById("f-company").value || "").trim(),
      email: emailEl.value.trim(),
      topic: document.getElementById("f-topic").value,
      message: document.getElementById("f-message").value.trim(),
      website: websiteEl ? websiteEl.value : "",
    };

    form.classList.add("is-sending");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          showSuccess();
          return;
        }
        var msg =
          (result.data && result.data.error) ||
          "Unable to send your message. Please try again later.";
        showError(msg);
        form.classList.remove("is-sending");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send inquiry";
        }
      })
      .catch(function () {
        showError("Unable to send your message. Please try again later.");
        form.classList.remove("is-sending");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send inquiry";
        }
      });
  });
})();
