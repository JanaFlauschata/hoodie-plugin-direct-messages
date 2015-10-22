module.exports = function(hoodie, done) {
  hoodie.task.on('directmessage:add', handleNewMessage);

  function handleNewMessage(originDb, message) {
    var recipient = message.to;
    hoodie.account.find('user', recipient,
    function(error, user) {
      if (error) {
        return hoodie.task.error(originDb, message, error);
      };
      var targetDb = 'user/' + user.hoodieId;

	//delete message._id;
	//delete message._rev;

      hoodie.database(targetDb).add('directmessage',
      message,
      function addMessageCallback(error, message) {
    if(error){
        return hoodie.task.error(originDb, message, error);
    }
    return hoodie.task.success(originDb, message);
  });
    });
  };

  done();
};
