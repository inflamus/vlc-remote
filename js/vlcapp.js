var VLCRemote = angular.module('VLCRemote', ['ngTouch'])
	.factory('SettingsService', function(){
		var	defaults = {
				server: 'http://'+window.location.hostname+':'+window.location.port,
				browser: '~',
				update: 5,
				maxVol: true,
				chapters: true,
				forward: 15,
				backward: 15
			};
		var set = function(k,v)
			{
				return localStorage.setItem(k, v);
			};
		// Main current settings object
		var settings = {};
		//Populate settings object
		angular.forEach(defaults, function(v, k){
			l = localStorage.getItem(k);
			switch(typeof v)
			{
				case 'boolean':
					if(l=='true') l = true;
					if(l=='false') l = false;
					this[k] = l !== !v;
				break;
				case 'number':
					l = parseInt(l);
				default: case 'String':
					this[k] = l || v;
				break;
			}
		}, settings);
		
		// End, return
		return {
			defaults: defaults,
			save: set,
			set: set,
			settings: settings
		};
	})
	.factory('VLC', ['$http', 'SettingsService', '$timeout', function($http, confs, $timeout){
		var path = confs.settings.server;
		//xhr functions
			req = function(url, com){
// 				var http =
				return $http({
						method: 'GET',
						url: url,
// 						data: com,
						params: com,
// 						responseType: 'json'
					});
// 				return http;
			},
			sendCommand = function(command)
			{
				if(typeof command != 'object')
					command = {'command':command};
				return req(path+'/requests/status.json', command)
					;
			},
			Browse = function(uri)
			{
				return req(path+'/requests/browse.json', {uri: uri})
				;
			},
			Playlist = function(empty)
			{
				if(typeof empty=='object')
					data = empty;
				else
					data = empty ? {'command':'pl_empty'} : {};
				return req(path+'/requests/playlist.json', data)
				;
			};

		return {
			sendCommand: sendCommand,
			Browse: Browse,
			Playlist: Playlist
		};
	}])
	
	.filter('seconds', [function() {
		return function(seconds) {
			return new Date(1970, 0, 1).setSeconds(seconds);
		};
	}])

	.run(['VLC', function(VLC) {}])
	
	.controller('Settings', ['$scope', 'SettingsService', function($scope, settings){
	// Get settings generated from service;
		$scope.settings = settings.settings;
		this.defaults = settings.defaults;
		this.save = function(k, v)
		{
			// may do other things here
			settings.save(k, v);
		};
		this.toggle = function(element, v)
		{
			$scope.settings[v] = !$scope.settings[v];
			this.save(v, $scope.settings[v]);
		};
	}])
	.controller('Playlist', ['$scope', 'VLC', function($scope, VLC){
		this.load = function(empty){
			return $scope.loadPlaylist(empty);
		};
// 		this.load();
		this.Add = function(){
			reloadPlaylist = 1;
		};
		this.Play = function(id){
			$scope.sendCommand({'command':'pl_play', 'id':id});
			this.load();
			return true;
		};
		this.Clear = function(){
			if($scope.status.state && $scope.status.state != 'stopped')
				if(!confirm('Something is currently playing and will be stopped. Would you continue ?'))
					return;
			this.load(true);
		};
	}])
	.controller('Browse', ['$scope', 'VLC', 'SettingsService', function($scope, VLC, confs){
		
		this.load = function(dir) {
			VLC.Browse(dir).then(function(r){
				$scope.browse = r.data;
			});
		};
		this.load('file://'+confs.settings.browser);
		this.Play = function(uri){
			if(this.Ext(uri)=='s')
				return $scope.sendCommand({'command':'addsubtitle','val':uri});
			$scope.sendCommand({'command':'in_play', 'input':uri});
			if(reloadPlaylist--)
				$scope.loadPlaylist();
		};
		this.Queue = function(uri){
			if(reloadPlaylist--)
				$scope.loadPlaylist({'command':'in_enqueue', 'input':uri});
			else
				$scope.sendCommand({'command':'in_enqueue', 'input':uri});
		};
		this.Ext = function(filename){
			ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
			if(video_types.indexOf(ext) > -1)
				return 'v';
			if(audio_types.indexOf(ext) > -1)
				return 'a';
			if(playlist_types.indexOf(ext) > -1)
				return 'p';
			if(subtitle_types.indexOf(ext) > -1)
				return 's';
			//else
			return false;
		};
	}])
	.controller('Status', ['$scope', 'VLC', 'SettingsService', '$filter', '$interval', function($scope, VLC, confs, $filter, $interval){
		that = this;
		// Populate the scope
		$scope.status = {};
		$scope.confs = confs.settings;
		$scope.sendCommand = function(c){
			VLC.sendCommand(c).then(function(r){
				$scope.status = r.data;
			});
		};
		$scope.sendCommand({});
		this.updateInterval = $interval($scope.sendCommand, confs.settings.update*1000, 0, true, {});
// 		$scope.data = VLC.data;
// 		this.data = VLC.data;
		$scope.closeModal = function(id)
		{
			document.getElementById(id).classList.remove('active');
		};
		//TODO : then error => handle ajax error
		this.toggleFullscreen = function(){
			$scope.sendCommand('fullscreen');
		};
		this.Stop = function(){
			$scope.sendCommand('pl_stop');
		};
		this.PlayPause = function(){
			$scope.sendCommand($scope.status.state=='playing'?'pl_pause':'pl_play');
		};
		// Volume handler
		this.volIcon = function(k){
			switch(Math.floor($scope.status.volume/2.56/25))
			{
				default:
				case 0:
					return k ? 'icon-sound3' : 'icon-sound4';
					break;
				case 1:
				case 2:
					return k ? 'icon-sound2' : 'icon-sound3';
					break;			
				case 3:
				case 4:	case 5: case 6: case 7: case 8:
					return k ? 'icon-sound' : 'icon-sound2';
					break;
			}
		}
		this.Vol = function(vol){
			// Handle max volume = 100%
			if(	($scope.status.volume >= 256 || $scope.status.volume > 230)
					&& vol 
					&& $scope.confs.maxVol)
				return $scope.sendCommand({'command':'volume', 'val':256}); // max : 256/512 = 100%
			if($scope.status.volume <= 26 && !vol)
				return $scope.sendCommand({'command':'volume', 'val':0}); // min : 0;
			return $scope.sendCommand(
				{'command':'volume', 
				'val': vol 
						? $scope.status.volume + 26 
						: $scope.status.volume -26 
				});
		};
		
		//Slider and duration infos
			// bind width  of input range with window size
		this.sliderSize = function(){
			w = window.innerWidth 
				- 46 
				- document.querySelector('.bar-footer-secondary .btn.control-item.pull-left').clientWidth
				- document.querySelector('.bar-footer-secondary .btn.control-item.pull-right').clientWidth;
			angular.element(document.querySelector('.bar-footer-secondary input[type=range]')).css('width', w+'px');
		};
		angular.element(window).on('resize', function(){
			that.sliderSize();
		});
		angular.element(document).ready(function(){
			that.sliderSize();
		});
		var pos = function()
		{
			this.timeout = null;
			this.__defineGetter__('pos', function(){
				return $scope.status.position;
			});
			this.__defineSetter__('pos', function(v){
				//bind var
				$scope.status.position = parseFloat(v);
				// Setting a timeout in order to send only one ajax request when range seeking is done
				if(this.timeout)	clearTimeout(this.timeout);
								  t = this;
				this.timeout = setTimeout(function(){
					that.Seek(t.val);
				}, 100);
			});
			this.__defineGetter__('val', function(){
				return Math.round(this.pos * this.len);
			});
			this.__defineSetter__('val', function(){});
			this.__defineGetter__('len', function(){
				return $scope.status.length;
			});
			this.__defineSetter__('len', function(){});
		};
		this.pos = new pos();
		this.Seek = function(s){
			if(s===true)	s = '+'+confs.settings.forward+'s';
			if(s===false)	s = '-'+confs.settings.backward+'s';
			if(typeof s == 'undefined') return false;
			$scope.sendCommand({'command':'seek', 'val':s});
		};
		
		//Chapters seeker
		this.Chapter = function(t){
			chaps = $scope.status.information.chapters;
			currchap = $scope.status.information.chapter;
			if(chaps.length > 1 && confs.settings.chapters)
			{
				if(t)
				{ // next chapter
					if(currchap < chaps.length)
						return $scope.sendCommand({'command':'chapter', 'val':currchap+1});
				}
				else
					if(currchap > 0)
						return $scope.sendCommand({'command':'chapter', 'val':currchap-1});
			}
			return this.Swipe(t);
		};
		this.Swipe = function(t){
			return $scope.sendCommand(t ? 'pl_next' : 'pl_previous');
		};
		
		//Information modal
		this.info = {
			keys: {
// 				'DATE_TAGGED': 	'Tagged',
				'CONTENT_TYPE':	'Type',
// 				'ENCODER':		'Encoder',
// 				'LANGUAGE':		'Language',
				'title':		'Title',
// 				'ORIGINAL_TITLE':'Original Title',
				'artist':		'Artist',
				'album':		'Album',
				'genre':		'Genre',
				'description':	'Summary',
				'date':			'Release Date',
				'ACTOR':		'Actors',
				'CHARACTER':	'Characters',
				'GUESTS':		'Guests',
				'DIRECTOR':		'Director',
				'PRODUCER':		'Producer',
				'WRITTEN_BY':	'Written by',
				'EXECUTIVE_PRODUCER':'Executive Producer(s)',
				'DIRECTOR_OF_PHOTOGRAPHY':'Director of Photography',
				'SOUND_ENGINEER':'Sound Engineers',
				'PRODUCTION_DESIGNER':'Production Designer',
				'PRODUCTION_STUDIO':'Production Studio',
				'RECORDING_LOCATION':'Recording Location',
// 				'SUMMARY':		'Summary',
// 				'SYNOPSIS':		'Synopsis',
			},
			buildArr: function()
			{
				arr = $scope.status;
				if(!arr.information) return false;
				arr = arr.information.category.meta;
				var ret = [];
				angular.forEach(this.keys, function(inti, key){
					if(!arr[key])	return;
					if(key=='CONTENT_TYPE')
						if(arr['genre'])
							return ret.push({
								'key':arr[key],
								'val':arr['genre']
							});
					if(key=='album' && (arr['CONTENT_TYPE']=='TV Show' || arr['CONTENT_TYPE']=='Film'))	return;
					if(key=='title')
						if(arr['track_number'])
							if(arr['track_total'])
								return ret.push({
									'key':inti,
									'val':'['+arr['track_number']+'/'+arr['track_total']+'] '+arr[key]
								});
							else
								return ret.push({
									'key':inti,
									'val':arr['track_number']+'. '+arr[key]
								});
					if(key=='date')
						return ret.push({
							'key':inti,
							'val':$filter('date')(arr[key], 'longDate'),
						});
					return ret.push({
						'key':inti,
						'val':arr[key]
					});
				});
				this.infos = ret;
				return ret;
			},
			infos: []
		};
		//Watcher for Info and Streams
		$scope.$watch('status', function(newval, oldval){
			if(newval.information && oldval.information)
				if(newval.information.category.meta.filename == 	oldval.information.category.meta.filename)
					return;
			that.info.buildArr();
			that.streams.buildArr();
		});
		this.streams = {
			buildArr: function(){
// 				console.log('Buildstreams fired');
				arr = $scope.status;
				if(!arr.information) return false;
				arr = arr.information.category;
				i =0;
				subs = false;
				this.streams=[];
				while(c=arr['Stream '+i])
				{
					if(c.Type=='Subtitle')
						subs = true;
					this.streams[i++] = c;
				}
			},
			streams: [],
			select: function(id)
			{
				$scope.sendCommand({'command':'subtitle_track','val':id});
				$scope.closeModal('streams');
			}
		};
		
		// Playlist 
		$scope.loadPlaylist = function(empty){
			VLC.Playlist(empty).then(function(r){
				$scope.playlist = r.data.children;
			});
		};
// 		this.loadPlaylist = function(){console.log('fired');$scope.loadPlaylist()};
		
	}])
	
	.directive('fallbackSrc', function () {
		var fallbackSrc = {
			link: function postLink(scope, iElement, iAttrs) {
				iElement.bind('error', function() {
					angular.element(this).attr("src", iAttrs.fallbackSrc);
				});
			}
		}
		return fallbackSrc;
	})
;

var reloadPlaylist = 0;
//Consts
var	
	video_types = ["asf", "avi", "divx", "drc", "dv", "f4v", "flv", "gxf", "iso", "m1v", "m2v", "m2t", "m2ts", "m4v", "mkv", "mov", "mp2", "mp4", "mpeg", "mpeg1", "mpeg2", "mpeg4", "mpg", "mts", "mtv", "mxf", "mxg", "nuv", "ogg", "ogm", "ogv", "ogx", "ps", "rec", "rm", "rmvb", "ts", "vob", "wmv", "xesc"],
	audio_types = ["3ga", "a52", "aac", "ac3", "ape", "awb", "dts", "flac", "it", "m4a", "m4p", "mka", "mlp", "mod", "mp1", "mp2", "mp3", "oga", "ogg", "oma", "s3m", "spx", "thd", "tta", "wav", "wma", "wv", "xm"],
	playlist_types = ["asx", "b4s", "cue", "ifo", "m3u", "m3u8", "pls", "ram", "rar", "sdp", "vlc", "xspf"],
	subtitle_types = ['srt', 'idx', 'ass', 'ssa', 'sup'];