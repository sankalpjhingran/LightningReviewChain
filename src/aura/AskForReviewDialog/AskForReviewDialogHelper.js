({
    getReviewDetailsFromEmailLink : function(cmp, event, helper) {
    	var action = cmp.get("c.getReviewDetails");
        action.setParams({ reviewId : cmp.get("v.replyToReviewId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(response);
            if (state === "SUCCESS") {
            	cmp.set("v.reviewFromEmailLink", response.getReturnValue());    
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    submitReview : function(cmp, event, helper) {
    	var self = this;
        var action = cmp.get("c.createReview");
        console.log(cmp.get("v.receipientId"));
        
        if( cmp.get("v.isReplying") && cmp.get("v.reviewReply.User__c") != null) {
            cmp.set("v.review.User__c", cmp.get("v.reviewReply.User__c"));
        } else {
        	cmp.set("v.review.User__c", cmp.get("v.receipientId"));    
        }
        action.setParams({ review : cmp.get("v.review") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(response);
            if (state === "SUCCESS") {
                if(cmp.get("v.isReplying")) {
                    if(cmp.get("v.replyToReviewId")) {
                        cmp.set("v.replyToReview.isVisibleToReciepient__c", true);
                        cmp.set("v.replyToReview.Id", cmp.get("v.replyToReviewId"));
                        self.updateReview(cmp, event, helper, cmp.get("v.replyToReview"));
                    }
                } else {
                	self.closeModal(cmp, event, helper);    
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);	    
    },
	requestAReview : function(cmp, event, helper) {
        var self = this;
		var action = cmp.get("c.sendEmailForReview");
        action.setParams({ userid : cmp.get("v.review.User__c"), requestorid : cmp.get("v.requesterId"), message : cmp.get("v.message") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                self.closeModal(cmp, event, helper);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);	
	},
    closeModal: function(cmp, event, helper, modal){
    	var modal = cmp.find(modal);
        $A.util.removeClass(modal,'slds-fade-in-open');

        var backdrop = cmp.find("backdrop");
        $A.util.removeClass(backdrop,'slds-backdrop_open');
        
        if("v.isReplying") {
            window.close();
        } else {
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": cmp.get("v.requesterId"),
                "slideDevName": "detail"
            });
            navEvt.fire();    
        }
    },
    updateReview : function(cmp, event, helper, review) {
        
    	var action = cmp.get("c.updateReview");
        action.setParams({ review : review });
        
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                console.log('Success updating the review====>');
                window.close();
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    getReceipeintDetails : function(cmp, event, helper) {
    	var receipientId = cmp.get("v.receipientId");
        if( !receipientId ) {
        	receipientId = cmp.get("v.requesterId");    
        }
        cmp.set("v.receipientId", receipientId);
        
        console.log(receipientId);
        var action = cmp.get("c.getReceipient");
        action.setParams({ reciepientId : receipientId });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
				cmp.set("v.receipient", response.getReturnValue()[0]);
                cmp.set("v.reviewReply.User__r", response.getReturnValue()[0]);
                cmp.set("v.reviewReply.User__c", response.getReturnValue()[0].Id);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    getRecentlyViewed : function(cmp, event, helper) {
    	var action = cmp.get("c.getRecentlyViewedRecords");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
				cmp.set("v.recentlyViewedRecs", response.getReturnValue()); 
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})