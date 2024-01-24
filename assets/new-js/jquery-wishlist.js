/* 
 * Last Version 1.3.2 by Simone Luise
 * http://github.com/Frogmouth/jQuery.Wishlist/
 */

(function($){
	
	// window.wishList: oggetto che verrà popolato dalle impostazini generali di wishlist che varranno per tutte le istanze del plugin e che al suo interno conterrà tutti le collection
	// serve per reperire tutte le informazioni all'esterno del plugin, anche dopo che è stato richiamato, le varie collection sono richiamabili tramite:
	// var collezione = window.wishList[setCookie.name]
	// dove "setCookie.name" è il nome del cookies impostato nel plugin.
	
	window.wishList = {
		length : 0
	};
	
	if(typeof _ == "undefined" || typeof Backbone == "undefined") return wishlist = false;

	//fine controlli
	
	$.fn.wishItem = function(options,WISHLIST){

		var $that = this;
		var settings = this.settings = $.extend({
			removeClass : "removeToWish",			// classe su cui bindare l'evento per rimuovere elementi dal cookies
			addClass : "addToWish",					// classe su cui bindare l'evento per aggiungere elmenti al cookies
			triggerClass : "wishAction",			// classe statica su cui bindare tutti gli eventi di modifica
			sameButton : true,						// usare lo stesso bottone per aggiungere e rimuovere gli elementi
			triggerEvent : "click",					// eventi sui quali bindare [0] -> aggiunta e [1] -> rimozione di elementi del cookies
			picker : null,							// funzione che sovrascrive il metodo di raccolta delle informazioni

			//override methods

			onRemove : null,
			onAdd : null,
			onClean : null

		},options);

		//ALTRI METODI
		//metodo che raccoglie tutte le da inserire nel modello backbone
		var picker =  settings.picker || function(item){
			//per il local storage prendo tutti i dati per i cookie solo l'ID
			var data = (WISHLIST.settings.useStorage) ? item.data() : {id:item.data("id")};
			return data;
			//--> gestione elmenti multipli
		}
		
		//COLLECATORI DEI GESTORI AGLI EVENTI

		//metodo che definisce i trigger
		var unsetAttHandler = function(){
			$that.addClass("wishDisabled");
			$that.on("click",function(){
				console.log("COOKIE DISABLED");
			});
		}

		var defOnClean = settings.onClean || function(){
			$that.find("."+settings.triggerClass).addClass($that.settings.addClass).removeClass($that.settings.removeClass);
		}

		var defOnAdd = settings.onAdd || function(item){
			$that.find("[data-id="+item.id+"]").addClass($that.settings.addClass).removeClass($that.settings.removeClass);
		}

		var defOnRemove = settings.onRemove || function(item){
			$that.find("[data-id="+item.id+"]").removeClass($that.settings.addClass).addClass($that.settings.removeClass);
		}

		if(settings.useStorage){
			localStorage.wishlist = {};
			setHandler = true;
		}else{
			setHandler = (navigator.cookieEnabled) ? true : false;
		}

		if(!setHandler) return unsetAttHandler();

		WISHLIST.propagate.wishItem = function(action,item){
			switch(action){
				case "remove" : defOnRemove(item);
				break;
				case "add" : defOnAdd(item);
				break;
				case "reset" : defOnClean();
				break;
			}
		}
		$(document).on(settings.triggerEvent + ".wish","."+settings.triggerClass, function(event){
	        event.preventDefault();
	        var data = picker($(this));

	        if($(this).hasClass(settings.addClass)){
	            WISHLIST.addToWish(data);
	            if(settings.addClass) $(this).removeClass(settings.addClass).addClass(settings.removeClass);
	        }else{
	            WISHLIST.removeToWish(data.id);
	            if(settings.addClass) $(this).removeClass(settings.removeClass).addClass(settings.addClass);
	        }
	    });
		return this.each(function(){
			$(this).data("wishList",WISHLIST);
			if(typeof WISHLIST.data.get($(this).find("."+settings.triggerClass).data("id")) !== "undefined") $(this).find("."+settings.triggerClass).removeClass(settings.addClass).addClass(settings.removeClass);
		});
	}

	$.fn.wishBar = function(options1,options2,WISHLIST){
	
		var that = this;

		var settings1 = this.settings = $.extend({
			
			//template underscore che verrà inserito negli item 
			template: "<a href='<%- href %>' class='linking-list'></a><li rel='<%- wid %>' id='wishItem_<%- id %>' class='wishedItem listing-pro-li item1' data-id='<%- id %>' data-img='<%- img %>' data-title='<%- title %>' data-href='<%- href %>' data-price='<%- price %>'data-proptype='<%- proptype %>' data-permonth='<%- permonth%>' data-bedrooms='<%- bedrooms%>' data-bathrooms='<%- bathrooms%>' data-parking='<%- parking%>' data-propertysize='<%- propertysize%>' data-view='<%- view%>' data-subcommunity='<%- subcommunity%>' data-developer='<%- developer%>' data-status='<%- status%>' data-propertytypecategory='<%- propertytypecategory%>' data-community='<%- community%>' data-propertyname='<%- propertyname%>' data-locationmap='<%- locationmap%>' data-virtour='<%- virtour%>' data-ytube='<%- ytube%>' data-floorplanlink='<%- floorplanlink%>' data-latitude='<%- latitude%>' data-longitude='<%- longitude%>' data-propertypk='<%- propertypk%>' data-servicetypeid='<%- servicetypeid%>' data-propertytypenumber='<%- propertytypenumber%>'data-majorcategory='<%- majorcategory %>' data-propheadname='<%- propheadname %>' data-proptypetext='<%- proptypetext %>' data-pricepersqft='<%- pricepersqft %>' data-unitkey='<%- unitkey %>' data-sorttype='<%- sorttype %>'><div class='thumb dua-col-md-3 dua-col-xs-4 padding-0'><ul class='listing-gal1' id='listing-gal<%- id %>'><li><a href='<%- href %>' style='position:relative;'><img itemprop='image' class='img-responsive unit-thumbnail' alt='<%- title %>' style='border:none;width:100%;' src='<%- img %>'></a></li></ul><div id='myModal' class='modal fade' role='dialog' style='color:#000;'><div class='modal-dialog modal-md' role='document'><div class='modal-content' style='background-color: #fff;'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><img src='https://psinv.net/assets/img/close-btn.png' alt='close button' data-trid='809' style='width: 21px;'></button><h4 class='modal-title modal__title' id=''></h4></div><div class='modal-body' style='padding: 15px;'><img class='modal__img' src='#'id='' style='width: 100%;height: 230px;'><iframe id='registration-all' class='' src='https://registration.psinv.net/registration-mailer/project-registation/inquiry-white-new/?propertyId=<%- propertypk%>&serviceId=<%- servicetypeid%>&unittype=<%- propertytypenumber%>' style='border: none;width: 100%;height: 330px;margin-top: 20px;'></iframe></div></div></div></div><input type='checkbox' class='compare_btn' data-count='' id=''/><a class='wishAction removeToWish'data-id='<%- id %>'data-img='<%- img %>'data-title='<%- title %>'data-href='<%- href %>'data-price='<%- price %>'data-proptype='<%- proptype %>'data-permonth='<%- permonth%>'data-bedrooms='<%- bedrooms%>'data-bathrooms='<%- bathrooms%>'data-parking='<%- parking%>'data-propertysize='<%- propertysize%>'data-view='<%- view%>'data-subcommunity='<%- subcommunity%>'data-developer='<%- developer%>'data-status='<%- status%>'data-propertytypecategory='<%- propertytypecategory%>'data-community='<%- community%>'data-propertyname='<%- propertyname%>'data-locationmap='<%- locationmap%>'data-virtour='<%- virtour%>'data-ytube='<%- ytube%>'data-floorplanlink='<%- floorplanlink%>'data-latitude='<%- latitude%>'data-longitude='<%- longitude%>'data-propertypk='<%- propertypk%>'data-servicetypeid='<%- servicetypeid%>'data-propertytypenumber='<%- propertytypenumber%>'data-majorcategory='<%- majorcategory %>'data-propheadname='<%- propheadname %>'data-proptypetext='<%- proptypetext %>'data-pricepersqft='<%- pricepersqft %>'data-unitkey='<%- unitkey %>' href='#'></a><div class='virtual360'><a title='360 View' target='_blank' href='<%- virtour%>' class='virtual-360'><img class='listing-icons' style='margin-bottom: 0px;height:29px;width:35px;padding: 3px' src='/main/src/img/360-icon-listing-white.png?ver=1'></a> <a title='Watch Video' class='fancybox.iframe ExternalURLVideo yt-video' target='_blank' href='<%- ytube%>'><img class='listing-icons' style='margin-bottom: 0px;width: 32px;padding: 4px;' src='/main/src/img/yt-icon-listing-white.png?ver=1'></a></div></div><div class='list-and-other dua-col-md-9 dua-col-xs-8'><div class='list-text dua-col-md-8'><h3 class='price-text'>AED <%- price %></h3><p class='hastip text-green amount_p_m for-mobile' style='display: none;position: absolute;right: 4px;top: 12px;' title='‘Based on a 25 year mortgage at 4.49% interest'>AED <%- permonth%> per month*</p><p class='hastip text-green amount_p_m for-mobile' style='display: none;position: absolute;right: 4px;top: 22px;' title='Price Per Sqft'>AED <%- pricepersqft%> per sqft*</p><h2 class='propertyRemarks on-mobile-hide text-truncate' itemprop='name' style='font-size: 18px;text-transform: capitalize;padding-top: 7px;'><%- title %></h2> <h3 class='property-head-name on-mobile-hide' style='font-size: 15px;text-transform: capitalize;'><%- propheadname%></h3></div><div class='other-details dua-col-md-4 text-right'><h3 class='price-text-1 on-mobile-hide' style='padding-top: 7px;'><span itemprop='priceCurrency' content='AED'>AED</span> <span itemprop='price' content='900000'><%- price %></span></h3><p class='hastip text-green amount_p_m on-mobile-hide' title='‘Based on a 25 year mortgage at 4.49% interest'>AED <%- permonth%> per month*</p><p class='hastip text-green amount_p_m on-mobile-hide' title='Price Per Sqft'>AED <%- pricepersqft%> per sqft*</p><input type='hidden' id='_key' name='_unitkey' value='<%- unitkey%>'></div><div class='clear'></div><hr class='style-six on-mobile-hide' style='margin: 10px;'><div class='dua-col-md-6' style=''><div class='property-detail on-mobile-hide'><div class='first-tab'><div class='clear'></div><span class='show-proptype'><%- proptype %></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/bedroom-new.png'><%- bedrooms%></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/bathroom-new.png'> <%- bathrooms%></span><span class='on-mobile-hide'><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/parking-new.png'> <%- parking%></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/area-new.png'> <%- propertysize%> </span></div></div><h2 class='property-head-name for-mobile' style='display: none;'><%- propheadname%></h2></div><div class='dua-col-md-6 for-mobile' style='display: none;'><div class='property-detail for-mobile' style='display: none;'><div class='first-tab'><div class='clear'></div><span class='show-proptype' style='font-size: 10px;display:none'><%- proptype %></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/bedroom-new.png'> <%- bedrooms%></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/bathroom-new.png'> <%- bathrooms%></span><span style='font-size: 10px' class='on-mobile-hide'><img class='listing-icons' src='/main/src/img/parking-new.png'> <%- parking%></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/area-new.png'> <%- propertysize%> </span> </div></div><h3 class='propertyRemarks' style='display:none;'><%- title %></h3> <h2 class='property-head-name' style='display: none;'><%- propheadname%></h2></div><div class='dua-col-md-6' style=''><p class='parag on-mobile-hide px-0' style='text-align: right;padding-top: 0;'>Ref <%- id %></p><div class='dua-col-md-6 padding-0 ' style='display: none;'></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a class='main-buttn buttn-green btn-block deleteWished' title='Delete' data-id='<%- id %>'>Delete</a></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a href='tel:600548200' class='main-buttn buttn-green btn-block' title='CALL US'><i class='fa fa-phone' aria-hidden='true'></i></a></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a class='main-buttn buttn-green btn-block modal__openner' data-toggle='modal' data-target='#myModal' data-title='<%- title %> - <%- id %>' data-content='<%- img %>'><i class='fa fa-envelope' aria-hidden='true'></i></a> </div></div></div><div style='clear:both;'></div></li>",

			//override dei metodi di manipolazione del DOM
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
		},options1);

		var settings2 = this.settings = $.extend({
			
			//template underscore che verrà inserito negli item 
			//template : "<div rel='"+WISHLIST.ID+"' id='wishItem_<%- id %>' class='wishedItem' data-id='<%- id %>'><a href='<%- href%>'><img src='<%- img %>'><p><%- title %></p></a></div>",

			//override dei metodi di manipolazione del DOM
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
		},options2);
		
		//METODI DI MANIPOLAZIONE DEL DOM
		//invocato quando si aggiunge un elemento

		var itemList = settings1.addItemHtml || function(data){
			data.wid = WISHLIST.ID;
			var tmpl;
			if(data.sorttype=="unit"){ tmpl = _.template(settings1.template); }
			else if(data.sorttype=="project"){ tmpl = _.template(settings2.template); }
			var wishedHtml = tmpl(data);
			that.append(wishedHtml);
		}
		
		//invocato quando si rimuove un elemento
		var removeItem = settings1.removeItemHtml || function(id){
			if(typeof id == "undefined"){
				$("*[rel="+WISHLIST.ID+"]").fadeOut().remove();
				return;
			}
			$("#wishItem_"+id).fadeOut().remove();
		}


		WISHLIST.propagate.wishBar = function(action,item){
			switch(action){
				case "remove" : removeItem(item.id);
				break;
				case "add" : itemList(item);
				break;
				case "reset" : removeItem();
				break;
			}
		}

		that.data("wishList",WISHLIST);
		WISHLIST.data.forEach(function(value){
			itemList(value.attributes);
		});
		
		return this;
	}

	$.Wishlist = function(ID,options){

		if(typeof ID === "undefined") return false;

		var WARN = [];
		var WISHLIST = window.wishList[ID] = {};
		window.wishList.length++;

		var settings = WISHLIST.settings = $.extend({

			$wishBar : $("#wishList"),
			$wishItem : $(".wishItem"),
			barOption: {
      	template: "<a href='<%- href %>' class='linking-list'></a><li rel='<%- wid %>' id='wishItem_<%- id %>' class='wishedItem listing-pro-li item1' data-id='<%- id %>' data-img='<%- img %>' data-title='<%- title %>' data-href='<%- href %>' data-price='<%- price %>'data-proptype='<%- proptype %>' data-permonth='<%- permonth%>' data-bedrooms='<%- bedrooms%>' data-bathrooms='<%- bathrooms%>' data-parking='<%- parking%>' data-propertysize='<%- propertysize%>' data-view='<%- view%>' data-subcommunity='<%- subcommunity%>' data-developer='<%- developer%>' data-status='<%- status%>' data-propertytypecategory='<%- propertytypecategory%>' data-community='<%- community%>' data-propertyname='<%- propertyname%>' data-locationmap='<%- locationmap%>' data-virtour='<%- virtour%>' data-ytube='<%- ytube%>' data-floorplanlink='<%- floorplanlink%>' data-latitude='<%- latitude%>' data-longitude='<%- longitude%>' data-propertypk='<%- propertypk%>' data-servicetypeid='<%- servicetypeid%>' data-propertytypenumber='<%- propertytypenumber%>'data-majorcategory='<%- majorcategory %>' data-propheadname='<%- propheadname %>' data-proptypetext='<%- proptypetext %>' data-pricepersqft='<%- pricepersqft %>' data-unitkey='<%- unitkey %>' data-sorttype='<%- sorttype %>'><div class='thumb dua-col-md-3 dua-col-xs-4 padding-0'><ul class='listing-gal1' id='listing-gal<%- id %>'><li><a href='<%- href %>' style='position:relative;'><img itemprop='image' class='img-responsive unit-thumbnail' alt='<%- title %>' style='border:none;width:100%;' src='<%- img %>'></a></li></ul><div id='myModal' class='modal fade' role='dialog' style='color:#000;'><div class='modal-dialog modal-md' role='document'><div class='modal-content' style='background-color: #fff;'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><img src='https://psinv.net/assets/img/close-btn.png' alt='close button' data-trid='809' style='width: 21px;'></button><h4 class='modal-title modal__title' id=''></h4></div><div class='modal-body' style='padding: 15px;'><img class='modal__img' src='#'id='' style='width: 100%;height: 230px;'><iframe id='registration-all' class='' src='https://registration.psinv.net/registration-mailer/project-registation/inquiry-white-new/?propertyId=<%- propertypk%>&serviceId=<%- servicetypeid%>&unittype=<%- propertytypenumber%>' style='border: none;width: 100%;height: 330px;margin-top: 20px;'></iframe></div></div></div></div><input type='checkbox' class='compare_btn' data-count='' id=''/><a class='wishAction removeToWish'data-id='<%- id %>'data-img='<%- img %>'data-title='<%- title %>'data-href='<%- href %>'data-price='<%- price %>'data-proptype='<%- proptype %>'data-permonth='<%- permonth%>'data-bedrooms='<%- bedrooms%>'data-bathrooms='<%- bathrooms%>'data-parking='<%- parking%>'data-propertysize='<%- propertysize%>'data-view='<%- view%>'data-subcommunity='<%- subcommunity%>'data-developer='<%- developer%>'data-status='<%- status%>'data-propertytypecategory='<%- propertytypecategory%>'data-community='<%- community%>'data-propertyname='<%- propertyname%>'data-locationmap='<%- locationmap%>'data-virtour='<%- virtour%>'data-ytube='<%- ytube%>'data-floorplanlink='<%- floorplanlink%>'data-latitude='<%- latitude%>'data-longitude='<%- longitude%>'data-propertypk='<%- propertypk%>'data-servicetypeid='<%- servicetypeid%>'data-propertytypenumber='<%- propertytypenumber%>'data-majorcategory='<%- majorcategory %>'data-propheadname='<%- propheadname %>'data-proptypetext='<%- proptypetext %>'data-pricepersqft='<%- pricepersqft %>'data-unitkey='<%- unitkey %>' href='#'></a><div class='virtual360'><a title='360 View' target='_blank' href='<%- virtour%>' class='virtual-360'><img class='listing-icons' style='margin-bottom: 0px;height:29px;width:35px;padding: 3px' src='/main/src/img/360-icon-listing-white.png?ver=1'></a> <a title='Watch Video' class='fancybox.iframe ExternalURLVideo yt-video' target='_blank' href='<%- ytube%>'><img class='listing-icons' style='margin-bottom: 0px;width: 32px;padding: 4px;' src='/main/src/img/yt-icon-listing-white.png?ver=1'></a></div></div><div class='list-and-other dua-col-md-9 dua-col-xs-8'><div class='list-text dua-col-md-8'><h3 class='price-text'>AED <%- price %></h3><p class='hastip text-green amount_p_m for-mobile' style='display: none;position: absolute;right: 4px;top: 12px;' title='‘Based on a 25 year mortgage at 4.49% interest'>AED <%- permonth%> per month*</p><p class='hastip text-green amount_p_m for-mobile' style='display: none;position: absolute;right: 4px;top: 22px;' title='Price Per Sqft'>AED <%- pricepersqft%> per sqft*</p><h2 class='propertyRemarks on-mobile-hide text-truncate' itemprop='name' style='font-size: 18px;text-transform: capitalize;padding-top: 7px;'><%- title %></h2> <h3 class='property-head-name on-mobile-hide' style='font-size: 15px;text-transform: capitalize;'><%- propheadname%></h3></div><div class='other-details dua-col-md-4 text-right'><h3 class='price-text-1 on-mobile-hide' style='padding-top: 7px;'><span itemprop='priceCurrency' content='AED'>AED</span> <span itemprop='price' content='900000'><%- price %></span></h3><p class='hastip text-green amount_p_m on-mobile-hide' title='‘Based on a 25 year mortgage at 4.49% interest'>AED <%- permonth%> per month*</p><p class='hastip text-green amount_p_m on-mobile-hide' title='Price Per Sqft'>AED <%- pricepersqft%> per sqft*</p><input type='hidden' id='_key' name='_unitkey' value='<%- unitkey%>'></div><div class='clear'></div><hr class='style-six on-mobile-hide' style='margin: 10px;'><div class='dua-col-md-6' style=''><div class='property-detail on-mobile-hide'><div class='first-tab'><div class='clear'></div><span class='show-proptype'><%- proptype %></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/bedroom-new.png'><%- bedrooms%></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/bathroom-new.png'> <%- bathrooms%></span><span class='on-mobile-hide'><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/parking-new.png'> <%- parking%></span><span><img class='listing-icons' data-ll-status='loaded' src='/main/src/img/area-new.png'> <%- propertysize%> </span></div></div><h2 class='property-head-name for-mobile' style='display: none;'><%- propheadname%></h2></div><div class='dua-col-md-6 for-mobile' style='display: none;'><div class='property-detail for-mobile' style='display: none;'><div class='first-tab'><div class='clear'></div><span class='show-proptype' style='font-size: 10px;display:none'><%- proptype %></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/bedroom-new.png'> <%- bedrooms%></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/bathroom-new.png'> <%- bathrooms%></span><span style='font-size: 10px' class='on-mobile-hide'><img class='listing-icons' src='/main/src/img/parking-new.png'> <%- parking%></span><span style='font-size: 10px'><img class='listing-icons' src='/main/src/img/area-new.png'> <%- propertysize%> </span> </div></div><h3 class='propertyRemarks' style='display:none;'><%- title %></h3> <h2 class='property-head-name' style='display: none;'><%- propheadname%></h2></div><div class='dua-col-md-6' style=''><p class='parag on-mobile-hide px-0' style='text-align: right;padding-top: 0;'>Ref <%- id %></p><div class='dua-col-md-6 padding-0 ' style='display: none;'></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a class='main-buttn buttn-green btn-block deleteWished' title='Delete' data-id='<%- id %>'>Delete</a></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a href='tel:600548200' class='main-buttn buttn-green btn-block' title='CALL US'><i class='fa fa-phone' aria-hidden='true'></i></a></div><div class='dua-col-md-4 padding-2 on-mobile-hide'><a class='main-buttn buttn-green btn-block modal__openner' data-toggle='modal' data-target='#myModal' data-title='<%- title %> - <%- id %>' data-content='<%- img %>'><i class='fa fa-envelope' aria-hidden='true'></i></a> </div></div></div><div style='clear:both;'></div></li>"
      },
			itemOption : {},
			counterClass : "wishCounter",			// classe su cui bindare l'evento di l'eliminazione del cookie
			clearId : "clearWish",					// classe su cui bindare l'evento di l'eliminazione del cookie
			//a parte il cookie possiamo usare i webstorage
			useStorage : (typeof localStorage === "undefined")?false:true,	
			storeID : (typeof localStorage === "undefined")?false:true,

			storegeName : ID,			//nome con il quale verrà salvata la wishlist nel local storage
			setCookie : {
				name : ID,				// nome del cookie da interrogare e aggiornare (utilizza l'id dell'elemnto in this)
				expire : 365,			// durata del cookies
				path : "/"				// path ("/" consigliata)
			},
			BackboneModel : {			// modello Backbone di "default" della struttura del cookies
				defaults : {
					id : null,
					title : null,
					url : null
				}
			},
			BackboneCollection : {},	// Oggetto di estensione della collection che rappresenta la wishlist
			
			//funzioni di callback eseguite...
			onClean : null,				// ... prima del gestore di pulizia della wishlist estendendolo
			onLoad : null,				// ... dopo il costruttore 
			onChange : null,			// ... dopo il gestore dell'evento di modifica della collection
			
			text : {
				noStorage : "Wishlist needs cookie enabled.",
				add : "Add ",
				remove : "Remove "
			}
		},options);

		WISHLIST.ID = ID;
		WISHLIST.propagate = {};

		//METODI GESTIONE OGGETTI COLLEZIONI BACKBONE DI WISHLIST
		//invocato per aggiungere un'istanza all'oggetto locale wishlist
		WISHLIST.addToWish = function(data){
			console.log("Inside add");
			console.log(data);
			options = (typeof data != "array") ? new Array(data) : data;
			WISHLIST.data.add(data);
		}
		/*$(document).on("click", ".addToWishButton", function(){
			var data = $(this).data();
			$(this).removeClass('addToWishButton');
			$(this).addClass('removeToWishButton');
			$('#wishspan').text("Saved");
			$('#heart2').addClass('hide');
			$('#heartred').removeClass('hide');
			options = (typeof data != "array") ? new Array(data) : data;
			WISHLIST.data.add(data);
			console.log(WISHLIST.data);
		});
		$(document).on("click", ".removeToWishButton", function(){
			var wishId = $(this).attr("data-id");
			$(this).removeClass('removeToWishButton');
			$(this).addClass('addToWishButton');
			$('#wishspan').text("Save");
			$('#heart2').removeClass('hide');
			$('#heartred').addClass('hide');
			WISHLIST.data.remove(WISHLIST.data.get(wishId));
		});*/
		/*if(WISHLIST.data($('.addToWishButton').attr('data-id')))*/
		
		//invocato per eliminare un'istanza dall'oggetto locale wishlist
		WISHLIST.removeToWish = function(id){
			console.log("Inside remove");
			console.log(id);
			WISHLIST.data.remove(WISHLIST.data.get(id));
		}
		$(document).on("click", ".deleteWished", function(){
			var wishId = $(this).attr("data-id");
			//console.log(wishId);
			$(this).closest('.article').remove();
			console.log($.cookie(settings.setCookie.name+ "_IDS"));
			WISHLIST.data.remove(WISHLIST.data.get(wishId));
			/*var newCount = $(".tab-pane.active").find("li.wishedItem").length;
	        jQuery(".left-panel-link.active").find("span").text("("+newCount+")");*/
		});
		$(document).on("click", ".removeToWish", function(){
			console.log("Inside onclick remove");
			var wishId = $(this).attr("data-id");
			console.log(wishId);
	        //$(this).parent().closest("li.wishItem").remove();
	        WISHLIST.data.remove(WISHLIST.data.get(wishId));
	      });
		
		//invocato per ripulire tutto l'oggetto locale wishlist
		WISHLIST.clearWish = function(){
			WISHLIST.data.reset();
		}
		
		//metodo per aggiornare la versione globale di wishlist
		WISHLIST.toGlobal = function(){
			window.wishList[ID] = WISHLIST;
		}
		
		//METODI DI GESTIONE DISAMBIGUITA' COOKIE/LOCALSTORAGE
		//metodi utilizzati per gestire lo store dei dati nei cookie piuttosto che nel localStorage

		WISHLIST.loadStorage = function(){
			var res = (settings.useStorage) ? loadLocalStorage() : loadCookieStorage();
			return (!res || res == null) ? false : $.parseJSON(res);
		} 

		WISHLIST.updateStorege = function(){
			(settings.useStorage) ? wishToLocal() : wishToCookie();
		}

		WISHLIST.cleanStorege = function(){
			(settings.useStorage) ? clearLocal() : clearCookies();
			WISHLIST.toGlobal();
		}

		//METODI GESTIONE LOCAL STORAGE

		var loadLocalStorage = function(){
			return localStorage.getItem(settings.storegeName);
		}

		var wishToLocal = function(){
			localStorage.setItem(settings.storegeName,JSON.stringify(WISHLIST.data));
			if(settings.storeID) storeIDinCookie();
		}

		var clearLocal = function(){
			localStorage.removeItem(settings.storegeName);
			if(settings.storeID) storeIDinCookie();
		}
 
		var storeIDinCookie = function(){
			var ids = [];
			WISHLIST.data.each(function(item){
				if(item.id){
					ids.push(item.id);
				}
			});
			$.cookie(settings.setCookie.name+ "_IDS",JSON.stringify(ids));
			console.log($.cookie(settings.setCookie.name+ "_IDS"))
			var myDate = new Date();
			myDate.setMonth(myDate.getMonth() + 12);
			cookieName = "NewWishlist";
			cookieValue = JSON.stringify(ids);
			document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate 
                  + ";domain=psinv.net;path=/";;
			if(ids.length==0){ jQuery("#nothing").removeClass("hide"); }
		}

		//METODI GESTIONE COOKIE WISHLIST
		// invocato ogni volta che cambia l'oggetto locale wishlist

		var loadCookieStorage = function(){
			return $.cookie(settings.setCookie.name);
		}

		var wishToCookie = function(){
			$.cookie(settings.setCookie.name, JSON.stringify(WISHLIST.data), { expires: settings.setCookie.expire, path: settings.setCookie.path });
		}
		
		// invocato ogni volta che si pulisce l'oggetto locale wishlist
		var clearCookies = function(){
			$.removeCookie(settings.setCookie.name, {path: settings.setCookie.path});
		}

		//GESTORE MODIFICA DELLA COLLECTION 

		var collectionChange = function(actionName,model,collection,options){
			var item = model.attributes;
			switch(actionName){
				case "remove" : WISHLIST.updateStorege();
				break;
				case "add" : WISHLIST.updateStorege();
				break;
				case "reset" : WISHLIST.cleanStorege();
				break;
			}
			$("."+settings.counterClass).text(WISHLIST.data.length);
			console.log("For Counter");
			console.log(WISHLIST.data.length);
			$("#wishCounter").text(WISHLIST.data.length);


			for (fun in WISHLIST.propagate) {
				if(typeof WISHLIST.propagate[fun] === "function") WISHLIST.propagate[fun](actionName,item);
			}
			if(typeof settings.onChange== "function") settings.onChange.call(WISHLIST,actionName,model,collection);
		}

		/*$("#"+settings.clearId).on("click.triggerClear", function(e){
			e.preventDefault();
			WISHLIST.clearWish();
			if(typeof settings.onClean == "function") settings.onClean.call(WISHLIST);
		});*/

		$("#clearWishLists").on("click", function(e){
			e.preventDefault();
			console.log("Reached clear");
			var conf = confirm("Confirm delete all favorites?");
			if(conf == true){
				jQuery('.article').remove();
				WISHLIST.clearWish(); 
				if($("#wishCounter").text()=="0"){ WISHLIST.clearWish(); }
			} else {}
			//WISHLIST.clearWish();
			
		 	
			//if(typeof settings.onClean == "function") settings.onClean.call(WISHLIST);
		});

		//COSTRUTTORE
	
		//Definisco il model e la collection di backbone
		settings.BackboneCollection.model = Backbone.Model.extend(settings.BackboneModel);
		var wishStorage = Backbone.Collection.extend(settings.BackboneCollection);

		//inizializzazione degli oggetti wishlist (locale e globale)
		var JSONStorage = WISHLIST.loadStorage();
		WISHLIST.data = new wishStorage();
		
		WISHLIST.data.on("all",collectionChange,WISHLIST);

		if(JSONStorage) WISHLIST.data.add(JSONStorage);

		if(settings.$wishBar.length > 0) settings.$wishBar.wishBar(settings.barOption,settings.barOption2,WISHLIST);
		if(settings.$wishItem.length > 0) settings.$wishItem.wishItem(settings.itemOption,WISHLIST);

		if(typeof settings.onLoad == "function") settings.onLoad.call(WISHLIST);

		WISHLIST.toGlobal();

		return WISHLIST;
	}

}( jQuery ));
