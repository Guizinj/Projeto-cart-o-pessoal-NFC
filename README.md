# Cartão de visita digital NFC

Mini-site estático em HTML, CSS e JavaScript puro, adaptado para Yago Santos, proprietário de petshop. Sem login, banco de dados ou serviços de QR Code em tempo de execução.

Visual inspirado na arte do cartão físico enviada pelo usuário: preto e grafite, detalhes prateados, nome em fonte serifada e curvas decorativas feitas em CSS. O QR mantém fundo branco para preservar a leitura. Os dados de contato seguem as informações fornecidas por texto, independentemente dos exemplos presentes na arte.

A versão atual prioriza o contato pessoal do Yago e inclui o nome e a localização do petshop Club Dog's. O endereço escrito ainda não foi informado. E-mail e site aparecem desativados, apenas com seus rótulos; não são incluídos no contato salvo. Telefone/WhatsApp: +55 81 99883-6422; Instagram: @yago8508. Todos os links têm `target="_blank"` e `rel="noopener noreferrer"`; chamadas, e-mail e downloads seguem o comportamento do navegador e aplicativos do aparelho.

## Preparar e visualizar

Com Node.js 22 ou superior instalado, na pasta do projeto:

```sh
npm ci
npm run preparar
npm run preview
```

Abra http://127.0.0.1:4173. Encerre o servidor com Ctrl+C. No PowerShell, se a política de scripts impedir `npm`, utilize `npm.cmd`. Abra pelo servidor local, pois módulos JavaScript não funcionam corretamente via `file://`.

## Atualizar os dados

1. Edite **js/perfil.js**. Preencha nome completo, nome próprio e sobrenome, profissão, empresa, apresentação, contatos e endereço.
2. Substitua **assets/perfil.jpg** pela foto autorizada do cliente; se mudar o nome do arquivo, ajuste `foto` e `fotoAlt`. Prefira JPEG quadrado, pelo menos 600 × 600 px, comprimido.
3. Defina **urlPublica** com a URL HTTPS definitiva, por exemplo `https://cliente.com/cartao/`. Para publicação numa pasta, inclua a barra final. Sem parâmetros ou fragmentos.
4. Execute **npm run preparar** e confira a prévia.

O script gera index.html (inclusive conteúdo e Open Graph), assets/qr.svg e assets/contato.vcf. Não edite esses arquivos gerados diretamente. Deixe um contato opcional vazio (`''`) para ocultar o botão correspondente; e-mail e site permanecem visíveis sem link quando `mostrarEmailSemLink` e `mostrarSiteSemLink` são `true`. Preencher e-mail/site ativa os respectivos links automaticamente. Para remover endereço, deixe seus campos vazios. Telefone: código internacional com `+`; WhatsApp: somente números com código do país e DDD. Instagram, site e mapa: URLs completas.

**URL pública configurada:** `https://guizinj.github.io/Projeto-cart-o-pessoal-NFC/`. Compartilhamento e QR usam exatamente `urlPublica`. Após alterar dados ou endereço, execute `npm run preparar` e envie os arquivos atualizados ao GitHub Pages. Confira os dados com o cliente antes da entrega.

Para uma futura versão focada no estabelecimento, os campos `marca`, `empresa`, `apresentacao` e `foto` permitem ajustar a identidade; redes, contatos e serviços devem refletir apenas informações confirmadas pelo cliente.

## Hospedagem estática

Envie somente **index.html**, **css/**, **js/** e **assets/**, mantendo a estrutura, para a raiz ou pasta pública da hospedagem. Não envie node_modules, templates, scripts, tests ou arquivos de configuração. Não há build de framework nem backend.

Ative HTTPS. Garanta tipos MIME corretos: JavaScript `text/javascript`, SVG `image/svg+xml`, VCF `text/vcard; charset=utf-8`. A imagem Open Graph deve estar publicamente acessível. A prévia de compartilhamento depende do cache e comportamento do WhatsApp; após trocar dados, o serviço pode levar tempo para atualizar a imagem.

No cartão NFC grave somente a URL HTTPS definitiva. Leia o QR e teste o endereço em outro aparelho antes de entregar. Mantenha essa URL estável ao atualizar o cliente.

O perfil, links, QR e download do contato funcionam sem JavaScript. Compartilhar requer JavaScript: tenta compartilhamento nativo, depois cópia e, por último, mostra o link selecionável. Cancelamento voluntário não apresenta erro.

## Verificação

```sh
npm test
```

Os testes cobrem geração sincronizada, omissão de links, URLs inseguras, vCard com caracteres especiais e dobramento UTF-8, compartilhamento nativo, cancelamento, cópia e falha de clipboard.

Validação realizada nesta versão: **7 testes automatizados aprovados** e verificações no Chrome local em 320, 375, 390, 768 e 1280 px, sem rolagem horizontal e com áreas de toque de pelo menos 44 px. Também foram conferidos carregamento das imagens, foco por teclado, download do VCF, fallback com link selecionável, cópia, cancelamento e acesso ao perfil sem JavaScript. Não foram realizados testes em aparelhos físicos ou avaliação completa com leitor de tela.

Checklist de entrega em **Safari/iPhone e Chrome/Android**, sobre HTTPS:

- Testar WhatsApp, Instagram, ligação, e-mail, mapa e site com os dados reais.
- Tocar em Salvar contato e importar; conferir nome, empresa, profissão, telefone, e-mail, endereço e site. Conforme o navegador, o VCF pode abrir no aplicativo de contatos ou ser baixado para abertura manual.
- Compartilhar com WhatsApp, conferir URL e prévia; cancelar e tentar novamente.
- Ler QR e NFC com outro aparelho, confirmando a mesma URL.
- Navegar por teclado e leitor de tela; conferir foco, rótulos e anúncio das mensagens.
- Conferir larguras de 320, 375, 390, 768 e 1280 px, sem rolagem horizontal.

Testes em aparelhos físicos, importação na agenda e prévia real no WhatsApp precisam de verificação manual após publicar. A primeira versão é entregue localmente; nenhum site foi publicado e nenhum NFC foi gravado.

## Foto do perfil

Foto fornecida pelo usuário: `5078158267967540495.jpg`, copiada para `assets/perfil.jpg`. A mesma foto é usada no perfil e nos metadados de compartilhamento. O enquadramento circular é feito por CSS, preservando o arquivo original.
