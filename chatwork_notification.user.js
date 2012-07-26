// ==UserScript==
// @id             chatwork_notification
// @name           ChatWork Notification
// @version        1.0
// @namespace      http://efcl.info/
// @author         azu
// @description    ChatWork notification
// @include        https://www.chatwork.com/*
// @run-at         window-load
// @delay          1000
// @icon           https://www.chatwork.com/favicon.ico
// ==/UserScript==
(function(){
    var unreadCount = 0;
    var roomList = document.getElementById("cw_roomlist_items");
    if (!roomList){
        console.log("チャット画面ではない?");
        return;
    }
    /*
     http://domes.lingua.heliohost.org/webapi/intro-domcore1.html
     https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
     */
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var openChatWork = function(){
        GM_openInTab(location.href, false, true);
    };
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (mutation.type === 'childList'){
                var unread = roomList.getElementsByClassName("cw_unread");
                var unreadCountElem = roomList.getElementsByClassName("cw_num_text");
                // roomに新規メッセージがついた場合
                if (unreadCount < unread.length){
                    unreadCount = unread.length;
                    GM_notification("new message", "ChatWork", null, openChatWork);
                    return;
                }
                unreadCount = unread.length;
                // roomの未読数が増えた場合
                for (var i = 0, len = unreadCountElem.length; i < len; i++){
                    var unreadElem = unreadCountElem[i];
                    if (unreadElem.parentNode.style.display !== "none"){
                        GM_notification("append message", "ChatWork", null, openChatWork);
                    }
                }
            }
        });
    });

    observer.observe(roomList, {
        attributes : false,
        childList : true,
        characterData : false
    });
})();