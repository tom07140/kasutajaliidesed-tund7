(function(){
   "use strict";

   var Game = function(){

     // SEE ON SINGLETON PATTERN
     if(Game.instance){
       return Game.instance;
     }
     Game.instance = this;

     //CACHE
     this.cacheStatusValues = ['uncached','idle','checking','downloading','updateready','obsolete'];
     this.cache = window.applicationCache;
     this.startCacheListeners();

     this.online = null;
     this.status = null;
     this.phone = null;

     this.init();
   };

   window.Game = Game; // Paneme muuutuja kÃ¼lge

   Game.prototype = {

     init: function(){

        console.log('started');
        this.askPhone();
        this.serveQuestion();
     },
     startCacheListeners: function(){
         this.cache.addEventListener('cached', this.logEvent.bind(this), false);
         this.cache.addEventListener('checking', this.logEvent.bind(this), false);
         this.cache.addEventListener('downloading', this.logEvent.bind(this), false);
         this.cache.addEventListener('error', this.logEvent.bind(this), false);
         this.cache.addEventListener('noupdate', this.logEvent.bind(this), false);
         this.cache.addEventListener('obsolete', this.logEvent.bind(this), false);
         this.cache.addEventListener('progress', this.logEvent.bind(this), false);
         this.cache.addEventListener('updateready', this.logEvent.bind(this), false);

         window.applicationCache.addEventListener('updateready',function(){
             window.applicationCache.swapCache();
             //console.log('swap cache has been called');
         },false);

         setInterval(function(){
             Game.instance.cache.update();
         }, 10000);

         setInterval(function(){
             Game.instance.checkDeviceStatus();
         }, 100);
     },
     checkDeviceStatus: function(){
         this.online = (navigator.onLine) ? "online" : "offline";
         //console.log(this.online);
         var bar = document.querySelector(".bar");
         if(this.online == "online"){
           bar.className = "bar online";
         }else{
           bar.className = "bar offline";
         }

     },
     logEvent: function(event){

         this.status = this.cacheStatusValues[this.cache.status];
         var message = 'online: '+this.online+', event: '+ event.type+', status: ' + this.status;

        if (event.type == 'error' && navigator.onLine) {
            message+= ' (prolly a syntax error in manifest)';
        }

        //console.log(message);
     },
     serveQuestion: function(){

       //kÃ¼sib TXT'i failist kÃ¼simuse
       if(navigator.onLine){
         //AJAX
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            //kas oli kÃ¼simus
            var q = JSON.parse(xhttp.responseText);
            if(typeof q.id === 'undefined'){
              console.log('kÃ¼simust ei olnud');
              window.setTimeout(function(){
                //ei olnud kÃ¼simust, proovi uuesti
                Game.instance.serveQuestion();
              },1000);
            }else{
              alert(q.question);
              if(localStorage.getItem("question")){
                this.question = localStorage.getItem("question");
              }else{
                ////////////////UUS OSA///////////////////
                var b = prompt("Vastus:");//(alert(q.question));
                if(b){
                  localStorage.setItem("answer", b);
                  this.question = b;
                  q.id++;
                }else{
                  this.serveQuestion();
                }
                ///////////////////////////////////////////
              }
            }
          }
        };
        xhttp.open("GET", "question.txt", true);
        xhttp.send();
       }else{
         window.setTimeout(function(){
           //ei ole online, proovi 1s uuesti
           Game.instance.serveQuestion();
         },1000);
       }

     },
     askPhone: function(){
       if(localStorage.getItem("phone")){
         this.phone = localStorage.getItem("phone");
       }else{
         var p = prompt("Phone nr:");
         if(p){
           localStorage.setItem("phone", p);
           this.phone = p;
         }else{
           this.askPhone();
         }
       }

     }

    }; // Game LÃ•PP

   // kui leht laetud kÃ¤ivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Game();
   };

})();
