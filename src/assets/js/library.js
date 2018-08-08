export const library = {
  messagesHaveFeed(messages, feed) {
    if (feed == undefined || feed.fed_id == undefined)
      return false;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].fed_id == undefined) {
        return false;
      }
      if (messages[i].fed_id == feed.fed_id) {
        return true;
      }
    }
    return false;
  }
};
