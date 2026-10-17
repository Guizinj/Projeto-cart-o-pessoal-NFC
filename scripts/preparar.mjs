import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import QRCode from 'qrcode';
import perfil from '../js/perfil.js';
import { gerarCartoes } from './cartao.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
export const html = valor => String(valor ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const textoVcf = valor => String(valor ?? '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');

// vCard limita linhas a 75 octetos; nunca dividir um caractere UTF-8.
export function dobrarLinha(linha) {
  let saida = '', tamanho = 0;
  for (const caractere of linha) {
    const bytes = Buffer.byteLength(caractere);
    if (tamanho + bytes > 75) { saida += '\r\n '; tamanho = 1; }
    saida += caractere; tamanho += bytes;
  }
  return saida;
}
export function gerarVcard(p) {
  const linhas = ['BEGIN:VCARD', 'VERSION:3.0', `N:${textoVcf(p.nome)};;;;`, `FN:${textoVcf(p.nome)}`];
  if (p.empresa) linhas.push(`ORG:${textoVcf(p.empresa)}`);
  if (p.profissao) linhas.push(`TITLE:${textoVcf(p.profissao)}`);
  if (p.telefone) linhas.push(`TEL;TYPE=CELL:${textoVcf(p.telefone)}`);
  if (p.endereco && Object.values(p.endereco).some(Boolean)) {
    const a = p.endereco;
    linhas.push(`ADR;TYPE=WORK:;;${[a.rua,a.cidade,a.estado,a.cep,a.pais].map(textoVcf).join(';')}`);
  }
  if (p.urlPublica) linhas.push(`URL:${textoVcf(p.urlPublica)}`);
  linhas.push('END:VCARD');
  return linhas.map(dobrarLinha).join('\r\n') + '\r\n';
}
const desenhos = {
  salvar: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
  seta: '<path d="m9 6 6 6-6 6"/>',
  compartilhar: '<path d="M12 16V3m-4 4 4-4 4 4M5 11v10h14V11"/>',
  whatsapp: '<path d="M21 11.5a9 9 0 0 1-13.6 7.8L3 21l1.6-4.4A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-2 4 3 9 7 8l1-2-3-1-1 1-2-2 1-1-1-3Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  telefone: '<path d="m8 3 3 5-3 2a14 14 0 0 0 6 6l2-3 5 3-1 4C10 22 2 14 3 4Z"/>',
  mapa: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  pata: '<ellipse cx="12" cy="16" rx="6" ry="4"/><ellipse cx="5" cy="8" rx="2" ry="3" transform="rotate(-20 5 8)"/><ellipse cx="10" cy="5" rx="2" ry="3"/><ellipse cx="16" cy="6" rx="2" ry="3"/><ellipse cx="20" cy="11" rx="2" ry="3" transform="rotate(25 20 11)"/>',
  coracao: '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 4 2 9 8 14 6-5 12-10 8-14Z"/>',
};
const icone = nome => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${desenhos[nome]}</svg>`;
function urlWeb(valor, campo) {
  const url = new URL(valor);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`${campo}: use URL HTTP ou HTTPS.`);
  return url.href;
}
export function gerarLinks(p) {
  const acoes = [
    ['whatsapp', 'WhatsApp', p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, '')}` : ''],
    ['instagram', 'Instagram', p.instagram ? urlWeb(p.instagram, 'instagram') : ''],
    ['telefone', 'Ligar', p.telefone ? `tel:${p.telefone.replace(/[^+\d]/g, '')}` : ''],
    ['mapa', 'Localização', p.mapa ? urlWeb(p.mapa, 'mapa') : '']
  ];
  return acoes.filter(([, , url]) => url).map(([tipo, rotulo, url]) =>
    `<a class="contact-link" href="${html(url)}" target="_blank" rel="noopener noreferrer">${icone(tipo)}<span>${rotulo}</span></a>`
  ).join('\n');
}
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarPrecoServico(servico) {
  if (servico.preco == null) return 'Sob consulta';
  if (typeof servico.preco !== 'number' || !Number.isFinite(servico.preco) || servico.preco < 0) {
    throw new Error(`Preço inválido para ${servico.nome}: use um número positivo ou null.`);
  }
  const valor = moeda.format(servico.preco).replace(/\u00a0/g, ' ');
  return servico.aPartirDe ? `A partir de ${valor}` : valor;
}

export function gerarServicos(p) {
  const servicos = p.servicos || [];
  const numero = String(p.whatsapp || '').replace(/\D/g, '');
  if (servicos.length && !numero) throw new Error('Informe o WhatsApp para os serviços.');
  return servicos.map(s => {
    if (typeof s.nome !== 'string' || !s.nome.trim()) throw new Error('Informe o nome de cada serviço.');
    const preco = formatarPrecoServico(s);
    const prefixo = s.preco != null && s.aPartirDe ? '<span class="service-price-prefix">A partir de</span>' : '';
    const valor = prefixo ? preco.replace('A partir de ', '') : preco;
    const demonstracao = p.servicosDemonstrativos ? ' (valor demonstrativo)' : '';
    const mensagem = `Olá, ${p.nome}! Gostaria de agendar ${s.nome}. Valor no site: ${preco}${demonstracao}. Podemos confirmar os detalhes e a disponibilidade?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    const rotulo = `${s.nome} — ${preco}. Agendar pelo WhatsApp (abre em nova aba)`;
    return `<li class="service-item"><a class="service" href="${html(url)}" target="_blank" rel="noopener noreferrer" aria-label="${html(rotulo)}"><div class="service-top"><h3>${html(s.nome)}</h3><span class="service-arrow">${icone('seta')}</span></div><div class="service-price">${prefixo}<strong>${html(valor)}</strong></div></a></li>`;
  }).join('\n');
}
export async function preparar(p = perfil, destino = raiz) {
  const url = new URL(p.urlPublica);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) throw new Error('urlPublica deve ser HTTPS, sem credenciais, consulta ou fragmento.');
  for (const campo of ['nome','profissao','apresentacao','foto','fotoAlt']) {
    if (!p[campo]?.trim()) throw new Error(`Preencha ${campo} em js/perfil.js.`);
  }
  if (!/^assets\/[a-zA-Z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(p.foto) || p.foto.includes('..')) throw new Error('foto deve indicar uma imagem local dentro de assets/.');
  await access(resolve(destino, p.foto));
  if (!/^assets\/[a-zA-Z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(p.capa || '') || p.capa.includes('..')) throw new Error('capa deve indicar uma imagem local dentro de assets/.');
  await access(resolve(destino, p.capa));
  const titulo = `${p.nome} | ${p.profissao}`;
  const imagem = new URL(p.foto, url).href;
  const metadados = `<title>${html(titulo)}</title>
  <meta name="description" content="${html(p.apresentacao)}">
  <link rel="canonical" href="${html(p.urlPublica)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${html(p.empresa || p.nome)}">
  <meta property="og:title" content="${html(titulo)}">
  <meta property="og:description" content="${html(p.apresentacao)}">
  <meta property="og:url" content="${html(p.urlPublica)}">
  <meta property="og:image" content="${html(imagem)}">
  <meta property="og:image:alt" content="${html(p.fotoAlt)}">`;
  const campos = {
    ...Object.fromEntries(Object.entries(p).map(([k,v]) => [k,html(v)])),
    marca:html(p.marca || p.empresa || p.nome), metadados, links:gerarLinks(p), servicos:gerarServicos(p),
    avisoServicos:p.servicosDemonstrativos ? '<p class="service-demo">Catálogo demonstrativo · serviços e preços fictícios.</p>' : '',
    urlWhatsapp:html(`https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(p.mensagemWhatsApp || '')}`),
    iconeSalvar:icone('salvar'), iconeSeta:icone('seta'), iconeCompartilhar:icone('compartilhar'),
    iconePata:icone('pata'), iconeCoracao:icone('coracao'), iconeMapa:icone('mapa'), iconeWhatsapp:icone('whatsapp'), iconeInstagram:icone('instagram')
  };
  const modelo = await readFile(resolve(raiz,'templates/index.html'), 'utf8');
  const pagina = modelo.replace(/\{\{(\w+)\}\}/g, (_, campo) => {
    if (!(campo in campos)) throw new Error(`Campo desconhecido: ${campo}`);
    return campos[campo];
  });
  const qr = await QRCode.toString(p.urlPublica, {type:'svg',errorCorrectionLevel:'M',margin:4,color:{dark:'#182d28',light:'#ffffff'}});
  await mkdir(resolve(destino,'assets'), {recursive:true});
  await writeFile(resolve(destino,'index.html'), pagina);
  await writeFile(resolve(destino,'assets/qr.svg'), qr);
  await writeFile(resolve(destino,'assets/contato.vcf'), gerarVcard(p));
  await gerarCartoes(p, destino);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await preparar();
  console.log('Página, QR Code e contato preparados.');
  if (new URL(perfil.urlPublica).hostname === 'example.com') console.warn('URL PROVISÓRIA: substitua urlPublica antes de publicar ou gravar o NFC.');
}
