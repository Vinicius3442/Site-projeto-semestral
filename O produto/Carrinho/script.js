const precoUnitario = 79.90;
const fretes = { sp: 15, rj: 20, mg: 22, outros: 30 };
let quantidade = 1;
let estado = 'sp';

function atualizarCarrinho() {
    const subtotal = precoUnitario * quantidade;
    let frete = fretes[estado];
    let freteGratis = false;
    if (subtotal > 169) {
        frete = 0;
        freteGratis = true;
    }
    const total = subtotal + frete;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('frete').textContent = freteGratis ? 'Grátis' : `R$ ${frete.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;

    // Barra de progresso
    let progresso = Math.min((subtotal / 100) * 100, 100);
    document.getElementById('progressBar').style.width = `${progresso}%`;
    document.getElementById('progressBar').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('progressBar').classList.toggle('bg-success', freteGratis);

    // Mensagem de frete
    document.getElementById('freteMsg').textContent = freteGratis
        ? 'Parabéns! Você ganhou frete grátis.'
        : `Faltam R$ ${(100 - subtotal > 0 ? (100 - subtotal).toFixed(2) : '0,00')} para frete grátis.`;
}

document.getElementById('increment').onclick = () => {
    quantidade++;
    document.getElementById('quantity').value = quantidade;
    atualizarCarrinho();
};

document.getElementById('decrement').onclick = () => {
    if (quantidade > 1) {
        quantidade--;
        document.getElementById('quantity').value = quantidade;
        atualizarCarrinho();
    }
};

document.getElementById('estado').onchange = (e) => {
    estado = e.target.value;
    atualizarCarrinho();
};

document.getElementById('addToCart').onclick = () => {
    Swal.fire({
        icon: 'success',
        title: 'Produto adicionado!',
        text: `Você adicionou ${quantidade} ThermoCharger(s) ao carrinho.`,
        timer: 1500,
        showConfirmButton: false
    });
};

document.getElementById('finalizarCompra').onclick = () => {
    const subtotal = precoUnitario * quantidade;
    let frete = fretes[estado];
    if (subtotal > 100) frete = 0;
    const total = subtotal + frete;

    Swal.fire({
        title: 'Compra Finalizada!',
        html: `
            <p>Quantidade: <strong>${quantidade}</strong></p>
            <p>Redirecionando para o pagamento...</p>
        `,
        icon: 'success',
        timer: 4000,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        window.location.href = "../Pagamento/index.html";
    }, 4000);
};

atualizarCarrinho();