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

    input.pages = [];

    /* Setup Search */
    this.$search = this.container.find('.content-items-search');
    this._debounce_search = _.debounce( input.czrSearch, 500 );
    
         
    /* Binding */
    _.bindAll( input, '_submit', '_debounce_search');
    /* Bind select */
    this.container.on('click', '.content-item-tpl', input._submit);
    /* Bind search*/
    this.$search.on('input keyup', input._debounce_search);  
    /* First filling */
    this.czrInitList();

  },
  // Search input change handler.
  czrSearch: function( event ) {
    var input = this,
      $searchSection = input.container.find( '.available-content-items-search' ),
      $otherSections = input.container.find( '.available-content-items .accordion-section' ).not( $searchSection );

      if ( ! event ) {
        return;
      }

      if ( input.searchTerm === event.target.value ) {
        return;
      }

      if ( '' !== event.target.value && ! $searchSection.hasClass( 'open' ) ) {
        $otherSections.fadeOut( 100 );
        $searchSection.find( '.accordion-section-contents' ).slideDown( 'fast' );
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

      input.searchTerm = event.target.value;
      input.pages.search = 1;
      input.czrDoSearch( 1, 'post_type', 'page');
  },
  // Get search results.
  czrDoSearch: function( page, type, object ) {
    var self = this, params,
    $section = self.container.find( '.available-content-items-search' ),
    $content = $section.find( '.accordion-section-contents' ),
    itemTemplate = wp.template( 'czr-content-item-view-content' );

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

    self.currentRequest = wp.ajax.post( 'search-available-content-items-customizer', params );

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
      //items = new api.Menus.AvailableItemCollection( data.items );
      items = data.items;
      //self.collection.add( items.models );
      _.each( items, function( contentItem ) {
        $content.append( itemTemplate( contentItem ) );
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
  czrInitList: function() {
    var input = this;

    input.pages.p = 0;
    input.czrLoadItems( 'post_type', 'page' );
  },

  // Load available menu items.
  czrLoadItems: function( type, object ) {
    var self = this, params, request, itemTemplate;
    // availableMenuItemContainer;
    itemTemplate = wp.template( 'czr-content-item-view-content' );

    if ( -1 === self.pages.p ) {
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
      var items, typeInner;
          items = data.items;
      
      if ( 0 === items.length ) {
        if ( 0 === self.pages.p) {
          //TODO: Treat no results
        }
        self.pages.p = -1;
        return;
      }
      
      //items = new api.Menus.AvailableItemCollection( items ); // @todo Why is this collection created and then thrown away?
      //self.collection.add( items.models );
      typeInner = self.container.find('.available-content-items-items .accordion-section-contents[data-type="items"]');
      _.each( items, function( menuItem ) {
        typeInner.append( itemTemplate( menuItem ) );
      });
      self.pages.p += 1;
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
  submit: function(  contentitemTpl ) {

      $( contentitemTpl ).find( '.content-item-handle' ).addClass( 'item-added' );
      //If NOT MULTI
      $( contentitemTpl ).siblings().find( '.content-item-handle').removeClass('item-added');
      //All thsi will be handled in the future with a collection in which we enter with the item-id
      //to retrieve all the other info.
      this.container.find('input[data-type="content-picker"]').val(JSON.stringify([{
        'id' : contentitemTpl.data( 'item-id' ).replace('post-', ''),
        'type' : 'page', //static for now
        'title' : contentitemTpl.find('span.item-title').text().trim()
      }])).trigger('change');

    },
});//$.extend