import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const xml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Frente aprovada: logo original incorporada e textos vetoriais.
export async function gerarCartoes(p,destino) {
  const pasta=resolve(destino,'arte-cartao/club-dogs');
  await mkdir(pasta,{recursive:true});
  const logo=(await readFile(resolve(destino,p.foto))).toString('base64');
  const defs=`<defs><linearGradient id="lav" x2="1" y2="1"><stop stop-color="#818ff0"/><stop offset="1" stop-color="#727edb"/></linearGradient><clipPath id="logo"><circle cx="203.5" cy="208.3" r="124"/></clipPath><clipPath id="borda"><rect width="900" height="500" rx="28"/></clipPath></defs>`;
  const frente=`${defs}<g clip-path="url(#borda)"><rect width="900" height="500" fill="url(#lav)"/><circle cx="896" cy="496" r="315" fill="#f4a5d0"/><circle cx="830" cy="510" r="345" fill="none" stroke="#fce1ef" stroke-width="1"/><circle cx="860" cy="515" r="365" fill="none" stroke="#ffffff" stroke-opacity=".35"/><circle cx="206" cy="212" r="140" fill="#ffffff" fill-opacity=".18"/><image href="data:image/jpeg;base64,${logo}" x="63" y="67" width="286" height="290" clip-path="url(#logo)"/><text x="385" y="181" fill="#fff" font-family="Trebuchet MS,Arial,sans-serif" font-size="49" font-weight="800">${xml(p.nome)}</text><text x="388" y="215" fill="#fff" font-family="Arial,sans-serif" font-size="16" letter-spacing="1.3">PETSHOP &amp; ESTÉTICA ANIMAL</text><path d="M388 244h49" stroke="#f9c4e1" stroke-width="4"/><g transform="translate(764 362)" fill="none" stroke="#373357" stroke-width="5" stroke-linecap="round"><path d="M0 12q20 18 0 36M15 4q31 26 0 52M30-4q43 34 0 68"/></g><text x="752" y="457" fill="#373357" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">NFC</text></g>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="90mm" height="50mm" viewBox="0 0 900 500">${frente}</svg>`;
  await writeFile(resolve(pasta,'frente.svg'),svg);
}
