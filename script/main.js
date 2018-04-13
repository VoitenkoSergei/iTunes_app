(function(){
	'use strict';
	const form = document.getElementById('search');
	const content = document.getElementById('content');
	let input = document.createElement('input');
	let submit = document.createElement('input');

	input.type = 'text';
	input.name = 'search';
	input.placeholder = 'Enter name music band';
	input.value = 'Metallica';
	submit.type = 'submit';
	submit.value = 'search';

	form.appendChild(input);
	form.appendChild(submit);

	form.addEventListener('submit', (e)=>{
		e=e||event;
		e.preventDefault();
		if(input.value.trim()!==''){
			sendRequest(input.value)
		}
		else return;
	})
	function sendRequest(value){
		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://itunes.apple.com/search?term='+value);
		xhr.send();

		xhr.onreadystatechange = ()=>{
			if(xhr.readyState!==4) return;
			if(xhr.status === 200){
				try{
					let data = JSON.parse(xhr.responseText);
					let serial = JSON.stringify(data);
					localStorage.setItem('itunes_', serial);
					renderData(data);
				}
				catch (e){
					console.log(e);
				}
			}
			else console.log(xhr.status+" "+xhr.statusText);
		}
	}
	function renderData(obj){
		let arr = obj.results;
		let table = document.createElement('table');
		let tr = document.createElement('tr');
		let main;

		table.id='table';
		content.innerHTML='';
		content.appendChild(table);
		table.appendChild(tr);

		for(let i=0; i<6; i++){
			let th = document.createElement('th');
			if(i==0) main='';
			else if(i==1) main='Artist';
			else if(i==2) main='Track';
			else if(i==3) main='Collection';
			else if(i==4) main='Genre';
			else main='';
			th.innerHTML = main;
			tr.appendChild(th);
		}

		for(let i=0; i<arr.length; i++){
			let row = document.createElement('tr');
			row.classList.add('track');
			let subRow = document.createElement('tr');
			if(i%2==0){
				row.classList.add('bgRow');
				subRow.classList.add('bgRow');
			} 

			for(let j=0; j<6; j++){
				let td = document.createElement('td');
				let subTd = document.createElement('td');
				let subMain;
				if(j==0){
					main='<img src="'+arr[i].artworkUrl60+'">';
					subMain='';
				} 
				else if(j==1){
					main=arr[i].artistName;
					subTd.setAttribute('colspan',2);
					subMain='<p class="songName">';
					subMain+=arr[i].artistName+' - '+arr[i].trackName+' <i class="fas fa-music"></i></p>';
					subMain+='<p class="small"><b>Collection:</b> '+arr[i].collectionName+'</p>';
					subMain+='<p class="small"><b>Track Count:</b> '+arr[i].trackCount+'</p>';
					subMain+='<p class="small"><b>Price:</b> '+arr[i].collectionPrice+' USD</p>';
				}
				else if(j==2)
					main='<span>'+arr[i].trackName+'</span>';
				else if(j==3){
					let seconds = arr[i].trackTimeMillis/1000;
					main=arr[i].collectionName;
					subTd.setAttribute('colspan',3);
					subTd.classList.add('vAlign');
					subMain='<audio controls preload="none" src="'+arr[i].previewUrl+'"></audio>';
					subMain+='<p class="small"><b>Track Duration:</b> ';
					subMain+=Math.floor(seconds/60)+':'+ check(seconds%60)+' min</p>';
					subMain+='<p class="small"><b>Track price:</b> '+arr[i].trackPrice+' USD</p>';
				}
				else if(j==4)
					main=arr[i].primaryGenreName;
				else 
					main='<span class="icon"><i class="fas fa-plus fa-2x"></i></span>';

				function check(time){
					return (Math.floor(time)<10)?"0"+Math.floor(time):Math.floor(time);
				}
				td.innerHTML = main;
				row.appendChild(td);
				subRow.classList.add('hidden');
				if(subMain != undefined){
					subTd.innerHTML = subMain;
					subRow.appendChild(subTd);
				}
			}
			table.appendChild(row);
			table.appendChild(subRow);
			input.value='';
		}
		addEvent();
	}
	function addEvent(){
		let icon = document.querySelectorAll('.icon');
		let track = document.querySelectorAll('.track');
		let hide = document.getElementsByClassName('hidden');
		let show = document.getElementsByClassName('show');
		for(let i=0; i<track.length; i++)
			track[i].addEventListener('click',(e)=>{getAccordion(i)});

		function getAccordion(index){
			let parent = icon[index];
			let audio = document.getElementsByTagName('audio');
			if(show.length>0 && show[0]!==hide[index]){
				show[0].classList.remove('show');
				for(let j=0; j<hide.length; j++){
					icon[j].innerHTML='<i class="fas fa-plus fa-2x"></i>';
					audio[j].pause();
				}
			}
			if(hide[index].classList.contains('show')){
				hide[index].classList.remove('show');
				parent.innerHTML='<i class="fas fa-plus fa-2x"></i>';
				audio[index].pause();
			}
			else{
				hide[index].classList.add('show');
				parent.innerHTML='<i class="fas fa-minus fa-2x"></i>';
			}
		}
	}
	window.addEventListener('scroll',()=>{
		const anchor = document.getElementById('anchor');
		let str = '<i class="fas fa-angle-double-up fa-3x"></i>';
		let scroll = window.pageYOffset;
		let top = anchor.getBoundingClientRect().top;
		str = str.link('#search');
		(top-scroll<=0)?anchor.innerHTML = str : anchor.innerHTML = '';
	})
	function renderLocalStorage(key='itunes_'){
		let obj = JSON.parse(localStorage.getItem(key));
		if(obj!==null)
			renderData(obj);
	}
	renderLocalStorage();
})();

