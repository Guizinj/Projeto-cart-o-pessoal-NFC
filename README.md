# Club Dog's

Site estático, sem instalação, Node.js, npm ou preparação. Abra **index.html** no navegador. Para publicar, envie index.html, css/, js/ e assets/ ao GitHub Pages ou outra hospedagem estática com HTTPS.

## Editar

- **index.html**: textos, contatos, links, serviços, preços, horários e metadados de compartilhamento. Tudo já está pronto para exibição.
- **css/style.css**: aparência e responsividade.
- **js/app.js**: compartilhamento e mensagens de agendamento. Não precisa editar ao trocar nomes ou preços.
- **assets/**: logo, ilustração da capa, fotos reais, QR e contato da agenda.
- **arte-cartao/club-dogs/**: frente aprovada e verso com logo, QR Code e NFC em SVG e PNG. O QR do verso abre a mesma URL pública do site.

Para mudar um serviço, altere seu título `<h3>` e o preço em `<strong>` no HTML. Mantenha ou retire o trecho `service-price-prefix` com “A partir de”, conforme necessário. Duplique ou remova um bloco `<li class="service-item">` para adicionar ou excluir opções. O JavaScript lê os dados visíveis e monta a mensagem do WhatsApp automaticamente.

Os serviços e preços ainda são fictícios. Após substituí-los pelos reais, remova o parágrafo `class="service-demo"`; isso retira a indicação de demonstração do site e das mensagens.

Ao mudar o telefone, atualize os links de WhatsApp/ligação, o número visível e **assets/contato.vcf**. O link principal de agendamento define o número usado pelos serviços. Sem JavaScript, os links de serviços abrem a conversa sem mensagem preenchida.

Se mudar a URL pública, atualize a URL canônica e os metadados no HTML, o contato VCF e a imagem **assets/qr.svg** e o QR incorporado em **arte-cartao/club-dogs/verso.svg**, atualizando também **verso.png**. O compartilhamento lê a URL canônica. No cartão NFC, grave apenas essa URL HTTPS.

Alguns celulares baixam o VCF antes de abrir a importação na agenda. Compartilhamento nativo e cópia dependem do navegador; se indisponíveis, o site mostra um link selecionável. Teste em Android/iPhone antes da entrega.

A logo e as duas fotos da seção “Quem passa por aqui” foram fornecidas pelo cliente. A capa é uma ilustração criada com image_gen, não uma foto do estabelecimento. Para trocar as fotos, substitua os arquivos ou atualize os caminhos, dimensões e textos alternativos no HTML. Os horários ficam na seção “Horários de funcionamento”, também no HTML. A frente e o verso do cartão são de 90 × 50 mm, sem sangria; confirme a medida com a gráfica antes de imprimir.
