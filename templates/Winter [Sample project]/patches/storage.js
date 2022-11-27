// -----------------------------------
// save story state across refreshes
// -----------------------------------

var credits = {
	emoji: "📦",
	name: "Storage",
	author: "Elliot Herriman",
	version: "1.1",
	description: "Enables saving semi-persistent data to the browser's storage.",
	licences: {
		self: "2021",
	}
}

// ================================================
// FORMATS
// ================================================
//
// "cookies"
// 		cookies have a size limit of ~4kb,
// 		not recommended for anything large
//
// "session"
// 		session data is bound to the window or tab, so it'll
// 		exist across page refreshes, but closing the game and
// 		opening it in another tab will clear the saved data
// 		max of around 5mb, browser depending
//
// "local"
// 		local storage just won't get cleared. ever, i guess? 
// 		unless the user manually does it. persists across tabs,
// 		and also totals around 5mb, browser depending

var options = {
	storage_defaultformat: "session",
	storage_ID: "",
}

function get(id, format = options.storage_defaultformat, story = this)
{
	var data = undefined;
	id = story.options.storage_ID + id;

	switch (format) 
	{
		case "cookies":
			if (id)
			{
				try
				{
					data = document.cookie.split('; ').find(row => row.startsWith(id + "=")).split('=')[1];
				} catch (e) { data = ""; }
				break;
			}
			
			data = document.cookie;
			break;

		case "session":
			data = sessionStorage.getItem(id);
			break;

		case "local":
			data = localStorage.getItem(id);
			break;
	}

	data = JSON.parse(data) || data;
	data = (isNaN(data) ? data : parseFloat(data));
	return data || (data == 0 ? data : false);
}

function set(id, data, format = options.storage_defaultformat, story = this)
{
	data = JSON.stringify(data) || data;
	id = story.options.storage_ID + id;

	switch (format) 
	{
		case "cookies":
			if (id)
			{
				document.cookie = id+"="+data;
			}
			else 
			{
				this.clear("cookies");
				document.cookie = data;
			}
			break;

		case "session":
			sessionStorage.setItem(id, data);
			break

		case "local":
			localStorage.setItem(id, data);
			break;
	}
}

function remove(id, format = options.storage_defaultformat, story = this) 
{
	id = story.options.storage_ID + id;

	switch (format) 
	{
		case "cookies":
			document.cookie = id+"=;expires="+new Date().toUTCString();
			break;

		case "session":
			sessionStorage.removeItem(id);
			break

		case "local":
			localStorage.removeItem(id);
			break;
	}
}

function clear(format = options.storage_defaultformat) 
{
	switch (format) 
	{
		case "cookie":
			document.cookie.split("; ").forEach(function(cookie) 
			{ 
				document.cookie = cookie+";expires="+new Date().toUTCString()
			});
			break;

		case "session":
			sessionStorage.clear();
			break

		case "local":
			localStorage.clear();
			break;
	}
}

ExternalFunctions.add("get", get);
ExternalFunctions.add("set", set);

Patches.add(function()
{
	// if you haven't set an ID, just use the URL
	if (!this.options.storage_ID) 
		this.options.storage_ID = window.location.pathname;

}, options, credits);

export default {options: options, credits: credits, get: get, set: set, remove: remove, clear: clear};