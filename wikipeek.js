// ==UserScript==
// @name         WikiPeek
// @namespace    http://your.homepage/
// @version      0.16
// @description  Preview Wikipedia article by hovering over its link
// @author       C.Cajas
// @match        en.wikipedia.org/wiki/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// ==/UserScript==

$(document).ready(function()
{
	$('body').css("background-color","#aabbcc");
	$('#mw-content-text a').hover(
		function() {
			hoverFunc(this);
		},
		function() {
			hoverOut();
		}
	);
});

///
/// Hover function, to load the article
///

function hoverFunc(link) 
{    
	var article = link.href;    
	article = article.substr(article.lastIndexOf("/") + 1);
	
	var content = loadArticle(article);

	// Check if it's a redirect
	if (link.className == "mw-redirect")
	{   
		var redirContent = $.parseHTML(content);
		var redirLink = $(redirContent).find('a');
		redirLink = redirLink[0].href;
	
		var redirArticle = redirLink.substr(redirLink.lastIndexOf("/") + 1);
		
		content = loadArticle(redirArticle);  
	}
	
	// Show toolTip with article preview
	if (content)
		showToolTip(content);
}

///
/// Load article object from the article's name
///


function loadArticle(article)
{   
	// Check if this is an anchor link or empty
	if (article.indexOf("#") != -1 || article.indexOf("?") != -1 || article === "")
		return null;
	
	// URL for MediaWiki API
	var queryURL = ajaxFunc("https://en.wikipedia.org/w/api.php?action=query&titles="+ 
						article +"&prop=revisions&rvparse=1&rvprop=content&rvsection=0&format=json");

	var jsonObj = queryURL.query.pages;
	var pageID;

	// Get property key name of page ID
	for(var key in jsonObj) {
		if(jsonObj.hasOwnProperty(key)) {
			pageID = jsonObj[key];
			break;
		}
	}

	return pageID.revisions[0]['*'];
}

///
/// Remove target element from string
///

(function($) {
	$.strRemove = function(theTarget, theString) {
		return $("<div/>").append(
			$(theTarget, theString).remove().end()
		).html();
	};
})(jQuery);

///
/// Read GET vars from a URL
///

function getUrlVars(url) 
{
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

///
/// AJAX shorthand function
///

function ajaxFunc(url) 
{
	var result;

	$.ajax({
		datatype: "json",
		url: url,
		async: false,
		success: function(data){
			result = data;
		}
	});
	return result;
}

///
/// Show the ToolTip
///

function showToolTip(content)
{
	var toolTip = $(this).attr('Tooltip');
	
	$('body')
		.append('<div class="wpk-tooltip">'+ content +'</div>');
	
	$('.wpk-tooltip')
		.hide()
		.fadeIn(500)
		.css({
			'position' : 'absolute',
			'z-index' : 100,
			'font-size' : 12,
			'line-height' : '1.4em',
			'top' : (event.pageY + 10) + 'px',
			'left' : '20%',
			'width' : '40%',
			'padding' : 5 + 'px',
			'background-color' : '#eee',
			'border' : '2px solid #aaa',
			'-webkit-box-shadow' : '0px 5px 4px 2px rgba(0,0,0,0.55)',
			'-moz-box-shadow' : '0px 5px 4px 2px rgba(0,0,0,0.55)',
			'box-shadow' : '0px 5px 4px 2px rgba(0,0,0,0.55)'
		});
}

///
/// Hide the ToolTip
///

function hoverOut()
{
	$('.wpk-tooltip').remove();
}
