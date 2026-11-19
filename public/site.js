// AWTY website: sends the "Tell me when it's ready" and "Contact us" forms to Netlify Forms without leaving the page.
// (Without JavaScript the forms still work: they go to the thank-you page instead.)
document.querySelectorAll("form[data-netlify]").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        msg.textContent = form.getAttribute("data-done");
        msg.className = "small form-msg done";
      })
      .catch(function () {
        msg.textContent = "Sorry, that didn't send. Please try again in a minute.";
        msg.className = "small form-msg err";
      })
      .then(function () { btn.disabled = false; });
  });
});
