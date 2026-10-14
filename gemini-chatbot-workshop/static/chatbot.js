/**
 * Chatbot widget — talks to /api/chat on the Flask backend.
 * Uses textContent (not innerHTML) for XSS safety.
 */
(function () {
  var CHAT_URL = "/api/chat";
  var sessionId = "";

  var toggle  = document.getElementById("chatToggle");
  var panel   = document.getElementById("chatPanel");
  var input   = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var msgs    = document.getElementById("chatMessages");
  var typing  = document.getElementById("typing");

  // Open / close
  toggle.addEventListener("click", function () {
    var open = panel.classList.toggle("open");
    toggle.textContent = open ? "✕" : "💬";
    if (open) input.focus();
  });

  // Add a chat bubble
  function addMsg(text, cls) {
    var div = document.createElement("div");
    div.className = "msg " + cls;
    div.textContent = text;
    msgs.insertBefore(div, typing);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Send message
  function send() {
    var text = input.value.trim();
    if (!text) return;

    addMsg(text, "user");
    input.value = "";
    sendBtn.disabled = true;
    typing.classList.add("on");
    msgs.scrollTop = msgs.scrollHeight;

    fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, session_id: sessionId }),
    })
      .then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, data: d }; });
      })
      .then(function (res) {
        typing.classList.remove("on");
        sendBtn.disabled = false;
        if (res.ok) {
          addMsg(res.data.reply, "bot");
          if (res.data.session_id) sessionId = res.data.session_id;
        } else {
          addMsg(res.data.error || "Something went wrong.", "err");
        }
      })
      .catch(function () {
        typing.classList.remove("on");
        sendBtn.disabled = false;
        addMsg("Can't reach the server — is app.py running?", "err");
      });
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
  });
})();
