export const library = {
    messagesHaveFeed(messages, feed){
        // console.log(feed);
        if(feed==undefined||feed.fed_id==undefined)
            return false;
        for(let i=0; i<messages.length; i++){
            if(messages[i].fed_id==undefined){
                // console.log('Doesn"t have it it');
                return false;
            }
            if( messages[i].fed_id == feed.fed_id ){
                // console.log('Have it');
                return true;
            }
               
        }
        return false;
    }
};
