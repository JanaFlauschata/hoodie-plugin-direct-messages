Hoodie.extend(function(hoodie) {
  
  function send( messageData ) {
    var defer = hoodie.defer();

    hoodie.task.start('directmessage', messageData)
    .done( function(messageTask) {
      hoodie.task.on('remove:directmessage:'+messageTask.id, defer.resolve);
      hoodie.task.on('error:directmessage:'+messageTask.id, defer.reject);
    })
    .fail( defer.reject );

    return defer.promise();
  }
  
  function findAll(){
    var defer = hoodie.defer();
    hoodie.store.findAll('message')
    .done(defer.resolve)
    .fail(defer.reject)

    return defer.promise();
  }
  
  function on( eventName, callback ) {
    hoodie.task.on( eventName + ':directmessage', callback);
  }

  hoodie.directMessages = {
    send: send,
    findAll: findAll,
    on: on
  }
});