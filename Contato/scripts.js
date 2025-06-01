var form = document.getElementById("contactForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  Swal.fire({
    icon: "success",
    title: "Mensagem enviada!",
    text: "Obrigado por entrar em contato. Retornaremos em breve.",
    showConfirmButton: false,
    timer: 3000,
  });
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 3000);
});
