//https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-1246
//Redirection when cancelling
Drupal.behaviors.node_form = function (context) {
  $('input[name="solution_type"]').change(function() {
    Drupal.settings.isa_node_form.test_framework_id = Drupal.settings.isa_node_form.test_framework_id || {};
    if ($(this).val() == Drupal.settings.isa_node_form.test_framework_id) {
      $(".groupscontroller").parent().hide();
    }
    else {
      $(".groupscontroller").parent().show();
    }
  });
  var generic = $('input[name="is_generic"]');
  if (generic.is(':checked')) {
    $("#edit-ebusiness-spec-wrapper").hide();
  }
  else {
    $("#edit-ebusiness-spec-wrapper").show();
  }
  generic.change(function() {
    if (generic.is(':checked')) {
      $("#edit-ebusiness-spec-wrapper").hide();
    }
    else {
      $("#edit-ebusiness-spec-wrapper").show();
    }
  });


  function parseUri(str) {
    var o = parseUri.options,
      m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
      uri = {},
      i = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });

    return uri;
  }

  parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
      name: "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };

  // Show/hide field_community_url fields when clicking on #edit-internet checkbox in community edit form
  var editInternet = '#edit-internet';
  if ($(editInternet).length > 0) {
    var divElement = '.community-internet';
    var fieldUrl = '#edit-field-community-url-0-url';
    var fieldUrlTitle = '#edit-field-community-url-0-title';
    $(editInternet).change(function () {
      if ($(this).is(':checked')) {
        $(divElement).show();
      } else {
        $(fieldUrl).val('');
        $(fieldUrlTitle).val('');
        $(divElement).hide();
      }
    });

    if ($(fieldUrl).val() != '' || $(fieldUrlTitle).val() != '') {
      $(divElement).show();
      $(editInternet).attr('checked', 'checked');
    }
  }

  // Show/hide field_community_url fields when clicking on #edit-internet checkbox in community edit form
  var editAssetId = '#edit-field-asset-identifier-chk';
  if ($(editAssetId).length > 0) {
    var divElement = '#edit-field-asset-identifier-items';
    $(editAssetId).change(function () {
      if ($(this).is(':checked')) {
        $(divElement).css('display', 'block');
      } else {
        $(divElement).find('input[type="text"]').val('');
        $(divElement).css('display', 'none');
      }
    });
    $(editAssetId).change();
  }

  // Show/hide aboutthesoftware fields when clicking on #edit-internet checkbox in community edit form
  var editAboutthesoftware = '#edit-aboutthesoftware';
  if ($(editAboutthesoftware).length > 0) {
    var divElement = '.aboutthesoftware';
    var operaSystem = '#edit-field-operating-system-15329';
    var progLang = '#edit-field-programming-language-15468';
    var intAudience = '#edit-field-intended-audience-15225';
    var fileFormat = '#edit-field-file-format';
    var soluCateg = '#edit-field-solution-category';
    var userInterface = '#edit-field-user-interface-15015';
    var status = '#edit-field-status';

    $(editAboutthesoftware).change(function () {
      if ($(this).is(':checked')) {
        $(divElement).show();
      } else {
        $(divElement).hide();
      }
    });
    // show fields if they are originally selected.
    if ($(operaSystem).is(':checked') || $(progLang).is(':checked') || $(operaSystem).is(':checked')
      || $(userInterface).is(':checked') || $(fileFormat).is(':selected') || $(soluCateg).is(':selected') ||
      $(status).is(':selected')) {
      $(divElement).show();
      $(editAboutthesoftware).attr('checked', true);
    }
  }

  //for maven and svn links
  $("#edit-project-maven-value").change(function () {
    if (this.checked) {
      $("#edit-field-project-display-maven-value").attr('checked', true);
    } else {
      $("#edit-field-project-display-maven-value").attr('checked', false);
    }
  });
  $("#edit-project-svn-value").change(function () {
    if (this.checked) {
      $("#edit-field-project-display-svn-value").attr('checked', true);
    } else {
      $("#edit-field-project-display-svn-value").attr('checked', false);
    }

  });
  $("#edit-project-webdir").change(function () {
    if (this.checked) {
      $("#edit-field-webdir").attr('checked', true);
    } else {
      $("#edit-field-webdir").attr('checked', false);
    }

  });


  //goal and background
  var editProjres = '#edit-project-projresources';
  if ($(editProjres).length > 0) {
    var divProjects = '.project-project_resources';
    var divPopupslinks = '.popups-reference-1, .popups-reference-2, .popups-reference-3, .popups-reference-4';
    var homePage = '#edit-project-homepage';
    var projDoc = '#edit-project-documentation';
    var projCVS = '#edit-project-cvs';

    $(editProjres).change(function () {
      if ($(this).is(':checked')) {
        $(divProjects).show();
        $(divPopupslinks).show();

      } else {
        $(divProjects).hide();
        $(divPopupslinks).hide();
      }
    });
    if ($(homePage).val() != '' || $(projDoc).val() != '' || $(projCVS).val() != '') {
      $(editProjres).attr('checked', true);
      $(divProjects).show();
      $(divPopupslinks).show();

    }

  }

  jQuery('#edit-cancel').click(function (e) {
    if ('Cancel' === jQuery(this).attr('value')) {
      jQuery('#node-form').attr('action', jQuery('#node-form').attr('action').replace('destination_cancel', 'destination'));
      console.log(jQuery('#node-form').attr('action'));
    }
  });
};;
/*
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.94 (20-DEC-2010)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.2.6 or later
 */
(function($){
  var ver="2.94";
  if($.support==undefined){
    $.support={
      opacity:!($.browser.msie)
      };

}
function debug(s){
  if($.fn.cycle.debug){
    log(s);
  }
}
function log(){
  if(window.console&&window.console.log){
    window.console.log("[cycle] "+Array.prototype.join.call(arguments," "));
  }
}
$.fn.cycle=function(options,arg2){
  var o={
    s:this.selector,
    c:this.context
    };

  if(this.length===0&&options!="stop"){
    if(!$.isReady&&o.s){
      log("DOM not ready, queuing slideshow");
      $(function(){
        $(o.s,o.c).cycle(options,arg2);
      });
      return this;
    }
    log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));
    return this;
  }
  return this.each(function(){
    var opts=handleArguments(this,options,arg2);
    if(opts===false){
      return;
    }
    opts.updateActivePagerLink=opts.updateActivePagerLink||$.fn.cycle.updateActivePagerLink;
    if(this.cycleTimeout){
      clearTimeout(this.cycleTimeout);
    }
    this.cycleTimeout=this.cyclePause=0;
    var $cont=$(this);
    var $slides=opts.slideExpr?$(opts.slideExpr,this):$cont.children();
    var els=$slides.get();
    if(els.length<2){
      log("terminating; too few slides: "+els.length);
      return;
    }
    var opts2=buildOptions($cont,$slides,els,opts,o);
    if(opts2===false){
      return;
    }
    var startTime=opts2.continuous?10:getTimeout(els[opts2.currSlide],els[opts2.nextSlide],opts2,!opts2.backwards);
    if(startTime){
      startTime+=(opts2.delay||0);
      if(startTime<10){
        startTime=10;
      }
      debug("first timeout: "+startTime);
      this.cycleTimeout=setTimeout(function(){
        go(els,opts2,0,!opts.backwards);
      },startTime);
    }
  });
};

function handleArguments(cont,options,arg2){
  if(cont.cycleStop==undefined){
    cont.cycleStop=0;
  }
  if(options===undefined||options===null){
    options={};

}
if(options.constructor==String){
  switch(options){
    case"destroy":case"stop":
      var opts=$(cont).data("cycle.opts");
      if(!opts){
      return false;
    }
    cont.cycleStop++;
    if(cont.cycleTimeout){
      clearTimeout(cont.cycleTimeout);
    }
    cont.cycleTimeout=0;
    $(cont).removeData("cycle.opts");
      if(options=="destroy"){
      destroy(opts);
    }
    return false;
    case"toggle":
      cont.cyclePause=(cont.cyclePause===1)?0:1;
      checkInstantResume(cont.cyclePause,arg2,cont);
      return false;
    case"pause":
      cont.cyclePause=1;
      return false;
    case"resume":
      cont.cyclePause=0;
      checkInstantResume(false,arg2,cont);
      return false;
    case"prev":case"next":
      var opts=$(cont).data("cycle.opts");
      if(!opts){
      log('options not found, "prev/next" ignored');
      return false;
    }
    $.fn.cycle[options](opts);
      return false;
    default:
      options={
      fx:options
    };

}
return options;
}else{
  if(options.constructor==Number){
    var num=options;
    options=$(cont).data("cycle.opts");
    if(!options){
      log("options not found, can not advance slide");
      return false;
    }
    if(num<0||num>=options.elements.length){
      log("invalid slide index: "+num);
      return false;
    }
    options.nextSlide=num;
    if(cont.cycleTimeout){
      clearTimeout(cont.cycleTimeout);
      cont.cycleTimeout=0;
    }
    if(typeof arg2=="string"){
      options.oneTimeFx=arg2;
    }
    go(options.elements,options,1,num>=options.currSlide);
    return false;
  }
}
return options;
function checkInstantResume(isPaused,arg2,cont){
  if(!isPaused&&arg2===true){
    var options=$(cont).data("cycle.opts");
    if(!options){
      log("options not found, can not resume");
      return false;
    }
    if(cont.cycleTimeout){
      clearTimeout(cont.cycleTimeout);
      cont.cycleTimeout=0;
    }
    go(options.elements,options,1,!options.backwards);
  }
}
}
function removeFilter(el,opts){
  if(!$.support.opacity&&opts.cleartype&&el.style.filter){
    try{
      el.style.removeAttribute("filter");
    }catch(smother){}
  }
}
function destroy(opts){
  if(opts.next){
    $(opts.next).unbind(opts.prevNextEvent);
  }
  if(opts.prev){
    $(opts.prev).unbind(opts.prevNextEvent);
  }
  if(opts.pager||opts.pagerAnchorBuilder){
    $.each(opts.pagerAnchors||[],function(){
      this.unbind().remove();
    });
  }
  opts.pagerAnchors=null;
  if(opts.destroy){
    opts.destroy(opts);
  }
}
function buildOptions($cont,$slides,els,options,o){
  var opts=$.extend({},$.fn.cycle.defaults,options||{},$.metadata?$cont.metadata():$.meta?$cont.data():{});
  if(opts.autostop){
    opts.countdown=opts.autostopCount||els.length;
  }
  var cont=$cont[0];
  $cont.data("cycle.opts",opts);
  opts.$cont=$cont;
  opts.stopCount=cont.cycleStop;
  opts.elements=els;
  opts.before=opts.before?[opts.before]:[];
  opts.after=opts.after?[opts.after]:[];
  opts.after.unshift(function(){
    opts.busy=0;
  });
  if(!$.support.opacity&&opts.cleartype){
    opts.after.push(function(){
      removeFilter(this,opts);
    });
  }
  if(opts.continuous){
    opts.after.push(function(){
      go(els,opts,0,!opts.backwards);
    });
  }
  saveOriginalOpts(opts);
  if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){
    clearTypeFix($slides);
  }
  if($cont.css("position")=="static"){
    $cont.css("position","relative");
  }
  if(opts.width){
    $cont.width(opts.width);
  }
  if(opts.height&&opts.height!="auto"){
    $cont.height(opts.height);
  }
  if(opts.startingSlide){
    opts.startingSlide=parseInt(opts.startingSlide);
  }else{
    if(opts.backwards){
      opts.startingSlide=els.length-1;
    }
  }
  if(opts.random){
  opts.randomMap=[];
  for(var i=0;i<els.length;i++){
    opts.randomMap.push(i);
  }
  opts.randomMap.sort(function(a,b){
    return Math.random()-0.5;
  });
  opts.randomIndex=1;
  opts.startingSlide=opts.randomMap[1];
}else{
  if(opts.startingSlide>=els.length){
    opts.startingSlide=0;
  }
}
opts.currSlide=opts.startingSlide||0;
var first=opts.startingSlide;
$slides.css({
  /*position:"absolute",*/
  top:0,
  left:0
}).hide().each(function(i){
  var z;
  if(opts.backwards){
    z=first?i<=first?els.length+(i-first):first-i:els.length-i;
  }else{
    z=first?i>=first?els.length-(i-first):first-i:els.length-i;
  }
  $(this).css("z-index",z);
});
$(els[first]).css("opacity",1).show();
removeFilter(els[first],opts);
if(opts.fit&&opts.width){
  $slides.width(opts.width);
}
if(opts.fit&&opts.height&&opts.height!="auto"){
  $slides.height(opts.height);
}
var reshape=opts.containerResize&&!$cont.innerHeight();
if(reshape){
  var maxw=0,maxh=0;
  for(var j=0;j<els.length;j++){
    var $e=$(els[j]),e=$e[0],w=$e.outerWidth(),h=$e.outerHeight();
    if(!w){
      w=e.offsetWidth||e.width||$e.attr("width");
    }
    if(!h){
      h=e.offsetHeight||e.height||$e.attr("height");
    }
    maxw=w>maxw?w:maxw;
    maxh=h>maxh?h:maxh;
  }
  if(maxw>0&&maxh>0){
    $cont.css({
      width:maxw+"px",
      height:maxh+"px"
      });
  }
}
if(opts.pause){
  $cont.hover(function(){
    this.cyclePause++;
  },function(){
    this.cyclePause--;
  });
}
if(supportMultiTransitions(opts)===false){
  return false;
}
var requeue=false;
options.requeueAttempts=options.requeueAttempts||0;
$slides.each(function(){
  var $el=$(this);
  this.cycleH=(opts.fit&&opts.height)?opts.height:($el.height()||this.offsetHeight||this.height||$el.attr("height")||0);
  this.cycleW=(opts.fit&&opts.width)?opts.width:($el.width()||this.offsetWidth||this.width||$el.attr("width")||0);
  if($el.is("img")){
    var loadingIE=($.browser.msie&&this.cycleW==28&&this.cycleH==30&&!this.complete);
    var loadingFF=($.browser.mozilla&&this.cycleW==34&&this.cycleH==19&&!this.complete);
    var loadingOp=($.browser.opera&&((this.cycleW==42&&this.cycleH==19)||(this.cycleW==37&&this.cycleH==17))&&!this.complete);
    var loadingOther=(this.cycleH==0&&this.cycleW==0&&!this.complete);
    if(loadingIE||loadingFF||loadingOp||loadingOther){
      if(o.s&&opts.requeueOnImageNotLoaded&&++options.requeueAttempts<100){
        log(options.requeueAttempts," - img slide not loaded, requeuing slideshow: ",this.src,this.cycleW,this.cycleH);
        setTimeout(function(){
          $(o.s,o.c).cycle(options);
        },opts.requeueTimeout);
        requeue=true;
        return false;
      }else{
        log("could not determine size of image: "+this.src,this.cycleW,this.cycleH);
      }
    }
  }
return true;
});
if(requeue){
  return false;
}
opts.cssBefore=opts.cssBefore||{};

opts.animIn=opts.animIn||{};

opts.animOut=opts.animOut||{};

$slides.not(":eq("+first+")").css(opts.cssBefore);
if(opts.cssFirst){
  $($slides[first]).css(opts.cssFirst);
}
if(opts.timeout){
  opts.timeout=parseInt(opts.timeout);
  if(opts.speed.constructor==String){
    opts.speed=$.fx.speeds[opts.speed]||parseInt(opts.speed);
  }
  if(!opts.sync){
    opts.speed=opts.speed/2;
  }
  var buffer=opts.fx=="shuffle"?500:250;
  while((opts.timeout-opts.speed)<buffer){
    opts.timeout+=opts.speed;
  }
}
if(opts.easing){
  opts.easeIn=opts.easeOut=opts.easing;
}
if(!opts.speedIn){
  opts.speedIn=opts.speed;
}
if(!opts.speedOut){
  opts.speedOut=opts.speed;
}
opts.slideCount=els.length;
opts.currSlide=opts.lastSlide=first;
if(opts.random){
  if(++opts.randomIndex==els.length){
    opts.randomIndex=0;
  }
  opts.nextSlide=opts.randomMap[opts.randomIndex];
}else{
  if(opts.backwards){
    opts.nextSlide=opts.startingSlide==0?(els.length-1):opts.startingSlide-1;
  }else{
    opts.nextSlide=opts.startingSlide>=(els.length-1)?0:opts.startingSlide+1;
  }
}
if(!opts.multiFx){
  var init=$.fn.cycle.transitions[opts.fx];
  if($.isFunction(init)){
    init($cont,$slides,opts);
  }else{
    if(opts.fx!="custom"&&!opts.multiFx){
      log("unknown transition: "+opts.fx,"; slideshow terminating");
      return false;
    }
  }
}
var e0=$slides[first];
if(opts.before.length){
  opts.before[0].apply(e0,[e0,e0,opts,true]);
}
if(opts.after.length>1){
  opts.after[1].apply(e0,[e0,e0,opts,true]);
}
if(opts.next){
  $(opts.next).bind(opts.prevNextEvent,function(){
    return advance(opts,1);
  });
}
if(opts.prev){
  $(opts.prev).bind(opts.prevNextEvent,function(){
    return advance(opts,0);
  });
}
if(opts.pager||opts.pagerAnchorBuilder){
  buildPager(els,opts);
}
exposeAddSlide(opts,els);
return opts;
}
function saveOriginalOpts(opts){
  opts.original={
    before:[],
    after:[]
  };

  opts.original.cssBefore=$.extend({},opts.cssBefore);
  opts.original.cssAfter=$.extend({},opts.cssAfter);
  opts.original.animIn=$.extend({},opts.animIn);
  opts.original.animOut=$.extend({},opts.animOut);
  $.each(opts.before,function(){
    opts.original.before.push(this);
  });
  $.each(opts.after,function(){
    opts.original.after.push(this);
  });
}
function supportMultiTransitions(opts){
  var i,tx,txs=$.fn.cycle.transitions;
  if(opts.fx.indexOf(",")>0){
    opts.multiFx=true;
    opts.fxs=opts.fx.replace(/\s*/g,"").split(",");
    for(i=0;i<opts.fxs.length;i++){
      var fx=opts.fxs[i];
      tx=txs[fx];
      if(!tx||!txs.hasOwnProperty(fx)||!$.isFunction(tx)){
        log("discarding unknown transition: ",fx);
        opts.fxs.splice(i,1);
        i--;
      }
    }
    if(!opts.fxs.length){
    log("No valid transitions named; slideshow terminating.");
    return false;
  }
}else{
  if(opts.fx=="all"){
    opts.multiFx=true;
    opts.fxs=[];
    for(p in txs){
      tx=txs[p];
      if(txs.hasOwnProperty(p)&&$.isFunction(tx)){
        opts.fxs.push(p);
      }
    }
    }
  }
if(opts.multiFx&&opts.randomizeEffects){
  var r1=Math.floor(Math.random()*20)+30;
  for(i=0;i<r1;i++){
    var r2=Math.floor(Math.random()*opts.fxs.length);
    opts.fxs.push(opts.fxs.splice(r2,1)[0]);
  }
  debug("randomized fx sequence: ",opts.fxs);
}
return true;
}
function exposeAddSlide(opts,els){
  opts.addSlide=function(newSlide,prepend){
    var $s=$(newSlide),s=$s[0];
    if(!opts.autostopCount){
      opts.countdown++;
    }
    els[prepend?"unshift":"push"](s);
    if(opts.els){
      opts.els[prepend?"unshift":"push"](s);
    }
    opts.slideCount=els.length;
    $s.css("position","absolute");
    $s[prepend?"prependTo":"appendTo"](opts.$cont);
    if(prepend){
      opts.currSlide++;
      opts.nextSlide++;
    }
    if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){
      clearTypeFix($s);
    }
    if(opts.fit&&opts.width){
      $s.width(opts.width);
    }
    if(opts.fit&&opts.height&&opts.height!="auto"){
      $s.height(opts.height);
    }
    s.cycleH=(opts.fit&&opts.height)?opts.height:$s.height();
    s.cycleW=(opts.fit&&opts.width)?opts.width:$s.width();
    $s.css(opts.cssBefore);
    if(opts.pager||opts.pagerAnchorBuilder){
      $.fn.cycle.createPagerAnchor(els.length-1,s,$(opts.pager),els,opts);
    }
    if($.isFunction(opts.onAddSlide)){
      opts.onAddSlide($s);
    }else{
      $s.hide();
    }
  };

}
$.fn.cycle.resetState=function(opts,fx){
  fx=fx||opts.fx;
  opts.before=[];
  opts.after=[];
  opts.cssBefore=$.extend({},opts.original.cssBefore);
  opts.cssAfter=$.extend({},opts.original.cssAfter);
  opts.animIn=$.extend({},opts.original.animIn);
  opts.animOut=$.extend({},opts.original.animOut);
  opts.fxFn=null;
  $.each(opts.original.before,function(){
    opts.before.push(this);
  });
  $.each(opts.original.after,function(){
    opts.after.push(this);
  });
  var init=$.fn.cycle.transitions[fx];
  if($.isFunction(init)){
    init(opts.$cont,$(opts.elements),opts);
  }
};

function go(els,opts,manual,fwd){
  if(manual&&opts.busy&&opts.manualTrump){
    debug("manualTrump in go(), stopping active transition");
    $(els).stop(true,true);
    opts.busy=false;
  }
  if(opts.busy){
    debug("transition active, ignoring new tx request");
    return;
  }
  var p=opts.$cont[0],curr=els[opts.currSlide],next=els[opts.nextSlide];
  if(p.cycleStop!=opts.stopCount||p.cycleTimeout===0&&!manual){
    return;
  }
  if(!manual&&!p.cyclePause&&!opts.bounce&&((opts.autostop&&(--opts.countdown<=0))||(opts.nowrap&&!opts.random&&opts.nextSlide<opts.currSlide))){
    if(opts.end){
      opts.end(opts);
    }
    return;
  }
  var changed=false;
  if((manual||!p.cyclePause)&&(opts.nextSlide!=opts.currSlide)){
    changed=true;
    var fx=opts.fx;
    curr.cycleH=curr.cycleH||$(curr).height();
    curr.cycleW=curr.cycleW||$(curr).width();
    next.cycleH=next.cycleH||$(next).height();
    next.cycleW=next.cycleW||$(next).width();
    if(opts.multiFx){
      if(opts.lastFx==undefined||++opts.lastFx>=opts.fxs.length){
        opts.lastFx=0;
      }
      fx=opts.fxs[opts.lastFx];
      opts.currFx=fx;
    }
    if(opts.oneTimeFx){
      fx=opts.oneTimeFx;
      opts.oneTimeFx=null;
    }
    $.fn.cycle.resetState(opts,fx);
    if(opts.before.length){
      $.each(opts.before,function(i,o){
        if(p.cycleStop!=opts.stopCount){
          return;
        }
        o.apply(next,[curr,next,opts,fwd]);
      });
    }
    var after=function(){
      $.each(opts.after,function(i,o){
        if(p.cycleStop!=opts.stopCount){
          return;
        }
        o.apply(next,[curr,next,opts,fwd]);
      });
    };

    debug("tx firing; currSlide: "+opts.currSlide+"; nextSlide: "+opts.nextSlide);
    opts.busy=1;
    if(opts.fxFn){
      opts.fxFn(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);
    }else{
      if($.isFunction($.fn.cycle[opts.fx])){
        $.fn.cycle[opts.fx](curr,next,opts,after,fwd,manual&&opts.fastOnEvent);
      }else{
        $.fn.cycle.custom(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);
      }
    }
  }
if(changed||opts.nextSlide==opts.currSlide){
  opts.lastSlide=opts.currSlide;
  if(opts.random){
    opts.currSlide=opts.nextSlide;
    if(++opts.randomIndex==els.length){
      opts.randomIndex=0;
    }
    opts.nextSlide=opts.randomMap[opts.randomIndex];
    if(opts.nextSlide==opts.currSlide){
      opts.nextSlide=(opts.currSlide==opts.slideCount-1)?0:opts.currSlide+1;
    }
  }else{
  if(opts.backwards){
    var roll=(opts.nextSlide-1)<0;
    if(roll&&opts.bounce){
      opts.backwards=!opts.backwards;
      opts.nextSlide=1;
      opts.currSlide=0;
    }else{
      opts.nextSlide=roll?(els.length-1):opts.nextSlide-1;
      opts.currSlide=roll?0:opts.nextSlide+1;
    }
  }else{
  var roll=(opts.nextSlide+1)==els.length;
  if(roll&&opts.bounce){
    opts.backwards=!opts.backwards;
    opts.nextSlide=els.length-2;
    opts.currSlide=els.length-1;
  }else{
    opts.nextSlide=roll?0:opts.nextSlide+1;
    opts.currSlide=roll?els.length-1:opts.nextSlide-1;
  }
}
}
}
if(changed&&opts.pager){
  opts.updateActivePagerLink(opts.pager,opts.currSlide,opts.activePagerClass);
}
var ms=0;
if(opts.timeout&&!opts.continuous){
  ms=getTimeout(els[opts.currSlide],els[opts.nextSlide],opts,fwd);
}else{
  if(opts.continuous&&p.cyclePause){
    ms=10;
  }
}
if(ms>0){
  p.cycleTimeout=setTimeout(function(){
    go(els,opts,0,!opts.backwards);
  },ms);
}
}
$.fn.cycle.updateActivePagerLink=function(pager,currSlide,clsName){
  $(pager).each(function(){
    $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
  });
};

function getTimeout(curr,next,opts,fwd){
  if(opts.timeoutFn){
    var t=opts.timeoutFn.call(curr,curr,next,opts,fwd);
    while((t-opts.speed)<250){
      t+=opts.speed;
    }
    debug("calculated timeout: "+t+"; speed: "+opts.speed);
    if(t!==false){
      return t;
    }
  }
  return opts.timeout;
}
$.fn.cycle.next=function(opts){
  advance(opts,1);
};

$.fn.cycle.prev=function(opts){
  advance(opts,0);
};

function advance(opts,moveForward){
  var val=moveForward?1:-1;
  var els=opts.elements;
  var p=opts.$cont[0],timeout=p.cycleTimeout;
  if(timeout){
    clearTimeout(timeout);
    p.cycleTimeout=0;
  }
  if(opts.random&&val<0){
    opts.randomIndex--;
    if(--opts.randomIndex==-2){
      opts.randomIndex=els.length-2;
    }else{
      if(opts.randomIndex==-1){
        opts.randomIndex=els.length-1;
      }
    }
    opts.nextSlide=opts.randomMap[opts.randomIndex];
}else{
  if(opts.random){
    opts.nextSlide=opts.randomMap[opts.randomIndex];
  }else{
    opts.nextSlide=opts.currSlide+val;
    if(opts.nextSlide<0){
      if(opts.nowrap){
        return false;
      }
      opts.nextSlide=els.length-1;
    }else{
      if(opts.nextSlide>=els.length){
        if(opts.nowrap){
          return false;
        }
        opts.nextSlide=0;
      }
    }
  }
}
var cb=opts.onPrevNextEvent||opts.prevNextClick;
if($.isFunction(cb)){
  cb(val>0,opts.nextSlide,els[opts.nextSlide]);
}
go(els,opts,1,moveForward);
return false;
}
function buildPager(els,opts){
  var $p=$(opts.pager);
  $.each(els,function(i,o){
    $.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
  });
  opts.updateActivePagerLink(opts.pager,opts.startingSlide,opts.activePagerClass);
}
$.fn.cycle.createPagerAnchor=function(i,el,$p,els,opts){
  var a;
  if($.isFunction(opts.pagerAnchorBuilder)){
    a=opts.pagerAnchorBuilder(i,el);
    debug("pagerAnchorBuilder("+i+", el) returned: "+a);
  }else{
    a='<a href="#">'+(i+1)+"</a>";
  }
  if(!a){
    return;
  }
  var $a=$(a);
  if($a.parents("body").length===0){
    var arr=[];
    if($p.length>1){
      $p.each(function(){
        var $clone=$a.clone(true);
        $(this).append($clone);
        arr.push($clone[0]);
      });
      $a=$(arr);
    }else{
      $a.appendTo($p);
    }
  }
  opts.pagerAnchors=opts.pagerAnchors||[];
opts.pagerAnchors.push($a);
$a.bind(opts.pagerEvent,function(e){
  e.preventDefault();
  opts.nextSlide=i;
  var p=opts.$cont[0],timeout=p.cycleTimeout;
  if(timeout){
    clearTimeout(timeout);
    p.cycleTimeout=0;
  }
  var cb=opts.onPagerEvent||opts.pagerClick;
  if($.isFunction(cb)){
    cb(opts.nextSlide,els[opts.nextSlide]);
  }
  go(els,opts,1,opts.currSlide<i);
});
if(!/^click/.test(opts.pagerEvent)&&!opts.allowPagerClickBubble){
  $a.bind("click.cycle",function(){
    return false;
  });
}
if(opts.pauseOnPagerHover){
  $a.hover(function(){
    opts.$cont[0].cyclePause++;
  },function(){
    opts.$cont[0].cyclePause--;
  });
}
};

$.fn.cycle.hopsFromLast=function(opts,fwd){
  var hops,l=opts.lastSlide,c=opts.currSlide;
  if(fwd){
    hops=c>l?c-l:opts.slideCount-l;
  }else{
    hops=c<l?l-c:l+opts.slideCount-c;
  }
  return hops;
};

function clearTypeFix($slides){
  debug("applying clearType background-color hack");
  function hex(s){
    s=parseInt(s).toString(16);
    return s.length<2?"0"+s:s;
  }
  function getBg(e){
    for(;e&&e.nodeName.toLowerCase()!="html";e=e.parentNode){
      var v=$.css(e,"background-color");
      if(v.indexOf("rgb")>=0){
        var rgb=v.match(/\d+/g);
        return"#"+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);
      }
      if(v&&v!="transparent"){
        return v;
      }
    }
    return"#ffffff";
}
$slides.each(function(){
  $(this).css("background-color",getBg(this));
});
}
$.fn.cycle.commonReset=function(curr,next,opts,w,h,rev){
  $(opts.elements).not(curr).hide();
  opts.cssBefore.opacity=1;
  opts.cssBefore.display="block";
  if(opts.slideResize&&w!==false&&next.cycleW>0){
    opts.cssBefore.width=next.cycleW;
  }
  if(opts.slideResize&&h!==false&&next.cycleH>0){
    opts.cssBefore.height=next.cycleH;
  }
  opts.cssAfter=opts.cssAfter||{};

  opts.cssAfter.display="none";
  $(curr).css("zIndex",opts.slideCount+(rev===true?1:0));
  $(next).css("zIndex",opts.slideCount+(rev===true?0:1));
};

$.fn.cycle.custom=function(curr,next,opts,cb,fwd,speedOverride){
  var $l=$(curr),$n=$(next);
  var speedIn=opts.speedIn,speedOut=opts.speedOut,easeIn=opts.easeIn,easeOut=opts.easeOut;
  $n.css(opts.cssBefore);
  if(speedOverride){
    if(typeof speedOverride=="number"){
      speedIn=speedOut=speedOverride;
    }else{
      speedIn=speedOut=1;
    }
    easeIn=easeOut=null;
  }
  var fn=function(){
    $n.animate(opts.animIn,speedIn,easeIn,cb);
  };

  $l.animate(opts.animOut,speedOut,easeOut,function(){
    if(opts.cssAfter){
      $l.css(opts.cssAfter);
    }
    if(!opts.sync){
      fn();
    }
  });
if(opts.sync){
  fn();
}
};

$.fn.cycle.transitions={
  fade:function($cont,$slides,opts){
    $slides.not(":eq("+opts.currSlide+")").css("opacity",0);
    opts.before.push(function(curr,next,opts){
      $.fn.cycle.commonReset(curr,next,opts);
      opts.cssBefore.opacity=0;
    });
    opts.animIn={
      opacity:1
    };

    opts.animOut={
      opacity:0
    };

    opts.cssBefore={
      top:0,
      left:0
    };

}
};

$.fn.cycle.ver=function(){
  return ver;
};

$.fn.cycle.defaults={
  fx:"fade",
  timeout:4000,
  timeoutFn:null,
  continuous:0,
  speed:1000,
  speedIn:null,
  speedOut:null,
  next:null,
  prev:null,
  onPrevNextEvent:null,
  prevNextEvent:"click.cycle",
  pager:null,
  onPagerEvent:null,
  pagerEvent:"click.cycle",
  allowPagerClickBubble:false,
  pagerAnchorBuilder:null,
  before:null,
  after:null,
  end:null,
  easing:null,
  easeIn:null,
  easeOut:null,
  shuffle:null,
  animIn:null,
  animOut:null,
  cssBefore:null,
  cssAfter:null,
  fxFn:null,
  height:"auto",
  startingSlide:0,
  sync:1,
  random:0,
  fit:0,
  containerResize:1,
  slideResize:1,
  pause:0,
  pauseOnPagerHover:0,
  autostop:0,
  autostopCount:0,
  delay:0,
  slideExpr:null,
  cleartype:!$.support.opacity,
  cleartypeNoBg:false,
  nowrap:0,
  fastOnEvent:0,
  randomizeEffects:1,
  rev:0,
  manualTrump:true,
  requeueOnImageNotLoaded:true,
  requeueTimeout:250,
  activePagerClass:"activeSlide",
  updateActivePagerLink:null,
  backwards:false
};

})(jQuery);
/*
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($){
  $.fn.cycle.transitions.none=function($cont,$slides,opts){
    opts.fxFn=function(curr,next,opts,after){
      $(next).show();
      $(curr).hide();
      after();
    };

};

$.fn.cycle.transitions.fadeout=function($cont,$slides,opts){
  $slides.not(":eq("+opts.currSlide+")").css({
    display:"block",
    opacity:1
  });
  opts.before.push(function(curr,next,opts,w,h,rev){
    $(curr).css("zIndex",opts.slideCount+(!rev===true?1:0));
    $(next).css("zIndex",opts.slideCount+(!rev===true?0:1));
  });
  opts.animIn={
    opacity:1
  };

  opts.animOut={
    opacity:0
  };

  opts.cssBefore={
    opacity:1,
    display:"block"
  };

  opts.cssAfter={
    zIndex:0
  };

};

$.fn.cycle.transitions.scrollUp=function($cont,$slides,opts){
  $cont.css("overflow","hidden");
  opts.before.push($.fn.cycle.commonReset);
  var h=$cont.height();
  opts.cssBefore={
    top:h,
    left:0
  };

  opts.cssFirst={
    top:0
  };

  opts.animIn={
    top:0
  };

  opts.animOut={
    top:-h
    };

};

$.fn.cycle.transitions.scrollDown=function($cont,$slides,opts){
  $cont.css("overflow","hidden");
  opts.before.push($.fn.cycle.commonReset);
  var h=$cont.height();
  opts.cssFirst={
    top:0
  };

  opts.cssBefore={
    top:-h,
    left:0
  };

  opts.animIn={
    top:0
  };

  opts.animOut={
    top:h
  };

};

$.fn.cycle.transitions.scrollLeft=function($cont,$slides,opts){
  $cont.css("overflow","hidden");
  opts.before.push($.fn.cycle.commonReset);
  var w=$cont.width();
  opts.cssFirst={
    left:0
  };

  opts.cssBefore={
    left:w,
    top:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    left:0-w
    };

};

$.fn.cycle.transitions.scrollRight=function($cont,$slides,opts){
  $cont.css("overflow","hidden");
  opts.before.push($.fn.cycle.commonReset);
  var w=$cont.width();
  opts.cssFirst={
    left:0
  };

  opts.cssBefore={
    left:-w,
    top:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    left:w
  };

};

$.fn.cycle.transitions.scrollHorz=function($cont,$slides,opts){
  $cont.css("overflow","hidden").width();
  opts.before.push(function(curr,next,opts,fwd){
    if(opts.rev){
      fwd=!fwd;
    }
    $.fn.cycle.commonReset(curr,next,opts);
    opts.cssBefore.left=fwd?(next.cycleW-1):(1-next.cycleW);
    opts.animOut.left=fwd?-curr.cycleW:curr.cycleW;
  });
  opts.cssFirst={
    left:0
  };

  opts.cssBefore={
    top:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    top:0
  };

};

$.fn.cycle.transitions.scrollVert=function($cont,$slides,opts){
  $cont.css("overflow","hidden");
  opts.before.push(function(curr,next,opts,fwd){
    if(opts.rev){
      fwd=!fwd;
    }
    $.fn.cycle.commonReset(curr,next,opts);
    opts.cssBefore.top=fwd?(1-next.cycleH):(next.cycleH-1);
    opts.animOut.top=fwd?curr.cycleH:-curr.cycleH;
  });
  opts.cssFirst={
    top:0
  };

  opts.cssBefore={
    left:0
  };

  opts.animIn={
    top:0
  };

  opts.animOut={
    left:0
  };

};

$.fn.cycle.transitions.slideX=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $(opts.elements).not(curr).hide();
    $.fn.cycle.commonReset(curr,next,opts,false,true);
    opts.animIn.width=next.cycleW;
  });
  opts.cssBefore={
    left:0,
    top:0,
    width:0
  };

  opts.animIn={
    width:"show"
  };

  opts.animOut={
    width:0
  };

};

$.fn.cycle.transitions.slideY=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $(opts.elements).not(curr).hide();
    $.fn.cycle.commonReset(curr,next,opts,true,false);
    opts.animIn.height=next.cycleH;
  });
  opts.cssBefore={
    left:0,
    top:0,
    height:0
  };

  opts.animIn={
    height:"show"
  };

  opts.animOut={
    height:0
  };

};

$.fn.cycle.transitions.shuffle=function($cont,$slides,opts){
  var i,w=$cont.css("overflow","visible").width();
  $slides.css({
    left:0,
    top:0
  });
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,true,true);
  });
  if(!opts.speedAdjusted){
    opts.speed=opts.speed/2;
    opts.speedAdjusted=true;
  }
  opts.random=0;
  opts.shuffle=opts.shuffle||{
    left:-w,
    top:15
  };

  opts.els=[];
  for(i=0;i<$slides.length;i++){
    opts.els.push($slides[i]);
  }
  for(i=0;i<opts.currSlide;i++){
    opts.els.push(opts.els.shift());
  }
  opts.fxFn=function(curr,next,opts,cb,fwd){
    if(opts.rev){
      fwd=!fwd;
    }
    var $el=fwd?$(curr):$(next);
    $(next).css(opts.cssBefore);
    var count=opts.slideCount;
    $el.animate(opts.shuffle,opts.speedIn,opts.easeIn,function(){
      var hops=$.fn.cycle.hopsFromLast(opts,fwd);
      for(var k=0;k<hops;k++){
        fwd?opts.els.push(opts.els.shift()):opts.els.unshift(opts.els.pop());
      }
      if(fwd){
        for(var i=0,len=opts.els.length;i<len;i++){
          $(opts.els[i]).css("z-index",len-i+count);
        }
        }else{
      var z=$(curr).css("z-index");
      $el.css("z-index",parseInt(z)+1+count);
    }
    $el.animate({
      left:0,
      top:0
    },opts.speedOut,opts.easeOut,function(){
      $(fwd?this:curr).hide();
      if(cb){
        cb();
      }
    });
  });
};

opts.cssBefore={
  display:"block",
  opacity:1,
  top:0,
  left:0
};

};

$.fn.cycle.transitions.turnUp=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,false);
    opts.cssBefore.top=next.cycleH;
    opts.animIn.height=next.cycleH;
    opts.animOut.width=next.cycleW;
  });
  opts.cssFirst={
    top:0
  };

  opts.cssBefore={
    left:0,
    height:0
  };

  opts.animIn={
    top:0
  };

  opts.animOut={
    height:0
  };

};

$.fn.cycle.transitions.turnDown=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,false);
    opts.animIn.height=next.cycleH;
    opts.animOut.top=curr.cycleH;
  });
  opts.cssFirst={
    top:0
  };

  opts.cssBefore={
    left:0,
    top:0,
    height:0
  };

  opts.animOut={
    height:0
  };

};

$.fn.cycle.transitions.turnLeft=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,true);
    opts.cssBefore.left=next.cycleW;
    opts.animIn.width=next.cycleW;
  });
  opts.cssBefore={
    top:0,
    width:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    width:0
  };

};

$.fn.cycle.transitions.turnRight=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,true);
    opts.animIn.width=next.cycleW;
    opts.animOut.left=curr.cycleW;
  });
  opts.cssBefore={
    top:0,
    left:0,
    width:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    width:0
  };

};

$.fn.cycle.transitions.zoom=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,false,true);
    opts.cssBefore.top=next.cycleH/2;
    opts.cssBefore.left=next.cycleW/2;
    opts.animIn={
      top:0,
      left:0,
      width:next.cycleW,
      height:next.cycleH
      };

    opts.animOut={
      width:0,
      height:0,
      top:curr.cycleH/2,
      left:curr.cycleW/2
      };

  });
opts.cssFirst={
  top:0,
  left:0
};

opts.cssBefore={
  width:0,
  height:0
};

};

$.fn.cycle.transitions.fadeZoom=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,false);
    opts.cssBefore.left=next.cycleW/2;
    opts.cssBefore.top=next.cycleH/2;
    opts.animIn={
      top:0,
      left:0,
      width:next.cycleW,
      height:next.cycleH
      };

  });
opts.cssBefore={
  width:0,
  height:0
};

opts.animOut={
  opacity:0
};

};

$.fn.cycle.transitions.blindX=function($cont,$slides,opts){
  var w=$cont.css("overflow","hidden").width();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts);
    opts.animIn.width=next.cycleW;
    opts.animOut.left=curr.cycleW;
  });
  opts.cssBefore={
    left:w,
    top:0
  };

  opts.animIn={
    left:0
  };

  opts.animOut={
    left:w
  };

};

$.fn.cycle.transitions.blindY=function($cont,$slides,opts){
  var h=$cont.css("overflow","hidden").height();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts);
    opts.animIn.height=next.cycleH;
    opts.animOut.top=curr.cycleH;
  });
  opts.cssBefore={
    top:h,
    left:0
  };

  opts.animIn={
    top:0
  };

  opts.animOut={
    top:h
  };

};

$.fn.cycle.transitions.blindZ=function($cont,$slides,opts){
  var h=$cont.css("overflow","hidden").height();
  var w=$cont.width();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts);
    opts.animIn.height=next.cycleH;
    opts.animOut.top=curr.cycleH;
  });
  opts.cssBefore={
    top:h,
    left:w
  };

  opts.animIn={
    top:0,
    left:0
  };

  opts.animOut={
    top:h,
    left:w
  };

};

$.fn.cycle.transitions.growX=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,true);
    opts.cssBefore.left=this.cycleW/2;
    opts.animIn={
      left:0,
      width:this.cycleW
      };

    opts.animOut={
      left:0
    };

  });
opts.cssBefore={
  width:0,
  top:0
};

};

$.fn.cycle.transitions.growY=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,false);
    opts.cssBefore.top=this.cycleH/2;
    opts.animIn={
      top:0,
      height:this.cycleH
      };

    opts.animOut={
      top:0
    };

  });
opts.cssBefore={
  height:0,
  left:0
};

};

$.fn.cycle.transitions.curtainX=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,false,true,true);
    opts.cssBefore.left=next.cycleW/2;
    opts.animIn={
      left:0,
      width:this.cycleW
      };

    opts.animOut={
      left:curr.cycleW/2,
      width:0
    };

  });
opts.cssBefore={
  top:0,
  width:0
};

};

$.fn.cycle.transitions.curtainY=function($cont,$slides,opts){
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,false,true);
    opts.cssBefore.top=next.cycleH/2;
    opts.animIn={
      top:0,
      height:next.cycleH
      };

    opts.animOut={
      top:curr.cycleH/2,
      height:0
    };

  });
opts.cssBefore={
  left:0,
  height:0
};

};

$.fn.cycle.transitions.cover=function($cont,$slides,opts){
  var d=opts.direction||"left";
  var w=$cont.css("overflow","hidden").width();
  var h=$cont.height();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts);
    if(d=="right"){
      opts.cssBefore.left=-w;
    }else{
      if(d=="up"){
        opts.cssBefore.top=h;
      }else{
        if(d=="down"){
          opts.cssBefore.top=-h;
        }else{
          opts.cssBefore.left=w;
        }
      }
    }
  });
opts.animIn={
  left:0,
  top:0
};

opts.animOut={
  opacity:1
};

opts.cssBefore={
  top:0,
  left:0
};

};

$.fn.cycle.transitions.uncover=function($cont,$slides,opts){
  var d=opts.direction||"left";
  var w=$cont.css("overflow","hidden").width();
  var h=$cont.height();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,true,true);
    if(d=="right"){
      opts.animOut.left=w;
    }else{
      if(d=="up"){
        opts.animOut.top=-h;
      }else{
        if(d=="down"){
          opts.animOut.top=h;
        }else{
          opts.animOut.left=-w;
        }
      }
    }
  });
opts.animIn={
  left:0,
  top:0
};

opts.animOut={
  opacity:1
};

opts.cssBefore={
  top:0,
  left:0
};

};

$.fn.cycle.transitions.toss=function($cont,$slides,opts){
  var w=$cont.css("overflow","visible").width();
  var h=$cont.height();
  opts.before.push(function(curr,next,opts){
    $.fn.cycle.commonReset(curr,next,opts,true,true,true);
    if(!opts.animOut.left&&!opts.animOut.top){
      opts.animOut={
        left:w*2,
        top:-h/2,
        opacity:0
      };

  }else{
    opts.animOut.opacity=0;
  }
  });
opts.cssBefore={
  left:0,
  top:0
};

opts.animIn={
  left:0
};

};

$.fn.cycle.transitions.wipe=function($cont,$slides,opts){
  var w=$cont.css("overflow","hidden").width();
  var h=$cont.height();
  opts.cssBefore=opts.cssBefore||{};

  var clip;
  if(opts.clip){
    if(/l2r/.test(opts.clip)){
      clip="rect(0px 0px "+h+"px 0px)";
    }else{
      if(/r2l/.test(opts.clip)){
        clip="rect(0px "+w+"px "+h+"px "+w+"px)";
      }else{
        if(/t2b/.test(opts.clip)){
          clip="rect(0px "+w+"px 0px 0px)";
        }else{
          if(/b2t/.test(opts.clip)){
            clip="rect("+h+"px "+w+"px "+h+"px 0px)";
          }else{
            if(/zoom/.test(opts.clip)){
              var top=parseInt(h/2);
              var left=parseInt(w/2);
              clip="rect("+top+"px "+left+"px "+top+"px "+left+"px)";
            }
          }
        }
    }
}
}
opts.cssBefore.clip=opts.cssBefore.clip||clip||"rect(0px 0px 0px 0px)";
var d=opts.cssBefore.clip.match(/(\d+)/g);
var t=parseInt(d[0]),r=parseInt(d[1]),b=parseInt(d[2]),l=parseInt(d[3]);
opts.before.push(function(curr,next,opts){
  if(curr==next){
    return;
  }
  var $curr=$(curr),$next=$(next);
  $.fn.cycle.commonReset(curr,next,opts,true,true,false);
  opts.cssAfter.display="block";
  var step=1,count=parseInt((opts.speedIn/13))-1;
  (function f(){
    var tt=t?t-parseInt(step*(t/count)):0;
    var ll=l?l-parseInt(step*(l/count)):0;
    var bb=b<h?b+parseInt(step*((h-b)/count||1)):h;
    var rr=r<w?r+parseInt(step*((w-r)/count||1)):w;
    $next.css({
      clip:"rect("+tt+"px "+rr+"px "+bb+"px "+ll+"px)"
      });
    (step++<=count)?setTimeout(f,13):$curr.css("display","none");
  })();
});
opts.cssBefore={
  display:"block",
  opacity:1,
  top:0,
  left:0
};

opts.animIn={
  left:0
};

opts.animOut={
  left:0
};

};

})(jQuery);;
/*  $Name: ISA - Integrated Collaborative Platform - jQuery Initialization $
	$File: init.js $
	$Date: 2011-02-03 $
	$Modify date: 2014-05-27 $
	$Version: 006 $
 */
// Initialize the slideshow when the DOM is ready
$(document).ready(
    function (){

      // The Cycle Plugin is a slideshow that supports many different types of transition effects for the "Lasted News" displayed in the homepage.
      sColspanContentClass = 'colspan-6 first last';
      sColspanCycleClass = 'colspan-5 first last';
      $('#block-views-News_view-block_1').find('.view-content')
      .addClass(sColspanContentClass)
      .before('<div class="view-cycle ' + sColspanCycleClass + '">')
      .cycle(
        {
            fx:			'scrollUp'
            ,	
            speed:		100
            ,	
            timeout:	5000
            ,	
            pager:		'.view-cycle'
            ,	
            pause:		1
        }
        );
			
        aTitle = Array();
        aCreated = Array();
        $('#block-views-News_view-block_1').find('.fields').each(
            function (index)
            {
                aCreated[index] = '<span class="cycle-field-created">' + $(this).children('.field-created').html() + '</span>';
                aTitle[index] = '<span class="cycle-field-title">' + $(this).children('.field-title').find('a').html() + '</span>';
                $('.view-cycle').children('a').eq(index).html(aCreated[index] + aTitle[index]);
            }
            );
		
        // Show/hide the content of the filter region (fieldset) on text legend click.
        $('#filter').find('.collapse-processed').children('a').click( function () {
            $('#filter-region').toggleClass('collapsed');
            return false;
        } );
		
        // Display/hide the Propose dropdown menu with a sliding motion.
        $('div.buttons').find('a.action.propose-your').click( function () {
            $('div.quick-actions').children('ul.links').slideToggle();
            return false;
        });
		
		// Display/hide the Propose dropdown menu when an option is clicked.
        $('div.buttons').find('a.quick_action').click( function () {
            $('div.quick-actions').children('ul.links').hide();
        });
		
		
		// Display/hide the Actions dropdown menu with a sliding motion.
        $('div.buttons').find('a.action.actions').click( function () {
            $('div.actions').children('ul.links').slideToggle();
            return false;
        });

        // Display/hide the Actions dropdown menu when an option is clicked.
		$('div.buttons').find('a.links').click( function () {
            $('div.actions').children('ul.links').hide();
        });
		
		// Change link value when select changes
		$('#node-information').find('input.links-value').val($('#node-information').find('select').val());
        $('#node-information').find('select.links-select').change( function () {
            $('#node-information').find('input.links-value').val($('#node-information').find('select').val());
        });


        // Show/Hide the requiered/depends related projects
        $('#related-projects-select').change(
            function ()
            {
                var value = $(this).val();
                var theDiv = $('.' + value);
                $('.related-projects-required').addClass('accessibility-info');
                $('.related-projects-depends').addClass('accessibility-info');
                theDiv.removeClass('accessibility-info');
            }
            );

        $('#menu-wrapper > .menu > li.expanded:not(.active-trail)').hover(
          function () {
            $(this).addClass('active-trail');
          }, function () {
            $(this).removeClass('active-trail');
          }
        );
        
        // Expand/Collapse text using the "Read more" or "Hide text" button.       
        // add space after h5  in div class field  for ie
        if($.browser.msie)
        {
            $("div.field h5").css("padding-right","5px");
        }
        
        aViews = Array(
            Array('view-project-node', 66)
            ,	Array('view-homepage', 120)
            );
        function fnToggleReadMore(sActionButton, sToogleClass, sActionClass)
        {
            if (sToogleClass == 'view-footer') $(sActionButton).parents('.' + sToogleClass).prev().toggleClass('expanded');
            else $(sActionButton).parents('.' + sToogleClass).next().toggleClass('expanded');
            $(sActionButton).parents('.' + sToogleClass).hide();
            $(sActionButton).parents('.view').children('.' + sActionClass).show();
        }
        $('.read-more').click( function () {
            fnToggleReadMore(this, 'view-footer', 'view-header');
            return false;
        } );
        $('.reduce').click( function () {
            fnToggleReadMore(this, 'view-header', 'view-footer');
            return false;
        } );
        for (key=0; aViews.lenght; key++)
        {
            $('.' + aViews[key][0]).each( function (index) {
                var iContentHeight = $(this).height();
                if (iContentHeight < aViews[key][1]) $(this).find('.view-footer').hide();
            } );
        }
    
        $(window).resize(function() {
            if(typeof iBeginShare !== 'undefined')
                iBeginShare.hide();
        });

	//https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-840
	//Apply only to the expandable sections in semantic asset an semantic repository node, to avoid the same behaviour in the menu system
		$('.togglable > .expanded').hide();
        $(".togglable").click(function(){
            $(this).parent().children("div").slideToggle("slow");
            if (!$(this).find(".expanded").is(":visible") ) {
                $(this).find(".expanded").show();
                $(this).find(".collapsed").hide();
            }
            else {
                $(this).find(".expanded").hide();
                $(this).find(".collapsed").show();
            }
            return false;
        });
		// https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-909
		// User request - Federated repository page
		// The list of asset releases should be by default "unfolded". 
		
		$('.togglable-expanded > .collapsed').hide();
        $(".togglable-expanded").click(function(){
            $(this).parent().children("div").slideToggle("slow");
            if (!$(this).find(".collapsed").is(":visible") ) {
                $(this).find(".collapsed").show();
                $(this).find(".expanded").hide();
            }
            else {
                $(this).find(".collapsed").hide();
                $(this).find(".expanded").show();
            }
            return false;
        });
        
        if ($(".distribution-row .button-distributions a.asset-external-download").length) {
            $(".distribution-row .button-distributions a.asset-external-download").bind("click", function () {
                _google_analytics_track_outbound_link_click($(this).attr("href"));
            });
        }
        
        if ($("#node-information .field-distribution-access-url-description.asset-external-download a").length) {
            $("#node-information .field-distribution-access-url-description.asset-external-download a").bind("click", function () {
                _google_analytics_track_outbound_link_click($(this).attr("href"));
            });
        }

        // ISAICP-1670 : Override Popups.close() to refresh the parent page when closing a popup (if popups-form-reload class is present)
        Popups.refreshOnClose = function(popup) {
            if (!Popups.popupStack.length) {
                if (popup.options.updateMethod === 'reload') { // Force a complete, non-ajax reload of the page.
                    if (popup.options.updateSource === 'final') {
                        location.href = Drupal.settings.basePath + data.path; // TODO: Need to test this.
                    }
                    else { // Reload originating page.
                        location.reload();
                    }
                }
            }
        };

        Popups.close = function(popup) {
            if (!Popups.isset(popup)) {
                popup = Popups.activePopup();
            }
            Popups.removePopup(popup);  // Should this be a pop??
            Popups.removeLoading();
            if (Popups.activePopup()) {
                Popups.activePopup().show();
                Popups.activePopup().refocus();
            }
            else {
                Popups.removeOverlay();
                // Add this
                Popups.refreshOnClose(popup);
                Popups.restorePage();
            }
            return false;
        };
        
        if ($("#block-isa_links-menus_left .left-menu").length) {
            var total_ul_width = 0;
            $("#block-isa_links-menus_left .left-menu ul").each(function() {
               total_ul_width += parseInt($(this).width(), 10); 
            });
            if (total_ul_width > 950) {
                //resize tabs to fit
                $("#block-isa_links-menus_left .left-menu ul.links li").each(function() {
                    $(this).addClass("small");
                });
                $("#block-isa_links-menus_left .left-menu ul.links li a").each(function() {
                    if ($(this).text().length <= 10) {
                        $(this).parent("li").addClass("small_text");
                    }
                });
                $("#block-isa_links-menus_left .left-menu ul.links li a").each(function() {
                    var nr_of_words = $(this).text().split(" ").length;
                    $(this).addClass("word_" + nr_of_words);
                    $(this).attr("title", $(this).text());
                    $(this).html($(this).text().replace(" ", "<br />"));
                });
            }
        }   
    }
  );
  
function _google_analytics_track_outbound_link_click (outbound_url) {
    _gaq.push(['_trackEvent', 'Outbound links', 'Clicks', outbound_url]);
}
  
function advanced_search(facets) {
    var hrefval  = $('#adsearch').attr('href').valueOf() + "/";
    var val = $('#edit-keys').val();
    if (val == undefined) {
        val = $('#edit-text').val();
    }    
    if (val == undefined) {
        val='';
    }
    //ISAICP-726
    //Modify the advanced search link
    if (facet != '0'){
        //https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-818
        //Change filters vars, the facets var has to contain al the facet filters
        var facet = '?filters='+facets+'&retain-filters=1&hidden_type=1';
        $('#adsearch').attr("href", hrefval + val + facet);
    }else{
        $('#adsearch').attr("href", hrefval + val); 
    }
};

function resizeDiv(){
    var doc_width = (document.documentElement.clientWidth);

    document.getElementById('homebox').style.width = (doc_width * 0.8 - 200)+'px';
    $('div.field-comments-comment').width((doc_width * 0.216) + 'px');
    $('div.views-field-subject').width((doc_width * 0.216) + 'px');
    $('div.views-field-nid-2').width((doc_width * 0.107) + 'px');
    $('div.views-field-created').width((doc_width * 0.107) + 'px');
    $('div.views-field-type').width((doc_width * 0.107) + 'px');
};

function addEvent(element, type, listener){
    if(element.addEventListener){
        element.addEventListener(type, listener, false);
    }else if(element.attachEvent){
        element.attachEvent("on"+type, listener);
    }
};;
var translations = { // All translations used in webservice
	"en":{"wsD":"Ok","wsE":"Webservice is busy, try later","wsL":"Please wait","wsR":"No languages found"},
	"bg":{"wsE":"??? ???????????? ?? ????????, ???????? ??-?????.","wsL":"???? ?????????","wsR":"?? ?? ???????? ??????? ?? ????? ?????"},
	"cs":{"wsE":"Webová služba je vytížená, zkuste to znovu pozd?ji","wsL":"Prosím ?ekejte","wsR":"Nebyly nalezeny žádné jiné jazykové verze"},
	"da":{"wsE":"Webtjenesten er optaget, prøv igen senere","wsL":"Vent venligst","wsR":"Ingen sprog fundet"},
	"de":{"wsE":"Webservice besetzt, später nochmals versuchen ","wsL":"Bitte warten","wsR":"Keine Sprache gefunden"},
	"el":{"wsE":"? ???????? ???????? ??? ????? ??????, ????????? ????????","wsL":"??????????","wsR":"??? ??????? ????? ??????"},
	"es":{"wsE":"Servicio web ocupado, inténtelo más tarde","wsL":"Espere","wsR":"No se ha encontrado ningún idioma"},
	"et":{"wsE":"Veebiteenus on hõivatud, proovige hiljem uuesti","wsL":"Palun oodake","wsR":"Muid keeli ei leitud"},
	"fi":{"wsE":"Verkkopalvelu ei ole tällä hetkellä käytettävissä, yritä myöhemmin uudelleen","wsL":"Odota","wsR":"Muita kieliä ei löytynyt"},
	"fr":{"wsE":"Ce service web est occupé. Veuillez réessayer plus tard.","wsL":"Veuillez patienter","wsR":"Aucune autre langue trouvée"},
	"ga":{"wsE":"Tá an suíomh gréasáin gnóthach, bain triail as níos déanaí ","wsL":"Fan, le do thoil","wsR":"Ní bhfuarthas aon teanga "},
	"hu":{"wsE":"A webszolgáltatás foglalt, kérjük, próbálja kés?bb!","wsL":"Kérjük várjon","wsR":"Nincs találat"},
	"it":{"wsE":"Servizio web occupato, prova più tardi","wsL":"Attendere prego","wsR":"Nessuna lingua trovata"},
	"lt":{"wsE":"Tinklo tarnyba užimta, bandykite v?liau","wsL":"Prašome palaukti","wsR":"Kalb? nerasta"},
	"lv":{"wsE":"Šis t?mek?a pakalpojums ir noslogots, m??iniet v?l?k.","wsL":"L?dzu, uzgaidiet","wsR":"Nav atrasta neviena cita valoda"},
	"mt":{"wsE":"Is-servizz tal-web huwa okkupat, er?a pprova aktar tard","wsL":"Jekk jog??bok stenna","wsR":"Ma nstabet l-ebda lingwa"},
	"nl":{"wsE":"De webservice is overbelast, probeer het later opnieuw.","wsL":"Even geduld","wsR":"Geen talen gevonden"},
	"pl":{"wsE":"Serwis nie odpowiada, spróbuj pó?niej","wsL":"Prosz? czeka?","wsR":"Nie znaleziono innych j?zyków"},
	"pt":{"wsE":"Serviço Web ocupado. Tente mais tarde.","wsL":"Aguarde","wsR":"Nenhuma língua encontrada"},
	"ro":{"wsE":"Serviciul web este ocupat, v? rug?m reveni?i.","wsL":"V? rug?m a?tepta?i","wsR":"Nu au fost g?site alte limbi"},
	"sk":{"wsE":"Webová služba je pre?ažená, vyskúšajte neskôr","wsL":"?akajte, prosím","wsR":"Preklady do iných jazykov nenájdené"},
	"sl":{"wsE":"Spletna storitev trenutno ni na voljo. Poskusite znova kasneje.","wsL":"Po?akajte trenutek.","wsR":"Drugi jeziki niso na voljo"},
	"sv":{"wsE":"Webbtjänsten är upptagen, försök igen senare","wsL":"Var god vänta","wsR":"Hittar inga andra språk"}
},// global variable
	doc			 	= document,
	docType			= doc.documentElement||doc.body,
	isIE			= /*@cc_on!@*/false,
	isIE6			= isIE&&(!window.XMLHttpRequest),
corporate={ // scripts used in the banner
	img				:["/wel/template-2012/images/arrows-down.gif","/wel/template-2012/images/arrows-up.gif"],
	run				:function(){var b=doc.getElementsByTagName('body');if(b.length==1){var c=b[0].className;b[0].className=(c)?"js "+c:"js";}corporate.getDocLang();corporate.langSelector();corporate.minMaxCSS();tools.init();},
	//https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-841
	//Remove javascript:void(0) to avoid https errors
	ready			:function(func){if(corporate.domIsReady){func();return;}if(!corporate.loadEvents){corporate.loadEvents=[];}var doc=document;function isReady(){corporate.domIsReady=true;clearInterval(corporate.loadTimer);while(corporate.exec=corporate.loadEvents.shift()){corporate.exec();}if(corporate.ieReady){corporate.ieReady.onreadystatechange='';}}if(!corporate.loadEvents[0]){if(doc.addEventListener){doc.addEventListener("DOMContentLoaded",isReady,false);}else if(isIE){document.write("<script id='__ie_onload' defer src=''><\/script>");var script=document.getElementById("__ie_onload");script.onreadystatechange=function(){if(this.readyState=="complete"){isReady();}};}else if(/WebKit|KHTML|iCab/i.test(navigator.userAgent)){corporate.loadTimer=setInterval(function(){if(/loaded|complete/.test(doc.readyState)){isReady();}},10);}corporate.oldOnload=window.onload;window.onload=function(){isReady();if(corporate.oldOnload){corporate.oldOnload();}};}corporate.loadEvents.push(func);},
	addEvent		:function(o,e,f){if(o.addEventListener){o.addEventListener(e,f,false);}else if(o.attachEvent){if(e=="load"&&window.isLoad){f();return;}if(!o[e]){o[e]=[];}var l=o[e].length;function r(){for(var i=0;i<l+1;i++){o[e][i]();}if(e=="load"){window.isLoad=true;}}o[e][l]=f;o["on"+e]=r;}},
	getDocLang		:function(){var h=doc.getElementsByTagName('html');if(h.length==1){var l=h[0].lang;if(l){doc.lang=l;return;}}var v=corporate.getMetaValue("content-language");if(v){doc.lang=v;return;}var l=window.location+"",u=l.replace( /(.*)(_|-|::|=)([a-zA-Z]{2})(\.|&|#)(.*)/ig,"$3");if(u.length==2&&u){doc.lang=u.toLowerCase();return;}if(!doc.lang){doc.lang="en";}},
	getMetaValue	:function(h){var p=document.getElementsByTagName("meta"),a,o="",l,q,v,n;for(var i=0,j=p.length;i<j;i++){if(p[i].nodeType==1){a=p[i].attributes;l="";q="";for(var k=0,f=a.length;k<f;k++){v=a[k].value;n=a[k].name;if(v!=""&&(n=="name"||n=="http-equiv")){l=v;}else{if(n=="content"){q=v;}}}if(l.toLowerCase()==h.toLowerCase()){o=q;break;}}}return o.toLowerCase();},
	minMaxCSS		:function(){var l=doc.getElementById("layout"),w,ma=null,mi=null;if(l&&isIE6){function r(){w=docType.clientWidth;l.style.width=(w<(mi+2)?mi+"px":(w>(ma+2)&&ma!="auto")?ma+"px":"auto");}if(mi===null||ma===null){mi=parseInt(l.currentStyle.minWidth||l.currentStyle["min-width"],10)||"auto";ma=parseInt(l.currentStyle.maxWidth||l.currentStyle["max-width"],10)||"auto";if(mi=="auto"||ma=="auto"){return;}setTimeout(function(){r();},0);corporate.addEvent(window,"resize",r);}}},
	//https://webgate.ec.europa.eu/CITnet/jira/browse/ISAICP-841
	//Remove javascript:void(0) to avoid https errors
	langSelector	:function(){var	ls=doc.getElementById("language-selector");if(!ls){return;};var li=ls.getElementsByTagName("li"),lk=ls.getElementsByTagName("a"),clk,cli,cur,men="",slc,span,fno=true,a,b,c,d,e,f,img,lng=li.length,lk;ls.className="reset-list language-selector-close";function toggle(){if(ls.isOpen){closeMe();}else{show();this.blur();}}function over(){cur.onblur=null;cur.onfocus=null;timer();}function timer(){clearTimeout(ls.timer);}function show(){timer();ls.className="reset-list language-selector-open";ls.isOpen=true;if(isIE){var ow=ls.offsetWidth;ls.style.width=(ow-2)+"px";setTimeout(function(){ls.removeAttribute("style");},0);}setTimeout(function(){img.src=corporate.img[1];},0);if(lng==1){ls.className="reset-list language-selector-open language-selector-alone";}}function hide(){set(cur);if(ls.isOpen){ls.timer=setTimeout(closeMe,250);}}function closeMe(){timer();ls.className="reset-list language-selector-close";ls.isOpen=false;img.src=corporate.img[0];if(lng==1){ls.className="reset-list language-selector-close";}}function set(elm){elm.onfocus=show;elm.onblur=hide;}function bindEvent(){for(var i=0,l=lk.length;i<l;i++){clk=lk[i];if(i==0){cur=clk;clk.onclick=toggle;}set(clk);}}function builMenu(){var x=0,io="",ifa;for(var i=0,l=li.length;i<l;i++){clk=lk[x];cli=li[i];a=cli.className;b=cli.lang;c=cli.title;if(clk){d=clk.href;e=clk.lang;f=clk.title;}if(a.indexOf("selected")!= -1){span=cli.getElementsByTagName("span")[0].innerHTML;slc="<li class='selected'><a href='' lang='"+b+"'><span class='off-screen'>"+span+" </span>"+c+" ("+b+")"+"<img src='"+corporate.img[0]+"' alt='' border='0'></a></li>";}else{if(a.indexOf("non-official")!= -1 && fno==true){io=" class='lang-separate'";fno=false;}else{io=""}men +="<li"+io+"><a href='"+d+"' hreflang='"+e+"' lang='"+e+"'>"+f+" ("+e+")"+"</a></li>";x++;}}ls.innerHTML=slc+""+men;img=ls.getElementsByTagName("img")[0];lk=ls.getElementsByTagName("a");bindEvent();}builMenu();ls.onmouseout=hide;ls.onmouseover=over;}
},
tools={ // Some widget tools for the accessibility
	fontSet			:[1,2,3,4],
	init			:function(){var t=doc.getElementById("additional-tools");if(t){this.getFontSize();}},
	setCook			:function(cookName,cookValue,cookDay){var s,e="";if(cookDay){s=new Date();s.setTime(s.getTime()+(cookDay*24*60*60*1000));e=";expires="+s.toGMTString();}doc.cookie=cookName+"="+cookValue+e+";path=/";},
	getCook			:function(cookName,cookDefaultValue){var c,o,n,i,t;o=doc.cookie.split(';');n=cookName+"=";for(i=0,t=o.length;i<t;i++){c=o[i];while(c.charAt(0)==' '){c=c.substring(1,c.length);}if(c.indexOf(n)===0){return c.substring(n.length,c.length);}}return cookDefaultValue||null;},
	getFontSize		:function(){cfz=this.getCook("fontSize");if(!cfz || cfz > 4 || cfz < 0 || isNaN(cfz)){cfz=1;}else{this.applyFontSize(cfz);}},
	applyFontSize	:function(cfz){var n=this.fontSet[cfz];if(n){var b=doc.body,c=b.className.replace(/ font-size-(1|2|3|4|5)/ig,"");b.className=c+" font-size-"+(Math.round(cfz));this.setCook("fontSize",cfz);}},
	increaseFontSize:function(){var l=this.fontSet.length;cfz++;if( cfz > l-1 ){cfz = l-1;}this.applyFontSize(cfz);},
	decreaseFontSize:function(){cfz--;if( cfz <= 0 ){cfz = 1;}this.applyFontSize(cfz);},
	printPage		:function(){print();}
},
translate={ // Allow scripts to use a dictionnary in javascript
	label			:function(l){var c="",t=translations[doc.lang],d=translations["en"];if(t){c=(t[l])?t[l]:false;}if(c==""||!c){c=(d[l])?d[l]:"";}return c;},
	add				:function(json){var t=translations,n=json;for(var i in t){if(n[i]){for(var l in n[i]){t[i][l]=n[i][l];}}}for(var i in n){if(!t[i]){t[i]={};for(var l in n[i]){t[i][l]=n[i][l];}}}return t;}
},
webservice={ // Retrieve any translations of any documents and showing inside a popup.
	img				:["/wel/images/languages/ws.gif","/wel/images/languages/loading.gif"],
	xhr				:function(){var x=false,w=window;if(w.XMLHttpRequest){x=new XMLHttpRequest();}else if(w.ActiveXObject){x=new ActiveXObject("Microsoft.XMLHTTP");}return x;},
	getViewport		:function(){var v=window,w=v.innerWidth,h=v.innerHeight;return {w:(!w)?docType.clientWidth:w,h:(!h)?docType.clientHeight:h};},
	getPosition		:function(domElm){var x=0,y=0,d=domElm;if(d){try{if(d.offsetParent){do{x +=d.offsetLeft;y +=d.offsetTop;}while(d=d.offsetParent);}}catch(e){};}return [x,y];},
	wrap			:function(srcEl,newEl){if(!srcEl){return;};newEl.appendChild(srcEl.cloneNode(true));if(srcEl.parentNode){srcEl.parentNode.replaceChild(newEl,srcEl);}},
	prevLink		:function(srcElm,tag){var e=srcElm,o=e;for(;e;e=e["previousSibling"]){if( e.nodeType === 1 && e!=o ){break;}}return e;},
	load			:function(c){var u=c["url"],e=c["error"],s=c["success"];if(u!=""&&u!=undefined&&u!=null){var r=webservice.xhr();if(!r){return;}u=u.replace(/&amp;/ig,"&");r.onreadystatechange=function(){if(r.readyState==4){if(r.status!=200&&r.status!=304){if(typeof e=="function"){e(c);}}else{if(typeof s=="function"){s(r.responseText,r.responseXML,c);}else{return {txt:r.responseText,xml:r.responseXML};}}}};r.open("GET",u,true);r.send(null);}},
	popup			:function(srcElm,coverage)
	{
		var e=srcElm,span=e.parentNode,wsUrl=(span)?span.u:null;

	// CREATE THE REF CONTAINER ON THE FLY

		if(span.tagName!="SPAN"){span=document.createElement("span");span.className="ws-popup";webservice.wrap(e,span);if(coverage){wsUrl=span.u=coverage;}else{var p=webservice.prevLink(span,"A");wsUrl=span.u="/cgi-bin/coverage/coverage?url="+encodeURIComponent(decodeURIComponent(p.href));}}

	// DOM CACHE

		var	iso		= span,
			child	= span.getElementsByTagName("span"),
			popup	= child[1],
			img		= span.getElementsByTagName("img")[0],
			imgSrc	= (img)?img.src:webservice.img[0],
			lnk		= e.href,
			cls		= span.className.split(" ")[0],
			v		= webservice.getViewport(),
			p		= webservice.getPosition(span),
			st		= docType.scrollTop||document.body.scrollTop,
			sl		= docType.scrollLeft||document.body.scrollLeft,
			pSpan	= webservice.prevPopup;
			e.href 	= "javascript:void(0)";

			if(!span.oTitle){span.oTitle=e.title;}

	// Close the previous available "POPUP"
		if(pSpan){clearTimeout(pSpan.timer);pSpan.getElementsByTagName("a")[0].title=pSpan.oTitle;var pImg=pSpan.getElementsByTagName("img")[0];if(pImg){pImg.src=imgSrc;pImg.alt=pSpan.oTitle;}setTimeout(function(){pSpan.isOpen=false;},50);pSpan.className=cls;}
	// WS: CLOSE
		if(span.isOpen && wsUrl){if(popup){popup.innerHTML="";}close();}
	// WS: CALL
		else if(wsUrl){wsUrl=wsUrl.replace(/&amp;/ig,"&");webservice.prevPopup=span;pop("wsL",cls+" ws-loading");if(popup){popup.innerHTML="";}else{popup=doc.createElement("span");popup.className="ws-links";span.appendChild(popup)}webservice.prevPopup.timer=setTimeout(function(){webservice.load({url:wsUrl,success:success,error:error});},250);}
	// MODAL WINDOW CLOSE
		else if(span.isOpen){if(popup){popup.style.display="none";}close();}
	// MODAL WINDOW SHOW
		else{if(popup){popup.style.display="block";popup.style.left="-5px";}show();}

	// FUNCTIONS

		function out(){popup.timer=setTimeout(function(){close();},250);}
		function over(){clearTimeout(popup.timer);}
		function restore(elm,cls){if(cls){elm.className=cls;}elm.getElementsByTagName("a")[0].title=elm.oTitle;}
		function bindEvent(){var lnks=popup.getElementsByTagName("a");for(var i=0,l=lnks.length;i<l;i++){lnks[i].onblur=out;lnks[i].onfocus=over;}}
		function getOverflowParent(elm){if(elm.style){if(elm.style.overflow!=""){iso=elm;iso.doit=true;}else{iso=elm.parentNode;getOverflowParent(iso);}}}
		function error(xml){if(xml[0]){pop("wsE",cls + " ws-error",xml[0].firstChild.nodeValue);}else{pop("wsE",cls + " ws-error");}}
		function getList(xml){var h,s,t,v='',p,b,r,a,i,j,e,z,n,l='';z=xml.getElementsByTagName("message");d=xml.getElementsByTagName("document");p=d.length;n=z.length;c=false;k=doc.lang;for(i=0;i<p;i++){b=d[i];r=b.getAttribute("lang");a=b.getAttribute("label");t=b.getAttribute("type");e=b.getAttribute("href").split("#")[0]+window.location.hash;s=a.split("(")[0];l +='<a class="lang" href="'+e+'" hreflang="'+r+'" lang="'+r+'" title="'+a+'"><span class="off-screen">'+s+' (</span>'+r+'<span class="off-screen">)</span></a> ';}return {lst:l,nbr:n,cnt:p,error:z};}
		function success(txt,xml,cfg){var ws=getList(xml);if(ws.lst!==''){pop("wsD",cls,ws.lst);}else if(ws.nbr==0&&ws.cnt==0){pop("wsR",cls+" ws-retry");}else if(ws.nbr>0||ws.lst==""){error(ws.error);}}
		function pop(label,cls,content){var cnt=content,lbl=translate.label(label);cnt=(cnt)?cnt:lbl;span.className=cls;e.title=lbl;if(label!="wsL"){popup.innerHTML="<span class='ws-popup-layout'>"+cnt+"</span>";if(img){img.src=imgSrc;img.alt=lbl;}show();}else{if(img){img.src=webservice.img[1];img.alt=lbl;}}}
		function close(elm){span.getElementsByTagName("a")[0].title=span.oTitle;img=span.getElementsByTagName("img")[0];if(img){img.src=imgSrc;img.alt=span.oTitle;}span.isOpen=false;span.className=cls;var c=span.getElementsByTagName("span");if(c){if(c[1]){c[1].style.left="-9999px";}}if(popup){popup.style.display="none";}e.onblur=function(){};}
		function show(){span.isOpen=true;span.className=cls+" ws-popup-show";var a=span.getElementsByTagName("a");if(a[0]){a[0].focus();}if(popup){popup.style.display="";}
			// POSITION THE POPUP
			var c=span.getElementsByTagName("span"),m=c[1],j=c[2],w,h,vl,vt,o;
			m.style.width="170px";
			m.style.zIndex="9999";
			m.style.top="-5px";
			m.style.left="-5px";
			w=j.offsetWidth;
			h=j.offsetHeight;
			if((p[0]+w)>(v.w+sl)){vl=((p[0]+w)-(v.w+sl));vl=(!isIE)?(vl+20):(vl+5);m.style.left="-"+vl+"px";}
			if((p[1]+h+16)>(v.h+st)){vt=((p[1]+h)-(v.h+st));vt=(!isIE)?(vt+20):(vt+5);m.style.top="-"+vt+"px";}

			// IN OVERFLOW ELEMENT ?
			getOverflowParent(span);if(iso.doit){o=webservice.getPosition(iso);v.w=iso.offsetWidth;v.h=iso.offsetHeight;st=iso.scrollTop;sl=iso.scrollLeft;if(w>v.w){w=Math.round((v.w)-70);j.style.width=w+"px";h=j.offsetHeight;}if((p[0]+w)>o[0]+v.w+sl){m.style.left="-"+(((p[0]+w)-(o[0]+v.w+sl))+30)+"px";}if((p[1]+h+16)>(o[1]+v.h+st)){m.style.top="-"+((p[1]+h+5)-(o[1]+v.h+st)+10)+"px";}}

			// EVENTS
			bindEvent();span.onmouseover=over;span.onmouseout=out;
			if(w){m.style.width=w+"px";}
			setTimeout(function(){e.href=lnk;e.onblur=function(){restore(span);out();};},5);
		}
}};
corporate.ready(corporate.run);;
/* Placeholders.js v3.0.2 */
(function(t){"use strict";function e(t,e,r){return t.addEventListener?t.addEventListener(e,r,!1):t.attachEvent?t.attachEvent("on"+e,r):void 0}function r(t,e){var r,n;for(r=0,n=t.length;n>r;r++)if(t[r]===e)return!0;return!1}function n(t,e){var r;t.createTextRange?(r=t.createTextRange(),r.move("character",e),r.select()):t.selectionStart&&(t.focus(),t.setSelectionRange(e,e))}function a(t,e){try{return t.type=e,!0}catch(r){return!1}}t.Placeholders={Utils:{addEventListener:e,inArray:r,moveCaret:n,changeType:a}}})(this),function(t){"use strict";function e(){}function r(){try{return document.activeElement}catch(t){}}function n(t,e){var r,n,a=!!e&&t.value!==e,u=t.value===t.getAttribute(V);return(a||u)&&"true"===t.getAttribute(D)?(t.removeAttribute(D),t.value=t.value.replace(t.getAttribute(V),""),t.className=t.className.replace(R,""),n=t.getAttribute(F),parseInt(n,10)>=0&&(t.setAttribute("maxLength",n),t.removeAttribute(F)),r=t.getAttribute(P),r&&(t.type=r),!0):!1}function a(t){var e,r,n=t.getAttribute(V);return""===t.value&&n?(t.setAttribute(D,"true"),t.value=n,t.className+=" "+I,r=t.getAttribute(F),r||(t.setAttribute(F,t.maxLength),t.removeAttribute("maxLength")),e=t.getAttribute(P),e?t.type="text":"password"===t.type&&M.changeType(t,"text")&&t.setAttribute(P,"password"),!0):!1}function u(t,e){var r,n,a,u,i,l,o;if(t&&t.getAttribute(V))e(t);else for(a=t?t.getElementsByTagName("input"):b,u=t?t.getElementsByTagName("textarea"):f,r=a?a.length:0,n=u?u.length:0,o=0,l=r+n;l>o;o++)i=r>o?a[o]:u[o-r],e(i)}function i(t){u(t,n)}function l(t){u(t,a)}function o(t){return function(){m&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(D)?M.moveCaret(t,0):n(t)}}function c(t){return function(){a(t)}}function s(t){return function(e){return A=t.value,"true"===t.getAttribute(D)&&A===t.getAttribute(V)&&M.inArray(C,e.keyCode)?(e.preventDefault&&e.preventDefault(),!1):void 0}}function d(t){return function(){n(t,A),""===t.value&&(t.blur(),M.moveCaret(t,0))}}function g(t){return function(){t===r()&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(D)&&M.moveCaret(t,0)}}function v(t){return function(){i(t)}}function p(t){t.form&&(T=t.form,"string"==typeof T&&(T=document.getElementById(T)),T.getAttribute(U)||(M.addEventListener(T,"submit",v(T)),T.setAttribute(U,"true"))),M.addEventListener(t,"focus",o(t)),M.addEventListener(t,"blur",c(t)),m&&(M.addEventListener(t,"keydown",s(t)),M.addEventListener(t,"keyup",d(t)),M.addEventListener(t,"click",g(t))),t.setAttribute(j,"true"),t.setAttribute(V,x),(m||t!==r())&&a(t)}var b,f,m,h,A,y,E,x,L,T,N,S,w,B=["text","search","url","tel","email","password","number","textarea"],C=[27,33,34,35,36,37,38,39,40,8,46],k="#ccc",I="placeholdersjs",R=RegExp("(?:^|\\s)"+I+"(?!\\S)"),V="data-placeholder-value",D="data-placeholder-active",P="data-placeholder-type",U="data-placeholder-submit",j="data-placeholder-bound",q="data-placeholder-focus",z="data-placeholder-live",F="data-placeholder-maxlength",G=document.createElement("input"),H=document.getElementsByTagName("head")[0],J=document.documentElement,K=t.Placeholders,M=K.Utils;if(K.nativeSupport=void 0!==G.placeholder,!K.nativeSupport){for(b=document.getElementsByTagName("input"),f=document.getElementsByTagName("textarea"),m="false"===J.getAttribute(q),h="false"!==J.getAttribute(z),y=document.createElement("style"),y.type="text/css",E=document.createTextNode("."+I+" { color:"+k+"; }"),y.styleSheet?y.styleSheet.cssText=E.nodeValue:y.appendChild(E),H.insertBefore(y,H.firstChild),w=0,S=b.length+f.length;S>w;w++)N=b.length>w?b[w]:f[w-b.length],x=N.attributes.placeholder,x&&(x=x.nodeValue,x&&M.inArray(B,N.type)&&p(N));L=setInterval(function(){for(w=0,S=b.length+f.length;S>w;w++)N=b.length>w?b[w]:f[w-b.length],x=N.attributes.placeholder,x?(x=x.nodeValue,x&&M.inArray(B,N.type)&&(N.getAttribute(j)||p(N),(x!==N.getAttribute(V)||"password"===N.type&&!N.getAttribute(P))&&("password"===N.type&&!N.getAttribute(P)&&M.changeType(N,"text")&&N.setAttribute(P,"password"),N.value===N.getAttribute(V)&&(N.value=x),N.setAttribute(V,x)))):N.getAttribute(D)&&(n(N),N.removeAttribute(V));h||clearInterval(L)},100)}M.addEventListener(t,"beforeunload",function(){K.disable()}),K.disable=K.nativeSupport?e:i,K.enable=K.nativeSupport?e:l}(this);;
