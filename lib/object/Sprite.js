/**
 * @module object / Sprite
 * @date created in 2011-11-3 rebuild in 2012-3-17
 * @author youwenda@163.com
 * 
 *  @param this.frameX,this.frameY 为Sprite序列图中物体所在的起始坐标起点
 *  @param this.frameWidth, this.frameHeight 为Sprite 序列图中物体的宽和高
 *  @param this.drawX,this.drawY 为将该Sprite 绘制到Canvas上的起始坐标点
 *  @param this.drawWidth,this.drawHeight 为将该Sprite 绘制到Canvas 上的实际宽和高
 */
(function(window){
	var Sprite = function(config){
		console.log("Sprite initialize");
		Sprite.superclass.constructor.apply(this, arguments);
	};
	GLOBAL.OBJECT.extend(Sprite,DisplayObject);
	var p = Sprite.prototype;
	p.initialize = function(config){
		config = config || {};
		Sprite.superclass.initialize.apply(this, arguments);
		this.isDraw = true;
		this.sprite = config.sprite || "";
		this.action = config.action || "STAND";
		this.direction = config.direction;
		this.base = config.base || {};
		this.drawXInMap = this.drawX;
		this.drawYInMap = this.drawY;
		this.previewCtx = config.previewCtx;
		this.previewMapPercent = MapConstants.getConstant("PREVIEW_MAP_PERCENT");
		this.updateDirection();
	}
	p.update = function(config){
		Sprite.superclass.update.apply(this, arguments);
		this.updateDirection();
	}
	p.updateDirection = function(){
		/**
		 * 随机值用用右移位实现去零取整
		 */
		var rnd = Math.random() * 4 >> 0; 
		if(!this.direction){
			if(rnd == 0){
				this.direction = "EAST";
			} else if(rnd == 1){
				this.direction = "WEST";
			} else if(rnd == 2){
				this.direction = "NORTH";
			} else if(rnd == 3){
				this.direction = "SOUTH";
			}
		}
		// 逆时针旋转设置stand 状态
		if(this.action == "STAND"){ 
			if(this.direction == "SOUTH_EAST"){ 
				this.direction = "EAST";
			} else if(this.direction == "SOUTH_WEST"){
				this.direction = "SOUTH";
			} else if(this.direction == "NORTH_WEST"){
				this.direction = "WEST";
			} else if(this.direction == "NORTH_EAST"){
				this.direction = "NORTH";
			}
		}
		if(this.action == "DEATH"){
			this.direction = "SOUTH";
		}
		this.actionName = this.sprite.toUpperCase()+"_"+this.action.toUpperCase()+"_"+this.direction.toUpperCase()+"_FRAMES";
		this.frames = SpriteConstants.getConstant(this.actionName);
	}
	p.drawImg = function(){
		if(!this.isDraw){
			return;
		}
		
		if(this.drawX < 0 - this.drawWidth || this.drawX > this.winW || this.drawY < 0 - this.drawHeight || this.drawY > this.winH){
			return;
		}
		
		if (this.frameIndex == this.frames.totalFrames) {
			this.frameIndex = 0;
		}
		
		this.ctx.drawImage(this.frames.image, this.frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight, 
						   this.drawX, this.drawY, this.drawWidth, this.drawHeight);
		this.drawHealthBar();
		this.drawPreviewSprite();
		this.frameIndex ++;
	}
	p.updateXY = function(drawX, drawY){
		this.drawX = drawX;
		this.drawY = drawY;
	}
	p.moveXY = function(moveX, moveY){
		if(moveX){
			this.drawX = this.drawX + moveX;
		}
		if(moveY){
			this.drawY = this.drawY + moveY;
		}
	}
	p.drawHealthBar = function(){
		this.ctx.fillStyle = "#66FF00";
		this.ctx.fillRect(this.drawX, this.drawY, this.base.hp, 6);
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.drawX  + (this.base.hp), this.drawY, (this.drawWidth - this.base.hp), 6);
	}
	p.drawPreviewSprite = function(){
		// TODO 具体在子类中进行实现
	}
	p.getPower = function(){
		return this.base["power"];
	}
	p.setPower = function(power){
		this.base["power"] = power;
	}
	p.addPower = function(power){
		this.base["power"] += power;
	}
	p.losePower = function(power){
		this.base["power"] -= power;
	}
	p.getHp = function(){
		return this.base["hp"];
	}
	p.loseHp = function(hp){
		this.base["hp"] -= hp;
		if(this.base["hp"] <= 0){
			this.base["hp"] = 0;
		}
	}
	p.getCenterXInMap = function(){
		return  this.drawXInMap + Math.round(this.drawWidth / 2);
	}
	p.getCenterYInMap = function(){
		return  this.drawYInMap + Math.round(this.drawHeight / 2);
	}
	window.Sprite = Sprite;
})(window);

/**
 * @NOTE: 
 * 1. 重构之后采用统一的继承方式：GLOBAL.OBJECT.extend(subClass, superClass)的方法；
 * 2. 调用父类的方法需采用 ClassName.superclass.superClassMethodName.apply(this, arguments) 方式；
 * 3. 去除冗余的公共accessor方法，对于公共的成员变量访问直接访问属性即可。
 * 4. 增加getCenterXInMap 和 getCenterYInMap 方法，用于记录Sprite 在地图上的实际中心点位置，减少重复计算，是一个很有用的方法！
 */