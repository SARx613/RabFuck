// ==UserScript==
// @name         Remplacement Pedi Skipit par SimpleWebClient
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remplace le contenu de pedi.skipit.com.ar par le site externe
// @author       Toi
// @match        https://pedi.skipit.com.ar/order
// @match        https://pedi.skipit.com.ar/order/*
// @match        https://pedi.skipit.com.ar/withdraw
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function integrerSite() {
        document.body.innerHTML = '';

        document.documentElement.style.cssText = 'margin:0;padding:0;height:100%;overflow:hidden;';
        document.body.style.cssText = 'margin:0;padding:0;height:100%;overflow:hidden;';

        var iframe = document.createElement('iframe');
        iframe.src = 'https://sarx613.github.io/RabFuck/';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay');
        iframe.style.cssText = [
            'display:block',
            'width:100%',
            'height:100%',
            'border:none',
            'position:fixed',
            'top:0',
            'left:0',
            'right:0',
            'bottom:0',
            'overflow:auto',
            '-webkit-overflow-scrolling:touch',
        ].join(';');

        document.body.appendChild(iframe);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', integrerSite);
    } else {
        integrerSite();
    }
})();
