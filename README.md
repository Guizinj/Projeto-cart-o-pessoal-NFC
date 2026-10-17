# Club Dog's — bio-site e cartão NFC

Site estático em HTML, CSS e JavaScript puro. Sem frameworks, login ou banco de dados. A seção de contatos contém somente WhatsApp, Instagram, ligação e localização; todos os links abrem em nova aba.

## Visualizar e atualizar

Abra `index.html` para conferir o visual. Para testar também o compartilhamento, execute na pasta do projeto:

```powershell
npm.cmd run preview
```

Acesse **http://127.0.0.1:4173**. Deixe o terminal aberto e encerre com **Ctrl+C**.

Edite os dados em **js/perfil.js** e depois execute:

```powershell
npm.cmd run preparar
```

O comando atualiza `index.html`, o QR, o contato `.vcf` e a frente vetorial do cartão. Não edite o HTML gerado diretamente: altere os dados em `js/perfil.js` ou a estrutura em `templates/index.html`.

Em uma instalação nova, use Node.js 22+ e rode `npm.cmd ci` antes. A dependência qrcode é usada somente na preparação local; o site publicado não depende de Node.js nem de serviços externos para gerar o QR.

## Serviços e valores

O catálogo tem 12 opções fictícias autorizadas para demonstração. Edite a lista `servicos` em `js/perfil.js`:

```js
{ nome: 'Banho · porte pequeno', preco: 45, aPartirDe: true },
{ nome: 'Corte de unhas', preco: 15 },
{ nome: 'Serviço personalizado', preco: null }
```

Preço: número em reais, sem `R$`; use ponto nos centavos (`49.90`). `aPartirDe: true` mostra o prefixo. Preço vazio (`null` ou omitido) exibe “Sob consulta”. Cada serviço abre o WhatsApp com seu nome e valor, sem enviar a mensagem automaticamente.

Depois de preencher nomes e preços reais, altere `servicosDemonstrativos` para `false` e execute `preparar`. Enquanto for `true`, o site e a mensagem identificam os valores como demonstrativos.

## Publicação

Envie somente **index.html**, **css/**, **js/** e **assets/** ao GitHub Pages, mantendo a estrutura. A URL configurada é https://guizinj.github.io/Projeto-cart-o-pessoal-NFC/. Se mudar de endereço, atualize `urlPublica` e prepare novamente. QR e NFC devem apontar para essa URL HTTPS estável.

O preparo local não publica automaticamente. Não envie node_modules, scripts, templates, tests ou arte-cartao para a pasta pública.

## Contatos e imagens

- WhatsApp/ligação: **(81) 98872-6029** (`+5581988726029`).
- Instagram: **@clubdog.s**, https://www.instagram.com/clubdog.s/.
- Cidade: Caruaru, PE. O mapa informado pelo usuário foi mantido; confirme o destino com o cliente. O endereço completo ainda não foi informado.
- Logo: **assets/logo-club-dogs.jpg**, fornecida pelo usuário, preservada com recorte circular por CSS/SVG.
- Capa: **assets/pets-club-dogs.jpg**, ilustração criada com image_gen, 960 × 640 px. Briefing: cão e gato amigáveis, cenário lilás/rosa, luz suave, espaço à esquerda, sem texto ou logo. Não é uma foto do estabelecimento.

Salvar contato abre um vCard com o nome do estabelecimento. Alguns aparelhos baixam o arquivo antes da importação pelo aplicativo Contatos. Compartilhar usa a API nativa, depois cópia e, por fim, link selecionável.

## Frente do cartão

Somente **arte-cartao/club-dogs/frente.svg** e **frente.png** foram mantidos. O SVG é regenerado pelo comando `preparar`; o PNG é a prévia aprovada. Medida atual: 90 × 50 mm, sem sangria. Ajuste dimensões, fontes e acabamento com a gráfica antes de imprimir.

## Validação e organização

`npm.cmd test` executa os testes de geração, contato, links, compartilhamento e catálogo. Foram conferidos layout e navegação nas larguras de 320, 375, 390, 768 e 1280 px. O QR do site passou na decodificação. Testes em iPhone/Android físicos, importação na agenda e prévia real do WhatsApp continuam sendo verificações de entrega.

Mantidos: arquivos publicados, dados, modelos e scripts de manutenção, testes úteis, dependências necessárias, frente aprovada, histórico Git e configuração do Live Server. Removidos: ferramentas temporárias de QA, capturas antigas, foto pessoal sem uso, documentos duplicados e código de funcionalidades descartadas.
