const graphqlHttp = require('graphql-request'); 
const fs = require('fs');

console.log('Iniciado API');

const client = new graphqlHttp.GraphQLClient('https://api.monday.com/v2/', {
    headers: {
      Authorization: '',
    },
  });

const boards = [];

const queryList = `query {
            boards(limit:25){
                id name state 
                owner {
                    id name
                }   
            }
        }`;
client.request(queryList)
        .then(data => {
            for (let index = 0; index < data.boards.length; index++) {
                var name = data.boards[index].owner.name;
                console.log(name);
                if(name == 'vinicius.belnuovo@copastur.com.br')
                    boards.push(data.boards[index].id);
            }

            console.log(boards.length);
            for (let j = 0; j < boards.length; j++) {
                var id = boards[j];
                
            
                const queryBoard =  `query {
                    boards (ids: `+ id + `) {
                        id name state                         
                        groups {id title items{id name  } }
                    }
                    }`;
                
                client.request(queryBoard)
                    .then(data => {
                        console.log('Recuperando o board: ' + id);

                        let json = JSON.stringify(data);
                        // console.log(json);
                        fs.writeFile('board_'+ id +'.json', json, function(err){
                            if(err) console.log(err);
                            console.log('Arquivo salvo');
                        });
                        // console.log(data);
                        
                        if(data.boards[0].groups.length > 0){
                            var groups = data.boards[0].groups;
                            for (let index = 0; index < groups.length; index++) {
                                const group = groups[index];
                                if(group.items.length > 0){
                                    for (let k = 0; k < group.items.length; k++) {
                                        const queryItems = `
                                            query{
                                                items(ids:`+group.items[k].id+`){
                                                    id name state 
                                                    board {
                                                        id name
                                                    } 
                                                    group {
                                                        id title
                                                    }
                                                    creator {
                                                        id name
                                                    } 
                                                    column_values {
                                                        id title value 
                                                    }  
                                                }
                                            }`;
                                        
                                        client.request(queryItems)
                                            .then(itemData => {
                                                console.log('Recuperando o item:' + itemData.items[0].id);
                                                let json = JSON.stringify(itemData);
                                                fs.writeFile('items_'+itemData.items[0].id+'.json', json, function(err){
                                                    if(err) console.log(err);
                                                    console.log('Arquivo salvo');
                                                });
                                            })
                                            .catch(console.error);
                                    }
                                }
                                
                            }
                        }                                                                            
                    })
                    .catch(console.error);
                }
        })
        .catch(console.error);



