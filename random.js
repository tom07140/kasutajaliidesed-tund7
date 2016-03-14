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

     this.init();
   };

   window.Game = Game; // Paneme muuutuja külge

   Game.prototype = {

     init: function(){

        console.log('started');
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
             console.log('swap cache has been called');
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
         console.log(this.online);
     },
     logEvent: function(event){

         this.status = this.cacheStatusValues[this.cache.status];
         var message = 'online: '+this.online+', event: '+ event.type+', status: ' + this.status;

        if (event.type == 'error' && navigator.onLine) {
            message+= ' (prolly a syntax error in manifest)';
        }

        console.log(message);
     }

    }; // Game LÕPP

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Game();
   };

})();
