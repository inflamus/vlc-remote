var 	
// 	intv = 0,
// 	ccmd = "",
	video_types = [
           "asf", "avi", "divx", "drc", "dv", "f4v", "flv", "gxf", "iso",
           "m1v", "m2v", "m2t", "m2ts", "m4v", "mkv", "mov",
           "mp2", "mp4", "mpeg", "mpeg1",
           "mpeg2", "mpeg4", "mpg", "mts", "mtv", "mxf", "mxg", "nuv",
           "ogg", "ogm", "ogv", "ogx", "ps",
           "rec", "rm", "rmvb", "ts", "vob", "wmv", "xesc" ],
	audio_types = [
		"3ga", "a52", "aac", "ac3", "ape", "awb", "dts", "flac", "it",
		"m4a", "m4p", "mka", "mlp", "mod", "mp1", "mp2", "mp3",
		"oga", "ogg", "oma", "s3m", "spx", "thd", "tta",
		"wav", "wma", "wv", "xm"],
	playlist_types = [
		"asx", "b4s", "cue", "ifo", "m3u", "m3u8", "pls", "ram", "rar",
		"sdp", "vlc", "xspf", "zip", "conf"],
	subtitle_types = [
		'srt', 'idx', 'ass', 'ssa'];

// SETTINGS or defaults
var _server = 'http://'+window.location.hostname+':'+window.location.port;
var server = localStorage.server ? localStorage.server : _server; 
// var server = "http://localhost:8080";
var _defaultBrowse = 'file://~';
var defaultBrowse = localStorage.defaultBrowse ? 'file://'+encodeURIComponent(localStorage.defaultBrowse) : _defaultBrowse;
var maxVolume = localStorage.maxVolume ? localStorage.maxVolume : true;
var useChapters = localStorage.useChapters ? localStorage.useChapters : true;
var forwardDuration = localStorage.forwardDuration ? localStorage.forwardDuration : 15;
var backwardDuration = localStorage.backwardDuration ? localStorage.backwardDuration : 15;
var _updateInterval = 5;
var updateInterval = localStorage.updateInterval ? localStorage.updateInterval : _updateInterval;

function VLC()
{/*
	    <header class="bar bar-nav">
    
      <h1 class="title"><img src=img/vlc16x16.png alt=vlclogo class="icon" /> VLC - Remote Controller</h1>
    </header>*/
	that = this;
	$(window).resize(function(){
		that.updateSliderSize();
	});
	this.titleBar = $('<header>', {'class':'bar bar-nav'})
		.append('<h1 class="title"><img src=img/vlc16x16.png alt="VideoLan Logo" class="icon" /> VLC - Remote Controller</h1>')
		.append('<a class="icon icon-gear pull-right" href=#settings></a>')
		.appendTo('body');
	this.buildSettings();
	this.infoModal = this._modal('info', '<span class="icon icon-info"></span> Informations');
	this.streamModal = this._modal('streams', '<span class="icon icon-more"></span> Streams').find('.content').append('<ul class=table-view></ul>');
	this.plModal = this._modal('playlist', '<span class="icon icon-list"></span> Playlists').find('.content').append('<ul class="table-view"></ul>').find('ul.table-view');
// 	this.errorModal = this._modal('error', '<span class="icon icon-close"></span> Error').find('.content');
	
	this.content = $('<div class=content style="text-align:center;">').appendTo('body');
	$('<div class=slider>').append($('<div class=slide-group>').append(this.slide=$('<div class=slide>')))
		.css('backgroundColor', '#fff')
		.on('slide', function(){
			img = $(this).find('img');
			offset = img.offset();
			if(parseInt(offset.left) < -70) // Slide to the left, Next() playlsit;
			{
// 				img.addClass('gray');
				that.sendCommand('pl_next').updateStatus();
			}
			else if(parseInt(offset.left) > 70) // slide to the right, Prev() playlsit
			{
// 				img.addClass('gray');
				that.sendCommand('pl_previous').updateStatus();
			}
			return;
		})
		.appendTo(this.content);
	this.albumArt = $('<img id="albumArt" style="margin-top:44px; margin-bottom:88px;margin-left: auto; margin-right:auto; max-width:100%;" alt=albumart src="img/vlc-48.png" />').appendTo(this.slide);
// 	this.durationInfo = $('<span class="slide-text">').appendTo(this.slide);
// 	this.durationSlider = $('<input type="range" min="0" max="1" step=".001">').appendTo(this.slide)
// 		.on('mouseup touchend', function(){
// 			that.Seek(Math.round($(this).val()*that.status.length));
// 		})
// 		.on('change', function(){
// 			that.updateDuration($(this).val());
// 		});
	this.errorDiv = $('<div>', {'class':'error'}).appendTo(this.content);
	
	this.navBar = $('<nav>', {'class':'bar bar-tab'}).appendTo('body'); 
	this.nav = {};
	this.staticButtons();

	
	this.browseModal = this._modal('browse', '<span class="icon icon-search"></span> Browse')
				.append($('<footer>', {'class':'bar bar-footer'})
					.append($('<input type="search" placeholder="Search">')
						.on('keyup', function(){
							var valThis = $(this).val().toLowerCase();
							if(valThis == ""){
								$('#browse .content ul.table-view > li').show();           
							} else {
								$('#browse .content ul.table-view > li').each(function(){
									var text = $(this).text().toLowerCase();
									(text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
								});
							};
						})
						.on('focus', function(){$(this).val('').trigger('keyup')})
					)
// 					.append('<span class="icon icon-search"></span>')
				).find('.content').css('padding-bottom', '44px');
	this.Browse();
	
	//every 10 seconds;
	setInterval(function(){that.updateStatus()}, updateInterval*1000);
	return this;
}

VLC.prototype = 
{
	updateStatus: function()
	{
		that = this;
		$.ajax({
			url: server + '/requests/status.json',
			success:function(data, status, error)
			{
				that.status = data;
// 				console.log(that.status);
				that.updateButtons();
				that.updateArt();
				that.error(false);
				$('p#version').text(data.version);

			},
			error: function (jqXHR, status, error)
			{
// 				setTimeout(updateStatus, 500);
// 				console.log('Error in ajax request, retrying...');
				that.error('VLC Connection has been lost.');
			},
			dataType: 'json'
		});
		return this;
	},
	
	sendCommand: function(command)
	{
		that = this;
		if(typeof command != 'object')
			command = {'command':command};
		$.ajax({
			url: server+'/requests/status.json',
			data: command,
			success:function(data)
			{
				that.status = data;
			},
			dataType:'json'
		});
// 		setTimeout(this.updateButtons, 500);
		return this;
	},
	
	Pause: function()
	{
		this.sendCommand('pl_pause').updateButtons();
		return this;
	},
	
	Play: function(id)
	{
		if(id == undefined)
			this.sendCommand('pl_play').updateButtons();
		else
			this.sendCommand({'command':'pl_play', 'id':id}).updateButtons();
		//TODO : add ID playlist to play;
		return this;
	},
	
	Stop: function()
	{
		this.sendCommand('pl_stop').updateButtons();
		return this;
	},
	
// 	_Timeout: false, // used to chose between seek and move in chapters/playlist
	Next:function()
	{
// 		if(arguments.length == 0)
// 		{
// 			that=this;
// 			if(this._Timeout)
// 			{
// 				clearTimeout(this._Timeout);
				if(this.status.information.chapters.length > 1 && this.status.information.chapter < this.status.information.chapters.length && useChapters)
					this.sendCommand({'command':'chapter', 'val':this.status.information.chapter+1});
				else
					this.sendCommand('pl_next');
// 				this._Timeout = setTimeout(function(){
// 					clearTimeout(that._Timeout);
// 					that._Timeout = false;},
// 					5000);
// 			}
// 			else
// 			{
// 				this._Timeout = setTimeout(function(){that.Next(1)}, 1000);
// 			}
// 		}
// 		else
// 		{
// 			this._Timeout = false;
// 			this.Seek('+'+forwardDuration+'s');
// 		}
		return this;
	},
	
	Prev: function()
	{
// 		if(arguments.length == 0)
// 		{
// 			that=this;
// 			if(this._Timeout)
// 			{
// 				clearTimeout(this._Timeout);
				if(this.status.information.chapters.length > 1 && this.status.information.chapter > 0 && useChapters)
					this.sendCommand({'command':'chapter', 'val':this.status.information.chapter-1});
				else
					this.sendCommand('pl_previous');
// 				this._Timeout = setTimeout(function(){
// 					clearTimeout(that._Timeout);
// 					that._Timeout = false;},
// 					5000);
// 			}
// 			else
// 			{
// 				this._Timeout = setTimeout(function(){that.Prev(1)}, 1000);
// 			}
// 		}
// 		else
// 		{
// 			this._Timeout = false;
// 			this.Seek('-'+backwardDuration+'s');
// 		}
		return this;
	},
	
	Seek: function(p)
	{
		this.sendCommand({'command':'seek', 'val':p});
		return this;
	},
	
	Fullscreen: function()
	{
		this.sendCommand('fullscreen');
		return this;
	},
	
	_modal:function(id, title)
	{
		return $('<div>', {'id':id, 'class':'modal'})
			.append($('<header>', {'class':'bar bar-nav'})
				.append($('<a>', {'class':'icon icon-close pull-right', 'href':'javascript:void(0);'}).click(function(){$(this).parent().parent().removeClass('active')}))
				.append($('<h1>', {'class':'title', html:title})))
			.append($('<div>', {'class':'content'}))
			.appendTo('body');
	},
	
	Browse: function(dir)
	{
		that = this;
		dir = dir == undefined ? defaultBrowse : dir;
		$.ajax({
			url: 'requests/browse.json',
			data: {'uri' :dir },
			success: function (data) {
				that.browseModal.empty().append($('<ul class="table-view">')
// 					.append($('<li class="table-view-cell">', {html:'<span class="media-object pull-left icon icon-left-nav"></span> ..'}))
					);
				$(data.element).each(function(){
					ext = this.name.substr(this.name.lastIndexOf('.') + 1).toLowerCase();
					if($.inArray(ext, video_types) != -1 || $.inArray(ext, audio_types) != -1 || $.inArray(ext, playlist_types) != -1 || this.type=='dir')
						that.browseModal.find('ul.table-view')
						.append($('<li class="table-view-cell">')
							.append(
								(this.type == 'dir' ?
									(this.name == '..' ? 
										$('<a data-opendir="'+this.uri+'" class="navigate-left"><span class="pull-right">Back</span></a>').click(function(){that.Browse($(this).attr('data-opendir'))})
									:	$('<a data-opendir="'+this.uri+'" class="navigate-right">'+this.name+'</a>').click(function(){that.Browse($(this).attr('data-opendir'))}))
								:	$('<a data-openfile="'+this.uri+'"><span class="media-object pull-left icon icon-play"></span> '+this.name+'</a>').click(function(){that.sendCommand({'command':'in_play', 'input':$(this).attr('data-openfile')});that.browseModal.parent().removeClass('active')})
								)
							 ));
					else if($.inArray(ext, subtitle_types) != -1)
						that.browseModal.find('ul.table-view')
						.append($('<li class="table-view-cell">')
							.append(
								$('<a data-openfile="'+this.uri+'"><span class="media-object pull-left icon-bars icon"></span> '+this.name+'</a>')
								.click(function(){
									that.sendCommand({'command':'addsubtitle', 'val':$(this).attr('data-openfile')});
									that.browseModal.parent().removeClass('active')})
							 ));
					
				});
				return this;
			},
			error: function(){	setTimeout(function(){that.Browse(dir)}, 1000) },
			dataType:'json'
		});
		return this;
	},
	
	buildSettings: function()
	{
		this._modal('settings', '<span class="icon icon-gear"></span> Settings').find('.content')
			.append($('<ul>', {'class':'table-view'})
				.append($('<li>', {'class':'table-view-divider'})
					.append('VLC Location'))
				.append($('<li>', {'class':'input-row'})
					.append('<label>Server</label>')
					.append($('<input>', {'type':'text', 'value':localStorage.server, 'disabled':true, 'placeholder':server})
						.change(function(){
							if($(this).val() != '')
								server = localStorage.server = $(this).val();
							else
							{
								delete localStorage.server;
								server = _server;
							}})
					)
				 )
// 				.append($('<li>', {'class':'table-view-cell'})
// 					.append('<p><em>Leave blank if you\'re not sure. By default, it will reach the same server.</em></p>')
// 				)
				.append($('<li>', {'class':'table-view-divider'})
					.append('Configuration'))
				.append($('<li>', {'class':'input-row'})
					.append('<label>Update Interval</label>')
					.append($('<input>', {'type':'number','value':localStorage.updateInterval, 'placeholder':_updateInterval})
						.change(function(){
							if($(this).val() != '')
								localStorage.updateInterval = updateInterval = $(this).val();
							else
							{
								delete localStorage.updateInterval;
								updateInterval = _updateInterval;
								
							}})
					)
				)
				.append($('<li>', {'class':'input-row'})
					.append('<label>Browser</label>')
					.append($('<input>', {'type':'text','value':localStorage.defaultBrowse, 'placeholder':'~'})
						.change(function(){
							if($(this).val() != '')
								localStorage.defaultBrowse = defaultBrowse = $(this).val();
							else
							{
								delete localStorage.defaultBrowse;
								defaultBrowse = _defaultBrowse;
								
							}})
					)
				)
				.append($('<li>', {'class':'table-view-cell'})
					.append('Max Vol. 100%')
					.append($('<div>', {'class':maxVolume ? 'toggle active' : 'toggle'})
						.append($('<div>', {'class':'toggle-handle'}))
						.on('toggle', function(){maxVolume = $(this).hasClass('active') ? true : false; localStorage.maxVolume = maxVolume;})
					)
					.append('<p>Prevent volume from going higher than 100%</p>')
				)
				.append($('<li>', {'class':'table-view-cell'})
					.append('Chapters')
					.append($('<div>', {'class': useChapters ? 'toggle active' : 'toggle'})
						.append($('<div>', {'class':'toggle-handle'}))
						.on('toggle', function(){useChapters = $(this).hasClass('active') ? true : false; localStorage.useChapters = useChapters;})
					)
					.append('<p>This will first seek for the next or previous chapter within the playing file, instead of switching to the next file of the internal VLC playlist.</p>')
				)
				.append($('<li>', {'class':'input-row'})
					.append('<label>Forward</label>')
					.append($('<input>', {'type':'number', 'placeholder':'15 seconds', 'value':localStorage.forwardDuration})
						.change(function(){
							if($(this).val()!='')
								localStorage.forwardDuration = forwardDuration = $(this).val();
							else
							{
								delete localStorage.forwardDuration;
								forwardDuration = 15;
							}})
					 )
				)
				.append($('<li>', {'class':'input-row'})
					.append('<label>Backward</label>')
					.append($('<input>', {'type':'number', 'placeholder':'15 seconds', 'value':localStorage.backwardDuration})
						.change(function(){
							if($(this).val()!='')
								localStorage.backwardDuration = backwardDuration = $(this).val();
							else
							{
								delete localStorage.backwardDuration;
								backwardDuration = 15;
							}})
					 )
				)
				.append($('<li>', {'class':'table-view-cell'})
					.append('VLC Version')
					.append('<p id="version">Unknown</p>')
				)
// 				.append($('<li>', {'class':'table-view-cell'})
// 					.append($('<button>', {'class':'btn', text:'Test'})
// 						.click(function(){alert(maxVolume + ' lS:'+localStorage.maxVolume+"\n"+useChapters+' lS:'+localStorage.useChapters)})
// 					)
// 				)
// 				.append($('<li>', {'class':'table-view-cell'})
// 					.append('Setting 2')
// 					.append($('<div>', {'class':'toggle'})
// 						.append($('<div>', {'class':'toggle-handle'}))
// 					 )
// 				)
			 )	
			;
		return this;
	},
	
	Volume: function(a)
	{
// 		if(this.status.volume == 0 && !a)	return this;
// 		if(this.status.volume == 256 && a && maxVolume==true)	return this;
		if((this.status.volume >= 256 || this.status.volume > 230) && a && maxVolume==true)	return this.sendCommand({'command':'volume', 'val':256}); // max : 256/512 = 100%
		if(this.status.volume <= 26 && !a)	return this.sendCommand({'command':'volume', 'val':0}); // min : 0;
		return this.sendCommand({'command':'volume', 'val': a ? this.status.volume + 26 : this.status.volume -26 });
	},
	
	staticButtons : function()
	{
		that = this;
		this.nav.search = $('<a class="tab-item" href=#browse>')
			.append('<span class="icon icon-search"></span>')
			.append('<span class="tab-label">Open</span>')
			.appendTo(this.navBar)
// 			.click(function(){ that.Browse() });
		this.nav.playpause = $('<a class="tab-item" href="javascript:void(0);">').appendTo(this.navBar);
		this.nav.stop = $('<a class="tab-item" href=javascript:void(0);>')
			.append('<span class="icon icon-stop"></span>')
			.append('<span class="tab-label">Stop</span>')
			.appendTo(this.navBar)
			.click(function(){ that.Stop() });
		this.nav.fullscreen = $('<a class="tab-item" href="javascript:void(0);">')
			.append('<span class="icon icon-code"></span>')
			.append('<span class="tab-label">Fullscreen</span>')
			.appendTo(this.navBar)
			.click(function(){ that.Fullscreen(); $(this).toggleClass('active'); });
		this.nav.volume1 = $('<a class="tab-item" href=javascript:void(0);>')
			.append('<span class="icon icon-sound4"></span>')
			.append('<span class="tab-label">Volume -</span>')
			.appendTo(this.navBar)
			.click(function(){ that.Volume(0) });
		this.nav.volume2 = $('<a class="tab-item" href=javascript:void(0);>')
			.append('<span class="icon icon-sound"></span>')
			.append('<span class="tab-label">Volume +</span>')
			.appendTo(this.navBar)
			.click(function(){ that.Volume(1) });

		
		return this;
	},
	
	updateButtons: function()
	{
// 		  <a class="tab-item active" href="#">
//     <span class="icon icon-search"></span>
//     <span class="tab-label">Open</span>
//   </a>	
// 		console.log(this.status);
		that = this;
		
		if(this.status.fullscreen == true)
			if(!this.nav.fullscreen.hasClass('active'))
				this.nav.fullscreen.addClass('active');
			else;
		else
			this.nav.fullscreen.removeClass('active');
		if(this.status.state == 'playing')
			this.nav.playpause.empty().append('<span class="icon icon-pause"></span>').append('<span class="tab-label">Pause</span>')
				.unbind("click").click(function(){ that.Pause()});
		else	this.nav.playpause.empty().append('<span class="icon icon-play"></span>').append('<span class="tab-label">Play</span>')
				.unbind('click').click(function(){ that.Play()});
		volume=Math.floor(this.status.volume/2.56/25);
// 		console.log(volume);
		switch(volume)
		{
			default:
			case 0:
				this.nav.volume1.html('<span class="icon icon-sound4"></span><span class="tab-label">Volume -</span>');
				this.nav.volume2.html('<span class="icon icon-sound3"></span><span class="tab-label">Volume +</span>');
			break;
			case 1:
			case 2:
				this.nav.volume1.html('<span class="icon icon-sound3"></span><span class="tab-label">Volume -</span>');
				this.nav.volume2.html('<span class="icon icon-sound2"></span><span class="tab-label">Volume +</span>');
			break;			
			case 3:
			case 4:	case 5: case 6: case 7: case 8:
				this.nav.volume1.html('<span class="icon icon-sound2"></span><span class="tab-label">Volume -</span>');
				this.nav.volume2.html('<span class="icon icon-sound"></span><span class="tab-label">Volume +</span>');
			break;
		}
		
		this.refreshDuration();
		return this;
	},
	
	refreshDuration: function()
	{
		this.updateDuration(this.status.position);
		if(this.durationSlider)
			this.updateSliderSize()
				.val(this.status.position);
		return this;
	},
	
	updateSliderSize: function()
	{
		return this.durationSlider
			.css('width', function(){ 
				return $(this).parent().outerWidth() - 
					$(this).parent()
						.find('button.pull-left').outerWidth() -
					$(this).parent()
						.find('button.pull-right').outerWidth()
					- 42
					+'px';
			});
	},
	
	updateDuration: function(d)
	{
		if(!this.durationInfo1)	return this;
		this.durationInfo1.text((d*this.status.length).toString().toHHMMSS());
		this.durationInfo2.text(this.status.length.toString().toHHMMSS());
		return this;
	},
	
	buildPlaylist: function(data)
	{
		that = this;
		$.each(data.children, function(){
			that.plModal.append('<li class="table-view-divider">'+this.name+'</li>');
			$.each(this.children, function(){
				that.plModal.append(
					$('<li>', {'class':'table-view-cell'})
					.append(this.current ? '<span class="media-object pull-left icon icon-play"></span> '+this.name
						: 	$('<a data-id="'+this.id+'" class="navigate-right" href=javascript:;><span class="badge">'+this.duration.toString().toHHMMSS()+'</span>'+this.name+'</a>')
								.click(function(){
									that.Play($(this).attr('data-id')).plModal.parent().parent().removeClass('active');
								})
					       )
					)
			})
		});
		return this;	
	},
	
	updateArt: function()
	{
		that = this;
		if(this.status.information )
		{
			if(this.actualImg != this.status.information.category.meta.filename)
				this.albumArt.fadeOut(500, function(){
					meta = that.status.information.category.meta;
					$(this).removeAttr('height').removeAttr('width').removeClass('hidden').attr('src', '/art?'+meta.filename)
						.fadeIn(500)
// 						.removeClass('gray')
						.error(function(){$(this).attr('src', 'img/vlc-48.png');});
// 					console.log(meta);
					h1 = meta.artist && meta.title ? meta.artist +' - '+meta.title :
						(meta.title ? meta.title : 'Informations');
					that.infoModal
						.find('header h1').html('<span class="icon icon-info"></span> '+h1).end()
						.find('.content').empty()
						.append($('<ul class=table-view>')/*
							.append($('<li class=table-view-cell>')
								.append(meta.title)
							 )*/
							.append('<li class="table-view-divider">Meta</li>')
							.append(meta.CONTENT_TYPE && meta.genre ? $('<li class=table-view-cell>')
								.append(meta.CONTENT_TYPE)
								.append('<p>'+meta.genre+'</p>') : ''
							)
							.append(meta.CONTENT_TYPE && !meta.genre ? $('<li class=table-view-cell>')
								.append('Type')
								.append('<p>'+meta.CONTENT_TYPE+'</p>') : ''
							)
							.append(meta.artist != undefined ? $('<li class=table-view-cell>')
								.append('Artist')
								.append('<p>'+meta.artist+'</p>') : ''
							)
							.append(meta.title != undefined ? $('<li class=table-view-cell>')
								.append('Title')
								.append('<p>'+ (
									meta.track_number >0 && meta.track_total>0 ? '['+meta.track_number+'/'+meta.track_total+'] - ' :
										(meta.track_number>0? meta.track_number+'. ' : '') )
										+ meta.title
									 +'</p>') : ''
							)
							.append(meta.album != undefined && meta.CONTENT_TYPE != 'Film' && meta.CONTENT_TYPE != 'TV Show' ? $('<li class=table-view-cell>')
								.append('Album')
								.append('<p>'+meta.album+'</p>') : ''
							)
							.append(meta.genre && !meta.CONTENT_TYPE ? $('<li class=table-view-cell>')
								.append('Genre')
								.append('<p>'+meta.genre+'</p>') : ''
							)
							.append(meta.description != undefined ? $('<li class=table-view-cell>')
								.append('Summary')
								.append('<p>'+nl2br(meta.description)+'</p>') : ''
							)
							.append(meta.date != undefined ? $('<li class=table-view-cell>')
								.append('Release Date')
								.append('<p>'+meta.date+'</p>') : ''
							)
							.append(meta.ACTOR != undefined ? $('<li class=table-view-cell>')
								.append('Actors')
								.append('<p>'+meta.ACTOR+'</p>') : ''
							)
							.append(meta.CHARACTER != undefined ? $('<li class=table-view-cell>')
								.append('Characters')
								.append('<p>'+meta.CHARACTER+'</p>') : ''
							)
							.append(meta.GUESTS!= undefined ? $('<li class=table-view-cell>')
								.append('Guests')
								.append('<p>'+meta.GUESTS+'</p>') : ''
							)
							.append(meta.DIRECTOR != undefined ? $('<li class=table-view-cell>')
								.append('Director')
								.append('<p>'+meta.DIRECTOR+'</p>') : ''
							)
							.append(meta.WRITTEN_BY != undefined ? $('<li class=table-view-cell>')
								.append('Written By')
								.append('<p>'+meta.WRITTEN_BY+'</p>') : ''
							)
							.append(meta.RECORDING_LOCATION != undefined ? $('<li class=table-view-cell>')
								.append('Recording Location')
								.append('<p>'+meta.RECORDING_LOCATION+'</p>') : ''
							)

						 );
// 					console.log(that.status.information);
					
					i = 0;
					that.streamModal.find('ul.table-view').empty();
					isThereSubs = false;
					while(c=that.status.information.category['Stream '+i])
					{
// 						console.log(i);
// 						console.log(c);
						if(c.Type == 'Audio')
							that.streamModal.find('ul.table-view')
								.append($('<li class="table-view-cell">')
									.append($('<span class="media-object pull-left icon icon-sound3">'))
									.append('Audio ' + (c.Language || ''))
									.append(c.Channels ? '<p>'+ c.Channels + ' ['+c.Codec +(c.Bitrate ? ' - '+ c.Bitrate : '')+']' +'</p>' : '')
									.append(c.Description ? '<p>'+c.Description+'</p>' : '')
									.append($('<button type="button" data-val="'+i+'" class="btn btn-outlined btn-primary">').append('Select').click(function(){ that.sendCommand({'command':'audio_track','val':$(this).attr('data-val')});that.streamModal.parent().removeClass('active')}))
								 );
						else if(c.Type == 'Subtitle')
						{
							isThereSubs = true;
							that.streamModal.find('ul.table-view')
								.append($('<li class="table-view-cell">')
									.append($('<span class="media-object pull-left icon icon-bars">'))
									.append('Subtitle ' + (c.Language || ''))
									.append(c.Description ? '<p>'+c.Description+'</p>' : '')
									.append($('<button type="button" data-val="'+i+'" class="btn btn-primary btn-outlined">').append('Select').click(function(){ that.sendCommand({'command':'subtitle_track','val':$(this).attr('data-val')});that.streamModal.parent().removeClass('active')}))
								 );
						}
						i++;
					}
					if(isThereSubs)
						that.streamModal.find('ul.table-view')
							.append($('<li class="table-view-cell">')
								.append($('<span class="media-object pull-left icon icon-bars">'))
								.append('Disable Subtitles')
								.append($('<button type="button" data-val="" class="btn btn-negative btn-outlined">').append('Disable')
									.click(function(){ that.sendCommand({'command':'subtitle_track','val':'-1'});that.streamModal.parent().removeClass('active')}))
							 );
						
					that.nSecondary = $('<div>', {'class':'bar bar-standard bar-header-secondary'})
						.append($('<button>', {'type':'button', 'class':'btn pull-left control-item', html: '&laquo;'})
							.click(function(){that.Prev()})
						)
						.append($('<button>', {'type':'button', 'class':'btn pull-right control-item', html: '&raquo;'})
							.click(function(){that.Next()})
						)
						.append($('<div>', {'class':'segmented-control'})
							.append($('<a>', {'class':'control-item', html: 'Info', 'href':'#info'}))
							.append($('<a>', {'class':'control-item', html: 'Playlist', 'href':'#playlist'})
								.on('click touch touchend', function(){
									$.ajax({
										url: server + '/requests/playlist.json',
										success: function(data)
										{
											that.plModal.empty();
											that.buildPlaylist(data);
										},
										dataType:'json'
									})
								})
							)
							.append($('<a>', {'class':'control-item', html: 'Streams', 'href':'#streams'}))
						 )

						.appendTo('body');
					
					that.nSecFooter = $('<div>', {'class':'bar bar-standard bar-footer-secondary', 'css':{'bottom':'50px'}})
						.append(that.durationInfo1 = $('<button>', {'type':'button', 'class':'btn pull-left control-item'})
							.on('click', function(){ that.Seek('-'+backwardDuration+'s') })
						)
						.append(that.durationInfo2 = $('<button>', {'type':'button', 'class':'btn pull-right control-item'})
							.on('click', function(){ that.Seek('+'+forwardDuration+'s') })
						)
							.append(that.durationSlider = 
								$('<input type="range" min="0" max="1" step=".001">')
									.on('mouseup touchend', function(){
										that.Seek(Math.round($(this).val()*that.status.length));
										
									})
									.on('change', function(){
										that.updateDuration($(this).val());
										
									})
							)
// 						.append($('<a>', {'class':'btn pull-left'}).append('Prev'))
// 						.append($('<a>', {'class':'btn pull-right'}).append('Next'))
// 						.append($('<a>', {'class':'btn', text:'Chapters'}))
						.appendTo('body');
					that.refreshDuration();
// 					console.log(meta);
					that.actualImg = meta.filename;
				});
// 			this.albumArt.fadeIn(500, function () {
// 				$(this).removeAttr('height').removeAttr('width')
// 				console.log($(this).text());
// 			});
		}
		else
		{
			if(this.nSecondary)
			{
				this.nSecondary.remove();
				this.nSecFooter.remove();
			}
			this.albumArt.attr('src', 'img/vlc-48.png');
		}
			
		return this;
	},
	
	error: function(msg)
	{
		if(msg == false)
			if(this.errorDiv.find('p').text() != '')
				this.errorDiv.empty()
					.append($('<p>', {text:'Connection to VLC is re-established !'}))
					.append($('<button>', {'class':'btn btn-positive', text:'Successful'}))
					.fadeOut(2000, function(){$(this).empty().fadeIn()});
			else
				this.errorDiv.empty();
		else
			this.errorDiv.empty()
				.append($('<p>', {text:msg}))
				.append($('<button>', {'class':"btn btn-negative", text:'Reconnecting...'}))
				;
		return this;
	}
	
}
function nl2br(str, is_xhtml) {
  //  discuss at: http://phpjs.org/functions/nl2br/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Philip Peterson
  // improved by: Onno Marsman
  // improved by: Atli Þór
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Maximusya
  // bugfixed by: Onno Marsman
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: nl2br('Kevin\nvan\nZonneveld');
  //   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  //   example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
  //   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  //   example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
  //   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

  return (str + '')
    .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
$(document).ready(function(){
	new VLC().updateStatus();
// 	$('#settings').addClass('active');
	$('head').append($('<style type=text/css>').append(
// 		'img.gray{'+
// 			'filter: url("data:image/svg+xml;utf8,<svg%20xmlns=\'http://www.w3.org/2000/svg\'><filter%20id=\'grayscale\'><feColorMatrix%20type=\'matrix\'%20values=\'0.3333%200.3333%200.3333%200%200%200.3333%200.3333%200.3333%200%200%200.3333%200.3333%200.3333%200%200%200%200%200%201%200\'/></filter></svg>#grayscale");'+
// 			'filter: grayscale(100%); /* Current draft standard */'+
// 			'-webkit-filter: grayscale(100%); /* New WebKit */'+
// 			'-moz-filter: grayscale(100%);'+
// 			'-ms-filter: grayscale(100%); '+
// 			'-o-filter: grayscale(100%);'+
// 			'filter: gray; /* IE6+ */'+
// 			'}'+
// 		'.slider .slide-group .slide-text {'+
// 			'position: absolute;'+
// 			'font-weight: bold;'+
// 			'top: 80%;'+
// 			'left: 0;'+
// 			'width: 100%;'+
// 			'font-size: 24px;'+
// 			'color: #fff;'+
// 			'text-align: center;'+
// 			'text-shadow: 0 0 8px #da532c;'+
// 			'}'+
//CSS greatly generated with http://danielstern.ca/range.css/
		'input[type=range] {'+
			'-webkit-appearance: none;'+
// 			'position: absolute;'+
			'position: relative;'+
			'top: 8px;'+
			'left: 0;'+
// 			'top: 86%;'+
// 			'width: 85%;'+
// 			'margin: 4px 1%;'+
			'}'+
		'input[type=range]:focus {'+
			'outline: none;'+
			'}'+
		'input[type=range]::-webkit-slider-runnable-track {'+
			'width: 100%;'+
			'height: 8px;'+
			'cursor: pointer;'+
			'box-shadow: 1px 1px 15px #da532c, 0px 0px 1px #de6542;'+
			'background: rgba(255, 255, 255, 0.96);'+
			'border-radius: 5px;'+
			'border: 0px solid #da532c;'+
			'}'+
		'input[type=range]::-webkit-slider-thumb {'+
			'box-shadow: 1px 1px 1px #da532c, 0px 0px 1px #de6542;'+
			'border: 1px solid #eeeeee;'+
			'height: 16px;'+
			'width: 16px;'+
			'border-radius: 31px;'+
			'background: #ffffff;'+
			'cursor: pointer;'+
			'-webkit-appearance: none;'+
			'margin-top: -4px;'+
			'}'+
		'input[type=range]:focus::-webkit-slider-runnable-track {'+
			'background: rgba(255, 255, 255, 0.96);'+
			'}'+
		'input[type=range]::-moz-range-track {'+
			'width: 100%;'+
			'height: 8px;'+
			'cursor: pointer;'+
			'box-shadow: 1px 1px 15px #da532c, 0px 0px 1px #de6542;'+
			'background: rgba(255, 255, 255, 0.96);'+
			'border-radius: 5px;'+
			'border: 0px solid #da532c;'+
			'}'+
		'input[type=range]::-moz-range-thumb {'+
			'box-shadow: 1px 1px 1px #da532c, 0px 0px 1px #de6542;'+
			'border: 1px solid #eeeeee;'+
			'height: 16px;'+
			'width: 16px;'+
			'border-radius: 31px;'+
			'background: #ffffff;'+
			'cursor: pointer;'+
			'}'+
		'input[type=range]::-ms-track {'+
			'width: 100%;'+
			'height: 8px;'+
			'cursor: pointer;'+
			'background: transparent;'+
			'border-color: transparent;'+
			'color: transparent;'+
			'}'+
		'input[type=range]::-ms-fill-lower {'+
			'background: rgba(240, 240, 240, 0.96);'+
			'border: 0px solid #da532c;'+
			'border-radius: 10px;'+
			'box-shadow: 1px 1px 15px #da532c, 0px 0px 1px #de6542;'+
			'}'+
		'input[type=range]::-ms-fill-upper {'+
			'background: rgba(255, 255, 255, 0.96);'+
			'border: 0px solid #da532c;'+
			'border-radius: 10px;'+
			'box-shadow: 1px 1px 15px #da532c, 0px 0px 1px #de6542;'+
			'}'+
		'input[type=range]::-ms-thumb {'+
			'box-shadow: 1px 1px 1px #da532c, 0px 0px 1px #de6542;'+
			'border: 1px solid #eeeeee;'+
			'height: 16px;'+
			'width: 16px;'+
			'border-radius: 31px;'+
			'background: #ffffff;'+
			'cursor: pointer;'+
			'height: 8px;'+
			'}'+
		'input[type=range]:focus::-ms-fill-lower {'+
			'background: rgba(255, 255, 255, 0.96);'+
			'}'+
		'input[type=range]:focus::-ms-fill-upper {'+
			'background: rgba(255, 255, 255, 0.96);'+
			'}'

		));
});