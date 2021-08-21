// -----------------------------------
// save story state across refreshes
// -----------------------------------

var credits = {
	emoji: "📦",
	name: "Storage",
	author: "Elliot Herriman",
	version: "1.0",
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
	storage_defaultformat: "session"
}

function get(id, format = options.storage_defaultformat)
{
	switch (format) 
	{
		case "cookies":
			
			if (id)
			{
				try
				{
					return document.cookie.split('; ').find(row => row.startsWith(id + "=")).split('=')[1];
				} catch (e) { return ""; }
			}
			
			return document.cookie;

		case "session":
			return sessionStorage.getItem(id);

		case "local":
			return localStorage.getItem(id);
	}
}

function set(id, data, format = options.storage_defaultformat)
{
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

function remove(id, format = options.storage_defaultformat) 
{
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

ExternalFunctions.add("get", (value) => 
	{ 
		var v = get(value);
		return (isNaN(v) ? v : parseFloat(v)) || false;
	
	});
ExternalFunctions.add("set", set);

Patches.add(function()
{
	
}, options, credits);

export default {options: options, credits: credits, get: get, set: set, remove: remove, clear: clear}