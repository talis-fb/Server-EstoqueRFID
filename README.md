# Server-EstoqueRFID
Um server NodeJS para a administração de um sistema de Contagem de Estoque com RFID

## Instalação
Primeiro, é necessário a instalação do runtime NodeJS para a execução dos códigos e do gerenciador NPM para a instalação das bibliotecas.
Dentro do projeto execute o comando para instalar as dependências do projeto e então, execute o próximo para executar o servidor...

```sh
$ npm install
$ npm start
```


## Uso
O servidor consiste basicamente numa API, q faz seus comandos no banco de dados com requisições HTTP (Método GET) que receber. A API responderá equivalente a rota e aos parâmetros que receber nas Query-Strings.

#### Adicionar/Incrementar um produto: 

```
www.url.com / add ? name = "nomeDoProduto" & quant = "quantidadeRequisitada"
```

#### Decrementar um produto: 

```
www.url.com / remove ? name = "nomeDoProduto" & quant = "quantidadeRequisitada"
```

#### Deletar o registro de um produto: 

```
www.url.com / delete ? name = "nomeDoProduto"
```

#### Listar todos os produtos

```
www.url.com / list
```





