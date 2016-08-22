var NCIDOSE_version = "Version 1.0";

var modules = [ "NCICT", "2nd Tab" ];

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function() {

	updateVersion(NCIDOSE_version);
	//addValidators();
	$('#ldlink-tabs').on('click', 'a', function(e) {
		//console.warn("You clicked a tab");
		//console.info("Check for an attribute called data-url");
		//If data-url use that.
		var currentTab = e.target.id.substr(0, e.target.id.search('-'));
		//console.log(currentTab);
		var last_url_params = $("#"+currentTab+"-tab-anchor").attr("data-url-params");
		//console.log("last_url_params: "+last_url_params);
		if(typeof last_url_params === "undefined") {
			window.history.pushState({},'', "?tab="+currentTab);
		} else {
			window.history.pushState({},'', "?"+last_url_params);
		}

	});
	
	
	$('[data-toggle="popover"]').popover();
	// Apply Bindings

	$.each(modules, function(key, id) {
		$("#"+ id + "-results-container").hide();
		$('#'+ id + '-message').hide();
		$('#'+ id + '-message-warning').hide();
		$('#'+ id + "-loading").hide();
	});
	$('.NCICTForm').on('submit', function(e) {
		//alert('Validate');
		Make_PDF(e);
	});

	setupTabs();


});

// Set file support trigger
$(document).on('change','.btn-file :file',function() {
		var input = $(this), numFiles = input.get(0).files ? 
		input.get(0).files.length : 1, label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [ numFiles, label ]);
	}
);




function setupTabs() {
	//Clear the active tab on a reload
	$.each(modules, function(key, id) {
		$("#"+id+"-tab-anchor").removeClass('active');
	});
	$("#home-tab-anchor").removeClass('active');
	//Look for a tab variable on the url
	var url = "{tab:''}";
	var search = location.search.substring(1);
	if(search.length >0 ) {
		url = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\n/, '\\\\n').replace(/\t/, '') + '"}');
	}

	var currentTab;
	if(typeof url.tab !="undefined") {
		currentTab = url.tab.toLowerCase();
	} else {
		currentTab = 'home';
	}



	$('#'+currentTab+'-tab').addClass("in").addClass('active');
	$('#'+currentTab+'-tab-anchor').parent().addClass('active');

	if(typeof url.inputs !="undefined") {
		//console.dir(url.inputs.replace(/\t/, '').replace(/\n/, '\\\\n'));
		updateData(currentTab, url.inputs.replace(/\t/, '').replace(/\n/, '\\\\n'));
	}

}


function showFFWarning() {
	// Is this a version of Mozilla?
	if ($.browser.mozilla) {
		var userAgent = navigator.userAgent.toLowerCase();
		// Is it Firefox?
		if (userAgent.indexOf('firefox') != -1) {
			userAgent = userAgent.substring(userAgent.indexOf('firefox/') + 8);
			var version = userAgent.substring(0, userAgent.indexOf('.'));
			if (version < 36) {
				$('.ffWarning').show();
			}
		}
	}
}



function updateVersion(version) {
	$("#NCIDOSE_version").text(version);
}





function toggleChevron(e) {
    $(e.target).prev('.panel-heading').find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}
function openHelpWindow(pageURL) {
    var helpWin = window.open(pageURL, "Help", "alwaysRaised,dependent,status,scrollbars,resizable,width=1000,height=800");
    helpWin.focus();
}

$('#consent :checkbox').change(function () {
    var a = $('#consent :checked').filter(":checked").length;
    if (a == 3) {
        $('#overlay').removeClass('overlay');
    } else {
        $('#overlay').addClass('overlay');
    }
});
