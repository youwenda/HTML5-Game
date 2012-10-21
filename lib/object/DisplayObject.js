/**
 * @author YouZhiqiang youwenda@163.com
 * @data created in 2011-11-29 rebuild in 2012-3-17
 * @modul object
 */
(function(window){
	/**
	* DisplayObject is an abstract class that should not be constructed directly.DisplayObject is the base class for all display classes in the CanvasDisplay library.
	* It defines the core properties and methods that are shared between all display objects.
	* @class DisplayObject
	* @constructor
	**/
	var DisplayObject = function(config){
		console.log("DisplayObject initialize");
		this.initialize(config);
	};
	var p = DisplayObject.prototype;
	/**
	 * @public property
	 */
	p.initialize = function(config){
		config = config || {};
		/**
		 * @HTMLCanvasElement
		 */
		this.canvas = config.canvas || document.createElement("canvas");
		this.ctx = config.ctx || this.canvas.getContext("2d");
		/**
		 * the x point of DisplayObject drawn in the canvas 
		 */
		this.drawX = config.drawX || 0;
		/**
		 * the y point of DisplayObject drawn in the canvas
		 */
		this.drawY = config.drawY || 0;
		/**
		 * the x point of SpriteSheet in the image
		 */
		this.frameX = config.frameX || 0;
		/**
		 * the y point of SpriteSheet in the image
		 */
		this.frameY = config.frameY || 0;
		/**
		 * the width of DisplayObject drawn in the canvas
		 */
		this.drawWidth = config.drawWidth || 0;
		/**
		 * the heigth of DisplayObject drawn in the canvas
		 */
		this.drawHeight = config.drawHeight || 0;
		/**
		 * the width of SpriteSheet in the image 
		 */
		this.frameWidth = config.frameWidth || 0;
		/**
		 * the height of SpriteSheet in the image
		 */
		this.frameHeight = config.frameHeight || 0;
		/**
		 * the index of SpriteSheet
		 */
		this.frameIndex = 0;
		/**
		 * SpriteSheet frames
		 */
		this.frames = config.frames || null;
	};
	p.update = function(config){
		config = config || {};
		for(var i in config){
			this[i] = config[i];
		}
	}
	p.getCenterSpriteW = function(){
		return  Math.round(this.drawWidth/2 );
	}
	p.getCenterSpriteH = function(){
		return Math.round(this.drawHeight/2 );
	}
	p.getCenterX = function(){
		return  this.drawX + Math.round(this.drawWidth/2);
	}
	p.getCenterY = function(){
		return  this.drawY + Math.round(this.drawHeight/2);
	}
	window.DisplayObject = DisplayObject;
})(window);

/**
 * @NOTE: 
 * 1. 重构之后采用统一的继承方式：GLOBAL.OBJECT.extend(subClass, superClass)的方法；
 * 2. 调用父类的方法需采用 ClassName.superclass.superClassMethodName.apply(this, arguments) 方式；
 * 3. 去除冗余的公共accessor方法，对于公共的成员变量访问直接访问属性即可。
 * 
 */
