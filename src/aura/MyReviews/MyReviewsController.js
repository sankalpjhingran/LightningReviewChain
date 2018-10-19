({
    doInit : function(component, event, helper) {
    	helper.initComponent(component, event, helper);    
    },
    updateReview : function(component, event, helper) {
        helper.updateReviewItems(component, event, helper, component.get("v.reviews"));
    },
	requestAReview : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:AskForReviewDialog",
            componentAttributes: {
                isRequest : true,
                requesterId : component.get("v.recordId")
            }
        });
        evt.fire();	
	},
    writeAReview : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:AskForReviewDialog",
            componentAttributes: {
                isRequest : false,
                requesterId : component.get("v.recordId"),
            }
        });
        evt.fire();	
	},
    createRecord : function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Review__c",
    		"defaultFieldValues": {
        		'User__c' : component.get("v.recordId")
    		}
        });
        createRecordEvent.fire();
    }
})