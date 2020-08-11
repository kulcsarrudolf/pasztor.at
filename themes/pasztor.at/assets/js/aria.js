(function () {
    const mobile_menu_toggle = document.getElementById("show-mobile-menu");
    const mobile_menu = document.getElementById("mobile-menu")
    const hamburger = document.getElementById("hamburger")
    mobile_menu_toggle.addEventListener( 'change', function() {
        if(this.checked) {
            mobile_menu.setAttribute("aria-modal", "true");
            mobile_menu.setAttribute("aria-hidden", "false");
            hamburger.setAttribute("aria-hidden", "true");
        } else {
            mobile_menu.setAttribute("aria-modal", "false");
            mobile_menu.setAttribute("aria-hidden", "true");
            hamburger.setAttribute("aria-hidden", "false");
        }
    });

    const audio_toggle = document.getElementById("player");
    if (audio_toggle !== null) {
        const audio_overlay = document.getElementById("audio-overlay")
        audio_toggle.addEventListener('change', function () {
            if (this.checked) {
                audio_overlay.setAttribute("aria-modal", "true");
                audio_overlay.setAttribute("aria-hidden", "false");
            } else {
                audio_overlay.setAttribute("aria-modal", "false");
                audio_overlay.setAttribute("aria-hidden", "true");
            }
        });
    }
})();