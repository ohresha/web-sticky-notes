import knexModule from 'knex'

const knex = knexModule({
    client: 'sqlite3',
    connection:{
        filename: './boardDB.sqlite'
    },
    useNullAsDefault: true
});

knex.schema.hasTable('notes').then(exists => {
    if (!exists){
        return knex.schema.createTable('notes', table => {
            table.increments('id').primary();
            table.string('messageText');
            table.integer('cordX');
            table.integer('cordY');
        }).then(() => {
            console.log('Table created');
        });
    }
});

export {knex};