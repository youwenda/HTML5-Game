/**
 * Base JavaScript
 * @author You Zhiqiang
 * @date 2011-12-13 rebuild in 2012-3-17 
 */
var GLOBAL = {};
GLOBAL.DOM = {};
GLOBAL.DOM.getElementsByClassName = function(str, root, tag)
{
	root = root || document;
	tag = tag || "*";
	var results =[];
	var elements = root.getElementsByTagName(tag);
	for(var i = 0, len = elements.length; i < len; i++)
	{
		for(var j = 0, classNames = elements[i].className.split(" "), len2 = classNames.length; j < len2; j++)
		{
			if(str == classNames[j])
			{
				results.push(elements[i]);
				break;
			}
		}
	}
	return results;
}
GLOBAL.DOM.addClass = function(node, str)
{
	var temp = node.className;
	if(!new RegExp("(\\s)*" + str).test(temp))
	{
		node.className = temp + " " + str;
	}
}
GLOBAL.DOM.removeClass =function(node, str)
{
	node.className = node.className.replace(new RegExp("(\\s)*" + str),"");
}
GLOBAL.DOM.EventUtil = {
	getEvent : function(event){
		return event || window.event;
	},
	getTarget : function(event){
		return event.target || event.srcElement;
	},
	preventDefault : function(event){
		if(event.preventDefault){
			event.preventDefault();
			event.stopPropagation();
		}else{
			event.returnValue = false;
			event.cancelBubble = true;
		}
	}
}
GLOBAL.AJAX = {
	localCache : {},
	createXHR : function(){
		if(typeof XMLHttpRequest != "undefined"){
			createXHR = function(){return new XMLHttpRequest();};
		}else if(typeof ActiveXObject != "undefined"){
			createXHR = function(){
				if(typeof arguments.callee.activeXString != "string"){
					var xhr = null;
					var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];
					for(var i = 0, len = versions.length; i < len ; i++){
						xhr = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return xhr;
					}
				}
				return new ActiveXObject(arguments.callee.activeXString);
			};
		}else{
			createXHR = function(){throw new Error("NO XHR OBJECT AVILABLE")};
		}
		return createXHR();
	},
	request : function(method, url, async, callback, postVars){
		var that = this;
		// 检查此URL的本地缓存
		if(this.localCache[url]){
			callback.success(this.localCache[url]);
			return;
		}
		var xhr = this.createXHR();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ){
					that.localCache[url] = xhr.responseText;
					callback.success(xhr.responseText);
				}
			}
		};
		xhr.open(method, url, async);
		postVars = postVars || null;
		xhr.send(postVars);
	}
};
GLOBAL.STORAGE = {
	isIE : !!document.all,
	getLocalStorage : function(){
		if(this.isIE){
			getLocalStorage = function(){
				document.body.addBehavior("#default#userdata");
				return document.body;
			};
		}else if(typeof localStorage == "object"){
			getLocalStorage = function(){return localStorage;};
		}else if(typeof globalStorage == "object"){
			getLocalStorage = function(){return globalStorage[location.host];};
		}
		return getLocalStorage();
	},
	setItem : function(name,value){
		var storage = this.getLocalStorage();
		if(this.isIE){
			storage.setAttribute(name, value);
			storage.save("GLOBAL.STORAGE");
		}else{
			storage[name] = value;
		}
	},
	getItem : function(name){
		var storage = this.getLocalStorage();
		if(this.isIE){
			storage.load("GLOBAL.STORAGE");
			return storage.getAttribute(name);
		}else{
			return storage[name];
		}
	},
	removeItem : function(name){
		var storage = this.getLocalStorage();
		if(this.isIE){
			storage.load("GLOBAL.STORAGE");
			storage.removeAttribute(name);
			storage.save("GLOBAL.STORAGE");
		}else{
			//delete storage[name];
			storage.removeItem(name);
		}
	}
}
GLOBAL.OBJECT = {};
GLOBAL.OBJECT.extend = function(subClass, superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	subClass.superclass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
}
