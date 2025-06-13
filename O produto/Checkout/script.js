// Troca entre métodos de pagamento
function handlePaymentMethodChange() {
  const radioButtons = document.querySelectorAll('input[name="pagamento"]');
  radioButtons.forEach((input) => {
    input.addEventListener("change", () => {
      document.getElementById("cartao-info").style.display = input.id === "cartao" && input.checked ? "block" : "none";
    });
  });
}

// Atualização de quantidade
function updateQuantity(change) {
  const input = document.getElementById("quantity");
  let value = parseInt(input.value, 10) || 1;
  value = Math.max(1, value + change);
  input.value = value;
  updateResumo();
}

// Listener de input na quantidadE
document.getElementById("quantity").addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  updateResumo();
});

// Atualização geral do resumo do pedido
function updateResumo() {
  const unitPrice = 129.99;
  const quantity = parseInt(document.getElementById("quantity").value, 10) || 1;
  const subtotal = unitPrice * quantity;
  document.getElementById("subtotal").textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

  const descontoEl = document.getElementById("desconto");
  const desconto = parseFloat(descontoEl.dataset.value || "0");

  const freteText = document.getElementById("freteResumo").textContent.replace(/[^\d,]/g, "").replace(",", ".");
  const frete = parseFloat(freteText) || 0;

  const total = subtotal - desconto + frete;
  document.getElementById("totalResumo").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Aplicação de cupom
const cuponsValidos = {
  THERMO10: 10,
  THERMO20: 20,
  FRETEGRATIS: 0,
};

function applyDiscount() {
  const inputCupom = document.getElementById("cupom");
  const cupom = inputCupom.value.trim().toUpperCase();
  const helpText = document.getElementById("cupomHelp");
  const descontoEl = document.getElementById("desconto");

  const quantity = parseInt(document.getElementById("quantity").value, 10) || 1;
  const subtotal = 129.99 * quantity;

  if (cuponsValidos.hasOwnProperty(cupom)) {
    let desconto = cuponsValidos[cupom];
    if (cupom === "FRETEGRATIS") {
      document.getElementById("frete").value = "0";
      document.getElementById("freteResumo").textContent = "R$ 0,00";
    } else {
      desconto = (desconto / 100) * subtotal;
    }
    descontoEl.textContent = `R$ ${desconto.toFixed(2).replace(".", ",")}`;
    descontoEl.dataset.value = desconto;
    helpText.textContent = "Cupom aplicado com sucesso!";
  } else {
    descontoEl.textContent = "R$ 0,00";
    descontoEl.dataset.value = "0";
    helpText.textContent = "Cupom inválido.";
  }

  updateResumo();
}

// Atualização do frete no resumo
document.getElementById("frete").addEventListener("change", function () {
  const freteValor = parseFloat(this.value);
  document.getElementById("freteResumo").textContent = `R$ ${freteValor.toFixed(2).replace(".", ",")}`;
  updateResumo();
});

// Preenchimento automático do endereço via CEP
function initCEPListener() {
  document.getElementById("cep").addEventListener("blur", () => {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((resp) => resp.json())
      .then((data) => {
        if (!data.erro) {
          document.getElementById("endereco").value = data.logradouro || "";
          document.getElementById("cidade").value = data.localidade || "";
          document.getElementById("estado").value = data.uf || "";
        }
      });
  });
}

// Processamento do pagamento e redirecionamento
function processPaymentSubmit() {
  document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;

    const routes = {
      Boleto: "./Boleto/index.html",
      PIX: "./Pix/index.html",
    };

    Swal.fire({
      icon: "success",
      title: pagamento === "Cartao" ? "Compra finalizada!" : `Pagamento via ${pagamento}!`,
      text: pagamento === "Cartao" ? "Pagamento via cartão processado." : "Você será redirecionado...",
      willClose: () => {
        window.location.href = routes[pagamento] || "../../../index.html";
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handlePaymentMethodChange();
  initCEPListener();
  processPaymentSubmit();
  updateResumo();
});
