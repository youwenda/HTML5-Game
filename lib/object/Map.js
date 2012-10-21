/**
 * @author YouZhiqiang youwenda@163.com
 * @data created in 2011-11-29 rebuild in 2012-3-17
 * @modul object
 * 
 * The Map properties
 *   |---------------- mapW == 3189 ---------------------| Map Size
 *   | 	                  |-------- winW ==1088 ---------| PC window Size
 *   |                    |                              |
 *   |					  |(the maximum of frameX)-------|
 *  (the left edge of Map)                     (the right edge of Map)
 */
(function(window){
	var Map = function(config){
		console.log("Map initialize");
		Map.superclass.constructor.apply(this, arguments);
	};
	GLOBAL.OBJECT.extend(Map,DisplayObject);
	var p = Map.prototype;
	/**
	 * @overwritten method
	 */
	p.initialize = function(config){
		config = config || {};
		Map.superclass.initialize.apply(this, arguments);
		/**
		 * the map image object
		 */
		this.image = config.image;
		/**
		 * PC game window width
		 */
		this.winW = MapConstants.getConstant("GAME_WINDOW_WIDTH");
		/**
		 * pc game widow height
		 */
		this.winH = MapConstants.getConstant("GAME_WINDOW_HEIGHT");
		/**
		 * the map of width, should be larger than window
		 */
		this.mapW = MapConstants.getConstant("MAP_WIDTH");
		/**
		 * the map of heigth, should be larger than window
		 */
		this.mapH = MapConstants.getConstant("MAP_HEIGHT");
		/**
		 * the data of map
		 */
		this.mapBlocks = MapConstants.getConstant("MAP_BLOCKS");
		/**
		 * the tile map length
		 */
		this.blockSide = MapConstants.getConstant("MAPS_BLOCK_SIDE");
		/**
		 * the map we should move
		 */
		this.moveMapSizeW = MapConstants.getConstant("MOVE_MAP_SIZE_W");
		this.moveMapSizeH = MapConstants.getConstant("MOVE_MAP_SIZE_H");
	}
	/**
	 * @new public method
	 */
	p.drawImg = function(){
		/**
		 * 在frameX,frameY 坐标处绘制大小为 winW * winH 的image 图像，同时将图片在原点(0,0)处缩放为 winW * winH 大小
		 */
		this.ctx.drawImage(this.image,this.frameX,this.frameY,this.winW,this.winH,0,0,this.winW,this.winH);	
	}
	/**
	 * 其中的frameX 和 frameY 为向Canvas 中绘制背景图像的起始坐标，frameX 和frameY 是地图上的
	 */
	p.reDrawImg = function(moveX, moveY){
		if(moveX) {
			this.frameX += (moveX >> 0);
			if(this.frameX > this.mapW - this.winW) {
				this.frameX = this.mapW - this.winW;
			}
			if(this.frameX < 0) {
				this.frameX = 0;
			}
		}
		if(moveY) {
			this.frameY += (moveY >> 0)
			if(this.frameY > this.mapH - this.winH) {
				this.frameY = this.mapH - this.winH;
			}
			if(this.frameY < 0) {
				this.frameY = 0;
			}
		}		
	}
	window.Map = Map;
})(window);
