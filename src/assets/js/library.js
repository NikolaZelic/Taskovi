export const library = {
    messagesHaveFeed(messages, feed){
        for(let i=0; i<messages.length; i++){
            if( messages[i].fed_id == feed.fed_id ){
                return true;
            }
               
        }
        return false;
    }
};
