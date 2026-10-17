import {test} from 'node:test';
import assert from 'node:assert/strict';
import perfil from '../js/perfil.js';
import {gerarServicos,formatarPrecoServico} from '../scripts/preparar.mjs';

function links(html) {
  return [...html.matchAll(/href="([^"]+)"/g)].map(([,url])=>new URL(url.replace(/&#39;/g,"'").replace(/&amp;/g,'&')));
}

test('catálogo com mais de dez serviços envia nome e preço próprios ao WhatsApp',()=>{
  const pagina=gerarServicos(perfil);
  const destinos=links(pagina);
  assert.equal(destinos.length,12);
  for(const [i,url] of destinos.entries()) {
    assert.equal(url.origin,'https://wa.me');
    assert.equal(url.pathname,`/${perfil.whatsapp}`);
    const mensagem=url.searchParams.get('text');
    assert.ok(mensagem.includes(perfil.servicos[i].nome));
    assert.ok(mensagem.includes(formatarPrecoServico(perfil.servicos[i])));
    assert.ok(mensagem.includes('demonstrativo'));
  }
  assert.equal((pagina.match(/target="_blank"/g)||[]).length,12);
  assert.equal((pagina.match(/rel="noopener noreferrer"/g)||[]).length,12);
});

test('preço fixo, a partir de, zero e sob consulta têm apresentação distinta',()=>{
  assert.equal(formatarPrecoServico({preco:49.9}),'R$ 49,90');
  assert.equal(formatarPrecoServico({preco:35,aPartirDe:true}),'A partir de R$ 35,00');
  assert.equal(formatarPrecoServico({preco:0}),'R$ 0,00');
  assert.equal(formatarPrecoServico({preco:null,aPartirDe:true}),'Sob consulta');
  assert.equal(formatarPrecoServico({}),'Sob consulta');
});

test('serviço sob consulta não vira preço zero nem envia prefixo indevido',()=>{
  const pagina=gerarServicos({...perfil,servicos:[{nome:'Cuidados especiais',preco:null,aPartirDe:true}]});
  assert.ok(pagina.includes('Sob consulta'));
  assert.ok(!pagina.includes('service-price-prefix'));
  assert.ok(!pagina.includes('R$ 0,00'));
  assert.ok(links(pagina)[0].searchParams.get('text').includes('Sob consulta'));
});

test('novos serviços, acentos e caracteres especiais mantêm texto e link seguros',()=>{
  const especial={nome:'Tosa & banho <premium> "Pêlo"',preco:120.5};
  const pagina=gerarServicos({...perfil,servicosDemonstrativos:false,servicos:[...perfil.servicos,especial]});
  const destinos=links(pagina);
  assert.equal(destinos.length,13);
  assert.ok(pagina.includes('Tosa &amp; banho &lt;premium&gt; &quot;Pêlo&quot;'));
  const mensagem=destinos.at(-1).searchParams.get('text');
  assert.ok(mensagem.includes(especial.nome));
  assert.ok(mensagem.includes('R$ 120,50'));
  assert.ok(!mensagem.includes('demonstrativo'));
});

test('preço inválido ou serviço sem nome/WhatsApp falha antes de gerar links',()=>{
  for(const preco of [-1,NaN,Infinity,'50','']) {
    assert.throws(()=>gerarServicos({...perfil,servicos:[{nome:'Banho',preco}]}),/Preço inválido/);
  }
  assert.throws(()=>gerarServicos({...perfil,servicos:[{nome:' ',preco:10}]}),/nome/);
  assert.throws(()=>gerarServicos({...perfil,whatsapp:''}),/WhatsApp/);
  assert.equal(gerarServicos({...perfil,servicos:[]}),'');
});
