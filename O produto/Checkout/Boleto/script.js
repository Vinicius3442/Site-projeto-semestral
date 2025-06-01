function confirmarBoleto() {
  Swal.fire({
    title: "Confirmar pagamento?",
    text: "Você já pagou o boleto?",
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
        text: "Seu pagamento foi registrado. Em breve você receberá um e-mail de confirmação.",
        confirmButtonColor: "#ffc400",
      }).then(() => {
        window.location.href = "../../../index.html";
      });
    }
  });
}
