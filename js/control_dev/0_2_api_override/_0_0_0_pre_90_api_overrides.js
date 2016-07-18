
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
          var preview = this;
          api.czr_skopeBase.updateSkopeCollection( data, preview.channel() );
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
  * => keep the dirtyness param unchanged
  * => stores the api state before callback calls, and reset it after
  * => add an object param to the callback to inform that this is a silent process
  * , this is typically used in the overriden api.Setting.preview method
  *****************************************************************************/
  //@param to : the new value to set
  //@param dirtyness : the current dirtyness status of this setting in the skope
  //
  api.Setting.prototype.silent_set =function( to, dirtyness ) {
        var from = this._value,
            _save_state = api.state('saved')();

        to = this._setter.apply( this, arguments );
        to = this.validate( to );

        // Bail if the sanitized value is null or unchanged.
        if ( null === to || _.isEqual( from, to ) ) {
          return this;
        }

        this._value = to;
        this._dirty = ( _.isUndefined( dirtyness ) || ! _.isBoolean( dirtyness ) ) ? this._dirty : dirtyness;

        this.callbacks.fireWith( this, [ to, from, { silent : true } ] );
        //reset the api state to its value before the callback call
        api.state('saved')( _save_state );
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
        api.Setting.prototype.preview = function( to, from , o) {
            if ( 'pending' == api.czr_isPreviewerSkopeAware.state() )
              return this.previewer.refresh();
            //as soon as the previewer is setup, let's behave as usual
            //=> but don't refresh when silently updating
            if ( ! _.has(o, 'silent') || false === o.silent ) {
                console.log('REFRESH NOW' );
                _old_preview.call(this);
            }
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
        var _old_previewer_query = api.previewer.query;
        api.previewer.query =  function( skope_id ) {
            console.log('REACTION QUERY!');
            var dirtyCustomized = {};
            skope_id = skope_id || api.czr_activeSkope() || 'global';

            if ( ! _.has( api, 'czr_skope') || ! api.czr_skope.has( skope_id ) )
              return _old_previewer_query.apply( this );

            //on first load OR if the current skope is the customized one, build the dirtyCustomized the regular way
            //otherwise, get the dirties from the requested skope instance.
            if ( ! _.has( api, 'czr_skope') || ! api.czr_skope.has( skope_id ) || api.czr_activeSkope() == skope_id ) {
                console.log('FIRST CASE');
                api.each( function ( value, key ) {
                    if ( value._dirty ) {
                      dirtyCustomized[ key ] = value();
                    }
                } );
            } else {
                console.log('ELSE?');
                dirtyCustomized = api.czr_skope( skope_id ).dirtyValues();
            }
            console.log('SKOPE DIRTIES', skope_id, dirtyCustomized );
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






        /*****************************************************************************
        * RESET
        *****************************************************************************/
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







        /*****************************************************************************
        * SAVE
        *****************************************************************************/
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

                console.log('in submit : ', skope_id, query, api.previewer.channel() );

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
                } );

                //return the promise
                return request;
              };//submit()



              var //skopeRequestDoneCollection = new api.Value( [] ),
                  //skopeRequests = $.Deferred(),
                  dirtySkopesToSubmit = _.filter( api.czr_skopeCollection(), function( _skop ) {
                      return api.czr_skope( _skop.id ).dirtyness();
                  }),
                  _saved_dirties = {};//will be used as param to update the skope model db val after all ajx requests are done

              console.log('DIRTY SKOPES TO SUBMIT', dirtySkopesToSubmit );
              //loop on the registered skopes and submit each save ajax request

              var submitDirtySkopes = function() {
                    var promises = [];
                    _.each( dirtySkopesToSubmit, function( _skop ) {
                          console.log('submit request for skope : ', _skop.id );
                          promises.push( submit( _skop.id ) );
                    });
                    return promises;
              };

              var reactWhenPromisesDone = function( promises ) {
                    console.log('PROMISES?', promises );
                    $.when.apply( null, promises).done( function( responses ) {
                          //store the saved dirties (will be used as param to update the db val property of each saved skope)
                          //and reset them
                          _.each( dirtySkopesToSubmit, function( _skp ) {
                                _saved_dirties[ _skp.id ] = api.czr_skope( _skp.id ).dirtyValues();
                                api.czr_skope( _skp.id ).dirtyValues({});
                          });
                          // Clear api setting dirty states
                          api.each( function ( value ) {
                                value._dirty = false;
                          } );

                          //WP default treatments
                          $( document.body ).removeClass( 'saving' );
                          api.previewer.send( 'saved', responses );
                          api.trigger( 'saved', responses );
                    }).then( function() {
                          api.czr_savedDirties( { channel : api.previewer.channel() , saved : _saved_dirties });
                          api.czr_skopeBase.trigger('skopes-saved', _saved_dirties );
                    });//when()
              };


              if ( 0 === processing() ) {
                $.when( submitDirtySkopes() ).done( function( promises) {
                    reactWhenPromisesDone(promises);
                });//submit();
              } else {
                  submitWhenDoneProcessing = function () {
                      if ( 0 === processing() ) {
                          api.state.unbind( 'change', submitWhenDoneProcessing );
                          $.when( submitDirtySkopes() ).done( function( promises) {
                              reactWhenPromisesDone(promises);
                          });//submit();
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




  /*****************************************************************************
  * SYNCHRONIZER AUGMENTED
  *****************************************************************************/
  // var _original_element_initialize = api.Element.prototype.initialize;
  // api.Element.prototype.initialize = function( element, options  ) {
  //         //call the original constructor
  //         _original_element_initialize .apply( this, [element, options ] );
  //         console.log('IN OVERRIDEN INITIALIZE ELEMENT ?');
  //         // if ( this.element.is('select') ) {
  //         //     console.log('element, options', element, options);
  //         // }
  // };


  // //CHECKBOX WITH ICHECK
  api.Element.synchronizer.checkbox.update = function( to ) {
          this.element.prop( 'checked', to );
          this.element.iCheck('update');
  };

  api.Element.synchronizer.val.update = function(to) {
        //SELECT CASE
        if ( this.element.is('select') ) {
              //SELECT2 OR SELECTER
              //select2.val() documented https://select2.github.io/announcements-4.0.html
              this.element.val(to).trigger('change');
        }
        else {
          this.element.val( to );
        }
  };




})( wp.customize , jQuery, _ );