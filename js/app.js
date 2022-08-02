(() => {
    "use strict";
    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    flsModules.popup = new Popup({});
    /*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
    (function(e, t) {
        var n, r, i = typeof t, o = e.location, a = e.document, s = a.documentElement, l = e.jQuery, u = e.$, c = {}, p = [], f = "1.10.2", d = p.concat, h = p.push, g = p.slice, m = p.indexOf, y = c.toString, v = c.hasOwnProperty, b = f.trim, x = function(e, t) {
            return new x.fn.init(e, t, r);
        }, w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = /\S+/g, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, E = /^[\],:{}\s]*$/, S = /(?:^|:|,)(?:\s*\[)+/g, A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, D = /^-ms-/, L = /-([\da-z])/gi, H = function(e, t) {
            return t.toUpperCase();
        }, q = function(e) {
            (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), 
            x.ready());
        }, _ = function() {
            a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), 
            e.detachEvent("onload", q));
        };
        x.fn = x.prototype = {
            jquery: f,
            constructor: x,
            init: function(e, n, r) {
                var i, o;
                if (!e) return this;
                if ("string" == typeof e) {
                    if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [ null, e, null ] : N.exec(e), 
                    !i || !i[1] && n) return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
                    if (i[1]) {
                        if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), 
                        k.test(i[1]) && x.isPlainObject(n)) for (i in n) x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                        return this;
                    }
                    if (o = a.getElementById(i[2]), o && o.parentNode) {
                        if (o.id !== i[2]) return r.find(e);
                        this.length = 1, this[0] = o;
                    }
                    return this.context = a, this.selector = e, this;
                }
                return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, 
                this.context = e.context), x.makeArray(e, this));
            },
            selector: "",
            length: 0,
            toArray: function() {
                return g.call(this);
            },
            get: function(e) {
                return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e];
            },
            pushStack: function(e) {
                var t = x.merge(this.constructor(), e);
                return t.prevObject = this, t.context = this.context, t;
            },
            each: function(e, t) {
                return x.each(this, e, t);
            },
            ready: function(e) {
                return x.ready.promise().done(e), this;
            },
            slice: function() {
                return this.pushStack(g.apply(this, arguments));
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            eq: function(e) {
                var t = this.length, n = +e + (0 > e ? t : 0);
                return this.pushStack(n >= 0 && t > n ? [ this[n] ] : []);
            },
            map: function(e) {
                return this.pushStack(x.map(this, (function(t, n) {
                    return e.call(t, n, t);
                })));
            },
            end: function() {
                return this.prevObject || this.constructor(null);
            },
            push: h,
            sort: [].sort,
            splice: [].splice
        }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function() {
            var e, n, r, i, o, a, s = arguments[0] || {}, l = 1, u = arguments.length, c = !1;
            for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), 
            u === l && (s = this, --l); u > l; l++) if (null != (o = arguments[l])) for (i in o) e = s[i], 
            r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, 
            a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r));
            return s;
        }, x.extend({
            expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
            noConflict: function(t) {
                return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x;
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? x.readyWait++ : x.ready(!0);
            },
            ready: function(e) {
                if (!0 === e ? !--x.readyWait : !x.isReady) {
                    if (!a.body) return setTimeout(x.ready);
                    x.isReady = !0, !0 !== e && --x.readyWait > 0 || (n.resolveWith(a, [ x ]), x.fn.trigger && x(a).trigger("ready").off("ready"));
                }
            },
            isFunction: function(e) {
                return "function" === x.type(e);
            },
            isArray: Array.isArray || function(e) {
                return "array" === x.type(e);
            },
            isWindow: function(e) {
                return null != e && e == e.window;
            },
            isNumeric: function(e) {
                return !isNaN(parseFloat(e)) && isFinite(e);
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e;
            },
            isPlainObject: function(e) {
                var n;
                if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e)) return !1;
                try {
                    if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf")) return !1;
                } catch (r) {
                    return !1;
                }
                if (x.support.ownLast) for (n in e) return v.call(e, n);
                for (n in e) ;
                return n === t || v.call(e, n);
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0;
            },
            error: function(e) {
                throw Error(e);
            },
            parseHTML: function(e, t, n) {
                if (!e || "string" != typeof e) return null;
                "boolean" == typeof t && (n = t, t = !1), t = t || a;
                var r = k.exec(e), i = !n && [];
                return r ? [ t.createElement(r[1]) ] : (r = x.buildFragment([ e ], t, i), i && x(i).remove(), 
                x.merge([], r.childNodes));
            },
            parseJSON: function(n) {
                return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), 
                n && E.test(n.replace(A, "@").replace(j, "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), 
                t);
            },
            parseXML: function(n) {
                var r, i;
                if (!n || "string" != typeof n) return null;
                try {
                    e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), 
                    r.async = "false", r.loadXML(n));
                } catch (o) {
                    r = t;
                }
                return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), 
                r;
            },
            noop: function() {},
            globalEval: function(t) {
                t && x.trim(t) && (e.execScript || function(t) {
                    e.eval.call(e, t);
                })(t);
            },
            camelCase: function(e) {
                return e.replace(D, "ms-").replace(L, H);
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
            },
            each: function(e, t, n) {
                var r, i = 0, o = e.length, a = M(e);
                if (n) {
                    if (a) {
                        for (;o > i; i++) if (r = t.apply(e[i], n), !1 === r) break;
                    } else for (i in e) if (r = t.apply(e[i], n), !1 === r) break;
                } else if (a) {
                    for (;o > i; i++) if (r = t.call(e[i], i, e[i]), !1 === r) break;
                } else for (i in e) if (r = t.call(e[i], i, e[i]), !1 === r) break;
                return e;
            },
            trim: b && !b.call("\ufeff ") ? function(e) {
                return null == e ? "" : b.call(e);
            } : function(e) {
                return null == e ? "" : (e + "").replace(C, "");
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [ e ] : e) : h.call(n, e)), 
                n;
            },
            inArray: function(e, t, n) {
                var r;
                if (t) {
                    if (m) return m.call(t, e, n);
                    for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++) if (n in t && t[n] === e) return n;
                }
                return -1;
            },
            merge: function(e, n) {
                var r = n.length, i = e.length, o = 0;
                if ("number" == typeof r) for (;r > o; o++) e[i++] = n[o]; else while (n[o] !== t) e[i++] = n[o++];
                return e.length = i, e;
            },
            grep: function(e, t, n) {
                var r, i = [], o = 0, a = e.length;
                for (n = !!n; a > o; o++) r = !!t(e[o], o), n !== r && i.push(e[o]);
                return i;
            },
            map: function(e, t, n) {
                var r, i = 0, o = e.length, a = M(e), s = [];
                if (a) for (;o > i; i++) r = t(e[i], i, n), null != r && (s[s.length] = r); else for (i in e) r = t(e[i], i, n), 
                null != r && (s[s.length] = r);
                return d.apply([], s);
            },
            guid: 1,
            proxy: function(e, n) {
                var r, i, o;
                return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), 
                i = function() {
                    return e.apply(n || this, r.concat(g.call(arguments)));
                }, i.guid = e.guid = e.guid || x.guid++, i) : t;
            },
            access: function(e, n, r, i, o, a, s) {
                var l = 0, u = e.length, c = null == r;
                if ("object" === x.type(r)) {
                    o = !0;
                    for (l in r) x.access(e, n, l, r[l], !0, a, s);
                } else if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), 
                n = null) : (c = n, n = function(e, t, n) {
                    return c.call(x(e), n);
                })), n)) for (;u > l; l++) n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r)));
                return o ? e : c ? n.call(e) : u ? n(e[0], r) : a;
            },
            now: function() {
                return (new Date).getTime();
            },
            swap: function(e, t, n, r) {
                var i, o, a = {};
                for (o in t) a[o] = e.style[o], e.style[o] = t[o];
                i = n.apply(e, r || []);
                for (o in t) e.style[o] = a[o];
                return i;
            }
        }), x.ready.promise = function(t) {
            if (!n) if (n = x.Deferred(), "complete" === a.readyState) setTimeout(x.ready); else if (a.addEventListener) a.addEventListener("DOMContentLoaded", q, !1), 
            e.addEventListener("load", q, !1); else {
                a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q);
                var r = !1;
                try {
                    r = null == e.frameElement && a.documentElement;
                } catch (i) {}
                r && r.doScroll && function o() {
                    if (!x.isReady) {
                        try {
                            r.doScroll("left");
                        } catch (e) {
                            return setTimeout(o, 50);
                        }
                        _(), x.ready();
                    }
                }();
            }
            return n.promise(t);
        }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), (function(e, t) {
            c["[object " + t + "]"] = t.toLowerCase();
        }));
        function M(e) {
            var t = e.length, n = x.type(e);
            return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e);
        }
        r = x(a), function(e, t) {
            var n, r, i, o, a, s, l, u, c, p, f, d, h, g, m, y, v, b = "sizzle" + -new Date, w = e.document, T = 0, C = 0, N = st(), k = st(), E = st(), S = !1, A = function(e, t) {
                return e === t ? (S = !0, 0) : 0;
            }, j = typeof t, D = 1 << 31, L = {}.hasOwnProperty, H = [], q = H.pop, _ = H.push, M = H.push, O = H.slice, F = H.indexOf || function(e) {
                var t = 0, n = this.length;
                for (;n > t; t++) if (this[t] === e) return t;
                return -1;
            }, B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", P = "[\\x20\\t\\r\\n\\f]", R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", W = R.replace("w", "w#"), $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]", I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)", z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g"), X = RegExp("^" + P + "*," + P + "*"), U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"), V = RegExp(P + "*[+~]"), Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"), J = RegExp(I), G = RegExp("^" + W + "$"), Q = {
                ID: RegExp("^#(" + R + ")"),
                CLASS: RegExp("^\\.(" + R + ")"),
                TAG: RegExp("^(" + R.replace("w", "w*") + ")"),
                ATTR: RegExp("^" + $),
                PSEUDO: RegExp("^" + I),
                CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"),
                bool: RegExp("^(?:" + B + ")$", "i"),
                needsContext: RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i")
            }, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, nt = /'|\\/g, rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig"), it = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r);
            };
            try {
                M.apply(H = O.call(w.childNodes), w.childNodes), H[w.childNodes.length].nodeType;
            } catch (ot) {
                M = {
                    apply: H.length ? function(e, t) {
                        _.apply(e, O.call(t));
                    } : function(e, t) {
                        var n = e.length, r = 0;
                        while (e[n++] = t[r++]) ;
                        e.length = n - 1;
                    }
                };
            }
            function at(e, t, n, i) {
                var o, a, s, l, u, c, d, m, y, x;
                if ((t ? t.ownerDocument || t : w) !== f && p(t), t = t || f, n = n || [], !e || "string" != typeof e) return n;
                if (1 !== (l = t.nodeType) && 9 !== l) return [];
                if (h && !i) {
                    if (o = Z.exec(e)) if (s = o[1]) {
                        if (9 === l) {
                            if (a = t.getElementById(s), !a || !a.parentNode) return n;
                            if (a.id === s) return n.push(a), n;
                        } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v(t, a) && a.id === s) return n.push(a), 
                        n;
                    } else {
                        if (o[2]) return M.apply(n, t.getElementsByTagName(e)), n;
                        if ((s = o[3]) && r.getElementsByClassName && t.getElementsByClassName) return M.apply(n, t.getElementsByClassName(s)), 
                        n;
                    }
                    if (r.qsa && (!g || !g.test(e))) {
                        if (m = d = b, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase()) {
                            c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "\\$&") : t.setAttribute("id", m), 
                            m = "[id='" + m + "'] ", u = c.length;
                            while (u--) c[u] = m + yt(c[u]);
                            y = V.test(e) && t.parentNode || t, x = c.join(",");
                        }
                        if (x) try {
                            return M.apply(n, y.querySelectorAll(x)), n;
                        } catch (T) {} finally {
                            d || t.removeAttribute("id");
                        }
                    }
                }
                return kt(e.replace(z, "$1"), t, n, i);
            }
            function st() {
                var e = [];
                function t(n, r) {
                    return e.push(n += " ") > o.cacheLength && delete t[e.shift()], t[n] = r;
                }
                return t;
            }
            function lt(e) {
                return e[b] = !0, e;
            }
            function ut(e) {
                var t = f.createElement("div");
                try {
                    return !!e(t);
                } catch (n) {
                    return !1;
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null;
                }
            }
            function ct(e, t) {
                var n = e.split("|"), r = e.length;
                while (r--) o.attrHandle[n[r]] = t;
            }
            function pt(e, t) {
                var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D);
                if (r) return r;
                if (n) while (n = n.nextSibling) if (n === t) return -1;
                return e ? 1 : -1;
            }
            function ft(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return "input" === n && t.type === e;
                };
            }
            function dt(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e;
                };
            }
            function ht(e) {
                return lt((function(t) {
                    return t = +t, lt((function(n, r) {
                        var i, o = e([], n.length, t), a = o.length;
                        while (a--) n[i = o[a]] && (n[i] = !(r[i] = n[i]));
                    }));
                }));
            }
            s = at.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? "HTML" !== t.nodeName : !1;
            }, r = at.support = {}, p = at.setDocument = function(e) {
                var n = e ? e.ownerDocument || e : w, i = n.defaultView;
                return n !== f && 9 === n.nodeType && n.documentElement ? (f = n, d = n.documentElement, 
                h = !s(n), i && i.attachEvent && i !== i.top && i.attachEvent("onbeforeunload", (function() {
                    p();
                })), r.attributes = ut((function(e) {
                    return e.className = "i", !e.getAttribute("className");
                })), r.getElementsByTagName = ut((function(e) {
                    return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length;
                })), r.getElementsByClassName = ut((function(e) {
                    return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 
                    2 === e.getElementsByClassName("i").length;
                })), r.getById = ut((function(e) {
                    return d.appendChild(e).id = b, !n.getElementsByName || !n.getElementsByName(b).length;
                })), r.getById ? (o.find.ID = function(e, t) {
                    if (typeof t.getElementById !== j && h) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [ n ] : [];
                    }
                }, o.filter.ID = function(e) {
                    var t = e.replace(rt, it);
                    return function(e) {
                        return e.getAttribute("id") === t;
                    };
                }) : (delete o.find.ID, o.filter.ID = function(e) {
                    var t = e.replace(rt, it);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== j && e.getAttributeNode("id");
                        return n && n.value === t;
                    };
                }), o.find.TAG = r.getElementsByTagName ? function(e, n) {
                    return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t;
                } : function(e, t) {
                    var n, r = [], i = 0, o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        while (n = o[i++]) 1 === n.nodeType && r.push(n);
                        return r;
                    }
                    return o;
                }, o.find.CLASS = r.getElementsByClassName && function(e, n) {
                    return typeof n.getElementsByClassName !== j && h ? n.getElementsByClassName(e) : t;
                }, m = [], g = [], (r.qsa = K.test(n.querySelectorAll)) && (ut((function(e) {
                    e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || g.push("\\[" + P + "*(?:value|" + B + ")"), 
                    e.querySelectorAll(":checked").length || g.push(":checked");
                })), ut((function(e) {
                    var t = n.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && g.push("[*^$]=" + P + "*(?:''|\"\")"), 
                    e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), 
                    g.push(",.*:");
                }))), (r.matchesSelector = K.test(y = d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && ut((function(e) {
                    r.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), m.push("!=", I);
                })), g = g.length && RegExp(g.join("|")), m = m.length && RegExp(m.join("|")), v = K.test(d.contains) || d.compareDocumentPosition ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
                } : function(e, t) {
                    if (t) while (t = t.parentNode) if (t === e) return !0;
                    return !1;
                }, A = d.compareDocumentPosition ? function(e, t) {
                    if (e === t) return S = !0, 0;
                    var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t);
                    return i ? 1 & i || !r.sortDetached && t.compareDocumentPosition(e) === i ? e === n || v(w, e) ? -1 : t === n || v(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1;
                } : function(e, t) {
                    var r, i = 0, o = e.parentNode, a = t.parentNode, s = [ e ], l = [ t ];
                    if (e === t) return S = !0, 0;
                    if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0;
                    if (o === a) return pt(e, t);
                    r = e;
                    while (r = r.parentNode) s.unshift(r);
                    r = t;
                    while (r = r.parentNode) l.unshift(r);
                    while (s[i] === l[i]) i++;
                    return i ? pt(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0;
                }, n) : f;
            }, at.matches = function(e, t) {
                return at(e, null, null, t);
            }, at.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== f && p(e), t = t.replace(Y, "='$1']"), !(!r.matchesSelector || !h || m && m.test(t) || g && g.test(t))) try {
                    var n = y.call(e, t);
                    if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n;
                } catch (i) {}
                return at(t, f, null, [ e ]).length > 0;
            }, at.contains = function(e, t) {
                return (e.ownerDocument || e) !== f && p(e), v(e, t);
            }, at.attr = function(e, n) {
                (e.ownerDocument || e) !== f && p(e);
                var i = o.attrHandle[n.toLowerCase()], a = i && L.call(o.attrHandle, n.toLowerCase()) ? i(e, n, !h) : t;
                return a === t ? r.attributes || !h ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a;
            }, at.error = function(e) {
                throw Error("Syntax error, unrecognized expression: " + e);
            }, at.uniqueSort = function(e) {
                var t, n = [], i = 0, o = 0;
                if (S = !r.detectDuplicates, c = !r.sortStable && e.slice(0), e.sort(A), S) {
                    while (t = e[o++]) t === e[o] && (i = n.push(o));
                    while (i--) e.splice(n[i], 1);
                }
                return e;
            }, a = at.getText = function(e) {
                var t, n = "", r = 0, i = e.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += a(e);
                    } else if (3 === i || 4 === i) return e.nodeValue;
                } else for (;t = e[r]; r++) n += a(t);
                return n;
            }, o = at.selectors = {
                cacheLength: 50,
                createPseudo: lt,
                match: Q,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), 
                        "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), 
                        e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), 
                        e;
                    },
                    PSEUDO: function(e) {
                        var n, r = !e[5] && e[2];
                        return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), 
                        e[2] = r.slice(0, n)), e.slice(0, 3));
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(rt, it).toLowerCase();
                        return "*" === e ? function() {
                            return !0;
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t;
                        };
                    },
                    CLASS: function(e) {
                        var t = N[e + " "];
                        return t || (t = RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && N(e, (function(e) {
                            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "");
                        }));
                    },
                    ATTR: function(e, t, n) {
                        return function(r) {
                            var i = at.attr(r, e);
                            return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i + " ").indexOf(n) > -1 : "|=" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0;
                        };
                    },
                    CHILD: function(e, t, n, r, i) {
                        var o = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t;
                        return 1 === r && 0 === i ? function(e) {
                            return !!e.parentNode;
                        } : function(t, n, l) {
                            var u, c, p, f, d, h, g = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, y = s && t.nodeName.toLowerCase(), v = !l && !s;
                            if (m) {
                                if (o) {
                                    while (g) {
                                        p = t;
                                        while (p = p[g]) if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1;
                                        h = g = "only" === e && !h && "nextSibling";
                                    }
                                    return !0;
                                }
                                if (h = [ a ? m.firstChild : m.lastChild ], a && v) {
                                    c = m[b] || (m[b] = {}), u = c[e] || [], d = u[0] === T && u[1], f = u[0] === T && u[2], 
                                    p = d && m.childNodes[d];
                                    while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if (1 === p.nodeType && ++f && p === t) {
                                        c[e] = [ T, d, f ];
                                        break;
                                    }
                                } else if (v && (u = (t[b] || (t[b] = {}))[e]) && u[0] === T) f = u[1]; else while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b] || (p[b] = {}))[e] = [ T, f ]), 
                                p === t)) break;
                                return f -= i, f === r || 0 === f % r && f / r >= 0;
                            }
                        };
                    },
                    PSEUDO: function(e, t) {
                        var n, r = o.pseudos[e] || o.setFilters[e.toLowerCase()] || at.error("unsupported pseudo: " + e);
                        return r[b] ? r(t) : r.length > 1 ? (n = [ e, e, "", t ], o.setFilters.hasOwnProperty(e.toLowerCase()) ? lt((function(e, n) {
                            var i, o = r(e, t), a = o.length;
                            while (a--) i = F.call(e, o[a]), e[i] = !(n[i] = o[a]);
                        })) : function(e) {
                            return r(e, 0, n);
                        }) : r;
                    }
                },
                pseudos: {
                    not: lt((function(e) {
                        var t = [], n = [], r = l(e.replace(z, "$1"));
                        return r[b] ? lt((function(e, t, n, i) {
                            var o, a = r(e, null, i, []), s = e.length;
                            while (s--) (o = a[s]) && (e[s] = !(t[s] = o));
                        })) : function(e, i, o) {
                            return t[0] = e, r(t, null, o, n), !n.pop();
                        };
                    })),
                    has: lt((function(e) {
                        return function(t) {
                            return at(e, t).length > 0;
                        };
                    })),
                    contains: lt((function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || a(t)).indexOf(e) > -1;
                        };
                    })),
                    lang: lt((function(e) {
                        return G.test(e || "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), 
                        function(t) {
                            var n;
                            do {
                                if (n = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), 
                                n === e || 0 === n.indexOf(e + "-");
                            } while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1;
                        };
                    })),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id;
                    },
                    root: function(e) {
                        return e === d;
                    },
                    focus: function(e) {
                        return e === f.activeElement && (!f.hasFocus || f.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                    },
                    enabled: function(e) {
                        return !1 === e.disabled;
                    },
                    disabled: function(e) {
                        return !0 === e.disabled;
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected;
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1;
                        return !0;
                    },
                    parent: function(e) {
                        return !o.pseudos.empty(e);
                    },
                    header: function(e) {
                        return tt.test(e.nodeName);
                    },
                    input: function(e) {
                        return et.test(e.nodeName);
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t;
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type);
                    },
                    first: ht((function() {
                        return [ 0 ];
                    })),
                    last: ht((function(e, t) {
                        return [ t - 1 ];
                    })),
                    eq: ht((function(e, t, n) {
                        return [ 0 > n ? n + t : n ];
                    })),
                    even: ht((function(e, t) {
                        var n = 0;
                        for (;t > n; n += 2) e.push(n);
                        return e;
                    })),
                    odd: ht((function(e, t) {
                        var n = 1;
                        for (;t > n; n += 2) e.push(n);
                        return e;
                    })),
                    lt: ht((function(e, t, n) {
                        var r = 0 > n ? n + t : n;
                        for (;--r >= 0; ) e.push(r);
                        return e;
                    })),
                    gt: ht((function(e, t, n) {
                        var r = 0 > n ? n + t : n;
                        for (;t > ++r; ) e.push(r);
                        return e;
                    }))
                }
            }, o.pseudos.nth = o.pseudos.eq;
            for (n in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) o.pseudos[n] = ft(n);
            for (n in {
                submit: !0,
                reset: !0
            }) o.pseudos[n] = dt(n);
            function gt() {}
            gt.prototype = o.filters = o.pseudos, o.setFilters = new gt;
            function mt(e, t) {
                var n, r, i, a, s, l, u, c = k[e + " "];
                if (c) return t ? 0 : c.slice(0);
                s = e, l = [], u = o.preFilter;
                while (s) {
                    (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), 
                    n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({
                        value: n,
                        type: r[0].replace(z, " ")
                    }), s = s.slice(n.length));
                    for (a in o.filter) !(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), 
                    i.push({
                        value: n,
                        type: a,
                        matches: r
                    }), s = s.slice(n.length));
                    if (!n) break;
                }
                return t ? s.length : s ? at.error(e) : k(e, l).slice(0);
            }
            function yt(e) {
                var t = 0, n = e.length, r = "";
                for (;n > t; t++) r += e[t].value;
                return r;
            }
            function vt(e, t, n) {
                var r = t.dir, o = n && "parentNode" === r, a = C++;
                return t.first ? function(t, n, i) {
                    while (t = t[r]) if (1 === t.nodeType || o) return e(t, n, i);
                } : function(t, n, s) {
                    var l, u, c, p = T + " " + a;
                    if (s) {
                        while (t = t[r]) if ((1 === t.nodeType || o) && e(t, n, s)) return !0;
                    } else while (t = t[r]) if (1 === t.nodeType || o) if (c = t[b] || (t[b] = {}), 
                    (u = c[r]) && u[0] === p) {
                        if (!0 === (l = u[1]) || l === i) return !0 === l;
                    } else if (u = c[r] = [ p ], u[1] = e(t, n, s) || i, !0 === u[1]) return !0;
                };
            }
            function bt(e) {
                return e.length > 1 ? function(t, n, r) {
                    var i = e.length;
                    while (i--) if (!e[i](t, n, r)) return !1;
                    return !0;
                } : e[0];
            }
            function xt(e, t, n, r, i) {
                var o, a = [], s = 0, l = e.length, u = null != t;
                for (;l > s; s++) (o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
                return a;
            }
            function wt(e, t, n, r, i, o) {
                return r && !r[b] && (r = wt(r)), i && !i[b] && (i = wt(i, o)), lt((function(o, a, s, l) {
                    var u, c, p, f = [], d = [], h = a.length, g = o || Nt(t || "*", s.nodeType ? [ s ] : s, []), m = !e || !o && t ? g : xt(g, f, e, s, l), y = n ? i || (o ? e : h || r) ? [] : a : m;
                    if (n && n(m, y, s, l), r) {
                        u = xt(y, d), r(u, [], s, l), c = u.length;
                        while (c--) (p = u[c]) && (y[d[c]] = !(m[d[c]] = p));
                    }
                    if (o) {
                        if (i || e) {
                            if (i) {
                                u = [], c = y.length;
                                while (c--) (p = y[c]) && u.push(m[c] = p);
                                i(null, y = [], u, l);
                            }
                            c = y.length;
                            while (c--) (p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p));
                        }
                    } else y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y);
                }));
            }
            function Tt(e) {
                var t, n, r, i = e.length, a = o.relative[e[0].type], s = a || o.relative[" "], l = a ? 1 : 0, c = vt((function(e) {
                    return e === t;
                }), s, !0), p = vt((function(e) {
                    return F.call(t, e) > -1;
                }), s, !0), f = [ function(e, n, r) {
                    return !a && (r || n !== u) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r));
                } ];
                for (;i > l; l++) if (n = o.relative[e[l].type]) f = [ vt(bt(f), n) ]; else {
                    if (n = o.filter[e[l].type].apply(null, e[l].matches), n[b]) {
                        for (r = ++l; i > r; r++) if (o.relative[e[r].type]) break;
                        return wt(l > 1 && bt(f), l > 1 && yt(e.slice(0, l - 1).concat({
                            value: " " === e[l - 2].type ? "*" : ""
                        })).replace(z, "$1"), n, r > l && Tt(e.slice(l, r)), i > r && Tt(e = e.slice(r)), i > r && yt(e));
                    }
                    f.push(n);
                }
                return bt(f);
            }
            function Ct(e, t) {
                var n = 0, r = t.length > 0, a = e.length > 0, s = function(s, l, c, p, d) {
                    var h, g, m, y = [], v = 0, b = "0", x = s && [], w = null != d, C = u, N = s || a && o.find.TAG("*", d && l.parentNode || l), k = T += null == C ? 1 : Math.random() || .1;
                    for (w && (u = l !== f && l, i = n); null != (h = N[b]); b++) {
                        if (a && h) {
                            g = 0;
                            while (m = e[g++]) if (m(h, l, c)) {
                                p.push(h);
                                break;
                            }
                            w && (T = k, i = ++n);
                        }
                        r && ((h = !m && h) && v--, s && x.push(h));
                    }
                    if (v += b, r && b !== v) {
                        g = 0;
                        while (m = t[g++]) m(x, y, l, c);
                        if (s) {
                            if (v > 0) while (b--) x[b] || y[b] || (y[b] = q.call(p));
                            y = xt(y);
                        }
                        M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p);
                    }
                    return w && (T = k, u = C), x;
                };
                return r ? lt(s) : s;
            }
            l = at.compile = function(e, t) {
                var n, r = [], i = [], o = E[e + " "];
                if (!o) {
                    t || (t = mt(e)), n = t.length;
                    while (n--) o = Tt(t[n]), o[b] ? r.push(o) : i.push(o);
                    o = E(e, Ct(i, r));
                }
                return o;
            };
            function Nt(e, t, n) {
                var r = 0, i = t.length;
                for (;i > r; r++) at(e, t[r], n);
                return n;
            }
            function kt(e, t, n, i) {
                var a, s, u, c, p, f = mt(e);
                if (!i && 1 === f.length) {
                    if (s = f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r.getById && 9 === t.nodeType && h && o.relative[s[1].type]) {
                        if (t = (o.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t) return n;
                        e = e.slice(s.shift().value.length);
                    }
                    a = Q.needsContext.test(e) ? 0 : s.length;
                    while (a--) {
                        if (u = s[a], o.relative[c = u.type]) break;
                        if ((p = o.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t))) {
                            if (s.splice(a, 1), e = i.length && yt(s), !e) return M.apply(n, i), n;
                            break;
                        }
                    }
                }
                return l(e, f)(i, t, !h, n, V.test(e)), n;
            }
            r.sortStable = b.split("").sort(A).join("") === b, r.detectDuplicates = S, p(), 
            r.sortDetached = ut((function(e) {
                return 1 & e.compareDocumentPosition(f.createElement("div"));
            })), ut((function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
            })) || ct("type|href|height|width", (function(e, n, r) {
                return r ? t : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2);
            })), r.attributes && ut((function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
            })) || ct("value", (function(e, n, r) {
                return r || "input" !== e.nodeName.toLowerCase() ? t : e.defaultValue;
            })), ut((function(e) {
                return null == e.getAttribute("disabled");
            })) || ct(B, (function(e, n, r) {
                var i;
                return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : !0 === e[n] ? n.toLowerCase() : null;
            })), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, 
            x.text = at.getText, x.isXMLDoc = at.isXML, x.contains = at.contains;
        }(e);
        var O = {};
        function F(e) {
            var t = O[e] = {};
            return x.each(e.match(T) || [], (function(e, n) {
                t[n] = !0;
            })), t;
        }
        x.Callbacks = function(e) {
            e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e);
            var n, r, i, o, a, s, l = [], u = !e.once && [], c = function(t) {
                for (r = e.memory && t, i = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++) if (!1 === l[a].apply(t[0], t[1]) && e.stopOnFalse) {
                    r = !1;
                    break;
                }
                n = !1, l && (u ? u.length && c(u.shift()) : r ? l = [] : p.disable());
            }, p = {
                add: function() {
                    if (l) {
                        var t = l.length;
                        (function i(t) {
                            x.each(t, (function(t, n) {
                                var r = x.type(n);
                                "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n);
                            }));
                        })(arguments), n ? o = l.length : r && (s = t, c(r));
                    }
                    return this;
                },
                remove: function() {
                    return l && x.each(arguments, (function(e, t) {
                        var r;
                        while ((r = x.inArray(t, l, r)) > -1) l.splice(r, 1), n && (o >= r && o--, a >= r && a--);
                    })), this;
                },
                has: function(e) {
                    return e ? x.inArray(e, l) > -1 : !(!l || !l.length);
                },
                empty: function() {
                    return l = [], o = 0, this;
                },
                disable: function() {
                    return l = u = r = t, this;
                },
                disabled: function() {
                    return !l;
                },
                lock: function() {
                    return u = t, r || p.disable(), this;
                },
                locked: function() {
                    return !u;
                },
                fireWith: function(e, t) {
                    return !l || i && !u || (t = t || [], t = [ e, t.slice ? t.slice() : t ], n ? u.push(t) : c(t)), 
                    this;
                },
                fire: function() {
                    return p.fireWith(this, arguments), this;
                },
                fired: function() {
                    return !!i;
                }
            };
            return p;
        }, x.extend({
            Deferred: function(e) {
                var t = [ [ "resolve", "done", x.Callbacks("once memory"), "resolved" ], [ "reject", "fail", x.Callbacks("once memory"), "rejected" ], [ "notify", "progress", x.Callbacks("memory") ] ], n = "pending", r = {
                    state: function() {
                        return n;
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this;
                    },
                    then: function() {
                        var e = arguments;
                        return x.Deferred((function(n) {
                            x.each(t, (function(t, o) {
                                var a = o[0], s = x.isFunction(e[t]) && e[t];
                                i[o[1]]((function() {
                                    var e = s && s.apply(this, arguments);
                                    e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [ e ] : arguments);
                                }));
                            })), e = null;
                        })).promise();
                    },
                    promise: function(e) {
                        return null != e ? x.extend(e, r) : r;
                    }
                }, i = {};
                return r.pipe = r.then, x.each(t, (function(e, o) {
                    var a = o[2], s = o[3];
                    r[o[1]] = a.add, s && a.add((function() {
                        n = s;
                    }), t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                        return i[o[0] + "With"](this === i ? r : this, arguments), this;
                    }, i[o[0] + "With"] = a.fireWith;
                })), r.promise(i), e && e.call(i, i), i;
            },
            when: function(e) {
                var s, l, u, t = 0, n = g.call(arguments), r = n.length, i = 1 !== r || e && x.isFunction(e.promise) ? r : 0, o = 1 === i ? e : x.Deferred(), a = function(e, t, n) {
                    return function(r) {
                        t[e] = this, n[e] = arguments.length > 1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n);
                    };
                };
                if (r > 1) for (s = Array(r), l = Array(r), u = Array(r); r > t; t++) n[t] && x.isFunction(n[t].promise) ? n[t].promise().done(a(t, u, n)).fail(o.reject).progress(a(t, l, s)) : --i;
                return i || o.resolveWith(u, n), o.promise();
            }
        }), x.support = function(t) {
            var n, r, o, s, l, u, c, p, f, d = a.createElement("div");
            if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
            n = d.getElementsByTagName("*") || [], r = d.getElementsByTagName("a")[0], !r || !r.style || !n.length) return t;
            s = a.createElement("select"), u = s.appendChild(a.createElement("option")), o = d.getElementsByTagName("input")[0], 
            r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, 
            t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, 
            t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), 
            t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), 
            t.cssFloat = !!r.style.cssFloat, t.checkOn = !!o.value, t.optSelected = u.selected, 
            t.enctype = !!a.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== a.createElement("nav").cloneNode(!0).outerHTML, 
            t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, 
            t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, 
            t.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !u.disabled;
            try {
                delete d.test;
            } catch (h) {
                t.deleteExpando = !1;
            }
            o = a.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), 
            o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, 
            o.setAttribute("checked", "t"), o.setAttribute("name", "t"), l = a.createDocumentFragment(), 
            l.appendChild(o), t.appendChecked = o.checked, t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, 
            d.attachEvent && (d.attachEvent("onclick", (function() {
                t.noCloneEvent = !1;
            })), d.cloneNode(!0).click());
            for (f in {
                submit: !0,
                change: !0,
                focusin: !0
            }) d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || !1 === d.attributes[c].expando;
            d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", 
            t.clearCloneStyle = "content-box" === d.style.backgroundClip;
            for (f in x(t)) break;
            return t.ownLast = "0" !== f, x((function() {
                var n, r, o, s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", l = a.getElementsByTagName("body")[0];
                l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", 
                l.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
                o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
                p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", 
                t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
                x.swap(l, null != l.style.zoom ? {
                    zoom: 1
                } : {}, (function() {
                    t.boxSizing = 4 === d.offsetWidth;
                })), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, 
                t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || {
                    width: "4px"
                }).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, 
                r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), 
                typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", 
                t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", 
                d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), 
                l.removeChild(n), n = d = o = r = null);
            })), n = s = l = u = r = o = null, t;
        }({});
        var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, P = /([A-Z])/g;
        function R(e, n, r, i) {
            if (x.acceptData(e)) {
                var o, a, s = x.expando, l = e.nodeType, u = l ? x.cache : e, c = l ? e[s] : e[s] && s;
                if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n) return c || (c = l ? e[s] = p.pop() || x.guid++ : s), 
                u[c] || (u[c] = l ? {} : {
                    toJSON: x.noop
                }), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), 
                a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), 
                "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, 
                o;
            }
        }
        function W(e, t, n) {
            if (x.acceptData(e)) {
                var r, i, o = e.nodeType, a = o ? x.cache : e, s = o ? e[x.expando] : x.expando;
                if (a[s]) {
                    if (t && (r = n ? a[s] : a[s].data)) {
                        x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [ t ] : (t = x.camelCase(t), 
                        t = t in r ? [ t ] : t.split(" ")), i = t.length;
                        while (i--) delete r[t[i]];
                        if (n ? !I(r) : !x.isEmptyObject(r)) return;
                    }
                    (n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([ e ], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null);
                }
            }
        }
        x.extend({
            cache: {},
            noData: {
                applet: !0,
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(e) {
                return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !!e && !I(e);
            },
            data: function(e, t, n) {
                return R(e, t, n);
            },
            removeData: function(e, t) {
                return W(e, t);
            },
            _data: function(e, t, n) {
                return R(e, t, n, !0);
            },
            _removeData: function(e, t) {
                return W(e, t, !0);
            },
            acceptData: function(e) {
                if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
                var t = e.nodeName && x.noData[e.nodeName.toLowerCase()];
                return !t || !0 !== t && e.getAttribute("classid") === t;
            }
        }), x.fn.extend({
            data: function(e, n) {
                var r, i, o = null, a = 0, s = this[0];
                if (e === t) {
                    if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs"))) {
                        for (r = s.attributes; r.length > a; a++) i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), 
                        $(s, i, o[i]));
                        x._data(s, "parsedAttrs", !0);
                    }
                    return o;
                }
                return "object" == typeof e ? this.each((function() {
                    x.data(this, e);
                })) : arguments.length > 1 ? this.each((function() {
                    x.data(this, e, n);
                })) : s ? $(s, e, x.data(s, e)) : null;
            },
            removeData: function(e) {
                return this.each((function() {
                    x.removeData(this, e);
                }));
            }
        });
        function $(e, n, r) {
            if (r === t && 1 === e.nodeType) {
                var i = "data-" + n.replace(P, "-$1").toLowerCase();
                if (r = e.getAttribute(i), "string" == typeof r) {
                    try {
                        r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r;
                    } catch (o) {}
                    x.data(e, n, r);
                } else r = t;
            }
            return r;
        }
        function I(e) {
            var t;
            for (t in e) if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
            return !0;
        }
        x.extend({
            queue: function(e, n, r) {
                var i;
                return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), 
                i || []) : t;
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = x.queue(e, t), r = n.length, i = n.shift(), o = x._queueHooks(e, t), a = function() {
                    x.dequeue(e, t);
                };
                "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), 
                delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire();
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return x._data(e, n) || x._data(e, n, {
                    empty: x.Callbacks("once memory").add((function() {
                        x._removeData(e, t + "queue"), x._removeData(e, n);
                    }))
                });
            }
        }), x.fn.extend({
            queue: function(e, n) {
                var r = 2;
                return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each((function() {
                    var t = x.queue(this, e, n);
                    x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e);
                }));
            },
            dequeue: function(e) {
                return this.each((function() {
                    x.dequeue(this, e);
                }));
            },
            delay: function(e, t) {
                return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, (function(t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(r);
                    };
                }));
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", []);
            },
            promise: function(e, n) {
                var r, i = 1, o = x.Deferred(), a = this, s = this.length, l = function() {
                    --i || o.resolveWith(a, [ a ]);
                };
                "string" != typeof e && (n = e, e = t), e = e || "fx";
                while (s--) r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l));
                return l(), o.promise(n);
            }
        });
        var z, X, U = /[\t\r\n\f]/g, V = /\r/g, Y = /^(?:input|select|textarea|button|object)$/i, J = /^(?:a|area)$/i, G = /^(?:checked|selected)$/i, Q = x.support.getSetAttribute, K = x.support.input;
        x.fn.extend({
            attr: function(e, t) {
                return x.access(this, x.attr, e, t, arguments.length > 1);
            },
            removeAttr: function(e) {
                return this.each((function() {
                    x.removeAttr(this, e);
                }));
            },
            prop: function(e, t) {
                return x.access(this, x.prop, e, t, arguments.length > 1);
            },
            removeProp: function(e) {
                return e = x.propFix[e] || e, this.each((function() {
                    try {
                        this[e] = t, delete this[e];
                    } catch (n) {}
                }));
            },
            addClass: function(e) {
                var t, n, r, i, o, a = 0, s = this.length, l = "string" == typeof e && e;
                if (x.isFunction(e)) return this.each((function(t) {
                    x(this).addClass(e.call(this, t, this.className));
                }));
                if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : " ")) {
                    o = 0;
                    while (i = t[o++]) 0 > r.indexOf(" " + i + " ") && (r += i + " ");
                    n.className = x.trim(r);
                }
                return this;
            },
            removeClass: function(e) {
                var t, n, r, i, o, a = 0, s = this.length, l = 0 === arguments.length || "string" == typeof e && e;
                if (x.isFunction(e)) return this.each((function(t) {
                    x(this).removeClass(e.call(this, t, this.className));
                }));
                if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : "")) {
                    o = 0;
                    while (i = t[o++]) while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " ");
                    n.className = e ? x.trim(r) : "";
                }
                return this;
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each((function(n) {
                    x(this).toggleClass(e.call(this, n, this.className, t), t);
                })) : this.each((function() {
                    if ("string" === n) {
                        var t, r = 0, o = x(this), a = e.match(T) || [];
                        while (t = a[r++]) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                    } else (n === i || "boolean" === n) && (this.className && x._data(this, "__className__", this.className), 
                    this.className = this.className || !1 === e ? "" : x._data(this, "__className__") || "");
                }));
            },
            hasClass: function(e) {
                var t = " " + e + " ", n = 0, r = this.length;
                for (;r > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0) return !0;
                return !1;
            },
            val: function(e) {
                var n, r, i, o = this[0];
                if (arguments.length) return i = x.isFunction(e), this.each((function(n) {
                    var o;
                    1 === this.nodeType && (o = i ? e.call(this, n, x(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, (function(e) {
                        return null == e ? "" : e + "";
                    }))), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o));
                }));
                if (o) return r = x.valHooks[o.type] || x.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== t ? n : (n = o.value, 
                "string" == typeof n ? n.replace(V, "") : null == n ? "" : n);
            }
        }), x.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = x.find.attr(e, "value");
                        return null != t ? t : e.text;
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0;
                        for (;s > l; l++) if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup"))) {
                            if (t = x(n).val(), o) return t;
                            a.push(t);
                        }
                        return a;
                    },
                    set: function(e, t) {
                        var n, r, i = e.options, o = x.makeArray(t), a = i.length;
                        while (a--) r = i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0);
                        return n || (e.selectedIndex = -1), o;
                    }
                }
            },
            attr: function(e, n, r) {
                var o, a, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), 
                o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), 
                null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), 
                r) : (x.removeAttr(e, n), t));
            },
            removeAttr: function(e, t) {
                var n, r, i = 0, o = t && t.match(T);
                if (o && 1 === e.nodeType) while (n = o[i++]) r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), 
                e.removeAttribute(Q ? n : r);
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t;
                        }
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            },
            prop: function(e, n, r) {
                var i, o, a, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, 
                o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n];
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = x.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1;
                    }
                }
            }
        }), X = {
            set: function(e, t, n) {
                return !1 === t ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, 
                n;
            }
        }, x.each(x.expr.match.bool.source.match(/\w+/g), (function(e, n) {
            var r = x.expr.attrHandle[n] || x.find.attr;
            x.expr.attrHandle[n] = K && Q || !G.test(n) ? function(e, n, i) {
                var o = x.expr.attrHandle[n], a = i ? t : (x.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null;
                return x.expr.attrHandle[n] = o, a;
            } : function(e, n, r) {
                return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null;
            };
        })), K && Q || (x.attrHooks.value = {
            set: function(e, n, r) {
                return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r);
            }
        }), Q || (z = {
            set: function(e, n, r) {
                var i = e.getAttributeNode(r);
                return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", 
                "value" === r || n === e.getAttribute(r) ? n : t;
            }
        }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function(e, n, r) {
            var i;
            return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null;
        }, x.valHooks.button = {
            get: function(e, n) {
                var r = e.getAttributeNode(n);
                return r && r.specified ? r.value : t;
            },
            set: z.set
        }, x.attrHooks.contenteditable = {
            set: function(e, t, n) {
                z.set(e, "" === t ? !1 : t, n);
            }
        }, x.each([ "width", "height" ], (function(e, n) {
            x.attrHooks[n] = {
                set: function(e, r) {
                    return "" === r ? (e.setAttribute(n, "auto"), r) : t;
                }
            };
        }))), x.support.hrefNormalized || x.each([ "href", "src" ], (function(e, t) {
            x.propHooks[t] = {
                get: function(e) {
                    return e.getAttribute(t, 4);
                }
            };
        })), x.support.style || (x.attrHooks.style = {
            get: function(e) {
                return e.style.cssText || t;
            },
            set: function(e, t) {
                return e.style.cssText = t + "";
            }
        }), x.support.optSelected || (x.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
            }
        }), x.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], (function() {
            x.propFix[this.toLowerCase()] = this;
        })), x.support.enctype || (x.propFix.enctype = "encoding"), x.each([ "radio", "checkbox" ], (function() {
            x.valHooks[this] = {
                set: function(e, n) {
                    return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t;
                }
            }, x.support.checkOn || (x.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value;
            });
        }));
        var Z = /^(?:input|select|textarea)$/i, et = /^key/, tt = /^(?:mouse|contextmenu)|click/, nt = /^(?:focusinfocus|focusoutblur)$/, rt = /^([^.]*)(?:\.(.+)|)$/;
        function it() {
            return !0;
        }
        function ot() {
            return !1;
        }
        function at() {
            try {
                return a.activeElement;
            } catch (e) {}
        }
        x.event = {
            global: {},
            add: function(e, n, r, o, a) {
                var s, l, u, c, p, f, d, h, g, m, y, v = x._data(e);
                if (v) {
                    r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), 
                    (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function(e) {
                        return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments);
                    }, f.elem = e), n = (n || "").match(T) || [ "" ], u = n.length;
                    while (u--) s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), 
                    g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, 
                    p = x.event.special[g] || {}, d = x.extend({
                        type: g,
                        origType: y,
                        data: o,
                        handler: r,
                        guid: r.guid,
                        selector: a,
                        needsContext: a && x.expr.match.needsContext.test(a),
                        namespace: m.join(".")
                    }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && !1 !== p.setup.call(e, o, m, f) || (e.addEventListener ? e.addEventListener(g, f, !1) : e.attachEvent && e.attachEvent("on" + g, f))), 
                    p.add && (p.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), 
                    x.event.global[g] = !0);
                    e = null;
                }
            },
            remove: function(e, t, n, r, i) {
                var o, a, s, l, u, c, p, f, d, h, g, m = x.hasData(e) && x._data(e);
                if (m && (c = m.events)) {
                    t = (t || "").match(T) || [ "" ], u = t.length;
                    while (u--) if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), 
                    d) {
                        p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], 
                        s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length;
                        while (o--) a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), 
                        a.selector && f.delegateCount--, p.remove && p.remove.call(e, a));
                        l && !f.length && (p.teardown && !1 !== p.teardown.call(e, h, m.handle) || x.removeEvent(e, d, m.handle), 
                        delete c[d]);
                    } else for (d in c) x.event.remove(e, d + t[u], n, r, !0);
                    x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events"));
                }
            },
            trigger: function(n, r, i, o) {
                var s, l, u, c, p, f, d, h = [ i || a ], g = v.call(n, "type") ? n.type : n, m = v.call(n, "namespace") ? n.namespace.split(".") : [];
                if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), 
                g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), 
                n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                n.result = t, n.target || (n.target = i), r = null == r ? [ n ] : x.makeArray(r, [ n ]), 
                p = x.event.special[g] || {}, o || !p.trigger || !1 !== p.trigger.apply(i, r))) {
                    if (!o && !p.noBubble && !x.isWindow(i)) {
                        for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode); u; u = u.parentNode) h.push(u), 
                        f = u;
                        f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e);
                    }
                    d = 0;
                    while ((u = h[d++]) && !n.isPropagationStopped()) n.type = d > 1 ? c : p.bindType || g, 
                    s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), 
                    s = l && u[l], s && x.acceptData(u) && s.apply && !1 === s.apply(u, r) && n.preventDefault();
                    if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || !1 === p._default.apply(h.pop(), r)) && x.acceptData(i) && l && i[g] && !x.isWindow(i)) {
                        f = i[l], f && (i[l] = null), x.event.triggered = g;
                        try {
                            i[g]();
                        } catch (y) {}
                        x.event.triggered = t, f && (i[l] = f);
                    }
                    return n.result;
                }
            },
            dispatch: function(e) {
                e = x.event.fix(e);
                var n, r, i, o, a, s = [], l = g.call(arguments), u = (x._data(this, "events") || {})[e.type] || [], c = x.event.special[e.type] || {};
                if (l[0] = e, e.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, e)) {
                    s = x.event.handlers.call(this, e, u), n = 0;
                    while ((o = s[n++]) && !e.isPropagationStopped()) {
                        e.currentTarget = o.elem, a = 0;
                        while ((i = o.handlers[a++]) && !e.isImmediatePropagationStopped()) (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, 
                        e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), 
                        r !== t && !1 === (e.result = r) && (e.preventDefault(), e.stopPropagation()));
                    }
                    return c.postDispatch && c.postDispatch.call(this, e), e.result;
                }
            },
            handlers: function(e, n) {
                var r, i, o, a, s = [], l = n.delegateCount, u = e.target;
                if (l && u.nodeType && (!e.button || "click" !== e.type)) for (;u != this; u = u.parentNode || this) if (1 === u.nodeType && (!0 !== u.disabled || "click" !== e.type)) {
                    for (o = [], a = 0; l > a; a++) i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [ u ]).length), 
                    o[r] && o.push(i);
                    o.length && s.push({
                        elem: u,
                        handlers: o
                    });
                }
                return n.length > l && s.push({
                    elem: this,
                    handlers: n.slice(l)
                }), s;
            },
            fix: function(e) {
                if (e[x.expando]) return e;
                var t, n, r, i = e.type, o = e, s = this.fixHooks[i];
                s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), 
                r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length;
                while (t--) n = r[t], e[n] = o[n];
                return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), 
                e.metaKey = !!e.metaKey, s.filter ? s.filter(e, o) : e;
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), 
                    e;
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, n) {
                    var r, i, o, s = n.button, l = n.fromElement;
                    return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, 
                    o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), 
                    e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), 
                    !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), 
                    e;
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== at() && this.focus) try {
                            return this.focus(), !1;
                        } catch (e) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === at() && this.blur ? (this.blur(), !1) : t;
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return x.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), 
                        !1) : t;
                    },
                    _default: function(e) {
                        return x.nodeName(e.target, "a");
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        e.result !== t && (e.originalEvent.returnValue = e.result);
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = x.extend(new x.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault();
            }
        }, x.removeEvent = a.removeEventListener ? function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1);
        } : function(e, t, n) {
            var r = "on" + t;
            e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n));
        }, x.Event = function(e, n) {
            return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, 
            this.isDefaultPrevented = e.defaultPrevented || !1 === e.returnValue || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, 
            n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, 
            t) : new x.Event(e, n);
        }, x.Event.prototype = {
            isDefaultPrevented: ot,
            isPropagationStopped: ot,
            isImmediatePropagationStopped: ot,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), 
                e.cancelBubble = !0);
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = it, this.stopPropagation();
            }
        }, x.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, (function(e, t) {
            x.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this, i = e.relatedTarget, o = e.handleObj;
                    return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), 
                    e.type = t), n;
                }
            };
        })), x.support.submitBubbles || (x.event.special.submit = {
            setup: function() {
                return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", (function(e) {
                    var n = e.target, r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t;
                    r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", (function(e) {
                        e._submit_bubble = !0;
                    })), x._data(r, "submitBubbles", !0));
                })), t);
            },
            postDispatch: function(e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0));
            },
            teardown: function() {
                return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t);
            }
        }), x.support.changeBubbles || (x.event.special.change = {
            setup: function() {
                return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", (function(e) {
                    "checked" === e.originalEvent.propertyName && (this._just_changed = !0);
                })), x.event.add(this, "click._change", (function(e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0);
                }))), !1) : (x.event.add(this, "beforeactivate._change", (function(e) {
                    var t = e.target;
                    Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", (function(e) {
                        !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0);
                    })), x._data(t, "changeBubbles", !0));
                })), t);
            },
            handle: function(e) {
                var n = e.target;
                return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t;
            },
            teardown: function() {
                return x.event.remove(this, "._change"), !Z.test(this.nodeName);
            }
        }), x.support.focusinBubbles || x.each({
            focus: "focusin",
            blur: "focusout"
        }, (function(e, t) {
            var n = 0, r = function(e) {
                x.event.simulate(t, e.target, x.event.fix(e), !0);
            };
            x.event.special[t] = {
                setup: function() {
                    0 === n++ && a.addEventListener(e, r, !0);
                },
                teardown: function() {
                    0 === --n && a.removeEventListener(e, r, !0);
                }
            };
        })), x.fn.extend({
            on: function(e, n, r, i, o) {
                var a, s;
                if ("object" == typeof e) {
                    "string" != typeof n && (r = r || n, n = t);
                    for (a in e) this.on(a, n, r, e[a], o);
                    return this;
                }
                if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, 
                r = t) : (i = r, r = n, n = t)), !1 === i) i = ot; else if (!i) return this;
                return 1 === o && (s = i, i = function(e) {
                    return x().off(e), s.apply(this, arguments);
                }, i.guid = s.guid || (s.guid = x.guid++)), this.each((function() {
                    x.event.add(this, e, i, r, n);
                }));
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1);
            },
            off: function(e, n, r) {
                var i, o;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), 
                this;
                if ("object" == typeof e) {
                    for (o in e) this.off(o, n, e[o]);
                    return this;
                }
                return (!1 === n || "function" == typeof n) && (r = n, n = t), !1 === r && (r = ot), 
                this.each((function() {
                    x.event.remove(this, e, r, n);
                }));
            },
            trigger: function(e, t) {
                return this.each((function() {
                    x.event.trigger(e, t, this);
                }));
            },
            triggerHandler: function(e, n) {
                var r = this[0];
                return r ? x.event.trigger(e, n, r, !0) : t;
            }
        });
        var st = /^.[^:#\[\.,]*$/, lt = /^(?:parents|prev(?:Until|All))/, ut = x.expr.match.needsContext, ct = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
        x.fn.extend({
            find: function(e) {
                var t, n = [], r = this, i = r.length;
                if ("string" != typeof e) return this.pushStack(x(e).filter((function() {
                    for (t = 0; i > t; t++) if (x.contains(r[t], this)) return !0;
                })));
                for (t = 0; i > t; t++) x.find(e, r[t], n);
                return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, 
                n;
            },
            has: function(e) {
                var t, n = x(e, this), r = n.length;
                return this.filter((function() {
                    for (t = 0; r > t; t++) if (x.contains(this, n[t])) return !0;
                }));
            },
            not: function(e) {
                return this.pushStack(ft(this, e || [], !0));
            },
            filter: function(e) {
                return this.pushStack(ft(this, e || [], !1));
            },
            is: function(e) {
                return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length;
            },
            closest: function(e, t) {
                var n, r = 0, i = this.length, o = [], a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0;
                for (;i > r; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e))) {
                    n = o.push(n);
                    break;
                }
                return this.pushStack(o.length > 1 ? x.unique(o) : o);
            },
            index: function(e) {
                return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            },
            add: function(e, t) {
                var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [ e ] : e), r = x.merge(this.get(), n);
                return this.pushStack(x.unique(r));
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
            }
        });
        function pt(e, t) {
            do {
                e = e[t];
            } while (e && 1 !== e.nodeType);
            return e;
        }
        x.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null;
            },
            parents: function(e) {
                return x.dir(e, "parentNode");
            },
            parentsUntil: function(e, t, n) {
                return x.dir(e, "parentNode", n);
            },
            next: function(e) {
                return pt(e, "nextSibling");
            },
            prev: function(e) {
                return pt(e, "previousSibling");
            },
            nextAll: function(e) {
                return x.dir(e, "nextSibling");
            },
            prevAll: function(e) {
                return x.dir(e, "previousSibling");
            },
            nextUntil: function(e, t, n) {
                return x.dir(e, "nextSibling", n);
            },
            prevUntil: function(e, t, n) {
                return x.dir(e, "previousSibling", n);
            },
            siblings: function(e) {
                return x.sibling((e.parentNode || {}).firstChild, e);
            },
            children: function(e) {
                return x.sibling(e.firstChild);
            },
            contents: function(e) {
                return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes);
            }
        }, (function(e, t) {
            x.fn[e] = function(n, r) {
                var i = x.map(this, t, n);
                return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), 
                this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), 
                this.pushStack(i);
            };
        })), x.extend({
            filter: function(e, t, n) {
                var r = t[0];
                return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e) ? [ r ] : [] : x.find.matches(e, x.grep(t, (function(e) {
                    return 1 === e.nodeType;
                })));
            },
            dir: function(e, n, r) {
                var i = [], o = e[n];
                while (o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r))) 1 === o.nodeType && i.push(o), 
                o = o[n];
                return i;
            },
            sibling: function(e, t) {
                var n = [];
                for (;e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n;
            }
        });
        function ft(e, t, n) {
            if (x.isFunction(t)) return x.grep(e, (function(e, r) {
                return !!t.call(e, r, e) !== n;
            }));
            if (t.nodeType) return x.grep(e, (function(e) {
                return e === t !== n;
            }));
            if ("string" == typeof t) {
                if (st.test(t)) return x.filter(t, e, n);
                t = x.filter(t, e);
            }
            return x.grep(e, (function(e) {
                return x.inArray(e, t) >= 0 !== n;
            }));
        }
        function dt(e) {
            var t = ht.split("|"), n = e.createDocumentFragment();
            if (n.createElement) while (t.length) n.createElement(t.pop());
            return n;
        }
        var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", gt = / jQuery\d+="(?:null|\d+)"/g, mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"), yt = /^\s+/, vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bt = /<([\w:]+)/, xt = /<tbody/i, wt = /<|&#?\w+;/, Tt = /<(?:script|style|link)/i, Ct = /^(?:checkbox|radio)$/i, Nt = /checked\s*(?:[^=]|=\s*.checked.)/i, kt = /^$|\/(?:java|ecma)script/i, Et = /^true\/(.*)/, St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, At = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            area: [ 1, "<map>", "</map>" ],
            param: [ 1, "<object>", "</object>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            _default: x.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
        }, jt = dt(a), Dt = jt.appendChild(a.createElement("div"));
        At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, 
        At.th = At.td, x.fn.extend({
            text: function(e) {
                return x.access(this, (function(e) {
                    return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e));
                }), null, e, arguments.length);
            },
            append: function() {
                return this.domManip(arguments, (function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = Lt(this, e);
                        t.appendChild(e);
                    }
                }));
            },
            prepend: function() {
                return this.domManip(arguments, (function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = Lt(this, e);
                        t.insertBefore(e, t.firstChild);
                    }
                }));
            },
            before: function() {
                return this.domManip(arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this);
                }));
            },
            after: function() {
                return this.domManip(arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                }));
            },
            remove: function(e, t) {
                var n, r = e ? x.filter(e, this) : this, i = 0;
                for (;null != (n = r[i]); i++) t || 1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), 
                n.parentNode.removeChild(n));
                return this;
            },
            empty: function() {
                var e, t = 0;
                for (;null != (e = this[t]); t++) {
                    1 === e.nodeType && x.cleanData(Ft(e, !1));
                    while (e.firstChild) e.removeChild(e.firstChild);
                    e.options && x.nodeName(e, "select") && (e.options.length = 0);
                }
                return this;
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t, this.map((function() {
                    return x.clone(this, e, t);
                }));
            },
            html: function(e) {
                return x.access(this, (function(e) {
                    var n = this[0] || {}, r = 0, i = this.length;
                    if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t;
                    if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || [ "", "" ])[1].toLowerCase()])) {
                        e = e.replace(vt, "<$1></$2>");
                        try {
                            for (;i > r; r++) n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), 
                            n.innerHTML = e);
                            n = 0;
                        } catch (o) {}
                    }
                    n && this.empty().append(e);
                }), null, e, arguments.length);
            },
            replaceWith: function() {
                var e = x.map(this, (function(e) {
                    return [ e.nextSibling, e.parentNode ];
                })), t = 0;
                return this.domManip(arguments, (function(n) {
                    var r = e[t++], i = e[t++];
                    i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r));
                }), !0), t ? this : this.remove();
            },
            detach: function(e) {
                return this.remove(e, !0);
            },
            domManip: function(e, t, n) {
                e = d.apply([], e);
                var r, i, o, a, s, l, u = 0, c = this.length, p = this, f = c - 1, h = e[0], g = x.isFunction(h);
                if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) && Nt.test(h)) return this.each((function(r) {
                    var i = p.eq(r);
                    g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n);
                }));
                if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = l.firstChild, 
                1 === l.childNodes.length && (l = r), r)) {
                    for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++) i = l, u !== f && (i = x.clone(i, !0, !0), 
                    o && x.merge(a, Ft(i, "script"))), t.call(this[u], i, u);
                    if (o) for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++) i = a[u], 
                    kt.test(i.type || "") && !x._data(i, "globalEval") && x.contains(s, i) && (i.src ? x._evalUrl(i.src) : x.globalEval((i.text || i.textContent || i.innerHTML || "").replace(St, "")));
                    l = r = null;
                }
                return this;
            }
        });
        function Lt(e, t) {
            return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e;
        }
        function Ht(e) {
            return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e;
        }
        function qt(e) {
            var t = Et.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e;
        }
        function _t(e, t) {
            var n, r = 0;
            for (;null != (n = e[r]); r++) x._data(n, "globalEval", !t || x._data(t[r], "globalEval"));
        }
        function Mt(e, t) {
            if (1 === t.nodeType && x.hasData(e)) {
                var n, r, i, o = x._data(e), a = x._data(t, o), s = o.events;
                if (s) {
                    delete a.handle, a.events = {};
                    for (n in s) for (r = 0, i = s[n].length; i > r; r++) x.event.add(t, n, s[n][r]);
                }
                a.data && (a.data = x.extend({}, a.data));
            }
        }
        function Ot(e, t) {
            var n, r, i;
            if (1 === t.nodeType) {
                if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando]) {
                    i = x._data(t);
                    for (r in i.events) x.removeEvent(t, r, i.handle);
                    t.removeAttribute(x.expando);
                }
                "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), 
                x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, 
                t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue);
            }
        }
        x.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, (function(e, t) {
            x.fn[e] = function(e) {
                var n, r = 0, i = [], o = x(e), a = o.length - 1;
                for (;a >= r; r++) n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get());
                return this.pushStack(i);
            };
        }));
        function Ft(e, n) {
            var r, o, a = 0, s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
            if (!s) for (s = [], r = e.childNodes || e; null != (o = r[a]); a++) !n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n));
            return n === t || n && x.nodeName(e, n) ? x.merge([ e ], s) : s;
        }
        function Bt(e) {
            Ct.test(e.type) && (e.defaultChecked = e.checked);
        }
        x.extend({
            clone: function(e, t, n) {
                var r, i, o, a, s, l = x.contains(e.ownerDocument, e);
                if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, 
                Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e))) for (r = Ft(o), 
                s = Ft(e), a = 0; null != (i = s[a]); ++a) r[a] && Ot(i, r[a]);
                if (t) if (n) for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]); a++) Mt(i, r[a]); else Mt(e, o);
                return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e, "script")), r = s = i = null, 
                o;
            },
            buildFragment: function(e, t, n, r) {
                var i, o, a, s, l, u, c, p = e.length, f = dt(t), d = [], h = 0;
                for (;p > h; h++) if (o = e[h], o || 0 === o) if ("object" === x.type(o)) x.merge(d, o.nodeType ? [ o ] : o); else if (wt.test(o)) {
                    s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || [ "", "" ])[1].toLowerCase(), 
                    c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "<$1></$2>") + c[2], 
                    i = c[0];
                    while (i--) s = s.lastChild;
                    if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), 
                    !x.support.tbody) {
                        o = "table" !== l || xt.test(o) ? "<table>" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, 
                        i = o && o.childNodes.length;
                        while (i--) x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u);
                    }
                    x.merge(d, s.childNodes), s.textContent = "";
                    while (s.firstChild) s.removeChild(s.firstChild);
                    s = f.lastChild;
                } else d.push(t.createTextNode(o));
                s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0;
                while (o = d[h++]) if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), 
                s = Ft(f.appendChild(o), "script"), a && _t(s), n)) {
                    i = 0;
                    while (o = s[i++]) kt.test(o.type || "") && n.push(o);
                }
                return s = null, f;
            },
            cleanData: function(e, t) {
                var n, r, o, a, s = 0, l = x.expando, u = x.cache, c = x.support.deleteExpando, f = x.event.special;
                for (;null != (n = e[s]); s++) if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o])) {
                    if (a.events) for (r in a.events) f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
                    u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, 
                    p.push(o));
                }
            },
            _evalUrl: function(e) {
                return x.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    throws: !0
                });
            }
        }), x.fn.extend({
            wrapAll: function(e) {
                if (x.isFunction(e)) return this.each((function(t) {
                    x(this).wrapAll(e.call(this, t));
                }));
                if (this[0]) {
                    var t = x(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]), t.map((function() {
                        var e = this;
                        while (e.firstChild && 1 === e.firstChild.nodeType) e = e.firstChild;
                        return e;
                    })).append(this);
                }
                return this;
            },
            wrapInner: function(e) {
                return x.isFunction(e) ? this.each((function(t) {
                    x(this).wrapInner(e.call(this, t));
                })) : this.each((function() {
                    var t = x(this), n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e);
                }));
            },
            wrap: function(e) {
                var t = x.isFunction(e);
                return this.each((function(n) {
                    x(this).wrapAll(t ? e.call(this, n) : e);
                }));
            },
            unwrap: function() {
                return this.parent().each((function() {
                    x.nodeName(this, "body") || x(this).replaceWith(this.childNodes);
                })).end();
            }
        });
        var Pt, Rt, Wt, $t = /alpha\([^)]*\)/i, It = /opacity\s*=\s*([^)]*)/, zt = /^(top|right|bottom|left)$/, Xt = /^(none|table(?!-c[ea]).+)/, Ut = /^margin/, Vt = RegExp("^(" + w + ")(.*)$", "i"), Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"), Jt = RegExp("^([+-])=(" + w + ")", "i"), Gt = {
            BODY: "block"
        }, Qt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, Kt = {
            letterSpacing: 0,
            fontWeight: 400
        }, Zt = [ "Top", "Right", "Bottom", "Left" ], en = [ "Webkit", "O", "Moz", "ms" ];
        function tn(e, t) {
            if (t in e) return t;
            var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = en.length;
            while (i--) if (t = en[i] + n, t in e) return t;
            return r;
        }
        function nn(e, t) {
            return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e);
        }
        function rn(e, t) {
            var n, r, i, o = [], a = 0, s = e.length;
            for (;s > a; a++) r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, 
            t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), 
            (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display"))));
            for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
            return e;
        }
        x.fn.extend({
            css: function(e, n) {
                return x.access(this, (function(e, n, r) {
                    var i, o, a = {}, s = 0;
                    if (x.isArray(n)) {
                        for (o = Rt(e), i = n.length; i > s; s++) a[n[s]] = x.css(e, n[s], !1, o);
                        return a;
                    }
                    return r !== t ? x.style(e, n, r) : x.css(e, n);
                }), e, n, arguments.length > 1);
            },
            show: function() {
                return rn(this, !0);
            },
            hide: function() {
                return rn(this);
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function() {
                    nn(this) ? x(this).show() : x(this).hide();
                }));
            }
        }), x.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = Wt(e, "opacity");
                            return "" === n ? "1" : n;
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                float: x.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(e, n, r, i) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o, a, s, l = x.camelCase(n), u = e.style;
                    if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], 
                    r === t) return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n];
                    if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), 
                    a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), 
                    x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (u[n] = "inherit"), 
                    s && "set" in s && (r = s.set(e, r, i)) === t))) try {
                        u[n] = r;
                    } catch (c) {}
                }
            },
            css: function(e, n, r, i) {
                var o, a, s, l = x.camelCase(n);
                return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], 
                s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), 
                "" === r || r ? (o = parseFloat(a), !0 === r || x.isNumeric(o) ? o || 0 : a) : a;
            }
        }), e.getComputedStyle ? (Rt = function(t) {
            return e.getComputedStyle(t, null);
        }, Wt = function(e, n, r) {
            var i, o, a, s = r || Rt(e), l = s ? s.getPropertyValue(n) || s[n] : t, u = e.style;
            return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), 
            Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, 
            l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l;
        }) : a.documentElement.currentStyle && (Rt = function(e) {
            return e.currentStyle;
        }, Wt = function(e, n, r) {
            var i, o, a, s = r || Rt(e), l = s ? s[n] : t, u = e.style;
            return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, 
            o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, 
            l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l;
        });
        function on(e, t, n) {
            var r = Vt.exec(t);
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t;
        }
        function an(e, t, n, r, i) {
            var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0;
            for (;4 > o; o += 2) "margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), 
            "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), 
            "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i)));
            return a;
        }
        function sn(e, t, n) {
            var r = !0, i = "width" === t ? e.offsetWidth : e.offsetHeight, o = Rt(e), a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o);
            if (0 >= i || null == i) {
                if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i)) return i;
                r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0;
            }
            return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px";
        }
        function ln(e) {
            var t = a, n = Gt[e];
            return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), 
            t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("<!doctype html><html><body>"), 
            t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n;
        }
        function un(e, t) {
            var n = x(t.createElement(e)).appendTo(t.body), r = x.css(n[0], "display");
            return n.remove(), r;
        }
        x.each([ "height", "width" ], (function(e, n) {
            x.cssHooks[n] = {
                get: function(e, r, i) {
                    return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, (function() {
                        return sn(e, n, i);
                    })) : sn(e, n, i) : t;
                },
                set: function(e, t, r) {
                    var i = r && Rt(e);
                    return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0);
                }
            };
        })), x.support.opacity || (x.cssHooks.opacity = {
            get: function(e, t) {
                return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
            },
            set: function(e, t) {
                var n = e.style, r = e.currentStyle, i = x.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", o = r && r.filter || n.filter || "";
                n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), 
                "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i);
            }
        }), x((function() {
            x.support.reliableMarginRight || (x.cssHooks.marginRight = {
                get: function(e, n) {
                    return n ? x.swap(e, {
                        display: "inline-block"
                    }, Wt, [ e, "marginRight" ]) : t;
                }
            }), !x.support.pixelPosition && x.fn.position && x.each([ "top", "left" ], (function(e, n) {
                x.cssHooks[n] = {
                    get: function(e, r) {
                        return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t;
                    }
                };
            }));
        })), x.expr && x.expr.filters && (x.expr.filters.hidden = function(e) {
            return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display"));
        }, x.expr.filters.visible = function(e) {
            return !x.expr.filters.hidden(e);
        }), x.each({
            margin: "",
            padding: "",
            border: "Width"
        }, (function(e, t) {
            x.cssHooks[e + t] = {
                expand: function(n) {
                    var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [ n ];
                    for (;4 > r; r++) i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0];
                    return i;
                }
            }, Ut.test(e) || (x.cssHooks[e + t].set = on);
        }));
        var cn = /%20/g, pn = /\[\]$/, fn = /\r?\n/g, dn = /^(?:submit|button|image|reset|file)$/i, hn = /^(?:input|select|textarea|keygen)/i;
        x.fn.extend({
            serialize: function() {
                return x.param(this.serializeArray());
            },
            serializeArray: function() {
                return this.map((function() {
                    var e = x.prop(this, "elements");
                    return e ? x.makeArray(e) : this;
                })).filter((function() {
                    var e = this.type;
                    return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e));
                })).map((function(e, t) {
                    var n = x(this).val();
                    return null == n ? null : x.isArray(n) ? x.map(n, (function(e) {
                        return {
                            name: t.name,
                            value: e.replace(fn, "\r\n")
                        };
                    })) : {
                        name: t.name,
                        value: n.replace(fn, "\r\n")
                    };
                })).get();
            }
        }), x.param = function(e, n) {
            var r, i = [], o = function(e, t) {
                t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
            };
            if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e) || e.jquery && !x.isPlainObject(e)) x.each(e, (function() {
                o(this.name, this.value);
            })); else for (r in e) gn(r, e[r], n, o);
            return i.join("&").replace(cn, "+");
        };
        function gn(e, t, n, r) {
            var i;
            if (x.isArray(t)) x.each(t, (function(t, i) {
                n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r);
            })); else if (n || "object" !== x.type(t)) r(e, t); else for (i in t) gn(e + "[" + i + "]", t[i], n, r);
        }
        x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), (function(e, t) {
            x.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
            };
        })), x.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e);
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n);
            },
            unbind: function(e, t) {
                return this.off(e, null, t);
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r);
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
            }
        });
        var mn, yn, vn = x.now(), bn = /\?/, xn = /#.*$/, wn = /([?&])_=[^&]*/, Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Nn = /^(?:GET|HEAD)$/, kn = /^\/\//, En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Sn = x.fn.load, An = {}, jn = {}, Dn = "*/".concat("*");
        try {
            yn = o.href;
        } catch (Ln) {
            yn = a.createElement("a"), yn.href = "", yn = yn.href;
        }
        mn = En.exec(yn.toLowerCase()) || [];
        function Hn(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var r, i = 0, o = t.toLowerCase().match(T) || [];
                if (x.isFunction(n)) while (r = o[i++]) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n);
            };
        }
        function qn(e, n, r, i) {
            var o = {}, a = e === jn;
            function s(l) {
                var u;
                return o[l] = !0, x.each(e[l] || [], (function(e, l) {
                    var c = l(n, r, i);
                    return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), 
                    s(c), !1);
                })), u;
            }
            return s(n.dataTypes[0]) || !o["*"] && s("*");
        }
        function _n(e, n) {
            var r, i, o = x.ajaxSettings.flatOptions || {};
            for (i in n) n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]);
            return r && x.extend(!0, e, r), e;
        }
        x.fn.load = function(e, n, r) {
            if ("string" != typeof e && Sn) return Sn.apply(this, arguments);
            var i, o, a, s = this, l = e.indexOf(" ");
            return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), x.isFunction(n) ? (r = n, 
            n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({
                url: e,
                type: a,
                dataType: "html",
                data: n
            }).done((function(e) {
                o = arguments, s.html(i ? x("<div>").append(x.parseHTML(e)).find(i) : e);
            })).complete(r && function(e, t) {
                s.each(r, o || [ e.responseText, t, e ]);
            }), this;
        }, x.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], (function(e, t) {
            x.fn[t] = function(e) {
                return this.on(t, e);
            };
        })), x.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: yn,
                type: "GET",
                isLocal: Cn.test(mn[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Dn,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": x.parseJSON,
                    "text xml": x.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e);
            },
            ajaxPrefilter: Hn(An),
            ajaxTransport: Hn(jn),
            ajax: function(e, n) {
                "object" == typeof e && (n = e, e = t), n = n || {};
                var r, i, o, a, s, l, u, c, p = x.ajaxSetup({}, n), f = p.context || p, d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event, h = x.Deferred(), g = x.Callbacks("once memory"), m = p.statusCode || {}, y = {}, v = {}, b = 0, w = "canceled", C = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === b) {
                            if (!c) {
                                c = {};
                                while (t = Tn.exec(a)) c[t[1].toLowerCase()] = t[2];
                            }
                            t = c[e.toLowerCase()];
                        }
                        return null == t ? null : t;
                    },
                    getAllResponseHeaders: function() {
                        return 2 === b ? a : null;
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return b || (e = v[n] = v[n] || e, y[e] = t), this;
                    },
                    overrideMimeType: function(e) {
                        return b || (p.mimeType = e), this;
                    },
                    statusCode: function(e) {
                        var t;
                        if (e) if (2 > b) for (t in e) m[t] = [ m[t], e[t] ]; else C.always(e[C.status]);
                        return this;
                    },
                    abort: function(e) {
                        var t = e || w;
                        return u && u.abort(t), k(0, t), this;
                    }
                };
                if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), 
                p.type = n.method || n.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [ "" ], 
                null == p.crossDomain && (r = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), 
                p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), 
                qn(An, p, n, C), 2 === b) return C;
                l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), 
                p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "&" : "?") + p.data, 
                delete p.data), !1 === p.cache && (p.url = wn.test(o) ? o.replace(wn, "$1_=" + vn++) : o + (bn.test(o) ? "&" : "?") + "_=" + vn++)), 
                p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), 
                x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && !1 !== p.contentType || n.contentType) && C.setRequestHeader("Content-Type", p.contentType), 
                C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : p.accepts["*"]);
                for (i in p.headers) C.setRequestHeader(i, p.headers[i]);
                if (p.beforeSend && (!1 === p.beforeSend.call(f, C, p) || 2 === b)) return C.abort();
                w = "abort";
                for (i in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) C[i](p[i]);
                if (u = qn(jn, p, n, C)) {
                    C.readyState = 1, l && d.trigger("ajaxSend", [ C, p ]), p.async && p.timeout > 0 && (s = setTimeout((function() {
                        C.abort("timeout");
                    }), p.timeout));
                    try {
                        b = 1, u.send(y, k);
                    } catch (N) {
                        if (!(2 > b)) throw N;
                        k(-1, N);
                    }
                } else k(-1, "No Transport");
                function k(e, n, r, i) {
                    var c, y, v, w, T, N = n;
                    2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, 
                    c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), 
                    c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), 
                    T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" === p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, 
                    y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), 
                    C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [ y, N, C ]) : h.rejectWith(f, [ C, N, v ]), 
                    C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [ C, p, c ? y : v ]), 
                    g.fireWith(f, [ C, N ]), l && (d.trigger("ajaxComplete", [ C, p ]), --x.active || x.event.trigger("ajaxStop")));
                }
                return C;
            },
            getJSON: function(e, t, n) {
                return x.get(e, t, n, "json");
            },
            getScript: function(e, n) {
                return x.get(e, t, n, "script");
            }
        }), x.each([ "get", "post" ], (function(e, n) {
            x[n] = function(e, r, i, o) {
                return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({
                    url: e,
                    type: n,
                    dataType: o,
                    data: r,
                    success: i
                });
            };
        }));
        function Mn(e, n, r) {
            var i, o, a, s, l = e.contents, u = e.dataTypes;
            while ("*" === u[0]) u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
            if (o) for (s in l) if (l[s] && l[s].test(o)) {
                u.unshift(s);
                break;
            }
            if (u[0] in r) a = u[0]; else {
                for (s in r) {
                    if (!u[0] || e.converters[s + " " + u[0]]) {
                        a = s;
                        break;
                    }
                    i || (i = s);
                }
                a = a || i;
            }
            return a ? (a !== u[0] && u.unshift(a), r[a]) : t;
        }
        function On(e, t, n, r) {
            var i, o, a, s, l, u = {}, c = e.dataTypes.slice();
            if (c[1]) for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
            o = c.shift();
            while (o) if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), 
            l = o, o = c.shift()) if ("*" === o) o = l; else if ("*" !== l && l !== o) {
                if (a = u[l + " " + o] || u["* " + o], !a) for (i in u) if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                    !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0], c.unshift(s[1]));
                    break;
                }
                if (!0 !== a) if (a && e["throws"]) t = a(t); else try {
                    t = a(t);
                } catch (p) {
                    return {
                        state: "parsererror",
                        error: a ? p : "No conversion from " + l + " to " + o
                    };
                }
            }
            return {
                state: "success",
                data: t
            };
        }
        x.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(e) {
                    return x.globalEval(e), e;
                }
            }
        }), x.ajaxPrefilter("script", (function(e) {
            e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1);
        })), x.ajaxTransport("script", (function(e) {
            if (e.crossDomain) {
                var n, r = a.head || x("head")[0] || a.documentElement;
                return {
                    send: function(t, i) {
                        n = a.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), 
                        n.src = e.url, n.onload = n.onreadystatechange = function(e, t) {
                            (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, 
                            n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success"));
                        }, r.insertBefore(n, r.firstChild);
                    },
                    abort: function() {
                        n && n.onload(t, !0);
                    }
                };
            }
        }));
        var Fn = [], Bn = /(=)\?(?=&|$)|\?\?/;
        x.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = Fn.pop() || x.expando + "_" + vn++;
                return this[e] = !0, e;
            }
        }), x.ajaxPrefilter("json jsonp", (function(n, r, i) {
            var o, a, s, l = !1 !== n.jsonp && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data");
            return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, 
            l ? n[l] = n[l].replace(Bn, "$1" + o) : !1 !== n.jsonp && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), 
            n.converters["script json"] = function() {
                return s || x.error(o + " was not called"), s[0];
            }, n.dataTypes[0] = "json", a = e[o], e[o] = function() {
                s = arguments;
            }, i.always((function() {
                e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), 
                s = a = t;
            })), "script") : t;
        }));
        var Pn, Rn, Wn = 0, $n = e.ActiveXObject && function() {
            var e;
            for (e in Pn) Pn[e](t, !0);
        };
        function In() {
            try {
                return new e.XMLHttpRequest;
            } catch (t) {}
        }
        function zn() {
            try {
                return new e.ActiveXObject("Microsoft.XMLHTTP");
            } catch (t) {}
        }
        x.ajaxSettings.xhr = e.ActiveXObject ? function() {
            return !this.isLocal && In() || zn();
        } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !!Rn && "withCredentials" in Rn, 
        Rn = x.support.ajax = !!Rn, Rn && x.ajaxTransport((function(n) {
            if (!n.crossDomain || x.support.cors) {
                var r;
                return {
                    send: function(i, o) {
                        var a, s, l = n.xhr();
                        if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), 
                        n.xhrFields) for (s in n.xhrFields) l[s] = n.xhrFields[s];
                        n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (s in i) l.setRequestHeader(s, i[s]);
                        } catch (u) {}
                        l.send(n.hasContent && n.data || null), r = function(e, i) {
                            var s, u, c, p;
                            try {
                                if (r && (i || 4 === l.readyState)) if (r = t, a && (l.onreadystatechange = x.noop, 
                                $n && delete Pn[a]), i) 4 !== l.readyState && l.abort(); else {
                                    p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText);
                                    try {
                                        c = l.statusText;
                                    } catch (f) {
                                        c = "";
                                    }
                                    s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404;
                                }
                            } catch (d) {
                                i || o(-1, d);
                            }
                            p && o(s, c, p, u);
                        }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, 
                        x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r();
                    },
                    abort: function() {
                        r && r(t, !0);
                    }
                };
            }
        }));
        var Xn, Un, Vn = /^(?:toggle|show|hide)$/, Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"), Jn = /queueHooks$/, Gn = [ nr ], Qn = {
            "*": [ function(e, t) {
                var n = this.createTween(e, t), r = n.cur(), i = Yn.exec(t), o = i && i[3] || (x.cssNumber[e] ? "" : "px"), a = (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e)), s = 1, l = 20;
                if (a && a[3] !== o) {
                    o = o || a[3], i = i || [], a = +r || 1;
                    do {
                        s = s || ".5", a /= s, x.style(n.elem, e, a + o);
                    } while (s !== (s = n.cur() / r) && 1 !== s && --l);
                }
                return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), 
                n;
            } ]
        };
        function Kn() {
            return setTimeout((function() {
                Xn = t;
            })), Xn = x.now();
        }
        function Zn(e, t, n) {
            var r, i = (Qn[t] || []).concat(Qn["*"]), o = 0, a = i.length;
            for (;a > o; o++) if (r = i[o].call(n, t, e)) return r;
        }
        function er(e, t, n) {
            var r, i, o = 0, a = Gn.length, s = x.Deferred().always((function() {
                delete l.elem;
            })), l = function() {
                if (i) return !1;
                var t = Xn || Kn(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length;
                for (;l > a; a++) u.tweens[a].run(o);
                return s.notifyWith(e, [ u, o, n ]), 1 > o && l ? n : (s.resolveWith(e, [ u ]), 
                !1);
            }, u = s.promise({
                elem: e,
                props: x.extend({}, t),
                opts: x.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Xn || Kn(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r;
                },
                stop: function(t) {
                    var n = 0, r = t ? u.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) u.tweens[n].run(1);
                    return t ? s.resolveWith(e, [ u, t ]) : s.rejectWith(e, [ u, t ]), this;
                }
            }), c = u.props;
            for (tr(c, u.opts.specialEasing); a > o; o++) if (r = Gn[o].call(u, e, c, u.opts)) return r;
            return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l, {
                elem: e,
                anim: u,
                queue: u.opts.queue
            })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always);
        }
        function tr(e, t) {
            var n, r, i, o, a;
            for (n in e) if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], 
            o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a) {
                o = a.expand(o), delete e[r];
                for (n in o) n in e || (e[n] = o[n], t[n] = i);
            } else t[r] = i;
        }
        x.Animation = x.extend(er, {
            tweener: function(e, t) {
                x.isFunction(e) ? (t = e, e = [ "*" ]) : e = e.split(" ");
                var n, r = 0, i = e.length;
                for (;i > r; r++) n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t);
            },
            prefilter: function(e, t) {
                t ? Gn.unshift(e) : Gn.push(e);
            }
        });
        function nr(e, t, n) {
            var r, i, o, a, s, l, u = this, c = {}, p = e.style, f = e.nodeType && nn(e), d = x._data(e, "fxshow");
            n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, 
            s.empty.fire = function() {
                s.unqueued || l();
            }), s.unqueued++, u.always((function() {
                u.always((function() {
                    s.unqueued--, x.queue(e, "fx").length || s.empty.fire();
                }));
            }))), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [ p.overflow, p.overflowX, p.overflowY ], 
            "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), 
            n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always((function() {
                p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2];
            })));
            for (r in t) if (i = t[r], Vn.exec(i)) {
                if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) continue;
                c[r] = d && d[r] || x.style(e, r);
            }
            if (!x.isEmptyObject(c)) {
                d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), 
                f ? x(e).show() : u.done((function() {
                    x(e).hide();
                })), u.done((function() {
                    var t;
                    x._removeData(e, "fxshow");
                    for (t in c) x.style(e, t, c[t]);
                }));
                for (r in c) a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, 
                a.start = "width" === r || "height" === r ? 1 : 0));
            }
        }
        function rr(e, t, n, r, i) {
            return new rr.prototype.init(e, t, n, r, i);
        }
        x.Tween = rr, rr.prototype = {
            constructor: rr,
            init: function(e, t, n, r, i, o) {
                this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), 
                this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px");
            },
            cur: function() {
                var e = rr.propHooks[this.prop];
                return e && e.get ? e.get(this) : rr.propHooks._default.get(this);
            },
            run: function(e) {
                var t, n = rr.propHooks[this.prop];
                return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, 
                this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                n && n.set ? n.set(this) : rr.propHooks._default.set(this), this;
            }
        }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), 
                    t && "auto" !== t ? t : 0) : e.elem[e.prop];
                },
                set: function(e) {
                    x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
                }
            }
        }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
            }
        }, x.each([ "toggle", "show", "hide" ], (function(e, t) {
            var n = x.fn[t];
            x.fn[t] = function(e, r, i) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i);
            };
        })), x.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(nn).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r);
            },
            animate: function(e, t, n, r) {
                var i = x.isEmptyObject(e), o = x.speed(t, n, r), a = function() {
                    var t = er(this, x.extend({}, e), o);
                    (i || x._data(this, "finish")) && t.stop(!0);
                };
                return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a);
            },
            stop: function(e, n, r) {
                var i = function(e) {
                    var t = e.stop;
                    delete e.stop, t(r);
                };
                return "string" != typeof e && (r = n, n = e, e = t), n && !1 !== e && this.queue(e || "fx", []), 
                this.each((function() {
                    var t = !0, n = null != e && e + "queueHooks", o = x.timers, a = x._data(this);
                    if (n) a[n] && a[n].stop && i(a[n]); else for (n in a) a[n] && a[n].stop && Jn.test(n) && i(a[n]);
                    for (n = o.length; n--; ) o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), 
                    t = !1, o.splice(n, 1));
                    (t || !r) && x.dequeue(this, e);
                }));
            },
            finish: function(e) {
                return !1 !== e && (e = e || "fx"), this.each((function() {
                    var t, n = x._data(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = x.timers, a = r ? r.length : 0;
                    for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), 
                    t = o.length; t--; ) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), 
                    o.splice(t, 1));
                    for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                    delete n.finish;
                }));
            }
        });
        function ir(e, t) {
            var n, r = {
                height: e
            }, i = 0;
            for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Zt[i], r["margin" + n] = r["padding" + n] = e;
            return t && (r.opacity = r.width = e), r;
        }
        x.each({
            slideDown: ir("show"),
            slideUp: ir("hide"),
            slideToggle: ir("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, (function(e, t) {
            x.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r);
            };
        })), x.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? x.extend({}, e) : {
                complete: n || !n && t || x.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !x.isFunction(t) && t
            };
            return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, 
            (null == r.queue || !0 === r.queue) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue);
            }, r;
        }, x.easing = {
            linear: function(e) {
                return e;
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2;
            }
        }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function() {
            var e, n = x.timers, r = 0;
            for (Xn = x.now(); n.length > r; r++) e = n[r], e() || n[r] !== e || n.splice(r--, 1);
            n.length || x.fx.stop(), Xn = t;
        }, x.fx.timer = function(e) {
            e() && x.timers.push(e) && x.fx.start();
        }, x.fx.interval = 13, x.fx.start = function() {
            Un || (Un = setInterval(x.fx.tick, x.fx.interval));
        }, x.fx.stop = function() {
            clearInterval(Un), Un = null;
        }, x.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function(e) {
            return x.grep(x.timers, (function(t) {
                return e === t.elem;
            })).length;
        }), x.fn.offset = function(e) {
            if (arguments.length) return e === t ? this : this.each((function(t) {
                x.offset.setOffset(this, e, t);
            }));
            var n, r, o = {
                top: 0,
                left: 0
            }, a = this[0], s = a && a.ownerDocument;
            if (s) return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), 
            r = or(s), {
                top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
                left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
            }) : o;
        }, x.offset = {
            setOffset: function(e, t, n) {
                var r = x.css(e, "position");
                "static" === r && (e.style.position = "relative");
                var p, f, i = x(e), o = i.offset(), a = x.css(e, "top"), s = x.css(e, "left"), l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [ a, s ]) > -1, u = {}, c = {};
                l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), 
                x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), 
                null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u);
            }
        }, x.fn.extend({
            position: function() {
                if (this[0]) {
                    var e, t, n = {
                        top: 0,
                        left: 0
                    }, r = this[0];
                    return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), 
                    t = this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), 
                    n.left += x.css(e[0], "borderLeftWidth", !0)), {
                        top: t.top - n.top - x.css(r, "marginTop", !0),
                        left: t.left - n.left - x.css(r, "marginLeft", !0)
                    };
                }
            },
            offsetParent: function() {
                return this.map((function() {
                    var e = this.offsetParent || s;
                    while (e && !x.nodeName(e, "html") && "static" === x.css(e, "position")) e = e.offsetParent;
                    return e || s;
                }));
            }
        }), x.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, (function(e, n) {
            var r = /Y/.test(n);
            x.fn[e] = function(i) {
                return x.access(this, (function(e, i, o) {
                    var a = or(e);
                    return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, 
                    t);
                }), e, i, arguments.length, null);
            };
        }));
        function or(e) {
            return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
        }
        x.each({
            Height: "height",
            Width: "width"
        }, (function(e, n) {
            x.each({
                padding: "inner" + e,
                content: n,
                "": "outer" + e
            }, (function(r, i) {
                x.fn[i] = function(i, o) {
                    var a = arguments.length && (r || "boolean" != typeof i), s = r || (!0 === i || !0 === o ? "margin" : "border");
                    return x.access(this, (function(n, r, i) {
                        var o;
                        return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, 
                        Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s);
                    }), n, a ? i : t, a, null);
                };
            }));
        })), x.fn.size = function() {
            return this.length;
        }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, 
        "function" == typeof define && define.amd && define("jquery", [], (function() {
            return x;
        })));
    })(window);
    var DateFormatter;
    !function() {
        "use strict";
        var D, s, r, a, n;
        D = function(e, t) {
            return "string" == typeof e && "string" == typeof t && e.toLowerCase() === t.toLowerCase();
        }, s = function(e, t, a) {
            var n = a || "0", r = e.toString();
            return r.length < t ? s(n + r, t) : r;
        }, r = function(e) {
            var t, a;
            for (e = e || {}, t = 1; t < arguments.length; t++) if (a = arguments[t]) for (var n in a) a.hasOwnProperty(n) && ("object" == typeof a[n] ? r(e[n], a[n]) : e[n] = a[n]);
            return e;
        }, a = function(e, t) {
            for (var a = 0; a < t.length; a++) if (t[a].toLowerCase() === e.toLowerCase()) return a;
            return -1;
        }, n = {
            dateSettings: {
                days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
                daysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                meridiem: [ "AM", "PM" ],
                ordinal: function(e) {
                    var t = e % 10, a = {
                        1: "st",
                        2: "nd",
                        3: "rd"
                    };
                    return 1 !== Math.floor(e % 100 / 10) && a[t] ? a[t] : "th";
                }
            },
            separators: /[ \-+\/\.T:@]/g,
            validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
            intParts: /[djwNzmnyYhHgGis]/g,
            tzParts: /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            tzClip: /[^-+\dA-Z]/g
        }, (DateFormatter = function(e) {
            var t = this, a = r(n, e);
            t.dateSettings = a.dateSettings, t.separators = a.separators, t.validParts = a.validParts, 
            t.intParts = a.intParts, t.tzParts = a.tzParts, t.tzClip = a.tzClip;
        }).prototype = {
            constructor: DateFormatter,
            getMonth: function(e) {
                var t;
                return 0 === (t = a(e, this.dateSettings.monthsShort) + 1) && (t = a(e, this.dateSettings.months) + 1), 
                t;
            },
            parseDate: function(e, t) {
                var a, n, r, o, i, s, d, u, l, f, c = this, m = !1, h = !1, g = c.dateSettings, p = {
                    date: null,
                    year: null,
                    month: null,
                    day: null,
                    hour: 0,
                    min: 0,
                    sec: 0
                };
                if (!e) return null;
                if (e instanceof Date) return e;
                if ("U" === t) return (r = parseInt(e)) ? new Date(1e3 * r) : e;
                switch (typeof e) {
                  case "number":
                    return new Date(e);

                  case "string":
                    break;

                  default:
                    return null;
                }
                if (!(a = t.match(c.validParts)) || 0 === a.length) throw new Error("Invalid date format definition.");
                for (n = e.replace(c.separators, "\0").split("\0"), r = 0; r < n.length; r++) switch (o = n[r], 
                i = parseInt(o), a[r]) {
                  case "y":
                  case "Y":
                    if (!i) return null;
                    l = o.length, p.year = 2 === l ? parseInt((i < 70 ? "20" : "19") + o) : i, m = !0;
                    break;

                  case "m":
                  case "n":
                  case "M":
                  case "F":
                    if (isNaN(i)) {
                        if (!(0 < (s = c.getMonth(o)))) return null;
                        p.month = s;
                    } else {
                        if (!(1 <= i && i <= 12)) return null;
                        p.month = i;
                    }
                    m = !0;
                    break;

                  case "d":
                  case "j":
                    if (!(1 <= i && i <= 31)) return null;
                    p.day = i, m = !0;
                    break;

                  case "g":
                  case "h":
                    if (f = n[d = -1 < a.indexOf("a") ? a.indexOf("a") : -1 < a.indexOf("A") ? a.indexOf("A") : -1], 
                    -1 < d) u = D(f, g.meridiem[0]) ? 0 : D(f, g.meridiem[1]) ? 12 : -1, 1 <= i && i <= 12 && -1 < u ? p.hour = i + u - 1 : 0 <= i && i <= 23 && (p.hour = i); else {
                        if (!(0 <= i && i <= 23)) return null;
                        p.hour = i;
                    }
                    h = !0;
                    break;

                  case "G":
                  case "H":
                    if (!(0 <= i && i <= 23)) return null;
                    p.hour = i, h = !0;
                    break;

                  case "i":
                    if (!(0 <= i && i <= 59)) return null;
                    p.min = i, h = !0;
                    break;

                  case "s":
                    if (!(0 <= i && i <= 59)) return null;
                    p.sec = i, h = !0;
                }
                if (!0 === m && p.year && p.month && p.day) p.date = new Date(p.year, p.month - 1, p.day, p.hour, p.min, p.sec, 0); else {
                    if (!0 !== h) return null;
                    p.date = new Date(0, 0, 0, p.hour, p.min, p.sec, 0);
                }
                return p.date;
            },
            guessDate: function(e, t) {
                if ("string" != typeof e) return e;
                var a, n, r, o, i, s, d = e.replace(this.separators, "\0").split("\0"), u = t.match(this.validParts), l = new Date, f = 0;
                if (!/^[djmn]/g.test(u[0])) return e;
                for (r = 0; r < d.length; r++) {
                    if (f = 2, i = d[r], s = parseInt(i.substr(0, 2)), isNaN(s)) return null;
                    switch (r) {
                      case 0:
                        "m" === u[0] || "n" === u[0] ? l.setMonth(s - 1) : l.setDate(s);
                        break;

                      case 1:
                        "m" === u[0] || "n" === u[0] ? l.setDate(s) : l.setMonth(s - 1);
                        break;

                      case 2:
                        if (n = l.getFullYear(), f = (a = i.length) < 4 ? a : 4, !(n = parseInt(a < 4 ? n.toString().substr(0, 4 - a) + i : i.substr(0, 4)))) return null;
                        l.setFullYear(n);
                        break;

                      case 3:
                        l.setHours(s);
                        break;

                      case 4:
                        l.setMinutes(s);
                        break;

                      case 5:
                        l.setSeconds(s);
                    }
                    0 < (o = i.substr(f)).length && d.splice(r + 1, 0, o);
                }
                return l;
            },
            parseFormat: function(e, n) {
                var a, t = this, r = t.dateSettings, o = /\\?(.?)/gi, i = function(e, t) {
                    return a[e] ? a[e]() : t;
                };
                return a = {
                    d: function() {
                        return s(a.j(), 2);
                    },
                    D: function() {
                        return r.daysShort[a.w()];
                    },
                    j: function() {
                        return n.getDate();
                    },
                    l: function() {
                        return r.days[a.w()];
                    },
                    N: function() {
                        return a.w() || 7;
                    },
                    w: function() {
                        return n.getDay();
                    },
                    z: function() {
                        var e = new Date(a.Y(), a.n() - 1, a.j()), t = new Date(a.Y(), 0, 1);
                        return Math.round((e - t) / 864e5);
                    },
                    W: function() {
                        var e = new Date(a.Y(), a.n() - 1, a.j() - a.N() + 3), t = new Date(e.getFullYear(), 0, 4);
                        return s(1 + Math.round((e - t) / 864e5 / 7), 2);
                    },
                    F: function() {
                        return r.months[n.getMonth()];
                    },
                    m: function() {
                        return s(a.n(), 2);
                    },
                    M: function() {
                        return r.monthsShort[n.getMonth()];
                    },
                    n: function() {
                        return n.getMonth() + 1;
                    },
                    t: function() {
                        return new Date(a.Y(), a.n(), 0).getDate();
                    },
                    L: function() {
                        var e = a.Y();
                        return e % 4 == 0 && e % 100 != 0 || e % 400 == 0 ? 1 : 0;
                    },
                    o: function() {
                        var e = a.n(), t = a.W();
                        return a.Y() + (12 === e && t < 9 ? 1 : 1 === e && 9 < t ? -1 : 0);
                    },
                    Y: function() {
                        return n.getFullYear();
                    },
                    y: function() {
                        return a.Y().toString().slice(-2);
                    },
                    a: function() {
                        return a.A().toLowerCase();
                    },
                    A: function() {
                        var e = a.G() < 12 ? 0 : 1;
                        return r.meridiem[e];
                    },
                    B: function() {
                        var e = 3600 * n.getUTCHours(), t = 60 * n.getUTCMinutes(), a = n.getUTCSeconds();
                        return s(Math.floor((e + t + a + 3600) / 86.4) % 1e3, 3);
                    },
                    g: function() {
                        return a.G() % 12 || 12;
                    },
                    G: function() {
                        return n.getHours();
                    },
                    h: function() {
                        return s(a.g(), 2);
                    },
                    H: function() {
                        return s(a.G(), 2);
                    },
                    i: function() {
                        return s(n.getMinutes(), 2);
                    },
                    s: function() {
                        return s(n.getSeconds(), 2);
                    },
                    u: function() {
                        return s(1e3 * n.getMilliseconds(), 6);
                    },
                    e: function() {
                        return /\((.*)\)/.exec(String(n))[1] || "Coordinated Universal Time";
                    },
                    I: function() {
                        return new Date(a.Y(), 0) - Date.UTC(a.Y(), 0) != new Date(a.Y(), 6) - Date.UTC(a.Y(), 6) ? 1 : 0;
                    },
                    O: function() {
                        var e = n.getTimezoneOffset(), t = Math.abs(e);
                        return (0 < e ? "-" : "+") + s(100 * Math.floor(t / 60) + t % 60, 4);
                    },
                    P: function() {
                        var e = a.O();
                        return e.substr(0, 3) + ":" + e.substr(3, 2);
                    },
                    T: function() {
                        return (String(n).match(t.tzParts) || [ "" ]).pop().replace(t.tzClip, "") || "UTC";
                    },
                    Z: function() {
                        return 60 * -n.getTimezoneOffset();
                    },
                    c: function() {
                        return "Y-m-d\\TH:i:sP".replace(o, i);
                    },
                    r: function() {
                        return "D, d M Y H:i:s O".replace(o, i);
                    },
                    U: function() {
                        return n.getTime() / 1e3 || 0;
                    }
                }, i(e, e);
            },
            formatDate: function(e, t) {
                var a, n, r, o, i, s = "";
                if ("string" == typeof e && !(e = this.parseDate(e, t))) return null;
                if (e instanceof Date) {
                    for (r = t.length, a = 0; a < r; a++) "S" !== (i = t.charAt(a)) && "\\" !== i && (0 < a && "\\" === t.charAt(a - 1) ? s += i : (o = this.parseFormat(i, e), 
                    a !== r - 1 && this.intParts.test(i) && "S" === t.charAt(a + 1) && (n = parseInt(o) || 0, 
                    o += this.dateSettings.ordinal(n)), s += o));
                    return s;
                }
                return "";
            }
        };
    }();
    var datetimepickerFactory = function(L) {
        "use strict";
        var s = {
            i18n: {
                ar: {
                    months: [ "كانون الثاني", "شباط", "آذار", "نيسان", "مايو", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول" ],
                    dayOfWeekShort: [ "ن", "ث", "ع", "خ", "ج", "س", "ح" ],
                    dayOfWeek: [ "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد" ]
                },
                ro: {
                    months: [ "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie" ],
                    dayOfWeekShort: [ "Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ" ],
                    dayOfWeek: [ "Duminică", "Luni", "Marţi", "Miercuri", "Joi", "Vineri", "Sâmbătă" ]
                },
                id: {
                    months: [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ],
                    dayOfWeekShort: [ "Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab" ],
                    dayOfWeek: [ "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu" ]
                },
                is: {
                    months: [ "Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember" ],
                    dayOfWeekShort: [ "Sun", "Mán", "Þrið", "Mið", "Fim", "Fös", "Lau" ],
                    dayOfWeek: [ "Sunnudagur", "Mánudagur", "Þriðjudagur", "Miðvikudagur", "Fimmtudagur", "Föstudagur", "Laugardagur" ]
                },
                bg: {
                    months: [ "Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември" ],
                    dayOfWeekShort: [ "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                    dayOfWeek: [ "Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота" ]
                },
                fa: {
                    months: [ "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند" ],
                    dayOfWeekShort: [ "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه" ],
                    dayOfWeek: [ "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه", "یک‌شنبه" ]
                },
                ru: {
                    months: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
                    dayOfWeekShort: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                    dayOfWeek: [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ]
                },
                uk: {
                    months: [ "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень" ],
                    dayOfWeekShort: [ "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                    dayOfWeek: [ "Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота" ]
                },
                en: {
                    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                    dayOfWeekShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                    dayOfWeek: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
                },
                el: {
                    months: [ "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος" ],
                    dayOfWeekShort: [ "Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ" ],
                    dayOfWeek: [ "Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο" ]
                },
                de: {
                    months: [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ],
                    dayOfWeekShort: [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ],
                    dayOfWeek: [ "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag" ]
                },
                nl: {
                    months: [ "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december" ],
                    dayOfWeekShort: [ "zo", "ma", "di", "wo", "do", "vr", "za" ],
                    dayOfWeek: [ "zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag" ]
                },
                tr: {
                    months: [ "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık" ],
                    dayOfWeekShort: [ "Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts" ],
                    dayOfWeek: [ "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi" ]
                },
                fr: {
                    months: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
                    dayOfWeekShort: [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ],
                    dayOfWeek: [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ]
                },
                es: {
                    months: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
                    dayOfWeekShort: [ "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb" ],
                    dayOfWeek: [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ]
                },
                th: {
                    months: [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม" ],
                    dayOfWeekShort: [ "อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส." ],
                    dayOfWeek: [ "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์" ]
                },
                pl: {
                    months: [ "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień" ],
                    dayOfWeekShort: [ "nd", "pn", "wt", "śr", "cz", "pt", "sb" ],
                    dayOfWeek: [ "niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota" ]
                },
                pt: {
                    months: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
                    dayOfWeekShort: [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab" ],
                    dayOfWeek: [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ]
                },
                ch: {
                    months: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
                    dayOfWeekShort: [ "日", "一", "二", "三", "四", "五", "六" ]
                },
                se: {
                    months: [ "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December" ],
                    dayOfWeekShort: [ "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör" ]
                },
                km: {
                    months: [ "មករា​", "កុម្ភៈ", "មិនា​", "មេសា​", "ឧសភា​", "មិថុនា​", "កក្កដា​", "សីហា​", "កញ្ញា​", "តុលា​", "វិច្ឆិកា", "ធ្នូ​" ],
                    dayOfWeekShort: [ "អាទិ​", "ច័ន្ទ​", "អង្គារ​", "ពុធ​", "ព្រហ​​", "សុក្រ​", "សៅរ៍" ],
                    dayOfWeek: [ "អាទិត្យ​", "ច័ន្ទ​", "អង្គារ​", "ពុធ​", "ព្រហស្បតិ៍​", "សុក្រ​", "សៅរ៍" ]
                },
                kr: {
                    months: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
                    dayOfWeekShort: [ "일", "월", "화", "수", "목", "금", "토" ],
                    dayOfWeek: [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]
                },
                it: {
                    months: [ "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre" ],
                    dayOfWeekShort: [ "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab" ],
                    dayOfWeek: [ "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato" ]
                },
                da: {
                    months: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ],
                    dayOfWeekShort: [ "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør" ],
                    dayOfWeek: [ "søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag" ]
                },
                no: {
                    months: [ "Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember" ],
                    dayOfWeekShort: [ "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør" ],
                    dayOfWeek: [ "Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag" ]
                },
                ja: {
                    months: [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ],
                    dayOfWeekShort: [ "日", "月", "火", "水", "木", "金", "土" ],
                    dayOfWeek: [ "日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜" ]
                },
                vi: {
                    months: [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" ],
                    dayOfWeekShort: [ "CN", "T2", "T3", "T4", "T5", "T6", "T7" ],
                    dayOfWeek: [ "Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy" ]
                },
                sl: {
                    months: [ "Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December" ],
                    dayOfWeekShort: [ "Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob" ],
                    dayOfWeek: [ "Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota" ]
                },
                cs: {
                    months: [ "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec" ],
                    dayOfWeekShort: [ "Ne", "Po", "Út", "St", "Čt", "Pá", "So" ]
                },
                hu: {
                    months: [ "Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December" ],
                    dayOfWeekShort: [ "Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo" ],
                    dayOfWeek: [ "vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat" ]
                },
                az: {
                    months: [ "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr" ],
                    dayOfWeekShort: [ "B", "Be", "Ça", "Ç", "Ca", "C", "Ş" ],
                    dayOfWeek: [ "Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə" ]
                },
                bs: {
                    months: [ "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar" ],
                    dayOfWeekShort: [ "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub" ],
                    dayOfWeek: [ "Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota" ]
                },
                ca: {
                    months: [ "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre" ],
                    dayOfWeekShort: [ "Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds" ],
                    dayOfWeek: [ "Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte" ]
                },
                "en-GB": {
                    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                    dayOfWeekShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                    dayOfWeek: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
                },
                et: {
                    months: [ "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember" ],
                    dayOfWeekShort: [ "P", "E", "T", "K", "N", "R", "L" ],
                    dayOfWeek: [ "Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev" ]
                },
                eu: {
                    months: [ "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua" ],
                    dayOfWeekShort: [ "Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La." ],
                    dayOfWeek: [ "Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata" ]
                },
                fi: {
                    months: [ "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu" ],
                    dayOfWeekShort: [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ],
                    dayOfWeek: [ "sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai" ]
                },
                gl: {
                    months: [ "Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec" ],
                    dayOfWeekShort: [ "Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab" ],
                    dayOfWeek: [ "Domingo", "Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado" ]
                },
                hr: {
                    months: [ "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac" ],
                    dayOfWeekShort: [ "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub" ],
                    dayOfWeek: [ "Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota" ]
                },
                ko: {
                    months: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
                    dayOfWeekShort: [ "일", "월", "화", "수", "목", "금", "토" ],
                    dayOfWeek: [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]
                },
                lt: {
                    months: [ "Sausio", "Vasario", "Kovo", "Balandžio", "Gegužės", "Birželio", "Liepos", "Rugpjūčio", "Rugsėjo", "Spalio", "Lapkričio", "Gruodžio" ],
                    dayOfWeekShort: [ "Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš" ],
                    dayOfWeek: [ "Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis" ]
                },
                lv: {
                    months: [ "Janvāris", "Februāris", "Marts", "Aprīlis ", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris" ],
                    dayOfWeekShort: [ "Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St" ],
                    dayOfWeek: [ "Svētdiena", "Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena", "Piektdiena", "Sestdiena" ]
                },
                mk: {
                    months: [ "јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември" ],
                    dayOfWeekShort: [ "нед", "пон", "вто", "сре", "чет", "пет", "саб" ],
                    dayOfWeek: [ "Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота" ]
                },
                mn: {
                    months: [ "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар" ],
                    dayOfWeekShort: [ "Дав", "Мяг", "Лха", "Пүр", "Бсн", "Бям", "Ням" ],
                    dayOfWeek: [ "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням" ]
                },
                "pt-BR": {
                    months: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
                    dayOfWeekShort: [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb" ],
                    dayOfWeek: [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ]
                },
                sk: {
                    months: [ "Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December" ],
                    dayOfWeekShort: [ "Ne", "Po", "Ut", "St", "Št", "Pi", "So" ],
                    dayOfWeek: [ "Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota" ]
                },
                sq: {
                    months: [ "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor" ],
                    dayOfWeekShort: [ "Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Shtu" ],
                    dayOfWeek: [ "E Diel", "E Hënë", "E Martē", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë" ]
                },
                "sr-YU": {
                    months: [ "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar" ],
                    dayOfWeekShort: [ "Ned", "Pon", "Uto", "Sre", "čet", "Pet", "Sub" ],
                    dayOfWeek: [ "Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota" ]
                },
                sr: {
                    months: [ "јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар" ],
                    dayOfWeekShort: [ "нед", "пон", "уто", "сре", "чет", "пет", "суб" ],
                    dayOfWeek: [ "Недеља", "Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота" ]
                },
                sv: {
                    months: [ "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December" ],
                    dayOfWeekShort: [ "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör" ],
                    dayOfWeek: [ "Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag" ]
                },
                "zh-TW": {
                    months: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
                    dayOfWeekShort: [ "日", "一", "二", "三", "四", "五", "六" ],
                    dayOfWeek: [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ]
                },
                zh: {
                    months: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
                    dayOfWeekShort: [ "日", "一", "二", "三", "四", "五", "六" ],
                    dayOfWeek: [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ]
                },
                ug: {
                    months: [ "1-ئاي", "2-ئاي", "3-ئاي", "4-ئاي", "5-ئاي", "6-ئاي", "7-ئاي", "8-ئاي", "9-ئاي", "10-ئاي", "11-ئاي", "12-ئاي" ],
                    dayOfWeek: [ "يەكشەنبە", "دۈشەنبە", "سەيشەنبە", "چارشەنبە", "پەيشەنبە", "جۈمە", "شەنبە" ]
                },
                he: {
                    months: [ "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר" ],
                    dayOfWeekShort: [ "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת" ],
                    dayOfWeek: [ "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון" ]
                },
                hy: {
                    months: [ "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր" ],
                    dayOfWeekShort: [ "Կի", "Երկ", "Երք", "Չոր", "Հնգ", "Ուրբ", "Շբթ" ],
                    dayOfWeek: [ "Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ" ]
                },
                kg: {
                    months: [ "Үчтүн айы", "Бирдин айы", "Жалган Куран", "Чын Куран", "Бугу", "Кулжа", "Теке", "Баш Оона", "Аяк Оона", "Тогуздун айы", "Жетинин айы", "Бештин айы" ],
                    dayOfWeekShort: [ "Жек", "Дүй", "Шей", "Шар", "Бей", "Жум", "Ише" ],
                    dayOfWeek: [ "Жекшемб", "Дүйшөмб", "Шейшемб", "Шаршемб", "Бейшемби", "Жума", "Ишенб" ]
                },
                rm: {
                    months: [ "Schaner", "Favrer", "Mars", "Avrigl", "Matg", "Zercladur", "Fanadur", "Avust", "Settember", "October", "November", "December" ],
                    dayOfWeekShort: [ "Du", "Gli", "Ma", "Me", "Gie", "Ve", "So" ],
                    dayOfWeek: [ "Dumengia", "Glindesdi", "Mardi", "Mesemna", "Gievgia", "Venderdi", "Sonda" ]
                },
                ka: {
                    months: [ "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი" ],
                    dayOfWeekShort: [ "კვ", "ორშ", "სამშ", "ოთხ", "ხუთ", "პარ", "შაბ" ],
                    dayOfWeek: [ "კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი" ]
                },
                kk: {
                    months: [ "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан" ],
                    dayOfWeekShort: [ "Жк", "Дс", "Сс", "Ср", "Бс", "Жм", "Сб" ],
                    dayOfWeek: [ "Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі" ]
                }
            },
            ownerDocument: document,
            contentWindow: window,
            value: "",
            rtl: !1,
            format: "Y/m/d H:i",
            formatTime: "H:i",
            formatDate: "Y/m/d",
            startDate: !1,
            step: 60,
            monthChangeSpinner: !0,
            closeOnDateSelect: !1,
            closeOnTimeSelect: !0,
            closeOnWithoutClick: !0,
            closeOnInputClick: !0,
            openOnFocus: !0,
            timepicker: !0,
            datepicker: !0,
            weeks: !1,
            defaultTime: !1,
            defaultDate: !1,
            minDate: !1,
            maxDate: !1,
            minTime: !1,
            maxTime: !1,
            minDateTime: !1,
            maxDateTime: !1,
            allowTimes: [],
            opened: !1,
            initTime: !0,
            inline: !1,
            theme: "",
            touchMovedThreshold: 5,
            onSelectDate: function() {},
            onSelectTime: function() {},
            onChangeMonth: function() {},
            onGetWeekOfYear: function() {},
            onChangeYear: function() {},
            onChangeDateTime: function() {},
            onShow: function() {},
            onClose: function() {},
            onGenerate: function() {},
            withoutCopyright: !0,
            inverseButton: !1,
            hours12: !1,
            next: "xdsoft_next",
            prev: "xdsoft_prev",
            dayOfWeekStart: 0,
            parentID: "body",
            timeHeightInTimePicker: 25,
            timepickerScrollbar: !0,
            todayButton: !0,
            prevButton: !0,
            nextButton: !0,
            defaultSelect: !0,
            scrollMonth: !0,
            scrollTime: !0,
            scrollInput: !0,
            lazyInit: !1,
            mask: !1,
            validateOnBlur: !0,
            allowBlank: !0,
            yearStart: 1950,
            yearEnd: 2050,
            monthStart: 0,
            monthEnd: 11,
            style: "",
            id: "",
            fixed: !1,
            roundTime: "round",
            className: "",
            weekends: [],
            highlightedDates: [],
            highlightedPeriods: [],
            allowDates: [],
            allowDateRe: null,
            disabledDates: [],
            disabledWeekDays: [],
            yearOffset: 0,
            beforeShowDay: null,
            enterLikeTab: !0,
            showApplyButton: !1,
            insideParent: !1
        }, E = null, n = null, R = "en", a = {
            meridiem: [ "AM", "PM" ]
        }, r = function() {
            var e = s.i18n[R], t = {
                days: e.dayOfWeek,
                daysShort: e.dayOfWeekShort,
                months: e.months,
                monthsShort: L.map(e.months, (function(e) {
                    return e.substring(0, 3);
                }))
            };
            "function" == typeof DateFormatter && (E = n = new DateFormatter({
                dateSettings: L.extend({}, a, t)
            }));
        }, o = {
            moment: {
                default_options: {
                    format: "YYYY/MM/DD HH:mm",
                    formatDate: "YYYY/MM/DD",
                    formatTime: "HH:mm"
                },
                formatter: {
                    parseDate: function(e, t) {
                        if (i(t)) return n.parseDate(e, t);
                        var a = moment(e, t);
                        return !!a.isValid() && a.toDate();
                    },
                    formatDate: function(e, t) {
                        return i(t) ? n.formatDate(e, t) : moment(e).format(t);
                    },
                    formatMask: function(e) {
                        return e.replace(/Y{4}/g, "9999").replace(/Y{2}/g, "99").replace(/M{2}/g, "19").replace(/D{2}/g, "39").replace(/H{2}/g, "29").replace(/m{2}/g, "59").replace(/s{2}/g, "59");
                    }
                }
            }
        };
        L.datetimepicker = {
            setLocale: function(e) {
                var t = s.i18n[e] ? e : "en";
                R !== t && (R = t, r());
            },
            setDateFormatter: function(e) {
                if ("string" == typeof e && o.hasOwnProperty(e)) {
                    var t = o[e];
                    L.extend(s, t.default_options), E = t.formatter;
                } else E = e;
            }
        };
        var t = {
            RFC_2822: "D, d M Y H:i:s O",
            ATOM: "Y-m-dTH:i:sP",
            ISO_8601: "Y-m-dTH:i:sO",
            RFC_822: "D, d M y H:i:s O",
            RFC_850: "l, d-M-y H:i:s T",
            RFC_1036: "D, d M y H:i:s O",
            RFC_1123: "D, d M Y H:i:s O",
            RSS: "D, d M Y H:i:s O",
            W3C: "Y-m-dTH:i:sP"
        }, i = function(e) {
            return -1 !== Object.values(t).indexOf(e);
        };
        function m(e, t, a) {
            this.date = e, this.desc = t, this.style = a;
        }
        L.extend(L.datetimepicker, t), r(), window.getComputedStyle || (window.getComputedStyle = function(a) {
            return this.el = a, this.getPropertyValue = function(e) {
                var t = /(-([a-z]))/g;
                return "float" === e && (e = "styleFloat"), t.test(e) && (e = e.replace(t, (function(e, t, a) {
                    return a.toUpperCase();
                }))), a.currentStyle[e] || null;
            }, this;
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function(e, t) {
            var a, n;
            for (a = t || 0, n = this.length; a < n; a += 1) if (this[a] === e) return a;
            return -1;
        }), Date.prototype.countDaysInMonth = function() {
            return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
        }, L.fn.xdsoftScroller = function(D, y) {
            return this.each((function() {
                var o, i, s, d, u, l = L(this), a = function(e) {
                    var t, a = {
                        x: 0,
                        y: 0
                    };
                    return "touchstart" === e.type || "touchmove" === e.type || "touchend" === e.type || "touchcancel" === e.type ? (t = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0], 
                    a.x = t.clientX, a.y = t.clientY) : "mousedown" !== e.type && "mouseup" !== e.type && "mousemove" !== e.type && "mouseover" !== e.type && "mouseout" !== e.type && "mouseenter" !== e.type && "mouseleave" !== e.type || (a.x = e.clientX, 
                    a.y = e.clientY), a;
                }, f = 0, c = 100, n = !1, r = 0, m = 0, h = 0, t = !1, g = 0, p = function() {};
                "hide" !== y ? (L(this).hasClass("xdsoft_scroller_box") || (o = l.children().eq(0), 
                f = Math.abs(parseInt(o.css("marginTop"), 10)), i = l[0].clientHeight, s = o[0].offsetHeight, 
                d = L('<div class="xdsoft_scrollbar"></div>'), u = L('<div class="xdsoft_scroller"></div>'), 
                d.append(u), l.addClass("xdsoft_scroller_box").append(d), p = function(e) {
                    var t = a(e).y - r + g;
                    t < 0 && (t = 0), t + u[0].offsetHeight > h && (t = h - u[0].offsetHeight), l.trigger("scroll_element.xdsoft_scroller", [ c ? t / c : 0 ]);
                }, u.on("touchstart.xdsoft_scroller mousedown.xdsoft_scroller", (function(e) {
                    i || l.trigger("resize_scroll.xdsoft_scroller", [ y ]), r = a(e).y, g = parseInt(u.css("marginTop"), 10), 
                    h = d[0].offsetHeight, "mousedown" === e.type || "touchstart" === e.type ? (D.ownerDocument && L(D.ownerDocument.body).addClass("xdsoft_noselect"), 
                    L([ D.ownerDocument.body, D.contentWindow ]).on("touchend mouseup.xdsoft_scroller", (function e() {
                        L([ D.ownerDocument.body, D.contentWindow ]).off("touchend mouseup.xdsoft_scroller", e).off("mousemove.xdsoft_scroller", p).removeClass("xdsoft_noselect");
                    })), L(D.ownerDocument.body).on("mousemove.xdsoft_scroller", p)) : (t = !0, e.stopPropagation(), 
                    e.preventDefault());
                })).on("touchmove", (function(e) {
                    t && (e.preventDefault(), p(e));
                })).on("touchend touchcancel", (function() {
                    t = !1, g = 0;
                })), l.on("scroll_element.xdsoft_scroller", (function(e, t) {
                    i || l.trigger("resize_scroll.xdsoft_scroller", [ t, !0 ]), t = 1 < t ? 1 : t < 0 || isNaN(t) ? 0 : t, 
                    f = parseFloat(Math.abs((o[0].offsetHeight - i) * t).toFixed(4)), u.css("marginTop", c * t), 
                    o.css("marginTop", -f);
                })).on("resize_scroll.xdsoft_scroller", (function(e, t, a) {
                    var n, r;
                    i = l[0].clientHeight, s = o[0].offsetHeight, r = (n = i / s) * d[0].offsetHeight, 
                    1 < n ? u.hide() : (u.show(), u.css("height", parseInt(10 < r ? r : 10, 10)), c = d[0].offsetHeight - u[0].offsetHeight, 
                    !0 !== a && l.trigger("scroll_element.xdsoft_scroller", [ t || f / (s - i) ]));
                })), l.on("mousewheel", (function(e) {
                    var t, a, n = (t = e.originalEvent, a = 0, "detail" in t && (a = t.detail), "wheelDelta" in t && (a = -t.wheelDelta / 120), 
                    "wheelDeltaY" in t && (a = -t.wheelDeltaY / 120), "axis" in t && t.axis === t.HORIZONTAL_AXIS && (a = 0), 
                    a *= 10, "deltaY" in t && (a = -t.deltaY), a && t.deltaMode && (1 === t.deltaMode ? a *= 40 : a *= 800), 
                    a), r = Math.max(0, f - n);
                    return l.trigger("scroll_element.xdsoft_scroller", [ r / (s - i) ]), e.stopPropagation(), 
                    !1;
                })), l.on("touchstart", (function(e) {
                    n = a(e), m = f;
                })), l.on("touchmove", (function(e) {
                    if (n) {
                        e.preventDefault();
                        var t = a(e);
                        l.trigger("scroll_element.xdsoft_scroller", [ (m - (t.y - n.y)) / (s - i) ]);
                    }
                })), l.on("touchend touchcancel", (function() {
                    n = !1, m = 0;
                }))), l.trigger("resize_scroll.xdsoft_scroller", [ y ])) : l.find(".xdsoft_scrollbar").hide();
            }));
        }, L.fn.datetimepicker = function(H, a) {
            var n, r, o = this, p = 17, D = 13, y = 27, v = 37, k = 38, b = 39, x = 40, T = 9, S = 116, M = 65, w = 67, j = 86, J = 90, z = 89, N = !1, I = L.isPlainObject(H) || !H ? L.extend(!0, {}, s, H) : L.extend(!0, {}, s), i = 0;
            return n = function(O) {
                var t, n, a, r, W, h, _ = L('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'), e = L('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'), g = L('<div class="xdsoft_datepicker active"></div>'), F = L('<div class="xdsoft_monthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button><div class="xdsoft_label xdsoft_month"><span></span><i></i></div><div class="xdsoft_label xdsoft_year"><span></span><i></i></div><button type="button" class="xdsoft_next"></button></div>'), C = L('<div class="xdsoft_calendar"></div>'), o = L('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'), u = o.find(".xdsoft_time_box").eq(0), P = L('<div class="xdsoft_time_variant"></div>'), i = L('<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'), Y = L('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'), A = L('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'), s = !1, d = 0;
                I.id && _.attr("id", I.id), I.style && _.attr("style", I.style), I.weeks && _.addClass("xdsoft_showweeks"), 
                I.rtl && _.addClass("xdsoft_rtl"), _.addClass("xdsoft_" + I.theme), _.addClass(I.className), 
                F.find(".xdsoft_month span").after(Y), F.find(".xdsoft_year span").after(A), F.find(".xdsoft_month,.xdsoft_year").on("touchstart mousedown.xdsoft", (function(e) {
                    var t, a, n = L(this).find(".xdsoft_select").eq(0), r = 0, o = 0, i = n.is(":visible");
                    for (F.find(".xdsoft_select").hide(), W.currentTime && (r = W.currentTime[L(this).hasClass("xdsoft_month") ? "getMonth" : "getFullYear"]()), 
                    n[i ? "hide" : "show"](), t = n.find("div.xdsoft_option"), a = 0; a < t.length && t.eq(a).data("value") !== r; a += 1) o += t[0].offsetHeight;
                    return n.xdsoftScroller(I, o / (n.children()[0].offsetHeight - n[0].clientHeight)), 
                    e.stopPropagation(), !1;
                }));
                var l = function(e) {
                    var t = e.originalEvent, a = t.touches ? t.touches[0] : t;
                    this.touchStartPosition = this.touchStartPosition || a;
                    var n = Math.abs(this.touchStartPosition.clientX - a.clientX), r = Math.abs(this.touchStartPosition.clientY - a.clientY);
                    Math.sqrt(n * n + r * r) > I.touchMovedThreshold && (this.touchMoved = !0);
                };
                function f() {
                    var e, t = !1;
                    return I.startDate ? t = W.strToDate(I.startDate) : (t = I.value || (O && O.val && O.val() ? O.val() : "")) ? (t = W.strToDateTime(t), 
                    I.yearOffset && (t = new Date(t.getFullYear() - I.yearOffset, t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()))) : I.defaultDate && (t = W.strToDateTime(I.defaultDate), 
                    I.defaultTime && (e = W.strtotime(I.defaultTime), t.setHours(e.getHours()), t.setMinutes(e.getMinutes()))), 
                    t && W.isValidDate(t) ? _.data("changed", !0) : t = "", t || 0;
                }
                function c(m) {
                    var h = function(e, t) {
                        var a = e.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, "\\$1").replace(/_/g, "{digit+}").replace(/([0-9]{1})/g, "{digit$1}").replace(/\{digit([0-9]{1})\}/g, "[0-$1_]{1}").replace(/\{digit[\+]\}/g, "[0-9_]{1}");
                        return new RegExp(a).test(t);
                    }, g = function(e, t) {
                        if (!(e = "string" == typeof e || e instanceof String ? m.ownerDocument.getElementById(e) : e)) return !1;
                        if (e.createTextRange) {
                            var a = e.createTextRange();
                            return a.collapse(!0), a.moveEnd("character", t), a.moveStart("character", t), a.select(), 
                            !0;
                        }
                        return !!e.setSelectionRange && (e.setSelectionRange(t, t), !0);
                    };
                    m.mask && O.off("keydown.xdsoft"), !0 === m.mask && (E.formatMask ? m.mask = E.formatMask(m.format) : m.mask = m.format.replace(/Y/g, "9999").replace(/F/g, "9999").replace(/m/g, "19").replace(/d/g, "39").replace(/H/g, "29").replace(/i/g, "59").replace(/s/g, "59")), 
                    "string" === L.type(m.mask) && (h(m.mask, O.val()) || (O.val(m.mask.replace(/[0-9]/g, "_")), 
                    g(O[0], 0)), O.on("paste.xdsoft", (function(e) {
                        var t = (e.clipboardData || e.originalEvent.clipboardData || window.clipboardData).getData("text"), a = this.value, n = this.selectionStart;
                        return a = a.substr(0, n) + t + a.substr(n + t.length), n += t.length, h(m.mask, a) ? (this.value = a, 
                        g(this, n)) : "" === L.trim(a) ? this.value = m.mask.replace(/[0-9]/g, "_") : O.trigger("error_input.xdsoft"), 
                        e.preventDefault(), !1;
                    })), O.on("keydown.xdsoft", (function(e) {
                        var t, a = this.value, n = e.which, r = this.selectionStart, o = this.selectionEnd, i = r !== o;
                        if (48 <= n && n <= 57 || 96 <= n && n <= 105 || 8 === n || 46 === n) {
                            for (t = 8 === n || 46 === n ? "_" : String.fromCharCode(96 <= n && n <= 105 ? n - 48 : n), 
                            8 === n && r && !i && (r -= 1); ;) {
                                var s = m.mask.substr(r, 1), d = r < m.mask.length, u = 0 < r;
                                if (!(/[^0-9_]/.test(s) && d && u)) break;
                                r += 8 !== n || i ? 1 : -1;
                            }
                            if (e.metaKey && (i = !(r = 0)), i) {
                                var l = o - r, f = m.mask.replace(/[0-9]/g, "_"), c = f.substr(r, l).substr(1);
                                a = a.substr(0, r) + (t + c) + a.substr(r + l);
                            } else a = a.substr(0, r) + t + a.substr(r + 1);
                            if ("" === L.trim(a)) a = f; else if (r === m.mask.length) return e.preventDefault(), 
                            !1;
                            for (r += 8 === n ? 0 : 1; /[^0-9_]/.test(m.mask.substr(r, 1)) && r < m.mask.length && 0 < r; ) r += 8 === n ? 0 : 1;
                            h(m.mask, a) ? (this.value = a, g(this, r)) : "" === L.trim(a) ? this.value = m.mask.replace(/[0-9]/g, "_") : O.trigger("error_input.xdsoft");
                        } else if (-1 !== [ M, w, j, J, z ].indexOf(n) && N || -1 !== [ y, k, x, v, b, S, p, T, D ].indexOf(n)) return !0;
                        return e.preventDefault(), !1;
                    })));
                }
                F.find(".xdsoft_select").xdsoftScroller(I).on("touchstart mousedown.xdsoft", (function(e) {
                    var t = e.originalEvent;
                    this.touchMoved = !1, this.touchStartPosition = t.touches ? t.touches[0] : t, e.stopPropagation(), 
                    e.preventDefault();
                })).on("touchmove", ".xdsoft_option", l).on("touchend mousedown.xdsoft", ".xdsoft_option", (function() {
                    if (!this.touchMoved) {
                        void 0 !== W.currentTime && null !== W.currentTime || (W.currentTime = W.now());
                        var e = W.currentTime.getFullYear();
                        W && W.currentTime && W.currentTime[L(this).parent().parent().hasClass("xdsoft_monthselect") ? "setMonth" : "setFullYear"](L(this).data("value")), 
                        L(this).parent().parent().hide(), _.trigger("xchange.xdsoft"), I.onChangeMonth && L.isFunction(I.onChangeMonth) && I.onChangeMonth.call(_, W.currentTime, _.data("input")), 
                        e !== W.currentTime.getFullYear() && L.isFunction(I.onChangeYear) && I.onChangeYear.call(_, W.currentTime, _.data("input"));
                    }
                })), _.getValue = function() {
                    return W.getCurrentTime();
                }, _.setOptions = function(e) {
                    var l = {};
                    I = L.extend(!0, {}, I, e), e.allowTimes && L.isArray(e.allowTimes) && e.allowTimes.length && (I.allowTimes = L.extend(!0, [], e.allowTimes)), 
                    e.weekends && L.isArray(e.weekends) && e.weekends.length && (I.weekends = L.extend(!0, [], e.weekends)), 
                    e.allowDates && L.isArray(e.allowDates) && e.allowDates.length && (I.allowDates = L.extend(!0, [], e.allowDates)), 
                    e.allowDateRe && "[object String]" === Object.prototype.toString.call(e.allowDateRe) && (I.allowDateRe = new RegExp(e.allowDateRe)), 
                    e.highlightedDates && L.isArray(e.highlightedDates) && e.highlightedDates.length && (L.each(e.highlightedDates, (function(e, t) {
                        var a, n = L.map(t.split(","), L.trim), r = new m(E.parseDate(n[0], I.formatDate), n[1], n[2]), o = E.formatDate(r.date, I.formatDate);
                        void 0 !== l[o] ? (a = l[o].desc) && a.length && r.desc && r.desc.length && (l[o].desc = a + "\n" + r.desc) : l[o] = r;
                    })), I.highlightedDates = L.extend(!0, [], l)), e.highlightedPeriods && L.isArray(e.highlightedPeriods) && e.highlightedPeriods.length && (l = L.extend(!0, [], I.highlightedDates), 
                    L.each(e.highlightedPeriods, (function(e, t) {
                        var a, n, r, o, i, s, d;
                        if (L.isArray(t)) a = t[0], n = t[1], r = t[2], d = t[3]; else {
                            var u = L.map(t.split(","), L.trim);
                            a = E.parseDate(u[0], I.formatDate), n = E.parseDate(u[1], I.formatDate), r = u[2], 
                            d = u[3];
                        }
                        for (;a <= n; ) o = new m(a, r, d), i = E.formatDate(a, I.formatDate), a.setDate(a.getDate() + 1), 
                        void 0 !== l[i] ? (s = l[i].desc) && s.length && o.desc && o.desc.length && (l[i].desc = s + "\n" + o.desc) : l[i] = o;
                    })), I.highlightedDates = L.extend(!0, [], l)), e.disabledDates && L.isArray(e.disabledDates) && e.disabledDates.length && (I.disabledDates = L.extend(!0, [], e.disabledDates)), 
                    e.disabledWeekDays && L.isArray(e.disabledWeekDays) && e.disabledWeekDays.length && (I.disabledWeekDays = L.extend(!0, [], e.disabledWeekDays)), 
                    !I.open && !I.opened || I.inline || O.trigger("open.xdsoft"), I.inline && (s = !0, 
                    _.addClass("xdsoft_inline"), O.after(_).hide()), I.inverseButton && (I.next = "xdsoft_prev", 
                    I.prev = "xdsoft_next"), I.datepicker ? g.addClass("active") : g.removeClass("active"), 
                    I.timepicker ? o.addClass("active") : o.removeClass("active"), I.value && (W.setCurrentTime(I.value), 
                    O && O.val && O.val(W.str)), isNaN(I.dayOfWeekStart) ? I.dayOfWeekStart = 0 : I.dayOfWeekStart = parseInt(I.dayOfWeekStart, 10) % 7, 
                    I.timepickerScrollbar || u.xdsoftScroller(I, "hide"), I.minDate && /^[\+\-](.*)$/.test(I.minDate) && (I.minDate = E.formatDate(W.strToDateTime(I.minDate), I.formatDate)), 
                    I.maxDate && /^[\+\-](.*)$/.test(I.maxDate) && (I.maxDate = E.formatDate(W.strToDateTime(I.maxDate), I.formatDate)), 
                    I.minDateTime && /^\+(.*)$/.test(I.minDateTime) && (I.minDateTime = W.strToDateTime(I.minDateTime).dateFormat(I.formatDate)), 
                    I.maxDateTime && /^\+(.*)$/.test(I.maxDateTime) && (I.maxDateTime = W.strToDateTime(I.maxDateTime).dateFormat(I.formatDate)), 
                    i.toggle(I.showApplyButton), F.find(".xdsoft_today_button").css("visibility", I.todayButton ? "visible" : "hidden"), 
                    F.find("." + I.prev).css("visibility", I.prevButton ? "visible" : "hidden"), F.find("." + I.next).css("visibility", I.nextButton ? "visible" : "hidden"), 
                    c(I), I.validateOnBlur && O.off("blur.xdsoft").on("blur.xdsoft", (function() {
                        if (I.allowBlank && (!L.trim(L(this).val()).length || "string" == typeof I.mask && L.trim(L(this).val()) === I.mask.replace(/[0-9]/g, "_"))) L(this).val(null), 
                        _.data("xdsoft_datetime").empty(); else {
                            var e = E.parseDate(L(this).val(), I.format);
                            if (e) L(this).val(E.formatDate(e, I.format)); else {
                                var t = +[ L(this).val()[0], L(this).val()[1] ].join(""), a = +[ L(this).val()[2], L(this).val()[3] ].join("");
                                !I.datepicker && I.timepicker && 0 <= t && t < 24 && 0 <= a && a < 60 ? L(this).val([ t, a ].map((function(e) {
                                    return 9 < e ? e : "0" + e;
                                })).join(":")) : L(this).val(E.formatDate(W.now(), I.format));
                            }
                            _.data("xdsoft_datetime").setCurrentTime(L(this).val());
                        }
                        _.trigger("changedatetime.xdsoft"), _.trigger("close.xdsoft");
                    })), I.dayOfWeekStartPrev = 0 === I.dayOfWeekStart ? 6 : I.dayOfWeekStart - 1, _.trigger("xchange.xdsoft").trigger("afterOpen.xdsoft");
                }, _.data("options", I).on("touchstart mousedown.xdsoft", (function(e) {
                    return e.stopPropagation(), e.preventDefault(), A.hide(), Y.hide(), !1;
                })), u.append(P), u.xdsoftScroller(I), _.on("afterOpen.xdsoft", (function() {
                    u.xdsoftScroller(I);
                })), _.append(g).append(o), !0 !== I.withoutCopyright && _.append(e), g.append(F).append(C).append(i), 
                I.insideParent ? L(O).parent().append(_) : L(I.parentID).append(_), W = new function() {
                    var r = this;
                    r.now = function(e) {
                        var t, a, n = new Date;
                        return !e && I.defaultDate && (t = r.strToDateTime(I.defaultDate), n.setFullYear(t.getFullYear()), 
                        n.setMonth(t.getMonth()), n.setDate(t.getDate())), n.setFullYear(n.getFullYear()), 
                        !e && I.defaultTime && (a = r.strtotime(I.defaultTime), n.setHours(a.getHours()), 
                        n.setMinutes(a.getMinutes()), n.setSeconds(a.getSeconds()), n.setMilliseconds(a.getMilliseconds())), 
                        n;
                    }, r.isValidDate = function(e) {
                        return "[object Date]" === Object.prototype.toString.call(e) && !isNaN(e.getTime());
                    }, r.setCurrentTime = function(e, t) {
                        "string" == typeof e ? r.currentTime = r.strToDateTime(e) : r.isValidDate(e) ? r.currentTime = e : e || t || !I.allowBlank || I.inline ? r.currentTime = r.now() : r.currentTime = null, 
                        _.trigger("xchange.xdsoft");
                    }, r.empty = function() {
                        r.currentTime = null;
                    }, r.getCurrentTime = function() {
                        return r.currentTime;
                    }, r.nextMonth = function() {
                        void 0 !== r.currentTime && null !== r.currentTime || (r.currentTime = r.now());
                        var e, t = r.currentTime.getMonth() + 1;
                        return 12 === t && (r.currentTime.setFullYear(r.currentTime.getFullYear() + 1), 
                        t = 0), e = r.currentTime.getFullYear(), r.currentTime.setDate(Math.min(new Date(r.currentTime.getFullYear(), t + 1, 0).getDate(), r.currentTime.getDate())), 
                        r.currentTime.setMonth(t), I.onChangeMonth && L.isFunction(I.onChangeMonth) && I.onChangeMonth.call(_, W.currentTime, _.data("input")), 
                        e !== r.currentTime.getFullYear() && L.isFunction(I.onChangeYear) && I.onChangeYear.call(_, W.currentTime, _.data("input")), 
                        _.trigger("xchange.xdsoft"), t;
                    }, r.prevMonth = function() {
                        void 0 !== r.currentTime && null !== r.currentTime || (r.currentTime = r.now());
                        var e = r.currentTime.getMonth() - 1;
                        return -1 === e && (r.currentTime.setFullYear(r.currentTime.getFullYear() - 1), 
                        e = 11), r.currentTime.setDate(Math.min(new Date(r.currentTime.getFullYear(), e + 1, 0).getDate(), r.currentTime.getDate())), 
                        r.currentTime.setMonth(e), I.onChangeMonth && L.isFunction(I.onChangeMonth) && I.onChangeMonth.call(_, W.currentTime, _.data("input")), 
                        _.trigger("xchange.xdsoft"), e;
                    }, r.getWeekOfYear = function(e) {
                        if (I.onGetWeekOfYear && L.isFunction(I.onGetWeekOfYear)) {
                            var t = I.onGetWeekOfYear.call(_, e);
                            if (void 0 !== t) return t;
                        }
                        var a = new Date(e.getFullYear(), 0, 1);
                        return 4 !== a.getDay() && a.setMonth(0, 1 + (4 - a.getDay() + 7) % 7), Math.ceil(((e - a) / 864e5 + a.getDay() + 1) / 7);
                    }, r.strToDateTime = function(e) {
                        var t, a, n = [];
                        return e && e instanceof Date && r.isValidDate(e) ? e : ((n = /^([+-]{1})(.*)$/.exec(e)) && (n[2] = E.parseDate(n[2], I.formatDate)), 
                        a = n && n[2] ? (t = n[2].getTime() - 6e4 * n[2].getTimezoneOffset(), new Date(r.now(!0).getTime() + parseInt(n[1] + "1", 10) * t)) : e ? E.parseDate(e, I.format) : r.now(), 
                        r.isValidDate(a) || (a = r.now()), a);
                    }, r.strToDate = function(e) {
                        if (e && e instanceof Date && r.isValidDate(e)) return e;
                        var t = e ? E.parseDate(e, I.formatDate) : r.now(!0);
                        return r.isValidDate(t) || (t = r.now(!0)), t;
                    }, r.strtotime = function(e) {
                        if (e && e instanceof Date && r.isValidDate(e)) return e;
                        var t = e ? E.parseDate(e, I.formatTime) : r.now(!0);
                        return r.isValidDate(t) || (t = r.now(!0)), t;
                    }, r.str = function() {
                        var e = I.format;
                        return I.yearOffset && (e = (e = e.replace("Y", r.currentTime.getFullYear() + I.yearOffset)).replace("y", String(r.currentTime.getFullYear() + I.yearOffset).substring(2, 4))), 
                        E.formatDate(r.currentTime, e);
                    }, r.currentTime = this.now();
                }, i.on("touchend click", (function(e) {
                    e.preventDefault(), _.data("changed", !0), W.setCurrentTime(f()), O.val(W.str()), 
                    _.trigger("close.xdsoft");
                })), F.find(".xdsoft_today_button").on("touchend mousedown.xdsoft", (function() {
                    _.data("changed", !0), W.setCurrentTime(0, !0), _.trigger("afterOpen.xdsoft");
                })).on("dblclick.xdsoft", (function() {
                    var e, t, a = W.getCurrentTime();
                    a = new Date(a.getFullYear(), a.getMonth(), a.getDate()), e = W.strToDate(I.minDate), 
                    a < (e = new Date(e.getFullYear(), e.getMonth(), e.getDate())) || (t = W.strToDate(I.maxDate), 
                    (t = new Date(t.getFullYear(), t.getMonth(), t.getDate())) < a || (O.val(W.str()), 
                    O.trigger("change"), _.trigger("close.xdsoft")));
                })), F.find(".xdsoft_prev,.xdsoft_next").on("touchend mousedown.xdsoft", (function() {
                    var a = L(this), n = 0, r = !1;
                    !function e(t) {
                        a.hasClass(I.next) ? W.nextMonth() : a.hasClass(I.prev) && W.prevMonth(), I.monthChangeSpinner && (r || (n = setTimeout(e, t || 100)));
                    }(500), L([ I.ownerDocument.body, I.contentWindow ]).on("touchend mouseup.xdsoft", (function e() {
                        clearTimeout(n), r = !0, L([ I.ownerDocument.body, I.contentWindow ]).off("touchend mouseup.xdsoft", e);
                    }));
                })), o.find(".xdsoft_prev,.xdsoft_next").on("touchend mousedown.xdsoft", (function() {
                    var o = L(this), i = 0, s = !1, d = 110;
                    !function e(t) {
                        var a = u[0].clientHeight, n = P[0].offsetHeight, r = Math.abs(parseInt(P.css("marginTop"), 10));
                        r < I.timeHeightInTimePicker ? r = I.timeHeightInTimePicker : o.hasClass(I.next) && n - a < r && P.css("marginTop", "-" + n + "px"), 
                        o.hasClass(I.next) && r < n - a ? P.css("marginTop", "-" + (r + I.timeHeightInTimePicker) + "px") : o.hasClass(I.prev) && 0 <= r - I.timeHeightInTimePicker && P.css("marginTop", "-" + (r - I.timeHeightInTimePicker) + "px"), 
                        u.trigger("scroll_element.xdsoft_scroller", [ Math.abs(parseInt(P[0].style.marginTop, 10) / (n - a)) ]), 
                        d = 10 < d ? 10 : d - 10, s || (i = setTimeout(e, t || d));
                    }(500), L([ I.ownerDocument.body, I.contentWindow ]).on("touchend mouseup.xdsoft", (function e() {
                        clearTimeout(i), s = !0, L([ I.ownerDocument.body, I.contentWindow ]).off("touchend mouseup.xdsoft", e);
                    }));
                })), t = 0, _.on("xchange.xdsoft", (function(e) {
                    clearTimeout(t), t = setTimeout((function() {
                        (void 0 === W.currentTime || null === W.currentTime || isNaN(W.currentTime.getTime())) && (W.currentTime = W.now());
                        for (var e, t, a, n, r, o, i, s, d, u, l = "", f = new Date(W.currentTime.getFullYear(), W.currentTime.getMonth(), 1, 12, 0, 0), c = 0, m = W.now(), h = !1, g = !1, p = !1, D = !1, y = [], v = !0, k = ""; f.getDay() !== I.dayOfWeekStart; ) f.setDate(f.getDate() - 1);
                        for (l += "<table><thead><tr>", I.weeks && (l += "<th></th>"), e = 0; e < 7; e += 1) l += "<th>" + I.i18n[R].dayOfWeekShort[(e + I.dayOfWeekStart) % 7] + "</th>";
                        for (l += "</tr></thead>", l += "<tbody>", !1 !== I.maxDate && (h = W.strToDate(I.maxDate), 
                        h = new Date(h.getFullYear(), h.getMonth(), h.getDate(), 23, 59, 59, 999)), !1 !== I.minDate && (g = W.strToDate(I.minDate), 
                        g = new Date(g.getFullYear(), g.getMonth(), g.getDate())), !1 !== I.minDateTime && (p = W.strToDate(I.minDateTime), 
                        p = new Date(p.getFullYear(), p.getMonth(), p.getDate(), p.getHours(), p.getMinutes(), p.getSeconds())), 
                        !1 !== I.maxDateTime && (D = W.strToDate(I.maxDateTime), D = new Date(D.getFullYear(), D.getMonth(), D.getDate(), D.getHours(), D.getMinutes(), D.getSeconds())), 
                        !1 !== D && (u = 31 * (12 * D.getFullYear() + D.getMonth()) + D.getDate()); c < W.currentTime.countDaysInMonth() || f.getDay() !== I.dayOfWeekStart || W.currentTime.getMonth() === f.getMonth(); ) {
                            y = [], c += 1, a = f.getDay(), n = f.getDate(), r = f.getFullYear(), M = f.getMonth(), 
                            o = W.getWeekOfYear(f), d = "", y.push("xdsoft_date"), i = I.beforeShowDay && L.isFunction(I.beforeShowDay.call) ? I.beforeShowDay.call(_, f) : null, 
                            I.allowDateRe && "[object RegExp]" === Object.prototype.toString.call(I.allowDateRe) && (I.allowDateRe.test(E.formatDate(f, I.formatDate)) || y.push("xdsoft_disabled")), 
                            I.allowDates && 0 < I.allowDates.length && -1 === I.allowDates.indexOf(E.formatDate(f, I.formatDate)) && y.push("xdsoft_disabled");
                            var b = 31 * (12 * f.getFullYear() + f.getMonth()) + f.getDate();
                            (!1 !== h && h < f || !1 !== p && f < p || !1 !== g && f < g || !1 !== D && u < b || i && !1 === i[0]) && y.push("xdsoft_disabled"), 
                            -1 !== I.disabledDates.indexOf(E.formatDate(f, I.formatDate)) && y.push("xdsoft_disabled"), 
                            -1 !== I.disabledWeekDays.indexOf(a) && y.push("xdsoft_disabled"), O.is("[disabled]") && y.push("xdsoft_disabled"), 
                            i && "" !== i[1] && y.push(i[1]), W.currentTime.getMonth() !== M && y.push("xdsoft_other_month"), 
                            (I.defaultSelect || _.data("changed")) && E.formatDate(W.currentTime, I.formatDate) === E.formatDate(f, I.formatDate) && y.push("xdsoft_current"), 
                            E.formatDate(m, I.formatDate) === E.formatDate(f, I.formatDate) && y.push("xdsoft_today"), 
                            0 !== f.getDay() && 6 !== f.getDay() && -1 === I.weekends.indexOf(E.formatDate(f, I.formatDate)) || y.push("xdsoft_weekend"), 
                            void 0 !== I.highlightedDates[E.formatDate(f, I.formatDate)] && (t = I.highlightedDates[E.formatDate(f, I.formatDate)], 
                            y.push(void 0 === t.style ? "xdsoft_highlighted_default" : t.style), d = void 0 === t.desc ? "" : t.desc), 
                            I.beforeShowDay && L.isFunction(I.beforeShowDay) && y.push(I.beforeShowDay(f)), 
                            v && (l += "<tr>", v = !1, I.weeks && (l += "<th>" + o + "</th>")), l += '<td data-date="' + n + '" data-month="' + M + '" data-year="' + r + '" class="xdsoft_date xdsoft_day_of_week' + f.getDay() + " " + y.join(" ") + '" title="' + d + '"><div>' + n + "</div></td>", 
                            f.getDay() === I.dayOfWeekStartPrev && (l += "</tr>", v = !0), f.setDate(n + 1);
                        }
                        l += "</tbody></table>", C.html(l), F.find(".xdsoft_label span").eq(0).text(I.i18n[R].months[W.currentTime.getMonth()]), 
                        F.find(".xdsoft_label span").eq(1).text(W.currentTime.getFullYear() + I.yearOffset), 
                        M = k = "";
                        var x = 0;
                        if (!1 !== I.minTime) {
                            var T = W.strtotime(I.minTime);
                            x = 60 * T.getHours() + T.getMinutes();
                        }
                        var S = 1440;
                        if (!1 !== I.maxTime) {
                            T = W.strtotime(I.maxTime);
                            S = 60 * T.getHours() + T.getMinutes();
                        }
                        if (!1 !== I.minDateTime) {
                            T = W.strToDateTime(I.minDateTime);
                            if (E.formatDate(W.currentTime, I.formatDate) === E.formatDate(T, I.formatDate)) {
                                var M = 60 * T.getHours() + T.getMinutes();
                                x < M && (x = M);
                            }
                        }
                        if (!1 !== I.maxDateTime) {
                            T = W.strToDateTime(I.maxDateTime);
                            if (E.formatDate(W.currentTime, I.formatDate) === E.formatDate(T, I.formatDate)) (M = 60 * T.getHours() + T.getMinutes()) < S && (S = M);
                        }
                        if (s = function(e, t) {
                            var a, n = W.now(), r = I.allowTimes && L.isArray(I.allowTimes) && I.allowTimes.length;
                            n.setHours(e), e = parseInt(n.getHours(), 10), n.setMinutes(t), t = parseInt(n.getMinutes(), 10), 
                            y = [];
                            var o = 60 * e + t;
                            (O.is("[disabled]") || S <= o || o < x) && y.push("xdsoft_disabled"), (a = new Date(W.currentTime)).setHours(parseInt(W.currentTime.getHours(), 10)), 
                            r || a.setMinutes(Math[I.roundTime](W.currentTime.getMinutes() / I.step) * I.step), 
                            (I.initTime || I.defaultSelect || _.data("changed")) && a.getHours() === parseInt(e, 10) && (!r && 59 < I.step || a.getMinutes() === parseInt(t, 10)) && (I.defaultSelect || _.data("changed") ? y.push("xdsoft_current") : I.initTime && y.push("xdsoft_init_time")), 
                            parseInt(m.getHours(), 10) === parseInt(e, 10) && parseInt(m.getMinutes(), 10) === parseInt(t, 10) && y.push("xdsoft_today"), 
                            k += '<div class="xdsoft_time ' + y.join(" ") + '" data-hour="' + e + '" data-minute="' + t + '">' + E.formatDate(n, I.formatTime) + "</div>";
                        }, I.allowTimes && L.isArray(I.allowTimes) && I.allowTimes.length) for (c = 0; c < I.allowTimes.length; c += 1) s(W.strtotime(I.allowTimes[c]).getHours(), M = W.strtotime(I.allowTimes[c]).getMinutes()); else for (e = c = 0; c < (I.hours12 ? 12 : 24); c += 1) for (e = 0; e < 60; e += I.step) {
                            var w = 60 * c + e;
                            w < x || S <= w || s((c < 10 ? "0" : "") + c, M = (e < 10 ? "0" : "") + e);
                        }
                        for (P.html(k), H = "", c = parseInt(I.yearStart, 10); c <= parseInt(I.yearEnd, 10); c += 1) H += '<div class="xdsoft_option ' + (W.currentTime.getFullYear() === c ? "xdsoft_current" : "") + '" data-value="' + c + '">' + (c + I.yearOffset) + "</div>";
                        for (A.children().eq(0).html(H), c = parseInt(I.monthStart, 10), H = ""; c <= parseInt(I.monthEnd, 10); c += 1) H += '<div class="xdsoft_option ' + (W.currentTime.getMonth() === c ? "xdsoft_current" : "") + '" data-value="' + c + '">' + I.i18n[R].months[c] + "</div>";
                        Y.children().eq(0).html(H), L(_).trigger("generate.xdsoft");
                    }), 10), e.stopPropagation();
                })).on("afterOpen.xdsoft", (function() {
                    var e, t, a, n;
                    I.timepicker && (P.find(".xdsoft_current").length ? e = ".xdsoft_current" : P.find(".xdsoft_init_time").length && (e = ".xdsoft_init_time"), 
                    e ? (t = u[0].clientHeight, (a = P[0].offsetHeight) - t < (n = P.find(e).index() * I.timeHeightInTimePicker + 1) && (n = a - t), 
                    u.trigger("scroll_element.xdsoft_scroller", [ parseInt(n, 10) / (a - t) ])) : u.trigger("scroll_element.xdsoft_scroller", [ 0 ]));
                })), n = 0, C.on("touchend click.xdsoft", "td", (function(e) {
                    e.stopPropagation(), n += 1;
                    var t = L(this), a = W.currentTime;
                    if (null == a && (W.currentTime = W.now(), a = W.currentTime), t.hasClass("xdsoft_disabled")) return !1;
                    a.setDate(1), a.setFullYear(t.data("year")), a.setMonth(t.data("month")), a.setDate(t.data("date")), 
                    _.trigger("select.xdsoft", [ a ]), O.val(W.str()), I.onSelectDate && L.isFunction(I.onSelectDate) && I.onSelectDate.call(_, W.currentTime, _.data("input"), e), 
                    _.data("changed", !0), _.trigger("xchange.xdsoft"), _.trigger("changedatetime.xdsoft"), 
                    (1 < n || !0 === I.closeOnDateSelect || !1 === I.closeOnDateSelect && !I.timepicker) && !I.inline && _.trigger("close.xdsoft"), 
                    setTimeout((function() {
                        n = 0;
                    }), 200);
                })), P.on("touchstart", "div", (function(e) {
                    this.touchMoved = !1;
                })).on("touchmove", "div", l).on("touchend click.xdsoft", "div", (function(e) {
                    if (!this.touchMoved) {
                        e.stopPropagation();
                        var t = L(this), a = W.currentTime;
                        if (null == a && (W.currentTime = W.now(), a = W.currentTime), t.hasClass("xdsoft_disabled")) return !1;
                        a.setHours(t.data("hour")), a.setMinutes(t.data("minute")), _.trigger("select.xdsoft", [ a ]), 
                        _.data("input").val(W.str()), I.onSelectTime && L.isFunction(I.onSelectTime) && I.onSelectTime.call(_, W.currentTime, _.data("input"), e), 
                        _.data("changed", !0), _.trigger("xchange.xdsoft"), _.trigger("changedatetime.xdsoft"), 
                        !0 !== I.inline && !0 === I.closeOnTimeSelect && _.trigger("close.xdsoft");
                    }
                })), g.on("mousewheel.xdsoft", (function(e) {
                    return !I.scrollMonth || (e.deltaY < 0 ? W.nextMonth() : W.prevMonth(), !1);
                })), O.on("mousewheel.xdsoft", (function(e) {
                    return !I.scrollInput || (!I.datepicker && I.timepicker ? (0 <= (a = P.find(".xdsoft_current").length ? P.find(".xdsoft_current").eq(0).index() : 0) + e.deltaY && a + e.deltaY < P.children().length && (a += e.deltaY), 
                    P.children().eq(a).length && P.children().eq(a).trigger("mousedown"), !1) : I.datepicker && !I.timepicker ? (g.trigger(e, [ e.deltaY, e.deltaX, e.deltaY ]), 
                    O.val && O.val(W.str()), _.trigger("changedatetime.xdsoft"), !1) : void 0);
                })), _.on("changedatetime.xdsoft", (function(e) {
                    if (I.onChangeDateTime && L.isFunction(I.onChangeDateTime)) {
                        var t = _.data("input");
                        I.onChangeDateTime.call(_, W.currentTime, t, e), delete I.value, t.trigger("change");
                    }
                })).on("generate.xdsoft", (function() {
                    I.onGenerate && L.isFunction(I.onGenerate) && I.onGenerate.call(_, W.currentTime, _.data("input")), 
                    s && (_.trigger("afterOpen.xdsoft"), s = !1);
                })).on("click.xdsoft", (function(e) {
                    e.stopPropagation();
                })), a = 0, h = function(e, t) {
                    do {
                        if (!(e = e.parentNode) || !1 === t(e)) break;
                    } while ("HTML" !== e.nodeName);
                }, r = function() {
                    var e, t, a, n, r, o, i, s, d, u, l, f, c;
                    if (e = (s = _.data("input")).offset(), t = s[0], u = "top", a = e.top + t.offsetHeight - 1, 
                    n = e.left, r = "absolute", d = L(I.contentWindow).width(), f = L(I.contentWindow).height(), 
                    c = L(I.contentWindow).scrollTop(), I.ownerDocument.documentElement.clientWidth - e.left < g.parent().outerWidth(!0)) {
                        var m = g.parent().outerWidth(!0) - t.offsetWidth;
                        n -= m;
                    }
                    "rtl" === s.parent().css("direction") && (n -= _.outerWidth() - s.outerWidth()), 
                    I.fixed ? (a -= c, n -= L(I.contentWindow).scrollLeft(), r = "fixed") : (i = !1, 
                    h(t, (function(e) {
                        return null !== e && ("fixed" === I.contentWindow.getComputedStyle(e).getPropertyValue("position") ? !(i = !0) : void 0);
                    })), i && !I.insideParent ? (r = "fixed", a + _.outerHeight() > f + c ? (u = "bottom", 
                    a = f + c - e.top) : a -= c) : a + _[0].offsetHeight > f + c && (a = e.top - _[0].offsetHeight + 1), 
                    a < 0 && (a = 0), n + t.offsetWidth > d && (n = d - t.offsetWidth)), o = _[0], h(o, (function(e) {
                        if ("relative" === I.contentWindow.getComputedStyle(e).getPropertyValue("position") && d >= e.offsetWidth) return n -= (d - e.offsetWidth) / 2, 
                        !1;
                    })), l = {
                        position: r,
                        left: I.insideParent ? t.offsetLeft : n,
                        top: "",
                        bottom: ""
                    }, I.insideParent ? l[u] = t.offsetTop + t.offsetHeight : l[u] = a, _.css(l);
                }, _.on("open.xdsoft", (function(e) {
                    var t = !0;
                    I.onShow && L.isFunction(I.onShow) && (t = I.onShow.call(_, W.currentTime, _.data("input"), e)), 
                    !1 !== t && (_.show(), r(), L(I.contentWindow).off("resize.xdsoft", r).on("resize.xdsoft", r), 
                    I.closeOnWithoutClick && L([ I.ownerDocument.body, I.contentWindow ]).on("touchstart mousedown.xdsoft", (function e() {
                        _.trigger("close.xdsoft"), L([ I.ownerDocument.body, I.contentWindow ]).off("touchstart mousedown.xdsoft", e);
                    })));
                })).on("close.xdsoft", (function(e) {
                    var t = !0;
                    F.find(".xdsoft_month,.xdsoft_year").find(".xdsoft_select").hide(), I.onClose && L.isFunction(I.onClose) && (t = I.onClose.call(_, W.currentTime, _.data("input"), e)), 
                    !1 === t || I.opened || I.inline || _.hide(), e.stopPropagation();
                })).on("toggle.xdsoft", (function() {
                    _.is(":visible") ? _.trigger("close.xdsoft") : _.trigger("open.xdsoft");
                })).data("input", O), d = 0, _.data("xdsoft_datetime", W), _.setOptions(I), W.setCurrentTime(f()), 
                O.data("xdsoft_datetimepicker", _).on("open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart", (function() {
                    O.is(":disabled") || O.data("xdsoft_datetimepicker").is(":visible") && I.closeOnInputClick || I.openOnFocus && (clearTimeout(d), 
                    d = setTimeout((function() {
                        O.is(":disabled") || (s = !0, W.setCurrentTime(f(), !0), I.mask && c(I), _.trigger("open.xdsoft"));
                    }), 100));
                })).on("keydown.xdsoft", (function(e) {
                    var t, a = e.which;
                    return -1 !== [ D ].indexOf(a) && I.enterLikeTab ? (t = L("input:visible,textarea:visible,button:visible,a:visible"), 
                    _.trigger("close.xdsoft"), t.eq(t.index(this) + 1).focus(), !1) : -1 !== [ T ].indexOf(a) ? (_.trigger("close.xdsoft"), 
                    !0) : void 0;
                })).on("blur.xdsoft", (function() {
                    _.trigger("close.xdsoft");
                }));
            }, r = function(e) {
                var t = e.data("xdsoft_datetimepicker");
                t && (t.data("xdsoft_datetime", null), t.remove(), e.data("xdsoft_datetimepicker", null).off(".xdsoft"), 
                L(I.contentWindow).off("resize.xdsoft"), L([ I.contentWindow, I.ownerDocument.body ]).off("mousedown.xdsoft touchstart"), 
                e.unmousewheel && e.unmousewheel());
            }, L(I.ownerDocument).off("keydown.xdsoftctrl keyup.xdsoftctrl").off("keydown.xdsoftcmd keyup.xdsoftcmd").on("keydown.xdsoftctrl", (function(e) {
                e.keyCode === p && (N = !0);
            })).on("keyup.xdsoftctrl", (function(e) {
                e.keyCode === p && (N = !1);
            })).on("keydown.xdsoftcmd", (function(e) {
                91 === e.keyCode && !0;
            })).on("keyup.xdsoftcmd", (function(e) {
                91 === e.keyCode && !1;
            })), this.each((function() {
                var t, e = L(this).data("xdsoft_datetimepicker");
                if (e) {
                    if ("string" === L.type(H)) switch (H) {
                      case "show":
                        L(this).select().focus(), e.trigger("open.xdsoft");
                        break;

                      case "hide":
                        e.trigger("close.xdsoft");
                        break;

                      case "toggle":
                        e.trigger("toggle.xdsoft");
                        break;

                      case "destroy":
                        r(L(this));
                        break;

                      case "reset":
                        this.value = this.defaultValue, this.value && e.data("xdsoft_datetime").isValidDate(E.parseDate(this.value, I.format)) || e.data("changed", !1), 
                        e.data("xdsoft_datetime").setCurrentTime(this.value);
                        break;

                      case "validate":
                        e.data("input").trigger("blur.xdsoft");
                        break;

                      default:
                        e[H] && L.isFunction(e[H]) && (o = e[H](a));
                    } else e.setOptions(H);
                    return 0;
                }
                "string" !== L.type(H) && (!I.lazyInit || I.open || I.inline ? n(L(this)) : (t = L(this)).on("open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart", (function e() {
                    t.is(":disabled") || t.data("xdsoft_datetimepicker") || (clearTimeout(i), i = setTimeout((function() {
                        t.data("xdsoft_datetimepicker") || n(t), t.off("open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart", e).trigger("open.xdsoft");
                    }), 100));
                })));
            })), o;
        }, L.fn.datetimepicker.defaults = s;
    };
    !function(e) {
        "function" == typeof define && define.amd ? define([ "jquery", "jquery-mousewheel" ], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery);
    }(datetimepickerFactory), function(e) {
        "function" == typeof define && define.amd ? define([ "jquery" ], e) : "object" == typeof exports ? module.exports = e : e(jQuery);
    }((function(c) {
        var m, h, e = [ "wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll" ], t = "onwheel" in document || 9 <= document.documentMode ? [ "wheel" ] : [ "mousewheel", "DomMouseScroll", "MozMousePixelScroll" ], g = Array.prototype.slice;
        if (c.event.fixHooks) for (var a = e.length; a; ) c.event.fixHooks[e[--a]] = c.event.mouseHooks;
        var p = c.event.special.mousewheel = {
            version: "3.1.12",
            setup: function() {
                if (this.addEventListener) for (var e = t.length; e; ) this.addEventListener(t[--e], n, !1); else this.onmousewheel = n;
                c.data(this, "mousewheel-line-height", p.getLineHeight(this)), c.data(this, "mousewheel-page-height", p.getPageHeight(this));
            },
            teardown: function() {
                if (this.removeEventListener) for (var e = t.length; e; ) this.removeEventListener(t[--e], n, !1); else this.onmousewheel = null;
                c.removeData(this, "mousewheel-line-height"), c.removeData(this, "mousewheel-page-height");
            },
            getLineHeight: function(e) {
                var t = c(e), a = t["offsetParent" in c.fn ? "offsetParent" : "parent"]();
                return a.length || (a = c("body")), parseInt(a.css("fontSize"), 10) || parseInt(t.css("fontSize"), 10) || 16;
            },
            getPageHeight: function(e) {
                return c(e).height();
            },
            settings: {
                adjustOldDeltas: !0,
                normalizeOffset: !0
            }
        };
        function n(e) {
            var t, a = e || window.event, n = g.call(arguments, 1), r = 0, o = 0, i = 0, s = 0, d = 0;
            if ((e = c.event.fix(a)).type = "mousewheel", "detail" in a && (i = -1 * a.detail), 
            "wheelDelta" in a && (i = a.wheelDelta), "wheelDeltaY" in a && (i = a.wheelDeltaY), 
            "wheelDeltaX" in a && (o = -1 * a.wheelDeltaX), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (o = -1 * i, 
            i = 0), r = 0 === i ? o : i, "deltaY" in a && (r = i = -1 * a.deltaY), "deltaX" in a && (o = a.deltaX, 
            0 === i && (r = -1 * o)), 0 !== i || 0 !== o) {
                if (1 === a.deltaMode) {
                    var u = c.data(this, "mousewheel-line-height");
                    r *= u, i *= u, o *= u;
                } else if (2 === a.deltaMode) {
                    var l = c.data(this, "mousewheel-page-height");
                    r *= l, i *= l, o *= l;
                }
                if (t = Math.max(Math.abs(i), Math.abs(o)), (!h || t < h) && y(a, h = t) && (h /= 40), 
                y(a, t) && (r /= 40, o /= 40, i /= 40), r = Math[1 <= r ? "floor" : "ceil"](r / h), 
                o = Math[1 <= o ? "floor" : "ceil"](o / h), i = Math[1 <= i ? "floor" : "ceil"](i / h), 
                p.settings.normalizeOffset && this.getBoundingClientRect) {
                    var f = this.getBoundingClientRect();
                    s = e.clientX - f.left, d = e.clientY - f.top;
                }
                return e.deltaX = o, e.deltaY = i, e.deltaFactor = h, e.offsetX = s, e.offsetY = d, 
                e.deltaMode = 0, n.unshift(e, r, o, i), m && clearTimeout(m), m = setTimeout(D, 200), 
                (c.event.dispatch || c.event.handle).apply(this, n);
            }
        }
        function D() {
            h = null;
        }
        function y(e, t) {
            return p.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0;
        }
        c.fn.extend({
            mousewheel: function(e) {
                return e ? this.bind("mousewheel", e) : this.trigger("mousewheel");
            },
            unmousewheel: function(e) {
                return this.unbind("mousewheel", e);
            }
        });
    }));
    function isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (void 0 === delay) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (void 0 === axis) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = void 0 === _temp ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (void 0 === overrides) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (void 0 === options) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (void 0 === translate) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (void 0 === axis) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (void 0 === translate) translate = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === translateBounds) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        const translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === threshold) threshold = .5;
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            if (index < swiper.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (void 0 === base) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (void 0 === base) base = "window";
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (void 0 === obj) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (void 0 === view) view = "current";
            if (void 0 === exact) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (void 0 === needUpdate) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (void 0 === deleteInstance) deleteInstance = true;
            if (void 0 === cleanStyles) cleanStyles = true;
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function classes_to_selector_classesToSelector(classes) {
        if (void 0 === classes) classes = "";
        return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || 0 === swiper.pagination.$el.length;
        }
        function setSideBullets($bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let current;
            const total = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - 2 * swiper.loopedSlides) current -= slidesLength - 2 * swiper.loopedSlides;
                if (current > total - 1) current -= total;
                if (current < 0 && "bullets" !== swiper.params.paginationType) current = total + current;
            } else if ("undefined" !== typeof swiper.snapIndex) current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if ("bullets" === params.type && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
                    if (params.dynamicMainBullets > 1 && void 0 !== swiper.previousIndex) {
                        dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)).join(" "));
                if ($el.length > 1) bullets.each((bullet => {
                    const $bullet = dom(bullet);
                    const bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(`${params.bulletActiveClass}-main`);
                        if (bulletIndex === firstIndex) setSideBullets($bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets($bullet, "next");
                    }
                })); else {
                    const $bullet = bullets.eq(current);
                    const bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        const $firstDisplayedBullet = bullets.eq(firstIndex);
                        const $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                        if (swiper.params.loop) if (bulletIndex >= bullets.length) {
                            for (let i = params.dynamicMainBullets; i >= 0; i -= 1) bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
                }
            }
            if ("fraction" === params.type) {
                $el.find(classes_to_selector_classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classes_to_selector_classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if ("progressbar" === params.type) {
                let progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                const scale = (current + 1) / total;
                let scaleX = 1;
                let scaleY = 1;
                if ("horizontal" === progressbarDirection) scaleX = scale; else scaleY = scale;
                $el.find(classes_to_selector_classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
            }
            if ("custom" === params.type && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                emit("paginationRender", $el[0]);
            } else emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let paginationHTML = "";
            if ("bullets" === params.type) {
                let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classes_to_selector_classesToSelector(params.bulletClass));
            }
            if ("fraction" === params.type) {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("progressbar" === params.type) {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("custom" !== params.type) emit("paginationRender", swiper.pagination.$el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let $el = dom(params.el);
            if (0 === $el.length) return;
            if (swiper.params.uniqueNavElements && "string" === typeof params.el && $el.length > 1) {
                $el = swiper.$el.find(params.el);
                if ($el.length > 1) $el = $el.filter((el => {
                    if (dom(el).parents(".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if ("bullets" === params.type && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if ("bullets" === params.type && params.dynamicBullets) {
                $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
                dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if ("progressbar" === params.type && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classes_to_selector_classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                let index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            Object.assign(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classes_to_selector_classesToSelector(params.bulletClass));
        }
        on("init", (() => {
            if (false === swiper.params.pagination.enabled) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (swiper.params.loop) update(); else if ("undefined" === typeof swiper.snapIndex) update();
        }));
        on("snapIndexChange", (() => {
            if (!swiper.params.loop) update();
        }));
        on("slidesLengthChange", (() => {
            if (swiper.params.loop) {
                render();
                update();
            }
        }));
        on("snapGridLengthChange", (() => {
            if (!swiper.params.loop) {
                render();
                update();
            }
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$el} = swiper.pagination;
            if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const {$el} = swiper.pagination;
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
                if (true === isHidden) emit("paginationShow"); else emit("paginationHide");
                $el.toggleClass(swiper.params.pagination.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Thumb(_ref) {
        let {swiper, extendParams, on} = _ref;
        extendParams({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: true,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let initialized = false;
        let swiperCreated = false;
        swiper.thumbs = {
            swiper: null
        };
        function onThumbClick() {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const clickedIndex = thumbsSwiper.clickedIndex;
            const clickedSlide = thumbsSwiper.clickedSlide;
            if (clickedSlide && dom(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
            if ("undefined" === typeof clickedIndex || null === clickedIndex) return;
            let slideToIndex;
            if (thumbsSwiper.params.loop) slideToIndex = parseInt(dom(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"), 10); else slideToIndex = clickedIndex;
            if (swiper.params.loop) {
                let currentIndex = swiper.activeIndex;
                if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
                    swiper.loopFix();
                    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
                    currentIndex = swiper.activeIndex;
                }
                const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                if ("undefined" === typeof prevIndex) slideToIndex = nextIndex; else if ("undefined" === typeof nextIndex) slideToIndex = prevIndex; else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex; else slideToIndex = prevIndex;
            }
            swiper.slideTo(slideToIndex);
        }
        function init() {
            const {thumbs: thumbsParams} = swiper.params;
            if (initialized) return false;
            initialized = true;
            const SwiperClass = swiper.constructor;
            if (thumbsParams.swiper instanceof SwiperClass) {
                swiper.thumbs.swiper = thumbsParams.swiper;
                Object.assign(swiper.thumbs.swiper.originalParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                Object.assign(swiper.thumbs.swiper.params, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
            } else if (utils_isObject(thumbsParams.swiper)) {
                const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
                Object.assign(thumbsSwiperParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
                swiperCreated = true;
            }
            swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
            swiper.thumbs.swiper.on("tap", onThumbClick);
            return true;
        }
        function update(initial) {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const slidesPerView = "auto" === thumbsSwiper.params.slidesPerView ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
            let thumbsToActivate = 1;
            const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
            if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = swiper.params.slidesPerView;
            if (!swiper.params.thumbs.multipleActiveThumbs) thumbsToActivate = 1;
            thumbsToActivate = Math.floor(thumbsToActivate);
            thumbsSwiper.slides.removeClass(thumbActiveClass);
            if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass); else for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
            const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
            const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
            if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
                let currentThumbsIndex = thumbsSwiper.activeIndex;
                let newThumbsIndex;
                let direction;
                if (thumbsSwiper.params.loop) {
                    if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
                        thumbsSwiper.loopFix();
                        thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
                        currentThumbsIndex = thumbsSwiper.activeIndex;
                    }
                    const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    if ("undefined" === typeof prevThumbsIndex) newThumbsIndex = nextThumbsIndex; else if ("undefined" === typeof nextThumbsIndex) newThumbsIndex = prevThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex; else newThumbsIndex = prevThumbsIndex;
                    direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
                } else {
                    newThumbsIndex = swiper.realIndex;
                    direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
                }
                if (useOffset) newThumbsIndex += "next" === direction ? autoScrollOffset : -1 * autoScrollOffset;
                if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
                    if (thumbsSwiper.params.centeredSlides) if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1; else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1; else if (newThumbsIndex > currentThumbsIndex && 1 === thumbsSwiper.params.slidesPerGroup) ;
                    thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
                }
            }
        }
        on("beforeInit", (() => {
            const {thumbs} = swiper.params;
            if (!thumbs || !thumbs.swiper) return;
            init();
            update(true);
        }));
        on("slideChange update resize observerUpdate", (() => {
            update();
        }));
        on("setTransition", ((_s, duration) => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            thumbsSwiper.setTransition(duration);
        }));
        on("beforeDestroy", (() => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            if (swiperCreated) thumbsSwiper.destroy();
        }));
        Object.assign(swiper.thumbs, {
            init,
            update
        });
    }
    function initSliders() {
        if (document.querySelector(".swiper")) {
            new core(".aircrafttypes-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                autoHeight: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".aircrafttypes-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".aircrafttypes-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".aircrafttypes-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        spaceBetween: 20
                    },
                    479.89: {
                        spaceBetween: 20
                    },
                    767.98: {
                        spaceBetween: 40
                    },
                    991.98: {
                        spaceBetween: 40
                    },
                    1279.98: {
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".specialservices-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".specialservices-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".specialservices-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".specialservices-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".reviews-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".reviews-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".reviews-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".reviews-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 3,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".team-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".team-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".team-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".team-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 3,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 4,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".specialoffers-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".specialoffers-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".specialoffers-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".specialoffers-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".news-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".news-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".news-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".news-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 3,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".partners-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".partners-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".partners-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".partners-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    767.98: {
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        slidesPerView: 3,
                        spaceBetween: 40
                    },
                    1279.98: {
                        slidesPerView: 4,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".aircraftchoose-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".aircraftchoose-slider__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".aircraftchoose-slider__controls .swiper-arrows__btn_prev",
                    nextEl: ".aircraftchoose-slider__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 3,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            new core(".topjets-slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                pagination: {
                    el: ".top-jets__controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".top-jets__controls .swiper-arrows__btn_prev",
                    nextEl: ".top-jets__controls .swiper-arrows__btn_next"
                },
                breakpoints: {
                    320: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    479.89: {
                        autoHeight: true,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    767.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    991.98: {
                        autoHeight: false,
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1279.98: {
                        autoHeight: false,
                        slidesPerView: 3,
                        spaceBetween: 60
                    }
                },
                on: {}
            });
            const aircraftSliderThumb = new core(".aircraft-thumb", {
                observer: true,
                observeParents: true,
                spaceBetween: 15,
                grabCursor: true,
                speed: 1800,
                loop: false,
                effect: "fade",
                freeMode: true,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                        direction: "horizontal"
                    },
                    479.89: {
                        slidesPerView: 3,
                        direction: "horizontal"
                    },
                    767.98: {
                        slidesPerView: 4,
                        direction: "vertical"
                    },
                    991.98: {
                        slidesPerView: 4,
                        direction: "vertical"
                    },
                    1279.98: {
                        slidesPerView: 4,
                        direction: "vertical"
                    }
                }
            });
            new core(".aircraft-full", {
                modules: [ Navigation, Pagination, Thumb ],
                slidesPerView: 1,
                spaceBetween: 15,
                speed: 1800,
                observer: true,
                observeParents: true,
                pagination: {
                    el: ".aircraft__slider-controls .swiper-dotts",
                    clickable: true
                },
                navigation: {
                    prevEl: ".aircraft__slider-controls .swiper-arrows__btn_prev",
                    nextEl: ".aircraft__slider-controls .swiper-arrows__btn_next"
                },
                thumbs: {
                    swiper: aircraftSliderThumb
                }
            });
            const itemList = document.querySelectorAll(".aircraft-full__slide");
            const thumbList = document.querySelectorAll(".aircraft-thumb__slide");
            const itemListFilter = itemList[0].parentNode;
            const thumbListFilter = thumbList[0].parentNode;
            var aircraftNav = document.getElementById("aircraftNav");
            var aircraftNavItem = aircraftNav.getElementsByClassName("aircraft-nav__item");
            for (var i = 0; i < aircraftNavItem.length; i++) aircraftNavItem[i].addEventListener("click", (function() {
                var current = document.getElementsByClassName("active");
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            }));
            document.querySelector(".aircraft-nav").addEventListener("click", (event => {
                if ("LI" !== event.target.tagName) return false;
                let filterClass = event.target.dataset["filter"];
                itemListFilter.innerHTML = "";
                itemList.forEach((elem => {
                    if (elem.classList.contains(filterClass) || "all" === filterClass) itemListFilter.appendChild(elem);
                }));
                thumbListFilter.innerHTML = "";
                thumbList.forEach((elem => {
                    if (elem.classList.contains(filterClass) || "all" === filterClass) thumbListFilter.appendChild(elem);
                }));
            }));
        }
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class FullPage {
        constructor(element, options) {
            let config = {
                noEventSelector: "[data-no-event]",
                сlassInit: "fp-init",
                wrapperAnimatedClass: "fp-switching",
                selectorSection: "[data-fp-section]",
                activeClass: "active-section",
                previousClass: "previous-section",
                nextClass: "next-section",
                idActiveSection: 0,
                mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
                bullets: element.hasAttribute("data-fp-bullets") ? true : false,
                bulletsClass: "fp-bullets",
                bulletClass: "fp-bullet",
                bulletActiveClass: "fp-bullet-active",
                onInit: function() {},
                onSwitching: function() {},
                onDestroy: function() {}
            };
            this.options = Object.assign(config, options);
            this.wrapper = element;
            this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
            this.activeSection = false;
            this.activeSectionId = false;
            this.previousSection = false;
            this.previousSectionId = false;
            this.nextSection = false;
            this.nextSectionId = false;
            this.bulletsWrapper = false;
            this.stopEvent = false;
            if (this.sections.length) this.init();
        }
        init() {
            if (this.options.idActiveSection > this.sections.length - 1) return;
            this.setId();
            this.activeSectionId = this.options.idActiveSection;
            this.setEffectsClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) {
                this.setBullets();
                this.setActiveBullet(this.activeSectionId);
            }
            this.events();
            setTimeout((() => {
                document.documentElement.classList.add(this.options.сlassInit);
                this.options.onInit(this);
                document.dispatchEvent(new CustomEvent("fpinit", {
                    detail: {
                        fp: this
                    }
                }));
            }), 0);
        }
        destroy() {
            this.removeEvents();
            this.removeClasses();
            document.documentElement.classList.remove(this.options.сlassInit);
            this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            this.removeEffectsClasses();
            this.removeZIndex();
            this.removeStyle();
            this.removeId();
            this.options.onDestroy(this);
            document.dispatchEvent(new CustomEvent("fpdestroy", {
                detail: {
                    fp: this
                }
            }));
        }
        setId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.setAttribute("data-fp-id", index);
            }
        }
        removeId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.removeAttribute("data-fp-id");
            }
        }
        setClasses() {
            this.previousSectionId = this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;
            this.nextSectionId = this.activeSectionId + 1 < this.sections.length ? this.activeSectionId + 1 : false;
            this.activeSection = this.sections[this.activeSectionId];
            this.activeSection.classList.add(this.options.activeClass);
            if (false !== this.previousSectionId) {
                this.previousSection = this.sections[this.previousSectionId];
                this.previousSection.classList.add(this.options.previousClass);
            } else this.previousSection = false;
            if (false !== this.nextSectionId) {
                this.nextSection = this.sections[this.nextSectionId];
                this.nextSection.classList.add(this.options.nextClass);
            } else this.nextSection = false;
        }
        removeEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.remove("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.remove("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.remove("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.add("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.add("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.add("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setStyle() {
            switch (this.options.mode) {
              case "slider":
                this.styleSlider();
                break;

              case "cards":
                this.styleCards();
                break;

              case "fade":
                this.styleFade();
                break;

              default:
                break;
            }
        }
        styleSlider() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)"; else if (index > this.activeSectionId) section.style.transform = "translate3D(0,100%,0)";
            }
        }
        styleCards() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index >= this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)";
            }
        }
        styleFade() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) {
                    section.style.opacity = "1";
                    section.style.visibility = "visible";
                } else {
                    section.style.opacity = "0";
                    section.style.visibility = "hidden";
                }
            }
        }
        removeStyle() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.opacity = "";
                section.style.visibility = "";
                section.style.transform = "";
            }
        }
        checkScroll(yCoord, element) {
            this.goScroll = false;
            if (!this.stopEvent && element) {
                this.goScroll = true;
                if (this.haveScroll(element)) {
                    this.goScroll = false;
                    const position = Math.round(element.scrollHeight - element.scrollTop);
                    if (Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0 || Math.abs(position - element.clientHeight) < 2 && yCoord >= 0) this.goScroll = true;
                }
            }
        }
        haveScroll(element) {
            return element.scrollHeight !== window.innerHeight;
        }
        removeClasses() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.classList.remove(this.options.activeClass);
                section.classList.remove(this.options.previousClass);
                section.classList.remove(this.options.nextClass);
            }
        }
        events() {
            this.events = {
                wheel: this.wheel.bind(this),
                touchdown: this.touchDown.bind(this),
                touchup: this.touchUp.bind(this),
                touchmove: this.touchMove.bind(this),
                touchcancel: this.touchUp.bind(this),
                transitionEnd: this.transitionend.bind(this),
                click: this.clickBullets.bind(this)
            };
            if (isMobile.iOS()) document.addEventListener("touchmove", (e => {
                e.preventDefault();
            }));
            this.setEvents();
        }
        setEvents() {
            this.wrapper.addEventListener("wheel", this.events.wheel);
            this.wrapper.addEventListener("touchstart", this.events.touchdown);
            if (this.options.bullets && this.bulletsWrapper) this.bulletsWrapper.addEventListener("click", this.events.click);
        }
        removeEvents() {
            this.wrapper.removeEventListener("wheel", this.events.wheel);
            this.wrapper.removeEventListener("touchdown", this.events.touchdown);
            this.wrapper.removeEventListener("touchup", this.events.touchup);
            this.wrapper.removeEventListener("touchcancel", this.events.touchup);
            this.wrapper.removeEventListener("touchmove", this.events.touchmove);
            if (this.bulletsWrapper) this.bulletsWrapper.removeEventListener("click", this.events.click);
        }
        clickBullets(e) {
            const bullet = e.target.closest(`.${this.options.bulletClass}`);
            if (bullet) {
                const arrayChildren = Array.from(this.bulletsWrapper.children);
                const idClickBullet = arrayChildren.indexOf(bullet);
                this.switchingSection(idClickBullet);
            }
        }
        setActiveBullet(idButton) {
            if (!this.bulletsWrapper) return;
            const bullets = this.bulletsWrapper.children;
            for (let index = 0; index < bullets.length; index++) {
                const bullet = bullets[index];
                if (idButton === index) bullet.classList.add(this.options.bulletActiveClass); else bullet.classList.remove(this.options.bulletActiveClass);
            }
        }
        touchDown(e) {
            this._yP = e.changedTouches[0].pageY;
            this._eventElement = e.target.closest(`.${this.options.activeClass}`);
            if (this._eventElement) {
                this._eventElement.addEventListener("touchend", this.events.touchup);
                this._eventElement.addEventListener("touchcancel", this.events.touchup);
                this._eventElement.addEventListener("touchmove", this.events.touchmove);
                this.clickOrTouch = true;
                if (isMobile.iOS()) {
                    if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
                        if (0 === this._eventElement.scrollTop) this._eventElement.scrollTop = 1;
                        if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
                    }
                    this.allowUp = this._eventElement.scrollTop > 0;
                    this.allowDown = this._eventElement.scrollTop < this._eventElement.scrollHeight - this._eventElement.clientHeight;
                    this.lastY = e.changedTouches[0].pageY;
                }
            }
        }
        touchMove(e) {
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            if (isMobile.iOS()) {
                let up = e.changedTouches[0].pageY > this.lastY;
                let down = !up;
                this.lastY = e.changedTouches[0].pageY;
                if (targetElement) if (up && this.allowUp || down && this.allowDown) e.stopPropagation(); else if (e.cancelable) e.preventDefault();
            }
            if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return;
            let yCoord = this._yP - e.changedTouches[0].pageY;
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll && Math.abs(yCoord) > 20) this.choiceOfDirection(yCoord);
        }
        touchUp(e) {
            this._eventElement.removeEventListener("touchend", this.events.touchup);
            this._eventElement.removeEventListener("touchcancel", this.events.touchup);
            this._eventElement.removeEventListener("touchmove", this.events.touchmove);
            return this.clickOrTouch = false;
        }
        transitionend(e) {
            if (e.target.closest(this.options.selectorSection)) {
                this.stopEvent = false;
                this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            }
        }
        wheel(e) {
            if (e.target.closest(this.options.noEventSelector)) return;
            const yCoord = e.deltaY;
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll) this.choiceOfDirection(yCoord);
        }
        choiceOfDirection(direction) {
            this.stopEvent = true;
            if (0 === this.activeSectionId && direction < 0 || this.activeSectionId === this.sections.length - 1 && direction > 0) this.stopEvent = false;
            if (direction > 0 && false !== this.nextSection) this.activeSectionId = this.activeSectionId + 1 < this.sections.length ? ++this.activeSectionId : this.activeSectionId; else if (direction < 0 && false !== this.previousSection) this.activeSectionId = this.activeSectionId - 1 >= 0 ? --this.activeSectionId : this.activeSectionId;
            if (this.stopEvent) this.switchingSection();
        }
        switchingSection(idSection = this.activeSectionId) {
            this.activeSectionId = idSection;
            this.wrapper.classList.add(this.options.wrapperAnimatedClass);
            this.wrapper.addEventListener("transitionend", this.events.transitionEnd);
            this.removeClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
            this.options.onSwitching(this);
            document.dispatchEvent(new CustomEvent("fpswitching", {
                detail: {
                    fp: this
                }
            }));
        }
        setBullets() {
            this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);
            if (!this.bulletsWrapper) {
                const bullets = document.createElement("div");
                bullets.classList.add(this.options.bulletsClass);
                this.wrapper.append(bullets);
                this.bulletsWrapper = bullets;
            }
            if (this.bulletsWrapper) for (let index = 0; index < this.sections.length; index++) {
                const span = document.createElement("span");
                span.classList.add(this.options.bulletClass);
                this.bulletsWrapper.append(span);
            }
        }
        setZIndex() {
            let zIndex = this.sections.length;
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = zIndex;
                --zIndex;
            }
        }
        removeZIndex() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = "";
            }
        }
    }
    if (document.querySelector("[data-fp]")) flsModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    function _removeClasses(el, class_name) {
        for (var i = 0; i < el.length; i++) el[i].classList.remove(class_name);
    }
    window.onload = function() {
        document.addEventListener("click", documentActions);
        function documentActions(e) {
            const targetElement = e.target;
            if (window.screen.width >= 1279.98) if (targetElement.classList.contains("menu__arrow")) targetElement.closest(".menu__item").classList.toggle("_hover"); else if (!e.target.closest(".menu__item._hover")) _removeClasses(document.querySelectorAll(".menu__item"), "_hover");
            if (window.screen.width >= 1025) if (targetElement.classList.contains("language-switcher__btn")) targetElement.closest(".language-switcher").classList.toggle("_hover"); else if (!e.target.closest(".language-switcher._hover")) _removeClasses(document.querySelectorAll(".language-switcher"), "_hover");
        }
    };
    window.onscroll = function() {
        headerSticky();
    };
    var header = document.querySelector(".header");
    var sticky = header.offsetTop;
    function headerSticky() {
        if (window.pageYOffset > sticky) header.classList.add("sticky"); else header.classList.remove("sticky");
    }
    (function() {
        let counter = document.querySelectorAll(".item-counter__title");
        let limit = 0;
        window.addEventListener("scroll", (function() {
            if (limit == counter.length) return;
            for (let i = 0; i < counter.length; i++) {
                let pos = counter[i].getBoundingClientRect().top;
                let win = window.innerHeight - 40;
                if (pos < win && "0" === counter[i].dataset.stop) {
                    counter[i].dataset.stop = 1;
                    let x = 0;
                    limit++;
                    let int = setInterval((function() {
                        x += Math.ceil(counter[i].dataset.to / 50);
                        counter[i].innerText = x;
                        if (x > counter[i].dataset.to) {
                            counter[i].innerText = counter[i].dataset.to;
                            clearInterval(int);
                        }
                    }), 100);
                }
            }
        }));
    })();
    jQuery("#timepicker").datetimepicker({
        datepicker: false,
        format: "H:i",
        step: 30
    });
    jQuery("#datepicker").datetimepicker({
        timepicker: false,
        format: "d.m.Y",
        dayOfWeekStart: 1
    });
    function aircraftsTypes() {
        const buttons = document.querySelectorAll(".aircrafts-types__btn");
        const types = document.querySelectorAll(".aircrafts-types__item");
        function filter(category, items) {
            items.forEach((item => {
                const isItemFilter = !item.classList.contains(category);
                const isShowAll = "all" === category.toLowerCase();
                if (isItemFilter && !isShowAll) item.classList.add("hide"); else item.classList.remove("hide");
            }));
        }
        buttons.forEach((button => {
            button.addEventListener("click", (() => {
                buttons.forEach((button => {
                    button.classList.remove("_active");
                }));
                button.classList.add("_active");
                const currentCategory = button.dataset.filter;
                filter(currentCategory, types);
            }));
        }));
    }
    aircraftsTypes();
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    headerScroll();
})();