sap.ui.define([
  "jquery.sap.global"
], function( $ )
{
  var AccordionRenderer = {};
  
  AccordionRenderer.render = function( renderManager, control )
  {
    this.startAccordion( renderManager, control );
    
    this.renderHeader( renderManager, control );
    
    this.renderContent( renderManager, control );
    
    this.endAccordion( renderManager );
  }
  
  AccordionRenderer.startAccordion = function( rm, control )
  {
    rm.write( "<section" );
    
    rm.addClass( "sapMPanel" );
    rm.addClass( "comCproMrdControlsAccordion" );
    rm.addClass( "sapUiNoContentPadding" );
    rm.addStyle( "width", control.getWidth() );
    rm.addStyle( "height", control.getHeight() );
    
    rm.writeAccessibilityState( control, {
      role: 'form',
      labelledBy: control._getLabellingElementId()
    });
    rm.writeControlData( control );
    rm.writeClasses();
    rm.writeStyles();
    
    rm.write( ">" );
  };
  
  AccordionRenderer.renderHeader = function( rm, control )
  {
    var expandable = control.getExpandable();
    var expanded = control.getExpanded();
    var headerToolbar = control.getHeaderToolbar();
    var headerClass;
    
    if ( expandable )
    {
      rm.write( "<header" );
      
      headerClass = headerToolbar ? "sapMPanelWrappingDivTb" : "sapMPanelWrappingDiv";
      rm.addClass( headerClass );
      
      if ( expanded )
        rm.addClass( headerClass + 'Expanded' );
      
      rm.writeClasses();
      rm.write( ">" );
      
      var icon = control._getIcon();
      
      icon[ ( expanded ? 'add' : 'remove' ) + 'StyleClass' ]( "sapMPanelExpandableIconExpanded" );
      
      rm.renderControl( icon );
    }
    
    var headerText = control.getHeaderText();
    if ( headerToolbar )
    {
      headerToolbar.setDesign( sap.m.ToolbarDesign.Transparent, true );
      rm.renderControl( headerToolbar );
    }
    else if ( headerText || expandable )
    {
      rm.write( "<h1" );
      rm.addClass( "sapMPanelHdr" );
      rm.writeClasses();
      rm.writeAttribute( "id", control.getId() + '-header' );
      rm.write( ">" );
      rm.writeEscaped( headerText );
      rm.write( "</h1>" );
    }
    
    if ( expandable )
      rm.write( "</header>" );
    
    var infoToolbar = control.getInfoToolbar();
    
    if ( infoToolbar )
    {
      if ( expandable )
        infoToolbar.addStyleClass( "sapMPanelExpandablePart" );
      
      infoToolbar.setDesign( sap.m.ToolbarDesign.Info, true );
      rm.renderControl( infoToolbar );
    }
    
  };
  
  AccordionRenderer.renderContent = function( rm, control )
  {
    this.startContent( rm, control );
    this.renderChildren( rm, control.getContent() );
    this.endContent( rm );
  };
  
  AccordionRenderer.startContent = function( rm, control )
  {
    rm.write( "<div" );
    rm.addClass( "sapMPanelContent" );
    rm.addClass( "sapMPanelBG" + control.getBackgroundDesign() );
    
    if ( control.getExpandable() )
      rm.addClass( "sapMPanelExpandablePart" );
    
    rm.writeClasses();
    rm.write( ">" );
  };
  
  AccordionRenderer.renderChildren = function( rm, children )
  {
    children.forEach( rm.renderControl );
  };
  
  AccordionRenderer.endContent = function( rm )
  {
    rm.write( "</div>" );
  };
  
  AccordionRenderer.endAccordion = function( rm )
  {
    rm.write( "</section>" );
  };
  
  return AccordionRenderer;
})