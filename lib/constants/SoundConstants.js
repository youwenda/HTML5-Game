/**
 * @module constants / SoundConstatns
 * @date created in 2011-11-1 rebuild in 2012-3-17
 * @author youwenda@163.com
 */
(function(window){
	var SoundConstants = (function(){
		/**
		 * @private property
		 */
		var constants = {
			
			GAME_BG : "resources/sound/game_bg/bg.wav",
			
			HERO_ATTACK : "resources/sound/hero/hero_attack.wav",
			HERO_DEATH : "resources/sound/hero/hero_death.wav",
			HERO_MOVE1 : "resources/sound/hero/hero_move1.wav",
			HERO_MOVE2 : "resources/sound/hero/hero_move2.wav",
			HERO_MOVE3 : "resources/sound/hero/hero_move3.wav",
			HERO_MOVE4 : "resources/sound/hero/hero_move4.wav",
			HERO_MOVE5 : "resources/sound/hero/hero_move5.wav",
			HERO_OPERATION_ERROR : "resources/sound/hero/hero_operation_error.wav",
			HERO_SKILL1 : "resources/sound/hero/hero_skill01.wav",
			HERO_SKILL2 : "resources/sound/hero/hero_skill02.wav",
			HERO_SKILL3 : "resources/sound/hero/hero_skill03.wav",
			
			MONSTER_ATTACK : "resources/sound/monster/monster_attack.wav",
			MONSTER_DEATH : "resources/sound/monster/monster_death.wav",
			MONSTER_MOVE : "resources/sound/monster/monster_move.wav"
			
		};
		/**
		 * @public method
		 */
		return {
			init : function(){
				console.log("LOAD MUSIC");
				for(var url in constants){
					console.log(constants[url]);
				}
			},
			getConstant : function(name){
				return new Audio(constants[name]);
			}
		}
	})();
	window.SoundConstants = SoundConstants;
})(window);
