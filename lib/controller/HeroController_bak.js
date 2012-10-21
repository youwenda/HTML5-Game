/**
 * @module Controller / HeroController
 * @date created in 2011-12-10 rebuild in 2012-4-5 add A * pathfinding algorithm in 2012-4-6
 * @author youwenda@163.com
 */
(function(window){
	var HeroController = function(config){
		HeroController.superclass.constructor.apply(this, arguments);
	}
	GLOBAL.OBJECT.extend(HeroController, Controller);
	var p = HeroController.prototype;
	/**
	 * @private property
	 * 设置全局变量，防止跨域查找，提高执行速度,速度的提升足以弥补代码的增多
	 */
	var _self = null,
		/**
		 * 存储hero 的物理信息
		 */
		_spriteW = 0,
		_spriteH = 0,
		_centerSpriteW = 0,
		_centerSpriteH = 0,
		/**
		 * 存储地图信息
		 */
		_blockSide = 0,
		_mapBlocks = null,
		_moveMapSizeW = 0,
		_moveMapSizeH = 0,
		_mapW = 0,
		_mapH = 0,
		_winW = 0,
		_winH = 0,
		/**
		 * 存储hero 运动的状况信息
		 */
		_drawX = 0,
		_drawY = 0,
		
		_relativeX = 0,
		_relativeY = 0,
		
		_moveSpeedX = 0,
		_moveSpeedY = 0,
		
		_drawXNext = 0,
		_drawYNext = 0,
		
		_centerXInMap = 0,
		_centerYInMap = 0,
		
		_drawXInMapNext = 0,
		_drawYInMapNext = 0,
		
		_frameXInMap = 0,
		_frameYInMap = 0,
		
		_mapBlocksX = 0,
		_mapBlocksY = 0,
		_mapBlocksXNext = 0,
		_mapBlocksYNext = 0,
		
		/**
		 * 存储A* 智能寻路的结果信息
		 */
		_aStarPath = [],
		_aStarPathIndex = 0,
		_aStarPathIndexChanged = false,
		
		_allMoveSizeX = 0,
		_allMoveSizeY = 0;

	p.initialize = function(config){
		config = config || {};
		HeroController.superclass.initialize.apply(this, arguments);
		/**
		 * drawXInMap, drawYInMap 相对于地图行走的距离，而drawX 和 drawY 相对于窗口行走的距离
		 */
		this.drawXInMap = this.hero.drawX;
		this.drawYInMap = this.hero.drawY;
		
		/**
		 * 初始化全局变量
		 */
		_self = this;
		_spriteW = this.hero.drawWidth;
		_spriteH = this.hero.drawHeight;
		_centerSpriteW = this.hero.getCenterSpriteW();
		_centerSpriteH = this.hero.getCenterSpriteH();
		
		_blockSide = this.map.blockSide;
		_mapBlocks = this.map.mapBlocks;
		_moveMapSizeW = this.map.moveMapSizeW;
		_moveMapSizeH = this.map.moveMapSizeH;
		_mapW = this.map.mapW;
		_mapH = this.map.mapH;
		_winW = this.map.winW;
		_winH = this.map.winH;
		
		// @DEBUG
		var _canvas = document.getElementById("gameWindow");
		_canvas.addEventListener("click", function(event){
			_centerXInMap = _self.hero.getCenterXInMap();
			_centerYInMap = _self.hero.getCenterYInMap();
			
			_relativeX = event.clientX - _self.map.canvas.offsetLeft;
			_relativeY = event.clientY - _self.map.canvas.offsetTop;
			
			_frameXInMap = _self.map.frameX;
			_frameYInMap = _self.map.frameY;
			
			/**
			 * @Note：清空A*寻路信息，会导致重新计算A*
			 */
			_aStarPath.length = 0;
			_aStarPathIndex = 0;
			_aStarPathIndexChanged = false;
			
			var dx = _relativeX + _frameXInMap - _centerXInMap,
				dy = _relativeY + _frameYInMap - _centerYInMap;			
			__setMoveDirection(dx, dy);
			
		}, false);
	}
	p.stop = function(){
		this.hero.update({
			action : "STAND"
		});
		_aStarPath.length = 0;
		_aStarPathIndex = 0;
		_aStarPathIndexChanged = false;
	}
	/**
	 * @private method
	 */
	function __setMoveDirection(dx, dy){
		var angle = 0;

		angle = Math.atan2(dy, dx);
		_moveSpeedX = Math.round( Math.abs( Math.cos(angle) * _self.moveSpeed ));
		_moveSpeedY = Math.round( Math.abs( Math.sin(angle) * _self.moveSpeed ));
		
		_self.hero.infoLb.innerHTML = "angle: " + angle 
									+ "<br/>dx: " + dx +" dy: " + dy
									+ "<br/> relativeX: " + _relativeX + " , relativeY:  " + _relativeY
									+ "<br/> moveSpeedX: " + _moveSpeedX + " , moveSpeedY: " + _moveSpeedY;
		
		var _direction = GameBaseUtil.getDirection(dx, dy);
		_self.hero.update({
			action : "MOVE",
			direction : _direction
		});
	}		
	function __isMovable(){
		if(!_mapBlocksXNext){
			_mapBlocksXNext = _mapBlocksX;
		}
		if(!_mapBlocksYNext){
			_mapBlocksYNext = _mapBlocksY;
		}
		// 标记为1的地图区块不可移动
		if(_mapBlocks[_mapBlocksXNext][_mapBlocksYNext]){
			/**
			 * @Note: we use the  A * pathfinding algorithm only when we find the path is obstacles!
			 */
			var _mapBlocksXEnd = Math.floor((_relativeX + _frameXInMap) / _blockSide),
				_mapBlocksYEnd = Math.floor((_relativeY + _frameYInMap) / _blockSide);
			
			console.log([_mapBlocksX, _mapBlocksY],[_mapBlocksXEnd, _mapBlocksYEnd]);	
			if(_mapBlocks[_mapBlocksX][_mapBlocksY] ||_mapBlocks[_mapBlocksXEnd][_mapBlocksYEnd]){
				_self.hero.infoLb.innerHTML = "起点或终点在障碍之中";
				_self.hero.music.error.play();
				_self.stop();
			} else {
				_aStarPath = AStar.findPath([_mapBlocksX, _mapBlocksY],[_mapBlocksXEnd, _mapBlocksYEnd]);
				if(_aStarPath.length == 0){
					_self.hero.infoLb.innerHTML = "系统未找到相应的路径";
					_self.hero.music.error.play();
					_self.stop();
				}else{
					_aStarPathIndex = 0;
					console.log(_aStarPath);
				}
			}
			return false;
		}
		return true;	
	}
	function __moveRight(){
		_drawXNext = _drawX + _moveSpeedX;
		_drawXInMapNext = _self.drawXInMap  + _moveSpeedX;
		_mapBlocksXNext = Math.floor((_drawXInMapNext + _centerSpriteW)/_blockSide);
		_allMoveSizeX -= _moveSpeedX;
		if(!_aStarPath.length > 0 && !__isMovable()) return;
		// 判断是否走到窗口的最右侧
		if(_drawXNext < _winW - _spriteW){
			// 是否在地图的最右端
			if(_moveMapSizeW >= _mapW - _drawXInMapNext - _spriteW){
				_drawX = _drawXNext;
				_self.isMoveX = true;
			} else if((_moveMapSizeW >= _winW - _drawXNext - _spriteW)){
				_self.isMoveX = false;
				_self.map.reDrawImg(_moveSpeedX, 0);
				_self.monsterManager.moveAllObj(_allMoveSizeX, 0);
			} else {
				_drawX = _drawXNext;
				_self.isMoveX = true;
			}
			_self.drawXInMap = _drawXInMapNext;
			//ADD CODE FOR PREVIEWMAP
			_self.hero.drawXInMap = _drawXInMapNext;
		} else {
			_self.stop();
		}
	}
	function __moveLeft(){
		_drawXNext = _drawX - _moveSpeedX;
		_drawXInMapNext = _self.drawXInMap  - _moveSpeedX;
		_mapBlocksXNext = Math.floor((_drawXInMapNext + _centerSpriteW)/_blockSide);
		_allMoveSizeX += _moveSpeedX;
		if(!_aStarPath.length > 0 && !__isMovable()) return;
		// 判断是否走到窗口的最左侧
		if(_drawXNext >= 0){
			// 在地图的最左侧
			if(_moveMapSizeW >= _drawXInMapNext){
				_drawX = _drawXNext;
				_self.isMoveX = true;
			} else if(_moveMapSizeW > _drawXNext){
				_self.isMoveX = false;
				_self.map.reDrawImg((-1) * _moveSpeedX, 0);
				_self.monsterManager.moveAllObj(_allMoveSizeX, 0);
			} else {
				_drawX = _drawXNext;
				_self.isMoveX = true;
			}
			_self.drawXInMap = _drawXInMapNext;
			//ADD CODE FOR PREVIEWMAP
			_self.hero.drawXInMap = _drawXInMapNext;
		} else {
			_self.stop();
		}
	}
		
	function __moveDown(){
		_drawYNext = _drawY + _moveSpeedY;
		_drawYInMapNext = _self.drawYInMap  + _moveSpeedY;
		_mapBlocksYNext = Math.floor((_drawYInMapNext + _centerSpriteH)/_blockSide);
		_allMoveSizeY -= _moveSpeedY;
		if(!_aStarPath.length > 0 && !__isMovable()) return;
		// 判断是否走到窗口的最下端
		if (_drawYNext < _winH - _spriteH) {
			// 是否在地图的最下端
			if (_moveMapSizeH >= _mapH - _drawYInMapNext - _spriteH) {
				_drawY = _drawYNext;
				_self.isMoveY = true;
			} else if (_moveMapSizeH >= _winH - _drawYNext- _spriteH) {
				_self.isMoveY = false;
				_self.map.reDrawImg(0, _moveSpeedY);
				_self.monsterManager.moveAllObj(0, _allMoveSizeY);
			} else {
				_drawY = _drawYNext;
				_self.isMoveY = true;
			}
			_self.drawYInMap = _drawYInMapNext;
			//ADD CODE FOR PREVIEWMAP
			_self.hero.drawYInMap = _drawYInMapNext;
		} else {
			_self.stop();
		}
	}
	
	function __moveUp(){
		_drawYNext = _drawY - _moveSpeedY;
		_drawYInMapNext = _self.drawYInMap  - _moveSpeedY;
		_mapBlocksYNext = Math.floor((_drawYInMapNext + _centerSpriteH)/_blockSide);
		_allMoveSizeY += _moveSpeedY;
		if(!_aStarPath.length > 0 && !__isMovable()) return;
		// 判断是否走到窗口的最上端
		if (_drawYNext >= 0) {
			// 是否在地图的最上端
			if (_moveMapSizeH >= _drawYInMapNext) {
				_drawY = _drawYNext;
				_self.isMoveY = true;
			} else if (_moveMapSizeH > _drawYNext) {
				_self.isMoveY = false;
				_self.map.reDrawImg(0, _moveSpeedY * (-1));
				_self.monsterManager.moveAllObj(0, _allMoveSizeY);
			} else {
				_drawY = _drawYNext;
				_self.isMoveY = true;
			}
			_self.drawYInMap = _drawYInMapNext;
			//ADD CODE FOR PREVIEWMAP
			_self.hero.drawYInMap = _drawYInMapNext;
		} else {
			_self.stop();
		}
	}
	p.move = function(){
		if(this.hero.action == "DEATH")
			return;
		if(this.hero.action != "MOVE"){
			return;
		}
		/**
		 * 每次执行move方法时，都需要重新更新这部分全局变量，以获得最新的值
		 */
		_drawX = this.hero.drawX;
		_drawY = this.hero.drawY;
		_centerXInMap = this.hero.getCenterXInMap();
		_centerYInMap = this.hero.getCenterYInMap();
		_mapBlocksX = Math.floor(_centerXInMap / _blockSide);
		_mapBlocksY = Math.floor(_centerYInMap / _blockSide);
		_mapBlocksXNext = 0;
		_mapBlocksYNext = 0;
		_allMoveSizeX = 0;
		_allMoveSizeY = 0;
		
		if(_centerXInMap < (_relativeX + _frameXInMap + 25) && _centerXInMap > (_relativeX + _frameXInMap - 25) &&
		   _centerYInMap < (_relativeY + _frameYInMap + 25) && _centerYInMap > (_relativeY + _frameYInMap - 25)) {
		   	this.stop();
			return;
		}
		
		if(_aStarPath.length > 0){
			if(_mapBlocksX == _aStarPath[_aStarPathIndex + 1][0] && _mapBlocksY == _aStarPath[_aStarPathIndex + 1][1]){
				_aStarPathIndex ++;
				_aStarPathIndexChanged = true;
			}
			if(!_aStarPath[_aStarPathIndex + 1]){
				this.stop();
				return;
			} else if(_aStarPathIndex == 0 || _aStarPathIndexChanged) {
				__setMoveDirection((_aStarPath[_aStarPathIndex + 1][0] - _aStarPath[_aStarPathIndex][0]) * _blockSide, 
								   (_aStarPath[_aStarPathIndex + 1][1] - _aStarPath[_aStarPathIndex][1]) * _blockSide);
				_aStarPathIndexChanged = false;
			}
		}

		/// 对于合成运动 ,上下方向起到决定作用
		switch(this.hero.direction){
			case "EAST" : 
				__moveRight();
				break;
			case "WEST" : 
				__moveLeft();
				break;
			case "NORTH" : 
				__moveUp();
				break;
			case "SOUTH" : 
				__moveDown();
				break;
			case "NORTH_EAST" :
				__moveUp();
				__moveRight();
				break;
			case "NORTH_WEST" :
				__moveUp();
				__moveLeft();
				break;
			case "SOUTH_EAST" :
				__moveDown();
				__moveRight();
				break;
			case "SOUTH_WEST" :
				__moveDown();
				__moveLeft();
				break;
		}
		if (this.isMoveX || this.isMoveY) {
			this.hero.updateXY(_drawX, _drawY);
		}
	}
	window.HeroController = HeroController;
})(window);