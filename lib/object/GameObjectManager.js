/**
 * 游戏对象管理器, 是单态对象
 * @author Youzhiqiang
 */
(function(window){
	var GameObjectManager = function(){
		var _sprites = [];
		return {
			add : function(obj){
				_sprites[_sprites.length] = obj;
			},
			moveAllObj : function(x,y){
				for(var i = 0, l = _sprites.length; i < l; i++){
					_sprites[i].moveXY(x,y);
				}
			},
			/**
			 * @param {Object} centerX hero 的中心坐标
			 * @param {Object} centerY hero 的中心坐标
			 * @param {Object} direction 方向
			 * @param {Object} move hero 的坐标平移量XY相等
			 * @param {Object} radius 攻击半径
			 * @param {Object} loseHp 攻击力量
			 */
			attackAllObj : function(centerX, centerY, radius, loseHp){
				for(var i = 0, l = _sprites.length; i < l; i++){
					var _o = _sprites[i];
					if(	GameBaseUtil.inCircle(_o.getCenterX(), _o.getCenterY(), centerX, centerY, radius)){
						_o.loseHp(loseHp);
					}
					_o = null;
				}
			},
			attackAllObjBySkill : function(centerX, centerY, radius, loseHp){
	 			for(var i = 0, l = _sprites.length; i < l; i++){
					var _o = _sprites[i];
					if(	GameBaseUtil.inCircle(_o.getCenterX(), _o.getCenterY(), centerX, centerY, radius)){
						_o.loseHp(loseHp);
					}
					_o = null;
				}
			},
			getLength : function(){
				return _sprites.length;
			},
			getSprite : function(i){
				return _sprites[i];
			}
		};
	}();
	window.GameObjectManager = GameObjectManager;
})(window);