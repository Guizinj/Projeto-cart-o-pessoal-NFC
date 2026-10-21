(() => {
  const marca = document.querySelector('#nome').textContent.trim();
  const whatsapp = new URL(document.querySelector('.primary').href).pathname.replace(/\D/g, '');

  // O HTML é a fonte dos nomes, portes e preços, inclusive sem JavaScript.
  function atualizarAgendamento(cartao) {
    const nome = cartao.querySelector('.service-name').textContent.trim();
    const categoria = cartao.closest('.service-category').querySelector('.category-name').textContent.trim();
    const porte = cartao.closest('.service-size').querySelector('.size-name').textContent.trim();
    const preco = [...cartao.querySelectorAll('.service-price-prefix, .service-price strong')]
      .map(elemento => elemento.textContent.trim()).join(' ');
    const consulta = preco.toLocaleLowerCase('pt-BR') === 'sob consulta';
    const mensagem = consulta
      ? `Olá, ${marca}! Gostaria de consultar o valor de ${categoria}: ${nome} para um pet de porte ${porte}. Podemos confirmar o orçamento e a disponibilidade?`
      : `Olá, ${marca}! Gostaria de agendar ${categoria}: ${nome} para um pet de porte ${porte}. Valor informado no site: ${preco}. Podemos confirmar o valor final e a disponibilidade?`;
    const acao = cartao.querySelector('.service-book');
    acao.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
    acao.setAttribute('aria-label', `${categoria}: ${nome}, porte ${porte} — ${preco}. ${consulta ? 'Consultar' : 'Agendar'} pelo WhatsApp (abre em nova aba)`);
  }

  document.querySelectorAll('.service-card').forEach(cartao => {
    atualizarAgendamento(cartao);
    const acao = cartao.querySelector('.service-book');
    acao.addEventListener('click', () => atualizarAgendamento(cartao));
    acao.addEventListener('contextmenu', () => atualizarAgendamento(cartao));
  });

  const categorias = [...document.querySelectorAll('.service-category')];
  const avisoCatalogo = document.querySelector('#catalogo-status');
  categorias.forEach(categoria => {
    const portes = [...categoria.querySelectorAll('.service-size')];
    categoria.addEventListener('toggle', () => {
      if (!categoria.open) {
        portes.forEach(porte => { porte.open = false; });
        return;
      }
      categorias.filter(outra => outra !== categoria).forEach(outra => { outra.open = false; });
    });
    portes.forEach(porte => {
      porte.addEventListener('toggle', () => {
        if (!porte.open) return;
        portes.filter(outro => outro !== porte).forEach(outro => { outro.open = false; });
        const quantidade = porte.querySelectorAll('.service-card').length;
        avisoCatalogo.textContent = `${categoria.querySelector('.category-name').textContent}, porte ${porte.querySelector('.size-name').textContent}: ${quantidade} serviços disponíveis.`;
      });
    });
  });

  // Carrossel sem reprodução automática; as fotos são os próprios blocos do HTML.
  const trilha = document.querySelector('.photo-track');
  if (trilha) {
    const fotos = [...trilha.querySelectorAll('.pet-photo')];
    const controles = document.querySelector('.carousel-controls');
    const anterior = controles.querySelector('.photo-prev');
    const proxima = controles.querySelector('.photo-next');
    const contador = controles.querySelector('.photo-count');
    let atual = 0;
    let quadro;
    controles.hidden = fotos.length <= 1;
    trilha.classList.toggle('is-single', fotos.length <= 1);

    function atualizarControles() {
      if (!fotos.length) return;
      const inicio = fotos[0].offsetLeft;
      atual = fotos.reduce((melhor, foto, indice) =>
        Math.abs(foto.offsetLeft - inicio - trilha.scrollLeft) < Math.abs(fotos[melhor].offsetLeft - inicio - trilha.scrollLeft) ? indice : melhor, 0);
      contador.textContent = `${atual + 1} de ${fotos.length}`;
      anterior.disabled = atual === 0;
      proxima.disabled = atual === fotos.length - 1;
    }

    function mostrarFoto(indice, animar = true) {
      if (!fotos.length) return;
      const destino = Math.max(0, Math.min(fotos.length - 1, indice));
      const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      trilha.scrollTo({ left: fotos[destino].offsetLeft - fotos[0].offsetLeft, behavior: animar && !reduzirMovimento ? 'smooth' : 'auto' });
    }

    anterior.addEventListener('click', () => mostrarFoto(atual - 1));
    proxima.addEventListener('click', () => mostrarFoto(atual + 1));
    trilha.addEventListener('keydown', evento => {
      if (evento.target !== trilha) return;
      const destinos = { ArrowLeft: atual - 1, ArrowRight: atual + 1, Home: 0, End: fotos.length - 1 };
      if (!(evento.key in destinos)) return;
      evento.preventDefault();
      mostrarFoto(destinos[evento.key]);
    });
    trilha.addEventListener('scroll', () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(atualizarControles);
    }, { passive: true });
    const redimensionar = () => { mostrarFoto(atual, false); atualizarControles(); };
    if ('ResizeObserver' in window) new ResizeObserver(redimensionar).observe(trilha);
    else window.addEventListener('resize', redimensionar);
    atualizarControles();
  }

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
