/**
 * @module object / hero
 * @date created in 2011-11-15 rebuild in 2012-3-17
 * @author youwenda@163.com
 */
(function(window){
	var Hero = function(config){
		console.log("Hero initialize");
		Hero.superclass.constructor.apply(this, arguments);
	};
	GLOBAL.OBJECT.extend(Hero, Sprite);
	var p = Hero.prototype;
	p.initialize = function(config){
		config = config || {};
		Hero.superclass.initialize.apply(this, arguments);
		/**
		 * DOM used to be record some usefull information
		 */
		this.infoLb = config.infoLb || null;
		this.noticeLb = config.noticeLb || null;
		/**
		 * Load Hero Music
		 */
		this.music = {
			attack : SoundConstants.getConstant("HERO_ATTACK"),
			death : SoundConstants.getConstant("HERO_DEATH"),
			move : [
				SoundConstants.getConstant("HERO_MOVE1"),
				SoundConstants.getConstant("HERO_MOVE2"),
				SoundConstants.getConstant("HERO_MOVE3"),
				SoundConstants.getConstant("HERO_MOVE4"),
				SoundConstants.getConstant("HERO_MOVE5")
			],
			error : SoundConstants.getConstant("HERO_OPERATION_ERROR"),
			skill : [
				SoundConstants.getConstant("HERO_SKILL1"),
				SoundConstants.getConstant("HERO_SKILL2"),
				SoundConstants.getConstant("HERO_SKILL3")
			]
		};
	}
	p.drawImg = function(){
		Hero.superclass.drawImg.apply(this);
		
		if(!this.isDraw){
			return;
		}
		// @Debug
		this.noticeLb.innerHTML = "hero.action: " + this.action 
								+ "<br/> hero.direction: " + this.direction 
								+ "<br/> drawX: " + this.drawX + " drawY: " + this.drawY
								+ "<br/> frameIndex: " + this.frameIndex + " totalFrames: " + this.frames.totalFrames
								+ "<br/> actionName: " +this.actionName
								+ "<br/> drawXInMap: " +this.drawXInMap + " drawYInMap: " +this.drawYInMap
								+ "<br/> previewdrawXInMap: " +Math.round(this.drawXInMap * this.previewMapPercent) + " previewdrawYInMap: " + Math.round(this.drawYInMap * this.previewMapPercent);
		/**
		 * hero trigger dead
		 */
		if(this.base["hp"] <= 0){
			this.update({
				action : "DEATH",
				direction : "SOUTH"
			});
			
			this.isDraw = false;
			this.music.death.play();
			
			return;
		}
		/**
		 * hero trigger move
		 */
		if(this.action == "MOVE"){
			if(this.frameIndex == this.frames.totalFrames){
				var length = this.music.move.length,
					rand = Math.random() * length >> 0;
				this.music.move[rand].play();
			}
		}
	}
	p.drawPreviewSprite = function(){
		this.previewCtx.fillStyle = "#66FF00";
		this.previewCtx.fillRect(Math.round(this.drawXInMap * this.previewMapPercent), Math.round(this.drawYInMap * this.previewMapPercent), 
						  Math.round(this.drawWidth * this.previewMapPercent), Math.round(this.drawHeight * this.previewMapPercent));
	}
	p.loseHp = function(hp){
		Hero.superclass.loseHp.apply(this, arguments);
		/**
		 * @NOTE : some speciall css3 effection
		 */
		if(this.base["hp"] > 0){
			document.body.style.cssText="background-color: #1C0000; -webkit-transition: background-color 0.5s linear;  -moz-transition: background-color 0.5s linear; -o-transition: background-color 0.5s linear;";
			setTimeout(function(){
				document.body.style.cssText="background-color:#ffffff; -webkit-transition: background-color 0.5s linear;  -moz-transition: background-color 0.5s linear;-o-transition: background-color 0.5s linear;";
			},500);
		}
	}
	window.Hero = Hero;
})(window);
