var privacyFeatures = [
    {
        id: "google-analytics",
        title: "Google Analytics",
        description:
          "Google Analytics helps me understand what content visitors like and read, so I can create more content like it. " +
          (navigator.doNotTrack === '1'?"This setting is disabled by default because of your browser DNT settings.":""),
        disabled: (navigator.doNotTrack === '1'),
        callback: function() {
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'UA-108462692-1', {'anonymize_ip': true, 'allow_ad_personalization_signals': false});

            var scriptElement = document.createElement("script");
            scriptElement.setAttribute("async", "async");
            scriptElement.src = "https://www.googletagmanager.com/gtag/js?id=UA-108462692-1";
            document.body.appendChild(scriptElement);

            var eventLinks = document.querySelectorAll('[data-event]');
            for (var i = 0; i < eventLinks.length; i++) {
                if (eventLinks.hasOwnProperty(i)) {
                    var eventLink = eventLinks[i];
                    eventLink.addEventListener("click", function() {
                        gtag(
                            'event',
                            this.dataset.eventCategory,
                            {
                                method: this.dataset.event
                            }
                        );
                    });
                }
            }
        }
    }
];

var privacyPolicyUpdated = new Date('2019-08-24');

var getCookie = function(cookieName) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + cookieName + "=");
    if (parts.length > 1) return decodeURIComponent(parts.pop().split(";").shift());
};

var setCookie = function (cookieName, cookieValue, expiry) {
    var now = new Date();
    now.setTime(now.getTime() + expiry * 1000);
    var expires = "expires=" + now.toUTCString();
    document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + ";" + expires + ";path=/";
};

var deleteCookie = function (cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
};

var loadSettings = function() {
    var privacySettings;
    try {
        privacySettings = JSON.parse(getCookie("privacy-settings") || "{}");
    } catch (e) {
        privacySettings = {};
    }

    if (typeof privacySettings['saved'] === "undefined") {
        privacySettings.saved = false
    } else {
        privacySettings.saved = !!privacySettings.saved;
    }

    if (typeof privacySettings['policyDate'] !== "string") {
        privacySettings['policyDate'] = "";
    }

    if (typeof privacySettings['settings'] === "undefined" || typeof privacySettings['settings'] !== "object") {
        privacySettings.settings = {};
    }

    for (var i = 0; i < privacyFeatures.length; i++) {
        var privacyFeature = privacyFeatures[i];
        if (navigator.doNotTrack === '1') {
            privacySettings.settings[privacyFeatures[i].id] = null;
        } else if (typeof privacySettings.settings[privacyFeatures[i].id] !== "boolean") {
            privacySettings.settings[privacyFeatures[i].id] = true;
        } else {
            privacySettings.settings[privacyFeatures[i].id] = !!privacySettings.settings[privacyFeatures[i].id];
        }
    }

    return privacySettings;
};

var privacySettings = loadSettings();

var formatDate = function(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
};

var createPrivacyToggle = function(id, title, description, disabled, checked) {
    var label = document.createElement("label");
    label.for = "privacy__checkbox--" + id;
    label.className = "privacy__toggle privacy__toggle--" + id;

    var input = document.createElement("input");
    input.id = "privacy__checkbox--" + id;
    input.className = "privacy__checkbox privacy__checkbox--" + id;
    input.type = "checkbox";
    input.value = id;
    input.checked = !!checked;
    label.appendChild(input);

    var sliderContainer = document.createElement("div");
    sliderContainer.className = "privacy__slidercontainer";
    var slider = document.createElement("div");
    slider.className = "privacy__slider";
    sliderContainer.appendChild(slider);
    label.appendChild(sliderContainer);

    var titleDiv = document.createElement("div");
    titleDiv.className = "privacy__title";
    titleDiv.appendChild(document.createTextNode(title));
    label.appendChild(titleDiv);

    var descriptionDiv = document.createElement("div");
    descriptionDiv.className = "privacy__description";
    descriptionDiv.appendChild(document.createTextNode(description));
    label.appendChild(descriptionDiv);

    return label;
};

var showModal = function(privacyModal) {
    document.body.classList.add("body--modal-open");
    privacyModal.classList.add("modal--hide");
    setTimeout(function() {
        privacyModal.classList.add("modal--show");
        privacyModal.classList.remove("modal--hide");
    }, 10);
};

var hideModal = function(privacyModal) {
    document.body.classList.remove("body--modal-open");
    privacyModal.classList.remove("modal--show");
    privacyModal.classList.add("modal--hide");
    setTimeout(function() {
        privacyModal.classList.remove("modal--hide");
    }, 675);
};

var saveSettings = function(privacyModal, privacySettings) {
    privacySettings.policyDate = formatDate(privacyPolicyUpdated);
    privacySettings.saved = true;
    setCookie("privacy-settings", JSON.stringify(privacySettings), 365*24*3600);
    hideModal(privacyModal);
    if (window.location.pathname !== "/privacy") {
        for (var i = 0; i < privacyFeatures.length; i++) {
            var privacyFeature = privacyFeatures[i];
            if (privacySettings.settings[privacyFeature.id]) {
                privacyFeature.callback();
            }
        }
    }
};

var createPrivacyModal = function(lastModifiedDate) {
    var modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.innerHTML =
        "<div class=\"modal__background\"></div>" +
        "<div class=\"modal__container\">" +
        "    <div class=\"modal__window content\">" +
        "        <div class=\"modal__title\"><h1>Privacy settings</h1></div>" +
        "        <div class=\"modal__body\">" +
        "            <div class=\"modal__section\">" +
        "                <p>Please select your privacy preferences:</p>" +
        "                <div class=\"privacy\"></div>" +
        "                <p>These settings can be changed later on the <a href=\"/privacy\">privacy page</a>.</p>" +
        "                <p>By clicking &ldquo;I accept&rdquo; you accept the <a href=\"/privacy\">Privacy Policy</a> and <a href=\"/terms\">Terms of Service</a> of this website.  (Last updated: " + formatDate(lastModifiedDate) + ")</p>" +
        "            </div>" +
        "       </div>" +
        "       <div class=\"modal__footer\">" +
        "           <button class=\"privacy__save\">I accept</button>" +
        "       </div>" +
        "    </div>" +
        "</div>";

    var privacyRoot = modalDiv.getElementsByClassName("privacy")[0];
    for (var i = 0; i < privacyFeatures.length; i++) {
        var privacyFeature = privacyFeatures[i];
        privacyRoot.appendChild(createPrivacyToggle(
            privacyFeature.id,
            privacyFeature.title,
            privacyFeature.description,
            privacyFeature.disabled,
            privacySettings.settings[privacyFeature.id]
        ));
    }
    modalDiv.getElementsByClassName("privacy__save")[0].addEventListener("click", function() {
        for (var i = 0; i < privacyFeatures.length; i++) {
            var privacyFeature = privacyFeatures[i];
            var toggleElement = document.getElementById("privacy__checkbox--" + privacyFeature.id);
            privacySettings.settings[privacyFeature.id] = toggleElement.disabled?null:toggleElement.checked;
        }
        saveSettings(modalDiv, privacySettings);
    });
    return modalDiv;
};

var onStylesheetLoaded = function() {
    var privacyModal = createPrivacyModal(
        privacyPolicyUpdated
    );
    document.body.appendChild(privacyModal);

    var privacyOpenButtons = document.getElementsByClassName("privacy__open");
    for (var i = 0; i < privacyOpenButtons.length; i++) {
        privacyOpenButtons[i].removeAttribute("disabled");
        privacyOpenButtons[i].addEventListener("click", function() {
            showModal(privacyModal);
        });
    }

    if (!privacySettings.saved || privacySettings.policyDate !== formatDate(privacyPolicyUpdated)) {
        if (window.location.pathname !== "/privacy") {
            showModal(privacyModal);
        }
    } else {
        saveSettings(privacyModal, privacySettings);
    }
};

var stylesheetLink = document.createElement("link");
stylesheetLink.rel = "stylesheet";
stylesheetLink.onload = onStylesheetLoaded;
stylesheetLink.href="/assets/site.css";
document.head.appendChild(stylesheetLink);
