// -----------------------------------
// patch template
// -----------------------------------

var credits = {
	emoji: "🧶",
	name: "Storylets",
	author: "Elliot Herriman",
	version: "1.1",
	description: "Enables storylets, as seen in Twine's Harlowe.",
	licences: {
		self: "2021",
	}
}

var options = {
	storylets_knotTag: "storylet",

	storylets_openStitch: "open",
	storylets_urgencyStitch: "urgency",
	storylets_exclusivityStitch: "exclusivity",
	storylets_contentStitch: "text",
	
	storylets_function_open: "_openStorylets",
	storylets_function_filtered: "_filteredStorylets",
};

function InitialiseStorylets(tag)
{
	tag = tag.toLowerCase().trim();

	this.ink.storylets = {};

	this.ink.mainContentContainer.namedContent.forEach((container) =>
	{
		let tags = this.ink.TagsForContentAtPath(container.name);
		
		if (!tags) return;

		for (var i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].split(":", 2);

			if (tag == tags[i][0].toLowerCase().trim())
			{		
				let category = (tags[i][1] || "global").toLowerCase().trim();
				
				if (!container.namedContent.get(this.options.storylets_contentStitch))
				{
					console.error("Couldn't find a stitch named \"" + this.options.storylets_contentStitch + "\" in storylet \"" + container.name + "\".");
					continue;
				}
				
				this.ink.storylets[category] = this.ink.storylets[category] || [];
				this.ink.storylets[category].push(container);
				
				break;
			}
		}
	});

	console.log("Loaded storylets!", this.ink.storylets);
}

function OpenStorylets(category = null)
{
	if (this.ink.storylets)
	{
		let search;
		if (category)
		{
			search = this.ink.storylets[category];
		}
		else if (Object.keys(this.ink.storylets).length)
		{
			search = [];
			Object.keys(this.ink.storylets).forEach(group => search = search.concat(this.ink.storylets[group]));
		}

		if (search && search.length)
		{
			let storylets = [];
			let currentUrgency = 0;
			let currentExclusivity = 0;
			
			search.forEach((storylet) => 
			{
				if (!storylet.namedContent.get(this.options.storylets_openStitch) || this.ink.EvaluateContainer(storylet.namedContent.get(this.options.storylets_openStitch)))
				{
					
					let exclusivity = this.ink.EvaluateContainer(storylet.namedContent.get(this.options.storylets_exclusivityStitch)) || 0;
					let urgency = this.ink.EvaluateContainer(storylet.namedContent.get(this.options.storylets_urgencyStitch)) || 0;
					
					if (exclusivity < currentExclusivity) 
					{
						return; 
					}
					else if (exclusivity > currentExclusivity)
					{
						storylets = [];
						currentExclusivity = exclusivity;
						currentUrgency = urgency;
					}
					else if (urgency < currentUrgency)
					{
						return;
					}
					else if (urgency > currentUrgency)
					{
						storylets = [];
						currentUrgency = urgency;
					}
					
					storylets.push(storylet);
				}
			});
			
			if (storylets.length)
			{
				for (var i = storylets.length - 1, j, temp; i > 0; i--)
				{
					j = Math.floor(Math.random()*(i+1));
					temp = storylets[j];
					storylets[j] = storylets[i];
					storylets[i] = temp;  
				}
				
				let stitch = storylets[0].namedContent.get(this.options.storylets_contentStitch);
				if (stitch) return stitch.path;
			}
		}
	}

	this.state.callStack.PopThread();
}

Patches.add(function() 
{
	InitialiseStorylets.bind(this)(this.options.storylets_knotTag);

	ExternalFunctions.add(this.options.storylets_function_open, OpenStorylets.bind(this));
	ExternalFunctions.add(this.options.storylets_function_filtered, (category) => OpenStorylets.bind(this)(category));

}, options, credits);

export default {options: options, credits: credits};