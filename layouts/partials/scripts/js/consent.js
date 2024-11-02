function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name,"",-1);
}
function denyAllConsentScripts() {
    var consentValue = "";
    scripts.forEach(function(){
        consentValue = consentValue + "0";
    });
    acceptSomeConsentScripts(consentValue);
}
function acceptAllConsentScripts() {
    var consentValue = "";
    scripts.forEach(function(){
        consentValue = consentValue + "1";
    });
    acceptSomeConsentScripts(consentValue);
}
function acceptSomeConsentScripts(consentValue) {
    setConsentInputs(consentValue);
    createCookie('consent-settings',consentValue,31);
    document.getElementById('consent-notice').style.display = 'none';
    document.getElementById('consent-overlay').classList.remove('active');
    loadConsentScripts(consentValue);
}
function loadConsentScripts(consentValue) {
    scripts.forEach(function(value,key){
        //console.log('script'+key+' is set to ' +consentValue[key]+' and is file '+value);
        if(consentValue[key]=="1") {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = value;
            document.body.appendChild(s);
        }
    });
}
function setConsentInputs(consentValue) {
    var elements = document.querySelectorAll('#consent-overlay input:not([disabled])');
    elements.forEach(function(el,index) {
        if(consentValue[index]=="1") el.checked = true;
        else el.checked = false;
    });
}
function setConsentValue() {
    var elements = document.querySelectorAll('#consent-overlay input:not([disabled])');
    var consentValue = "";
    elements.forEach(function(el) {
        if(el.checked) consentValue = consentValue + "1";
        else consentValue = consentValue + "0";
    });
    document.getElementById("save-consent").dataset.consentvalue = consentValue;
}

var elements = document.querySelectorAll('#consent-overlay input:not([disabled])');
elements.forEach(function(el) {
    el.checked = false;
});

if(readCookie('consent-settings')) {
    var consentValue = readCookie('consent-settings').toString();
    //console.log(consentValue);
    setConsentInputs(consentValue);
    loadConsentScripts(consentValue);
} else {
    document.getElementById('consent-notice').style.display = 'block';
}
var elements = document.querySelectorAll('.manage-consent');
elements.forEach(function(el) {
    el.addEventListener("click",function() {
        document.getElementById('consent-overlay').classList.toggle('active');
    });
});
var elements = document.querySelectorAll('.deny-consent');
elements.forEach(function(el) {
    el.addEventListener("click",function() {
        denyAllConsentScripts();
    });
});
var elements = document.querySelectorAll('.approve-consent');
elements.forEach(function(el) {
    el.addEventListener("click",function() {
        acceptAllConsentScripts();
    });
});
document.getElementById("save-consent").addEventListener("click",function() {
    setConsentValue();
    acceptSomeConsentScripts(this.dataset.consentvalue);
});
document.getElementById("consent-overlay").addEventListener("click",function(e) {
    if (!document.querySelector("#consent-overlay > div").contains(e.target)){
        this.classList.toggle('active');
    }
});