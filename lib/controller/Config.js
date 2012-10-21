/**
 * @module controller / Application
 * @date created in 2012-3-18
 * @author youwenda@163.com
 */
(function(window){
	/**
	 * this object is uesd to be configed and initialized all of game application 
	 */	
	var Config = (function(){
		var _app = null;
			_framesAllCount = 0, 
			_completePercent = 0, 
			_show = document.getElementById("show"),
			_initDiv = document.getElementById("initDiv"),
			_initShow = document.getElementById("initShow"),
			_borderDiv = document.getElementById("borderDiv"),
			_toolsDiv = document.getElementById("toolsDiv"),
			_imgCount = SpriteConstants.getConstant("SPRITEALLCOUNT");
		return {
			initialize: function(){
				SoundConstants.init();
				var _interval = setInterval(function(){
					_framesAllCount = SpriteConstants.getConstant("FRAMEALLCOUNT");
					_completePercent = Math.floor(_framesAllCount / _imgCount * 100);
					_show.innerHTML = "加载中..：" + _completePercent + "%";
					if(_completePercent >= 100){
						clearInterval(_interval);
						GLOBAL.DOM.addClass(_initDiv, "none");
						GLOBAL.DOM.addClass(_initShow, "none");
						GLOBAL.DOM.removeClass(_borderDiv, "none");
						GLOBAL.DOM.removeClass(_toolsDiv, "none");
						_app = new Application();
						_app.render();
						_app = null;
					}
				}, 50);
				GameBaseUtil.initFrames("hero",["move","stand","attack","death"],[10,10,10,15],["east","west","north","south","north_east","south_east","north_west","south_west"]);
				GameBaseUtil.initFrames("monster",["move","stand","attack","death"],[10,10,10,11],["east","west","north","south","north_east","south_east","north_west","south_west"]);
				console.log("Load Frames");
				console.log(SpriteConstants.getConstantInstance());
			}
		};
	})();
	window.Config = Config;
})(window);
