/**
@name preload
@summary delay story start until after files have loaded
@license MIT
@author Elliot Herriman
@description
Waits until everything's downloaded before kicking off the story. Comes with a loading bar. Extremely helpful for stories that use images and audio.

**/

var credits = {
	emoji: "📑",
	name: "Preload files",
	author: "Elliot Herriman",
	version: "2.0",
	description: "Waits until everything's downloaded before starting the game. Includes a little loading bar.",
	licences: {
		self: "2021",
		mit: {
			"preload-it" : "2017 [these people](https://github.com/rollup/rollup-starter-lib/graphs/contributors"
		}}
	};

var options = {
	preload_tags: { 
			"image": ["image", "background"], 
			"audio": [],
			// bind in the form of {tag: tag, pattern: regex}
			"other": [],
			},
	preload_extrafiles: [],
	preload_widthtransitionspeed: 750,
	preload_opacitytransitionspeed: 500,
	preload_opacitytransitiondelay: 250,
	preload_timeout: 1000,
};

function loadingbar(story)
{
	var container;
	var bar;
	var timeout;
	var showing;

	container = document.createElement("span");
	container.classList.add("progresscontainer");
	
	bar = document.createElement("div");
	bar.classList.add("progressbar");
	bar.style.width = "0%";
	bar.style.transition = "width " + story.options.preload_widthtransitionspeed + "ms linear, opacity " + story.options.preload_opacitytransitionspeed + "ms ease-out "  + story.options.preload_opacitytransitiondelay + "ms";
	
	container.appendChild(bar);

	var progress = "0%";
	story.outerdiv.appendChild(container);

	timeout = setTimeout(function() 
	{
		showing = true;
		bar.style.width = progress;
	}, story.options.preload_timeout);

	return {
		progress: function(value)
		{
			progress = (value || "0") + "%";
			if (showing) bar.style.width = progress;
		},
		done: function(callback)
		{
			clearTimeout(timeout);

			if (!showing) return callback();

			transition(bar, "width", "100%", story.options.preload_widthtransitionspeed, "0ms").then(() => 
			{ 
				transition(bar, "opacity", "0", story.options.preload_opacitytransitionspeed, story.options.preload_opacitytransitiondelay).then(() => 
				{
						container.remove();
						callback(); 
				});
			});
		}
	}
}

Patches.add(function(content)
{
	var loader = preload();
			
	if (!Object.keys(this.options.preload_tags).length && !this.options.preload_extrafiles.length) 
	{
		return;
	}
	
	// i mean, if it's blank, then we don't need to make a new one
	// and if not, then... perfect, we just add more to it
	var files = this.options.preload_extrafiles;
	
	// go through all the tags we've been told to search
	Object.keys(this.options.preload_tags).forEach((type) => 	{
		this.options.preload_tags[type].forEach((tag) =>
		{
			// and grab all their properties
			for (var match of content.matchAll(new RegExp('"#","\\^' + tag + ':\\s*(.*?)(?=","/#")', "gi")))
			{
				if (match["1"]) 
				{
					for (var file of match["1"].split(", "))
					{
						if (file.startsWith(":") || file.startsWith(">>")) 
						{
							continue;
						}

						file = splitAtCharacter(splitAtCharacter(file, ":").before, ">>").before.trim();

						switch (type)
						{
							case "image":
								file = addFileType(file, 
										this.options.defaultimageformat, 
										this.options.defaultimagelocation)
								break;
							case "audio":
									file = addFileType(file, 
											this.options.defaultaudioformat, 
											this.options.defaultaudiolocation);
								break;							
						}
	
						if (files.indexOf(file) === -1) files.push(file);
					}
				}
			};
		})
	})

	// if there's nothing, cancel here
	if (!files.length) return;

	this.waitForPatch(credits.name);

	// create a loading bar
	var lb = loadingbar(this);

	
	loader.onprogress = event => 
	{
		// update the loading bar
		lb.progress(event.progress);
	}

	loader.oncomplete = items => 
	{
		// remove the loading bar and start the story
		lb.done(this.patchReady.bind(this, credits.name));
	}

	var count = files.length;
	loader.onfetched = item => {
		count -= 1;
	}

	loader.onerror = item => 
	{
		loader.cancel();
		this.patchReady(credits.name);
	}	
	window.loader = loader;

	loader.fetch(files);

}, options, credits);

export default {options: options, credits: credits}

/**
@name preload-it
@license MIT
@source https://github.com/andreupifarre/preload-it
@description 
i made this really compact sorry i hope that's okay
like, sure, you don't need to fiddle with this code, probably. probably. but if we're being honest, yeah, i made it small because i don't want to comment it
because i don't understand it
because i didn't write it
but it works really well!
**/

/**
	@name preload-it
	@license MIT
	@source https://github.com/andreupifarre/preload-it
	@description 
	i made this small sorry i hope that's okay
	mostly because i don't want to comment it, if i'm being honest
	because i don't understand it
	because i didn't write it
	but it works really well!
	**/
	function preload(t) {return{state:[],loaded:!1,stepped:t&&t.stepped||!0,onprogress:function(){},oncomplete:function(){},onfetched:function(){},onerror:function(){},oncancel:function(){},fetch:function(t){var e=this;return new Promise(function(r,o){e.loaded=t.length;var a,s=n(t);try{for(s.s();!(a=s.n()).done;){var i=a.value;e.state.push({url:i}),e.preloadOne(i,function(t){e.onfetched(t),e.loaded--,0==e.loaded&&(e.oncomplete(e.state),r(e.state))})}}catch(t){s.e(t)}finally{s.f()}})},updateProgressBar:function(t){var e,r=0,o=this.stepped?100*this.state.length:0,a=0,s=n(this.state);try{for(s.s();!(e=s.n()).done;){var i=e.value;i.completion&&a++,this.stepped?i.completion&&(r+=i.completion):this._readyForComputation?(r+=i.downloaded,o+=i.total):r=o=0}}catch(t){s.e(t)}finally{s.f()}this._readyForComputation=a==this.state.length;var l=parseInt(r/o*100);isNaN(l)||this.onprogress({progress:l,item:t})},preloadOne:function(t,e){var n=this,r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="blob";var o=this.getItemByUrl(t);o.xhr=r,r.onprogress=function(t){if(!t.lengthComputable)return!1;o.completion=parseInt(t.loaded/t.total*100),o.downloaded=t.loaded,o.total=t.total,n.updateProgressBar(o)},r.onerror=function(t){n.onerror(o)},r.onload=function(t){var a=t.target.response.type,s=t.target.responseURL;if(o.fileName=s.substring(s.lastIndexOf("/")+1),o.type=a,o.status=r.status,404==r.status)o.blobUrl=o.size=null,o.error=!0,n.onerror(o);else{var i=new Blob([t.target.response],{type:a});o.blobUrl=URL.createObjectURL(i),o.size=i.size,o.error=!1}e(o)},r.send()},getItemByUrl:function(t){var e,r=n(this.state);try{for(r.s();!(e=r.n()).done;){var o=e.value;if(o.url==t)return o}}catch(t){r.e(t)}finally{r.f()}},cancel:function(){var t,e=n(this.state);try{for(e.s();!(t=e.n()).done;){var r=t.value;r.completion<100&&(r.xhr.abort(),r.status=0)}}catch(t){e.e(t)}finally{e.f()}return this.oncancel(this.state),this.state}};function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function n(t,n){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,i=!0,l=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return i=t.done,t},e:function(t){l=!0,s=t},f:function(){try{i||null==r.return||r.return()}finally{if(l)throw s}}}}}
	