import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import QRCode from 'qrcode';
import perfil from '../js/perfil.js';
import { preparar, gerarVcard, gerarLinks } from '../scripts/preparar.mjs';
import { compartilhar } from '../js/app.js';

test('vCard preserva caracteres, estrutura e limite de octetos', () => {
  const vcf = gerarVcard({...perfil,nome:'João; Silva, Jr.\\Teste\nNovo',apresentacao:'',empresa:'Á'.repeat(100),endereco:{rua:'Av. Santos Dumont, 1000',cidade:'Fortaleza',estado:'CE',cep:'60150-000',pais:'Brasil'}});
  assert.ok(vcf.includes('FN:João\\; Silva\\, Jr.\\\\Teste\\nNovo\r\n'));
  assert.ok(vcf.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n'));
  assert.ok(vcf.endsWith('END:VCARD\r\n'));
  assert.ok(vcf.includes('ADR;TYPE=WORK:;;Av. Santos Dumont\\, 1000;Fortaleza;CE;60150-000;Brasil'));
  for (const linha of vcf.split('\r\n')) assert.ok(Buffer.byteLength(linha) <= 75);
  assert.ok(!vcf.includes('\uFFFD'));
});
test('ações vazias são omitidas e URLs inseguras são rejeitadas', () => {
  assert.equal(gerarLinks({}), '');
  assert.throws(() => gerarLinks({site:'javascript:alert(1)'}));
  assert.equal((gerarLinks(perfil).match(/<a class="contact-link"/g)||[]).length,4);
  assert.equal((gerarLinks(perfil).match(/aria-disabled="true"/g)||[]).length,2);
  assert.ok(!gerarLinks(perfil).includes('mailto:'));
  assert.ok(!gerarVcard(perfil).includes('EMAIL;'));
  assert.ok(gerarVcard(perfil).includes(`URL:${perfil.urlPublica}`));
});
test('preparação reflete alteração do perfil no HTML, QR e vCard', async () => {
  const destino = await mkdtemp(join(tmpdir(),'cartao-nfc-'));
  try {
    await mkdir(join(destino,'assets'));
    await copyFile(new URL('../assets/perfil.jpg',import.meta.url),join(destino,'assets/perfil.jpg'));
    const p = {...perfil,nome:'André <Costa>',nomeProprio:'André',foto:'assets/perfil.jpg',capa:'assets/perfil.jpg',urlPublica:'https://cliente.example/cartao/'};
    await preparar(p,destino);
    const pagina = await readFile(join(destino,'index.html'),'utf8');
    assert.ok(pagina.includes('André &lt;Costa&gt;'));
    assert.ok(pagina.includes('https://cliente.example/cartao/assets/perfil.jpg'));
    assert.ok(pagina.includes('href="https://cliente.example/cartao/"'));
    assert.ok(!pagina.includes('{{'));
    const esperado = await QRCode.toString(p.urlPublica,{type:'svg',errorCorrectionLevel:'M',margin:4,color:{dark:'#182d28',light:'#ffffff'}});
    assert.equal(await readFile(join(destino,'assets/qr.svg'),'utf8'),esperado);
    assert.ok((await readFile(join(destino,'assets/contato.vcf'),'utf8')).includes('FN:André <Costa>'));
    await assert.rejects(preparar({...p,urlPublica:'http://cliente.example/'},destino));
  } finally { await rm(destino,{recursive:true,force:true}); }
});
test('contato do estabelecimento usa marca e o novo número consistente', () => {
  assert.equal(perfil.telefone, `+55${perfil.telefoneExibicao.replace(/\D/g,'')}`);
  assert.equal(perfil.whatsapp, perfil.telefone.replace(/\D/g,''));
  const vcf=gerarVcard(perfil);
  assert.ok(vcf.includes("FN:Club Dog's\r\n"));
  assert.ok(vcf.includes("N:Club Dog's;;;;\r\n"));
  assert.ok(vcf.includes('TEL;TYPE=CELL:+5581988726029'));
  assert.ok(!vcf.includes('Yago'));
});
test('compartilhamento nativo recebe a URL pública', async () => {
  let dados, mensagem;
  await compartilhar({perfil,navigator:{share:async p => {dados=p;}},informar:m => {mensagem=m;},mostrarLink:()=>assert.fail()});
  assert.equal(dados.url,perfil.urlPublica);
  assert.equal(mensagem,'Perfil compartilhado.');
});
test('cancelamento não copia link nem mostra erro', async () => {
  await compartilhar({perfil,navigator:{share:async()=>{throw Object.assign(new Error(),{name:'AbortError'});},clipboard:{writeText:()=>assert.fail()}},informar:()=>assert.fail(),mostrarLink:()=>assert.fail()});
});
test('API ausente e falha nativa usam clipboard', async () => {
  for (const share of [undefined,async()=>{throw new Error('falha');}]) {
    let copiado;
    await compartilhar({perfil,navigator:{share,clipboard:{writeText:async u=>{copiado=u;}}},informar:()=>{},mostrarLink:()=>assert.fail()});
    assert.equal(copiado,perfil.urlPublica);
  }
});
test('clipboard indisponível ou negado mostra URL selecionável', async () => {
  for (const clipboard of [undefined,{writeText:async()=>{throw new Error('negado');}}]) {
    let url, mensagem;
    await compartilhar({perfil,navigator:{clipboard},informar:m=>{mensagem=m;},mostrarLink:u=>{url=u;}});
    assert.equal(url,perfil.urlPublica);
    assert.ok(mensagem.includes('copie'));
  }
});
