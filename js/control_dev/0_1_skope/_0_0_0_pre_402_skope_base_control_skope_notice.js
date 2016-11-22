

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //fired when a section is expanded
    //fired when a setting value is changed
    renderControlSkopeNotice : function( controls ) {
          var self = this,
              controlIds = _.isArray(controls) ? controls : [controls],
              _buildSkopeLink = function( skope_id ) {
                    return [ '<span class="czr-skope-switch" data-skope-id="' + skope_id + '">', api.czr_skope( skope_id )().title, '</span>' ].join( '' );
              },
              _generateControlNotice = function( setId, _localSkopeId ) {
                    var _currentSkopeId         = api.czr_activeSkopeId(),
                        _inheritedFromSkopeId   = self.getInheritedSkopeId( setId, _currentSkopeId ),
                        _overridedBySkopeId     = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
                        _html = [],
                        _isCustomized,
                        _hasDBVal;

                    //////////////////////
                    /// CASE 1
                    if ( _inheritedFromSkopeId == _overridedBySkopeId && api.czr_skope.has( _inheritedFromSkopeId ) && _currentSkopeId == _inheritedFromSkopeId ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dbValues()[setId] );

                          if ( _isCustomized ) {
                                if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                      _html.push( [
                                            'Customized. Will be published site wide.',
                                      ].join(' ') );
                                } else {
                                    _html.push( [
                                          'Customized. Will be published for :',
                                          api.czr_skope( _inheritedFromSkopeId )().title
                                    ].join(' ') );
                                }
                          } else {
                                if ( _hasDBVal ) {
                                      if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                            _html.push( [
                                                  'Customized and published site wide.',
                                            ].join(' ') );
                                      } else {
                                            _html.push( [
                                                  'Customized and published for :',
                                                  api.czr_skope( _inheritedFromSkopeId )().title
                                            ].join(' ') );
                                      }
                                } else {
                                      _html.push( 'Default website value published site wide.' );
                                }
                          }
                    }


                    /////////////////////
                    /// CASE 2
                    if ( _inheritedFromSkopeId !== _currentSkopeId && api.czr_skope.has( _inheritedFromSkopeId ) ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dbValues()[setId] );
                          if ( ! _isCustomized && ! _hasDBVal ) {
                                _html.push( 'Default website value' );
                          } else {
                                _html.push( 'Inherited from : ' + _buildSkopeLink( _inheritedFromSkopeId ) );
                          }
                    }



                    /////////////////////
                    /// CASE 3
                    if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                          //is the setId customized or saved in the winner skope ?
                          //_hasDBVal = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dbValues()[setId] );
                          _isCustomized = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dirtyValues()[setId] );

                          _html.push( [
                                ! _isCustomized ? 'The value currently published for' : 'The value that will be published for',
                                api.czr_skope( _localSkopeId )().title,
                                ! _isCustomized ? 'is set in scope :' : 'is customized in scope :',
                                _buildSkopeLink( _overridedBySkopeId )
                          ].join(' ') );
                    }

                    return _html.join(' | ');
              };

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id ),
                          setId = api.CZR_Helpers.getControlSettingId( _id );//get the relevant setting_id for this control

                      ctrl.deferred.embedded.then( function() {
                            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id,
                                $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length || _.isUndefined( _localSkopeId ) )
                              return;

                            _html = _generateControlNotice( setId, _localSkopeId );

                            // if ( _.isEmpty( _html ) ) {
                            //       $noticeContainer
                            //             .stop()
                            //             .slideUp( 'fast', null, function() {
                            //                   $( this ).css( 'height', 'auto' );
                            //             } );
                            // } else {
                            //       $noticeContainer
                            //             .stop()
                            //             .slideDown( 'fast', null, function() {
                            //                   $( this ).css( 'height', 'auto' );
                            //             } );
                            // }

                            if ( $( '.czr-skope-notice', $noticeContainer ).length ) {
                                  $( '.czr-skope-notice', $noticeContainer ).html( _html );
                            } else {
                                  $noticeContainer.append(
                                        [ '<span class="czr-notice czr-skope-notice">', _html ,'</span>' ].join('')
                                  );
                            }

                            //RENDER TOGGLE ICON
                            if( $('.czr-toggle-notice', ctrl.container ).length )
                              return;

                            $.when( ctrl.container
                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                  .append( $( '<span/>', {
                                        class : 'czr-toggle-notice fa fa-info-circle',
                                        title : 'Display informations about the scope of this option.'
                                  } ) ) )
                            .done( function(){
                                  $('.czr-toggle-notice', ctrl.container).fadeIn( 400 );
                            });
                      });

                });

          });
    }
});//$.extend()