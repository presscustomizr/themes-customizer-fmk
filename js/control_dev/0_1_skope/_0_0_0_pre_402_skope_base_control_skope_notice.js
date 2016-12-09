

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
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
                                        title : 'Display informations about the scope of this option.'//@to_translate
                                  } ) ) )
                            .done( function(){
                                  $('.czr-toggle-notice', ctrl.container).fadeIn( 400 );
                            });
                      });

                });

          });
    },


    //fired when a control notice is expanded
    updateCtrlSkpNot : function( controlIdCandidates ) {
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
                        _hasDBVal;

                    //////////////////////
                    /// CASE 0 : not skoped
                    if ( ! _isSkoped( setId ) ) {
                          _html.push( [
                                "This option is always customized site wide and can't be reset.",//@to_translate
                          ].join(' ') );
                          return _html.join(' | ');
                    }

                    //////////////////////
                    /// CASE 1
                    if ( _inheritedFromSkopeId == _overridedBySkopeId && api.czr_skope.has( _inheritedFromSkopeId ) && _currentSkopeId == _inheritedFromSkopeId ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dbValues()[setId] );

                          if ( _isCustomized ) {
                                if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                      _html.push( [
                                            'Customized. Will be published site wide.',//@to_translate
                                      ].join(' ') );
                                } else {
                                    _html.push( [
                                          'Customized. Will be published for :',//@to_translate
                                          api.czr_skope( _inheritedFromSkopeId )().title
                                    ].join(' ') );
                                }
                          } else {
                                if ( _hasDBVal ) {
                                      if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                            _html.push( [
                                                  'Customized and published site wide.',//@to_translate
                                            ].join(' ') );
                                      } else {
                                            _html.push( [
                                                  'Customized and published for :',//@to_translate
                                                  api.czr_skope( _inheritedFromSkopeId )().title
                                            ].join(' ') );
                                      }
                                } else {
                                      _html.push( 'Default website value published site wide.' );//@to_translate
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
                                _html.push( 'Default website value' );//@to_translate
                          } else {
                                _html.push( 'Inherited from : ' + self.buildSkopeLink( _inheritedFromSkopeId ) );//@to_translate
                          }
                    }



                    /////////////////////
                    /// CASE 3
                    if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                          //is the setId customized or saved in the winner skope ?
                          //_hasDBVal = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dbValues()[setId] );
                          _isCustomized = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dirtyValues()[setId] );

                          _html.push( [
                                ! _isCustomized ? 'The value currently published for' : 'The value that will be published for',//@to_translate
                                api.czr_skope( _localSkopeId )().title,
                                ! _isCustomized ? 'is set in scope :' : 'is customized in scope :',//@to_translate
                                self.buildSkopeLink( _overridedBySkopeId ),
                                ! _isCustomized ? ', because it has a higher priority than this one.' : ', and will override this one once published because it has a higher priority.',//@to_translate
                          ].join(' ') );
                    }

                    return _html.join(' | ');
              };

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id ),
                          setId = api.CZR_Helpers.getControlSettingId( _id );//get the relevant setting_id for this control

                      //Bail here if the ctrl notice is not set to visible
                      if ( ! _.has( ctrl, 'czr_states' ) || ! ctrl.czr_states('noticeVisible')() )
                        return;

                      ctrl.deferred.embedded.then( function() {
                            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id,
                                $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length || _.isUndefined( _localSkopeId ) )
                              return;

                            _html = _generateControlNotice( setId, _localSkopeId );

                            //console.log('Generate control notice', setId, _html );
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