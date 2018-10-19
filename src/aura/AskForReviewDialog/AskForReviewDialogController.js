({
    doInit : function(cmp, event, helper) {
        helper.getReceipeintDetails(cmp, event, helper);
        helper.getRecentlyViewed(cmp, event, helper);
        
        if(cmp.get("v.isReplying")) {
            helper.getReviewDetailsFromEmailLink(cmp, event, helper);
        }
    },
	closeAskReviewModal : function(component, event, helper) {
		helper.closeModal(component, event, helper, 'askareviewdialog');	
	},
    closeWriteReviewModal : function(component, event, helper) {
		helper.closeModal(component, event, helper, 'writereviewdialog');	
	},
    requestReview : function(component, event, helper) {
    	helper.requestAReview(component, event, helper);    
    },
    updateTopic : function(cmp, event, helper) {
        console.log('Calling updateTopic====>');
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.review;
        var reviewItem = cmp.get("v.recentlyViewedRecs")[index];
        var userReciepient = cmp.get("v.receipient");
        cmp.set("v.review.Topic__c", reviewItem.RecordType.Name + ': ' + reviewItem.Name);        
    },
    submitReview: function(cmp, event, helper) {
    	helper.submitReview(cmp, event, helper);    
    },
    updateReceipient : function(cmp, event, helper) {
        console.log('Calling updateReceipient====>');
        cmp.set("v.receipientId", cmp.get("v.reviewReply.User__c"));
    	helper.getReceipeintDetails(cmp, event, helper);    
    }
    
})