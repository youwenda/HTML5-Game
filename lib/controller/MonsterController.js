/**
 * @module Controller / MonsterController
 * @date created in 2011-12-10 rebuild in 2012-4-10 增加碰撞检测算法 
 * @author youwenda@163.com
 */
(function(window){
	var MonsterController = function(config){
		MonsterController.superclass.constructor.apply(this, arguments);
	};
	GLOBAL.OBJECT.extend(MonsterController, Controller);
	var p = MonsterController.prototype;
	/**
	 * @private property
	 * 设置全局变量，防止跨域查找，提高执行速度,速度的提升足以弥补代码的增多
	 */
	var _self = null,
		_hero = null,
		_monster = null,
		_direction = null,
		
		_drawX = 0,
		_drawY = 0,
		
		_drawXNext = 0,
		_drawYNext = 0,
		
		_drawXInMapNext = 0,
		_drawYInMapNext = 0,
		
		_hCenterX = 0,
		_hCenterY = 0,
		_mCenterX = 0,
		_mCenterY = 0,
		_mCenterXInMap = 0,
		_mCenterYInMap = 0,
		
		_hCenterSpriteW = 0,
		_hCenterSpriteH = 0,
		_mCenterSpriteW = 0,
		_mCenterSpriteH = 0,
		
		_blockSide = 0,
		_mapBlocks = null,
		
		_mapBlocksX = 0,
		_mapBlocksY = 0,
		_mapBlocksXNext = 0,
		_mapBlocksYNext = 0,
		
		_isStand = false,
		_randomMoveIndex = 0,
		_randomMoveTimes = 0,
		_randomMoveAction = 0;
		
		
	p.initialize = function(config){
		config = config || {};
		MonsterController.superclass.initialize.apply(this, arguments);
		/**
		 * drawXInMap, drawYInMap 相对于地图行走的距离，而drawX 和 drawY 相对于窗口行走的距离
		 */
		
		this.drawXInMap = this.monster.drawX;
		this.drawYInMap = this.monster.drawY;
		
		this.findHeroRange = config.findHeroRange; 
		this.moveSpeed = config.moveSpeed;
		
		_self = this;
		_hero = this.hero;
		_monster = this.monster;
		
		_hCenterSpriteW = _hero.getCenterSpriteW();
		_hCenterSpriteH = _hero.getCenterSpriteH();
		_mCenterSpriteW = _monster.getCenterSpriteW();
		_mCenterSpriteH = _monster.getCenterSpriteH();
		
		_blockSide = this.map.blockSide;
		_mapBlocks = this.map.mapBlocks;
		
	}
	p.stop = function(){
		this.monster.update({
			action : "STAND"
		});
	}
	function __isMovable(){
		if(_drawX < 0 || _drawY < 0) return false;
		if(!_mapBlocksXNext){
			_mapBlocksXNext = _mapBlocksX;
		}
		if(!_mapBlocksYNext){
			_mapBlocksYNext = _mapBlocksY;
		}
		// 标记为1的地图区块不可移动
		if(_mapBlocks[_mapBlocksXNext][_mapBlocksYNext]){
			this.isMoveX = this.isMoveY = false;
			this.stop();
			return false;
		}
		return true;	
	}
	function __moveRight(){
		_drawXNext = _drawX + _self.moveSpeed;
		_drawXInMapNext = _self.drawXInMap  + _self.moveSpeed;
		_mapBlocksXNext = Math.floor((_drawXInMapNext + _mCenterSpriteW)/_blockSide);

		if(!__isMovable()) return;
		_self.isMoveX = true;
		_drawX = _drawXNext;
		_self.drawXInMap = _drawXInMapNext;
		//ADD CODE FOR PREVIEWMAP
		_monster.drawXInMap = _drawXInMapNext;
		
	}
	function __moveLeft(){
		_drawXNext = _drawX - _self.moveSpeed;
		_drawXInMapNext = _self.drawXInMap  - _self.moveSpeed;
		_mapBlocksXNext = Math.floor((_drawXInMapNext + _mCenterSpriteW)/_blockSide);
		
		if(!__isMovable()) return;
		_self.isMoveX = true;
		_drawX = _drawXNext;
		_self.drawXInMap = _drawXInMapNext;
		//ADD CODE FOR PREVIEWMAP
		_monster.drawXInMap = _drawXInMapNext;
	}
		
	function __moveDown(){
		_drawYNext = _drawY + _self.moveSpeed;
		_drawYInMapNext = _self.drawYInMap  + _self.moveSpeed;
		_mapBlocksYNext = Math.floor((_drawYInMapNext + _mCenterSpriteH)/_blockSide);

		if(!__isMovable()) return;
		_self.isMoveY = true;
		_drawY = _drawYNext;
		_self.drawYInMap = _drawYInMapNext;
		//ADD CODE FOR PREVIEWMAP
		_monster.drawYInMap = _drawYInMapNext;
	}
	
	function __moveUp(){
		_drawYNext = _drawY - _self.moveSpeed;
		_drawYInMapNext = _self.drawYInMap  - _self.moveSpeed;
		_mapBlocksYNext = Math.floor((_drawYInMapNext + _mCenterSpriteH)/_blockSide);

		if(!__isMovable()) return;
		_self.isMoveY = true;
		_drawY = _drawYNext;
		_self.drawYInMap = _drawYInMapNext;
		//ADD CODE FOR PREVIEWMAP
		_monster.drawYInMap = _drawYInMapNext;
	}
	p.move = function(){
		/**
		 * 每次执行move方法时，都需要重新更新这部分全局变量，以获得最新的值
		 */
		_drawX = _monster.drawX;
		_drawY = _monster.drawY;
		_mCenterXInMap = _monster.getCenterXInMap();
		_mCenterYInMap = _monster.getCenterYInMap();
		_mapBlocksX = Math.floor(_mCenterXInMap / _blockSide);
		_mapBlocksY = Math.floor(_mCenterYInMap / _blockSide);
		_mapBlocksXNext = 0;
		_mapBlocksYNext = 0;
		
		
		/// 对于合成运动 ,上下方向起到决定作用
		switch(_monster.direction){
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
			_monster.updateXY(_drawX, _drawY);
		}
	}
	p.AIMove = function(){
		_monster = this.monster;
		if(!_monster.isDraw || _monster.getHp() <= 0){
			return;
		}
		
		_hCenterX = _hero.getCenterX();
		_hCenterY = _hero.getCenterY();
		_mCenterX = _monster.getCenterX();
		_mCenterY = _monster.getCenterY();
		/* 
		if(Math.abs(_hCenterX - _mCenterX) <= (_hCenterSpriteW + _mCenterSpriteW) &&
		   Math.abs(_hCenterY - _mCenterY) <= (_hCenterSpriteH + _mCenterSpriteH)){
			// stop the movement and begin to attack
			this.isMoveX = this.isMoveY = true;
			_direction = GameBaseUtil.getDirection(_hCenterX, _hCenterY, _mCenterX, _mCenterY);
			_monster.update({
				action : "ATTACK",
				direction : _direction
			});
		} else if (Math.abs(_mCenterX - _hCenterX) <= this.findHeroRange &&
				   Math.abs(_mCenterY - _hCenterY) <= this.findHeroRange){
			// find the hero and stop the random movement
			_monster.findHero = true;
			
			// chase or interception ??
			_direction = GameBaseUtil.getDirection(_hCenterX, _hCenterY, _mCenterX, _mCenterY);
			_monster.update({
				action : "MOVE",
				direction : _direction
			});
			this.isMoveX = this.isMoveY = true;
			this.move();
				
		} else {
			_monster.findHero = false;
			if(!this.isMoveX && !this.isMoveY){
				_randomMoveAction = Math.random() * 10 >> 0;
				// 1/ 10 的概率处于移动状态
				if(_randomMoveAction == 0){
					_isStand = false;
					_randomMoveIndex = 0;
					_randomMoveTimes = Math.random() * 20 >> 0;
					_direction = GameBaseUtil.getRandomDirection();
					_monster.update({
						action : "MOVE",
						direction : _direction
					});
					this.isMoveX = this.isMoveY = true;
					this.move();
				} else {
					// 9/10 的概率处于停止状态
					if (!_isStand) {
						_isStand = true;
						this.isMoveX = this.isMoveY = false;
						this.stop();
                    }
				}
			} else {
				_randomMoveIndex ++;
				if(_randomMoveTimes == _randomMoveIndex){
					this.isMoveX = this.isMoveY = false;
					this.stop();
				} else {
					this.isMoveX = this.isMoveY = true;
					this.move();
				}   					
			}
		}
		*/
		_monster.findHero = false;
		if(!this.isMoveX && !this.isMoveY){
			_randomMoveAction = Math.random() * 10 >> 0;
			// 1/ 10 的概率处于移动状态
			if(_randomMoveAction == 0){
				_isStand = false;
				_randomMoveIndex = 0;
				_randomMoveTimes = Math.random() * 20 >> 0;
				_direction = GameBaseUtil.getRandomDirection();
				_monster.update({
					action : "MOVE",
					direction : _direction
				});
				this.isMoveX = this.isMoveY = true;
				this.move();
			} else {
				// 9/10 的概率处于停止状态
				if (!_isStand) {
					_isStand = true;
					this.isMoveX = this.isMoveY = false;
					this.stop();
                }
			}
		} else {
			_randomMoveIndex ++;
			if(_randomMoveTimes == _randomMoveIndex){
				this.isMoveX = this.isMoveY = false;
				this.stop();
			} else {
				this.isMoveX = this.isMoveY = true;
				this.move();
			}   					
		}
	}
	window.MonsterController = MonsterController;
})(window);
