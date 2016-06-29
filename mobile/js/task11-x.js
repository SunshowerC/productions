
(function(){
	/**设计稿为1000px*/
	var deviceWidth = document.documentElement.clientWidth ;
	if (deviceWidth > 640) {
		deviceWidth = 640 ;
	}
	document.documentElement.style.fontSize = deviceWidth/10 + 'px';
	console.log(deviceWidth);
}())

