module.exports = function (hoodie, done) {
    hoodie.task.on('directmessage:add', handleNewMessage);

    function handleNewMessage(originDb, message) {
        var recipient = message.to;

        // workaround to ensure the task will be found when calling success
        var id = message.id;
        var type = message.type;

        hoodie.account.find('user', recipient,
            function (error, user) {
                if (error) {
                    return hoodie.task.error(originDb, message, error);
                }
                ;
                var targetDb = 'user/' + user.hoodieId;

		// workaround to prevent document update conflicts
		delete message._id;
		delete message._rev;

                hoodie.database(targetDb).add('directmessage',
                    message,
                    function (error, message) {
                        if (error) {
                            return hoodie.task.error(originDb, message, error);
                        }

                        // resetting id and type to identify the original task
                        message.id = id;
                        message.type = type;

                        return hoodie.task.success(originDb, message);
                    });
            });
    };

    done();
};
