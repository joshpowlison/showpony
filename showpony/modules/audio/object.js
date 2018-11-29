S.modules.audio=new function(){
	const M=this;
	
	M.currentTime=null;
	M.currentFile=null;
	
	M.window=document.createElement('audio');
	M.window.className='showpony-block';
	
	M.play=function(){
		M.window.play();
	}
	
	M.pause=function(){
		M.window.pause();
	}
	
	M.input=function(){
		S.toggle();
	}
	
	M.timeUpdate=function(time=0){
		M.currentTime=M.window.currentTime=time;
	}
	
	M.goToTime=0;
	
	M.src=function(file=0,time=0){
		return new Promise(function(resolve,reject){
			// Change the file if it'd be a new one
			if(M.currentFile!==file) M.window.src=S.files[file].path;
			
			// If we're not paused, play
			if(!S.paused) M.play();
			
			resolve();
		});
	}
	
	M.displaySubtitles=function(){
		subtitles.style.cssText=null;
		var currentTime=M.window.currentTime;
		
		var lines=S.subtitles[S.currentSubtitles][M.currentFile].match(/.+/ug);
		console.log(lines);
		for(let i=0;i<lines.length;i++){
			if(/-->/.test(lines[i])){
				var times=/(\S*)\s?-->\s?(\S*)/.exec(lines[i]);
				
				var startTime=times[1].split(/:/);
				startTime.reverse();
				var endTime=times[2].split(/:/);
				endTime.reverse();
				console.log(startTime,endTime);
				
				var check=0;
				for(var ii=0;ii<startTime.length;ii++){
					switch(ii){
						case 0: check+=parseFloat(startTime[ii].replace(',','.')); break;
						case 1: check+=startTime[ii]*60; break;
						case 2: check+=startTime[ii]*3600; break;
					}
				}
				startTime=check;
				
				check=0;
				for(var ii=0;ii<endTime.length;ii++){
					switch(ii){
						case 0: check+=parseFloat(endTime[ii].replace(',','.')); break;
						case 1: check+=endTime[ii]*60; break;
						case 2: check+=endTime[ii]*3600; break;
					}
				}
				endTime=check;
				
				// If between both times
				console.log(startTime,endTime,M.currentTime);
				
				if(
					startTime<=M.currentTime && M.currentTime<=endTime
				){
					var newSubtitle=lines[i+1];
					var ii=i+2;
					
					// Add following lines, if they're not numbers or times
					while(!(/^\d+$|-->/.test(lines[ii])) && ii<lines.length){
						if(newSubtitle.length) newSubtitle+='<br>';
						newSubtitle+=lines[ii];
						
						ii++;
					}
					
					if(subtitles.children.length===0 || subtitles.children[0].innerHTML!==newSubtitle){
						subtitles.innerHTML='';
					
						var block=document.createElement('p');
						block.className='showpony-sub';
						block.innerHTML=newSubtitle;
						
						subtitles.appendChild(block);
					}
					
					return;
				}
			}
			
		}
		
		subtitles.innerHTML='';
	}
	
	// Allow playing videos using Showpony in iOS
	M.window.setAttribute('playsinline','');

	// Fix for Safari not going to the right time
	M.window.addEventListener('loadeddata',function(){
		M.currentTime=M.window.currentTime=M.goToTime;
	});

	M.window.addEventListener('canplay',function(){
		content.classList.remove('showpony-loading');
		// Consider how much has already been loaded; this isn't run on first chunk loaded
		M.window.dispatchEvent(new CustomEvent('progress'));
	});

	M.window.addEventListener('canplaythrough',function(){
		// Consider how much has already been loaded; this isn't run on first chunk loaded
		M.window.dispatchEvent(new CustomEvent('progress'));
	});

	// Buffering
	M.window.addEventListener('progress',function(){
		var bufferedValue=[];
		var timeRanges=M.window.buffered;
		
		for(var i=0;i<timeRanges.length;i++){
			// If it's the first value, and it's everything
			if(i===0 && timeRanges.start(0)==0 && timeRanges.end(0)==M.window.duration){
				bufferedValue=true;
				break;
			}
			
			bufferedValue.push([timeRanges.start(i),timeRanges.end(i)]);
		}
		
		S.files[M.currentFile].buffered=bufferedValue;
		
		getTotalBuffered();
	});
	
	// When we finish playing an audio file
	M.window.addEventListener('ended',function(){
		// Only do this if the menu isn't showing (otherwise, while we're scrubbing this can trigger)
		if(!S.paused) S.to({file:'+1'});
	});

	// On moving through time, update info and title
	M.window.addEventListener('timeupdate',function(){
		M.currentTime=M.window.currentTime;
		
		// Consider how much has already been loaded; this isn't run on first chunk loaded
		this.dispatchEvent(new CustomEvent('progress'));
		timeUpdate();
	});
}();