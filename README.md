# Club Dog's — bio-site e cartão NFC

Projeto 100% voltado ao estabelecimento, com a logo fornecida pelo cliente e identidade lilás/rosa. HTML, CSS e JavaScript puro, sem frameworks, login ou banco de dados. A capa é uma ilustração criada com image_gen; não representa animais atendidos nem o espaço físico do petshop.

## Visualizar

Abra `index.html` para conferir o visual. Para testar também o compartilhamento, abra o terminal na pasta e execute:

```powershell
npm.cmd run preview
```

Abra **http://127.0.0.1:4173**. Encerre o servidor com **Ctrl+C**. Módulos JavaScript podem ser bloqueados quando a página é aberta diretamente via `file://`.

## Atualizar os dados

Todas as informações estão em **js/perfil.js**: marca, apresentação, slogan, imagens, serviços, cidade, contatos, mensagem de agendamento e URL pública. O tipo `estabelecimento` salva a marca como nome do contato no VCF. `fraseCartao` controla as duas linhas da frente do cartão.

Após editar:

```powershell
npm.cmd run preparar
```

O comando atualiza a página, metadados, QR, contato `.vcf` e os cartões SVG. Os dados confirmados são:

- **Club Dog's — Petshop & estética animal**, Caruaru, PE.
- **(81) 98872-6029**: WhatsApp e ligação, com código internacional `+5581988726029`.
- **@clubdog.s**: https://www.instagram.com/clubdog.s/.
- Serviços da captura enviada: banho, tosa, hidratação, higiene bucal e carding.
- Site: https://guizinj.github.io/Projeto-cart-o-pessoal-NFC/.

O link de mapa enviado anteriormente foi mantido. Confirme o destino com o cliente antes da entrega; o endereço completo ainda não foi informado. Horários, preços, transporte e campanhas não foram incluídos porque não foram confirmados. A consulta externa ao Instagram não foi possível; logo e informações vieram dos anexos enviados pelo usuário.

E-mail e site comercial próprio ficam vazios e visíveis como opções desativadas, conforme a preferência anterior. Para ocultá-los, use `mostrarEmailSemLink: false` e `mostrarSiteSemLink: false`. Preencher seus dados ativa os links. Todos os links ativos usam `target="_blank"` e `rel="noopener noreferrer"`. Aplicativos de telefone, contatos e WhatsApp seguem o comportamento do aparelho.

O botão Salvar contato abre o `.vcf` sem forçar download. Em alguns aparelhos é necessário baixar e abrir/importar pelo aplicativo Contatos. Compartilhamento usa a API nativa, com cópia e link selecionável como alternativas. Nenhum contato é salvo automaticamente sem ação do visitante.

## Publicar no GitHub Pages

Envie **index.html**, **css/**, **js/** e **assets/** atualizados. Preserve os caminhos relativos. A hospedagem serve somente arquivos estáticos; Node.js é utilizado apenas no computador para preparação e prévia.

O QR e o compartilhamento continuam apontando para a URL pública existente. A versão local não altera automaticamente o site publicado: é necessário enviar os arquivos para o GitHub e aguardar a atualização do Pages.

Não publique node_modules, .qa, scripts, tests ou os arquivos internos do cartão. Use HTTPS e MIME `text/vcard` para o contato quando a hospedagem permitir configurar cabeçalhos. No NFC, grave somente a URL pública.

## Cartão do estabelecimento

Os novos arquivos ficam em **arte-cartao/club-dogs/**:

- **frente.svg** e **verso.svg**: arte vetorial, 90 × 50 mm, com a logo original incorporada e QR gerado matematicamente.
- **cartao-preview.png**: apresentação de frente e verso.
- **frente.png** e **verso.png**: prévias raster de cada face, 1800 × 1000 px.
- **biosite-mobile.png** e **biosite-desktop.png**: capturas do novo site.
- **qr-original.svg**: QR isolado para o endereço público.

`preparar` regenera os **SVGs**. Os PNGs são capturas da versão entregue e não são atualizados pelo comando; após mudar dados, use os SVGs novos. As versões antigas de Yago permanecem em arte-cartao como histórico e não são a identidade atual.

A diagramação é vetorial para manter textos e QR precisos. Antes da produção física, a gráfica deve ajustar as medidas ao cartão NFC real, definir sangria e área segura, verificar as fontes e conferir a prova. Não imprimir a apresentação com os dois lados como se fosse uma única face.

## Verificações

```powershell
npm.cmd test
```

Oito testes aprovados: contato do estabelecimento, consistência do telefone, vCard com caracteres especiais, preparação sincronizada, omissão/ativação de links e alternativas de compartilhamento. Layout verificado no Chrome em 320, 375, 390, 768 e 1280 px, sem rolagem horizontal, com controles de pelo menos 44 px e navegação por teclado.

QRs da captura do site, do verso e da apresentação do cartão decodificados com jsQR e comparados à URL pública. Validação em aparelho físico e prova impressa ainda deve ser feita. Safari/iPhone, importação na agenda, leitor de tela e prévia real do WhatsApp não foram testados em aparelhos nesta sessão.

## Imagens e identidade

Logo original: `5078158267967540533.jpg`, copiada para **assets/logo-club-dogs.jpg**, sem redesenhar a marca; recorte circular feito por CSS e máscara SVG. Referência de conteúdo: captura `5078158267967540534.jpg` fornecida pelo usuário.

Capa: **assets/pets-club-dogs.jpg**, ilustração criada com a ferramenta integrada image_gen e comprimida para 960 × 640 px. Briefing: cão e gato amigáveis em cenário lilás/rosa, estética editorial 3D, luz suave, espaço livre à esquerda e nenhum texto ou logo. A logo do estabelecimento não foi recriada por IA.

Para uma instalação nova: Node.js 22+ e `npm.cmd ci` antes de usar os comandos. A única dependência de preparação é qrcode; não há bibliotecas externas carregadas pelo site.
