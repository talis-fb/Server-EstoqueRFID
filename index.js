const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')

var knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './databases/products.sqlite'
	}
})

knex.schema.hasTable('products')
	.then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('products', function (table) {
				table.increments('id')
				table.string('name')
				table.integer('quant')
			})
		}
	})

const app = express()
const portServer = 5050

app.use(bodyparser.urlencoded({ extended:false }))
app.use(bodyparser.json())

app.use(cors())

app.get('/add', async function(req,res){
	const { query } = req
	const nameOfProduct = query.name
	const quantForAdd = query.quant

	try {
		knex('products').insert({
			name: nameOfProduct,
			quant: quantForAdd
		})
		.then(()=>{
			console.log(`PRODUTO ADICIONADO: ${nameOfProduct}`)
			res.send({'Add': 1})
		})
	} catch (err){
		console.log(`ERRO NA ADIÇÃO DO PRODUTO: ${nameOfProduct}`)
		res.send({ 'error': err  })	
	}
})

app.get('/remove', async function(req, res){
	const { query } = req
	const nameOfProduct = query.name
	
	try {
		knex('products')
			.where({
				name: nameOfProduct,
			})
			.del()
			.then(()=>{
				console.log(`PRODUTO REMOVIDO: ${nameOfProduct}`)
				res.send({'LESS': 1})
			})
	} catch (err){
		console.log(`ERRO NA REMOÇÃO DO PRODUTO: ${nameOfProduct}`)
		res.send({ 'error': err  })	
	}
})

app.get('/list', async function(req, res){
	knex.select().from('products')	
		.then( function(products){
			res.send(json.stringify(products))
		})
		.catch(function(err){
			res.send({ 'error': 'error on request dades'  })	
			console.log(err)
		})
})

app.listen(portserver, () => console.log('servidor aos 30'))
