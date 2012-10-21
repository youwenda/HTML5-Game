/**
 * @module object / SpriteFrame
 * @date created in 2011-11-3 rebuild in 2012-3-17
 * @author youwenda@163.com
 */
(function(window){
	var SpriteFrame = function(config){
		this.initialize(config);		
	};
	var p = SpriteFrame.prototype;
	p.initialize = function(config){
		config = config || {};
		this.image = config.image;
		this.totalFrames = config.totalFrames;
	}
	window.SpriteFrame = SpriteFrame;
})(window);
