/**
 * @module object / Monster
 * @date created in 2011-11-19
 * @author youwenda@163.com
 */
(function(window){
	var Monster = function(config){
		console.log("Monster initialize");
		Monster.superclass.constructor.apply(this, arguments);
	};
	GLOBAL.OBJECT.extend(Monster, Sprite);
	var p = Monster.prototype;
	/**
	 * @Note: public methode
	 */
	p.initialize = function(config){
		config = config || {};
		Monster.superclass.initialize.apply(this, arguments);
		/**
		 * @Note:public property It's used to record monster wheather find the hero
		 */
		this.findHero = false;
	
		/**
		 * @Note: Load Hero Music
		 */
		this.music = {
			attack : SoundConstants.getConstant("MONSTER_ATTACK"),
			death : SoundConstants.getConstant("MONSTER_DEATH"),
			move : SoundConstants.getConstant("MONSTER_MOVE")
		}
	}
	p.drawImg = function(){
		if(!this.isDraw){
			return;
		}
		/**
		 * 判断monster 是否已在屏幕外
		 */
		if(this.drawX < 0 - this.drawWidth || this.drawX > this.winW || this.drawY < 0 - this.drawHeight || this.drawY > this.winH){
			this.drawPreviewSprite();
			return;
		}
		
		Monster.superclass.drawImg.apply(this);
		/**
		 * Monster trigger death
		 */
		if(this.base["hp"] <= 0){
			this.update({
				action : "DEATH",
				direction : "SOUTH"
			});
			
			this.isDraw = false;
			this.music.death.play();
		/**
		 * @NOTE : The code should be run by hero instead of monster!
		 */
			/*
				this.hero.addPower(SpriteConstants.getConstant("INCREMENT_POWER"));
				var fullPower = SpriteConstants.getConstant("FULL_POWER");
				if(this.hero.getPower() > fullPower){
					this.hero.setPower(fullPower);
				}
			*/	
			return;
		}
		
		/**
		 * Monster trigger Move
		 */
		if (this.action == "MOVE") {
			if(this.findHero && this.frameIndex == this.frames.totalFrames){
				this.music.move.play();
			}
		}
	}
	
	p.drawPreviewSprite = function(){
		this.previewCtx.fillStyle = "red";
		this.previewCtx.fillRect(Math.round(this.drawXInMap * this.previewMapPercent), Math.round(this.drawYInMap * this.previewMapPercent), 
						  Math.round(this.drawWidth * this.previewMapPercent), Math.round(this.drawHeight * this.previewMapPercent));
	}
	window.Monster = Monster;
})(window);
/**
 * @NOTE: 
 * 1. 重构之后加入判断monster 是否已在屏幕外
 * 2. drawImg 方法重写，先进行判断，在继承父类的方法，避免过多的栈调用
 */