/*
 * Le Manine — conversões do Google Ads por profissional
 *
 * Como instalar:
 * 1) No <head> de todas as páginas, cole a tag global do Google Ads
 *    (Metas > Conversões > qualquer ação > "Configurar a tag" > "Instalar você mesmo"):
 *
 *    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18536467116"></script>
 *    <script>
 *      window.dataLayer = window.dataLayer || [];
 *      function gtag(){dataLayer.push(arguments);}
 *      gtag('js', new Date());
 *      gtag('config', 'AW-18536467116');
 *    </script>
 *
 * 2) Logo antes de </body>, inclua este arquivo:
 *    <script src="/assets/js/conversoes-le-manine.js" defer></script>
 *
 * 3) ID e os 5 rótulos já preenchidos.
 */
(function () {
  var AW_ID = 'AW-18536467116';

  // Ordem importa: o primeiro nome encontrado no link define a conversão.
  var REGRAS = [
    { chave: 'gabriella', rotulo: 'Ml4ACJqVlK8dEKyV8IZF', match: /gabriella/i },
    { chave: 'bianca',    rotulo: 'hah7CJiFla8dEKyV8IZF', match: /bianca/i },
    { chave: 'alyne',     rotulo: 'V65ZCIGYka8dEKyV8IZF', match: /alyne/i }
  ];
  // Rótulo vazio = não envia conversão (o clique segue normal)
  var ROTULO_GERAL    = '9A96CMqzjK8dEKyV8IZF';
  var ROTULO_TELEFONE = 'kY23COajla8dEKyV8IZF';

  function decodificar(href) {
    try { return decodeURIComponent(href.replace(/\+/g, ' ')); } catch (e) { return href; }
  }

  function enviar(rotulo, profissional, aoTerminar) {
    var feito = false;
    function fim() { if (!feito) { feito = true; if (aoTerminar) aoTerminar(); } }
    if (typeof window.gtag !== 'function') { fim(); return; }
    if (!rotulo) {
      window.gtag('event', profissional === 'telefone' ? 'clique_telefone' : 'clique_whatsapp', { profissional: profissional });
      fim(); return;
    }
    window.gtag('event', 'conversion', {
      send_to: AW_ID + '/' + rotulo,
      event_callback: fim
    });
    // Evento auxiliar (útil se o GA4 também estiver instalado)
    window.gtag('event', profissional === 'telefone' ? 'clique_telefone' : 'clique_whatsapp', { profissional: profissional });
    setTimeout(fim, 800); // não segura a navegação mais que 0,8 s
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var rotulo = null, profissional = null;

    if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) {
      var texto = decodificar(href);
      profissional = 'geral';
      rotulo = ROTULO_GERAL;
      for (var i = 0; i < REGRAS.length; i++) {
        if (REGRAS[i].match.test(texto)) {
          profissional = REGRAS[i].chave;
          rotulo = REGRAS[i].rotulo;
          break;
        }
      }
    } else if (/^tel:/i.test(href)) {
      profissional = 'telefone';
      rotulo = ROTULO_TELEFONE;
    } else {
      return;
    }

    var novaAba = a.target === '_blank' || ev.ctrlKey || ev.metaKey || ev.shiftKey;
    if (novaAba) {
      enviar(rotulo, profissional); // a página continua aberta; não precisa esperar
      return;
    }
    // Mesma aba: espera o envio (ou 0,8 s) antes de sair da página
    ev.preventDefault();
    enviar(rotulo, profissional, function () { window.location.href = href; });
  }, true);
})();
