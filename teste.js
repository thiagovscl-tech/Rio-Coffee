document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const msg = document.getElementById('msg').value;

    const seuNumero = "552199999999";

    const texto = 'Olá, meu nome é ${nome}. %0A' +
                  'Meu e-mail: ${email}.%0A' +
                  'Mensagem: ${msg}.0A';

    const url = `https://api.whatsapp.com/send?phone=${seuNumero}&text=${texto}`;

    window.open(url, 'blank');
}
)