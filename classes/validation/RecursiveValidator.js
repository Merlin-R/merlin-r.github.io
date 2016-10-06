sap.ui.define([
  "sap/ui/core/Component",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  
  "sap/ui/core/Control",
  "sap/ui/layout/form/FormContainer",
  "sap/ui/layout/form/FormElement"
], function( Component, MessageToast, MessageBox, Control, FormContainer, FormElement )
{
  
  return Component.extend( "com.cpro.mrd.validation.RecursiveValidator",
  {
    
    metadata: {
      
      publicMethods: [ "validate" ],
      
      final: true,
      
      properties: {
        
        depth: {
          type:         "int",
          defaultValue: -1
        },
        
        control: {
          type:         "sap.ui.Control",
          defaultValue: null
        },
        
        errorState: {
          type:         "string",
          defaultValue: "Error"
        },
        
        successState: {
          type:         "string",
          defaultValue: "None"
        },
        
        changeValueState: {
          type:         "boolean",
          defaultValue: true
        },
        
        errorMessage: {
          type:         "string",
          defaultValue: null
        },
        
        errorMessageType: {
          type:         "string",
          defaultValue: "Control"
        },
        
        validatedAggregations: {
          type:         "string[]",
          defaultValue: [ "items", "content", "form", "formContainers", "formElements", "fields" ]
        },
        
        validatedProperties: {
          type:         "string[]",
          defaultValue: [ "value", "selectedKey", "text" ]
        },
        
      }
    },
    
    validate: function( control, depth )
    {
      if ( !control )
        if ( !( control = this.getControl() ) )
          throw new Error({ message: 'No control assigned for validation.' });
      
      depth = depth === null || depth === undefined ? this.getDepth() : depth;
      
      if ( depth === -2 ) return true;
      if ( depth  >   0 ) depth--;
      if ( depth ===  0 ) depth = -2;
      
      var validated, binding, currentAggregation, valid = true;
      
      if ( control instanceof Control || control instanceof FormContainer || control instanceof FormElement )
      {
        if ( control.getVisible() )
        {
          this.getValidatedProperties().forEach( (function( property )
          {
            if ( binding = control.getBinding( property ) ) if ( binding.getType )
              try {
                if ( binding.getType() && binding.getType().validateValue )
                  binding.getType().validateValue( control.getProperty( property ) );
                this._setValueState( control );
              } catch ( ex )
              {
                valid = false;
                this._setValueState( control, ex );
              } finally {
                validated = true;
              }
          }).bind( this ) );
        }
        if ( !validated )
        {
          this.getValidatedAggregations().forEach( (function( aggregation )
          {
            if ( currentAggregation = control.getAggregation( aggregation ) )
            {
              if ( currentAggregation instanceof Array )
                currentAggregation.forEach( (function( currentControl )
                {
                  if ( !this.validate( currentControl, depth ) ) valid = false;
                }).bind( this ) );
              else
                if ( !this.validate( currentAggregation , depth ) ) valid = false;
            }
          }).bind( this ) );
        }
      }
      return valid;
    },
    
    _setValueState: function( control, error )
    {
      
      if ( this.getChangeValueState && control.setValueState )
        control.setValueState( error ? this.getErrorState() : this.getSuccessState() );
      if ( error )
        switch ( this.getErrorMessageType() )
        {
          case 'Control':
            if ( control.setValueStateText )
              control.setValueStateText( error.message );
            break;
          case 'MessageToast':
            MessageToast.show( error.message );
            break;
          case 'MessageBox':
            MessageBox.alert( error.message );
        }
    }
  });
});
