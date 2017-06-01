class PhotoApp{
	constructor(config){
		this.flickrLink = config.flickrLink;
		this.region = config.region;
		this.rowHeight = config.rowHeight;
		this.width = config.width;
		this.height = config.height;
		this.linkList = [];
		this.count = 4;
		this._getXML();
	};

	_getXML(){
		let httpRequest = new XMLHttpRequest();
		let parser = new DOMParser();
		httpRequest.open('GET', this.flickrLink, true);
		httpRequest.onreadystatechange = () => {
			if(httpRequest.readyState == 4){
				if(httpRequest.status == 200){
					let xmlDoc = parser.parseFromString(httpRequest.responseText, 'text/xml');
					let photo = xmlDoc.getElementsByTagName('photo');
					console.log(photo)
					this._getLink(photo);
				}else{
					console.warn("Error")
				};
			};
		};
		httpRequest.send(null);
	};

	_getLink(photo){
		for(let i = 0; i < photo.length; i++){
			let farmId = photo[i].getAttribute('farm');
			let serverId = photo[i].getAttribute('server');
			let id = photo[i].getAttribute('id');
			let secret = photo[i].getAttribute('secret');
			let link = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '.jpg';
			for(let q = -1; q < i; q++){
				this.linkList[i] = link;
			};
		};
			this._draw(this.linkList);
			console.log(this.height)
	};

	_draw(linkList){
		let width = window.innerWidth;
		let maxInRow = Math.floor(width / this.width);
		let spaceToEach = Math.floor((width - (this.width*maxInRow))/maxInRow);
		// console.log(width);
		// console.log(maxInRow);
		// console.log(spaceToEach);
		fiveRows: for(let i = 0; i < linkList.length; i++){
			let div = document.createElement('div');
			div.style.width = this.width + 'px';
			div.style.height = this.height + 'px';
			div.style.backgroundImage = 'url(' + linkList[i] + ')';
			div.style.backgroundPosition = '0% 0%';
			div.style.backgroundSize = 'cover';
			div.style.position = 'absolute';
			div.style.top = Math.floor(i/maxInRow)*this.rowHeight + 'px';
			div.style.left = (i%maxInRow)*(+this.width + spaceToEach) + 'px'; // добавляем к каждому равномерный отступ
			if((Math.floor(i/maxInRow)*350) > (this.rowHeight * this.count)){ //высчитывает 5 рядов
				this.count += 5;
				break fiveRows;
			};
			div.setAttribute('tabindex', (i+1));
			document.querySelector(this.region).appendChild(div);
		};
		let div = document.querySelectorAll('div');
		div[0].focus();
		this._focus();
	};

	_focus(){
		let itThis = this;
		let body = document.querySelector('body');
		body.onkeydown = function(e){
			itThis._move(e);
		};
	};

	_move(e){
		console.log('move');
		let div = document.querySelectorAll('div');
		let width = window.innerWidth;
		let maxInRow = Math.floor(width / this.rowHeight);
		let moveFocus;
		let active = e.target.tabIndex;
		switch(e.keyCode){
			case 38:
				console.log('up');
				moveFocus = (+active - +maxInRow) -1;
				div[moveFocus].focus();
				break;
			case 40:
				console.log('down');
				moveFocus = (+active + +maxInRow) -1;
				if(moveFocus >= (div.length-(maxInRow*2))){
					// console.log('need more');
					div[moveFocus].focus();
					this._moreFive();
				}else{
					div[moveFocus].focus();
				}
				break;
			case 39:
				console.log('right');
				moveFocus = +active;
				if(moveFocus >= (div.length-(maxInRow*2))){
					div[moveFocus].focus();
					this._moreFive();
				}else{
					div[moveFocus].focus();
				}
				break;
			case 37:
				console.log('left');
				moveFocus = +active - 2;
				div[moveFocus].focus();
				break;
		};
	};

	_moreFive(){
		let div = document.querySelectorAll('div');
		console.log(this.count);
		let width = window.innerWidth;
		let maxInRow = Math.floor(width / this.rowHeight);
		let spaceToEach = Math.floor((width - (this.width*maxInRow))/maxInRow);
		// console.log(width);
		// console.log(maxInRow);
		// console.log(spaceToEach);
		fiveMoreRows: for(let i = div.length; i < this.linkList.length; i++){
			let div = document.createElement('div');
			div.style.width = this.width + 'px';
			div.style.height = this.height + 'px';
			div.style.backgroundImage = 'url(' + this.linkList[i] + ')';
			div.style.backgroundPosition = '0% 0%';
			div.style.backgroundSize = 'cover';
			div.style.position = 'absolute';
			div.style.top = Math.floor(i/maxInRow)*this.rowHeight + 'px';
			div.style.left = (i%maxInRow)*(+this.width + spaceToEach) + 'px';
			if((Math.floor(i/maxInRow)*this.rowHeight) > (this.rowHeight * this.count)){
				this.count += 5;
				break fiveMoreRows;
			};
			div.setAttribute('tabindex', (i+1));
			document.querySelector(this.region).appendChild(div);
		};
	};
};

const config = {
	flickrLink: 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=rest&foo=bar&api_key=60278a0c03c13e4024214628378a53f4',
	region: 'main', // .pic
	rowHeight: '300',
	width: '275',
	height: '275'
};


function a(){
let p = new PhotoApp(config);
}

a();