sap.ui.define( [
  "me/reichwald/pages/index/ControllerBase",
  "sap/ui/model/json/JSONModel",
], function( ControllerBase, JSONModel )
{
  "use strict";
  
  return ControllerBase.extend( "me.reichwald.pages.index.controller.pages.Home", {
    
    onInit: function()
    {
      ControllerBase.prototype.onInit.apply( this, arguments );
    }
    
  });
} )
