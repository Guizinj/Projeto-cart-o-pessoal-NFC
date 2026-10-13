import perfil from './perfil.js';

export async function compartilhar({ navigator, perfil, informar, mostrarLink }) {
  const dados = { title: `${perfil.nome} | ${perfil.profissao}`, text: perfil.apresentacao, url: perfil.urlPublica };
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(dados);
      informar('Perfil compartilhado.');
      return;
    } catch (erro) {
      if (erro.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(perfil.urlPublica);
    informar('Link copiado! Agora é só enviar.');
  } catch {
    mostrarLink(perfil.urlPublica);
    informar('Selecione e copie o link abaixo.');
  }
}

if (typeof document !== 'undefined') {
  const botao = document.querySelector('#compartilhar');
  const status = document.querySelector('#status');
  const manual = document.querySelector('#copia-manual');
  const link = document.querySelector('#link-perfil');
  botao.hidden = false;
  botao.addEventListener('click', async () => {
    botao.disabled = true;
    status.textContent = '';
    manual.hidden = true;
    try {
      await compartilhar({
        navigator: window.navigator, perfil,
        informar: mensagem => { status.textContent = mensagem; },
        mostrarLink: url => { manual.hidden = false; link.value = url; link.focus(); link.select(); }
      });
    } finally { botao.disabled = false; }
  });
}
