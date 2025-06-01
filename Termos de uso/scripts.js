document.getElementById("acceptForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (document.getElementById("acceptTerms").checked) {
    Swal.fire({
      icon: "success",
      title: "Termos aceitos!",
      text: "Obrigado por aceitar os Termos de Uso e a Política de Tratamento de Dados.",
      confirmButtonColor: "#f7b600",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../index.html";
      }
    });
  }
});
