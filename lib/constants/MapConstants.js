/**
 * @module constants / MapConstant 
 * @date created in 2011-11-1 rebuild in 2012-3-17
 * @author youwenda@163.com
 */
(function(window){
	var MapConstants = (function(){
		var constants = {
			/**
			 * real map width
			 */
			MAP_WIDTH : 3189,
			/**
			 * real map height
			 */
			MAP_HEIGHT : 1134,
			/**
			 * game windows width, it's refer to PC
			 */
			GAME_WINDOW_WIDTH : 1088,
			/**
			 * game windows heigth, it's refer to PC
			 */
			GAME_WINDOW_HEIGHT : 621,
			/**
			 * game preview window width, it's only mini map
			 */
			PREVIEW_GAME_WINDOW_WIDTH : 360,
			/**
			 * game preview window height, it's only mini map
			 */
			PREVIEW_GAME_WINDOW_HEIGHT : 128,
			/**
			 * map transform to array, it's map blocks
			 */
			MAP_BLOCKS : GLOBAL.Database.mapBlocks,
			/**
			 * Move the map when the distance around the border
			 */
			MOVE_MAP_SIZE_W : 300,
			MOVE_MAP_SIZE_H : 300,
			/**
			 * Tile Length
			 */
			MAPS_BLOCK_SIDE : 50,
			/**
			 * the url of normal map,only one map 
			 */
			MAPS_IMG_01:"resources/theme/images/map/map01.jpg", 
			/**
			 * the url mini map,only one mini map too
			 */
			PREVIEW_MAP_IMG : "",
			/**
			 * the percent of mini map and normal map, this equals 
			 */
			PREVIEW_MAP_PERCENT : 0.112888,
		};
		/**
		 * @public method
		 */
		return {
			getConstant : function(name){
				return constants[name];
			}
		}
	})();
	window.MapConstants = MapConstants;
})(window);
