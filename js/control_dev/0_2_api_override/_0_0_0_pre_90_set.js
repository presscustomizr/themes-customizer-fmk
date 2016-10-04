
(function (api, $, _) {
  if ( ! serverControlParams.isSkopOn )
    return;
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
})( wp.customize , jQuery, _ );