({
	initComponent : function(cmp, event, helper) {
        var self = this;
        self.getProfileUserDetails(cmp, event, helper);		
	},
    updateReviewItems : function(cmp, event, helper, reviews) {
        
    	var action = cmp.get("c.updateReviews");
        action.setParams({ reviews : reviews });

        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                //If the request is successful, close the modal and go back
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
    getProfileUserDetails : function(cmp, event, helper) {
    	var action = cmp.get("c.getUserProfile");
        action.setParams({ userId : cmp.get("v.recordId") });

        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
                cmp.set("v.userProfile", response.getReturnValue()[0]);
                cmp.set("v.loggedInUser", response.getReturnValue()[1]);
                
                var action = cmp.get("c.getReviews");
                action.setParams({ userId : cmp.get("v.recordId")});
                action.setCallback(this, function(responseReviews) {
                    var state = responseReviews.getState();
                    if (state === "SUCCESS") {
                        console.log(responseReviews.getReturnValue());
                        var userProfile = undefined;
                        var loggedInUser = undefined;
                        
                        var user1 = undefined;
                        var user2 = undefined;
                        
                        if(response.getReturnValue().length == 1) {
                        	//Length is 1 means loggedin user is same profile user
                        	userProfile = response.getReturnValue()[0];
                            loggedInUser = response.getReturnValue()[0]
                        } else if(response.getReturnValue().length == 2) {
                            user1 = response.getReturnValue()[0];
                        	user2 = response.getReturnValue()[1];
                            
                            if(user1.Id == cmp.get("v.recordId")) {
                                //user1 is the record being viewed
                                userProfile = user1;
                                loggedInUser = user2;
                            } else if ( user2.Id == cmp.get("v.recordId") ) {
                                //user2 is the record being viewed
                                userProfile = user2;
                                loggedInUser = user1;
                            }
                        }
                        
                        console.log(userProfile);
                        console.log(loggedInUser);
                        
                        var isProfileUserLoggedIn = false;
                        var isManagerLoggedIn = false;
                        var areOthersLoggedIn = false;
                        if(userProfile.Id == loggedInUser.Id) {
                            cmp.set("v.isLoggedInUser", true);
                            isProfileUserLoggedIn = true;
                            console.log('Profile user logged in===>');
                        } else if(userProfile.ManagerId == loggedInUser.Id) {
                            console.log('Manager logged in===>');
                        	isManagerLoggedIn = true;    
                        } else{
                            console.log('Other logged in===>');
                            areOthersLoggedIn = true;
                        }
                        
                        var reviewsForLoggedInUser = [];
                        var reviewsForManager = [];
                        var reviewsForOthers = [];
                        
                        for (var item in responseReviews.getReturnValue()) {
                            	var itemValue = responseReviews.getReturnValue()[item];
                                reviewsForManager.push(itemValue);
                                if(itemValue.isVisibleToReciepient__c) {
                                	reviewsForLoggedInUser.push(itemValue);    
                                }
                                if(itemValue.isPublic__c && itemValue.isVisibleToReciepient__c) {
                                    console.log(itemValue);
                                    reviewsForOthers.push(itemValue);    
                                } 
                        }
                        
                        console.log(isProfileUserLoggedIn);
                        console.log(isManagerLoggedIn);
                        if(isProfileUserLoggedIn) {
                            console.log(reviewsForLoggedInUser);
                            cmp.set("v.reviews", reviewsForLoggedInUser);    
                        } else if(isManagerLoggedIn) {
                            console.log('Setting reviews for manager====>');
                            console.log(reviewsForManager);
                            cmp.set("v.reviews", reviewsForManager);
                        } else if(areOthersLoggedIn) {
                            cmp.set("v.reviews", reviewsForOthers);
                        } 
                        console.log(cmp.get("v.reviews"));
                    }
                    else if (state === "INCOMPLETE") {
                        // do something
                    }
                    else if (state === "ERROR") {
                        var errors = responseReviews.getError();
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
                //If the request is successful, close the modal and go back
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