function copiarChave() {
  const chave = document.getElementById("chavePix");
  navigator.clipboard
    .writeText(chave.value)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Chave copiada!",
        text: "Você pode colar no aplicativo do banco para realizar o pagamento.",
        timer: 2000,
        showConfirmButton: false,
      });
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível copiar a chave PIX.",
      });
    });
}

function confirmarPagamento() {
  Swal.fire({
    title: "Confirmar pagamento?",
    text: "Você realizou o pagamento via PIX?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim, paguei",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ffc400",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Pagamento confirmado!",
        text: "Obrigado por sua compra. Em breve você receberá uma confirmação por e-mail.",
        confirmButtonColor: "#ffc400",
      }).then(() => {
        window.location.href = "../../../index.html";
      });
    }
  });
}
