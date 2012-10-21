/**
 * @module controller / Application
 * @date rebuild in 2012-3-18
 */
(function(window){
	var Application = function(){
		/**
		 * @private properties, initialize application
		 */
		var _fps = 15,
			_time = Math.round(1000 / _fps);
			_canvas = document.getElementById("gameWindow"),
			_ctx = _canvas.getContext("2d"),
			_cacheCanvas = document.createElement("canvas"),
			_cacheCtx = _cacheCanvas.getContext("2d"), 
			_previewCanvas = document.getElementById("previewGameWindow"),
			_previewCtx = _previewCanvas.getContext("2d"),
			_windowWidth = MapConstants.getConstant("GAME_WINDOW_WIDTH"),
			_windowHeight = MapConstants.getConstant("GAME_WINDOW_HEIGHT"),
			_previewWindowWidth = MapConstants.getConstant("PREVIEW_GAME_WINDOW_WIDTH"),
			_previewWindowHeight = MapConstants.getConstant("PREVIEW_GAME_WINDOW_HEIGHT");
			
		var _moveSpeed = 10,
			_mapImage = new Image(),
			_monsterManager = GameObjectManager,
			_infoLb = document.getElementById('heroInfoLabel'),
			_noticeLb = document.getElementById('noticeLabel');
			
		_canvas.width = _windowWidth;
		_canvas.height = _windowHeight;
		_cacheCanvas.width = _windowWidth;
		_cacheCanvas.height = _windowHeight;
		_previewCanvas.width = _previewWindowWidth;
		_previewCanvas.height = _previewWindowHeight;
		/**
		 * @NOTE : Initialize Map Object
		 */
		_mapImage.src = "resources/theme/images/map/map01.jpg";
		var _map01 = new Map({canvas : _canvas, ctx : _ctx, image : _mapImage});
		/**
		 * @NOTE : Initialize Hero Object
		 */
		var _hero = new Hero({
			base:{hp:110,power:100},canvas:_cacheCanvas,ctx:_cacheCtx,previewCtx:_previewCtx,sprite:"HERO",
			frameWidth:200,frameHeight:200,drawX:360,drawY:20,drawWidth:110,drawHeight:110,
			infoLb:_infoLb,noticeLb:_noticeLb
		});
		/**
		 * @NOTE : Initialize HeroController Object
		 */
		var _heroController = new HeroController({
			map : _map01, hero : _hero, moveSpeed : _moveSpeed, monsterManager:_monsterManager
		});
		/**
		 * @NOTE : Initialize Monster Objects
		 */

		var _monsterContainer = [], 
			_monsterControllerContainer = [],
			_tempData = [], 
			_monster = null,
			_monsterController = null,
			_temp = _monsterNum = _random = _randomRow = _randomCol = _randomSpeed = _initialX = _initialY = 0;
			
		_monsterNum = 6;
		_initialX = 800; 
		_initialY = 200;
		_temp = Math.ceil(Math.sqrt(_monsterNum));
		_tempData.length = Math.pow(_temp, 2);
		
		for(var i = 0, l = _tempData.length; i < _monsterNum; i++){
			while(true){
				_random = Math.random() * l >> 0;
				if(!_tempData[_random]){
					_tempData[_random] = 1;
					break;
				}	
			}
			_randomRow = Math.floor(_random / _temp);
			_randomCol = _random % _temp;
			
			_monster = new Monster({
				base:{hp:120},canvas:_cacheCanvas,ctx:_cacheCtx,previewCtx:_previewCtx,sprite:"MONSTER",
				frameWidth:200,frameHeight:200,drawWidth:120,drawHeight:120,
				drawX:_initialX + _randomRow * 60, drawY: _initialY + _randomCol * 100
			});
			console.log(_monster);
			_monsterContainer.push(_monster);
			_monsterManager.add(_monster);
			_monster = null;
		}
		
		for(var i = 0, l = _monsterContainer.length; i < l; i++){
			(function(__i){
				_randomSpeed = Math.random() * _moveSpeed / 2 + 1 >> 0;
				_monsterController = new MonsterController({
					map : _map01, hero : _hero, monster : _monsterContainer[__i], monsterManager : _monsterManager,
					moveSpeed : _randomSpeed, moveXMax : 100, moveYMax :100, findHeroRange : 300
				});
				_monsterControllerContainer.push(_monsterController);
				_monsterController = null;	
			})(i);
		}

		/**
		 * @public method
		 */
		return{
			render:function(){
				var _gameInterval = setInterval(function(){
					_cacheCtx.clearRect(0, 0, _windowWidth + 1, _windowHeight + 1);
					_ctx.clearRect(0, 0, _windowWidth + 1, _windowHeight + 1);
					_previewCtx.clearRect(0, 0, _previewWindowWidth + 1, _previewWindowHeight + 1);
					_cacheCtx.save();
					_map01.drawImg();
					_hero.drawImg();
					_heroController.move();
					
					for(var i = 0, l = _monsterContainer.length; i < l; i++){
						(function(__i){
							_monsterContainer[__i].drawImg();
							_monsterControllerContainer[__i].AIMove();
						})(i);
					}
					
					_cacheCtx.restore();
					_ctx.restore();
					_ctx.drawImage(_cacheCanvas, 0, 0);
				}, _time);
			}
		};
	};
	window.Application = Application;
})(window);
