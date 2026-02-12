const produtos = [
    { id: 1, nome: "Café Latte", preco: 14.90, img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300" },
    { id: 2, nome: "Capuccino Especial", preco: 12.00, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=300" },
    { id: 3, nome: "Expresso", preco: 8.50, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300" }
];

let listaItens = [];
try {
    const salvo = localStorage.getItem('itensCarrinho');
    listaItens = salvo ? JSON.parse(salvo) : [];
} catch (e) {
    listaItens = [];
}

let descontoAtivo = 0;

document.addEventListener('DOMContentLoaded', () => {
    const vitrine = document.getElementById('vitrine-produtos');
    const valorTotalHtml = document.getElementById('valor-total');
    const contadorHtml = document.getElementById('carrinho-count');
    const listaHtml = document.getElementById('lista-itens-carrinho');
    const lateral = document.getElementById('carrinho-lateral');

    function renderizarVitrine() {
        if (!vitrine) return;
        vitrine.innerHTML = produtos.map(p => `
            <div class="menu-card">
                <img src="${p.img}" alt="${p.nome}">
                <div class="content">
                    <h3>${p.nome}</h3>
                    <p class="price">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-pedido" data-id="${p.id}">Adicionar</button>
                </div>
            </div>
        `).join('');
    }

    function atualizarCarrinhoUI() {
        if (contadorHtml) contadorHtml.innerText = listaItens.reduce((acc, i) => acc + i.quantidade, 0);
        
        if (listaHtml) {
            if (listaItens.length === 0) {
                listaHtml.innerHTML = `<p style="text-align:center; padding:20px; opacity:0.5;">Carrinho Vazio</p>`;
            } else {
                listaHtml.innerHTML = listaItens.map((item, index) => `
                    <li class="carrinho-item">
                        <div><strong>${item.nome}</strong><br><small>R$ ${item.preco.toFixed(2).replace('.', ',')}</small></div>
                        <div class="carrinho-item-controles">
                            <button class="btn-acao" onclick="alterarQtd(${index}, -1)">-</button>
                            <span>${item.quantidade}</span>
                            <button class="btn-acao" onclick="alterarQtd(${index}, 1)">+</button>
                        </div>
                    </li>
                `).join('');
            }
        }

        const subtotal = listaItens.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
        const totalFinal = subtotal * (1 - descontoAtivo);
        if (valorTotalHtml) valorTotalHtml.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
        localStorage.setItem('itensCarrinho', JSON.stringify(listaItens));
    }

    // BUSCA
    document.getElementById('input-busca')?.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-card').forEach(card => {
            const nome = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = nome.includes(termo) ? "block" : "none";
        });
    });

    // CLIQUE NA VITRINE
    vitrine?.addEventListener('click', (e) => {
        const botao = e.target.closest('.btn-pedido');
        if (botao) {
            const id = parseInt(botao.getAttribute('data-id'));
            const p = produtos.find(item => item.id === id);
            if (p) {
                const noCarrinho = listaItens.find(i => i.id === id);
                if (noCarrinho) noCarrinho.quantidade++;
                else listaItens.push({...p, quantidade: 1});
                
                const textoOriginal = botao.innerHTML;
                botao.innerHTML = "Adicionado! ✅";
                botao.style.backgroundColor = "#27ae60";
                botao.style.color = "white";
                botao.style.pointerEvents = "none";

                setTimeout(() => {
                    botao.innerHTML = textoOriginal;
                    botao.style.backgroundColor = "";
                    botao.style.color = "";
                    botao.style.pointerEvents = "auto";
                }, 800);

                atualizarCarrinhoUI();
            }
        }
    });

    // CUPOM
    const btnCupom = document.getElementById('btn-aplicar-cupom');
    if(btnCupom) {
        btnCupom.onclick = () => {
            const cod = document.getElementById('input-cupom').value.toUpperCase();
            descontoAtivo = (cod === "CAFEZINHO") ? 0.10 : 0;
            const msg = document.getElementById('msg-cupom');
            if(msg) {
                msg.innerText = descontoAtivo > 0 ? "CUPOM ATIVO" : "INVÁLIDO";
                msg.style.color = descontoAtivo > 0 ? "green" : "red";
            }
            atualizarCarrinhoUI();
        };
    }

    // WHATSAPP
    document.getElementById('finalizar-compra').onclick = () => {
        if (listaItens.length === 0) return alert("Carrinho vazio!");
        const total = valorTotalHtml.innerText;
        const itens = listaItens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
        const msg = encodeURIComponent(`☕ *Novo Pedido Rio Coffee*\n\nItens: ${itens}\nTotal: ${total}`);
        window.open(`https://wa.me/5521999999999?text=${msg}`, '_blank');
    };

    window.alterarQtd = (idx, delta) => {
        listaItens[idx].quantidade += delta;
        if (listaItens[idx].quantidade <= 0) listaItens.splice(idx, 1);
        atualizarCarrinhoUI();
    };

    // CONTROLES DE ABERTURA CORRIGIDOS
    document.getElementById('carrinho-btn').onclick = (e) => { 
        e.preventDefault(); 
        lateral.classList.remove('carrinho-fechado');
        lateral.classList.add('aberto'); 
    };

    document.getElementById('fechar-carrinho').onclick = () => {
        lateral.classList.remove('aberto');
        lateral.classList.add('carrinho-fechado');
    };

    document.getElementById('theme-btn').onclick = () => document.body.classList.toggle('dark-theme');

    renderizarVitrine();
    atualizarCarrinhoUI();
});