function generateCaptcha(length = 6) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let captcha = '';
      for (let i = 0; i < length; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return captcha;
    }

    let currentCaptcha = '';

    function setCaptcha() {
        currentCaptcha = generateCaptcha();
        document.getElementById('captchaText').textContent = currentCaptcha;
        document.getElementById('captchaInput').value = '';
        document.getElementById('captchaError').style.display = 'none';
    }

    const captchaForm = document.getElementById('captchaForm');
    const captchaInput = document.getElementById('captchaInput');
    const captchaText = document.getElementById('captchaText');
    const captchaError = document.getElementById('captchaError');
    const refreshCaptcha = document.getElementById('refreshCaptcha');

    if (captchaForm && captchaInput && captchaText && captchaError && refreshCaptcha) {
        captchaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userInput = captchaInput.value.trim().toUpperCase();
            if (userInput === currentCaptcha) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Você será redirecionado em 4 segundos...',
                    showConfirmButton: false,
                    timer: 4000
                });
                setTimeout(function() {
                    window.location.href = ".././Pagamento/index.html";
                }, 4000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'O captcha digitado está incorreto. Tente novamente.',
                    confirmButtonText: 'OK'
                });
                captchaError.style.display = 'block';
                setCaptcha();
            }
        });

        refreshCaptcha.addEventListener('click', setCaptcha);

        // chama a func
        setCaptcha();
    }