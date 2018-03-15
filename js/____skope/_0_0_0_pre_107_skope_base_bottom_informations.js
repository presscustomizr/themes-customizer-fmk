
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

      //can be call directly, but the recommend way is to use api.czr_bottomInfosVisible, fired on skope base initialize, for which the following method is a callback
      //noteParams is an object :
      //{
      // title : '',
      // message : '',
      // actions : fn()
      //}
      toggleBottomInfos : function( visible, noteParams ) {
            noteParams = _.isObject( noteParams ) ? noteParams : {};
            var self = this,
                dfd = $.Deferred(),
                _defaultParams = {
                      title : '',
                      message : '',
                      actions : '',
                      selfCloseAfter : 20000
                },
                _skopeInfosSetId = api.CZR_Helpers.build_setId('show-skope-infos'),
                _renderAndSetup = function() {
                      var _dfd = $.Deferred();
                      //Render and setup DOM listeners
                      $.when( self.renderBottomInfosTmpl( noteParams ) )
                            .done( function( $_el ) {
                                  self.bottomInfosContainer = $_el;
                                  //Reveal and resolve
                                  _.delay( function() {
                                        $('body').addClass('czr-bottom-infos-open');
                                        _dfd.resolve();
                                  }, 200 );

                                  //setup DOM listeners
                                  api.CZR_Helpers.setupDOMListeners(
                                        [
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-preview-note-close',
                                                    actions   : function() {
                                                          _hideAndDestroy().done( function() {
                                                                api.czr_bottomInfosVisible( false );
                                                                if ( _.isFunction( noteParams.actions ) ) {
                                                                      noteParams.actions();
                                                                }
                                                          });
                                                    }
                                              },
                                              //skope switch
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-skope-switch',
                                                    actions   : function( params ) {
                                                          var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                                          if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                                            api.czr_activeSkopeId( _skopeIdToSwithTo );
                                                    }
                                              },
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-disable-bottom-infos',
                                                    actions   : function( params ) {
                                                          if ( api.control.has( _skopeInfosSetId ) ) {
                                                                api.control( _skopeInfosSetId ).focus();
                                                          }
                                                    }
                                              }
                                        ] ,
                                        { dom_el : self.bottomInfosContainer },
                                        self
                                  );
                            })
                            .fail( function() {
                                  _dfd.resolve();
                            });
                      return _dfd.promise();
                },
                _hideAndDestroy = function() {
                      return $.Deferred( function() {
                            var _dfd_ = this;
                            $('body').removeClass('czr-bottom-infos-open');
                            if ( self.bottomInfosContainer.length ) {
                                  //remove and reset
                                  _.delay( function() {
                                        self.bottomInfosContainer.remove();
                                        self.bottomInfosContainer = false;
                                        _dfd_.resolve();
                                  }, 300 );
                            } else {
                                _dfd_.resolve();
                            }
                      });
                };


            noteParams = $.extend( _defaultParams , noteParams);

            if ( visible ) {
                  _renderAndSetup().always( function() {
                        dfd.resolve();
                  });
            } else {
                  _hideAndDestroy().done( function() {
                        api.czr_bottomInfosVisible( false );//should be already false
                        dfd.resolve();
                  });
            }

            //Always auto-collapse the infos block
            // _.delay( function() {
            //             api.czr_bottomInfosVisible( false );
            //       },
            //       noteParams.selfCloseAfter || 20000
            // );
            return dfd.promise();
      },


      //@param = { note_title  : '', note_message : '' }
      renderBottomInfosTmpl : function( params ) {
            params = params || {};
            var self = this,
                _tmpl = '',
                _skope_id = api.czr_activeSkopeId();

            //Don't go further if the current skope is not registered yet
            if ( ! api.czr_skope.has( _skope_id ) || ! _.isObject( api.czr_skope( _skope_id )() ) )
              return false;

            var _skope_title = api.czr_skope( _skope_id )().long_title,
                _ctxTitle = api.czr_skope( _skope_id )().ctx_title;

            _skope_title = _.isString( _skope_title ) ? _skope_title : '';
            _ctxTitle = _.isString( _ctxTitle ) ? _ctxTitle : '';

            var _title = params.title || ['Customizing', _ctxTitle.toLowerCase() ].join(' '),
                _message = params.message || self._getSkopeInfosMessage( _skope_id ),
                _renderTmpl = function() {
                      return $.Deferred( function() {
                            var dfd = this;
                            try {
                                  _tmpl =  wp.template( 'czr-bottom-infos' )( { title : _title } );
                                  $('#customize-preview').after( $( _tmpl ) );
                                  dfd.resolve();
                            } catch( er ) {
                                  api.errorLog( 'Error when parsing the the bottom infos template : ' + er );
                                  dfd.reject( er );
                            }
                      });
                };

            //on initial rendering, print the template
            if ( _.isUndefined( this.bottomInfosContainer ) || 1 != this.bottomInfosContainer.length ) {
                  _renderTmpl().done( function() {
                        $('.czr-note-message', '#czr-bottom-infos').html( _message );
                  });
            } else {
                  $('.czr-note-content', self.bottomInfosContainer ).fadeOut({
                        duration : 'fast',
                        complete : function() {
                              $( 'h2', self.bottomInfosContainer ).html( [ '&middot;', _title, '&middot;' ].join(' ') );
                              $('.czr-note-message', self.bottomInfosContainer ).html( _message );
                              $(this).fadeIn('fast');
                        }
                  });

            }
            return ( this.bottomInfosContainer && 1 == this.bottomInfosContainer.length ) ? this.bottomInfosContainer : $( '#czr-bottom-infos' );
      },


      //@return html string
      //a skope is described by the following properties :
      // color:"rgba(39, 59, 88, 0.28)"
      // ctx_title:"Home"
      // dyn_type:"skope_meta"
      // id:"local_home"
      // is_forced:false
      // is_winner:true
      // level:"home"
      // long_title:"Options for home"
      // obj_id:"home"
      // opt_name:"hueman_czr_home"
      // skope:"local"
      // title:"Options for home"
      _getSkopeInfosMessage : function( skope_id ) {
            skope_id = skope_id || api.czr_activeSkopeId();
            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

            //Paranoid but, always bail if :
            //1) the current skope id is not registered,
            //2) the skope is not an object
            //3) the local skope is undefined
            if ( ! api.czr_skope.has( skope_id ) || ! _.isObject( api.czr_skope( skope_id )() ) || _.isUndefined( _localSkopeId ) )
              return '';

            var self = this,
                _skpLevel = api.czr_skope( skope_id )().skope,
                _inheritedFrom = self.getInheritedSkopeTitles(),
                _overrides = self.getOverridenSkopeTitles(),
                _localCtxTitle = api.czr_skope( _localSkopeId )().ctx_title,//<= the context title is always the one of the local skope
                current_title = api.czr_skope( skope_id )().long_title,//ex : Options for home
                _html;

            switch( _skpLevel ) {
                    case 'global' :
                          _html = [
                                serverControlParams.i18n.skope['The customizations made site wide are inherited by all other levels of customization.'],
                                '<br/>',
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized more specifically at the following level'] + '(s)',
                                ':',
                                _overrides + '.'
                          ].join(' ');
                    break;
                    case 'group' :
                          _html = [
                                serverControlParams.i18n.skope['The current customizations will be applied to'],
                                api.czr_skope( skope_id )().ctx_title.toLowerCase() + '.',
                                '<br/>',
                                serverControlParams.i18n.skope['The options not customized at this level will inherit their value from'],
                                _inheritedFrom,
                                '.<br/>',
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized more specifically at the following level'],
                                ':',
                                _overrides + '.'
                          ].join(' ');
                    break;
                    case 'local' :
                          _html = [
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized with a specific set of options.'],
                                '<br/>',
                                serverControlParams.i18n.skope['The options not customized at this level will inherit their value from'],
                                _inheritedFrom + '.'
                          ].join(' ');
                    break;
            }

            return $.trim( [
                  '<span class="czr-skope-bottom-infos">',
                    _html,
                    '</span>'
            ].join(' ') );

            // return $.trim( [
            //       '<span class="czr-skope-bottom-infos">',
            //         serverControlParams.i18n.skope['In this context :'],
            //         _.isEmpty( _inheritedFrom ) ? ' ' : serverControlParams.i18n.skope['inherits from'],
            //         _inheritedFrom,
            //         _.isEmpty( _inheritedFrom ) ? '' : _.isEmpty( _overrides ) ? '.' : [',' , serverControlParams.i18n.skope['and'] ].join(' '),
            //         _.isEmpty( _overrides ) ? ' ' : serverControlParams.i18n.skope['overridden by'],
            //         _overrides,
            //         _.isEmpty( _overrides ) ? '</span>' : '.</span>'
            // ].join(' ') );
      }
});//$.extend()
})( wp.customize , jQuery, _);