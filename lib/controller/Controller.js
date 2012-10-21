/**
 * 控制基类,属于代码优化后所添加的部分
 * @AUTHOR: YouZhiqiang
 * @DATE: 2012-01-21
 */
(function(window){
	var Controller = function(config){
		this.initialize(config);
	}
	var p = Controller.prototype;
	
	var _self = null,
	
		_canvas = null,
		_ctx = null,
		
		_winW = 0,
		_winH = 0;
		
	p.initialize = function(config){
		config = config || {};
		this.map = config.map;
		this.hero = config.hero;
		this.monster = config.monster;
		this.monsterManager = config.monsterManager;
		this.moveSpeed = config.moveSpeed;
		/**
		 * @Type： BUG
		 * @NOTE：It's hald to find this bug and it exits about 3 mouths,but now I found it sucessfully.
		 * @NOTE：对于合成运动，如果只增加一个变量进行控制的话，
		 * 例如某一方向出现地图滚动的情况下(此时该方向下人物不移动)
		 * 会影响另一方向运动情况
		 * @DATE: 2012-4-6
		 */
		this.isMoveX = false;
		this.isMoveY = false;
		
		_self = this;
		_canvas = document.createElement("canvas");
		_ctx = _canvas.getContext("2d");
		_winW = MapConstants.getConstant("GAME_WINDOW_WIDTH");
		_winH = MapConstants.getConstant("GAME_WINDOW_HEIGHT");
		_canvas.width = _winW;
		_canvas.height = _winH;
	}
	p.move = function(){
		// TODO 在具体子类中进行实现
	}
	p.stop = function(){
		// TODO 在具体子类中进行实现
	}
	p.collisionTest = function(spriteA, spriteB){
		return __collisionTest(spriteA, spriteB);
	}
	function __collisionTest(spriteA, spriteB){

		var minX = spriteA.drawX > spriteB.drawX ? spriteA.drawX : spriteB.drawX,
			minY = spriteA.drawY > spriteB.drawY ? spriteA.drawY : spriteB.drawY,
			maxX = spriteA.drawX + spriteA.drawWidth < spriteB.drawX + spriteB.drawWidth ? (spriteA.drawX + spriteA.drawWidth) : (spriteB.drawX + spriteB.drawWidth),
			maxY = spriteA.drawY + spriteA.drawHeight < spriteB.drawY + spriteB.drawHeight ? (spriteA.drawY + spriteA.drawHeight) : (spriteB.drawY + spriteB.drawHeight);
			
		if (minX >= maxX || minY >= maxY) {
			return false;
		}
		
		var thisData = null, spriteBData = null, temp = [];
		var spriteAIndex = spriteA.frameIndex == spriteA.frames.totalFrames ? spriteA.frameIndex - 1 : spriteA.frameIndex, 
			spriteBIndex = spriteB.frameIndex == spriteB.frames.totalFrames ? spriteB.frameIndex - 1 : spriteB.frameIndex;
		
		_ctx.drawImage(spriteA.frames.image, spriteAIndex * spriteA.frameWidth, 0, spriteA.frameWidth, spriteA.frameHeight, 
	     			   spriteA.drawX, spriteA.drawY, spriteA.drawWidth, spriteA.drawHeight);
		_ctx.globalCompositeOperation = 'source-in';
		
		_ctx.drawImage(spriteB.frames.image, spriteBIndex * spriteB.frameWidth, 0, spriteB.frameWidth, spriteB.frameHeight, 
					   spriteB.drawX, spriteB.drawY, spriteB.drawWidth, spriteB.drawHeight);
		spriteBData = _ctx.getImageData(minX, minY, maxX - minX, maxY - minY).data;
		_ctx.globalCompositeOperation = 'source-over';
		
		for(var i = 3, l = spriteBData.length; i < l; i += 4){
			if(spriteBData[i] > 0) 
				return true;
		}
		return false;
	}
	window.Controller = Controller;
})(window);
