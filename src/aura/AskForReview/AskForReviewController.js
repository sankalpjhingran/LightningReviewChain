({
	handleClick : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:AskForReviewDialog",
            componentAttributes: {
                requesterId : component.get("v.recordId")
            }
        });
        evt.fire();	
	}
})