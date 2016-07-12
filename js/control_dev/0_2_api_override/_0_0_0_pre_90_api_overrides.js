
(function (api, $, _) {
  /*****************************************************************************
  * CAPTURE PREVIEW INFORMATIONS ON REFRESH + REACT TO THEM
  *****************************************************************************/
  //backup the original intialize
  var _old_initialize = api.PreviewFrame.prototype.initialize;

  //Amend the PreviewFrame prototype so that we can captures some values on preview refresh
  //@todo there must be a simpler way...
  //=> using api.previewer.deferred.active.done() works on the first load but not after. The instance is not the same ?
  api.PreviewFrame.prototype.initialize = function( params, options ) {
        _old_initialize.call( this, params, options );

        //observe widget settings changes
        this.bind('houston-widget-settings', function(data) {
            //get the difference
            var _candidates = _.filter( data.registeredSidebars, function( sb ) {
              return ! _.findWhere( _wpCustomizeWidgetsSettings.registeredSidebars, { id: sb.id } );
            });

            var _inactives = _.filter( data.registeredSidebars, function( sb ) {
              return ! _.has( data.renderedSidebars, sb.id );
            });

            _inactives = _.map( _inactives, function(obj) {
              return obj.id;
            });

            var _registered = _.map( data.registeredSidebars, function(obj) {
              return obj.id;
            });

            api.sidebar_insights('actives').set( data.renderedSidebars );
            api.sidebar_insights('inactives').set( _inactives );
            api.sidebar_insights('registered').set( _registered );
            api.sidebar_insights('candidates').set( _candidates );
            api.sidebar_insights('available_locations').set( data.availableWidgetLocations );//built server side
        });


        this.bind( 'czr-wp-conditional-ready', function(data ) {
          api.czr_wp_conditionals.set( data );
        });

        this.bind( 'czr-partial-refresh', function(data) {
          api.czr_partials.set(data);
        });

        this.bind( 'czr-skopes-ready', function(data) {
          api.czr_skopeBase.updateSkopeCollection( data );
        });
  };//api.PreviewFrame.prototype.initialize



  /*****************************************************************************
  * A "CONTEXT AWARE" SET METHD
  *****************************************************************************/
  /**
  * OVERRIDES BASE api.Value method
  * => adds the o {} param, allowing to pass additional contextual informations.
  *
  * Set the value and trigger all bound callbacks.
  *
  * @param {object} to New value.
  */
  api.Value.prototype.set = function( to, o ) {
        var from = this._value;

        to = this._setter.apply( this, arguments );
        to = this.validate( to );

        // Bail if the sanitized value is null or unchanged.
        if ( null === to || _.isEqual( from, to ) ) {
          return this;
        }

        this._value = to;
        this._dirty = true;

        this.callbacks.fireWith( this, [ to, from, o ] );

        return this;
  };



  /*****************************************************************************
  * A SILENT SET METHOD :
  * => disable the _dirty + add a dirtyness param
  *****************************************************************************/
  api.Setting.prototype.silent_set =function( to, dirtyness ) {
        var from = this._value;

        to = this._setter.apply( this, arguments );
        to = this.validate( to );

        // Bail if the sanitized value is null or unchanged.
        if ( null === to || _.isEqual( from, to ) ) {
          return this;
        }

        this._value = to;
        this._dirty = ( _.isUndefined( dirtyness ) || ! _.isBoolean( dirtyness ) ) ? this._dirty : dirtyness;

        this.callbacks.fireWith( this, [ to, from, o ] );

        return this;
  };




  /*****************************************************************************
  * A SKOPE AWARE PREVIEWER
  *****************************************************************************/
  //PREPARE THE SKOPE AWARE PREVIEWER
  if ( serverControlParams.isSkopOn ) {
    //this deferred is used to make sure the overriden api.previewer.query method has been taken into account
    api.czr_isPreviewerSkopeAware = $.Deferred();

    var _old_preview = api.Setting.prototype.preview;
    api.Setting.prototype.preview = function() {
      if ( 'pending' == api.czr_isPreviewerSkopeAware.state() )
        return this.previewer.refresh();
      //as soon as the previewer is setup, let's behave as usual
      _old_preview.call(this);
    };
  }


  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        /**
        * Build the query to send along with the Preview request.
        *
        * @return {object}
        */
        api.previewer.query =  function( skope_id ) {
            var dirtyCustomized = {};
            skope_id = skope_id || api.czr_activeSkope();

            //on first load, build the dirtyCustomized the regular way
            //otherwise, get it from the requested skope instance.
            if ( ! _.has( api, 'czr_skope') || ! api.czr_skope.has( skope_id ) ) {
                api.each( function ( value, key ) {
                    if ( value._dirty ) {
                      dirtyCustomized[ key ] = value();
                    }
                } );
            } else {
                dirtyCustomized = api.czr_skope( skope_id ).dirtyValues();
            }

            //the previewer is now scope aware
            api.czr_isPreviewerSkopeAware.resolve();

            return {
                wp_customize: 'on',
                skope :       api.czr_skope( skope_id )().skope,
                dyn_type:     api.czr_skope( skope_id )().dyn_type,//post_meta, term_meta, user_meta, trans, option
                opt_name:     api.czr_skope( skope_id )().opt_name,
                obj_id:       api.czr_skope( skope_id )().obj_id,
                theme:        _wpCustomizeSettings.theme.stylesheet,
                customized:   JSON.stringify( dirtyCustomized ),
                nonce:        this.nonce.preview
            };
        };


        api.previewer.czr_reset = function( skope_id  ) {
            var self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing,
                submit_reset,
                request,
                query;

            $( document.body ).addClass( 'czr-skope-resetting' );

             //skope dependant submit()
            submit_reset = function( skope_id ) {
                if ( _.isUndefined( skope_id ) )
                  return;

                //the query takes the skope_id has parameter
                query = $.extend( self.query( skope_id ), {
                    nonce:  self.nonce.save
                } );

                console.log('in czr_reset submit : ', skope_id, query );

                request = wp.ajax.post( 'czr_skope_reset', query );

                //api.trigger( 'save', request );

                request.fail( function ( response ) {
                    console.log('ALORS FAIL ?', skope_id, response );
                    if ( '0' === response ) {
                        response = 'not_logged_in';
                    } else if ( '-1' === response ) {
                      // Back-compat in case any other check_ajax_referer() call is dying
                        response = 'invalid_nonce';
                    }

                    if ( 'invalid_nonce' === response ) {
                        self.cheatin();
                    } else if ( 'not_logged_in' === response ) {
                        self.preview.iframe.hide();
                        self.login().done( function() {
                          self.save();
                          self.preview.iframe.show();
                      } );
                    }
                    api.trigger( 'error', response );
                } );

                request.done( function( response ) {
                    console.log('ALORS DONE ?', skope_id, response );
                    // // Clear setting dirty states
                    // api.each( function ( value ) {
                    //   value._dirty = false;
                    // } );
                    // api.previewer.send( 'saved', response );
                    // api.trigger( 'saved', response );

                } );
              };//submit_reset()

              if ( 0 === processing() ) {
                submit_reset( skope_id );
              } else {
                submitWhenDoneProcessing = function () {
                  if ( 0 === processing() ) {
                    api.state.unbind( 'change', submitWhenDoneProcessing );
                    submit_reset( skope_id );
                  }
                };
                api.state.bind( 'change', submitWhenDoneProcessing );
              }

              return request;
        };//.czr_reset





        //OVERRIDES WP
        api.previewer.save = function() {
            var self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing,
                submit;

            $( document.body ).addClass( 'saving' );

            //skope dependant submit()
            submit = function( skope_id ) {
                var request, query;

                skope_id = skope_id || api.czr_activeSkope();

                //the query takes the skope_id has parameter
                query = $.extend( self.query( skope_id ), {
                    nonce:  self.nonce.save
                } );

                console.log('in submit : ', skope_id, query );

                request = wp.ajax.post( 'customize_save', query );

                api.trigger( 'save', request );

                // request.always( function () {
                //     $( document.body ).removeClass( 'saving' );
                // } );

                request.fail( function ( response ) {
                    console.log('ALORS FAIL ?', skope_id, response );
                    if ( '0' === response ) {
                        response = 'not_logged_in';
                    } else if ( '-1' === response ) {
                      // Back-compat in case any other check_ajax_referer() call is dying
                        response = 'invalid_nonce';
                    }

                    if ( 'invalid_nonce' === response ) {
                        self.cheatin();
                    } else if ( 'not_logged_in' === response ) {
                        self.preview.iframe.hide();
                        self.login().done( function() {
                          self.save();
                          self.preview.iframe.show();
                      } );
                    }
                    api.trigger( 'error', response );
                } );

                request.done( function( response ) {
                    console.log('ALORS DONE ?', skope_id, response );

                    //update the list of done request
                    var _current_list = skopeRequestDoneCollection(),
                        _new_list = $.extend( true, [], _current_list );

                    if ( _.isUndefined( _.findWhere( _new_list, { id : skope_id } ) ) ) {
                      _new_list.push( { id : skope_id, response : response } );
                      skopeRequestDoneCollection.set( _new_list );
                    }

                    // // Clear setting dirty states
                    // api.each( function ( value ) {
                    //   value._dirty = false;
                    // } );
                    // api.previewer.send( 'saved', response );
                    // api.trigger( 'saved', response );

                } );
              };//submit()



              var skopeRequestDoneCollection = new api.Value( [] ),
                  skopeRequests = $.Deferred(),
                  dirtySkopesToSubmit = _.filter( api.czr_skopeCollection(), function( _skop ) {
                      return api.czr_skope( _skop.id ).dirtyness();
                  }),
                  _saved_dirties = {};//will be used as param to update the skope model db val after all ajx requests are done

              console.log('DIRTY SKOPES TO SUBMIT', dirtySkopesToSubmit );
              //Solves the problem of knowing when all asynchronous ajax requests are done
              //each time an skope save ajax request is performed and done(),
              //the skopeRequestDoneCollection array is updated with a new saved skope item : { id : skope_id, response : response }
              //when all registered skope have been saved, the skopeRequests are resolve()
              //=> then the skopeRequests Deferred() object fires his own done() callback.
              //
              //An alternative would be to use the $.ajax( request1, request2 ).done() syntax
              skopeRequestDoneCollection.bind( function( saved_skopes ) {
                  console.log('skopeRequestDoneCollection callback', saved_skopes );
                  //have all skopes been saved ?
                  var _skop_to_do = _.filter( dirtySkopesToSubmit, function( _skop ) {
                      return _.isUndefined( _.findWhere( saved_skopes, { id : _skop.id } ) );// ! _.contains( saved_skopes, _skop.id );
                  });

                  if ( ! _.isEmpty( _skop_to_do ) )
                    return;
                  skopeRequests.resolve( saved_skopes );
              });



              skopeRequests.done( function( saved_skopes ) {
                    console.log('ALL SKOPE REQUESTS ARE DONE', saved_skopes );
                    //store the saved dirties (will be used as param to update the db val property of each saved skope)
                    //and reset them
                    _.each( saved_skopes, function( _skp ) {
                          _saved_dirties[ _skp.id ] = api.czr_skope( _skp.id ).dirtyValues();
                          api.czr_skope( _skp.id ).dirtyValues({});
                    });
                    // Clear api setting dirty states
                    api.each( function ( value ) {
                          value._dirty = false;
                    } );

                    //WP default treatments
                    $( document.body ).removeClass( 'saving' );
                    //always send the response of the current skope api.czr_activeSkope()
                    //=> if the current active Skope had no dirties and has not been changed, then don't send anything
                    if ( ! _.isUndefined( _.findWhere( saved_skopes, { id : api.czr_activeSkope() } ) ) ) {
                        var response = _.findWhere( saved_skopes, { id : api.czr_activeSkope() } ).response;
                        if ( _.isUndefined(response) || ! response ) {
                            throw new Error( 'SkopeRequests.done() : no valid response to send' );
                        }
                        api.previewer.send( 'saved', response );
                      api.trigger( 'saved', response );
                    }

              }).then( function() {
                    api.czr_skopeBase.trigger('skopes-saved', _saved_dirties );
              });


              //loop on the registered skopes and submit each save ajax request
              var submitDirtySkopes = function() {
                  _.each( dirtySkopesToSubmit, function( _skop ) {
                      console.log('submit request for skope : ', _skop.id );
                      console.log('has skope dirties', api.czr_skope( _skop.id ).dirtyness(), api.czr_skope( _skop.id ).dirtyValues() );
                      submit( _skop.id );
                  });
              };

              if ( 0 === processing() ) {
                submitDirtySkopes();//submit();
              } else {
                  submitWhenDoneProcessing = function () {
                      if ( 0 === processing() ) {
                          api.state.unbind( 'change', submitWhenDoneProcessing );
                          submitDirtySkopes();//submit();
                      }
                    };
                  api.state.bind( 'change', submitWhenDoneProcessing );
              }
        };//save()

  });//api.bind('ready')



  //FIX FOR CONTROL VISIBILITY LOST ON PREVIEW REFRESH #1
  //This solves the problem of control visiblity settings being lost on preview refresh since WP 4.3
  //this overrides the wp method only for the control instances
  //it check if there's been a customizations
  //=> args.unchanged is true for all cases, for example when api.previewer.loading and the preview send 'ready'created during the frame synchronisation
  api.Control.prototype.onChangeActive = function ( active, args ) {
        if ( args.unchanged )
          return;
        if ( this.container[0] && ! $.contains( document, this.container[0] ) ) {
          // jQuery.fn.slideUp is not hiding an element if it is not in the DOM
          this.container.toggle( active );
          if ( args.completeCallback ) {
            args.completeCallback();
          }
        } else if ( active ) {
          this.container.slideDown( args.duration, args.completeCallback );
        } else {
          this.container.slideUp( args.duration, args.completeCallback );
        }
  };


   /* monkey patch for the content height set */
  //wp.customize.Section is not available before wp 4.1
  if ( 'function' == typeof api.Section ) {
    // backup the original function
    var _original_section_initialize = api.Section.prototype.initialize;
    api.Section.prototype.initialize = function( id, options ) {
          //call the original constructor
          _original_section_initialize.apply( this, [id, options] );
          var section = this;

          this.expanded.callbacks.add( function( _expanded ) {
            if ( ! _expanded )
              return;

          var container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                content = section.container.find( '.accordion-section-content' );
            //content resizing to the container height
            _resizeContentHeight = function() {
              content.css( 'height', container.innerHeight() );
          };
            _resizeContentHeight();
            //this is set to off in the original expand callback if 'expanded' is false
            $( window ).on( 'resize.customizer-section', _.debounce( _resizeContentHeight, 110 ) );
          });
        };
  }
})( wp.customize , jQuery, _ );