(function() {
    var byId = function(id) {
        return document.getElementById(id);
    };

    var loginForm = byId("loginForm"),
        loginMessage = byId("loginMessage"),
        usernameLabel = byId("usernameLabel"),
        usernameInput = byId("usernameInput"),
        passwordLabel = byId("passwordLabel"),
        passwordInput = byId("passwordInput"),
        loginButton = byId("loginButton");
        
    var setText = function(node, str) {
        if ("textContent" in node) {
            node.textContent = str;
        } else { // IE8
            node.innerText = str;
        }
    };

    var showMessage = function(str) {
        setText(loginMessage, str || "");
        loginMessage.style.display = str ? "block" : "none";
    };

    var hideMessage = function() {
        showMessage("");
    };

    var submit = function() {
        loginButton.setAttribute("disabled", "disabled");

        var xhr = new XMLHttpRequest(),
            json = JSON.stringify({
                action: "login",
                params: {
                    username: usernameInput.value,
                    password: passwordInput.value
                }
            });

        xhr.open("POST", "xas/" , true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Content-length", json.length);
        xhr.setRequestHeader("Connection", "close");

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            var msg;

            switch (xhr.status) {
                case 200: 
                    var url = /login\.html/.test(location) ? "index.html" : "index3.html",
                        match = /(?:\?|&)(profile=[^&]+)/.exec(location.search);

                    location = url + (match ? "?" + match[1] : "");
                    break;
                case 400:
                case 401:
                case 403:
                    msg = i18nMap.http401;
                    break;
                case 402:
                    msg = i18nMap.http402;
                    break;
                case 404:
                    msg = i18nMap.http404;
                    break;
                case 500:
                    msg = i18nMap.http500;
                    break;
                case 503:
                    msg = i18nMap.http503;
                    break;
                default:
                    msg = i18nMap.httpdefault;
            }

            showMessage(msg);
            loginButton.removeAttribute("disabled");
        }

        xhr.send(json);

        return false;
    };

    if (i18nMap) {
        var usernameText = i18nMap.username,
            passwordText = i18nMap.password,
            buttonText = i18nMap.loginButton;

        if (usernameText) {
            setText(usernameLabel, usernameText)
            usernameInput.setAttribute("placeholder", usernameText);
        }

        if (passwordText) {
            setText(passwordLabel, passwordText);
            passwordInput.setAttribute("placeholder", passwordText);
        }

        if (buttonText) {
            loginButton.value = buttonText;
        }
    }

    loginForm.onsubmit = submit;
    usernameInput.onkeydown = hideMessage;
    passwordInput.onkeydown = hideMessage;

    usernameInput.focus();

    document.cookie = "originURI=" + location.pathname + ";max-age=" + (60 * 60 * 24 * 365);
})();
