# Club Dog's

Site estático em HTML, CSS e JavaScript. Abra **index.html** diretamente no navegador. Não precisa instalar nada ou executar comandos. Para publicar com HTTPS, envie somente **index.html**, **css/**, **js/** e **assets/** ao GitHub Pages ou outra hospedagem estática.

## Editar o catálogo

Todos os serviços e valores ficam no **index.html**, dentro da seção `services`. A estrutura é **categoria → porte → serviço**:

- `service-category`: Banho, Banho & Tosa ou Complementares; o nome fica em `category-name`.
- `service-size`: cada porte; o nome fica em `size-name`.
- `service-card`: cada serviço; edite `service-name`, o preço em `service-price strong` e a descrição em `service-description`, quando houver.

Para incluir um serviço, duplique um bloco `<li class="service-card">` no porte correto. Para excluir, remova o bloco inteiro. Não invente limites de peso para os portes: eles devem ser confirmados com a equipe se forem necessários.

**Todos os preços de Banho & Tosa usam “A partir de”**: mantenha o trecho `service-price-prefix` nesses serviços. Banhos e complementares têm valores sem esse prefixo. A tosa com nós não é oferecida para porte grande; a progressiva desse porte está como **Sob consulta**.

As mensagens do WhatsApp são montadas pelo **js/app.js** a partir da categoria, porte, nome e preço visíveis no HTML. O número vem do botão principal de agendamento no hero. Sem JavaScript, os blocos continuam expansíveis e os links abrem a conversa sem mensagem preenchida.

## Fotos, contato e horários

A galeria `moments` é um carrossel manual. Para adicionar uma foto, copie a imagem para **assets/** e duplique um `<figure class="pet-photo">` dentro de `photo-track`. Atualize `src`, texto alternativo, dimensões originais e legenda. A contagem e as setas se ajustam à quantidade de fotos ao abrir a página; não precisa mudar o JavaScript. Não há reprodução automática. Sem JavaScript, é possível rolar a galeria manualmente.

Os contatos continuam limitados a WhatsApp, Instagram, ligação e localização. Ao trocar o telefone, atualize os links, o número visível e **assets/contato.vcf**. O Instagram atual é **@clubdog.s**; telefone: **(81) 98872-6029**.

Os horários ficam na seção `hours`: **terça a sexta, 08:00 às 18:30; sábado, 08:00 às 17:30; domingo e segunda, fechado**. Ao alterar um horário, mude tanto o texto visível quanto o atributo `datetime` correspondente.

**css/style.css** controla aparência e responsividade. A seção `keep-card` contém apenas um título e o botão de salvar contato. Alguns celulares baixam o VCF antes de abrir a importação na agenda. O compartilhamento usa a URL canônica e oferece cópia ou link selecionável quando o navegador não disponibiliza o compartilhamento nativo.

## Tipografia

Títulos usam **Nunito** e textos, preços e botões usam **DM Sans**, com tamanhos ajustados para leitura no celular. As duas fontes variáveis WOFF2 estão em **assets/fonts/**, junto das licenças SIL Open Font License 1.1 de cada família. A declaração fica em **css/fonts.css** e a escala tipográfica em **css/style.css**. Não há carregamento de fontes por CDN; publique a pasta assets/fonts junto do restante do site. Os subconjuntos latinos incluem os caracteres acentuados usados em português.

Fontes oficiais: [Nunito](https://fonts.google.com/specimen/Nunito) e [DM Sans](https://fonts.google.com/specimen/DM+Sans).

## URL pública e cartão

URL atual: **https://guizinj.github.io/Projeto-cart-o-pessoal-NFC/**. Se mudar, atualize a URL canônica e os metadados no HTML, o campo de cópia manual, o VCF, **assets/qr.svg** e o QR incorporado no verso do cartão, atualizando também seu PNG. No cartão NFC, grave apenas a URL HTTPS.

As artes em SVG e PNG ficam em **arte-cartao/club-dogs/** e não foram alteradas nesta revisão. O cartão mede 90 × 50 mm, sem sangria; confirme as especificações com a gráfica. A logo e as fotos da galeria foram fornecidas pelo cliente. A capa é uma ilustração, não uma foto do estabelecimento.

## Rollback e conferência

O estado anterior a esta revisão, incluindo alterações manuais e histórico Git, foi salvo em **..\Projeto ClubeDogs - Rollbacks\2026-10-21-antes-do-novo-catalogo-67667e.zip**. Para restaurar, extraia o ZIP em uma pasta separada e use essa cópia como projeto. O backup fica fora da pasta pública do site.

Validação desta revisão: as 41 opções foram conferidas por preço, porte e mensagem; navegação por teclado e áreas de toque verificadas; layouts em 320, 375, 390, 768 e 1280 px sem rolagem horizontal da página. Carrossel conferido com uma, duas e cinco fotos, assim como abertura direta do HTML, consulta sem JavaScript e alternativas de compartilhamento. Os destinos do WhatsApp foram interceptados localmente para conferir as mensagens sem enviar nada à equipe.

Testes feitos em Chrome no computador. Safari/iPhone, Chrome/Android, abertura dos aplicativos e importação efetiva do VCF em aparelhos físicos ainda não foram realizados e devem ser conferidos antes da entrega.
