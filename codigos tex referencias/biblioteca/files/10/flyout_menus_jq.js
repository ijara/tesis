
/*
 * Responsible for flyout menus within the editor + on a published page.
 * Also responsible for condensing overflowing nav and making a "more..." link.
 *
 * Author: Adam Shaw
 */


// General nav architecture note:
// For any given nav item, there is a notion of a "handle" and an "item".
// In the editor, the <span> that surrounds the item is the "handle",
// and the "item" is the <li> (or whatever, depending on the theme) that
// is directly inside.
// On published site, they are the same thing (the <li> or whatever).


(function($) {

	window.getCartCount = function() {
		var quantity = getInEditor() ? 0 : '-';
		return quantity;
	};

	var cartElement = null;
	window.getCartNavElement = function() {
		return cartElement;
	};

	window.reportCartNavElement = function() {
		return;
	};

	var Relay;
	var RELAY_CONST;
	// _wAMD has our namespaced `require` on published sites (other code may
	// override `window.require`)
	var require = window._wAMD && window._wAMD.require || window.require;

	/**
	 * Calls to inEditor may be defined before this file is loaded so all
	 * references need to be in a function
	 * @return boolean true if in editor
	 */
	function inEditorAndRelaySet() {
		// If in editor, require Relay and RELAY_CONST and cache the references
		if (getInEditor()) {
			if (!Relay) {
				Relay = require('editor-site-shared/relay');
				RELAY_CONST = require('site/editor/relay-constants');
			}
			return true;
		}
		return false;
	}



	/****************************** publicly available functions ****************************/

	var moreItemBlueprintEl; // an optimization. will be cloned whenever we need to render a "more.." link
	var activeLiId;
	var currentPageId;
	var stylePrefix = window.STYLE_PREFIX || 'weebly';
	var storedCustomOptions;

	var SLIDE_DURATION = 300;

	var TOP_LEVEL_HANDLE_CLASS = stylePrefix + '-nav-handle';// inserted by JS for editor
	var ITEM_ORDERING_PREFIX_CLASS = stylePrefix + '-nav-';

	var MENU_WRAP_CLASS = stylePrefix + '-menu-default';
	var TOP_LEVEL_WRAP_CLASS = stylePrefix + '-menu-item-wrap';
	var TOP_LEVEL_ITEM_CLASS = stylePrefix + '-menu-item';
	var SUBMENU_WRAP_CLASS = stylePrefix + '-menu-wrap';
	var SUBMENU_CLASS = stylePrefix + '-menu';
	var SUBMENU_ITEM_WRAP_CLASS = stylePrefix + '-menu-subitem-wrap';
	var SUBMENU_ITEM_CLASS = stylePrefix + '-menu-subitem';
	var SUBMENU_CURRENT_ITEM_CLASS = stylePrefix + '-nav-current';

	var MENUS_CONTAINER_ID = stylePrefix + '-menus';// inserted by JS

	var MORE_ITEM_ID = stylePrefix + '-nav-more-a';
	var MORE_ITEM_CLASS = stylePrefix + '-nav-more';

	var CART_ITEM_ID = stylePrefix + '-nav-cart-a';
	var CART_ITEM_CLASS = stylePrefix + '-nav-cart';
	var CART_NUM_ID = stylePrefix + '-nav-cart-num';

	var LOGIN_ITEM_ID = stylePrefix + '-nav-login-a';

	function getMenuWrapFromChild(childEl) {
		var el = childEl.closest('.' +  MENU_WRAP_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return childEl.parent();
	}

	function getTopLevelItemFromParent(parentEl) {
		var el = parentEl.find('.' + TOP_LEVEL_ITEM_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return parentEl.find('a').first();
	}

	function getTopLevelItemWrapFromParent(parentEl) {
		var el = parentEl.find('.' + TOP_LEVEL_WRAP_CLASS);
		if (el.length) {
			return el;
		}

		el = parentEl.find('.' + TOP_LEVEL_HANDLE_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return parentEl.find('li');
	}

	function getSubmenuWrapFromChild(childEl) {
		var el = childEl.closest('.' +  SUBMENU_WRAP_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return childEl.parent();
	}

	function getSubmenuWrapFromParent(parentEl) {
		return parentEl.find('.' +  SUBMENU_WRAP_CLASS).first();
	}

	function getSubmenuItemWrapFromParent(parentEl) {
		var el = parentEl.find('.' + SUBMENU_ITEM_WRAP_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return parentEl.find('li');
	}

	function getSubmenuItemFromParent(parentEl) {
		var el = parentEl.find('.' + SUBMENU_ITEM_CLASS);
		if (el.length) {
			return el;
		}

		// legacy selector
		return parentEl.find('a');
	}

	// Called from a published page.
	// Always called when the DOM is already ready.
	window.initPublishedFlyoutMenus = function(topLevelSummary, cpid, extraItemHTML, aLiId, isPreview, templates, customOptions) {
		// extraItemHTML is unused but can't be removed from the arguments
		// because old published sites will still pass an argument there

		currentPageId = cpid;
		storedCustomOptions = customOptions;

		registerTemplates(templates);
		moreItemBlueprintEl = renderMoreItemEl();

		if (topLevelSummary.length > 0) {
			var go = function() {
				activeLiId = aLiId;
				var container = $('<div>', { id: MENUS_CONTAINER_ID }).appendTo('body');
				var firstItem = navElm(topLevelSummary[0].id);
				if (firstItem) {
					window.navFlyoutMenu = new window.FlyoutMenu(getMenuWrapFromChild(firstItem), {
						relocate: container,
						aLiId: aLiId
					});
					condenseNav(topLevelSummary);
				}
			};
			if (isPreview) {
				go(); // css has been written in html <style> tag, no need to check if loaded
			}else{
				whenThemeCSSLoaded(go);
			}
		}

		window.refreshPublishedFlyoutMenus = function() {
			condenseNav(topLevelSummary);
		};

		// Refresh when logo image finished loading.
		// It makes the refresh speedier because this happens before window load.
		$('.wsite-logo img').on('load', window.refreshPublishedFlyoutMenus);

		// Refresh on window load.
		// When CSS3 fonts load, and other misc theme resources load.
		$(window).on('load', window.refreshPublishedFlyoutMenus);
	};


	// a flag for signaling to the initialization code that we can dynamically update the "more..." menu
	window.flyoutMenusRefreshable = true;


	// called from the editor
	window.initEditorFlyoutMenus = function(aLiId, customOptions) {
		activeLiId = aLiId;
		storedCustomOptions = customOptions;
		registerTemplates(customOptions.templates);

		whenThemeCSSLoaded(function() {
			if ($.browser.webkit) {
				// this solves a webkit bug where the <span>s within the <ul> are displayed as block
				// this problem has nothing to do with the flyout code, but this was the most convenient place to put it ~ashaw
				var handles = $('span.' + TOP_LEVEL_HANDLE_CLASS);
				handles.hide();
				setTimeout(function() {
					handles.show();
					go();
				}, 0);
			} else {
				go();
			}

			function go() {
				var topLevelSummary = getTopLevelSummary();
				if (topLevelSummary.length > 0) {
					var listItem0 = navElm(topLevelSummary[0].id);
					if (listItem0) {
						var listElement = getMenuWrapFromChild(listItem0);
						if (!listElement.is('table,tbody,thead,tr')) {

							window.navFlyoutMenu = new window.FlyoutMenu(listElement, {
								relocate: '#' + MENUS_CONTAINER_ID,
								aLiId: aLiId
							});

							moreItemBlueprintEl = renderMoreItemEl();

							condenseNav(topLevelSummary);
						}else{
							window.navFlyoutMenu = null;
						}
					}else{
						window.navFlyoutMenu = null;
					}
				}
			}
		});
	};

	// called from the editor when nav positioning might have changed
	window.refreshNavCondense = function(options) {
		// update showMemberLoginLink, groupCount, memberCount, or allowMemberRegistration
		if (typeof options === 'object') {
			_.extend(window.Weebly, options);
		}
		if (window.navFlyoutMenu && !(Weebly.view && Weebly.view.isMobileView)) {
			condenseNav(getTopLevelSummary());
		}
	};

	window.disableFlyouts = false;



	/*********************************** flyout menu class ************************************/

	window.FlyoutMenu = function(mainList, options) {
		var self = this;
		self.mouseoverItems = [];

		mainList = $(mainList); // the element that contains all the nav elements
		options = options || {};

		var hasTouch = ('ontouchstart' in window); // check if touch events exists

		// settings (an attempt at making FlyoutMenu portable)
		var delay = (options.delay || 0.5) * 1000;

		// if specified, all submenus will be detached from original place in DOM and put in here
		var relocate = options.relocate ? $(options.relocate) : false;

		// FYI
		// a 'handle' is an element that contains the templatable HTML for each page's nav link
		// a 'handle' may be a wrapping SPAN element (with className 'PREFIX-nav-handle')
		//   OR it may be the item itself (such as an LI)

		var allItems; // list of all nav items
						// (the first child within a handle OR the handle itself)


		//
		// attach all event handlers and do state-keeping for flyout menus
		//
		function initItem(item) {

			item.css('position', 'relative'); // this gives more accurate offsets
			getTopLevelItemFromParent(item).add(getSubmenuItemFromParent(item))
				.css('position', 'relative'); // more accurate offset (prevents IE bug)

			// states
			var isSliding = false;
			var isExpanded = false;
			var isMouseoverItem = false;
			var mouseoverCnt = 0;

			var slidVertically = false;
			var slidRight = false;
			var slidDown = false;

			var sublistWrapper; // a DIV.PREFIX-menu-wrap OR null
			var sublist;        // a UL.PREFIX-menu OR null

			// tablet multi-event firing fix
			function handleClickEvent(event) {
				if (hasTouch && isSliding) {
					// For android devices, ignore anchor's default event from being triggered during mouseover event.
					event.preventDefault();
				}
			}

			//
			// expand a sublist on mouseover
			//

			function itemMouseover() {
				if (window.disableFlyouts) {
					return false;
				}

				// This is a tablet hack. We don't catch the mouseout event so we have to save this node and trigger mouseout from the JS interface
				self.mouseoverItems.push(item);

				mouseoverCnt++;
				isMouseoverItem = true;
				if (!isExpanded && !isSliding) {
					if (sublist) {
						// adding a data attribute if the item has a sublist
						// this is used to know whether to go to a page or bring down the flyout menu on tablet
						item.data('hasChildren', true);
						// when a sublist is expanded, immediately contract all siblings' sublists
						getSiblings(item).each(function(i, siblingNode) {
							if (siblingNode._flyoutmenu_contract) {
								siblingNode._flyoutmenu_contract();
							}
						});
						expandSublist();
						item.data('isExpanded', true);
					}
				}
			}


			//
			// contract sublist on mouseout (after delay)
			//

			function itemMouseout() {
				if (window.disableFlyouts) {
					return false;
				}

				isMouseoverItem = false;
				if (isExpanded) {
					var mouseoverCnt0 = mouseoverCnt;
					setTimeout(function() {
						if (mouseoverCnt == mouseoverCnt0 && isExpanded && !isSliding) {
							contractSublist();
							item.data('isExpanded', false);
						}
					}, delay);
				}
			}


			//
			// prevent contracting when sublist is moused over
			//

			function sublistWrapperMouseover() {
				if (window.disableFlyouts) {
					return false;
				}

				mouseoverCnt++;
			}


			//
			// do item's sublist's expand animation
			//

			function expandSublist() {
				isSliding = true;
				var opts = {
					wrapper: sublistWrapper,
					duration: SLIDE_DURATION,
					complete: function() { // when animation has finished
						isSliding = false;
						isExpanded = true;
						if (!isMouseoverItem) {
							// if mouse was not over when animation finished, immediately contract
							contractSublist();
						}else{
							// attach methods for later hiding/contracting
							item[0]._flyoutmenu_contract = contractSublist; // assign to DOM node
							item[0]._flyoutmenu_hide = function() {         //
								isSliding = false;
								isExpanded = false;
								isMouseoverItem = false;
								item[0]._flyoutmenu_contract = null;
								item[0]._flyoutmenu_hide = null;
								sublistWrapper.hide();
							};
						}

						if (inEditorAndRelaySet()){
							var $this = $(this);
							var offset = $this.offset();

							Relay.trigger(RELAY_CONST.EVENTS.SUBNAV_SHOWN, {
								top: offset.top,
								left: offset.left,
								width: $this.outerWidth(),
								height: $this.outerHeight()
							});
						}
					}
				};
				var massCoords = getItemMassCoords(item);

				// need to show it for IE8 to get the correct offsetParent
				sublistWrapper.css('left', -10000);
				sublistWrapper.show();

				var localOriginElement = sublistWrapper.offsetParent();
				var localOrigin = localOriginElement.is('body') ? {top:0,left:0} : localOriginElement.offset();
					// ^ special case body. jQuery provides inaccurate offset for body. always 0,0

				sublistWrapper.hide();
				sublist.show(); // so calls to sublistWrapper.outerWidth() are correct

				var w;
				if (inVerticalList(item, true, options.aLiId)) {
					// slide right/left on vertical nav
					slidVertically = false;
					sublistWrapper.css('top', -localOrigin.top + massCoords[0].top);
					w = sublistWrapper.outerWidth();
					if (massCoords[1].left + w > $('body').outerWidth()) {
						slidRight = false;
						sublistWrapper.css('left', -localOrigin.left + massCoords[0].left - w);
						opts.direction = 'right';
						sublist.show('slide', opts);
					}else{
						slidRight = true;
						sublistWrapper.css('left', -localOrigin.left + massCoords[1].left);
						opts.direction = 'left';
						sublist.show('slide', opts);
					}
				}else{
					// slide down on horizontal nav
					slidVertically = true;
					sublistWrapper.css('top', -localOrigin.top + massCoords[1].top);
					w = sublistWrapper.outerWidth();
					var h = sublistWrapper.outerHeight();
					if (massCoords[0].left + w > $('body').outerWidth()) {
						sublistWrapper.css('left', -localOrigin.left + massCoords[1].left - w);
					}else{
						sublistWrapper.css('left', -localOrigin.left + massCoords[0].left);
					}

					var maxH;

					if (item.parentsUntil('body').filter(function() {
						return $(this).css('position') === 'fixed';
					}).length > 0) {
						// if there's a fixed ancestor measure the window
						var $window = $(window);
						maxH = $window.height() + $window.scrollTop();
					} else {
						// menu not fixed - measure document
						maxH = $(document).height();
					}

					var adjustedTop = parseInt(sublistWrapper.css('top'), 10) - h - item.outerHeight();
					if (massCoords[1].top + h > maxH && adjustedTop > 0) {
						sublistWrapper.css('top', adjustedTop + 'px');
						opts.direction = 'down';
						slidDown = true;
					} else {
						opts.direction = 'up';
						slidDown = false;
					}

					sublist.show('slide', opts);
				}
			}


			//
			// do item's sublist's contract animation
			//

			function contractSublist(mouseoverHack) {
				if (window.disableFlyouts || !item.parent().length) { // no parentNode?? removed from dom already? wtf!?
					// contractSublist is often called from a delay, might have been disabled in that time
					return;
				}
				if (mouseoverHack) {
					// IE6 wasn't registering the mouseout
					isMouseoverItem = false;
				}
				isSliding = true;
				item[0]._flyoutmenu_contract = null;
				item[0]._flyoutmenu_hide = null;
				var opts = {
					wrapper: sublistWrapper,
					duration: SLIDE_DURATION,
					complete: function() {
						isSliding = false;
						isExpanded = false;
						if (isMouseoverItem) {
							// if mouseleft, but re-entered before animation finished
							// immediately expand sublist again
							expandSublist();
						}

						if (inEditorAndRelaySet()){
							Relay.trigger(RELAY_CONST.EVENTS.SUBNAV_HIDDEN);
						}
					}
				};
				if (slidVertically) {
					if (slidDown) {
						opts.direction = 'down';
					} else {
						opts.direction = 'up';
					}

					sublist.hide('slide', opts);
				}else{
					if (slidRight) {
						opts.direction = 'left';
						sublist.hide('slide', opts);
					}else{
						opts.direction = 'right';
						sublist.hide('slide', opts);
					}
				}
			}


			//
			// initialize submenu and attach events
			//
			sublist = getSublist(item);
			if (sublist) {
				sublistWrapper = getSubmenuWrapFromChild(sublist);
				sublistWrapper.css('position', 'absolute');
				sublistWrapper.hide(); // should already be display:none, but just in case

				if (relocate) {
					// since sublist is no longer a descendant of the item, mouse events
					// wont cascade. simulate this
					sublistWrapper.on('mouseover', itemMouseover);
					sublistWrapper.on('mouseout', itemMouseout);
					// tablet fix
					sublistWrapper.on('click', function(e){
						handleClickEvent(e);
					});
				}else{
					// keep the submenu alive...
					sublistWrapper.on('mouseover', sublistWrapperMouseover);
					// tablet fix
					sublistWrapper.on('click', function(e){
						handleClickEvent(e);
					});
				}
			}

			item.on('mouseover', itemMouseover);
			item.on('mouseout', itemMouseout);

			// tablet fix
			item.on('click', function(e){
				handleClickEvent(e);
			});


			//
			// attach a method for removing registered events
			// (returns the sublist wrapper)
			//

			item[0]._flyoutmenu_destroy = function(removeSublist) { // attach to raw DOM node
				item.off('mouseover', itemMouseover);
				item.off('mouseout', itemMouseout);
				item.off('click', handleClickEvent);

				if (sublistWrapper) {

					if (relocate) {
						sublistWrapper.off('mouseover', itemMouseover);
						sublistWrapper.off('mouseout', itemMouseout);
						sublistWrapper.off('click', handleClickEvent);
					}else{
						sublistWrapper.off('mouseover', sublistWrapperMouseover);
						sublistWrapper.off('click', handleClickEvent);
					}

					// destroy items within.
					// this might result in multiple destroy calls for double nested elements, but that's ok.
					getSubmenuItemWrapFromParent(sublistWrapper).each(function() {
						this._flyoutmenu_destroy();
					});

					if (removeSublist) {
						sublistWrapper.detach();
					}

					var temp = sublistWrapper;
					sublistWrapper = null;
					sublist = null;
					return temp;
				}
			};

			item[0]._get_sublist = function() {
				return sublist;
			};

		}


		//
		// methods for the FlyoutMenu object
		//

		// close all submenus with an animation
		this.contract = function() {
			allItems.each(function(i, itemNode) {
				if (itemNode._flyoutmenu_contract) {
					itemNode._flyoutmenu_contract(true);
				}
			});
		};

		// hide all submenus immediately
		this.hideSubmenus = function() {
			allItems.each(function(i, itemNode) {
				if (itemNode._flyoutmenu_hide) {
					itemNode._flyoutmenu_hide();
				}
			});
		};

		// detach all event handlers
		this.destroy = function() {
			allItems.each(function(i, itemNode) {
				if (itemNode._flyoutmenu_destroy) {
					itemNode._flyoutmenu_destroy();
				}
			});
		};

		// initialize a top level item that has already been placed into mainList
		this.addItem = function(handle) {
			handle = $(handle);
			var item = getItemFromHandle(handle);

			if (item.length) {
				initItem(item);
				var sublist = getSublist(item);
				if (sublist) {
					getSubmenuItemWrapFromParent(sublist).each(function() { // init all subitems
						initItem($(this));
					});
				}
				if (relocate && sublist) {
					relocate.append(getSubmenuWrapFromChild(sublist)); // relocate sublist's wrap
				}
				allItems = allItems.add(item); // luckily uniqueness is maintained
				writeOrderingClassNames();
			}
		};

		// detach an item's event handlers and remove from DOM
		this.removeItem = function(handle) { // todo: rename
			handle = $(handle);
			var item = getItemFromHandle(handle);
			if (item.length) {
				if (item[0]._flyoutmenu_destroy) {
					item[0]._flyoutmenu_destroy(true);
				}
				item.remove();
				allItems = allItems.not(item);
				writeOrderingClassNames();
			}
		};

		// accessor
		this.getMainList = function() {
			return mainList;
		};


		//
		// initialize allItems and relocate
		//

		function writeOrderingClassNames() {
			var i = 1;
			getTopLevelItems(mainList).each(function() {
				this.className = this.className.replace(new RegExp(ITEM_ORDERING_PREFIX_CLASS + '\\d+'), '');
				var item = $(this);
				if (item.css('display') != 'none') {
					item.addClass(ITEM_ORDERING_PREFIX_CLASS + i);
					i++;
				}
			});
		}
		this.writeOrderingClassNames = writeOrderingClassNames;

		allItems = getAllItems(mainList);
		allItems.each(function() {
			initItem($(this));
		});
		writeOrderingClassNames();

		if (relocate) {
			getTopLevelItems(mainList).each(function(i, itemNode) {
				var sublist = getSublist($(itemNode));
				if (sublist) {
					relocate.append(getSubmenuWrapFromChild(sublist));
				}
			});
		}

	};




	/****************************** more... link and menu *****************************/

	function condenseNav(topLevelSummary) { // can be called repeatedly for updating
		if (!window.navFlyoutMenu) {
			return; // no items to condense
		}

		var cpid = window.currentPage || currentPageId;
		var mainList = window.navFlyoutMenu.getMainList();
		var mainListChildren = mainList.children();
		var customLoginLink = $('body').find('#' + LOGIN_ITEM_ID);
		var customCartLink = $('body').find('#' + CART_ITEM_ID);
		// Searches from body since custom tag can be present anywhere outside of menu element.

		var hasCustomMembership = storedCustomOptions && storedCustomOptions['hasCustomMembership'];
		var hasCustomMinicart = storedCustomOptions && storedCustomOptions['hasCustomMinicart'];

		// find an existing cart item
		var cartHandle = mainListChildren.filter(function() {
			// only way to tell (in editor & published site) if this is a cart item
			return !!$(this).find('#' + CART_ITEM_ID).length;
		});
		if (!cartHandle.length) {
			cartHandle = undefined;
		}

		// create/remove/update the cart item
		var cartCount = window.getCartCount();
		var host = window.location.host;
		var path = window.location.pathname;
		var cartHandleText = window._W.stl('javascript.cartText') + " (<span id='" + CART_NUM_ID + "'></span>)";
		var cartHandleToManipulate;
		var config;
		if (
			host.indexOf('.checkout.weebly.com') > -1 ||
			host.indexOf('.checkout.editmysite.com') > -1 ||
			path.indexOf('store/checkout') > -1 ||
			(typeof(Weebly) == 'object' && Weebly.EDITOR && !Weebly.COMMERCE_ENABLED) ||
			(typeof(Weebly) != 'object' || !Weebly.Commerce || typeof(Weebly.Commerce.hasCart) != 'boolean') ||
			(typeof(Weebly) == 'object' && Weebly.Commerce && Weebly.Commerce.hasCart === false)
		) {
			if (cartHandle) {
				cartHandle.remove();
				mainListChildren = mainList.children(); // update
				window.navFlyoutMenu.writeOrderingClassNames();
			}
		} else {
			if (!cartHandle) {

				if (hasCustomMinicart) {
					// the theme defined its own cart icon elsewhere. so don't render a cartHandler in our nav.
					// we still want to update the custom cart's text (even though it's not in the nav).
					customCartLink.html(cartHandleText);
					cartHandle = undefined;
				} else {
					cartHandle = renderExtraItemEl(cartHandleText);
				}

				cartHandleToManipulate = hasCustomMinicart ? customCartLink : getTopLevelItemFromParent(cartHandle);

				cartHandleToManipulate
					.attr('id', CART_ITEM_ID)
					.css('position', 'relative'); // match what initItem does

				if (getInEditor()) {
					config = require('config');
					if (!config.chromeless) {

						cartHandleToManipulate = hasCustomMinicart ? customCartLink.parent() : getItemFromHandle(cartHandle);

						// This is supposed to be in User Language because it notifies a user in the editor only.
						cartHandleToManipulate
							.attr('data-content', window._W.utl('javascript.editor.cartNotification'))
							.popover({
								trigger: 'hover',
								placement: 'bottom',
								container: '#_editor-ui',
								delay: {show: 500, hide: 100}
							});
					}
				}

				cartHandleToManipulate = hasCustomMinicart ? customCartLink.parent() : getItemFromHandle(cartHandle);

				cartHandleToManipulate
					.addClass(CART_ITEM_CLASS)
					.css('position', 'relative'); // match what initItem does

				cartElement = hasCustomMinicart ? customCartLink : cartHandle;
				window.reportCartNavElement();

				// Append to the main list only if the custom cart tag doesn't exist.
				if (!hasCustomMinicart) {
					mainList.append(cartHandle);
					mainListChildren = mainList.children(); // update
					window.navFlyoutMenu.writeOrderingClassNames();
				}
			}
			$('#' + CART_NUM_ID).text(cartCount);
		}

		var cartItem;
		// If custom cart tag exists, nullify cartItem to prevent cartItem being recognized as a last menu item.
		if (cartHandle && hasCustomMinicart) {
			cartItem = null;
		} else if (cartHandle) {
			cartItem = getItemFromHandle(cartHandle);
		}

		var memberLogin = mainListChildren.filter(function() {
			// only way to tell (in editor & published site) if this is a login item
			return !!$(this).find('#' + LOGIN_ITEM_ID).length;
		});
		if (!memberLogin.length) {
			memberLogin = undefined;
		}

		var loginString = Weebly.allowMemberRegistration ? window._W.stl('html.weebly.libraries.flyout_menus_jq_7') : window._W.stl('html.weebly.libraries.flyout_menus_jq_8');
		var PageCollection = require('editor/page-manager/pages');
		var membershipRequired = PageCollection.some(function(page) {
			return page.get('membership_required');
		});

		var editorShowLogin =
			getInEditor() && // You're in the editor and...
			(
				membershipRequired ||               // you have a members-only page
				Weebly.allowMemberRegistration ||   // or you have registration turned on
				Weebly.memberCount > 0 ||           // or you have a member
				Weebly.groupCount > 0               // or you have a group
			) &&
			Weebly.showMemberLoginLink;

		var siteShowLogin = window._W && _W.showLogin;

		// If we should have a login link, but don't.
		if ((editorShowLogin || siteShowLogin) && !memberLogin) {

			memberLogin = renderExtraItemEl(loginString);

			if (getInEditor()) {
				memberLogin.attr('id', 'pgmember-login');
			} else {
				memberLogin.attr('id', 'member-login');
			}

			getTopLevelItemFromParent(memberLogin).attr('id', LOGIN_ITEM_ID);

			// Do not append login link for now if there's custom membership.

			if (!hasCustomMembership) {
				if (cartHandle && !hasCustomMinicart) {
					memberLogin.insertBefore(cartHandle);
				} else {
					mainList.append(memberLogin);
				}
			}

			mainListChildren = mainList.children(); // update
			window.navFlyoutMenu.writeOrderingClassNames();
		} else if (!editorShowLogin && !siteShowLogin && memberLogin) {
			memberLogin.remove();
			mainListChildren = mainList.children(); // update
			window.navFlyoutMenu.writeOrderingClassNames();
		}

		if (getInEditor()) {
			if (memberLogin) {
				config = require('config');
				var loginLink = getTopLevelItemFromParent(memberLogin);
				loginLink = customLoginLink.length ? customLoginLink : loginLink;
				if (customLoginLink.length) {
					loginLink.text(loginString);
				}

				if (!config.chromeless) {
					// Should be in User Language because it's only shown in the editor
					loginLink
						.attr('data-content', window._W.utl('html.weebly.libraries.flyout_menus_jq_5'))
						.popover({
							trigger: 'hover',
							placement: 'bottom',
							container: 'body',
							delay: {show: 500, hide: 100}
						});
				}
			}
		}


		// if the "more..." feature is disabled, do no more!
		if (window.DISABLE_NAV_MORE) {
			return;
		}

		var moreItemEl = moreItemBlueprintEl.clone(true, true);

		// find existing "more..." item
		var moreHandle = mainListChildren.filter(function() {
			// only way to tell (in editor & published site) if this is a true "more..." item
			return !!$(this).find('#' + MORE_ITEM_ID).length;
		});
		if (!moreHandle.length) {
			moreHandle = undefined;
		}

		// hide the existing "more..." item
		var alreadyMore = false;
		if (moreHandle) {
			moreHandle.hide();
			alreadyMore = true;
		}

		// grab the jquery object of a previously rendered more submenu
		var existingMoreMenu;
		if (alreadyMore) {
			existingMoreMenu = getItemFromHandle(moreHandle);

			if (existingMoreMenu[0]._flyoutmenu_destroy) {
				existingMoreMenu = existingMoreMenu[0]._flyoutmenu_destroy(true);
			} else {
				var existingMoreMenuChild = getTopLevelItemWrapFromParent(existingMoreMenu)[0];
				if (existingMoreMenuChild._flyoutmenu_destroy) {
					existingMoreMenu = existingMoreMenuChild._flyoutmenu_destroy(true);
				}
			}
		}

		var topLevelHandles = []; // includes cart, but not more
		var itemCoords = [];
		var isBreak = false;
		var isVertical;
		var verticalContainer;
		var verticalMaxY = null;

		var i;
		var handle;
		// show all existing top level items
		for (i=0; i<topLevelSummary.length; i++) {
			handle = navElm(topLevelSummary[i].id, mainList);
			if(handle){
				handle.show();
				topLevelHandles.push(handle);
			}
		}

		if (cartHandle) {
			topLevelHandles.push(cartHandle);
		}

		if (memberLogin) {
			topLevelHandles.push(memberLogin);
		}

		// loop through all the top-level items
		// 1. determine if elements are running vertically/horizontally
		// 2. determine the element that overflows
		// 3. record the elements for later
		// 4. record the elements' positions for later
		for (i=0; i<topLevelHandles.length; i++) {

			handle = topLevelHandles[i];
			var item = getItemFromHandle(handle);
			var coords = getItemMassCoords(item);

			// the first item
			if (!i) {
				// do nothing
			}

			// the second item. enough info to determine if nav is vertical/horizontal
			else if (i == 1) {

				// is the second item below the first?
				isVertical = Math.abs(coords[0].top - itemCoords[0][0].top) > Math.abs(coords[0].left - itemCoords[0][0].left);

				if (isVertical) {

					// give themes the power to specify a bounding parent for vertical navigation.
					// If specified, and items flow outside of it, there should be a "more..." item
					verticalContainer = item.closest('.wsite-nav-vertical');
					if (verticalContainer.length) {
						verticalMaxY = // get the bottom of the container
							verticalContainer.offset().top +
							(parseInt(verticalContainer.css('padding-top'), 10) || 0) +
							verticalContainer.height();
					}
				}
			}

			// horizontal nav
			else if (!isVertical) {
				if (Math.abs(coords[0].top - itemCoords[i-1][0].top) > 5) { // wrapped to next line?
					isBreak = true;
					break;
				}
			}

			// vertical nav
			else {
				if (verticalMaxY !== null) {
					if (coords[1].top > verticalMaxY) { // outside of bounding box?
						isBreak = true;
						break;
					}
				}
			}

			itemCoords.push(coords);
		}

		var hiddenItemIndices = [];
		var pageSummary;
		var liID;
		var a;

		// isBreak determines whether we need a "more..." item
		$('body').toggleClass('wsite-nav-condensed', !!isBreak);
		if (isBreak) {

			//
			// we need a "more..." item
			//

			// make sure we have the "more..." element
			if (moreHandle) {
				// already exists
				moreHandle.show();
			}else{
				// we need to create a new one
				moreHandle = moreItemEl;
				getTopLevelItemFromParent(moreHandle)
					.attr('id', MORE_ITEM_ID)
					.css('position', 'relative') // match what initItem does
					.on('click', false);

				// Order goes from left to right: more, login, cart
				if (memberLogin && !hasCustomMembership) {
					moreHandle.insertBefore(memberLogin);
				}
				else if (cartHandle && !hasCustomMinicart) {
					moreHandle.insertBefore(cartHandle);
				}
				else {
					mainList.append(moreHandle);
				}
			}

			var moreItem = getItemFromHandle(moreHandle)
				.addClass(MORE_ITEM_CLASS)
				.css('position', 'relative'); // match what initItem does

			// Starting with the item immediately before the "more..." item, start hiding
			// elements until the first and last item are on the same line (if horizontal)
			// or until the last item is in bound (if vertical).
			var firstItem = getItemFromHandle(topLevelHandles[0]);
			// Since cart is the rightmost item, then login,
			// then more, they go in reverse order
			var memberItem = null;
			if (memberLogin && !hasCustomMembership) {
				memberItem = getItemFromHandle(memberLogin);
			}
			var lastItem = cartItem || memberItem || moreItem;


			// Determine where to start hiding from
			var hideableItems = topLevelHandles.length - 1;
			// If we have a cart, don't hide it.
			if(cartHandle) {
				hideableItems --;
			}

			// If we have a member login button, don't hide it.
			if(memberLogin) {
				hideableItems --;
			}

			for (i=hideableItems; i>=0; i--) {
				var firstItemCoords = getItemMassCoords(firstItem);
				var lastItemCoords = getItemMassCoords(lastItem);
				if (
					(isVertical && lastItemCoords[1].top > verticalMaxY) || // last item is still our of bounding area
					(!isVertical && Math.abs(firstItemCoords[0].top - lastItemCoords[0].top) > 5) // not on same line yet
				) {
					topLevelHandles[i].hide();
					hiddenItemIndices.unshift(i); // put at the beginning of the list
				}
				else {
					break;
				}
			}

			if (hiddenItemIndices.length === 0) {
				// no items were hidden, no need for more...
				moreHandle.remove();
				// turn off wsite-nav-condensed class.
				$('body').removeClass('wsite-nav-condensed');
			}
			else if (hiddenItemIndices.length == topLevelSummary.length) {
				// all items were hidden, something must be wrong. revert back
				for (i=0; i<hiddenItemIndices.length; i++) {
					var el = navElm(topLevelSummary[hiddenItemIndices[i]].id, mainList)
					if (el) {
						el.show();
					}
				}
				moreHandle.remove();
				// turn off wsite-nav-condensed class.
				$('body').removeClass('wsite-nav-condensed');
			}
			else {
				var PageCollection = require('editor/page-manager/pages');
				// create the "more..." submenu items

				// render a submenu template with the items in the more menu
				var children = []; // specifically for the mustache rendering
				var submenu;
				for (var j=0; j<hiddenItemIndices.length; j++) {
					pageSummary = topLevelSummary[hiddenItemIndices[j]];

					if (PageCollection.length) {
						// in the editor - get real page data (includes children)
						pageSummary = PageCollection.getPage(pageSummary.id).toJSON();
					}
					// use page summary data & adjust for template
					pageSummary = $.extend({}, pageSummary); // make copy
					pageSummary.title_html = pageSummary.title; // contains HTML markup
					pageSummary.membership_required = pageSummary['membership-required']; // a rename

					// theme rendering relies on this
					if (getInEditor()) {
						pageSummary.url = 'page://' + pageSummary.id;
					}

					var hiddenEl = navElm(pageSummary.id, mainList);
					if (hiddenEl) {
						submenu = getItemFromHandle(hiddenEl)[0]._get_sublist();
					}
					// see if there is a submenu that was in the previous "more..." menu
					if (!submenu && existingMoreMenu) {
						submenu = !!existingMoreMenu.find('#' + ITEM_ORDERING_PREFIX_CLASS + pageSummary.id + ' .' + SUBMENU_WRAP_CLASS).length;
					}

					if (submenu) {
						// mark item as having children but don't render them
						pageSummary.has_children = true;
						pageSummary.children = false;
					}

					children.push(pageSummary);
				}

				var wrap = $(renderTemplate(
					getTemplate('navigation/flyout/list') ||
					getTemplate('menu/submenu-main'), // in case the HTML page supplied old mustache templates
					{ children: children }
				));

				if (getInEditor()) {
					window.processNavLinks(wrap);
				}

				// post-process the items
				getSubmenuItemFromParent(wrap).each(function() {

					var li = $(this).closest('[id]');
					var id = li.attr('id');

					if (!id) {
						return;
					}

					id = id.replace(/[^\d]/g, '');

					// get the page summary object
					var pageSummary;
					$.each(topLevelSummary, function() {
						if (this.id === id) {
							pageSummary = this;
							return false;// break
						}
					});

					if (!pageSummary) {
						// don't do anything if this isn't top-level
						return;
					}

					// undo our top-level item postprocessing

					// li is wrapped in span - unwrap it
					if (li.is('span.' + TOP_LEVEL_HANDLE_CLASS)) {
						li = li.children();
						li.unwrap();
					}

					// adjust the attributes
					liID = ITEM_ORDERING_PREFIX_CLASS + pageSummary.id;
					li.attr('id', liID);
					if (liID.replace(/[^\d]/g, '') == cpid) {
						li.addClass(SUBMENU_CURRENT_ITEM_CLASS);
					}

					// adjust the a tag
					a = getTopLevelItemFromParent(li);
					if (!pageSummary.onclick) {
						// make it a normal link
						var url = pageSummary.url;
						// the `url` value needs to be normalized...
						if (window.IS_ARCHIVE || url.match(/^http:\/\//)) {
							a.attr('href', url);
						}else{
							// Make a jQuery array out of the array of jQuery objects
							var handles = $($.map(topLevelHandles, function(el) { return el.get(); }));
							var topLevelHandle = getTopLevelItemFromParent(handles.filter('[id*=' + id + ']'));
							var originalUrl = topLevelHandle.attr('href');
							var originalMembershipFlag = topLevelHandle.data("membership-required");

							if (originalUrl) {
								a.attr('href', originalUrl);
							} else {
								a.attr('href', '/' + url);
							}

							if(typeof originalMembershipFlag === "number"){
								a.attr("data-membership-required", ""+originalMembershipFlag);
							}

						}
						if (pageSummary.target) {
							a.attr('target', pageSummary.target);
						}
					}

					// rip out the item's submenu from top-level
					var submenu;
					var el = navElm(pageSummary.id, mainList);
					if (el) {
						submenu = getItemFromHandle(el)[0]._flyoutmenu_destroy();
					}

					// see if there is a submenu that was in the previous "more..." menu
					if (!submenu && existingMoreMenu) {
						submenu = getSubmenuWrapFromParent(existingMoreMenu.find('#' + ITEM_ORDERING_PREFIX_CLASS + pageSummary.id));
						if (!submenu.length) {
							submenu = undefined;
						}
					}

					if (submenu) {
						getSubmenuWrapFromParent(li).replaceWith(submenu);
					}
				});

				moreItem.append(wrap); // add submenu to DOM
				window.navFlyoutMenu.addItem(moreItem); // will make the manager aware of the submenu,
				                                 // and all necessary handlers will be applied
			}
		}

		// Visible items might have been previously hidden (if they were forced into "more..." menu previously).
		// If they have submenus, restore them.
		if (existingMoreMenu) {
			for (i=0; i<hiddenItemIndices[0]; i++) { // loop through all visible nav items. hiddenItemIndices[0] is the first hidden item index.
				pageSummary = topLevelSummary[i];
				var li = navElm(pageSummary.id, mainList);
				var oldSubmenu = existingMoreMenu.find('#' + ITEM_ORDERING_PREFIX_CLASS + pageSummary.id + ' .' + SUBMENU_WRAP_CLASS + ':first');
				if (oldSubmenu.length) {
					if (li[0]._flyoutmenu_destroy) { // sometimes it was never initialized, thus check
						li[0]._flyoutmenu_destroy(); // remove handlers, because we are about to call addItem, which does it again.
					}
					li.append(oldSubmenu);
					window.navFlyoutMenu.addItem(li);
				}
			}
		}

		window.navFlyoutMenu.writeOrderingClassNames();
	}





	/************************ helpers for navigating and querying items/sublists/etc ********************/

	function inVerticalList(item, strict, aLiId) {
		var list = item.closest('.' + MENU_WRAP_CLASS);

		if (!list.length) {
			// legacy selection
			list = item.parent();
			if (list.hasClass(TOP_LEVEL_HANDLE_CLASS)) {
				list = list.parent();
			}
		}

		var allItems = getTopLevelItems(list, strict, aLiId);
		if (allItems.length >= 2) {
			var o1 = allItems.eq(0).offset();
			var o2 = allItems.eq(1).offset();
			var diff = Math.abs(o1.left - o2.left) - Math.abs(o1.top - o2.top);
			if (diff !== 0) {
				return diff < 0;
			}
		}
		return !isItemTopLevel(item);
			// default to returning false for top level user-defined css
			// and true for weebly-created submenus
	}

	function getTopLevelItems(list, strict, aLiId) {
		var items = list.find('.' + TOP_LEVEL_WRAP_CLASS);
		if (items.length) {
			return items;
		}

		// legacy selection:
		var items = list.find('.' + TOP_LEVEL_HANDLE_CLASS);
		if (items.length) {
			return items;
		}

		// legacy selection
		var res = [];
		list.children().each(function(i, handleNode) {
			var handle = $(handleNode);
			if (!strict ||
				handle.hasClass(TOP_LEVEL_HANDLE_CLASS) ||
				handle.hasClass(MORE_ITEM_CLASS) ||
				handleNode.id.match(/^pg/) ||
				(aLiId && handleNode.id==aLiId)) {
					var item = getItemFromHandle(handle);
					if (item.length) {
						res.push(item[0]);
					}
				}
		});
		return $(res);
	}

	function getItemFromHandle(item) {
		if (item.hasClass(TOP_LEVEL_HANDLE_CLASS)) {
			var el = item.find('.' + TOP_LEVEL_WRAP_CLASS).first();
			if (el.length) {
				item = el;
			} else {
				item = item.children().first();
			}
		}
		if (!item.hasClass(MENU_WRAP_CLASS)) {
			// sometimes with SPAN handles, markup was invalid and DOM messed up
			// so make sure item is not a menu
			return item;
		}
	}

	function getAllItems(list) {
		// get top level and all descendant items
		return getTopLevelItemWrapFromParent(list)
			.add(getSubmenuItemWrapFromParent(list));
	}

	function getSiblings(item) {
		var items = item.closest('.' + TOP_LEVEL_HANDLE_CLASS).siblings().find('.' + TOP_LEVEL_WRAP_CLASS + ':first-child');
		if (items.length) {
			return items;
		}

		// legacy selection
		if (item.parent().hasClass(TOP_LEVEL_HANDLE_CLASS)) {
			return item.parent().siblings().children(':first-child');
		}else{
			// items aren't wrapped by separate handles
			return item.siblings();
		}
	}

	function getSublist(item) {
		var sublist = item.find('.' + SUBMENU_CLASS).first();
		if (sublist.length) {
			return sublist;
		}

		// if there's no direct submenu, traverse up to a wrap first
		sublist = item.closest('.' + SUBMENU_ITEM_WRAP_CLASS + ', .' + TOP_LEVEL_WRAP_CLASS).find('.' + SUBMENU_CLASS).first();
		if (sublist.length) {
			return sublist;
		}

		// legacy selection
		sublist = item.find('ul').first();
		if (!sublist.length) {
			var next = item.next();
			if (next.hasClass(MENU_WRAP_CLASS)) {
				// sometimes with SPAN handles, markup is invalid, and it
				// makes the sublist a sibling AFTER the item
				sublist = next.children().first();
			}
		}
		if (sublist.length) {
			return sublist;
		}
	}

	function isItemTopLevel(item) {
		return !item.closest('.' + SUBMENU_CLASS).length;
	}

	function getItemMassCoords(item) {
		// look at the item and its A tag and return the largest rectangle of space it takes up
		// NOTE: we are still using offsetHeight/offsetWidth because jQuery 1.7.2 had a bug where
		//   getting curCSS on zero-height inline-displayed elements returned wrong value
		//   (because it converted to block first)
		var anchor = item.is('a') ? item : item.find('a');
		var p1 = item.offset();
		var p2 = { top:p1.top+item[0].offsetHeight, left:p1.left+item[0].offsetWidth };
		if (!anchor) {
			// messed up DOM (SPAN's around TD's and such) sometimes pushes A tag outside of item
			return [p1, p2];
		}
		var p3 = anchor.offset();
		var p4 = { top:p3.top+anchor[0].offsetHeight, left:p3.left+anchor[0].offsetWidth };
		var p5, p6;
		if (Math.abs(p1.left - p2.left) < 10) { // a tag is really small, doen't have any mass..
			// the inner A tag is probably floated and the LI isn't. lame. just use A tag's coords
			p5 = p3;
			p6 = p4;
		}else{
			p5 = { top:Math.min(p1.top, p3.top), left:Math.min(p1.left, p3.left) };
			p6 = { top:Math.max(p2.top, p4.top), left:Math.max(p2.left, p4.left) };
		}
		return [p5, p6];
	}

	function navElm(id, menuEl) { // todo: rename to getHandle()
		var elm = $('#pg' + id, menuEl);
		if (!elm.length && activeLiId) {
			elm = $('#' + activeLiId, menuEl);
		}
		if (elm.length) {
			return elm;
		}
	}




	/************************** helpers for theme-css-loaded detection ***********************/

	function isThemeCSSLoaded() {
		if (getInEditor()) {
			for (var i=0; i<document.styleSheets.length; i++) {
				try {
					if (document.styleSheets[i].title == stylePrefix+'-theme-css') {
						var sheet = document.styleSheets[i];
						var rules = sheet.cssRules || sheet.rules;
						return rules && rules.length > 0;
					}
				}
				catch (err) {}
			}
			return false;
		}
		return true;
	}

	function whenThemeCSSLoaded(callback) {
		if (isThemeCSSLoaded()) {
			callback();
		}else{
			var intervalID = setInterval(function() {
				if (isThemeCSSLoaded()) {
					clearInterval(intervalID);
					callback();
				}
			}, 200);
		}
	}

	if (!window.whenThemeCSSLoaded) {
		window.whenThemeCSSLoaded = whenThemeCSSLoaded;
	}

	// Export the functions...
	Weebly.Menus = {
		inVerticalList : inVerticalList
	};



	// Mustache Template Utils
	//------------------------------------------------------------------------------------------------------------------


	// should not be accessed directly from elsewhere. use getters.
	var _menuTemplates;
	var _extraItemTemplate;


	function renderMoreItemEl() {
		return renderExtraItemEl(window._W.stl('html.weebly.libraries.flyout_menus_jq_6'));
	}


	function renderExtraItemEl(titleHtml) {
		return $(
			renderTemplate(getExtraItemTemplate(), {
				title_html: titleHtml,
				url: '#',
				has_children: false
			})
		);
	}


	function renderTemplate(templateMarkup, dataForTemplate) { // renders into HTML
		var Mustache = require('mustache');

		return Mustache.render(templateMarkup, dataForTemplate, getTemplates());
	}


	function getExtraItemTemplate() {
		if (!_extraItemTemplate) {
			_extraItemTemplate =
				getTemplate('navigation/item') ||
				getTemplate('menu/item'); // in case the HTML page supplied old mustache templates
		}
		return _extraItemTemplate;
	}


	function getTemplate(templateName) {
		return getTemplates()[templateName];
	}


	function getTemplates() {
		return _menuTemplates || {};
	}


	function registerTemplates(templates) {
		 // clone it just in case
		_menuTemplates = _.extend({}, objectify(templates));
	}

	// PHP encodes empty associative arrays as []
	window.objectify = function(o) {
		return _.isEmpty(o) ? {} : o;
	}

	// Misc Utils
	//------------------------------------------------------------------------------------------------------------------


	function getInEditor() {
		return window.inEditor && window.inEditor();
	}


})(Weebly.jQuery);
