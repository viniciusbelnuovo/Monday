const graphqlHttp = require('graphql-request'); 
const fs = require('fs');

console.log('Iniciado API');

const client = new graphqlHttp.GraphQLClient('https://api.monday.com/v2/', {
    headers: {
      Authorization: '',
    },
  });

const boardsId = [];

const queryList = `query {
    boards(limit:25){
        id name state 
        owner {
            id name
        }   
    }
}`;
let getBoards = async function(query){
    
    await client.request(query)
        .then(data => {
             
            for (let index = 0; index < data.boards.length; index++) {
                var name = data.boards[index].owner.name;                
                if(name == 'vinicius.belnuovo@copastur.com.br')
                    boardsId.push(data.boards[index].id);
            }
        })
        .catch(console.error);
};

let getBoardById = async function (id){
    const queryBoard =  `query {
                            boards (ids: `+ id + `) {
                                id name state                         
                                groups {id title items{id name  } }
                            }
                        }`;
    return await client.request(queryBoard)
            .then(data => {
                let json = JSON.stringify(data);
                let items = [];
                if(data.boards[0].groups.length > 0){
                    var groups = data.boards[0].groups;
                    for (let index = 0; index < groups.length; index++) {
                        const group = groups[index];
                        if(group.items.length > 0){
                            for (let k = 0; k < group.items.length; k++) {
                                items.push(group.items[k].id);
                            }
                        }
                    }
                    return items;
                }
            })
            .catch(console.error);
}

let getItems = async function (id){
    const queryItems = `
                        query{
                            items(ids:`+id+`){
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
    await client.request(queryItems)
        .then(itemData => {
            console.log('Recuperando o item:' + itemData.items[0].id);
            // let json = JSON.stringify(itemData);
            // fs.writeFile('items_'+itemData.items[0].id+'.json', json, function(err){
            //     if(err) console.log(err);
            //     console.log('Arquivo salvo');
            // });
        })
        .catch(console.error);
}

getBoards(queryList).then(p => {
    console.log(boardsId);
    for (let index = 0; index < boardsId.length; index++) {
        const id = boardsId[index];
        getBoardById(id).then(p => {
            p.forEach(element => {
                getItems(element);
            });
            
        });
        
    }
}).catch(console.error);




