
(function () {

	function GalleryWall(options){
		this.elem = document.querySelector(options.elem);
		this.col =options.col || 5;
		this.gap = options.gap / 2 || 10 ;
		this.init();
	}

	GalleryWall.prototype.init = function() {
		this.createMainDom();
		this.popUp();
	}

	GalleryWall.prototype.createMainDom = function() {
		var galleryWrap = document.createElement('div');
		galleryWrap.setAttribute('class','gallery');
		var fragmentHtml  = '';
		for(var i = 0 ; i < this.col ; i++) {
			fragmentHtml += '<div class = "gallery-col"' +
				'style = "width:' + 100/this.col +'%; padding: 0 ' + this.gap + 'px;" >' +
				'</div>';
		}
		galleryWrap.innerHTML = fragmentHtml;
		this.elem.appendChild(galleryWrap);
		this.columns = galleryWrap.querySelectorAll('.gallery-col');

		var mask = document.createElement('div');
		mask.setAttribute('class','mask');
		this.mask = mask;
		document.body.appendChild(mask);
	}

	GalleryWall.prototype.appendPhoto = function(photo) {
		var newPhoto = document.createElement('div');
		newPhoto.className = 'gallery-item';
		newPhoto.setAttribute('style','margin-bottom:' + this.gap * 2 + 'px');
		newPhoto.innerHTML =
			'<div class="gallery-image">' +
			'<img src=' + photo.src + '>' +
			'</div>' +
			'<div class="gallery-item-info">' +
			'<h4 class="gallery-title">' + photo.title + '</h4>' +
			'<p class="gallery-description">' + photo.description + '</p>' +
			'</div>' ;
		this.getMinHeight().appendChild(newPhoto);
	}

	GalleryWall.prototype.getMinHeight = function() {
		var minColumn = this.columns[0];
		for (var i = 1, len = this.columns.length; i < len; i++) {
			if (this.columns[i].clientHeight < minColumn.clientHeight) {
				minColumn = this.columns[i];
			}
		}

		// console.log(min);
		return minColumn;
	}

	GalleryWall.prototype.popUp = function() {
		var This = this;
		This.elem.onclick = function(e) {
			var target = e.target;
			if (target.tagName.toLowerCase() == 'img' ) {
				This.mask.style.display = 'block';
				This.mask.innerHTML = '';
				var img = document.createElement('img');
				img.setAttribute('src',target.src );
				This.mask.appendChild(img);
				setSize(img);
				document.body.setAttribute('class','noscroll');
			}

			e.stopPropagation()	;
			document.onclick = function(e) {
				This.mask.style.display = 'none';
				document.body.removeAttribute('class');
				document.onclick = null;
			}
		}

		function setSize(target) {
			var width = target.offsetWidth;
			height = target.offsetHeight;
			var imageAspectRatio = width / height;
			var windowAspectRatio = innerWidth / innerHeight;
			// console.log(height + ',' + innerHeight);
			// console.log(imageAspectRatio+ '<'+ windowAspectRatio)
			if (height > innerHeight && imageAspectRatio < windowAspectRatio) {
				target.style.height = innerHeight - 100 + 'px';
			}

			if (width > innerWidth && imageAspectRatio > windowAspectRatio) {
				target.style.width = innerWidth - 100 + 'px';
			}
		}
	}
	
	window.GalleryWall = GalleryWall;

})()






