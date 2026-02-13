const http = require('http'); //importa o módulo nativo do "http"

const colors = require('colors'); //importa o módulo colors

const fs = require('fs');//importa o módulo File System para ler arquivos

const path = require('path'); //importa o módulo path para "caminho" e (rotas se for express)

//simular dados de um banco de dados
const dados = [
    {id: 1, imovel: " Apartamento - 53m2", valormensal: 2000 ,regiao: "Sorocaba - Zona Norte ", dados: " 2 quartos , 1 banheiro - 1 vaga"},
    {id: 2, imovel: " Casa térrea  - 170m2 ", valormensal: 4200 ,regiao: "Sorocaba- Zona Leste ", dados: "- 3 quartos, 2 banheiros- 2 vagas"},
    {id: 3, imovel: " Apartamento - 43m2", valormensal: 1300 ,regiao: "Sorocaba- Zona Leste ", dados:"2 quartos- 1 banheiro- 1 vaga"},
    {id: 4, imovel: " Apartamento - 75m2", valormensal: 3200 ,regiao: "Votorantim- Centro ", dados: "3 quartos- 2 banheiros- 1 vaga"},
    {id: 5, imovel: "Casa Sobrado - 200m2 ", valormensal: 6550 ,regiao: "Sorocaba- Zona Sul ", dados: " 4 quartos - 3 banheiros - 2 vagas" }

];
//criar servidor
//função callback que recebe a requisição (req) e a resposta (res)
//req (request):informações sobre pedido do usuário.
//res(response): objeto para enviar a resposta de volta ao usuário.
const server = http.createServer((req, res) =>{

    //log para ver qual URL está sendo acessada no terminal
    console.log(`Requisição recebida: ${req.url}` .green);

    //rota da API retorna a tabela em formato JSON
    if (req.url === '/api/dados'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        return res.end(JSON.stringify(dados));
    }
    //Lógica para servir arquivos estáticos da pasta "public" (index.html, 404.html, css, js, etc)
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html': req.url);
    const extname = path.extname(filePath);

    //Tipos de conteudo basicos
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'

    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';




    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                //Arquivo não encontrado, serve o 404
                const path404 = path.join(__dirname, 'public', '404.html');
                fs.readFile(path404, (err404, content404) => {
                    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(content404 || 'Página não encontrada');
                });
            } else {
                //Erro do servidor
                res.writeHead(500);
                res.end(`Erro do servidor: ${err.code}`);
            }
        }else{
            //sucesso ao encontrar o arquivo
            res.writeHead(200, {'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

    // //roteamento simple (caminho da URL)
    // if (req.url === '/dados') {
    //     //lê o arquivo 'index.html' que está na pasta public
    //     const filePath = path.join(__dirname, 'public', 'index.html');

    //     fs.readFile(filePath, 'utf8', (err, content) => {
    //         if (err) {
    //             res.writeHead(500);
    //             res.end('Erro do servidor');
    //         } else {
    //             res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    //             res.end(content);
    //         }
    //     });
    // }

    //rota da API retorna a tabela em formato JSON
    //localhost:3000/api/dados que pode ser consomida no front-end
//     else if (req.url === '/api/dados'){
//         res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
//         res.end(JSON.stringify(dados));
//     }

//     else{
    
//         //lê o arquivo '404.html' que está na pasta public
//         const path404 = path.join(__dirname, 'public', '404.html');

//         fs.readFile(path404, (err, content) => {
//             if (err) {
//                 res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
//                 res.end('Página não encontrada (404)');
//             }else {
//                 res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
//                 res.end(content);
//             }
//         });


//     }
// });

//configurar a porta do servidor
const PORT = 3000;

//iniciar o servidor usar o listem para ouvir a porta
server.listen(PORT, () =>{
    console.log(`Servidor rodando http://localhost:${PORT}`. green.bold);
});