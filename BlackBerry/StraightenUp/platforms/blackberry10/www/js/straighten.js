//wsd url
var wsdutl = "http://54.88.20.251/~straightenup/stadmin/wsd-json.php";
//variable define
var map;
var i = 0;
var eventsArray = [];
var reminderArray = [];
var geocoder = null;
var infowindow = null;
var dayArray = [["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],["Di", "Lu", "Mr", "Mi", "Je", "Ve", "Sa"]];
//On Device ready to call function
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function() {
    //$.mobile.useFastClick  = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.touchOverflowEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = false;
    $.mobile.page.prototype.options.domCache = true;
    sessionStorage.foryouthadults = 1;
    sessionStorage.currentLat = "";
    sessionStorage.currentLng = "";
	sessionStorage.findsearchUrl = "http://chiropractic.ca/wp-content/themes/cca/locator.php";
	sessionStorage.biourl = "http://chiropractic.ca/ccadata/getchrio.php?id=";
    createDatabase();
	//wsdservicefunc();
});

$(document).on("swipeleft", function(e) {
    if ($.mobile.activePage.jqmData( "panel" ) == "open"){
        var pageId = $.mobile.activePage[0].id;
        var nvPanelId = $("#"+pageId+" [data-icon='bars']").attr('href');
        $(""+nvPanelId+"").panel("close");
    }
});

$(function(){
  
    FastClick.attach(document.body);
	
	$(document).scroll(function(e){
		e.stopPropagation();
		e.preventDefault();
        var shrinkHeader = 2;
        var scroll = $(this).scrollTop();
		var nvPageId = $.mobile.activePage.attr('id');
		if(nvPageId=="excercises" || nvPageId=="poster" || nvPageId=="know" || nvPageId=="find" || nvPageId=="about-index") {
			if ( scroll >= shrinkHeader ) {
				$('#'+nvPageId+' .scrollheader').addClass('shrink');
				$('#'+nvPageId+' .header-icon').slideUp(500);
			} else {
				$('#'+nvPageId+' .scrollheader').removeClass('shrink');
				$('#'+nvPageId+' .header-icon').slideDown(500);
			}
		}
		e.stopPropagation();
		e.preventDefault();
    });
	
	//Uncommented Only for blackberry
	/*$('[data-role=page]').live('pageshow', function (event, ui) {
        try {
            _gaq.push( ['_trackPageview', event.target.id] );
            //console.log(event.target.id);
        } catch(err) {
 
        }
    });*/
	
	$('[data-role=page]').live('pagehide', function (event, ui) {
        $('.scrollheader').removeClass('shrink');
		$('.header-icon').slideDown(500);
    });
	
	$("#flipswitchbtnid a").live("touchend", function(e) {
		var nvId = this.id;
		$('#flipswitchbtnid a').removeClass("active");
		sessionStorage.foryouthadults = nvId;
		$(this).addClass("active");
		//$('#flipswitchbtnid a:eq(1)').removeClass("active");
        if(nvId==1) {
			$(".youthexerciseslist").hide();
			$(".adultexerciseslist").show();
			e.stopPropagation();
			e.preventDefault();
			return false;
        } else if(nvId==2) {
			$(".adultexerciseslist").hide();
            $(".youthexerciseslist").show();
			e.stopPropagation();
			e.preventDefault();
			return false;
        } else {
        }
		return false;
    });
	
    $("#languagebtnid button").live("touchend",function(e){
        var nvLang = this.id;
		sessionStorage.currentLang = nvLang;
		var nvLangFileName = "LangId"+Math.floor(nvLang)+".json";
		changelanguagefunc(nvLangFileName);
		$.mobile.changePage( "#intro-landing-page-b", { transition: "none", changeHash: true });
		selectlanguagefunc(nvLang);
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
		
    //show hide viewstill and viewvideo exercises
    $(".adultviewstills").live("tap", function(e) {
        var NvId = $(this).attr("id");
        $(this).hide();
        $(".adultviewvideocls"+NvId+"").hide();
        $(".adultviewstillscls"+NvId+"").show();
        $(".adultviewvideo"+NvId+"").show();
        videopausefunc();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

    //show hide viewstill and viewvideo exercises

    $(".adultviewvideo").live("tap", function(e) {
        var NvId = $(this).attr("id");
        $(this).hide();
        $(".adultviewstillscls"+NvId+"").hide();
        $(".adultviewvideocls"+NvId+"").show();
        $(".adultviewstills"+NvId+"").show();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
        //show hide viewstill and viewvideo exercises

    $(".youthviewstills").live("tap", function(e) {
        var NvId = $(this).attr("id");
        $(this).hide();
        $(".youthviewvideocls"+NvId+"").hide();
        $(".youthviewstillscls"+NvId+"").show();
        $(".youthviewvideo"+NvId+"").show();
        videopausefunc();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

    //show hide viewstill and viewvideo exercises

    $(".youthviewvideo").live("tap", function(e) {
        var NvId = $(this).attr("id");
        $(this).hide();
        $(".youthviewstillscls"+NvId+"").hide();
        $(".youthviewvideocls"+NvId+"").show();
        $(".youthviewstills"+NvId+"").show();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
	$("#saveexecisetrackbtn").live("tap",function(e){
		var curdate = new Date();
		graphyear = curdate.getFullYear();
		graphmonth = curdate.getMonth();
		graphday = curdate.getDate();
		graphmonth1 = curdate.getMonth()+1;
		nvdate = new Date(graphyear, graphmonth, graphday);
			
		var thisval = nvdate.valueOf();
		var currentID = ""+thisval+"";
		var curname = "Track Name";
		var cururl = "Track Url";
		var curstart = ""+nvdate+"";
		var curend = ""+nvdate+"";
		var cursummay = "Track Summay";
		var curlockstatus = "Y";
		var nvGCY = ""+graphyear+"";
		var nvGCM = ""+graphmonth1+"";
		var nvGCD = ""+graphday+"";
		var nvGCP = "1";
		mydb.transaction(
			function(transaction) {
				transaction.executeSql(
					'INSERT INTO trackinfo (eid, name, url, start, end, summary, lockstatus, year, month, day, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
					[currentID, curname, cururl, curstart, curend, cursummay, curlockstatus, nvGCY, nvGCM, nvGCD, nvGCP],
					function(){
						calendarrefresh();
						$.mobile.changePage( "#excercises", { transition: "none", changeHash: true });
						return false;
					},
					errorHandler
				);
			}
		);
		e.stopPropagation();
		e.preventDefault();
		return false;
	});
  
    //save track info when click on celander date.
    $("#savetrackbtn").live("tap",function(e){
        var nvthisval = sessionStorage.thisdateval;
        var nvdate = sessionStorage.curdateval;
        var currentID = nvthisval;
        var curname = "Track Name";
        var cururl = "Track Url";
        var curstart = nvdate;
        var curend = nvdate;
        var cursummay = "Track Summay";
        var curlockstatus = "Y";
        var nvGCY = sessionStorage.graphyear;
        var nvGCM = sessionStorage.graphmonth;
        var nvGCD = sessionStorage.graphday;
        var nvGCP = "1";
        mydb.transaction(
            function(transaction) {
                transaction.executeSql(
                    'INSERT INTO trackinfo (eid, name, url, start, end, summary, lockstatus, year, month, day, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                    [currentID, curname, cururl, curstart, curend, cursummay, curlockstatus, nvGCY, nvGCM, nvGCD, nvGCP],
                    function(){
                        //$("#overlapid").show();
                        $.mobile.changePage( "#poster", { transition: "none", changeHash: true });
                        return false;
                    },
                    errorHandler
                );
            }
        );
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

    //click on adult exercises list then will goto exercise inside page
    $(".adultexerciseslist li").live("tap", function(e) {
        var nvId = $(this).attr('id');
        if(nvId!="") {
            sessionStorage.exercisesid = nvId;
            $.mobile.changePage( "#excercises-inside", { transition: "none", changeHash: true });
        }
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $(".youthexerciseslist li").live("tap", function(e) {
        var nvId = $(this).attr('id');
        if(nvId!="") {
            sessionStorage.exercisesid = nvId;
            $.mobile.changePage( "#excercises-inside", { transition: "none", changeHash: true });
        }
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#find-search-03").on( "pagehide", function(e) {
        $('#chiroimageid').attr("src","");
        $("#chironameid").empty();
        $("#chirobioid").empty();
        $("#clinicinfodivid").empty();
        $('[data-icon="myapp-call"]').attr("href","#");
        $('[data-icon="myapp-fb"]').attr("onclick","");
        $('[data-icon="myapp-twitter"]').attr("onclick","");
        $('[data-icon="myapp-linked"]').attr("onclick","");
        $('[data-icon="myapp-web"]').attr("onclick","");
        $('.facebookactcls').css('opacity','0.8');
        $('.twitteractcls').css('opacity','0.8');
        $('.linkedinactcls').css('opacity','0.8');
        $('.weblinkactcls').css('opacity','0.8');
        $('.callactcls').css('opacity','0.8');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
  
    $("#excercises-inside").live( "pagehide", function(e) {
        videopausefunc();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#excercises-inside").live( "pageshow", function(e) {
        $(".defaultshow").show();
        $(".adultviewvideo").hide();
        $(".adultviewstills").show();
        $(".youthviewvideo").hide();
        $(".youthviewstills").show();
        $(".showhideexercisecls").hide();
	
        var nvYouthAdults = sessionStorage.foryouthadults;
	
        var nvExercisesId = sessionStorage.exercisesid;
        if (nvYouthAdults==1) {
			$('.youthexercisesinsidelist').removeClass("active");
			$('.adultexercisesinsidelist').addClass("active");
            $(".adultexerview"+nvExercisesId+"").show();
        } else {
			$('.adultexercisesinsidelist').removeClass("active");
			$('.youthexercisesinsidelist').addClass("active");
            $(".youthexerview"+nvExercisesId+"").show();
        }
        checkExerciseNextButton();
        //analytics.trackView('Exercise Inside Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    //info intro video stop when info-intro-video pagehide
    $("#info-intro-video").live( "pagehide", function(e) {
        var myVideo=document.getElementById("infointrovideoid");
        myVideo.pause();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //playallvideo stop when playallvideo-page pagehide
    $("#playallvideo-page").live("pagehide", function(e) {
        var myVideo=document.getElementById("adultplayallvideo");
		myVideo.pause();
        var myVideo1=document.getElementById("youthplayallvideo");
        myVideo1.pause();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    //intro-landing-page-b video stop when intro-landing-page-b pagehide
    $("#intro-landing-page-b").live( "pagehide", function(e) {
        var myVideo=document.getElementById("introvideoid");
        myVideo.pause();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
	
	//intro-landing-page-b pageshow
    $("#intro-landing-page-b").live( "pageshow", function(e) {
        //analytics.trackView('Intro Video');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
	
	//intro-landing-page-a pageshow
    $("#intro-landing-page-a").live( "pageshow", function(e) {
        var nvLangFileName = "LangId"+Math.floor(0)+".json";
        introlandingpagefunc(nvLangFileName);
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //infointrovideo show-hide when info-intro-video pageshow
    $("#info-intro-video").live( "pageshow", function(e) {
        checkConnection();
		e.stopPropagation();
		e.preventDefault();
        //analytics.trackView('Info Intro Video');
        return false;
    });

    //playallvideo-page show-hide when playallvideo-page pageshow
    $("#playallvideo-page").live( "pageshow", function(e) {
        var nvForYA = sessionStorage.foryouthadults;
        if (nvForYA==1) {
            $("#youthplayallvideo").hide();
            $("#adultplayallvideo").show();
        } else {
            $("#adultplayallvideo").hide();
            $("#youthplayallvideo").show();
        }
        checkConnection();
        //analytics.trackView('Play All Video');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

    //english and french excercises show-hide when excercises pageshow
    $("#excercises").live( "pageshow", function(e) {
        //$("#foryouthoverlapid").hide();
        var nvForYA = sessionStorage.foryouthadults;
        if (nvForYA==1) {
            $(".adultexerciseslist").show();
            $(".youthexerciseslist").hide();
            $('#flipswitchbtnid a:eq(1)').removeClass("active");
            $('#flipswitchbtnid a:eq(0)').addClass("active");
        } else {
            $(".adultexerciseslist").hide();
            $(".youthexerciseslist").show();
            $('#flipswitchbtnid a:eq(0)').removeClass("active");
            $('#flipswitchbtnid a:eq(1)').addClass("active");
        }
        $('#excercises [data-icon="grid"]:eq(0)').addClass("ui-btn-active");
        checkConnection();
        //analytics.trackView('Excercises Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //english and french about show-hide when about index pageshow
    $("#about-index").live( "pageshow", function(e) {
		listview = "aboutmainid";
		onclickwindowopen(listview);
        //analytics.trackView('About Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#settings-page").live( "pageshow", function(e) {
        var nvLangId = sessionStorage.currentLang;
        var nvDfVal = $("#settingpagelngval").val();
        if(nvLangId==nvDfVal) {
			var myselect = $("#langflip");
			myselect[0].selectedIndex = nvLangId;
			myselect.selectmenu("refresh");
    	} else {
            $("#settingpagelngval").val(nvLangId);
            var nvLangFileName = "LangId"+Math.floor(nvLangId)+".json";
            settingpagefunc(nvLangFileName,nvLangId);
        }
        //analytics.trackView('Setting Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //show hide know your back when know pageshow
    $("#know").live("pageshow", function(e) {
        $('#know [data-icon="grid"]:eq(2)').addClass("ui-btn-active");
        //analytics.trackView('Know Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    $("#know").live("pagehide", function(e) {
        $("#know-inside-hand-body a:eq(0)").attr("href", "#know");
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    $("#know-inside-body").live("pagehide", function(e) {
        $("#know-inside-hand-body a:eq(0)").attr("href", "#know-inside-body");
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    $("#landing-page").live("pageshow", function(e) {
        var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
		if(deviceType=="iPhone" || deviceType=="iPad") {
			window.plugin.notification.local.promptForPermission();
			window.plugin.notification.local.hasPermission(function (granted) {
				//  alert('Permission has been granted: ' + granted);
			});
		}
        //analytics.trackView('Landing Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $(".yourbackcls").live("tap",function(e){
        var nvKnowid = $(this).attr('id');
        sessionStorage.knowid = nvKnowid;
        $.mobile.changePage( "#know-inside-hand-body", { transition: "none", changeHash: true });
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
	
    $("#know-inside-hand-body").live("pageshow", function(e) {
        $(".knowyourbackview").hide();
        var nvLangId = sessionStorage.currentLang;
        var nvKnowid = sessionStorage.knowid;
        $(".knowyourbackview"+nvKnowid+"").show();
        //analytics.trackView('Know inside Page');
		e.stopPropagation();
		e.preventDefault();
    	return false;
    });
    
    $("#know-inside-body").live("pageshow", function(e) {
        var nvLangId = sessionStorage.currentLang;
        //analytics.trackView('Know inside Page');
		e.stopPropagation();
		e.preventDefault();
    	return false;
    });
    
    $("#excersisenext").live("tap",function(e){
        var a =	$(".adultexercisesinsidelist .showhideexercisecls:visible").next(".adultexercisesinsidelist .showhideexercisecls:hidden").show().prev(".adultexercisesinsidelist .showhideexercisecls:visible").hide();
        var a1 = $(".youthexercisesinsidelist .showhideexercisecls:visible").next(".youthexercisesinsidelist .showhideexercisecls:hidden").show().prev(".youthexercisesinsidelist .showhideexercisecls:visible").hide();
        
        checkExerciseNextButton();
		e.stopPropagation();
		return false;
    });
    
    $('#langflip').live("change",function(e) {
		var nvLangId = $(this).val();
		var id = 1;
		langstatus = nvLangId;
		mydb.transaction(
			function(transaction) {
			transaction.executeSql(
				'UPDATE user_profile SET languagestatus = ? WHERE id = ?',
				[langstatus, id],
				function(){
					sessionStorage.currentLang = nvLangId;
					var nvLangFileName = "LangId"+Math.floor(nvLangId)+".json";
					changelanguagefunc(nvLangFileName);
					//wsdservicefunc();
					return false;
				},
				errorHandler
			);
			}
		);
		e.stopPropagation();
		e.preventDefault();
		return false;
    });
    
    $("#poster").live( "pageshow", function(e) {
        $("#graphswipe").hide();
        var nvFst = $("#graphval").val();
        if(nvFst=="") {
            $("#graphval").val("1");
            var today = new Date();
            var IDYear = ""+today.getFullYear()+"";
            var NextYear = parseInt(IDYear) + 1;
            graphrefreshfunc(IDYear, NextYear);
        }
	    $('#poster [data-icon="grid"]:eq(1)').addClass("ui-btn-active");
        //analytics.trackView('Track Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#setreminder").live( "pageshow", function(e) {
        //analytics.trackView('Set Reminder Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $('#blog-index').live( "pageshow", function(e) {
        sessionStorage.blogsid = "";
	
        var nvLangId = sessionStorage.currentLang;
        var nvDfVal = $("#blogslngval").val();
        if(nvLangId==nvDfVal) {
    	
    	} else {
            $("#blogslngval").val(nvLangId);
            var nvLangFileName = "LangId"+Math.floor(nvLangId)+".json";
            blogpagefunc(nvLangFileName);
        }
        //analytics.trackView('Blogs Page');
        checkConnection();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $('#blog-inside').live( "pageshow", function(e) {
        $('.blogdetails').hide();
        var nvLangId = sessionStorage.currentLang;
        var nvDfVal = $("#blogsinsidelngval").val();
        if(nvLangId==nvDfVal) {
            var blogid = sessionStorage.blogsid;
            $('#blogview'+blogid+'').show();
        } else {
            $("#blogsinsidelngval").val(nvLangId);
            var nvLangFileName = "LangId"+Math.floor(nvLangId)+".json";
            blogpagefunc(nvLangFileName);
        }
        //analytics.trackView('Blogs Inside Page');
		e.stopPropagation();
        return false;
    });
    
    $('#find-search-02').live( "pageshow", function(e) {
        var nvFromName = sessionStorage.findchirofromnam;
        if (nvFromName!="") {
            findachirosearchfunc(nvFromName);
            sessionStorage.findchirofromnam = "";
        }
        //analytics.trackView('Find A Chiro Inside page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#geolocfindachirobtn").live( "tap", function(e) {
        sessionStorage.findchirofromnam = "findachironearmefrom";
		$(this).addClass('ui-disabled');
        geoloc(success, fail, "map_canvas", "fromlatitude", "fromlng");
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    $("#findachirobtnid").live("tap",function(e){
        var code = $.trim($('#postal-code').val());
        var first = $.trim($('#first-name').val());
        var last = $.trim($('#last-name').val());
        var city = $.trim($('#city').val());
        var Province = $.trim($('#Province').val());
        if(code!="" || first!="" || last!="" || city!="" || Province!=""){
			sessionStorage.findchirofromnam = "findachirofrom";
			$.mobile.changePage( "#find-search-02", { transition: "none", changeHash: true });
            //findachirosearchfunc("findachirofrom");
            return false;
        } else 	{
            var nvLang = sessionStorage.currentLang;
            var nvLang = parseInt(nvLang);
            var nvMsg = sessionStorage.ParamtrMsg;
            var nvTit = sessionStorage.PopTitle;
            var nvOk = sessionStorage.DoneBtn;
	    
            navigator.notification.alert(""+nvMsg+"",alertDismissed,""+nvTit+"",""+nvOk+"");
            return false;
        }
		e.stopPropagation();
		e.preventDefault();
    });
  
    $("#findachirofrom").live("keypress", "input[type=text]", function(e) {
                            //check for enter key
        if(e.which === 13) {
            var code = $.trim($('#postal-code').val());
            var first = $.trim($('#first-name').val());
            var last = $.trim($('#last-name').val());
            var city = $.trim($('#city').val());
            var Province = $.trim($('#Province').val());
            if(code!="" || first!="" || last!="" || city!="" || Province!=""){
                sessionStorage.findchirofromnam = "findachirofrom";
                $.mobile.changePage( "#find-search-02", { transition: "none", changeHash: true });
                //findachirosearchfunc("findachirofrom");
                return false;
            } else 	{
                var nvLang = sessionStorage.currentLang;
                var nvLang = parseInt(nvLang);
                var nvMsg = sessionStorage.ParamtrMsg;
                var nvTit = sessionStorage.PopTitle;
                var nvOk = sessionStorage.DoneBtn;
		              
                navigator.notification.alert(""+nvMsg+"",alertDismissed,""+nvTit+"",""+nvOk+"");
                return false;
            }
        }
    });
  
    $("#savetrackinfo").live( "pagehide", function(e) {
        $("#savetrackoverlapid").show();
		calendarrefresh();
		e.stopPropagation();
		e.preventDefault();
    });
  
     //show hide savetrackinfo when savetrackinfo pageshow
    $("#savetrackinfo").live( "pageshow", function(e) {
        setTimeout(function(){$("#savetrackoverlapid").hide();}, 500);
        //analytics.trackView('Save Track Log Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

      //show hide saveexerciseinfo when saveexerciseinfo pageshow
    $("#saveexerciseinfo").live( "pageshow", function(e) {
        //analytics.trackView('Save Exercise Info Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
	
    $("#findachirosearchlistview li").live("tap",function(e){
        $.mobile.changePage( "#find-search-03", { transition: "none", changeHash: true });
        
        var nvLang = sessionStorage.currentLang;
        if(nvLang==0) {
            var nvClinicLang = "Clinic";
            var nvInformation = "Information not available.";
        } else {
            var nvClinicLang = "Clinique";
            var nvInformation = "Information non disponible.";
        }
        
        $('#chiroimageid').attr("src","");
        $("#chironameid").empty();
        $("#chirobioid").empty();
        $("#clinicinfodivid").empty();
        $('[data-icon="myapp-fb"]').attr("onclick","");
        $('[data-icon="myapp-twitter"]').attr("onclick","");
        $('[data-icon="myapp-linked"]').attr("onclick","");
        $('[data-icon="myapp-web"]').attr("onclick","");
        $('.facebookactcls').css('opacity','0.8');
        $('.twitteractcls').css('opacity','0.8');
        $('.linkedinactcls').css('opacity','0.8');
        $('.weblinkactcls').css('opacity','0.8');
        $('.callactcls').css('opacity','0.8');

        var nvFindId = this.id;
        var nvNo = 0;
		var nvbiourl = sessionStorage.biourl;
        $.getJSON(""+nvbiourl+""+nvFindId,function(result){
	    
            if(result.response.count!=0) {
                $.each(result.response.data, function(index, responseEach){
                    $("#chironameid").html(responseEach.Title+" "+responseEach.FirstName+" "+responseEach.LastName);
			
                    if(responseEach.FB!="" && responseEach._PublishContactProfile==1) {
                        $('.facebookactcls').css('opacity','1');
                        $('[data-icon="myapp-fb"]').attr("onclick","window.open('"+responseEach.FB+"', '_system');");
                    }
                    if(responseEach.Twitter!="" && responseEach._PublishContactProfile==1) {
                        $('.twitteractcls').css('opacity','1');
                        $('[data-icon="myapp-twitter"]').attr("onclick","window.open('"+responseEach.Twitter+"', '_system');");
                    }
                    if(responseEach.LinkedIn!="" && responseEach._PublishContactProfile==1) {
                        $('.linkedinactcls').css('opacity','1');
                        $('[data-icon="myapp-linked"]').attr("onclick","window.open('"+responseEach.LinkedIn+"', '_system');");
                    }
                    if(responseEach.Phone1!="" && responseEach.Phone1!=null) {
                       $('[data-icon="myapp-call"]').attr("href","tel:"+responseEach.Phone1+"");
                       $('.callactcls').css('opacity','1');
                    }
                    if(responseEach.Website!=""  && responseEach._PublishContactProfile==1) {
                       $('.weblinkactcls').css('opacity','1');
                       $('[data-icon="myapp-web"]').attr("onclick","window.open('"+responseEach.Website+"', '_system');");
                    }
                       
                    if(responseEach.user_image!="" && responseEach.user_image!=null) {
                       $('#chiroimageid').attr("src",""+responseEach.user_image+"");
                    } else {
                       $('#chiroimageid').attr("src","images/profile-pic.png");
                    }
			
                    if(responseEach.MemberBio!=""  && responseEach._PublishContactProfile==1 && responseEach._MemberBioStatus=="Approved") {
                       $("#chirobioid").html("<h2>Bio</h2><p>"+responseEach.MemberBio+".</p>");
                    } else {
                       $("#chirobioid").html("");
                    }
                       
                    var nvClinInfo = "";
                    if(responseEach.Company!=null && responseEach._PublishClinic1Info=="Yes") {
                       var nvclinicInfo = ''+responseEach.Company+'<br>'+responseEach.StreetAddress1+' '+responseEach.StreetAddress2+' '+responseEach.City+', '+responseEach.State+', '+responseEach.PostalCode+', '+responseEach.Country+'<br>'+responseEach.Phone1+'<br>'+responseEach.Email+'';
                       nvNo = nvNo + 1;
                       var nvClinInfo = "<h2><span>"+nvClinicLang+"</span> "+nvNo+"</h2><p>"+nvclinicInfo+"</p>";
                    }
			
                    var nvClinInfo1 = "";
                    if(responseEach._Clinic2Name!=null && responseEach._PublishClinic2Info=="Yes") {
                       var nvclinic2Info = ''+responseEach._Clinic2Name+'<br>'+responseEach._Clinic2Address1+' '+responseEach._Clinic2Address2+' '+responseEach._Clinic2City+', '+responseEach._Clinic2Province+', '+responseEach._Clinic2PostalCode+', '+responseEach._Clinic2Country+'<br>'+responseEach._Clinic2Phone+'<br>'+responseEach._Clinic2Email+'';
                       nvNo = nvNo + 1;
                       var nvClinInfo1 = "<h2><span>"+nvClinicLang+"</span> "+nvNo+"</h2><p>"+nvclinic2Info+"</p>";
                    }
			
                    var nvClinInfo2 = "";
                    if(responseEach._Clinic3Name!=null && responseEach._PublishClinic3Info=="Yes") {
                       var nvclinic3Info = ''+responseEach._Clinic3Name+'<br>'+responseEach._Clinic3Address1+' '+responseEach._Clinic3Address2+' '+responseEach._Clinic3City+', '+responseEach._Clinic3Province+', '+responseEach._Clinic3PostalCode+', '+responseEach._Clinic3Country+'<br>'+responseEach._Clinic3Phone+'<br>'+responseEach._Clinic3Email+'';
                       nvNo = nvNo + 1;
                       var nvClinInfo2 = "<h2><span>"+nvClinicLang+"</span> "+nvNo+"</h2><p>"+nvclinic3Info+"</p>";
                    }

                    $("#clinicinfodivid").html(nvClinInfo+" "+nvClinInfo1+" "+nvClinInfo2);
                });
            } else {
            }
	    });
		e.stopPropagation();
		e.preventDefault();
		return false;
    });
	
    //reminder list when reminderlist pageshow
    $("#reminderlist").live( "pageshow", function(e) {
        sessionStorage.reminderid = "";
        reminderfunc();
        //analytics.trackView('Reminder List Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //reminder on off when flip switch slider

    $('.flipclickcls').live("tap",function(e){
        var nvId = this.id;
        var nvHasCls = $(".flipclickcls"+nvId+"").hasClass("ui-flipswitch-active");
        if(nvHasCls==true) {
            var nvOnOff = "ON";
            $('.flipclickcls'+nvId+'').removeClass("ui-flipswitch-active");
        } else {
            var nvOnOff = "OFF";
            $('.flipclickcls'+nvId+'').addClass("ui-flipswitch-active");
        }
        mydb.transaction(
            function(transaction) {
                transaction.executeSql(
                    'UPDATE remindertable SET onoff=? WHERE id = ?',
                    [nvOnOff, nvId],
                    function(){
                        reminderfunc();
                        return false;
                    },
                    errorHandler
                );
            }
        );
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  

    $('.reminderjscls').live("tap",function(e){
        var nvId = this.id;
        var nvLangId = sessionStorage.currentLang;
        var nvLangId = parseInt(nvLangId);
        sessionStorage.reminderid = nvId;
        $.mobile.changePage( "#setreminder", { transition: "none", changeHash: true });
			mydb.transaction(
				function(transaction) {
					transaction.executeSql(
						'SELECT * FROM remindertable WHERE id=? ORDER BY id ASC;',
						[nvId],
						function (transaction, result) {
							for (var i=0; i < result.rows.length; i++)
							{
								var row = result.rows.item(i);
								$("#delreminder").show();
								$("input[type='checkbox']").prop("checked",false);
								var nvday = "";
								if(row.hours!="") {
									$('#hours option[value="'+row.hours+'"]').attr('selected', 'selected');
									$("#hours-button span").html(row.hours);
								}
								if(row.minutes!="") {
									$('#minutes option[value="'+row.minutes+'"]').attr('selected', 'selected');
									$("#minutes-button span").html(row.minutes);
								}
								if(row.ampm!="") {
									$('#AMPM option[value="'+row.ampm+'"]').attr('selected', 'selected');
									$("#AMPM-button span").html(row.ampm);
								}
								if(row.sunday!="") {
									nvday +=dayArray[nvLangId][0]+"&nbsp;";
									$("#everysunday").prop("checked",true);
								}
								if(row.monday!="") {
									nvday +=dayArray[nvLangId][1]+"&nbsp;";
									$("#everymonday").prop("checked",true);
								}
								if(row.tuesday!="") {
									nvday +=dayArray[nvLangId][2]+"&nbsp;";
									$("#everytuesday").prop("checked",true);
								}
								if(row.wednesday!="") {
									nvday +=dayArray[nvLangId][3]+"&nbsp;";
									$("#everywednesday").prop("checked",true);
								}
								if(row.thursday!="") {
									nvday +=dayArray[nvLangId][4]+"&nbsp;";
									$("#everythursday").prop("checked",true);
								}
								if(row.friday!="") {
									nvday +=dayArray[nvLangId][5]+"&nbsp;";
									$("#everyfriday").prop("checked",true);
								}
								if(row.saturday!="") {
									nvday +=dayArray[nvLangId][6]+"&nbsp;";
									$("#everysaturday").prop("checked",true);
								}
								if(nvday=="") {
									nvday = "";
								}
							$("#repeatlabelid").html(nvday);
							$("#alertlabelid").html(row.remindername);
							$("#txtreminderlbl").val(row.remindername);
							$("input[type='checkbox']").checkboxradio( "refresh" );
						}
					},
					errorHandler
				);
			}
		);
		e.stopPropagation();
		e.preventDefault();
		return false;
    });
    
     //add reminder when click on add button
    $("#addreminderid").live( "touchend", function(e) {
        $.mobile.changePage( "#setreminder", { transition: "none", changeHash: true });
        $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
	
        $('#hours option[value="01"]').attr('selected', 'selected');
        $("#hours-button span").html("01");
        $('#minutes option[value="00"]').attr('selected', 'selected');
        $("#minutes-button span").html("00");
        $('#AMPM option[value="AM"]').attr('selected', 'selected');
        $("#AMPM-button span").html("AM");
        $("#repeatlabelid").html("None");
		e.stopPropagation();
		e.preventDefault();
    });
  
    $("#savereminderbtn").live("touchend",function(e){
        var nvReminderid = sessionStorage.reminderid;
        var nvHours = $.trim($('#hours').val());
        var nvMinutes = $.trim($('#minutes').val());
        var nvAMPM = $.trim($('#AMPM').val());
   
		if ($('#everysunday').is(':checked')) {
			var nvEverysunday = $.trim($('#everysunday').val());
		} else {
			var nvEverysunday = "";
		}
	   
		if ($('#everymonday').is(':checked')) {
			var nvEverymonday = $.trim($('#everymonday').val());
		} else {
			var nvEverymonday = "";
		}
	   
		if ($('#everytuesday').is(':checked')) {
			var nvEverytuesday = $.trim($('#everytuesday').val());
		} else {
			var nvEverytuesday = "";
		}
	   
		if ($('#everywednesday').is(':checked')) {
			var nvEverywednesday = $.trim($('#everywednesday').val());
		} else {
			var nvEverywednesday = "";
		}
	   
		if ($('#everythursday').is(':checked')) {
			var nvEverythursday = $.trim($('#everythursday').val());
		} else {
			var nvEverythursday = "";
		}
	   
		if ($('#everyfriday').is(':checked')) {
			var nvEveryfriday = $.trim($('#everyfriday').val());
		} else {
			var nvEveryfriday = "";
		}
	   
		if ($('#everysaturday').is(':checked')) {
			var nvEverysaturday = $.trim($('#everysaturday').val());
		} else {
			var nvEverysaturday = "";
		}
		
		if(nvEverysaturday=="" && nvEveryfriday=="" && nvEverythursday=="" && nvEverywednesday=="" && nvEverytuesday=="" && nvEverymonday=="" && nvEverysunday=="") {
			var d = new Date();
			var n = d.getDay();
			if(n=="0") {
			nvEverysunday = "sun";
			} else if(n=="1") {
			nvEverymonday = "mon";
			} else if(n=="2") {
			nvEverytuesday = "tue";
			} else if(n=="3") {
			nvEverywednesday = "wed";
			} else if(n=="4") {
			nvEverythursday = "thu";
			} else if(n=="5") {
			nvEveryfriday = "fri";
			} else {
			nvEverysaturday ="sat";
			}
		}
        
       var nvReminderlbl = $.trim($('#txtreminderlbl').val());
       if(nvReminderid=="") {
            var nvOnOff = "ON";
            mydb.transaction(
                function(transaction) {
                    transaction.executeSql(
                        'INSERT INTO remindertable (hours, minutes, ampm, sunday, monday, tuesday, wednesday, thursday, friday, saturday, remindername, onoff) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                        [nvHours, nvMinutes, nvAMPM, nvEverysunday, nvEverymonday, nvEverytuesday, nvEverywednesday, nvEverythursday, nvEveryfriday, nvEverysaturday, nvReminderlbl, nvOnOff],
                            function(){
                                $.mobile.changePage( "#reminderlist", { transition: "none", changeHash: true });
                                $("#delreminder").hide();
                                return false;
                            },
                        errorHandler
                    );
                }
            );
       } else {
            var id = nvReminderid;
            mydb.transaction(
                function(transaction) {
                    transaction.executeSql(
                        'UPDATE remindertable SET hours=?, minutes=?, ampm=?, sunday=?, monday=?, tuesday=?, wednesday=?, thursday=?, friday=?, saturday=?, remindername=? WHERE id = ?',
                        [nvHours, nvMinutes, nvAMPM, nvEverysunday, nvEverymonday, nvEverytuesday, nvEverywednesday, nvEverythursday, nvEveryfriday, nvEverysaturday, nvReminderlbl, id],
                        function(){
                            $.mobile.changePage( "#reminderlist", { transition: "none", changeHash: true });
                            $("#delreminder").hide();
                            return false;
                        },
                    errorHandler
                    );
                }
            );
        }
		e.stopPropagation();
		e.preventDefault();
        return false;
   });
    
    $("#delreminder").live("tap",function(e){
        var nvReminderid = sessionStorage.reminderid;
        var id = nvReminderid;
        mydb.transaction(
            function(transaction) {
                transaction.executeSql(
                    'DELETE FROM remindertable WHERE id = ?',
                    [id],
                    function(){
                        $("input[type='checkbox']").prop("checked",false);
                        //$("#repeatlabelid").html("None");
                        $("#delreminder").hide();
                        $.mobile.changePage( "#reminderlist", { transition: "none", changeHash: true });
                        return false;
                    },
                    errorHandler
                );
            }
        );
		e.stopPropagation();
		e.preventDefault();
    });
    
    $("#graphswipe").live("swipeleft",function(e){
        
        var IDYear = sessionStorage.Sqlyear;
        var NextYear = parseInt(IDYear) + 1;
        
        var today = new Date();
        var CurIDYear = today.getFullYear();
        
        if(CurIDYear>=NextYear) {
            graphrefreshfunc(NextYear, IDYear);
        }
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    $("#graphswipe").live("swiperight",function(e){
        //alert("swiperight");
        var IDYear = sessionStorage.Sqlyear;
        var NextYear = parseInt(IDYear) - 1;
        
        graphrefreshfunc(NextYear, IDYear);
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
  $("#container").live("swipeleft",function(e){
                        
        var IDYear = sessionStorage.Sqlyear;
        var NextYear = parseInt(IDYear) + 1;
                        
        var today = new Date();
        var CurIDYear = today.getFullYear();
                    
        if(CurIDYear>=NextYear) {
            graphrefreshfunc(NextYear, IDYear);
        }
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    $("#container").live("swiperight",function(e){
        //alert("swiperight");
        var IDYear = sessionStorage.Sqlyear;
        var NextYear = parseInt(IDYear) - 1;
        graphrefreshfunc(NextYear, IDYear);
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
    
    //reminder list when reminderlist pageshow
    $("#find").live( "pageshow", function(e) {
	$("#geolocfindachirobtn").removeClass('ui-disabled');
		/*var nvHei = window.innerHeight;
		var nvHei = parseInt(nvHei) - 100;
		var x = document.createElement("IFRAME");
		x.setAttribute("src", "http://www.tweeqinfo.com");
		x.setAttribute("width", "100%");
		x.setAttribute("height", ""+nvHei+"");
		x.setAttribute("seamless", "true");
		$("#iframedivid").append(x);*/

        sessionStorage.currentLat = "";
        sessionStorage.currentLng = "";
        $('#find [data-icon="grid"]:eq(3)').addClass("ui-btn-active");
        checkConnection();
        //analytics.trackView('Find A Chiro Page');
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

	
	$("#find").live( "pagehide", function(e) {
		//$("#iframedivid").empty();
		e.stopPropagation();
		e.preventDefault();
        return false;
    });
  
    $(".bloglicls").live("tap",function(e){
        var blogid = this.id;
        sessionStorage.blogsid = blogid;
        $.mobile.changePage( "#blog-inside", { transition: "none", changeHash: true });
		e.stopPropagation();
		e.preventDefault();
        return false;
    });

	$(".wsdcheckcls").live("tap",function(e){
		wsdcheckfunc();
        e.stopPropagation();
		e.preventDefault();
        return false;
    });
});

function onDeviceReady() {
    //new FastClick(document.body);
	$.mobile.allowCrossDomainPages = true;
    $.mobile.touchOverflowEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = false;
    $.mobile.page.prototype.options.domCache = true;
    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if(deviceType=="Android") {
        document.addEventListener("backbutton", onBackKeyDown, false);
    }
	wsdservicefunc();
	//analytics.startTrackerWithId('UA-55304817-2');
}


//Sqlite database function
function createDatabase() {
    try {
        if (!window.openDatabase) {
            navigator.notification.alert("Databases are not supported in this browser",alertDismissed,"Databases","Ok");
        } else {
            var shortName = 'sqlite_straightenup';
            var version = '1.0';
            var displayName = 'sqlite_straightenup db';
            var maxSize = 1024*1024*2;
            mydb = openDatabase(shortName, version, displayName, maxSize, null);
            
            mydb.transaction(
                function (t) {
                    t.executeSql(
                        'CREATE TABLE IF NOT EXISTS user_profile ' +
                        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                        ' code TEXT NULL, codestatus TEXT NULL, videostatus TEXT NULL, languagestatus TEXT NULL);',
                        [],
                        nullDataHandler,
                    errorHandler
                    );
                }
            );
			
			mydb.transaction(
                function (transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS trackinfo ' +
                        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + ' eid TEXT NULL, name TEXT NULL, url TEXT NULL, start TEXT NULL, end TEXT NULL, summary TEXT NULL, lockstatus TEXT NULL, year INTEGER NULL, month INTEGER NULL, day INTEGER NULL, points DEFAULT 1 NOT NULL);',
                        [],
                        nullDataHandler,
                    errorHandler
                    );
                }
            );
			
			mydb.transaction(
                function (transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS remindertable ' +
                        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + ' hours TEXT NULL, minutes TEXT NULL, ampm TEXT NULL, sunday TEXT NULL, monday TEXT NULL, tuesday TEXT NULL, wednesday TEXT NULL, thursday TEXT NULL, friday TEXT NULL, saturday TEXT NULL, remindername TEXT NULL, onoff TEXT NULL );',
                        [],
                        nullDataHandler,
                    errorHandler
                    );
                }
            );
            CheckUserSelLanguage();
        }
    } catch(e) {
        if (e == 2) {
            navigator.notification.alert("Invalid database version.",alertDismissed,"Invalid","Ok");

        } else {
            navigator.notification.alert("Unknown error "+e+".",alertDismissed,"Error","Ok");
        }
        return;
    }
    return false;
}

//database error message
function errorHandler(transaction, error){
    if (error.code==1){
        navigator.notification.alert("DB Table already exists",alertDismissed,"Exists","Ok");

    } else {
        navigator.notification.alert("Oops.  Error was "+error.message+"",alertDismissed,"Exists","Ok");
    }
    return false;
}

//database Succeeded message
function nullDataHandler(){
    //alert("SQL Query Succeeded");
}

function alertDismissed() {
    // do something
}

//Check User Select Language function
function CheckUserSelLanguage() {
    mydb.readTransaction(
        function (t) {
            t.executeSql("SELECT * FROM user_profile", [],CheckTheUserLanguageStatusFunc,errorHandler);
        }
    );
}

//get Check User Select Language function
function CheckTheUserLanguageStatusFunc(t, results){
    if(results.rows.length==0) {
        var nvLang = 0;
        sessionStorage.currentLang = nvLang;
        //LanguageFunc(nvLang);
        usercode = "0";
        usercodestatus = "No";
        uservideostatus = "No";
        mydb.transaction(
            function(transaction) {
                transaction.executeSql(
                    'INSERT INTO user_profile (code, codestatus, videostatus) VALUES (?, ?, ?);',
                    [usercode, usercodestatus, uservideostatus],
                    function(){
                        $.mobile.changePage( "#intro-landing-page-a", { transition: "none", changeHash: true });
                        return false;
                    },
                    errorHandler
                );
            }
        );
        return false;
    }
    else
    {
        for (var i=0; i<results.rows.length; i++)
        {
            var row = results.rows.item(i);
            var nvLangId = row.languagestatus;
            sessionStorage.currentLang = nvLangId;
            //LanguageFunc(nvLang);
            for (var i=0; i<results.rows.length; i++) {
                var row = results.rows.item(i);
                if(row.languagestatus==null) {
                    var nvSt = "No";
                } else {
                    var nvSt = "Yes";
                }
		
                if(nvSt=="No") {
                    $.mobile.changePage( "#intro-landing-page-a", { transition: "none", changeHash: true });
                    return false;
                } else {
                    var nvLangFileName = "LangId"+Math.floor(nvLangId)+".json";
                    changelanguagefunc(nvLangFileName);
					wsdcheckfunc();
					//$.mobile.changePage( "#landing-page", { transition: "none", changeHash: true });
                    return false;
                }
            }
            return false;
        }
    }
}


function selectlanguagefunc(nvLang) {
    var id = 1;
    langstatus = nvLang;
    mydb.transaction(
		function(transaction) {
			transaction.executeSql(
			'UPDATE user_profile SET languagestatus = ? WHERE id = ?',
			[langstatus, id],
			function(){
				return false;
			},
			errorHandler
			);
		}
    );
}

//calendar refresh and graph function
function calendarrefresh() {
	var nvLangId = sessionStorage.currentLang;
	var ID = 1;
	mydb.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM trackinfo WHERE ? ORDER BY id ASC;',
                [ID],
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++)
                    {
                        var row = result.rows.item(i);
                        var startdate = row.start;
                        var date2 = new Date(startdate);
                        date2.setMinutes(date2.getMinutes() + 600);
                        eventsArray.push({"eid":"1","name":"My event 1","url":"#","start":date2,"end":date2,"summary":"StraightenUp."});
                    }
                           
                    $("#engcalendar").jqmCalendar({
						events : eventsArray,
						days : [""+dayArray[nvLangId][0]+"", ""+dayArray[nvLangId][1]+"", ""+dayArray[nvLangId][2]+"", ""+dayArray[nvLangId][3]+"", ""+dayArray[nvLangId][4]+"", ""+dayArray[nvLangId][5]+"", ""+dayArray[nvLangId][6]+""],
						startOfWeek : 0
					});
                                            
                    if(startdate!=undefined) {
                        $("#engcalendar").trigger('refresh', new Date(startdate));
                    }
                },
                errorHandler
            );
        }
    );
    $(".dayName0").html(dayArray[nvLangId][0]);
	$(".dayName1").html(dayArray[nvLangId][1]);
	$(".dayName2").html(dayArray[nvLangId][2]);
	$(".dayName3").html(dayArray[nvLangId][3]);
	$(".dayName4").html(dayArray[nvLangId][4]);
	$(".dayName5").html(dayArray[nvLangId][5]);
	$(".dayName6").html(dayArray[nvLangId][6]);
	$("#engcalendar").show();
    var today = new Date();
    var IDYear = ""+today.getFullYear()+"";
    var NextYear = parseInt(IDYear) + 1;
    graphrefreshfunc(IDYear, NextYear);
    return false;
}

// check last Exercise function
function checkExerciseNextButton() {
    
    var  nvFor = sessionStorage.foryouthadults;
    
    if(nvFor==1) {
	if($(".adultexercisesinsidelist .showhideexercisecls:visible").next(".adultexercisesinsidelist .showhideexercisecls:hidden").length <= 0) {
	    $("#excersisenext").hide();
	} else {
	    $("#excersisenext").show();
	}
    } else {
	if($(".youthexercisesinsidelist .showhideexercisecls:visible").next(".youthexercisesinsidelist .showhideexercisecls:hidden").length <= 0) {
	    $("#excersisenext").hide();
	} else {
	    $("#excersisenext").show();
	}
    }
    
    videopausefunc();
    return false;
}

// check internet connection function
function checkConnection() {
	
	var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'UnknownConnection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'NONE';
    
    if(states[networkState]=="NONE")
    {
		var nvMsg = sessionStorage.NetAlertMsg;
        var nvTit = sessionStorage.NetPopTitle;
        var nvOk = sessionStorage.DoneBtn;
        
        navigator.notification.alert(""+nvMsg+"",alertDismissed,""+nvTit+"",""+nvOk+"");
        return false;
        //alert(alertmsg);
    }
}

function blogpagefunc(LangUlr) {
    $.ajax({
        url: LangUlr,
        dataType: 'json',
        type: 'get',
        cache: true,
        success: function(data) {
            $(data.labeljson).each(function(index, value) {
                fetchblogdatafunc(value.blogsurl);
            });
        }
    });
    return false;
}

function fetchblogdatafunc(rssfeedUrl) {
	$('#bloglistview').empty();
    $('#bloglistview').rssfeed(''+rssfeedUrl+'',{snippet: false}, function(e) {});
    return false;
}

//Get current position function
function geoloc(success, fail, mapid, fromlat, fromlon)
{	
	navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        success(lat, lng, mapid, fromlat, fromlon);
    }, function(error) {
        fail(mapid, fromlat, fromlon);
    }, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
	
}

//Get current position success function
function success(lat, lng, mapid, fromlat, fromlon) {
    sessionStorage.currentLat = lat;
    sessionStorage.currentLng = lng;
    $("#lat").val(lat);
    $("#lng").val(lng);
    $("#geolocfindachirobtn").removeClass('ui-disabled');
    setmarkerfunc(lat,lng,mapid,fromlat,fromlon);
}

//Get current position fail function
function fail(mapid, fromlat, fromlon)
{
    var nvLang = sessionStorage.currentLang;
    var nvLang = parseInt(nvLang);
    var nvMsg = sessionStorage.GeoAlertMsg;
    var nvTit = sessionStorage.PopTitle;
    var nvOk = sessionStorage.DoneBtn;
    $("#geolocfindachirobtn").removeClass('ui-disabled');
    navigator.notification.alert(""+nvMsg+"",alertDismissed,""+nvTit+"",""+nvOk+"");
    return false;
}

//Set marker function
function setmarkerfunc(latval,lonval,mapdivid,fromlat,fromlon)
{
    //var geocoder = new google.maps.Geocoder();
    //var infowindow = new google.maps.InfoWindow();
    $.mobile.changePage( "#find-search-02", { transition: "none", changeHash: true });
    //findachirosearchfunc("findachironearmefrom");
}

//Set multi marker function
function multisetmarkerfunc(latval,lonval,maps,i,address) {
    
    if(latval!=0 && lonval!=0) {
        
        var point = new google.maps.LatLng(latval, lonval);
        var marker = new google.maps.Marker({
                    map: maps,
                    position: point,
                    title: address,
                    icon: "http://chiropractic.ca/mapicon/marker_red"+i+".png"
                });
        
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(this.title);
                infowindow.open(maps, this);
            });
        //maps.setCenter({lat: ''+latval+'', lng: ''+lonval+''});
        //map.setCenter(point);
        google.maps.event.trigger(maps, 'resize');
	}
}


function setZoomForMapFunc(markers) {
    
	if(markers>=100) {
		return 7;
	} else if(markers>=40) {
		return 8;
	} else if(markers>=30) {
		return 9;
	} else if(markers>=20) {
		return 9;
	} else if(markers>=10) {
		return 10;
	} else if(markers>=5) {
		return 11;
	} else if(markers>=3) {
		return 12;
	} else if(markers>=2) {
		return 13;
	} else {
		return 14;
	}
}

//find a chiro search and google map function
function findachirosearchfunc(formperameter) {
    
	var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'UnknownConnection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'NONE';
    if(states[networkState]!="NONE"){
		if(sessionStorage.currentLat=="" && sessionStorage.currentLng=="") {
			latlon=new google.maps.LatLng(42.9846784, -79.2143739);
		} else {
			var lat = sessionStorage.currentLat;
			var lng = sessionStorage.currentLng;
			latlon=new google.maps.LatLng(lat, lng);
		}
		radval = 20;
		var myOptions={
			center:latlon,zoom:(radval) ? setZoomForMapFunc(20) : 10,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false,
			scrollwheel:false,
			panControl: false,
			zoomControl:true,
			streetViewControl:false,
			navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		
		$("#findachirosearchlistview").empty();
		
		var searchData = $('#'+formperameter+'').serialize();
		var nvMarNo = 1;
		var nvfindsearchUrl = sessionStorage.findsearchUrl;
		$.getJSON(""+nvfindsearchUrl+"?"+searchData,function(result){
			if(result.response.count!=0) {
				var bounds=new google.maps.LatLngBounds();
				$.each(result.response.data, function(index, responseEach){
					var address = '<div class="info-content"><div class="loc-name">'+responseEach.name+'</div><div class="loc-addr">'+responseEach.addressline1+'</div></div>';
					if(responseEach.lat!=null) {
						multisetmarkerfunc(responseEach.lat,responseEach.lng,map,nvMarNo,address);
						bounds.extend(new google.maps.LatLng(responseEach.lat,responseEach.lng));
					}
					var nvClinic = "";
					if(responseEach.clinicname!=false) {
						var nvClinic = responseEach.clinicname+'<br>';
					}
					$("#findachirosearchlistview").append('<li id="'+responseEach.Id+'"><a href="javascript:;"><h3>'+responseEach.name+'</h3><p>'+nvClinic+''+responseEach.addressline1+' '+responseEach.addressline2+' '+responseEach.city+' '+responseEach.state+' '+responseEach.postalcode+' '+responseEach.phone+'</p></a></li>');
					nvMarNo = nvMarNo + 1;
				});
				map.fitBounds(bounds);
				  
			} else {
				$("#findachirosearchlistview").append('<span><a href="javascript:;"><h3>Sorry! No Result found</h3></a></span>');
			}
			$('#findachirosearchlistview').listview('refresh');
		});
	} else {
		$("#findachirosearchlistview").empty();
		$("#findachirosearchlistview").html('<span><a href="javascript:;"><h3>Sorry! '+sessionStorage.NetPopTitle+'</h3></a></span>');
	}
    return false;
}


function graphrefreshfunc(IDYear, NextYear) {
    var nvIDYear = IDYear;
    mydb.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM trackinfo WHERE year=? GROUP BY month ORDER BY year, month;',
                [IDYear],
                function (transaction, result) {
                    var nvNo = 0;
                    var nvNoOfRec = result.rows.length;
                                   
                    if(result.rows.length>0){
                        sessionStorage.Sqlyear = nvIDYear;
                        $("#graphswipe").show();
                    }
                                   
                    for (var i=0; i < result.rows.length; i++)
                    {
                        var row = result.rows.item(i);
                        var IDMonth = ""+row.month+"";
                        var IDYear = ""+row.year+"";
                                            
                        var nvYC = [];
                        var nvXP = [];
                        transaction.executeSql(
                            'SELECT COUNT(points) AS CNumber, month, year FROM trackinfo WHERE month=? AND year=? ORDER BY year, month;',
                            [IDMonth,IDYear],
                            function (transaction, result) {
                                for (var i=0; i < result.rows.length; i++)
                                {
                                    var row = result.rows.item(i);
                                    var nvTYear = row.year;
                                    nvYC.push(row.month+"/"+String(nvTYear).slice(-2));
                                    nvXP.push(row.CNumber);
                                    nvNo = nvNo + 1;
                                }
                                
                                if(nvNo==nvNoOfRec) {
                                    //$("#container").css({"min-width":"69%","width":"99%","height":"auto"});
                                    var nvLang = sessionStorage.currentLang;
                                    var nvLang = parseInt(nvLang);
                                    //var nvTitltMo = graphTitleArray[nvLang];
                                    var nvTitltMo = sessionStorage.GraphTitle;
                                    
                                    $('#container').highcharts({
                                        chart: {
                                            type: 'line'
                                        },
                                        title: {
                                            text: ''+nvTitltMo+''
                                        },
                                        subtitle: {
                                            text: ''
                                        },
                                        xAxis: {
                                            categories: nvYC
                                        },
                                        yAxis: {
                                            allowDecimals: false,
                                            title: {
                                                text: ''
                                            }
                                        },
                                        plotOptions: {
                                            line: {
                                                dataLabels: {
                                                    enabled: true
                                                },
                                                enableMouseTracking: false
                                            }
                                        },
                                        series: [{
                                            name: '',
                                            data: nvXP
                                        }]
                                    });
                                }
                            },
                            errorHandler
                        );
                    }
                    //$('#calendar').trigger('refresh');
                },
                errorHandler
            );
        }
    );
    return false;
}

function videoEnded() {
    var curdate = new Date();
    graphyear = curdate.getFullYear();
    graphmonth = curdate.getMonth();
    graphday = curdate.getDate();
    nvdate = new Date(graphyear, graphmonth, graphday);
    var thisval = nvdate.valueOf();
    var currentID = ""+thisval+"";
	mydb.transaction(
	    function(transaction) {
		transaction.executeSql(
		    'SELECT * FROM trackinfo WHERE eid=? ORDER BY id;',
		    [currentID],
		    function (transaction, result) {
				var lenghtval = result.rows.length;
				if(lenghtval==0) {
					var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
					if(deviceType!="BlackBerry" && deviceType!="null") {
						$.mobile.changePage( "#saveexerciseinfo", { transition: "none", changeHash: true });
					} else {
						$.mobile.changePage( "#saveexerciseinfo", { transition: "none", changeHash: true });
						nvLang = sessionStorage.currentLang;
						var nvLangFileName = "LangId"+Math.floor(nvLang)+".json";
						changelanguagefunc(nvLangFileName);
					}
				} else {
				}
		    },
		errorHandler
		);
	    }
	);
}

//set reminder notification function
function setremindarmessage(reminderObj){
    //cordova.plugins.notification.local.schedule(reminderObj);
}

//refredh reminder function
function reminderfunc() {
	window.plugin.notification.local.cancelAll();
    
    var nvLang = sessionStorage.currentLang;
    var nvLang = parseInt(nvLang);
    //var nvRemiMsg = remiMsgArray[nvLang];
    var nvRemiMsg = sessionStorage.ReminderMsg;
    
    var reminderArray = [];
    var a = [];
    var ID = 1;
    mydb.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM remindertable WHERE ? ORDER BY id ASC;',
                [ID],
                function (transaction, result) {
                    $('#reminderlistview').empty();
                    for (var i=0; i < result.rows.length; i++)
                    {
                        var row = result.rows.item(i);
                        var nvday = "";
                        if(row.sunday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.sunday});
                            }
                            nvday +=dayArray[nvLang][0]+"&nbsp;";
                        }
                        if(row.monday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.monday});
                            }
                            nvday +=dayArray[nvLang][1]+"&nbsp;";
                        }
                        if(row.tuesday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.tuesday});
                            }
                            nvday +=dayArray[nvLang][2]+"&nbsp;";
                        }
                        if(row.wednesday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.wednesday});
                            }
                            nvday +=dayArray[nvLang][3]+"&nbsp;";
                        }
                        if(row.thursday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.thursday});
                            }
                            nvday +=dayArray[nvLang][4]+"&nbsp;";
                        }
                        if(row.friday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.friday});
                            }
                            nvday +=dayArray[nvLang][5]+"&nbsp;";
                        }
                        if(row.saturday!="") {
                            if(row.onoff=="ON") {
                                reminderArray.push({"hours":row.hours,"minutes":row.minutes,"ampm":row.ampm,"day":row.saturday});
                            }
                            nvday +=dayArray[nvLang][6]+"&nbsp;";
                        }
                        $("#reminderlistview").prepend('<li><a href="javascript:;" class="reminderjscls" id="'+row.id+'"><h2>'+row.hours+":"+row.minutes+' <span>'+row.ampm+'</span></h2><p>'+nvday+'</p></a><div id="'+row.id+'" class="flipclickcls ui-flipswitch-active flipclickcls'+row.id+' ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all"><a href="javascript:;" class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit">On</a><span class="ui-flipswitch-off">Off</span></div></li>');
                                            
                        if(row.onoff=="ON") {
                            $('.flipclickcls'+row.id+'').removeClass("ui-flipswitch-active");
                        }
                    }

                    $.each(reminderArray, function(index, responseEach){
                        var nvHours = responseEach.hours;
                        if(responseEach.ampm=="PM") {
                            var nvAddHours = responseEach.hours;
                            if(nvHours==12) {
                                var nvHours = 12;
                            } else {
                                var nvHours = parseInt(nvAddHours) + 12;
                            }
                        } else {
                           if(nvHours==12) {
                            var nvHours = 0;
                           }
                        }
                        var d = new Date();
                        var ndNes = d.getDay()
                        if(responseEach.day=="sun") {
                            var nvDif = 0 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else if(responseEach.day=="mon") {
                            var nvDif = 1 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else if(responseEach.day=="tue") {
                            var nvDif = 2 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else if(responseEach.day=="wed") {
                            var nvDif = 3 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else if(responseEach.day=="thu") {
                            var nvDif = 4 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else if(responseEach.day=="fri") {
                            var nvDif = 5 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        } else {
                            var nvDif = 6 - ndNes;
                            if (nvDif>=0) {
                                var nvAdd = nvDif;
                            } else {
                                var nvAdd = 7 - Math.abs(nvDif);
                            }
                        }
                           
                        graphyear = d.getFullYear();
                        graphmonth = d.getMonth();
                        graphday = d.getDate() + nvAdd;
                        nvdate = new Date(graphyear, graphmonth, graphday);
                        var nvDt = new Date(nvdate);
                        nvDt.setHours(nvHours);
                        nvDt.setMinutes(responseEach.minutes);
                        nvDt.setSeconds(00);
                        //setremindarmessage(nvDt,nvRemiMsg);
                           
                        var now = new Date(nvDt).getTime();
                        var nvCurNow = new Date().getTime();
                        if(now>=nvCurNow) {
                            _5_sec_from_now = new Date(now + 1 * 1000);
                            var nvId = (Math.floor((Math.random() * 100000) + 1)).toFixed(0);
                            var nvId = parseInt(nvId);
                            a.push({id: nvId,text: ""+nvRemiMsg+"",at: _5_sec_from_now});
                        }
                    });
                    //setremindarmessage(a);
                    cordova.plugins.notification.local.schedule(a);
                                            
                    $('#reminderlistview').listview('refresh');
                                        //remindereventbind();
                },
                errorHandler
            );
        }
    );
    return false;
}

function callback(){
    
}

function scope(){
    
}

function onBackKeyDown() {
    if($.mobile.activePage.is("#landing-page")){
        navigator.app.exitApp();
    } else if($.mobile.activePage.is("#poster")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#intro-landing-page-a")) {
		navigator.app.exitApp();
	} else if($.mobile.activePage.is("#intro-landing-page-b")) {
		navigator.app.exitApp();
	} else if($.mobile.activePage.is("#reminderlist")) {
		$.mobile.changePage($("#poster"), { transition: "none"});
	} else if($.mobile.activePage.is("#setreminder")) {
		$.mobile.changePage($("#reminderlist"), { transition: "none"});
	} else if($.mobile.activePage.is("#blog-index")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#about-index")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#settings-page")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#find")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#find-search-02")) {
		$.mobile.changePage($("#find"), { transition: "none"});
	} else if($.mobile.activePage.is("#find-search-03")) {
		$.mobile.changePage($("#find-search-02"), { transition: "none"});
	} else if($.mobile.activePage.is("#know")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#know-inside-body")) {
		$.mobile.changePage($("#know"), { transition: "none"});
	} else if($.mobile.activePage.is("#excercises")) {
		$.mobile.changePage($("#landing-page"), { transition: "none"});
	} else if($.mobile.activePage.is("#seasonal-home-page")) {
		navigator.app.exitApp();
	} else {
		navigator.app.backHistory();
	}
}

function videopausefunc() {
    $("video").each(function() {
        $(this).get(0).pause();
    });
}

function changelanguagefunc(LangUlr) {
    $(".adultexercisesinsidelist").empty();
    $(".youthexercisesinsidelist").empty();
    $("#playallvideoid").empty();
    //$("#flipswitchbtnid").empty();
    $(".adultexerciseslist").empty();
    $(".youthexerciseslist").empty();
    $("#knowmainid").empty();
	$("#graphval").val("");
    $.ajax({
        url: LangUlr,
        dataType: 'json',
        type: 'get',
        cache: true,
        async: false,
        success: function(data) {
           $(data.labeljson).each(function(index, value) {
                                  
                $(".settingstitle").html(value.settingstitle);
                $(".defaultxtcls").html(value.defaultxtcls);
                $(".langtxtcls").html(value.langtxtcls);
                $(".aboutapptxtcls").html(value.aboutapptxtcls);
				$(".privacypagelink").html('<a onclick="window.open(\''+value.privacylink+'\', \'_system\');">'+value.privacytxt+'<span><img src="images/arw/blue-small-arw.png" alt="search" /></span></a>');
                $(".faqspagelink").html('<a onclick="window.open(\''+value.faqslink+'\', \'_system\');">'+value.faqstxt+'<span><img src="images/arw/blue-small-arw.png" alt="search" /></span></a>');
                $(".versiontxtcls").html(value.versiontxtcls);
                $(".landingtxtcls").html(value.landingtxtcls);
				
				$("#introvideomainid").html('<video id="introvideoid" width="320" preload="none" controls poster="'+value.introimg+'" onended="wsdcheckfunc()"><source src="'+value.introvideo+'" type="video/mp4"></video>');
                $("#infointrovideomainid").html('<video id="infointrovideoid" width="320" preload="none" controls poster="'+value.infoimg+'"><source src="'+value.infovideo+'" type="video/mp4"></video>');
                
                                  
                $('[data-icon="myapp-home"]').html(value.home);
                $('[data-icon="myapp-excercises"]').html(value.exercisetxtcls);
                $('[data-icon="myapp-tracker"]').html(value.tracktxtcls);
                $('[data-icon="myapp-your-back"]').html(value.kybtxtcls);
                $('[data-icon="myapp-find-chiro"]').html(value.factxtcls);
                $('[data-icon="myapp-blog"]').html(value.blogtxtcls);
                $('[data-icon="myapp-chiro"]').html(value.aboutchirotxtcls);
                $('[data-icon="myapp-setting"]').html(value.settingstitle);
                $('.excercises-btn').html(value.exercisetxtcls);
                $('.track-btn').html(value.tracktxtcls);
                $('.know-btn').html(value.kybtxtcls);
                $('.find-btn').html(value.factxtcls);
                                  
                $(".introtitle").html(value.introtitle);
                $(".skiptxtcls").html(value.skiptxtcls);
                                  
                $(".langtitle").html(value.langtitle);
                $(".exercisetxtcls").html(value.exercisetxtcls);
                $(".tracktxtcls").html(value.tracktxtcls);
                $(".kybtxtcls").html(value.kybtxtcls);
                $(".factxtcls").html(value.factxtcls);
                $(".playalltxtcls").html(value.playalltxtcls);
                $(".nexttxtcls").html(value.nexttxtcls);
                                  
                $(".usecurtxtcls").html(value.usecurtxtcls);
                $(".ortxtcls").html(value.ortxtcls);
                $(".searchtxtcls").html(value.searchtxtcls);
                $(".posttxtcls").html(value.posttxtcls);
				$('#postal-code').attr("placeholder",""+value.posttxtcls+"");
                $(".firsttxtcls").html(value.firsttxtcls);
				$('#first-name').attr("placeholder",""+value.firsttxtcls+"");
                $(".lasttxtcls").html(value.lasttxtcls);
				$('#last-name').attr("placeholder",""+value.lasttxtcls+"");
                $(".citytxtcls").html(value.citytxtcls);
				$('#city').attr("placeholder",""+value.citytxtcls+"");
                $(".provincetxtcls").html(value.provincetxtcls);
                $(".seltxtcls").html(value.seltxtcls);
                $(".albertatxtcls").html(value.albertatxtcls);
                $(".britishtxtcls").html(value.britishtxtcls);
                $(".manitobatxtcls").html(value.manitobatxtcls);
                $(".brunswicktxtcls").html(value.brunswicktxtcls);
                $(".foundlandtxtcls").html(value.foundlandtxtcls);
                $(".novatxtcls").html(value.novatxtcls);
                $(".ontariotxtcls").html(value.ontariotxtcls);
                $(".princetxtcls").html(value.princetxtcls);
                $(".quebecatxtcls").html(value.quebecatxtcls);
                $(".saskatchewanatxtcls").html(value.saskatchewanatxtcls);
                $("#lang").val(value.languageval);
                $("#lang1").val(value.languageval);
                $("#within").val(value.within);
                $("#mobile").val(value.mobile);
                $("#mobile1").val(value.mobile);
				sessionStorage.findsearchUrl = value.findsearchUrl;
				sessionStorage.biourl = value.biourl;
                                  
                $(".backtxtcls").html(value.backtxtcls);
                $(".setremtxtcls").html(value.setremtxtcls);
                $(".addtxtcls").html(value.addtxtcls);
                                  
                $(".workouttxtcls").html(value.workouttxtcls);
                $(".logexittxtcls").html(value.logexittxtcls);
                $(".canceltxtcls").html(value.canceltxtcls);
				
				var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
				if(deviceType!="BlackBerry" && deviceType!="null") {
					$(".publishonfbcls").html('<a href="#" onclick="window.plugins.socialsharing.shareViaFacebook(\''+value.facebooksharingmsg+'\', null, \''+value.appwebsite+'\', function() {console.log(\'share ok\')})" class="langsocfacebookcls">'+value.publishonfbcls+'</a>');
					$(".twitternowcls").html('<a href="#" onclick="window.plugins.socialsharing.shareViaTwitter(\''+value.twittersharingmsg+'\', null, \''+value.appwebsite+'\')" class="langsoctweetcls">'+value.twitternowcls+'</a>');
					$(".emailtofrncls").html('<a href="#" onclick="window.plugins.socialsharing.share(\''+value.emailsharingmsg+' '+value.appwebsite+'\')" class="langemailtocls">'+value.emailtofrncls+'</a>');
				} else {
					$(".publishonfbcls").html(value.publishonfbcls);
					$(".twitternowcls").html(value.twitternowcls);
					$(".emailtofrncls").html(value.emailtofrncls);
					sessionStorage.nvFbShareing = value.facebooksharingmsg;
					sessionStorage.nvTwShareing = value.twittersharingmsg;
					sessionStorage.nvEmailToFrn = value.emailsharingmsg;
					sessionStorage.nvAppWebside = value.appwebsite;
				}
				                  
                $(".vbmtxtcls").html(value.vbmtxtcls);
                $(".headtxtcls").html(value.headtxtcls);
                $(".necktxtcls").html(value.necktxtcls);
                $(".shouldertxtcls").html(value.shouldertxtcls);
                $(".midtxtcls").html(value.midtxtcls);
                $(".lowertxtcls").html(value.lowertxtcls);
                $(".hiptxtcls").html(value.hiptxtcls);

                $(".savetxtcls").html(value.savetxtcls);
                $(".repeattxtcls").html(value.repeattxtcls);
                $(".delremtxtcls").html(value.delremtxtcls);
                $('[for="everysunday"]').html(value.suntxtcls);
                $('[for="everymonday"]').html(value.montxtcls);
                $('[for="everytuesday"]').html(value.tuetxtcls);
                $('[for="everywednesday"]').html(value.wedtxtcls);
                $('[for="everythursday"]').html(value.thutxtcls);
                $('[for="everyfriday"]').html(value.fritxtcls);
                $('[for="everysaturday"]').html(value.sattxtcls);
                                  
                $(".taptologtxtcls").html(value.taptologtxtcls);
                $("#graphswipe").html(value.graphswipe);
                $(".remindertxtcls").html(value.remindertxtcls);
                $(".addedittxtcls").html(value.addedittxtcls);
                                  
                $(".abouttitle").html(value.abouttitle);
                $("#aboutmainid").html(value.aboutmainid);
                $(".bodymaptxtcls").html(value.bodymaptxtcls);
                $(".blogtxtcls").html(value.blogtxtcls);
                $(".kybtitle").html(value.kybtitle);
                $(".viewbodytxtcls").html(value.viewbodytxtcls);
                $(".continuetxtcls").html(value.continuetxtcls);
                $(".continueimgcls").attr("src",value.continueimgcls);
                $('#flipswitchbtnid a:eq(0)').html(value.foradulttxtcls);
                $('#flipswitchbtnid a:eq(1)').html(value.foryouthtxtcls);

                $("#playallvideoid").append('<video class="playallvideoid" id="adultplayallvideo" width="320" height="569" controls preload="none" poster="'+value.adultplayallimg+'" onended="videoEnded()"><source src="'+value.adultplayallvideo+'" type="video/mp4"></video>');
                $("#playallvideoid").append('<video class="playallvideoid" id="youthplayallvideo" width="320" height="569" controls preload="none" poster="'+value.youthplayallimg+'" onended="videoEnded()"><source src="'+value.youthplayallvideo+'" type="video/mp4"></video>');

                sessionStorage.ReminderMsg = value.remindermsg;
                sessionStorage.GraphTitle = value.graphtitle;
                sessionStorage.ParamtrMsg = value.paramtrmsg;
                sessionStorage.PopTitle = value.poptitle;
                sessionStorage.DoneBtn = value.donebuttontxt;
                sessionStorage.NetAlertMsg = value.netalertmsg;
                sessionStorage.NetPopTitle = value.netpoptitle;
                sessionStorage.GeoAlertMsg = value.geoalertmsg;
		
                ViewStills = value.viewstills;
                ViewVideo = value.viewvideo;
                ViewStills1 = value.viewstills;
                ViewVideo1 = value.viewvideo;
            });
           
            $(data.excercisesadultjson).each(function(index, value) {
                nvExAdNo = 1;
                $(value.data).each(function(index1, value1) {
                    if (index1==11) {
                        ViewStills = "";
                        ViewVideo = "";
                    }
                    $(".adultexerciseslist").append('<li id="'+value1.id+'"><a class="ui-btn ui-btn-icon-right"><span class="image-holder"><img src="'+value1.defaul_img+'" alt="'+value1.title+'" /></span><span class="content-holder"><div class="excercise-names"><span>'+nvExAdNo+'</span>'+value1.title+'</div></span></a></li>');
                    $(".adultexercisesinsidelist").append('<div class="adultexerview'+value1.id+' showhideexercisecls"><div class="video-content defaultshow adultviewvideocls'+value1.id+'" data-role="view"><video width="100%" controls preload="none" id="videoid'+value1.id+'" poster="'+value1.holder_image+'"><source src="'+value1.video_url+'" type="video/mp4"></video></div><div class="video-content showhideexercisecls adultviewstillscls'+value1.id+' " data-role="view" ><img src="'+value1.picture_img+'" alt="video holder" /></div><div class="text-content"><span class="view-still"><a href="#" id="'+value1.id+'" class="adultviewstills adultviewstills'+value1.id+'">'+ViewStills+'</a><a href="#" id="'+value1.id+'" class="adultviewvideo adultviewvideo'+value1.id+'">'+ViewVideo+'</a></span>'+value1.content+'</div><div class="clear"></div></div></div>');
                    nvExAdNo = nvExAdNo+1;
                });
            });
           
            $(data.excercisesyouthjson).each(function(index, value) {
                nvExYtNo = 1;
                $(value.data).each(function(index1, value1) {
                    if (index1==11) {
                        ViewStills1 = "";
                        ViewVideo1 = "";
                    }
                    $(".youthexerciseslist").append('<li id="'+value1.id+'"><a class="ui-btn ui-btn-icon-right"><span class="image-holder"><img src="'+value1.defaul_img+'" alt="'+value1.title+'" /></span><span class="content-holder"><div class="excercise-names"><span>'+nvExYtNo+'</span>'+value1.title+'</div></span></a></li>');
                    $(".youthexercisesinsidelist").append('<div class="youthexerview'+value1.id+' showhideexercisecls"><div class="video-content defaultshow youthviewvideocls'+value1.id+'" data-role="view"><video width="100%" controls preload="none" id="videoid'+value1.id+'" poster="'+value1.holder_image+'"><source src="'+value1.video_url+'" type="video/mp4"></video></div><div class="video-content showhideexercisecls youthviewstillscls'+value1.id+'" data-role="view" ><img src="'+value1.picture_img+'" alt="video holder" /></div><div class="text-content"><span class="view-still"><a href="#" id="'+value1.id+'" class="youthviewstills youthviewstills'+value1.id+'">'+ViewStills1+'</a><a href="#" id="'+value1.id+'" class="youthviewvideo youthviewvideo'+value1.id+'">'+ViewVideo1+'</a></span>'+value1.content+'</div><div class="clear"></div></div></div>');
                    nvExYtNo = nvExYtNo+1;
                });
            });
            nvNo = 1;
            $(data.knowjson).each(function(index, value) {
                $("#knowmainid").append('<div class=\"knowyourbackview knowyourbackview'+nvNo+'\"><h2>'+value.name+'</h2>'+value.description+'</div>');
                nvNo = nvNo+1;
            });
           
            $(".defaultshow").show();
            $(".adultviewvideo").hide();
            $(".adultviewstills").show();
            $(".youthviewvideo").hide();
            $(".youthviewstills").show();
            $(".showhideexercisecls").hide();
        }
    });
	calendarrefresh();
    return false;
}

function settingpagefunc(LangUlr,LangId) {
	$('#langflip').empty();
	$.ajax({
        url: LangUlr,
        dataType: 'json',
        type: 'get',
        cache: true,
        success: function(data) {
			var select = $('#langflip');
            $(data.languagejson).each(function(index, value) {
                var optTemp = '<option value="' +value.id+ '">'+value.name+'</option>';            
				select.append(optTemp);
            });
			var option = $($("option", select).get(LangId));
			option.attr('selected', 'selected');
			select.selectmenu();
			select.selectmenu('refresh', true);
			return false;
        }
    });
    return false;
}

function introlandingpagefunc(LangUlr) {
    $("#languagebtnid").empty();
    $.ajax({
        url: LangUlr,
        dataType: 'json',
        type: 'get',
        cache: true,
        success: function(data) {
	    $(data.languagejson).each(function(index, value) {
                $("#languagebtnid").append('<li><button class="ui-btn ui-mini" id="'+value.id+'">'+value.name+'</button></li>');
            });
	    return false;
        }
    });
    return false;
}

var Invoke = {
    facebookApp: function() {
    
    var nvFbShareing = sessionStorage.nvFbShareing;
    var nvAppWebside = sessionStorage.nvAppWebside;
    
        var request = {
            target: "Facebook",
            action: "bb.action.SHARE",
            type: "text/plain",
            data: ""+nvFbShareing+" "+nvAppWebside+""
        };
        Invoke.invokeApp(request);
    },
 
    twitterApp: function() {
    
    var nvTwShareing = sessionStorage.nvTwShareing;
    var nvAppWebside = sessionStorage.nvAppWebside;
    
        var request = {
            target: "Twitter",
            action: "bb.action.SHARE",
            type: "text/plain",
            data: ""+nvTwShareing+" "+nvAppWebside+""
        };
        Invoke.invokeApp(request);
    },
 
    twitterProfile: function() {
        var request = {
            target: "sys.pim.remember",
            action: "bb.action.OPEN",
            uri: "pim:application/vnd.blackberry.notebookentry"
        };
        Invoke.invokeApp(request);
    },
    
    email: function() {
    
    var nvEmailToFrn = sessionStorage.nvEmailToFrn;
    var nvAppWebside = sessionStorage.nvAppWebside;
    
        blackberry.invoke.card.invokeEmailComposer({
                subject: "",
                body: ""+nvEmailToFrn+" "+nvAppWebside+"",
                to: [""],
                cc: [""],
                attachment: [""]
            },
            function(success) {
                console.log('success');
            },
            function(cancel) {
                console.log('cancel');
            },
            function(error) {
                console.log('error');
            });
    },
 
    invokeApp: function(request) {
        blackberry.invoke.invoke(
            request,
            function() {
                console.log('success');
            }, function(e) {
                console.log('error');
                console.log(e);
            }
        );
    }
};

function onclickwindowopen(IdName){
    $("#"+IdName+"").find("a").each(function() {
        var alink = $(this).attr("href");
        if(alink!="#") {
            $(this).attr("href","#");
            $(this).attr("onclick","window.open('"+alink+"', '_system');");
            $(this).removeAttr('target');
        }
    });
}

function wsdcheckfunc(){
	var nvDate = new Date();
	var nvCD = nvDate.getDate();
	var nvCM = nvDate.getMonth()+1;
    var nvCY = nvDate.getFullYear();
	var nvCDM = nvCM+"/"+nvCD;
	var localData = JSON.parse(window.localStorage.getItem('wsdlocaldata'));
	
	if(localData==null) {
		var nvSDM = "10/1";
		var nvEDM = "10/31";
	} else {
		for (i=0;i<localData.length;i++){
			var nvSDM = localData[i].startdate;
			var nvEDM = localData[i].enddate;
			//$(".continueimgcls").attr("src",localData[i].wsdimage);
		}
	}
	
	if(dateCheck(nvSDM,nvEDM,nvCDM,nvCY)) {
		var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        if(deviceType!="BlackBerry" && deviceType!="null") {
            $.mobile.changePage( "#seasonal-home-page", { transition: "none", changeHash: true });
        } else {
            $.mobile.changePage( "#seasonal-home-page", { transition: "none", changeHash: true });
            nvLang = sessionStorage.currentLang;
            var nvLangFileName = "LangId"+Math.floor(nvLang)+".json";
            changelanguagefunc(nvLangFileName);
        }
	} else {
		var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        if(deviceType!="BlackBerry" && deviceType!="null") {
            $.mobile.changePage( "#landing-page", { transition: "none", changeHash: true });
        } else {
            $.mobile.changePage( "#landing-page", { transition: "none", changeHash: true });
            nvLang = sessionStorage.currentLang;
            var nvLangFileName = "LangId"+Math.floor(nvLang)+".json";
            changelanguagefunc(nvLangFileName);
        }
	}
}

function dateCheck(from,to,check,year) {

    var fDate = Date.parse(from+"/"+year);
    var lDate = Date.parse(to+"/"+year);
    var cDate = Date.parse(check+"/"+year);
    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}

function wsdservicefunc() {
	$.getJSON(""+wsdutl+"",function(result){
		var localData = JSON.stringify(result.wsdjson);
		window.localStorage.setItem('wsdlocaldata', localData);
	});
    return false;
}