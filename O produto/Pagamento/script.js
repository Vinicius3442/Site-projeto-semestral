    let timeLeft = 60 * 60;

      function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
        `${minutes} minutos e ${seconds}s`;
        if (timeLeft > 0) {
        timeLeft--;

        if (timeLeft === 60 * 60 - 10) {
          const statusElement = document.getElementById('status');
          if (statusElement) {
            statusElement.textContent = 'Pagamento aprovado';
          }
        }   setTimeout(updateTimer, 1000);
        } else {
        document.getElementById('timer').textContent = "Expirado";
        }
      }
      updateTimer();

      setTimeout(() => {
        Swal.fire({
          title: 'Pagamento realizado!',
          text: 'Obrigado pela sua compra.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = './Obrigado/index.html';
        });
      }, 15000);

      function adicionarDiasUteis(data, diasUteis) {
  let diasAdicionados = 0;

  while (diasAdicionados < diasUteis) {
    data.setDate(data.getDate() + 1);
    const dia = data.getDay(); // 0 = domingo, 6 = sábado

    if (dia !== 0 && dia !== 6) {
      diasAdicionados++;
    }
  }

  return data;
}

function formatarDataBR(data) {
  return data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Calcula a data de entrega
const hoje = new Date();
const dataEntrega = adicionarDiasUteis(new Date(hoje), 6);

// Insere no HTML
const deliveryElement = document.getElementById('delivery-date');
if (deliveryElement) {
  deliveryElement.textContent = formatarDataBR(dataEntrega);
}
