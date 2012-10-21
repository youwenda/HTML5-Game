/**
 * @module constants / SpriteConstants 
 * @date created in 2011-11-1 rebuild in 2012-3-17
 * @author youwenda@163.com
 */
(function(window){
	var SpriteConstants = (function(){
		var constants = {
			HERO : "HERO",
			MONSTER : "MONSTER",
			BOSS : "BOSS",
			MOVE : "MOVE",
			STAND : "STAND",
			ATTACK : "ATTACK",
			DEATH : "DEATH",
			EAST : "EAST",
			WEST : "WEST",
			NORTH : "NORTH",
			SOUTH : "SOUTH",
			INCREMENT_POWER : 20,
			FULL_POWER : 100,
			FRAMEALLCOUNT : 0,
			SPRITEALLCOUNT : 42
		};
		return {
			getConstant : function(name){
				return constants[name];
			},
			setConstant : function(name, value){
				constants[name] = value;
			},
			getConstantInstance : function(){
				return constants;
			}
		};
	})();
	window.SpriteConstants = SpriteConstants;
})(window);
