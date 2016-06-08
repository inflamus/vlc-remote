// VLCapp Angular Module
// requires angular > 1.4.x
// @romein
// https://github.com/inflamus/vlc-remote
// LGPL

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name vlcapp.min.js
// @externs_url https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.js
// @externs_url https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.6.1/angular-translate.js
// @externs_url https://cdnjs.cloudflare.com/ajax/libs/angular-translate-loader-static-files/2.6.1/angular-translate-loader-static-files.js
// ==/ClosureCompiler==


(function(angular){
'use strict';
var VLCRemote = angular.module('VLCRemote', ['ngTouch', 'pascalprecht.translate'])
	// DEBUG disabled == improve performances.
	.config(['$compileProvider', function ($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
	}])
	
	// Multi-Language support
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}])
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider
			.useStaticFilesLoader({
				'prefix': 'js/locales/',
				'suffix': '.json'
			})
			.registerAvailableLanguageKeys(['af', 'am', 'ar', 'as', 'az', 'ba', 'be', 'bg', 'bn', 'bo', 'br', 'bs', 'ca', 'co', 'cs', 'cy', 'da', 'de', 'ds', 'dv', 'el', 'en', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gs', 'gu', 'ha', 'he', 'hi', 'hr', 'hs', 'hu', 'hy', 'id', 'ig', 'ii', 'is', 'it', 'iu', 'ja', 'ka', 'kk', 'kl', 'km', 'kn', 'ko', 'ky', 'lb', 'lo', 'lt', 'lv', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'nb', 'ne', 'nl', 'nn', 'ns', 'oc', 'or', 'pa', 'pl', 'pr', 'ps', 'pt', 'qu', 'rm', 'ro', 'ru', 'rw', 'sa', 'se', 'si', 'sk', 'sl', 'sm', 'sq', 'sr', 'sv', 'sw', 'sy', 'ta', 'te', 'tg', 'th', 'tk', 'tn', 'tr', 'tt', 'tz', 'ug', 'uk', 'ur', 'uz', 'vi', 'wo', 'xh', 'yo', 'zh', 'zu'], {
				'af_*': 'af',
				'am_*': 'am',
				'ar_*': 'ar',
				'as_*': 'as',
				'az_*': 'az',
				'ba_*': 'ba',
				'be_*': 'be',
				'bg_*': 'bg',
				'bn_*': 'bn',
				'bo_*': 'bo',
				'br_*': 'br',
				'bs_*': 'bs',
				'ca_*': 'ca',
				'co_*': 'co',
				'cs_*': 'cs',
				'cy_*': 'cy',
				'da_*': 'da',
				'de_*': 'de',
				'ds_*': 'ds',
				'dv_*': 'dv',
				'el_*': 'el',
				'en_*': 'en',
				'es_*': 'es',
				'et_*': 'et',
				'eu_*': 'eu',
				'fa_*': 'fa',
				'fi_*': 'fi',
				'fo_*': 'fo',
				'fr_*': 'fr',
				'fy_*': 'fy',
				'ga_*': 'ga',
				'gd_*': 'gd',
				'gl_*': 'gl',
				'gs_*': 'gs',
				'gu_*': 'gu',
				'ha_*': 'ha',
				'he_*': 'he',
				'hi_*': 'hi',
				'hr_*': 'hr',
				'hs_*': 'hs',
				'hu_*': 'hu',
				'hy_*': 'hy',
				'id_*': 'id',
				'ig_*': 'ig',
				'ii_*': 'ii',
				'is_*': 'is',
				'it_*': 'it',
				'iu_*': 'iu',
				'ja_*': 'ja',
				'ka_*': 'ka',
				'kk_*': 'kk',
				'kl_*': 'kl',
				'km_*': 'km',
				'kn_*': 'kn',
				'ko_*': 'ko',
				'ky_*': 'ky',
				'lb_*': 'lb',
				'lo_*': 'lo',
				'lt_*': 'lt',
				'lv_*': 'lv',
				'mi_*': 'mi',
				'mk_*': 'mk',
				'ml_*': 'ml',
				'mn_*': 'mn',
				'mo_*': 'mo',
				'mr_*': 'mr',
				'ms_*': 'ms',
				'mt_*': 'mt',
				'nb_*': 'nb',
				'ne_*': 'ne',
				'nl_*': 'nl',
				'nn_*': 'nn',
				'ns_*': 'ns',
				'oc_*': 'oc',
				'or_*': 'or',
				'pa_*': 'pa',
				'pl_*': 'pl',
				'pr_*': 'pr',
				'ps_*': 'ps',
				'pt_*': 'pt',
				'qu_*': 'qu',
				'rm_*': 'rm',
				'ro_*': 'ro',
				'ru_*': 'ru',
				'rw_*': 'rw',
				'sa_*': 'sa',
				'se_*': 'se',
				'si_*': 'si',
				'sk_*': 'sk',
				'sl_*': 'sl',
				'sm_*': 'sm',
				'sq_*': 'sq',
				'sr_*': 'sr',
				'sv_*': 'sv',
				'sw_*': 'sw',
				'sy_*': 'sy',
				'ta_*': 'ta',
				'te_*': 'te',
				'tg_*': 'tg',
				'th_*': 'th',
				'tk_*': 'tk',
				'tn_*': 'tn',
				'tr_*': 'tr',
				'tt_*': 'tt',
				'tz_*': 'tz',
				'ug_*': 'ug',
				'uk_*': 'uk',
				'ur_*': 'ur',
				'uz_*': 'uz',
				'vi_*': 'vi',
				'wo_*': 'wo',
				'xh_*': 'xh',
				'yo_*': 'yo',
				'zh_*': 'zh',
				'zu_*': 'zu'
			})
			.determinePreferredLanguage()
			.fallbackLanguage('en')
		;
	}])
	
	.factory('SettingsService', ['$location', function($location){
		var	defaults = {
				server: 'http://'+$location.host()+':'+$location.port(),
				browser: '~',
				dirFirst: false,
				browseOrder: '+name',
				update: 8,
				maxVol: true,
				chapters: true,
				forward: 15,
				backward: 15,
				audelay: 0.1,
				subdelay: 0.1,
			};
		// Main current settings object
		var settings = {};
		//Populate settings object
		angular.forEach(defaults, function(v, k){
			this.__defineGetter__(k, function()
			{
				var l = localStorage.getItem(k);
				if(l === null)	return v;
				switch(typeof v)
				{
					case 'boolean':
						if(l=='true') l = true;
						if(l=='false') l = false;
						return l;
					break;
					case 'number':
						var r = parseFloat(l);
						if(r%1===0 && r < 1) return v; // equivalent to isInt()
						else if(r<0) return v;
						return r;
					break;
					default: case 'string':
						return l || v;
					break;
				}
			});
			this.__defineSetter__(k, function(value)
			{
				localStorage.setItem(k, value);
			});
		}, settings);
		
		// End, return
		return {
			defaults: defaults,
			settings: settings
		};
	}])
	.factory('VLC', ['$http', 'SettingsService', '$timeout', function($http, confs, $timeout){
		var path = confs.settings.server;
		//xhr functions
			var req = function(url, com){
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
				return req(
					path+'/requests/playlist.json', 
					typeof empty == 'object' ? 
							empty : 
							(empty ? 
								{'command':'pl_empty'} :
								{}
							)
					);
			};

		return {
			sendCommand: sendCommand,
			Browse: Browse,
			Playlist: Playlist
		};
	}])
	
	.filter('seconds', function() {
		return function(seconds) {
			return new Date(1970, 0, 1).setSeconds(seconds);
		};
	})
	.filter('bytes', function() {
		return function(bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
		}
	})

	.run(['VLC', function(VLC) {}])
	
	.controller('Settings', ['$scope', 'SettingsService', '$window', function($scope, settings, $window){
	// Get settings generated from service;
		$scope.settings = settings.settings;
		this.defaults = settings.defaults;
	// Binding toggles	
		var toggles = $window.document.querySelector('div#settings').getElementsByClassName('toggle');
		for(var i=0; i<toggles.length; i++)
			toggles[i].addEventListener('toggle', function(e){
				var el = angular.element(e.target);
				$scope.settings[el.attr('id')] = el.hasClass('active');
			});
		this.browseOrderOpts = [
			{id:'+name', value:'+NAME'},
			{id:'-name', value:'-NAME'},
			{id:'+modification_time', value:'+MODIFICATION_TIME'},
			{id:'-modification_time', value:'-MODIFICATION_TIME'},
			{id:'+creation_time', value:'+CREATION_TIME'},
			{id:'-creation_time', value:'-CREATION_TIME'},
			{id:'+access_time', value:'+ACCESS_TIME'},
			{id:'-access_time', value:'-ACCESS_TIME'}
		];
	}])
	.controller('Playlist', ['$scope', 'VLC', function($scope, VLC){
		this.load = function(empty){
			return $scope.loadPlaylist(empty);
		};
		this.Add = function(){
			reloadPlaylist = 1;
		};
		this.Play = function(id,reload){
			if(reload)
				angular.forEach(reload, function(v,k){
					reload[k].current = v.id==id ? true : false;
				});
			$scope.sendCommand({'command':'pl_play', 'id':id});
// 			this.load();
			return true;
		};
		this.Clear = function(){
			if($scope.status.state && $scope.status.state != 'stopped')
				if(!confirm('Something is currently playing and will be stopped. Would you continue ?'))
					return;
			this.load(true);
		};
		this.Delete = function(id){
			this.load({'command':'pl_delete', 'id':id});
		};
		this.Pl = function(l){
			$scope.sendCommand('pl_'+l);
		};
	// PL_sort is not working on requests/*.json
		
	}])
	.controller('Browse', ['$scope', 'VLC', 'SettingsService', '$window', function($scope, VLC, confs, $window){
		this.load = function(dir) {
			VLC.Browse(dir).then(function(r){
				$scope.browse = r.data;
			});
		};
		$scope.ordering = function(e){return e.name=='..' ? 0 : 1;};
		$scope.nullOrd = function(){return 1;};
		this.load('file://'+$window.encodeURIComponent(confs.settings.browser));
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
			var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
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
		this.searchClick = function(){
			if(this.search != '')
				this.search = '';
		};
		this.isMRL = function(){
			return /:\/\//.test(this.search);
		};
		this.setDefault = function(path){
// 			dir = dir.replace(/file:\/\//, '');
			if(confirm("Would you like to make this directory the default one ?\n\n"+path))
				confs.settings.browser = path;
		};
	}])
	.controller('Status', ['$scope', 'VLC', 'SettingsService', '$filter', '$interval', '$location', '$window', function($scope, VLC, confs, $filter, $interval, $location, $window){
		var that = this;
		// Populate the scope
		$scope.status = {};
		$scope.error = false;
		$scope.confs = confs.settings;
		$scope.sendCommand = function(c){
			VLC.sendCommand(c).then(function(r){
				$scope.status = r.data;
				$scope.error = false;
			}, function(r){
				$scope.error = r;
			});
		};
		$scope.sendCommand({});
		
		//Updating interval : paused when switching tab, resumed when focused.
		$scope.focused = true; // put a grayscale layer if not focused, and so not updating.
		var uInterval;
		var buildInterval = function(){
			if(angular.isDefined(uInterval))	return false;
			uInterval = $interval($scope.sendCommand, confs.settings.update*1000, 0, true, {});
		};
		$window.addEventListener('blur', function(){
			$interval.cancel(uInterval);
			uInterval = undefined;
			$scope.focused = false;
		});
		$window.addEventListener('focus', function(){
			$scope.sendCommand({});
			buildInterval();
			$scope.focused = true;
		});
		buildInterval(); // Lauch interval
		
		//Modals handling
		$scope.closeModal = function(id)
		{
			$window.document.getElementById(id).classList.remove('active');
		};
		
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
		//Slider
		var pos = function()
		{
			this.timeout = null;
			this.pos = function(v){
				if(arguments.length){
					$scope.status.position = parseFloat(v);
					that.Seek(this.val);
				}
				return $scope.status.position;
			};
			this.__defineGetter__('val', function(){
				return Math.round(this.pos() * this.len);
			});
// 			this.__defineSetter__('val', function(v){});
			this.__defineGetter__('len', function(){
				return $scope.status.length;
			});
// 			this.__defineSetter__('len', function(v){});
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
			var chaps = $scope.status.information.chapters;
			var currchap = $scope.status.information.chapter;
			if(chaps.length > 1 && confs.settings.chapters)
			{
				if(t)
				{ // next chapter
					if(currchap < chaps.length)
						return $scope.sendCommand({'command':'chapter', 'val':currchap+1});
				}
				else
				{
					if(currchap > 0)
						return $scope.sendCommand({'command':'chapter', 'val':currchap-1});
				}
			}
			if(this.pos.val > confs.settings.update && t == false)
				return this.Seek(0); // double click pour swipe précédent dans la playlist
			return this.Swipe(t);
		};
		this.Swipe = function(t){
			return $scope.sendCommand(t ? 'pl_next' : 'pl_previous');
		};
		
		//Information modal
		this.info = {
// 			keys: {
// // 				'DATE_TAGGED': 			'Tagged',
// 				'CONTENT_TYPE':			'INFO.M.Type',
// // 				'ENCODER':				'Encoder',
// // 				'LANGUAGE':				'Language',
// 				'title':				'INFO.M.Title',
// // 				'ORIGINAL_TITLE':		'Original Title',
// 				'artist':				'INFO.M.Artist',
// 				'album':				'INFO.M.Album',
// 				'genre':				'INFO.M.Genre',
// 				'description':			'INFO.M.Synopsis',
// 				'SEASON_SYNOPSIS':		'INFO.M.Season_Plot',
// 				'SUMMARY':				'INFO.M.Show_Plot', // only for TV Shows
// 				'date':					'Release Date',
// 				'ACTOR':				'Actors',
// 				'CHARACTER':			'Characters',
// 				'GUESTS':				'Guests',
// 				'DIRECTOR':				'Director',
// 				'PRODUCER':				'Producer',
// 				'WRITTEN_BY':			'Written by',
// 				'EXECUTIVE_PRODUCER':	'Executive Producer(s)',
// 				'DIRECTOR_OF_PHOTOGRAPHY':'Director of Photography',
// 				'SOUND_ENGINEER':		'Sound Engineers',
// 				'PRODUCTION_DESIGNER':	'Production Designer',
// 				'PRODUCTION_STUDIO':	'Production Studio',
// 				'RECORDING_LOCATION':	'Recording Location',
// 			},
			keys:['CONTENT_TYPE','title','artist','album','genre','description','SEASON_SYNOPSIS','SUMMARY','date','ACTOR','CHARACTER','GUESTS','DIRECTOR','PRODUCER','WRITTEN_BY','EXECUTIVE_PRODUCER','DIRECTOR_OF_PHOTOGRAPHY','SOUND_ENGINEER','PRODUCTION_DESIGNER','PRODUCTION_STUDIO','RECORDING_LOCATION'],
			buildArr: function()
			{
				var arr = $scope.status;
				if(!arr.information) return false;
				arr = arr.information.category.meta;
				var ret = [];
				angular.forEach(this.keys, function(key, id){
					if(!arr[key])	return;
					if(key=='CONTENT_TYPE')
						if(arr['genre'])
							return ret.push({
								'key':arr[key], // Film
								'val':arr['genre']
							});
					if(key=='album' && (arr['CONTENT_TYPE']=='TV Show' || arr['CONTENT_TYPE']=='Film'))	return;
					if(key=='SUMMARY' && arr['CONTENT_TYPE']=='Film')	return;
					if(key=='title')
						if(arr['track_number'])
							if(arr['track_total'])
								return ret.push({
									'key':key,
									'val':'['+arr['track_number']+'/'+arr['track_total']+'] '+arr[key]
								});
							else
								return ret.push({
									'key':key,
									'val':arr['track_number']+'. '+arr[key]
								});
					if(key=='date')
						return ret.push({
							'key':key,
							'val':$filter('date')(arr[key], 'longDate'),
						});
					return ret.push({
						'key':key,
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
				var arr = $scope.status;
				if(!arr.information) { return false };
				arr = arr.information.category;
				this.streams = [];
				
				//TODO : Add translations:
				// for every line, the first value is the reference. add next to it some of the locale-keys of status.information{...} object
				// Done : enUS, frFR, esES, itIT, portuguese, deDE, polish
				this.keyTranslations = [
					['T', 'Type', 'Type_', 'Typ', 'Tipo'],
					['C', 'Codec', 'Codec_', 'Códec', 'Codifica', 'Kodek'],
					['L', 'Language', 'Langue_', 'Sprache', 'Idioma', 'Lingua', 'Taal', 'Linguagem', 'Wybór_języka'],
					['Ch', 'Channels', 'Canaux_', 'Canales', 'Kanäle', 'Canali', 'Kanalen', 'Canais', 'Kanały'],
					['B', 'Bitrate', 'Tasa_de_bits', 'Przepływność'],
				];
				this.TypeTranslations = [
					['V', 'Video', 'Vidéo', 'Vídeo', 'Obraz'],
					['A', 'Audio', 'Audio', 'Áudio', 'Dźwięk'],
					['S', 'Subtitle', 'Sous-titres', 'Subtítulo', 'Untertitel', 'Sottotitolo', 'Ondertitel', 'Legenda', 'Napisy'],
				];
				this.findTranslation = function(d){
					var keys = this.keyTranslations;
					var Types = this.TypeTranslations;
					angular.forEach(d, function(val, key){
						for(var i=0; i<keys.length; i++){
							if(keys[i].indexOf(key) == -1)
								continue;// abort if the key exists as it
							if(keys[i][0]=='T')
								for(var j=0; j<Types.length; j++){
									if(Types[j].indexOf(val)!=-1){
										d['TT'] = val; // Store the real value to TT
										val = Types[j][0];
									}
								}
							d[keys[i][0]] = val;
						}
					}, this);
					return d;
				};
				angular.forEach(arr, function(v, k)
				{
					var match = k.match(/[0-9]+$/);
					if(match != null){
						this.streams[match[0]] = this.findTranslation(v);

					}
					return true;
				}, this);
			},
			streams: [],
			select: function(id)
			{
				$scope.sendCommand({
					'command':id == -1 || this.streams[id].T=='S' ? 
						'subtitle_track' : 
						'audio_track',
					'val':id});
			}
		};
		
		// Synchro
		this.Rate = function(v){
			var val = Math.round(($scope.status.rate*100 + v*100))/100;
			if(val<.25 || val > 10)
				return false;
			$scope.sendCommand({
				'command':'rate',
				'val':val
			});
		};
		this.Delay = function(s, t){
			var val = t=='a' ? $scope.status.audiodelay : $scope.status.subtitledelay;
			var del = t=='a' ? confs.settings.audelay : confs.settings.subdelay;
			$scope.sendCommand({
				'command': t=='a' ? 'audiodelay' : 'subdelay',
				'val': Math.round((val += s ? del : del*-1)*1000)/1000
			});
		};
		
		//EQ
		var EQ = function() {
			angular.element($window.document.getElementById('enableEq')).on('toggle', function(event){
				$scope.sendCommand({
					'command': 'enableeq', 
					'val': angular.element(this).hasClass('active') ? 1 : 0
				});
			});
			
			var thatEQ = this;
			this.enabled = function(p){
				if(!angular.isUndefined($scope.status.equalizer) && angular.isArray($scope.status.equalizer))
					return false;
				if(typeof $scope.status.equalizer == 'object' && typeof p != 'undefined')
					return $scope.status.equalizer.hasOwnProperty(p);
				return true;
			}
			
			//common setter to server
			this.timeout = null;
			this.setter = function(key, val)
			{
				$scope.sendCommand(typeof key=='object' ? key : {'command':key, 'val':val});
			}
			
			//preamp
			this.__defineGetter__('preamp', function(){
				if(!$scope.status.equalizer) 
					return false;
				return this.enabled() ? $scope.status.equalizer.preamp : 0;
			});
			this.__defineSetter__('preamp', function(v){
				if(!this.enabled())	
					return false;
				$scope.status.equalizer.preamp = parseFloat(v);
				this.setter('preamp', this.preamp);
			});
			
			//presets
			this.prsts = [];
			this.__defineGetter__('presets', function(){
				if(!$scope.status.equalizer || !this.enabled())
					return false;
				if(this.prsts.length<1 && $scope.status.equalizer.presets)
					angular.forEach($scope.status.equalizer.presets, function(v, k){
						if(/[0-9]+/.test(k))
							this.prsts.push({
								'id':k.match(/[0-9]+/)[0],
								'val':v
							});
					}, this);				
				return this.prsts;
			});
			this.__defineSetter__('presets', function(v){
				this.setter('setpreset', v);
			});
			
			//bands
			this._b = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz', '14kHz', '16kHz'];
			this.bands = [];
			angular.forEach(this._b, function(fq, i){
				this.bands.push({
					'id': i,
					'fq': fq,
					'val': function(v){
						if(!$scope.status.equalizer || !thatEQ.enabled())
							return 0;
						if(arguments.length)
							thatEQ.setter({'command':'equalizer', 'band':i, 'val':v});
						
						return arguments.length ? ($scope.status.equalizer.bands['band id="'+i+'"']=v) : $scope.status.equalizer.bands['band id="'+i+'"'];
					}
				});
			}, this);
		};
		this.EQ = new EQ();
		
		
		// Playlist 
		$scope.loadPlaylist = function(empty){
			VLC.Playlist(empty).then(function(r){
				$scope.playlist = r.data.children;
			});
		};
		
	}])
	
	.directive('resize', ['$window', function($window){
		// Resizing slider element on each
		return function(scope, element, attr) {
			var l = $window.document.querySelector('.bar-footer-secondary .btn.control-item.pull-left');
			var r = $window.document.querySelector('.bar-footer-secondary .btn.control-item.pull-right');
			scope.$watch(function(){
				return {
					w: $window.innerWidth,
					l: l.clientWidth,
					r: r.clientWidth
				}
			}, function(newV, oldV){
				scope.sliderSize = function(){
					return {
						'width': (newV.w - 46 - newV.r - newV.l) +'px'
					}
				};
			}, true);
			angular.element($window).on('resize', function(){scope.$apply();});
			angular.element($window.document).ready(function(){scope.$apply();});
		}
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
	video_types = ["asf", "avi", "divx", "drc", "dv", "f4v", "flv", "gxf", "iso", "m1v", "m2v", "m2t", "m2ts", "m4v", "mkv", "mov", "mp2", "mp4", "mpeg", "mpeg1", "mpeg2", "mpeg4", "mpg", "mts", "mtv", "mxf", "mxg", "nuv", "ogg", "ogm", "ogv", "ogx", "ps", "rec", "rm", "rmvb", "ts", "vob", "wmv", "xesc", "webm"],
	audio_types = ["3ga", "a52", "aac", "ac3", "ape", "awb", "dts", "flac", "it", "m4a", "m4p", "mka", "mlp", "mod", "mp1", "mp2", "mp3", "oga", "ogg", "oma", "s3m", "spx", "thd", "tta", "wav", "wma", "wv", "xm"],
	playlist_types = ["asx", "b4s", "cue", "ifo", "m3u", "m3u8", "pls", "ram", "sdp", "vlc", "xspf"],
	subtitle_types = ['srt', 'idx', 'ass', 'ssa', 'sup'];
})(angular);
