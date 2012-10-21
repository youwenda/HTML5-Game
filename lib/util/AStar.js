/**
 * Using Binary Heaps in A* Pathfinding
 */
(function(window){
	var AStar = (function(){
		function MinHeap(key){
			this.key = key;
			this.heap = [];
			this.currentSize = 0;
		}
		MinHeap.prototype = {
			constructor : MinHeap,
			__filterUp : function(start){
				var j = start, i = Math.floor(( j - 1) / 2), key = this.key, heap = this.heap, temp = heap[j];
				while( j > 0){
					if(heap[i][key] <= temp[key]){
						break;
					} else {
						heap[j] = heap[i];
						j = i;
						i = Math.floor((i - 1) / 2);
					}
				}
				heap[j] = temp;
			},
			__filterDown : function(start, end){
				var i = start, j = 2 * i + 1, key = this.key, heap = this.heap, temp = heap[i];
				while(j <= end){
					if(j < end && heap[j][key] > heap[j + 1][key]){
						j++;
					}
					if(temp[key] <= heap[j][key]){
						break;
					} else {
						heap[i] = heap[j];
						i = j;
						j = 2 * j + 1;
					}
				}
				heap[i] = temp;
			},
			insert : function(ele){
				this.heap[this.currentSize] = ele;
				this.__filterUp(this.currentSize);
				this.currentSize ++;
			},
			remove : function(){
				var heap = this.heap,
					temp = heap[0],
					currentSize = this.currentSize;
				heap[0] = heap[currentSize - 1];
				heap.pop();
				this.currentSize --;
				this.__filterDown(0, this.currentSize - 1);
				return temp;
			}
		}
		//var openlist = [], closelist = [];
		var openlist = new MinHeap("fValue"), closelist = [];
		var gw = gh = 10, gwh = 14, num = 0;
		var p_start = [], p_end = [], s_path = null, r_path = [];
		var mapBlocks = MapConstants.getConstant("MAP_BLOCKS");
		var w = mapBlocks.length, h = mapBlocks[0].length;
		var start, end = null;
		function __IsOutScreen(arr){
			if(arr[0] < 0 || arr[0] > w - 1 || arr[1] < 0 || arr[1] > h - 1){
				return true;
			}
			return false;
		}
		function __IsPass(arr){
			return mapBlocks[arr[0]][arr[1]];
		}
		function __IsStart(arr){
			if(arr[0] == p_start[0] && arr[1] == p_start[1]){
				return true;
			}
			return false;
		}
		function __IsEnd(arr){
			if(arr[0] == p_end[0] && arr[1] == p_end[1]){
				return true;
			}
			return false;
		}
		function __IsInClose(arr){
			var flag = false, temp = null;
			for(var i = 0, l = closelist.length; i < l; i++){
				temp = closelist[i].current;
				if(arr[0] == temp[0] && arr[1] == temp[1]){
					flag = true;
					break;
				}
			}
			return flag;
		}
		function __IsInOpen(arr){
			var flag = false, temp = null;
			for(var i = 0, l = openlist.heap.length; i < l; i++){
			//for(var i = 0, l = openlist.length; i < l; i++){
				temp = openlist.heap[i].current;
				//temp = openlist[i].current;
				if(arr[0] == temp[0] && arr[1] == temp[1]){
					flag = true;
					num = i;
					break;
				}
			}
			return flag;
		}
		function __IsInTurn(arr){
	        var c = s_path.current;
	        if(arr[0] > c[0]) {
	        	if(arr[1] > c[1]){
	        		if(__IsPass([arr[0] - 1, arr[1]]) || __IsPass([arr[0],arr[1] - 1])){
	        			return true;
	        		}
	        	} else if(arr[1] < c[1]){
	        		if(__IsPass([arr[0] - 1, arr[1]]) || __IsPass([arr[0],arr[1] + 1])){
	        			return true;
	        		}
	        	}
	        } else if(arr[0] < c[0]){
	        	if(arr[1] > c[1]){
	        		if(__IsPass([arr[0], arr[1] - 1]) || __IsPass([arr[0] + 1, arr[1]])){
	        			return true;
	        		}
	        	} else if(arr[1] < c[1]){
	        		if(__IsPass([arr[0] + 1,arr[1]]) || __IsPass([arr[0],arr[1] + 1])){
	        			return true;
	        		}
	        	}
	        }
	        return false;
		}
		function __compare(propertyName){
			return function(obj1, obj2){
				var value1 = obj1[propertyName],
					value2 = obj2[propertyName];
				return value1 - value2;
			}
		}
		function __GetRound(pos){
			var a = [];
			a[0] = [pos[0] + 1, pos[1] - 1];
			a[1] = [pos[0] + 1, pos[1]];
			a[2] = [pos[0] + 1, pos[1] + 1];
			a[3] = [pos[0], pos[1] + 1];
			a[4] = [pos[0] - 1, pos[1] + 1];
			a[5] = [pos[0] - 1, pos[1]];
			a[6] = [pos[0] - 1, pos[1] - 1];
			a[7] = [pos[0], pos[1] - 1];
			return a;
		}
		function __GetF(arr){
			var t,c,o,g, G, H, F;
			for(var i = 0, l = arr.length; i < l; i++){
				t = arr[i];
				if(__IsOutScreen(t) || __IsPass(t) || __IsInClose(t) || __IsStart(t) || __IsInTurn(t)) {
					continue;
				}
				c = s_path.current;
				// t 是 s_path 八个相邻节点中的一个,并测试是否不需要对角线到达
				if((t[0] - c[0]) * (t[1] - c[1]) != 0){
					G = s_path.gValue + gwh;
				} else {
					G = s_path.gValue + gw;
				}
				if(__IsInOpen(t)){
					o = openlist.heap[num];
					//o = openlist[num];
					g = o.gValue;
					if(G < g){
						o.gValue = G;
						o.fValue = G + o.hValue;
						o.parent = c;
					} else {
						G = o.gValue;
					}
				} else {
					H = (Math.abs(p_end[0] - t[0]) + Math.abs(p_end[1] - t[1])) * gw;
					F = G + H;
					openlist.insert({fValue: F, gValue: G, hValue: H, current: t, parent: c});
					//openlist.push({fValue: F, gValue: G, hValue: H, current: t, parent: c});
				}
			}
		}
		function __GetPath(){
			var o,c,
				l = closelist.length,
				t = closelist[l - 1].parent;
			r_path.push(p_end);
			while(true){
				r_path.push(t);
				for(var i = 0; i < l; i++){
					o = closelist[i];
					c = o.current;
					if(t[0] == c[0] && t[1] == c[1]){
						t = o.parent;
					}
				}
				if(__IsStart(t)){
					r_path.push(t);
					break;
				}
			}
			r_path.reverse();
		}
		function __findPathByAStar(){
				var c, timeout, self = this;
				__GetF(__GetRound(s_path.current));
				//openlist.sort(__compare("fValue"));
				//s_path = openlist.shift();
				s_path = openlist.remove();
				closelist[closelist.length] = s_path;
				//if(openlist.length == 0){
				if(openlist.currentSize == 0){
					console.log("找不到路径");
					return;
				} 
				if(__IsEnd(s_path.current)){
					clearTimeout(timeout);
					__GetPath();
					end = +new Date();
					console.log("找到路径，共需要：" + (end - start) + "ms");
				} else {
					c = s_path.current;
					__findPathByAStar();
				}
			}
		return {
			findPath : function(startArr, endArr){
				// 开始计时
				start = +new Date();
				p_start = startArr;
				p_end = endArr;
				//openlist.length = 0;
				openlist.heap.length = 0;
				openlist.currentSize = 0;
				closelist.length = 0;
				r_path.length = 0;
				// 设置起点与终点的启发式路径，其中s_path 记录着 F, G, H, current node, parent node
				var h = (Math.abs(p_end[0] - p_start[0]) + Math.abs(p_end[1] - p_start[1])) * gw;
				s_path = {fValue : h, gValue: 0, hValue: h, current: p_start, parent: p_start};
				__findPathByAStar();
				return r_path;
			}
		};
	})();
	window.AStar = AStar;
})(window);
