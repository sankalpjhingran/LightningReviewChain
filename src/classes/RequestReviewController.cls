public WITH SHARING class RequestReviewController {
    @AuraEnabled
    public static String sendEmailForReview(String userid, String requestorid, String message) {
    	Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {[SELECT email FROM User WHERE id =: userid LIMIT 1][0].email};
		mail.setToAddresses(toAddresses);
        String username = [SELECT firstname FROM User WHERE id =: userid LIMIT 1][0].firstname;
        mail.setSenderDisplayName([SELECT name FROM User WHERE id =: requestorid LIMIT 1][0].name);
        mail.setSubject('ReviewChain: Requesting a review');
        mail.setHtmlBody('<p>' + message + '</p>' +
                         '<br></br>'+
                         '<a href="'+ System.URL.getSalesforceBaseUrl().toExternalForm() + '/apex/writeReviewRedirect?receipientId='+ UserInfo.getUserId() + '">Click here to write a review for me</a><br></br>'
						);
		Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });        
        return 'Msg Sent';
    }
    
    @AuraEnabled
    public static List<Review__c> getReviews(String userId) {
    	return [SELECT 	Id,
               			Review__c,
               			Name,
                		isPublic__c,
                		CreatedBy.Title,
                		CreatedDate,
                		CreatedBy.Name,
                		CreatedById,
                		CreatedBy.SmallPhotoUrl,
                		User__r.ManagerId,
                		Reaction__c,
                		isVisibleToReciepient__c,
                		Topic__c
                	FROM Review__c
                	WHERE User__c =: userId
                	ORDER BY CreatedDate DESC 
               ];	    
    }
    
    @AuraEnabled
    public static Review__c getReviewDetails(String reviewId) {
    	return [SELECT 	Id,
               			Review__c,
               			Name,
                		isPublic__c,
                		CreatedBy.Title,
                		CreatedDate,
                		CreatedBy.Name,
                		CreatedById,
                		CreatedBy.SmallPhotoUrl,
                		User__r.ManagerId,
                		Reaction__c,
                		isVisibleToReciepient__c,
                		Topic__c
                	FROM Review__c
                	WHERE Id =: reviewId
                	LIMIT 1][0];	    
    }
    
    @AuraEnabled
    public static void updateReviews(List<Review__c> reviews) {
    	update reviews;   
    }
    
    @AuraEnabled
    public static void updateReview(Review__c review) {
    	update review;   
    }
    
    @AuraEnabled
    public static void createReview(Review__c review) {
        System.debug(review);
    	insert review;
        
        review = [SELECT Topic__c, Reaction__c, Review__c, CreatedById, User__c FROM Review__c WHERE Id =: review.Id LIMIT 1][0];
        User reciepient = [SELECT email FROM User WHERE id =: review.User__c LIMIT 1][0];
        User reviewer = [SELECT name FROM User WHERE id =: review.CreatedById LIMIT 1][0];
        List<String> reviewMessageList = review.Review__c.split(' ');
        List<String> firstFiveWords = new List<String>();
        Integer i = 0;
        for(String word : reviewMessageList) {
        	firstFiveWords.add(word);
            i++;
            if(i == 4) {
            	break;    
            }
        }

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {reciepient.email};
		mail.setToAddresses(toAddresses);
        mail.setSenderDisplayName(reviewer.name);
        
        mail.setSubject('You Have a Review From ' + reviewer.Name + '! ' + String.join(firstFiveWords, ' ') + '...');
        mail.setHtmlBody(	 '<p>Good News! ' + reviewer.Name +  ' left you a review.<p>' +
                             '<p>TOPIC: ' + review.Topic__c + '</p>' + 
                         	 '<p>REVIEW: ' + String.join(firstFiveWords, ' ') + '...' + '</p>' + 	
                             '<p><b>Where is the rest of the review?</b></p>' +
                             '<p>To read the review, you need to write a review for someone else.</p>' +
                             '<a href="'+ System.URL.getSalesforceBaseUrl().toExternalForm() + '/apex/writeReviewRedirect?receipientId='+ review.CreatedById + '&replyToReviewId=' + review.Id + '">Write a Review</a><br></br>' +
                             '<a href="'+ System.URL.getSalesforceBaseUrl().toExternalForm() + '/_ui/core/userprofile/UserProfilePage?tab=sfdc.ProfilePlatformFeed' + '">Review Link</a>' +
                             '<p>Happy Reviewing!</p>' +
                         	 '<p>ReviewChain Team</p>'
                        );
		Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); 
		
    }
    
    @AuraEnabled
    public static List<RecentlyViewed> getRecentlyViewedRecords() {
        return [
            	SELECT 	Id,
            		   	Name,
            		   	RecordType.Name,
            			Type,
            			Title
            		FROM RecentlyViewed
            		WHERE Type IN ('Case', 'ADM_Work__c')
            		LIMIT 10
        		];
    }
        
    @AuraEnabled
    public static List<User> getReceipient(String reciepientId) {
        return [
            	SELECT 	Id,
            		   	Name,
            		   	FirstName,
            			LastName,
            			Title
            		FROM User
            		WHERE Id =: reciepientId 
            		LIMIT 1
        		];
    }
    
    @AuraEnabled
    public static List<User> getUserProfile(String userId) {
        return [
            	SELECT 	Id,
            		   	Name,
            		   	FirstName,
            			LastName,
            			Title,
            			ManagerId
            		FROM User
            		WHERE Id =: userId
            		OR Id =: UserInfo.getUserId() 
            		LIMIT 2
        		];
    }
}