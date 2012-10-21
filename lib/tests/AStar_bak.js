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
		var openlist = [], closelist = [];
		var gw = 10, gh = 10, gwh = 14;
		var p_start = [], p_end = [];
		var s_path, n_path = "";
		var num, bg, flag = 0;
		var w = 30, h = 20;
		var start,end = null;
		var maptt = document.getElementById("maptt");
		function __IsOutScreen(arr){
			if(arr[0] < 0 || arr[0] > w - 1 || arr[1] < 0 || arr[1] > h -1){
				return true;
			}
			return false;
		}
		function __IsPass(arr){
			var temp = arr.join(",");
			if((";" + n_path + ";").indexOf(";" + temp + ";") != -1){
				return true;
			}
			return false;
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
			//for(var i = 0, l = openlist.heap.length; i < l; i++){
			for(var i = 0, l = openlist.length; i < l; i++){
				//temp = openlist.heap[i].current;
				temp = openlist[i].current;
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
					//o = openlist.heap[num];
					o = openlist[num];
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
					openlist.push({fValue: F, gValue: G, hValue: H, current: t, parent: c});
				}
				if(maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#cccccc" &&
					maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#0000ff" && 
					maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#ff0000" && 
					maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#00ff00") {
						// 为相邻的节点，即已经加入openlist 中的节点添加粉色
                        maptt.rows[t[1]].cells[t[0]].style.backgroundColor="#FF00FF"; 
                        //maptt.rows[t[1]].cells[t[0]].innerHTML="<font color='white' style='font-size:12px;'>"+F+","+G+","+H+"</font>";
                }
                
			}
		}
		function __GetPath(){
			var o,c,res=[],
				l = closelist.length,
				t = closelist[l - 1].parent;
			while(true){
				//str += t.join(",") + ";";
				res.push(t);
				maptt.rows[t[1]].cells[t[0]].style.backgroundColor="#ffff00";
				//alert("加黄色");
				for(var i = 0; i < l; i++){
					o = closelist[i];
					c = o.current;
					if(t[0] == c[0] && t[1] == c[1]){
						t = o.parent;
					}
				}
				if(__IsStart(t)){
						break;
				}
			}
			//alert(str);
			console.log(res);
		}
		return {
			flag : flag,
			getWidth : function(){
				return w;
			},
			getHeight: function(){
				return h;
			},
			setState : function(id, arr){
				switch(id){
					case 1 : 
						p_start = arr;
						// 起点红色
						maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor = "#ff0000";
						break;
					case 2 : 
						p_end = arr;
						// 终点蓝色
						maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor = "#0000ff";
						break;
					case 3 : 
						n_path += arr.join(",") + ";";
						// 障碍物
						maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor = "#cccccc";
						break;
					default:
						break;
				}
			},
			setInitialPostion : function(){
				// 设置起点与终点的启发式路径，其中s_path 记录着 F, G, H, current node, parent node
				var h = (Math.abs(p_end[0] - p_start[0]) + Math.abs(p_end[1] + p_start[1])) * gw;
				//s_path = [h, 0 , h, p_start, p_start];
				s_path = {fValue : h, gValue: 0, hValue: h, current: p_start, parent: p_start};
				start = +new Date();
			},
			main : function(){
				var c,timeout,self = this;
				//debugger;
				__GetF(__GetRound(s_path.current));
				openlist.sort(__compare("fValue"));
				s_path = openlist.shift();
				closelist[closelist.length] = s_path;
				if(openlist.length == 0){
					alert("找不到路径");
					return;
				} 
				if(__IsEnd(s_path.current)){
					clearTimeout(timeout);
					__GetPath();
					end = +new Date();
					alert("找到路径，共需要：" + (end - start));
				} else {
					c = s_path.current;
					// 即将加入closelist 中的节点加绿色
					maptt.rows[c[1]].cells[c[0]].style.backgroundColor="#00ff00";
					timeout = setTimeout(function(){
						self.main();
					},100);
				}
			}
		};
	})();
	window.AStar = AStar;
})(window);
