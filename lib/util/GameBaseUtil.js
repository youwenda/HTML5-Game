/**
 * 游戏中常用的静态计算工具类
 */
(function(){
	var GameBaseUtil = function(){
	};
	/**
	 * 判断目标是否在玩家攻击范围内
	 * @param {Object} targetX 目标点X坐标
	 * @param {Object} targetY 目标点Y坐标
	 * @param {Object} centerX 圆心X坐标
	 * @param {Object} centerY 圆心X坐标
	 * @param {Object} radius 圆半径
	 */
	GameBaseUtil.inCircle = function(targetX, targetY, centerX, centerY, radius){
		return  Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2) <= Math.pow(radius, 2) ? true : false;
	}
	/**
	 * @param {String} spriteName hero
	 * @param {Array} actions ["move","stand","attack","death"]
	 * @param {Array} framesCount [10,10,10,10]
	 * @param {Array} directions ["east","west","north","south","north_east","south_east","north_west","south_west"]
	 */
	GameBaseUtil.initFrames = function(spriteName, actions, framesCount, directions){
		var image = null, frameName = null, frameValue = null;
		for(var i = 0, actionsLen = actions.length; i < actionsLen; i++) {
			var totalFrames = framesCount[i];
			for(var j = 0, directionsLen = directions.length; j < directionsLen; j++) {
				if(actions[i] == "stand"){
					if (directions[j] == "north_east" || directions[j] == "north_west"
					||directions[j] == "south_east" || directions[j] == "south_west"){
						continue;
					}
				}
				if(actions[i] == "death"){
					if(directions[j] != "south"){
						continue;
					}
				}
				image = new Image();
				image.src = "resources/theme/images/object/" + spriteName + "/" + actions[i] + "/" + directions[j] + "/" + directions[j] +".png";
				image.onload = function(){
					SpriteConstants.getConstantInstance().FRAMEALLCOUNT ++;
				};
				// HERO_STAND_SOUTH_FRAMES
				frameName = spriteName.toUpperCase() + "_" + actions[i].toUpperCase() + "_" + directions[j].toUpperCase() + "_FRAMES";
				frameValue = new SpriteFrame({
					image : image,
					totalFrames : totalFrames
				});
				SpriteConstants.setConstant(frameName, frameValue);
			}
		}
	}
	/**
	 * 通过(targetX, targetY) , (currentX, currentY) 获得方向
	 * @param {Object} targetX
	 * @param {Object} targetY
	 * @param {Object} currentX
	 * @param {Object} currentY
	 */
	GameBaseUtil.getDirection = function (dx, dy) {
		var angle = 0, _direction = null, halfOfCenterSprite = 25;	
		if(dx > 0 && (dy > (-1) * halfOfCenterSprite && dy < halfOfCenterSprite)) {
			_direction = "EAST";
		} else if(dx < 0 && (dy > (-1) * halfOfCenterSprite && dy < halfOfCenterSprite)) {
			_direction = "WEST";
		} else if((dx > (-1) * halfOfCenterSprite && dx < halfOfCenterSprite) && dy > 0) {
			_direction = "SOUTH";
		} else if((dx > (-1) * halfOfCenterSprite && dx < halfOfCenterSprite) && dy < 0) {
			_direction = "NORTH";
		} else if (dx >= halfOfCenterSprite && dy >= halfOfCenterSprite) {
			_direction = "SOUTH_EAST";				
		} else if (dx >= halfOfCenterSprite && dy <= (-1) * halfOfCenterSprite) {
			_direction = "NORTH_EAST";
		} else if (dx <= (-1) * halfOfCenterSprite && dy >= halfOfCenterSprite) {
			_direction = "SOUTH_WEST";
		} else if(dx <= (-1) * halfOfCenterSprite && dy <= (-1) * halfOfCenterSprite) {
			_direction = "NORTH_WEST";
		} 
		return _direction; 
	}
	/**
	 * @ SET MONSTER RANDOM DIRECTION
	 */
	GameBaseUtil.getRandomDirection = function() {
		var _randomCode = parseInt(Math.random() * 8);
		var _direction = null;
        
        if (_randomCode == 0) {
            _direction = "NORTH";
        } else if (_randomCode == 1) {
            _direction = "NORTH_EAST";
        } else if (_randomCode == 2) {
            _direction = "EAST";
        } else if (_randomCode == 3) {
           _direction = "SOUTH_EAST";
        } else if (_randomCode == 4) {
            _direction = "SOUTH";
        } else if (_randomCode == 5) {
            _direction = "SOUTH_WEST";
        } else if (_randomCode == 6) {
            _direction = "WEST";
        } else if (_randomCode == 7) {
            _direction = "NORTH_WEST";
        }
		return _direction;
	}
	window.GameBaseUtil = GameBaseUtil;
})(window);

