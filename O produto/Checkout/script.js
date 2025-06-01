// pagamento.js
function handlePaymentMethodChange() {
  document.querySelectorAll('input[name="pagamento"]').forEach((input) => {
    input.addEventListener("change", () => {
      document.getElementById("cartao-info").style.display =
        input.id === "cartao" ? "block" : "none";
    });
  });
}
function updateQuantity(change) {
  const input = document.getElementById("quantity");
  let value = parseInt(input.value, 10) || 1;
  value += change;
  if (value < 1) {
    value = 1;
  }
  input.value = value;
  updateResumo();
}
document.getElementById("quantity").addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  updateResumo();
});
function updateResumo() {
  const unitPrice = 66.99;
  const quantity = parseInt(document.getElementById("quantity").value, 10) || 1;
  const subtotal = unitPrice * quantity;
  document.getElementById("subtotal").textContent = `R$ ${subtotal
    .toFixed(2)
    .replace(".", ",")}`;
  let desconto = document
    .getElementById("desconto")
    .textContent.replace(/[^\d,]/g, "")
    .replace(",", ".");
  desconto = parseFloat(desconto) || 0;
  let frete = document
    .getElementById("freteResumo")
    .textContent.replace(/[^\d,]/g, "")
    .replace(",", ".");
  frete = parseFloat(frete) || 0;
  const total = subtotal - desconto + frete;
  document.getElementById("totalResumo").textContent = `R$ ${total
    .toFixed(2)
    .replace(".", ",")}`;
}

function processPaymentSubmit() {
  document
    .getElementById("checkoutForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const pagamento = document.querySelector(
        'input[name="pagamento"]:checked'
      ).value;

      const routes = {
        Boleto: "./Boleto/index.html",
        PIX: "./Pix/index.html",
      };

      Swal.fire({
        icon: "success",
        title:
          pagamento === "Cartao"
            ? "Compra finalizada!"
            : `Pagamento via ${pagamento}!`,
        text:
          pagamento === "Cartao"
            ? "Pagamento via cartão processado."
            : `Você será redirecionado para a página de início.`,
        willClose: () => {
          if (pagamento === "Boleto" || pagamento === "PIX") {
            window.location.href = routes[pagamento];
          } else {
            window.location.href = "../../../index.html";
          }
        },
      });
    });
}

// endereco.js
function initCEPListener() {
  document.getElementById("cep").addEventListener("blur", () => {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((resp) => resp.json())
      .then((data) => {
        if (!data.erro) {
          document.getElementById("endereco").value = data.logradouro;
          document.getElementById("cidade").value = data.localidade;
          document.getElementById("estado").value = data.uf;
        }
      });
  });
}

// resumo.js
const cuponsValidos = {
  THERMO10: 10,
  THERMO20: 20,
  FRETEGRATIS: 0,
};

function applyDiscount() {
  const cupom = document.getElementById("cupom").value.trim().toUpperCase();
  const desconto = cuponsValidos[cupom] || 0;

  document.getElementById("desconto").dataset.value = desconto;
  document.getElementById("cupomHelp").textContent = desconto
    ? "Cupom aplicado com sucesso!"
    : "Cupom inválido.";

  updateResumo();
}

function updateResumo() {
  const unitPrice = 66.99;
  const quantity = parseInt(document.getElementById("quantity").value) || 1;
  const freteInput = document.getElementById("frete");
  const frete = parseFloat(freteInput.value);
  const validFrete = isNaN(frete) ? 0 : frete;
  const desconto =
    parseFloat(document.getElementById("desconto").dataset.value) || 0;

  const subtotal = unitPrice * quantity;
  const total = subtotal + validFrete - desconto;

  document.getElementById("subtotal").textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById("freteResumo").textContent = `R$ ${validFrete.toFixed(
    2
  )}`;
  document.getElementById("desconto").textContent = `R$ ${desconto.toFixed(2)}`;
  document.getElementById("totalResumo").textContent = `R$ ${total.toFixed(2)}`;
}

function initResumoListeners() {
  document.getElementById("frete").addEventListener("change", updateResumo);
  ["input", "change"].forEach((evt) => {
    document.getElementById("quantity").addEventListener(evt, updateResumo);
    document.getElementById("cupom").addEventListener(evt, updateResumo);
  });
  document.getElementById("desconto").dataset.value = 0;
  updateResumo();
}

document.addEventListener("DOMContentLoaded", () => {
  handlePaymentMethodChange();
  processPaymentSubmit();
  initCardBrandDetection();
  initCEPListener();
  initResumoListeners();
});
// Máscara para número do cartão
document.addEventListener("DOMContentLoaded", function () {
  const numeroCartao = document.getElementById("numero-cartao");
  if (numeroCartao) {
    numeroCartao.addEventListener("input", function (e) {
      let value = this.value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      this.value = value.trim();
    });
  }
  // Máscara para validade MM/AA com validação de ano mínimo 2025 e mês máximo 12
  const validade = document.getElementById("validade");
  if (validade) {
    validade.addEventListener("input", function (e) {
      let value = this.value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
      this.value = value;
    });
    validade.addEventListener("blur", function (e) {
      const val = this.value;
      const match = /^(\d{2})\/(\d{2})$/.exec(val);
      if (match) {
        let mes = parseInt(match[1], 10);
        let ano = parseInt(match[2], 10);
        // Considera anos 2000+
        ano += 2000;
        if (ano < 2025 || mes < 1 || mes > 12) {
          this.setCustomValidity(
            "Data de validade mínima: 01/25 e mês máximo: 12"
          );
        } else {
          this.setCustomValidity("");
        }
      } else {
        this.setCustomValidity("Formato inválido. Use MM/AA");
      }
    });
  }
  // Máscara para CVV
  const cvv = document.getElementById("cvv");
  if (cvv) {
    cvv.addEventListener("input", function (e) {
      this.value = this.value.replace(/\D/g, "").slice(0, 4);
    });
  }
});
