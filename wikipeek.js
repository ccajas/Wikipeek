// ==UserScript==
// @name         WikiPeek
// @namespace    https://github.com/ccajas1
// @version      0.1
// @description  A small but useful script that lets you preview a linked Wikipedia article
// @author       C.Cajas
// @match        en.wikipedia.org/wiki/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// ==/UserScript==

$(document).ready(function(){
    $('body').css("background-color","#aabbcc");
    $('#mw-content-text a').mouseover(function() {
        hoverFunc(this);
    });
});

function hoverFunc(link) 
{    
    console.log(link.href);
    var article = link.href;

    // Load article from API
    article = article.substr(article.lastIndexOf("/") + 1);
    console.log(article);
    var test = ajaxFunc("https://en.wikipedia.org/w/api.php?action=query&titles="+ article +"&prop=revisions&rvparse=1&rvprop=content&rvsection=0&format=json");

    var jsonObj = test.query.pages;
    var pageID;

    // Get property key name of page ID
    for(var key in jsonObj) {
        if(jsonObj.hasOwnProperty(key)) {
            pageID = jsonObj[key];
            break;
        }
    }

    console.dir(pageID.revisions[0]);
}

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