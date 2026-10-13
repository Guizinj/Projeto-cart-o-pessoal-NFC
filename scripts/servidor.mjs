import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
const raiz = fileURLToPath(new URL('../', import.meta.url));
const tipos = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.vcf':'text/vcard; charset=utf-8'};
createServer(async (req,res) => {
  try {
    const caminho = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const arquivo = caminho === '/' ? 'index.html' : caminho.slice(1);
    if (!(arquivo === 'index.html' || /^(css|js|assets)\/[\w./-]+$/.test(arquivo)) || arquivo.split('/').includes('..')) {
      res.writeHead(404);res.end('Não encontrado');return;
    }
    const dados = await readFile(resolve(raiz,arquivo));
    res.writeHead(200, {'Content-Type':tipos[extname(arquivo)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(dados);
  } catch { res.writeHead(404);res.end('Não encontrado'); }
}).listen(4173,'127.0.0.1', () => console.log('Prévia local: http://127.0.0.1:4173'));
