var nem = require("nem-sdk").default;
 let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);
 let common = nem.model.objects.create('common')('1234', '8f6306b7590e3b0eee6fe7e1c829580530c48f86a5eebd3acc11f994af42e939');
 let transferTransaction = nem.model.objects.create('transferTransaction')('8f6306b7590e3b0eee6fe7e1c829580530c48f86a5eebd3acc11f994af42e939',0,'asd');
 let preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);
 nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
     console.log(res);
 }, function(err){
     console.log(err);
 })