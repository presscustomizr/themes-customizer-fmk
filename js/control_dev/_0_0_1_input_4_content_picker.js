var CZRInputMethods = CZRInputMethods || {};
$.extend( CZRInputMethods , {

  //////////////////////////////////////////////////
  /// HELPERS
  //////////////////////////////////////////////////
  renderContentPickerTemplate: function() {
    var input  = this;

    //do we have view template script?
    if ( 0 === $( '#tmpl-czr-content-picker-view-content' ).length )
      return;

    var view_template = wp.template('czr-content-picker-view-content');

    //do we have an html template and a control container?
    if ( ! view_template  || ! input.container )
      return;

    var $_view_el    = input.container.find('.' + input.control.css_attr.content_picker_container );

    if ( ! $_view_el.length )
      return;

    $_view_el.html( view_template( input.control.params ) );

    return true;
  },
  setupContentPicker: function() {
    var input  = this;

    //do we have an html template and a input container?
    if ( ! input.container )
      return this;

    if ( ! input.renderContentPickerTemplate() )
      return;

   /* A single available menu item model. See PHP's WP_Customize_Nav_Menu_Item_Setting class.
    *
    * @constructor
    * @augments Backbone.Model
    */
    this.czr_ContentItemModel = new api.Value();
    this.czr_ContentItemModel.model = { id : '', title : '', object_type : '' };

    /* Setup Search */
    this.$search = this.container.find('.content-items-search');
    this.$search.on(
       'input keyup', input._debounce_search
    );     

    this._debounce_search = _.debounce( input.czrSearch, 500 );

     /* First filling */
     this.initList();
  },

  // Search input change handler.
  czrSearch: function( event ) {
    console.log('cerco cerco cerco');
    //TODO
  },
  // Get search results.
  czrDoSearch: function( page ) {
    var self = this, params,
    $section = $( 'available-menu-items-search' ),
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
        //'customize-menus-nonce': api.settings.nonce['customize-menus'],
        'wp_customize': 'on',
        'search': self.searchTerm,
        'type': type,
        'object': object,
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
    var input = this;

    input.pages = 0;
    input.loadItems( 'post_type', 'page' );
  },

  // Load available menu items.
  loadItems: function( type, object ) {
    var self = this, params, request, itemTemplate;
    // availableMenuItemContainer;
    itemTemplate = wp.template( 'czr-content-item-view-content' );

    if ( -1 === self.pages ) {
      return;
    }
    //availableMenuItemContainer = $( '#available-menu-items-' + type + '-' + object );
    //availableMenuItemContainer.find( '.accordion-section-title' ).addClass( 'loading' );
    self.loading = true;
      
    params = {
        //'customize-menus-nonce': api.settings.nonce['customize-menus'],
       'wp_customize': 'on',
       'type': type,
       'object': object,
       'page': self.pages
    };
    request = wp.ajax.post( 'load-available-content-items-customizer', params );

    request.done(function( data ) {
      console.log(data.items);

      var items, typeInner;
          items = data.items;
      
      if ( 0 === items.length ) {
        if ( 0 === self.pages) {
          //TODO: Treat no results
        }
        self.pages = -1;
        return;
      }
      
      //items = new api.Menus.AvailableItemCollection( items ); // @todo Why is this collection created and then thrown away?
      //self.collection.add( items.models );
      typeInner = $('.available-content-items-items .accordion-section-contents');
      _.each( items, function( menuItem ) {
        typeInner.append( itemTemplate( menuItem ) );
      });
      self.pages += 1;
    });
      
    request.fail(function( data ) {
      if ( typeof console !== 'undefined' && console.error ) {
        console.error( data );
      }
    });
    request.always(function() {
      /*availableMenuItemContainer.find( '.accordion-section-title' ).removeClass( 'loading' );*/
      self.loading = false;
    });
  },
});//$.extend
