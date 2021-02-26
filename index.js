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

// configuração do Body-parser e cors
app.use(bodyparser.urlencoded({ extended:false }))
app.use(bodyparser.json())
app.use(cors())

app.get('/add', async function(req,res){
	// Variaveis que receberam os valores das QueryStrings
	const { query } = req
	const nameOfProduct = query.name
	const quantForAdd =  parseInt(query.quant) || 1 // Se houver um valor em 'query.quant', o mesmo será setado, senão será 1

	// Variavel que vai receber os dados do produto que será adicionado se já existir no banco de dados
	let productInDatabase = null

	// retorna as linhas do database com o nome recebido
	knex.select('name','quant')
		.from('products')	
		.where({
			name: nameOfProduct,
		})
		.then( function(product){
			console.log('ENCONTROU')

			productInDatabase = product
			console.log(productInDatabase)

			if (productInDatabase[0]){
				// Se o produto já estiver registrado, nesse caso só se muda a quantidade, somando a quantidade solicitada
				knex('products')
					.where(productInDatabase[0])
					.update({
						quant: productInDatabase[0].quant + quantForAdd
					})
					.then(()=>{
						console.log(`Produto incrementado: ${nameOfProduct} | Quant: ${productInDatabase[0].quant} To ${productInDatabase[0].quant + quantForAdd} `)
					})
			} else {
				// Se o produto não estiver registrado no Banco De Dados
				knex('products')
					.insert({
						name: nameOfProduct,
						quant: quantForAdd
					})
					.then(()=>{
						console.log(`PRODUTO REGISTRADO: ${nameOfProduct} | QUANTIDADE: ${quantForAdd}}`)
						res.send({'Add': 1})
					})
			}
		})	
		.catch( (err) => {
			console.log(`ERRO NA ADIÇÃO DO PRODUTO: ${nameOfProduct}`)
			res.send({ 'error': err  })	
		})

})

app.get('/remove', async function(req, res){
	const { query } = req
	const nameOfProduct = query.name
	const quantForRemove =  parseInt(query.quant) || 1 // Se houver um valor em 'query.quant', o mesmo será setado, senão será 1
	
	// Variavel que vai receber os dados do produto que será adicionado se já existir no banco de dados
	let productInDatabase = null

	knex.select('name','quant')
		.from('products')	
		.where({
			name: nameOfProduct,
		})
		.then( function(product){
			console.log('ENCONTROU')

			productInDatabase = product
			console.log(productInDatabase)

			if (productInDatabase[0]){
				// Se o produto já estiver registrado, nesse caso só se muda a quantidade, subtraindo a quantidade solicitada
				knex('products')
					.where(productInDatabase[0])
					.update({
						quant: productInDatabase[0].quant - quantForRemove
					})
					.then(()=>{
						console.log(`Produto decrementado: ${nameOfProduct} | Quant: ${productInDatabase[0].quant} To ${productInDatabase[0].quant - quantForRemove} `)
					})
			} else {
				// Se o produto não estiver registrado no Banco De Dados
				res.send({ error: 'Produto não registrado'})
				console.log('')
				console.log(`ERRO NA REMOÇÃO DO PRODUTO: produto não registrado`)
			}
		})	
		.catch( (err) => {
			console.log(`ERRO NA REMOÇÃO DO PRODUTO: ${nameOfProduct}`)
			res.send({ 'error': err  })	
		})
})


app.get('/delete', async function(req, res){
	const { query } = req
	const nameOfProduct = query.name
	
	// Executa direto a query que deleta o(s) registro(s) com o mesmo nome enviado
	knex('products')
		.where({
			name: nameOfProduct,
		})
		.del()
		.then(()=>{
			console.log(`PRODUTO REMOVIDO: ${nameOfProduct}`)
			res.send({ produtoRemovido: nameOfProduct})
		})
		.catch( (err) => {
			console.log(`ERRO NO DELETAMENTO DO PRODUTO: ${nameOfProduct}`)
			res.send({ 'error': err  })	
		})
})

app.get('/list', async function(req, res){
	knex.select().from('products')	
		.then( function(products){
			res.send(JSON.stringify(products))
		})
		.catch(function(err){
			res.send({ 'error': 'error on request dades'  })	
			console.log(err)
		})
})

app.listen(portServer, () => console.log('servidor aos 30'))
