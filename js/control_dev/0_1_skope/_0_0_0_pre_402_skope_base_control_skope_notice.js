

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    //fired when a section is expanded
    //fired when a setting value is changed
    renderCtrlSkpNotIcon : function( controlIdCandidates ) {
          var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates];

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id );
                      ctrl.deferred.embedded.then( function() {
                            //RENDER TOGGLE ICON
                            if( $('.czr-toggle-notice', ctrl.container ).length )
                              return;

                            $.when( ctrl.container
                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                  .append( $( '<span/>', {
                                        class : 'czr-toggle-notice fa fa-info-circle',
                                        title : serverControlParams.i18n.skope['Display informations about the scope of this option.']
                                  } ) ) )
                            .done( function(){
                                  $('.czr-toggle-notice', ctrl.container).fadeIn( 400 );
                            });
                      });

                });

          });
    },


    //fired when a control notice is expanded
    updateCtrlSkpNot : function( controlIdCandidates, visible ) {
           var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates],
              _isSkoped = function( setId ) {
                    return setId && self.isSettingSkopeEligible( setId );
              },//filter only eligible ctrlIds

              _generateControlNotice = function( setId, _localSkopeId ) {
                    var _currentSkopeId         = api.czr_activeSkopeId(),
                        _inheritedFromSkopeId   = self.getInheritedSkopeId( setId, _currentSkopeId ),
                        _overridedBySkopeId     = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
                        _html = [],
                        _isCustomized,
                        _hasDBVal,
                        _ctxTitle;

                    //////////////////////
                    /// CASE 0 : not skoped
                    if ( ! _isSkoped( setId ) ) {
                          _html.push( [
                                serverControlParams.i18n.skope['This option is always customized sitewide and cannot be reset.']
                          ].join(' ') );
                          return _html.join(' | ');
                    }

                    //////////////////////
                    /// CASE 1
                    if ( _inheritedFromSkopeId == _overridedBySkopeId && api.czr_skope.has( _inheritedFromSkopeId ) && _currentSkopeId == _inheritedFromSkopeId ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dbValues()[setId] );

                          _ctxTitle = api.czr_skope( _inheritedFromSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          if ( _isCustomized ) {
                                if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                      _html.push( [
                                            serverControlParams.i18n.skope['Customized. Will be applied sitewide once published.'],
                                      ].join(' ') );
                                } else {
                                    _html.push( [
                                          serverControlParams.i18n.skope['Customized. Will be applied to'],
                                          '<strong>' + _ctxTitle + '</strong>',
                                          serverControlParams.i18n.skope['once published.']
                                    ].join(' ') );
                                }
                          } else {
                                if ( _hasDBVal ) {
                                      if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                            _html.push( [
                                                  serverControlParams.i18n.skope['Customized and applied sitewide.'],
                                            ].join(' ') );
                                      } else {
                                            _html.push( [
                                                  serverControlParams.i18n.skope['Customized and applied to'],
                                                  '<strong>' + _ctxTitle + '.' + '</strong>'
                                            ].join(' ') );
                                      }
                                } else {
                                      _html.push( serverControlParams.i18n.skope['Default website value applied sitewide.'] );
                                }
                          }
                    }


                    /////////////////////
                    /// CASE 2 : Skope is different than global, there is an inheritance
                    if ( _inheritedFromSkopeId !== _currentSkopeId && api.czr_skope.has( _inheritedFromSkopeId ) ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dbValues()[setId] );

                          _ctxTitle = api.czr_skope( _currentSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          if ( ! _isCustomized && ! _hasDBVal ) {
                                _html.push(
                                      [
                                            serverControlParams.i18n.skope['Default website value.'],
                                            serverControlParams.i18n.skope['You can customize this specifically for'],
                                            '<strong>' + _ctxTitle + '.' + '</strong>'
                                      ].join(' ')
                                );
                          } else {
                                _html.push(
                                      [
                                            serverControlParams.i18n.skope['Currently inherited from'],
                                            self.buildSkopeLink( _inheritedFromSkopeId ) + '.',
                                            serverControlParams.i18n.skope['You can customize this specifically for'],
                                            '<strong>' + _ctxTitle + '.' + '</strong>'
                                      ].join(' ')
                                );
                          }
                    }


                    /////////////////////
                    /// CASE 3
                    if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                          //is the setId customized or saved in the winner skope ?
                          //_hasDBVal = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dbValues()[setId] );
                          _isCustomized = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dirtyValues()[setId] );

                          _ctxTitle = api.czr_skope( _localSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          _html.push( [
                                ! _isCustomized ? serverControlParams.i18n.skope['The value currently applied to'] : serverControlParams.i18n.skope['The value that will be applied to'],
                                '<strong>' + _ctxTitle + '</strong>',
                                ! _isCustomized ? serverControlParams.i18n.skope['is set in'] : serverControlParams.i18n.skope['is customized in'],
                                self.buildSkopeLink( _overridedBySkopeId ),
                                serverControlParams.i18n.skope['which has a higher priority than the current option scope'],
                                '<strong>( ' + api.czr_skope( _currentSkopeId )().title + ' ).</strong>'
                          ].join(' ') );
                    }

                    return _html.join(' | ');
              };//_generateControlNotice


          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id ),
                          setId = api.CZR_Helpers.getControlSettingId( _id ),//get the relevant setting_id for this control
                          _visible = _.isUndefined( visible ) ? ( ctrl.czr_states && ctrl.czr_states( 'noticeVisible' )() ) : visible;

                      //Bail here if the ctrl notice is not set to visible
                      if ( ! _visible  )
                        return;

                      ctrl.deferred.embedded.then( function() {
                            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id,
                                $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length || _.isUndefined( _localSkopeId ) )
                              return;

                            try {
                                  _html = _generateControlNotice( setId, _localSkopeId );
                            } catch ( er ) {
                                  api.errorLog( '_generateControlNotice : ' + er );
                            }


                            var $skopeNoticeEl = $( '.czr-skope-notice', $noticeContainer );
                            if ( $skopeNoticeEl.length ) {
                                  $skopeNoticeEl.html( _html );
                            } else {
                                  $noticeContainer.append(
                                        [ '<span class="czr-notice czr-skope-notice">', _html ,'</span>' ].join('')
                                  );
                            }
                      });
                });
          });
    },//updateCtrlSkpNot

    // Utility
    // @return bool
    // @param ctrlId = string
    // When do we display the ctrl notice ?
    // 1) When the current skope is not global
    // 2) when the current skope is global AND is overriden by a local or group skope
    isCtrlNoticeVisible : function( ctrlId ) {
          if ( ! api.control.has( ctrlId ) )
            return false;

          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),//get the relevant setting_id for this control
              _currentSkopeId  = api.czr_activeSkopeId(),
              _overridedBySkopeId  = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
              _isSkoped = function( setId ) {
                    return setId && self.isSettingSkopeEligible( setId );
              };//filter only eligible ctrlIds

          if ( 'global' != api.czr_skope( _currentSkopeId )().skope ) {
                return true;
          } else if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                return true;
          }
          return false;
    },


    //@return void()
    removeCtrlSkpNot : function( controlIdCandidates ) {
          var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates];

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id );

                      ctrl.deferred.embedded.then( function() {
                            var $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length )
                              return;

                            var $skopeNoticeEl = $( '.czr-skope-notice', $noticeContainer );
                            if ( $skopeNoticeEl.length )
                                  $skopeNoticeEl.remove();
                      });
                });
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );