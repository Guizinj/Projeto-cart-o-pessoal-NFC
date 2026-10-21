(() => {
  const marca = document.querySelector('#nome').textContent.trim();
  const whatsapp = new URL(document.querySelector('.primary').href).pathname.replace(/\D/g, '');

  // Os nomes e valores vêm do próprio HTML, sem configuração duplicada.
  function atualizarAgendamento(cartao) {
    const nome = cartao.querySelector('h3').textContent.trim();
    const preco = [...cartao.querySelectorAll('.service-price-prefix, .service-price strong')]
      .map(elemento => elemento.textContent.trim()).join(' ');
    const exemplo = document.querySelector('.service-demo') ? ' (valor demonstrativo)' : '';
    const mensagem = `Olá, ${marca}! Gostaria de agendar ${nome}. Valor no site: ${preco}${exemplo}. Podemos confirmar os detalhes e a disponibilidade?`;
    cartao.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
    cartao.setAttribute('aria-label', `${nome} — ${preco}. Agendar pelo WhatsApp (abre em nova aba)`);
  }

  document.querySelectorAll('.service').forEach(cartao => {
    atualizarAgendamento(cartao);
    cartao.addEventListener('click', () => atualizarAgendamento(cartao));
    cartao.addEventListener('contextmenu', () => atualizarAgendamento(cartao));
  });

  const botao = document.querySelector('#compartilhar');
  const status = document.querySelector('#status');
  const manual = document.querySelector('#copia-manual');
  const link = document.querySelector('#link-perfil');
  const url = document.querySelector('link[rel="canonical"]').href;

  botao.hidden = false;
  botao.addEventListener('click', async () => {
    botao.disabled = true;
    status.textContent = '';
    manual.hidden = true;
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({title: document.title, text: document.querySelector('meta[name="description"]').content, url});
          status.textContent = 'Site compartilhado.';
          return;
        } catch (erro) {
          if (erro?.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copiado! Agora é só enviar.';
      } catch {
        manual.hidden = false;
        link.value = url;
        link.focus();
        link.select();
        status.textContent = 'Selecione e copie o link abaixo.';
      }
    } finally {
      botao.disabled = false;
    }
  });
})();
