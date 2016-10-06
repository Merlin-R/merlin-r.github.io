sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/resource/ResourceModel",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device",
], function( UIComponent, ResourceModel, JSONModel, Device ) {
  
  return UIComponent.extend( "me.reichwald.pages.index.Component", {
    
    metadata : {
      manifest: "json"
    },
    
    init : function()
    {
      UIComponent.prototype.init.apply( this, arguments );
      
      var readOnlyModels = this.getReadOnlyModelMapping();
      
      for ( var name in readOnlyModels )
        this.setModel( new JSONModel( readOnlyModels[ name ] ).setDefaultBindingMode( 'OneWay' ), name );
      
      this.getRouter().initialize();
    },
    
    getReadOnlyModelMapping: function()
    {
      return {
        'Device': Device,
        'Application': './models/Applications.json'
      };
    }
    
  });
  
});

