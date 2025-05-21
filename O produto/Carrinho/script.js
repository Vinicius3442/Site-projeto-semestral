// Lista de produtos disponíveis
        const produtos = [
            {
                id: 1,
                nome: "Thermo Charger",
                preco: 66.90,
                imagem: "../../Assets/img/Modelo 3d captura.jpg"
            }
        ];

        // Variáveis de frete
        let frete = null;
        let cepDestino = "";

        // Carrinho de compras
        let cart = [
            { ...produtos[0], quantidade: 1 }
        ];

        // Renderiza a lista de produtos para pesquisa e adição
        function renderProductSearch() {
            const container = document.createElement('div');
            container.className = "mb-4";
            container.innerHTML = `
                <div class="input-group mb-2">
                    <input type="text" id="search-input" class="form-control" placeholder="Pesquisar produto...">
                    <button class="btn btn-primary" id="search-btn">Pesquisar</button>
                </div>
                <div id="search-results"></div>
            `;
            document.querySelector('main .row').prepend(container);

            document.getElementById('search-btn').onclick = searchProducts;
            document.getElementById('search-input').addEventListener('keyup', function(e) {
                if (e.key === 'Enter') searchProducts();
            });
        }

        // Pesquisa produtos e exibe resultados
        function searchProducts() {
            const termo = document.getElementById('search-input').value.trim().toLowerCase();
            const results = produtos.filter(p =>
                p.nome.toLowerCase().includes(termo)
            );
            renderSearchResults(results);
        }

        // Renderiza resultados da pesquisa
        function renderSearchResults(results) {
            const resultsDiv = document.getElementById('search-results');
            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="alert alert-warning">Nenhum produto encontrado.</div>';
                return;
            }
            resultsDiv.innerHTML = results.map(prod => `
                <div class="card mb-2">
                    <div class="card-body d-flex align-items-center">
                        <img src="${prod.imagem}" alt="${prod.nome}" style="width:50px; height:auto;" class="me-3">
                        <div class="flex-grow-1">
                            <strong>${prod.nome}</strong><br>
                            <span class="text-success">R$ ${prod.preco.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-success btn-sm" onclick="addToCart(${prod.id})">
                            <i class="fas fa-cart-plus"></i> Adicionar
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Adiciona produto ao carrinho
        function addToCart(prodId) {
            const prod = produtos.find(p => p.id === prodId);
            const idx = cart.findIndex(item => item.id === prodId);
            if (idx >= 0) {
                cart[idx].quantidade += 1;
            } else {
                cart.push({ ...prod, quantidade: 1 });
            }
            renderCart();
            Swal.fire({
                icon: 'success',
                title: 'Produto adicionado ao carrinho!',
                showConfirmButton: true,
            });
        }

        // Renderiza o carrinho
        function renderCart() {
            // Responsividade: envolve a tabela em um container responsivo
            const cartTableContainer = document.querySelector('.cart-table-container');
            if (cartTableContainer && !cartTableContainer.classList.contains('table-responsive')) {
                cartTableContainer.classList.add('table-responsive');
            }
        
            const tbody = document.getElementById('cart-items');
            tbody.innerHTML = '';
            let totalProdutos = 0;
            cart.forEach((item, idx) => {
                const itemTotal = item.preco * item.quantidade;
                totalProdutos += itemTotal;
                tbody.innerHTML += `
                    <tr>
                        <td>
                            <img src="${item.imagem}" alt="${item.nome}" style="width:60px; height:auto;" class="me-2">
                            ${item.nome}
                        </td>
                        <td><span class="text-dark">R$ ${item.preco.toFixed(2)}</span></td>
                        <td>
                            <div class="input-group input-group-sm" style="max-width:120px;">
                                <button class="btn btn-outline-secondary" onclick="updateQty(${idx}, -1)">-</button>
                                <input type="text" class="form-control text-center" value="${item.quantidade}" readonly>
                                <button class="btn btn-outline-secondary" onclick="updateQty(${idx}, 1)">+</button>
                            </div>
                        </td>
                        <td>R$ ${itemTotal.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onclick="removeItem(${idx})">
                                    <i class="fas fa-trash-alt"></i>
                                <span class="d-none d-sm-inline">Remover</span>
                            </button>
                        </td>
                    </tr>
                `;
            });

            // Medidor de frete grátis
            const medidorDivId = "medidor-frete-gratis";
            let medidorDiv = document.getElementById(medidorDivId);
            if (!medidorDiv) {
                medidorDiv = document.createElement('div');
                medidorDiv.id = medidorDivId;
                medidorDiv.className = "mb-3";
                tbody.parentElement.parentElement.insertAdjacentElement('beforebegin', medidorDiv);
            }
            const metaFreteGratis = 149.99;
            let progresso = Math.min((totalProdutos / metaFreteGratis) * 100, 100);
            let textoMedidor = totalProdutos >= metaFreteGratis
                ? `<span class="text-success fw-bold">Parabéns! Você ganhou frete grátis!</span>`
                : `<span class="text-secondary">Faltam <span class="text-primary">R$ ${(metaFreteGratis - totalProdutos).toFixed(2).replace('.', ',')}</span> para frete grátis.</span>`;
            medidorDiv.innerHTML = `
                <div class="progress mb-1" style="height: 20px;">
                    <div class="progress-bar ${totalProdutos >= metaFreteGratis ? 'bg-success' : 'bg-warning'}" role="progressbar" style="width: ${progresso}%" aria-valuenow="${progresso}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                ${textoMedidor}
            `;

            // Atualiza o valor do produto e frete na tela
            document.getElementById('cart-produto-total').innerHTML = `<span style="color: black;">Preço produto(s): <strong style="color: green;">R$ ${totalProdutos.toFixed(2)}</strong></span>`;


            let freteFinal = frete;
            if (totalProdutos >= metaFreteGratis && totalProdutos > 0) {
                freteFinal = 0;
            }
            let freteDiv = document.getElementById('frete-info');
            if (freteFinal === null) {
                freteDiv.innerHTML = `<span class="text-danger">Calcule o frete para continuar.</span>`;
            } else if (freteFinal > 0) {
                freteDiv.innerHTML = `<span class="text-primary">Frete: <strong>R$ ${freteFinal.toFixed(2)}</strong></span>`;
            } else {
                freteDiv.innerHTML = `<span class="text-success fw-bold">Frete grátis!</span>`;
            }

            // Mostra o preço final (produto + frete)
            let precoFinal = freteFinal !== null ? (totalProdutos + freteFinal) : totalProdutos;
            document.getElementById('cart-final-total').innerHTML = `<span  style="color: black;">Preço final: <strong class="text-success">R$ ${precoFinal.toFixed(2)}</strong></span>`;
        }

        // Atualiza quantidade
        function updateQty(idx, delta) {
            cart[idx].quantidade += delta;
            if (cart[idx].quantidade <= 0) {
                removeItem(idx);
            } else {
                renderCart();
                Swal.fire({
                    icon: 'success',
                    title: 'Quantidade atualizada!',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }

        // Remove item do carrinho
        function removeItem(idx) {
            cart.splice(idx, 1);
            renderCart();
            Swal.fire({
                icon: 'info',
                title: 'Produto removido do carrinho!',
                showConfirmButton: false,
                timer: 1000
            });
        }

        // Calcula frete baseado no CEP
        function calcularFrete() {
            const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
            if (cep.length !== 8) {
                Swal.fire({
                    icon: 'error',
                    title: 'CEP inválido!',
                    text: 'Por favor, insira um CEP válido.',
                });
                return;
            }
            cepDestino = cep;
            // Faixas de CEP e valores de frete
            const faixas = [
                { faixa: [[1000000, 1999999]], valor: 10 }, // SP
                { faixa: [[2000000, 2899999]], valor: 18 }, // RJ
                { faixa: [[2900000, 2999999]], valor: 18 }, // ES
                { faixa: [[3000000, 3999999]], valor: 18 }, // MG
                { faixa: [[4000000, 4899999]], valor: 22 }, // BA
                { faixa: [[5000000, 5699999]], valor: 22 }, // PE
                { faixa: [[5700000, 5799999]], valor: 22 }, // AL
                { faixa: [[5800000, 5899999]], valor: 22 }, // PB
                { faixa: [[5900000, 5999999]], valor: 22 }, // RN
                { faixa: [[6000000, 6399999]], valor: 22 }, // CE
                { faixa: [[6400000, 6499999]], valor: 22 }, // PI
                { faixa: [[6500000, 6599999]], valor: 22 }, // MA
                { faixa: [[6600000, 6889999]], valor: 25 }, // PA
                { faixa: [[6890000, 6899999]], valor: 30 }, // AP
                { faixa: [[6900000, 6929999]], valor: 30 }, // AM
                { faixa: [[6930000, 6939999]], valor: 30 }, // RR
                { faixa: [[6990000, 6999999]], valor: 30 }, // AC
                { faixa: [[7000000, 7369999]], valor: 18 }, // DF
                { faixa: [[7370000, 7679999]], valor: 18 }, // GO
                { faixa: [[7680000, 7699999]], valor: 25 }, // RO
                { faixa: [[7700000, 7799999]], valor: 25 }, // TO
                { faixa: [[7800000, 7889999]], valor: 25 }, // MT
                { faixa: [[7900000, 7999999]], valor: 25 }, // MS
                { faixa: [[8000000, 8799999]], valor: 18 }, // PR
                { faixa: [[8800000, 8999999]], valor: 18 }, // SC
                { faixa: [[9000000, 9999999]], valor: 22 } // RS
            ];
            const cepNum = parseInt(cep, 10);
            let valorFrete = 40; // valor padrão para fora das faixas
            for (const f of faixas) {
                for (const [inicio, fim] of f.faixa) {
                    if (cepNum >= inicio && cepNum <= fim) {
                        valorFrete = f.valor;
                        break;
                    }
                }
            }
            frete = valorFrete;
            renderCart();
            Swal.fire({
                icon: 'success',
                title: 'Frete calculado!',
                text: `O valor do frete é R$ ${frete.toFixed(2)}`,
                timer: 1500,
                showConfirmButton: false
            });
        }

        // Finalizar compra com SweetAlert e redirecionamento
        document.addEventListener('DOMContentLoaded', function() {
            const finalizarBtn = document.getElementById('finalizar-compra-btn');
            if (finalizarBtn) {
                finalizarBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (frete === null) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Calcule o frete!',
                            text: 'Você precisa calcular o frete antes de finalizar a compra.',
                        });
                        return;
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Obrigado pelo pedido!',
                        text: 'Estamos redirecionando você para a página de pagamento.',
                        showConfirmButton: false,
                        timer: 4000
                    });
                    setTimeout(function() {
                        // Aqui você pode redirecionar para a página de pagamento, por exemplo:
                        window.location.href = "pagina-de-pagamento.html";
                    }, 4000);
                });
            }
        });

        // Inicialização
        window.onload = function() {
            renderProductSearch();
            renderCart();
            // Adiciona CSS para responsividade da tabela
            const style = document.createElement('style');
            style.innerHTML = `
                .cart-table-container.table-responsive {
                    overflow-x: auto;
                }
                .cart-table-container table {
                    min-width: 600px;
                }
                @media (max-width: 576px) {
                    .cart-table-container table {
                        min-width: 400px;
                        font-size: 0.95rem;
                    }
                    .cart-table-container td, .cart-table-container th {
                        padding: 0.3rem;
                    }
                }
            `;
            document.head.appendChild(style);
        };

        // Campo de CEP e botão de calcular frete
        window.addEventListener('DOMContentLoaded', () => {
            const cartTable = document.querySelector('.cart-table-container');
            const freteCalcDiv = document.createElement('div');
            freteCalcDiv.className = 'input-group mb-3';
            freteCalcDiv.innerHTML = `
                <input type="text" id="cep-input" class="form-control" placeholder="Digite seu CEP para calcular o frete">
                <button class="btn btn-outline-primary" onclick="calcularFrete()">Calcular Frete</button>
            `;
            cartTable.insertBefore(freteCalcDiv, cartTable.firstChild);
        });