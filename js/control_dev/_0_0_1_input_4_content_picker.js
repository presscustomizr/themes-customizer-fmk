var CZRInputMethods = CZRInputMethods || {};
$.extend( CZRInputMethods , {

  //console.log('mai qui');
  //////////////////////////////////////////////////
  /// HELPERS
  //////////////////////////////////////////////////
  setupContentPicker: function() {
         var input  = this;
         
         
         //test purpose
         var _tpl   = wp.template('czr-available-items-view-content');
         $('#customize-preview').after( _tpl() );

         var _p   = (input.control.params),
            _tpl2 = wp.template('czr-available-item-type-view-content'),
            _html  = _tpl2(_p.available_item_types);

         /* only temporarily */
         $('.available-content-items-types').html(
                _html
         );


         //
         return;
         //end
         //do we have an html template and a input container?
         if ( ! input.container )
           return this;

         if ( ! input.renderThisTemplate() )
           return;

         // Bind events, with delegation to facilitate re-rendering.
         input.container.on( 'click keydown', '.upload-button', input.czrImgUploadOpenFrame );
         input.container.on( 'click keydown', '.thumbnail-image img', input.czrImgUploadOpenFrame );
         input.container.on( 'click keydown', '.remove-button', input.czrImgUploadRemoveFile );
         input.container.on( 'click keydown', '.default-button', input.czrImgUploadRestoreDefault );

         input.bind( function( to, from ){
            input.renderImageUploaderTemplate();
         });

	/**
	 * wp.customize.Menus.AvailableItemModel
	 *
	 * A single available menu item model. See PHP's WP_Customize_Nav_Menu_Item_Setting class.
	 *
	 * @constructor
	 * @augments Backbone.Model
	 */
	api.Menus.AvailableItemModel = Backbone.Model.extend( $.extend(
		{
			id: null // This is only used by Backbone.
		},
		api.Menus.data.defaultSettingValues.nav_menu_item
	) );

	/**
	 * wp.customize.Menus.AvailableItemCollection
	 *
	 * Collection for available menu item models.
	 *
	 * @constructor
	 * @augments Backbone.Model
	 */
	api.Menus.AvailableItemCollection = Backbone.Collection.extend({
		model: api.Menus.AvailableItemModel,

		sort_key: 'order',

		comparator: function( item ) {
			return -item.get( this.sort_key );
		},

		sortByField: function( fieldName ) {
			this.sort_key = fieldName;
			this.sort();
		}
	});
	api.Menus.availableMenuItems = new api.Menus.AvailableItemCollection( api.Menus.data.availableMenuItems );

	/**
	 * wp.customize.Menus.AvailableMenuItemsPanelView
	 *
	 * View class for the available menu items panel.
	 *
	 * @constructor
	 * @augments wp.Backbone.View
	 * @augments Backbone.View
	 */
	api.Menus.AvailableMenuItemsPanelView = wp.Backbone.View.extend({

		el: '#available-menu-items',

		events: {
			'input #menu-items-search': 'debounceSearch',
			'keyup #menu-items-search': 'debounceSearch',
			'focus .menu-item-tpl': 'focus',
			'click .menu-item-tpl': '_submit',
			'click #custom-menu-item-submit': '_submitLink',
			'keypress #custom-menu-item-name': '_submitLink',
			'keydown': 'keyboardAccessible'
		},

		// Cache current selected menu item.
		selected: null,

		// Cache menu control that opened the panel.
		currentMenuControl: null,
		debounceSearch: null,
		$search: null,
		searchTerm: '',
		rendered: false,
		pages: {},
		sectionContent: '',
		loading: false,

		initialize: function() {
			var self = this;

			if ( ! api.panel.has( 'nav_menus' ) ) {
				return;
			}

			this.$search = $( '#menu-items-search' );
			this.sectionContent = this.$el.find( '.accordion-section-content' );

			this.debounceSearch = _.debounce( self.search, 500 );

			_.bindAll( this, 'close' );

			// If the available menu items panel is open and the customize controls are
			// interacted with (other than an item being deleted), then close the
			// available menu items panel. Also close on back button click.
			$( '#customize-controls, .customize-section-back' ).on( 'click keydown', function( e ) {
				var isDeleteBtn = $( e.target ).is( '.item-delete, .item-delete *' ),
					isAddNewBtn = $( e.target ).is( '.add-new-menu-item, .add-new-menu-item *' );
				if ( $( 'body' ).hasClass( 'adding-menu-items' ) && ! isDeleteBtn && ! isAddNewBtn ) {
					self.close();
				}
			} );

			// Clear the search results.
			$( '.clear-results' ).on( 'click keydown', function( event ) {
				if ( event.type === 'keydown' && ( 13 !== event.which && 32 !== event.which ) ) { // "return" or "space" keys only
					return;
				}

				event.preventDefault();

				$( '#menu-items-search' ).val( '' ).focus();
				event.target.value = '';
				self.search( event );
			} );

			this.$el.on( 'input', '#custom-menu-item-name.invalid, #custom-menu-item-url.invalid', function() {
				$( this ).removeClass( 'invalid' );
			});

			// Load available items if it looks like we'll need them.
			api.panel( 'nav_menus' ).container.bind( 'expanded', function() {
				if ( ! self.rendered ) {
					self.initList();
					self.rendered = true;
				}
			});

			// Load more items.
			this.sectionContent.scroll( function() {
				var totalHeight = self.$el.find( '.accordion-section.open .accordion-section-content' ).prop( 'scrollHeight' ),
					visibleHeight = self.$el.find( '.accordion-section.open' ).height();

				if ( ! self.loading && $( this ).scrollTop() > 3 / 4 * totalHeight - visibleHeight ) {
					var type = $( this ).data( 'type' ),
						object = $( this ).data( 'object' );

					if ( 'search' === type ) {
						if ( self.searchTerm ) {
							self.doSearch( self.pages.search );
						}
					} else {
						self.loadItems( type, object );
					}
				}
			});

			// Close the panel if the URL in the preview changes
			api.previewer.bind( 'url', this.close );

			self.delegateEvents();
		},

		// Search input change handler.
		search: function( event ) {
			var $searchSection = $( '#available-menu-items-search' ),
				$otherSections = $( '#available-menu-items .accordion-section' ).not( $searchSection );

			if ( ! event ) {
				return;
			}

			if ( this.searchTerm === event.target.value ) {
				return;
			}

			if ( '' !== event.target.value && ! $searchSection.hasClass( 'open' ) ) {
				$otherSections.fadeOut( 100 );
				$searchSection.find( '.accordion-section-content' ).slideDown( 'fast' );
				$searchSection.addClass( 'open' );
				$searchSection.find( '.clear-results' )
					.prop( 'tabIndex', 0 )
					.addClass( 'is-visible' );
			} else if ( '' === event.target.value ) {
				$searchSection.removeClass( 'open' );
				$otherSections.show();
				$searchSection.find( '.clear-results' )
					.prop( 'tabIndex', -1 )
					.removeClass( 'is-visible' );
			}

			this.searchTerm = event.target.value;
			this.pages.search = 1;
			this.doSearch( 1 );
		},

		// Get search results.
		doSearch: function( page ) {
			var self = this, params,
				$section = $( '#available-menu-items-search' ),
				$content = $section.find( '.accordion-section-content' ),
				itemTemplate = wp.template( 'available-menu-item' );

			if ( self.currentRequest ) {
				self.currentRequest.abort();
			}

			if ( page < 0 ) {
				return;
			} else if ( page > 1 ) {
				$section.addClass( 'loading-more' );
				$content.attr( 'aria-busy', 'true' );
				wp.a11y.speak( api.Menus.data.l10n.itemsLoadingMore );
			} else if ( '' === self.searchTerm ) {
				$content.html( '' );
				wp.a11y.speak( '' );
				return;
			}

			$section.addClass( 'loading' );
			self.loading = true;
			params = {
				'customize-menus-nonce': api.settings.nonce['customize-menus'],
				'wp_customize': 'on',
				'search': self.searchTerm,
				'page': page
			};

			self.currentRequest = wp.ajax.post( 'search-available-menu-items-customizer', params );

			self.currentRequest.done(function( data ) {
				var items;
				if ( 1 === page ) {
					// Clear previous results as it's a new search.
					$content.empty();
				}
				$section.removeClass( 'loading loading-more' );
				$content.attr( 'aria-busy', 'false' );
				$section.addClass( 'open' );
				self.loading = false;
				items = new api.Menus.AvailableItemCollection( data.items );
				self.collection.add( items.models );
				items.each( function( menuItem ) {
					$content.append( itemTemplate( menuItem.attributes ) );
				} );
				if ( 20 > items.length ) {
					self.pages.search = -1; // Up to 20 posts and 20 terms in results, if <20, no more results for either.
				} else {
					self.pages.search = self.pages.search + 1;
				}
				if ( items && page > 1 ) {
					wp.a11y.speak( api.Menus.data.l10n.itemsFoundMore.replace( '%d', items.length ) );
				} else if ( items && page === 1 ) {
					wp.a11y.speak( api.Menus.data.l10n.itemsFound.replace( '%d', items.length ) );
				}
			});

			self.currentRequest.fail(function( data ) {
				// data.message may be undefined, for example when typing slow and the request is aborted.
				if ( data.message ) {
					$content.empty().append( $( '<p class="nothing-found"></p>' ).text( data.message ) );
					wp.a11y.speak( data.message );
				}
				self.pages.search = -1;
			});

			self.currentRequest.always(function() {
				$section.removeClass( 'loading loading-more' );
				$content.attr( 'aria-busy', 'false' );
				self.loading = false;
				self.currentRequest = null;
			});
		},

		// Render the individual items.
		initList: function() {
			var self = this;

			// Render the template for each item by type.
			_.each( api.Menus.data.itemTypes, function( itemType ) {
				self.pages[ itemType.type + ':' + itemType.object ] = 0;
				self.loadItems( itemType.type, itemType.object ); // @todo we need to combine these Ajax requests.
			} );
		},

		// Load available menu items.
		loadItems: function( type, object ) {
			var self = this, params, request, itemTemplate, availableMenuItemContainer;
			itemTemplate = wp.template( 'available-menu-item' );

			if ( -1 === self.pages[ type + ':' + object ] ) {
				return;
			}
			availableMenuItemContainer = $( '#available-menu-items-' + type + '-' + object );
			availableMenuItemContainer.find( '.accordion-section-title' ).addClass( 'loading' );
			self.loading = true;
			params = {
				'customize-menus-nonce': api.settings.nonce['customize-menus'],
				'wp_customize': 'on',
				'type': type,
				'object': object,
				'page': self.pages[ type + ':' + object ]
			};
			request = wp.ajax.post( 'load-available-menu-items-customizer', params );

			request.done(function( data ) {
				var items, typeInner;
				items = data.items;
				if ( 0 === items.length ) {
					if ( 0 === self.pages[ type + ':' + object ] ) {
						availableMenuItemContainer
							.addClass( 'cannot-expand' )
							.removeClass( 'loading' )
							.find( '.accordion-section-title > button' )
							.prop( 'tabIndex', -1 );
					}
					self.pages[ type + ':' + object ] = -1;
					return;
				}
				items = new api.Menus.AvailableItemCollection( items ); // @todo Why is this collection created and then thrown away?
				self.collection.add( items.models );
				typeInner = availableMenuItemContainer.find( '.accordion-section-content' );
				items.each(function( menuItem ) {
					typeInner.append( itemTemplate( menuItem.attributes ) );
				});
				self.pages[ type + ':' + object ] += 1;
			});
			request.fail(function( data ) {
				if ( typeof console !== 'undefined' && console.error ) {
					console.error( data );
				}
			});
			request.always(function() {
				availableMenuItemContainer.find( '.accordion-section-title' ).removeClass( 'loading' );
				self.loading = false;
			});
		},

		// Adjust the height of each section of items to fit the screen.
		itemSectionHeight: function() {
			var sections, totalHeight, accordionHeight, diff;
			totalHeight = window.innerHeight;
			sections = this.$el.find( '.accordion-section:not( #available-menu-items-search ) .accordion-section-content' );
			accordionHeight =  46 * ( 2 + sections.length ) - 13; // Magic numbers.
			diff = totalHeight - accordionHeight;
			if ( 120 < diff && 290 > diff ) {
				sections.css( 'max-height', diff );
			}
		},

		// Highlights a menu item.
		select: function( menuitemTpl ) {
			this.selected = $( menuitemTpl );
			this.selected.siblings( '.menu-item-tpl' ).removeClass( 'selected' );
			this.selected.addClass( 'selected' );
		},

		// Highlights a menu item on focus.
		focus: function( event ) {
			this.select( $( event.currentTarget ) );
		},

		// Submit handler for keypress and click on menu item.
		_submit: function( event ) {
			// Only proceed with keypress if it is Enter or Spacebar
			if ( 'keypress' === event.type && ( 13 !== event.which && 32 !== event.which ) ) {
				return;
			}

			this.submit( $( event.currentTarget ) );
		},

		// Adds a selected menu item to the menu.
		submit: function( menuitemTpl ) {
			var menuitemId, menu_item;

			if ( ! menuitemTpl ) {
				menuitemTpl = this.selected;
			}

			if ( ! menuitemTpl || ! this.currentMenuControl ) {
				return;
			}

			this.select( menuitemTpl );

			menuitemId = $( this.selected ).data( 'menu-item-id' );
			menu_item = this.collection.findWhere( { id: menuitemId } );
			if ( ! menu_item ) {
				return;
			}

			this.currentMenuControl.addItemToMenu( menu_item.attributes );

			$( menuitemTpl ).find( '.menu-item-handle' ).addClass( 'item-added' );
		},

		// Submit handler for keypress and click on custom menu item.
		_submitLink: function( event ) {
			// Only proceed with keypress if it is Enter.
			if ( 'keypress' === event.type && 13 !== event.which ) {
				return;
			}

			this.submitLink();
		},

		// Adds the custom menu item to the menu.
		submitLink: function() {
			var menuItem,
				itemName = $( '#custom-menu-item-name' ),
				itemUrl = $( '#custom-menu-item-url' );

			if ( ! this.currentMenuControl ) {
				return;
			}

			if ( '' === itemName.val() ) {
				itemName.addClass( 'invalid' );
				return;
			} else if ( '' === itemUrl.val() || 'http://' === itemUrl.val() ) {
				itemUrl.addClass( 'invalid' );
				return;
			}

			menuItem = {
				'title': itemName.val(),
				'url': itemUrl.val(),
				'type': 'custom',
				'type_label': api.Menus.data.l10n.custom_label,
				'object': ''
			};

			this.currentMenuControl.addItemToMenu( menuItem );

			// Reset the custom link form.
			itemUrl.val( 'http://' );
			itemName.val( '' );
		},

		// Opens the panel.
		open: function( menuControl ) {
			this.currentMenuControl = menuControl;

			this.itemSectionHeight();

			$( 'body' ).addClass( 'adding-menu-items' );

			// Collapse all controls.
			_( this.currentMenuControl.getMenuItemControls() ).each( function( control ) {
				control.collapseForm();
			} );

			this.$el.find( '.selected' ).removeClass( 'selected' );

			this.$search.focus();
		},

		// Closes the panel
		close: function( options ) {
			options = options || {};

			if ( options.returnFocus && this.currentMenuControl ) {
				this.currentMenuControl.container.find( '.add-new-menu-item' ).focus();
			}

			this.currentMenuControl = null;
			this.selected = null;

			$( 'body' ).removeClass( 'adding-menu-items' );
			$( '#available-menu-items .menu-item-handle.item-added' ).removeClass( 'item-added' );

			this.$search.val( '' );
		},

		// Add a few keyboard enhancements to the panel.
		keyboardAccessible: function( event ) {
			var isEnter = ( 13 === event.which ),
				isEsc = ( 27 === event.which ),
				isBackTab = ( 9 === event.which && event.shiftKey ),
				isSearchFocused = $( event.target ).is( this.$search );

			// If enter pressed but nothing entered, don't do anything
			if ( isEnter && ! this.$search.val() ) {
				return;
			}

			if ( isSearchFocused && isBackTab ) {
				this.currentMenuControl.container.find( '.add-new-menu-item' ).focus();
				event.preventDefault(); // Avoid additional back-tab.
			} else if ( isEsc ) {
				this.close( { returnFocus: true } );
			}
		}
	});

  },
});//$.extend
