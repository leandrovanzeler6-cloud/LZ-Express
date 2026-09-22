/* =========================================
   NAVEGAÇÃO INICIAL
========================================= */

function entrar() {
    window.location.href = "paginas/login.html";
}

function criarConta() {
    window.location.href = "paginas/cadastro.html";
}

function voltarInicio() {
    window.location.href = "../index.html";
}


/* =========================================
   SENHAS
========================================= */

function mostrarSenha() {

    const senha = document.getElementById("senha");

    if (!senha) return;

    senha.type =
        senha.type === "password"
            ? "text"
            : "password";
}


function mostrarSenhaCadastro() {

    const senha =
        document.getElementById("senhaCadastro");

    if (!senha) return;

    senha.type =
        senha.type === "password"
            ? "text"
            : "password";
}


function mostrarConfirmarSenha() {

    const senha =
        document.getElementById("confirmarSenha");

    if (!senha) return;

    senha.type =
        senha.type === "password"
            ? "text"
            : "password";
}


function esqueciSenha() {

    alert(
        "A recuperação de senha será configurada quando conectarmos o Firebase."
    );
}


/* =========================================
   LOGIN / CADASTRO
========================================= */

function irParaLogin() {
    window.location.href = "login.html";
}


const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("emailCadastro").value.trim();
        const senha = document.getElementById("senhaCadastro").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const mensagemErro = document.getElementById("mensagemErro");
        const botaoCadastrar = formCadastro.querySelector(".botao-cadastrar");

        mensagemErro.textContent = "";

        // Verifica se as senhas são iguais
        if (senha !== confirmarSenha) {
            mensagemErro.textContent = "As senhas não coincidem.";
            return;
        }

        // Verifica tamanho da senha
        if (senha.length < 6) {
            mensagemErro.textContent =
                "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        // Evita vários cliques
        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = "CRIANDO CONTA...";

        // Cria a conta no Firebase
        const resultado = await window.criarContaFirebase(
            nome,
            email,
            senha
        );

        if (!resultado.sucesso) {
            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = "CADASTRAR";

            switch (resultado.erro.code) {
                case "auth/email-already-in-use":
                    mensagemErro.textContent =
                        "Este e-mail já está cadastrado.";
                    break;

                case "auth/invalid-email":
                    mensagemErro.textContent =
                        "Digite um e-mail válido.";
                    break;

                case "auth/weak-password":
                    mensagemErro.textContent =
                        "A senha é muito fraca.";
                    break;

                default:
                    mensagemErro.textContent =
                        "Não foi possível criar a conta. Tente novamente.";
            }

            return;
        }

        // Conta criada com sucesso
        botaoCadastrar.textContent = "CONTA CRIADA!";

        window.location.href = "tipo-conta.html";
    });
}


function voltarCadastro() {
    window.location.href = "cadastro.html";
}


async function selecionarEmpresa() {

    const resultado = await window.salvarTipoContaFirebase("empresa");

    if (!resultado.sucesso) {
        alert("Não foi possível salvar o tipo de conta. Tente novamente.");
        return;
    }

    window.location.href = "empresa.html";
}


async function selecionarEntregador() {

    const resultado = await window.salvarTipoContaFirebase("entregador");

    if (!resultado.sucesso) {
        alert("Não foi possível salvar o tipo de conta. Tente novamente.");
        return;
    }

    window.location.href = "cadastro-entregador.html";
}


/* =========================================
   EMPRESA
========================================= */

function cadastrarEmpresa() {

    window.location.href =
        "cadastro-empresa.html";
}


function voltarEmpresa() {

    window.location.href =
        "empresa.html";
}


function irParaInicioEmpresa() {

    window.location.href =
        "empresa.html";
}


/* =========================================
   CADASTRO DA EMPRESA
========================================= */

const formCadastroEmpresa =
    document.getElementById(
        "formCadastroEmpresa"
    );


if (formCadastroEmpresa) {

    const fotoEmpresaInput =
        document.getElementById("fotoEmpresa");

    if (fotoEmpresaInput) {

        fotoEmpresaInput.addEventListener("change", function() {

            const nomeArquivo =
                document.getElementById("nomeArquivoEmpresa");

            if (nomeArquivo) {

                nomeArquivo.textContent =
                    this.files[0]
                        ? this.files[0].name
                        : "Nenhum arquivo escolhido";
            }
        });
    }

    formCadastroEmpresa.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const mensagem =
                document.getElementById(
                    "mensagemCadastroEmpresa"
                );

            // FOTO DESATIVADA TEMPORARIAMENTE
            // (o Storage do Firebase ainda não foi ativado no projeto).
            // Quando ativar o Storage, é só trocar este bloco de volta
            // para ler o arquivo com FileReader e enviar no campo foto.

            function valorCampo(id) {
                const elemento = document.getElementById(id);
                return elemento ? elemento.value.trim() : "";
            }

            const empresa = {

                nome: valorCampo("nomeEmpresa"),
                categoria: valorCampo("categoriaEmpresa"),
                whatsapp: valorCampo("whatsappEmpresa"),
                rua: valorCampo("ruaEmpresa"),
                numero: valorCampo("numeroEmpresa"),
                bairro: valorCampo("bairroEmpresa"),
                cidade: valorCampo("cidadeEmpresa"),
                referencia: valorCampo("referenciaEmpresa"),
                horario: valorCampo("horarioEmpresa"),

                foto: null
            };


            const botao =
                document.querySelector(
                    ".botao-salvar-empresa"
                );

            botao.disabled = true;

            botao.textContent =
                "SALVANDO...";

            const resultado =
                await window.salvarEmpresaFirebase(empresa);

            if (!resultado.sucesso) {

                botao.disabled = false;

                botao.textContent =
                    "SALVAR CADASTRO";

                mensagem.textContent =
                    "Não foi possível salvar. Tente novamente.";

                return;
            }

            window.location.href =
                "cadastro-empresa-sucesso.html";
        }
    );
}


/* =========================================
   VERIFICAR EMPRESA CADASTRADA
========================================= */

async function carregarEmpresaInicio() {

    const empresa =
        await window.obterEmpresaFirebase();

    const cardCadastro =
        document.getElementById(
            "cardCadastrarEmpresa"
        );

    const menuRegistrada =
        document.getElementById(
            "menuEmpresaRegistrada"
        );

    const saudacao =
        document.querySelector(
            ".saudacao"
        );

    if (saudacao) {

        const usuario =
            JSON.parse(
                localStorage.getItem("usuarioLZ")
            );

        if (usuario && usuario.nome) {

            const primeiroNome =
                usuario.nome.split(" ")[0];

            saudacao.textContent =
                `Olá, ${primeiroNome}! 👋`;
        }
    }


    if (!empresa) {

        if (cardCadastro) cardCadastro.style.display = "block";
        if (menuRegistrada) menuRegistrada.style.display = "none";

        return;
    }


    if (cardCadastro) cardCadastro.style.display = "none";
    if (menuRegistrada) menuRegistrada.style.display = "block";

}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("empresa.html")) {
        carregarEmpresaInicio();
    }
});


/* =========================================
   MENU EMPRESA
========================================= */

function abrirEntregasEmpresa() {

    window.location.href =
        "entregas-empresas.html";
}


function solicitarEntrega() {

    window.location.href =
        "solicitar-entrega.html";
}


/* =========================================
   LISTA DE ENTREGAS DA EMPRESA (com abas)
========================================= */

let entregasEmpresaCache = [];

function corDoStatusEmpresa(status) {

    if (status === "solicitada") return "solicitada";
    if (status === "entregue") return "entregue";
    return "em-andamento";
}

function textoDoStatusEmpresa(status) {

    if (status === "solicitada") return "Solicitada";
    if (status === "em_andamento") return "Em andamento";
    if (status === "em_rota") return "Em rota";
    if (status === "entregue") return "Entregue";
    return status;
}

function renderizarCardEntregaEmpresa(entrega) {

    return `
        <div class="card-entrega-empresa">

            <div class="topo-card-entrega-empresa">

                <strong>#${String(entrega.numero).slice(-6)}</strong>

                <span class="selo-status-empresa ${corDoStatusEmpresa(entrega.status)}">
                    ${textoDoStatusEmpresa(entrega.status)}
                </span>

            </div>

            <p class="linha-card-entrega-empresa">
                <strong>Cliente:</strong> ${entrega.cliente}
            </p>

            <p class="linha-card-entrega-empresa">
                <strong>Bairro:</strong> ${entrega.destino.bairro}
            </p>

            <p class="linha-card-entrega-empresa valor-card-entrega-empresa">
                Valor: R$ ${(entrega.valor || 0).toFixed(2).replace(".", ",")}
            </p>

            <button
                class="botao-ver-detalhes-empresa"
                onclick="verDetalhesEntregaEmpresa('${entrega.id}')">
                VER DETALHES
            </button>

        </div>
    `;
}

function renderizarListaEntregasEmpresa(tipo) {

    const container =
        document.getElementById("listaEntregasEmpresa");

    if (!container) return;

    const filtradas =
        entregasEmpresaCache.filter((entrega) =>
            tipo === "concluidas"
                ? entrega.status === "entregue"
                : entrega.status !== "entregue"
        );

    if (filtradas.length === 0) {

        container.innerHTML = `
            <div class="sem-entregas-empresa">
                <div class="icone">📦</div>
                <p>
                    ${tipo === "concluidas"
                        ? "Nenhuma entrega concluída ainda."
                        : "Nenhuma entrega ativa no momento."}
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        filtradas.map(renderizarCardEntregaEmpresa).join("");
}

function filtrarEntregasEmpresa(tipo) {

    const abaAtivas = document.getElementById("abaAtivasEmpresa");
    const abaConcluidas = document.getElementById("abaConcluidasEmpresa");

    if (abaAtivas && abaConcluidas) {
        abaAtivas.classList.toggle("ativa", tipo === "ativas");
        abaConcluidas.classList.toggle("ativa", tipo === "concluidas");
    }

    renderizarListaEntregasEmpresa(tipo);
}

function verDetalhesEntregaEmpresa(id) {

    localStorage.setItem("entregaAtualId", id);

    window.location.href =
        "entrega-andamento.html";
}

async function carregarListaEntregasEmpresa() {

    const container =
        document.getElementById("listaEntregasEmpresa");

    if (!container) return;

    if (!window.obterEntregasEmpresaFirebase) return;

    entregasEmpresaCache =
        await window.obterEntregasEmpresaFirebase();

    renderizarListaEntregasEmpresa("ativas");
}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("entregas-empresas.html")) {
        carregarListaEntregasEmpresa();
    }
});


async function abrirEntregasAndamento() {

    const entrega =
        await window.obterEntregaAtualEmpresaFirebase();

    if (!entrega) {

        alert(
            "No momento não existe nenhuma entrega em andamento."
        );

        return;
    }

    localStorage.setItem(
        "entregaAtualId",
        entrega.id
    );

    window.location.href =
        "entrega-andamento.html";
}


function abrirHistoricoEmpresa() {

    window.location.href =
        "historico-empresa.html";
}


/* =========================================
   SOLICITAR ENTREGA
========================================= */

async function carregarEnderecoRetirada() {

    const nomeLoja =
        document.getElementById("retiradaNomeLoja");

    const resumo =
        document.getElementById("retiradaResumo");

    if (!nomeLoja || !resumo) return;

    const empresa =
        await window.obterEmpresaFirebase();

    if (!empresa) {

        resumo.textContent =
            "Cadastre sua empresa primeiro.";

        return;
    }

    nomeLoja.textContent =
        empresa.nome;

    resumo.textContent =
        `${empresa.rua}, ${empresa.numero} - ${empresa.bairro}, ${empresa.cidade}`;


    const referenciaCompleta =
        document.getElementById("retiradaReferenciaCompleta");

    const whatsappCompleto =
        document.getElementById("retiradaWhatsappCompleto");

    if (referenciaCompleta) {
        referenciaCompleta.textContent =
            empresa.referencia
                ? `Ponto de referência: ${empresa.referencia}`
                : "Sem ponto de referência informado.";
    }

    if (whatsappCompleto) {
        whatsappCompleto.textContent =
            `WhatsApp: ${empresa.whatsapp}`;
    }
}


function alternarEnderecoCompleto() {

    const bloco =
        document.getElementById("retiradaCompleta");

    const botao =
        document.getElementById("botaoVerEndereco");

    if (!bloco || !botao) return;

    const abrindo =
        bloco.style.display === "none";

    bloco.style.display =
        abrindo ? "block" : "none";

    botao.textContent =
        abrindo ? "OCULTAR ENDEREÇO" : "VER ENDEREÇO COMPLETO";
}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("solicitar-entrega.html")) {
        carregarEnderecoRetirada();
    }
});


const formSolicitarEntrega =
    document.getElementById(
        "formSolicitarEntrega"
    );


if (formSolicitarEntrega) {

    formSolicitarEntrega.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const botao =
                formSolicitarEntrega.querySelector(
                    ".botao-solicitar"
                );

            if (botao) {
                botao.disabled = true;
                botao.textContent = "SOLICITANDO...";
            }

            const dadosDestino = {

                cliente:
                    document.getElementById(
                        "nomeCliente"
                    ).value,

                destino: {

                    rua:
                        document.getElementById(
                            "ruaDestino"
                        ).value,

                    numero:
                        document.getElementById(
                            "numeroDestino"
                        ).value,

                    complemento:
                        document.getElementById(
                            "complementoDestino"
                        ).value,

                    bairro:
                        document.getElementById(
                            "bairroDestino"
                        ).value,

                    cidade:
                        document.getElementById(
                            "cidadeDestino"
                        ).value,

                    referencia:
                        document.getElementById(
                            "referenciaDestino"
                        ).value

                },

                observacoes:
                    document.getElementById(
                        "observacoesEntrega"
                    ).value,

                valor:
                    parseFloat(
                        document.getElementById(
                            "valorEntrega"
                        ).value
                    ) || 0

            };

            const resultado =
                await window.criarEntregaFirebase(dadosDestino);

            if (!resultado.sucesso) {

                if (botao) {
                    botao.disabled = false;
                    botao.textContent = "SOLICITAR ENTREGADOR";
                }

                alert(
                    resultado.erro && resultado.erro.message
                        ? resultado.erro.message
                        : (typeof resultado.erro === "string"
                            ? resultado.erro
                            : "Não foi possível solicitar a entrega. Tente novamente.")
                );

                return;
            }

            localStorage.setItem(
                "entregaAtualId",
                resultado.id
            );

            alert(
                "Entrega solicitada! Aguardando um entregador."
            );

            window.location.href =
                "entrega-andamento.html";
        }
    );
}


/* =========================================
   ENTREGA EM ANDAMENTO
========================================= */

function carregarEntregaAtual() {

    const id =
        localStorage.getItem("entregaAtualId");

    if (!id) return;

    if (!window.observarEntregaFirebase) return;

    window.observarEntregaFirebase(id, function(entrega) {

        if (!entrega) return;

        const numero =
            document.getElementById(
                "numeroEntrega"
            );

        if (numero) {

            numero.textContent =
                "Entrega #" +
                String(entrega.numero)
                    .slice(-6);
        }


        const destino =
            document.getElementById(
                "destinoAndamento"
            );

        if (destino) {

            destino.innerHTML = `
                <strong>${entrega.cliente}</strong><br>
                ${entrega.destino.rua},
                ${entrega.destino.numero}<br>
                ${entrega.destino.bairro} -
                ${entrega.destino.cidade}
            `;
        }


        const aguardando =
            document.querySelector(
                ".aguardando-entregador"
            );

        /* ATUALIZAR OS CÍRCULOS DE STATUS */

        const ordemStatus = {
            solicitada: 1,
            em_andamento: 2,
            em_rota: 3,
            entregue: 4
        };

        const passoAtual =
            ordemStatus[entrega.status] || 1;

        for (let i = 1; i <= 4; i++) {

            const passo =
                document.getElementById(
                    "statusEmpresa" + i
                );

            if (!passo) continue;

            if (i <= passoAtual) {
                passo.classList.add("ativo");
            } else {
                passo.classList.remove("ativo");
            }
        }

        if (aguardando) {

            if (entrega.status === "solicitada") {

                aguardando.innerHTML = `
                    🛵
                    <strong>Aguardando um entregador disponível...</strong>
                    <span>Assim que um entregador aceitar, o status será atualizado.</span>
                `;

            } else if (entrega.status === "entregue") {

                aguardando.innerHTML = `
                    ✅
                    <strong>Entrega concluída!</strong>
                    <span>Confira os detalhes no histórico.</span>
                `;

            } else {

                aguardando.innerHTML = `
                    🛵
                    <strong>${entrega.entregador || "Um entregador"} está a caminho!</strong>
                    <span>Status atual: ${
                        entrega.status === "em_rota" ? "Em rota" : "Indo até sua empresa"
                    }</span>
                `;
            }
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("entrega-andamento.html")) {
        carregarEntregaAtual();
    }
});


/* =========================================
   HISTÓRICO
========================================= */

let historicoEmpresaCache = [];

async function carregarHistorico() {

    const lista =
        document.getElementById(
            "listaHistorico"
        );

    if (!lista) return;

    const historico =
        await window.obterHistoricoEmpresaFirebase();

    historicoEmpresaCache = historico;


    if (historico.length === 0) {

        lista.innerHTML = `
            <div class="card-historico">
                <h3>Nenhuma entrega ainda</h3>
                <p>
                    Quando você concluir uma entrega,
                    ela aparecerá aqui.
                </p>
            </div>
        `;

        return;
    }


    lista.innerHTML =
        historico.map(
            (entrega, index) => `

            <div class="card-historico">

                <h3>
                    Entrega #${String(
                        entrega.numero
                    ).slice(-6)}
                </h3>

                <p>
                    Cliente:
                    ${entrega.cliente}
                </p>

                <p>
                    Destino:
                    ${entrega.destino.rua},
                    ${entrega.destino.numero}
                </p>

                <p>
                    ${entrega.data}
                </p>

                <span class="status-entregue">
                    Entregue
                </span>

                <br>

                <button
                    class="botao-comprovante"
                    onclick="gerarComprovante(${index})">

                    📄 Baixar comprovante

                </button>

                <button
                    class="botao-avaliar"
                    onclick="avaliarEntregador(${index})">

                    ⭐ Avaliar entregador

                </button>

            </div>
        `
        ).join("");
}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("historico-empresa.html")) {
        carregarHistorico();
    }
});


/* =========================================
   COMPROVANTE
========================================= */

function gerarComprovante(index) {

    const entrega =
        historicoEmpresaCache[index];

    if (!entrega) return;

    const janela =
        window.open(
            "",
            "_blank"
        );

    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <title>
                Comprovante LZ Express
            </title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                    max-width: 700px;
                    margin: auto;
                }

                h1 {
                    text-align: center;
                }

                .linha {
                    border-bottom: 1px solid #ddd;
                    padding: 12px 0;
                }

                button {
                    padding: 12px 20px;
                    margin-top: 20px;
                    cursor: pointer;
                }

                @media print {
                    button {
                        display: none;
                    }
                }

            </style>

        </head>

        <body>

            <h1>LZ EXPRESS</h1>

            <h2>
                Comprovante de entrega
            </h2>

            <div class="linha">
                <strong>
                    Entrega:
                </strong>
                #${String(
                    entrega.numero
                ).slice(-6)}
            </div>

            <div class="linha">
                <strong>
                    Empresa:
                </strong>
                ${entrega.empresa}
            </div>

            <div class="linha">
                <strong>
                    Data:
                </strong>
                ${entrega.data}
            </div>

            <div class="linha">
                <strong>
                    Retirada:
                </strong>
                ${entrega.retirada.rua},
                ${entrega.retirada.numero},
                ${entrega.retirada.bairro},
                ${entrega.retirada.cidade}
            </div>

            <div class="linha">
                <strong>
                    Cliente:
                </strong>
                ${entrega.cliente}
            </div>

            <div class="linha">
                <strong>
                    Destino:
                </strong>
                ${entrega.destino.rua},
                ${entrega.destino.numero},
                ${entrega.destino.bairro},
                ${entrega.destino.cidade}
            </div>

            <div class="linha">
                <strong>
                    Observações:
                </strong>
                ${entrega.observacoes || "Nenhuma"}
            </div>

            <div class="linha">
                <strong>
                    Entregador:
                </strong>
                ${entrega.entregador || "Não informado"}
            </div>

            <div class="linha">
                <strong>
                    Status:
                </strong>
                Entregue
            </div>

            <button onclick="window.print()">
                Imprimir / Salvar como PDF
            </button>

        </body>

        </html>
    `);

    janela.document.close();
}


/* =========================================
   AVALIAÇÃO
========================================= */

async function avaliarEntregador(index) {

    const entrega =
        historicoEmpresaCache[index];

    if (!entrega) return;

    const nota =
        prompt(
            "Digite uma nota de 1 a 5 estrelas:"
        );

    if (!nota) return;

    const numero =
        Number(nota);

    if (
        numero < 1 ||
        numero > 5 ||
        isNaN(numero)
    ) {

        alert(
            "Digite uma nota entre 1 e 5."
        );

        return;
    }

    const resultado =
        await window.avaliarEntregaFirebase(entrega.id, numero);

    if (!resultado.sucesso) {
        alert("Não foi possível registrar a avaliação. Tente novamente.");
        return;
    }

    alert(
        `Obrigado! Você avaliou o entregador com ${numero} ⭐.`
    );
}


/* =========================================
   USUÁRIO
========================================= */

function abrirUsuarioEmpresa() {

    window.location.href =
        "usuario-empresa.html";
}


async function carregarPerfilEmpresa() {

    const empresa =
        await window.obterEmpresaFirebase();

    if (!empresa) return;


    const campos = {
        infoNome: empresa.nome,
        infoCategoria: empresa.categoria || "Não informado",
        infoWhatsapp: empresa.whatsapp,
        infoEndereco: `${empresa.rua}, ${empresa.numero}`,
        infoBairro: `${empresa.bairro} - ${empresa.cidade}`,
        infoReferencia: empresa.referencia || "Não informado",
        infoHorario: empresa.horario || "Não informado"
    };

    for (const id in campos) {

        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.textContent =
                campos[id] || "---";
        }
    }

}


document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.endsWith("usuario-empresa.html")) {
        carregarPerfilEmpresa();
    }
});


async function abrirDadosConta() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioLZ"
            ) || "{}"
        );

    const empresa =
        (await window.obterEmpresaFirebase()) || {};

    alert(
        `Nome: ${usuario.nome || ""}

E-mail: ${usuario.email || ""}

Empresa: ${empresa.nome || ""}

WhatsApp: ${empresa.whatsapp || ""}`
    );
}


function alterarSenha() {

    alert(
        "A alteração de senha será conectada ao Firebase."
    );
}


function abrirNotificacoes() {

    alert(
        "Você ainda não possui novas notificações."
    );
}


function abrirSobre() {

    alert(
        "LZ Express\n\n" +
        "Entregas rápidas, simples e seguras.\n\n" +
        "Plataforma desenvolvida para conectar empresas e entregadores."
    );
}


function sairDaConta() {

    const confirmar =
        confirm(
            "Deseja realmente sair da sua conta?"
        );

    if (!confirmar) return;

    if (window.sairFirebase) {
        window.sairFirebase();
    } else {
        window.location.href = "../index.html";
    }
}


/* =========================================
   NOTIFICAÇÕES
========================================= */

function abrirNotificacoes() {

    alert(
        "Você não possui novas notificações."
    );
}
/* =========================================
   CADASTRO DO ENTREGADOR
========================================= */

function voltarTipoConta() {

    window.location.href =
        "tipo-conta.html";
}


/* FOTO DO ENTREGADOR */

const fotoEntregador =
    document.getElementById(
        "fotoEntregador"
    );

if (fotoEntregador) {

    fotoEntregador.addEventListener(
        "change",
        function() {

            const arquivo =
                this.files[0];

            if (!arquivo) return;

            const leitor =
                new FileReader();

            leitor.onload = function(event) {

                const preview =
                    document.getElementById(
                        "fotoPreview"
                    );

                preview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="Foto do entregador"
                    >
                `;
            };

            leitor.readAsDataURL(arquivo);
        }
    );
}


/* =========================================
   CNH
========================================= */

function mostrarDadosCNH() {

    const opcao =
        document.querySelector(
            'input[name="possuiCNH"]:checked'
        );

    const dadosCNH =
        document.getElementById(
            "dadosCNH"
        );

    const semCNH =
        document.getElementById(
            "semCNH"
        );


    if (!opcao) return;


    if (opcao.value === "sim") {

        dadosCNH.style.display =
            "block";

        semCNH.style.display =
            "none";

    } else {

        dadosCNH.style.display =
            "none";

        semCNH.style.display =
            "block";
    }
}


/* =========================================
   CADASTRAR ENTREGADOR
========================================= */

function cadastrarEntregador() {

    const mensagem =
        document.getElementById(
            "mensagemErroEntregador"
        );


    mensagem.textContent = "";

    // FOTO DESATIVADA TEMPORARIAMENTE
    // (o Storage do Firebase ainda não foi ativado no projeto).
    // Quando ativar o Storage, é só voltar a exigir e ler o
    // arquivo de "fotoEntregador" com FileReader.

    const possuiCNH =
        document.querySelector(
            'input[name="possuiCNH"]:checked'
        ).value;


    const entregador = {

        nome:
            document.getElementById(
                "nomeEntregador"
            ).value.trim(),

        cpf:
            document.getElementById(
                "cpfEntregador"
            ).value.trim(),

        email:
            document.getElementById(
                "emailEntregador"
            ).value.trim(),

        whatsapp:
            document.getElementById(
                "whatsappEntregador"
            ).value.trim(),

        nascimento:
            document.getElementById(
                "nascimentoEntregador"
            ).value,

        endereco: {

            rua:
                document.getElementById(
                    "ruaEntregador"
                ).value.trim(),

            numero:
                document.getElementById(
                    "numeroEntregador"
                ).value.trim(),

            bairro:
                document.getElementById(
                    "bairroEntregador"
                ).value.trim(),

            cidade:
                document.getElementById(
                    "cidadeEntregador"
                ).value.trim()

        },

        possuiCNH:
            possuiCNH,

        cnh: {

            numero:
                document.getElementById(
                    "numeroCNH"
                ).value.trim(),

            categoria:
                document.getElementById(
                    "categoriaCNH"
                ).value

        },

        moto: {

            placa:
                document.getElementById(
                    "placaMoto"
                ).value.trim(),

            marca:
                document.getElementById(
                    "marcaMoto"
                ).value.trim(),

            modelo:
                document.getElementById(
                    "modeloMoto"
                ).value.trim(),

            ano:
                document.getElementById(
                    "anoMoto"
                ).value,

            cor:
                document.getElementById(
                    "corMoto"
                ).value.trim()

        },

        disponivel: false,

        foto: null

    };


    (async function() {

        const botao =
            document.querySelector(
                ".botao-cadastrar-entregador"
            );

        if (botao) {
            botao.disabled = true;
            botao.textContent = "SALVANDO...";
        }

        const resultado =
            await window.salvarEntregadorFirebase(entregador);

        if (!resultado.sucesso) {

            if (botao) {
                botao.disabled = false;
                botao.textContent = "FINALIZAR CADASTRO";
            }

            mensagem.textContent =
                "Não foi possível salvar seu cadastro. Tente novamente.";

            return;
        }

        alert(
            "Cadastro realizado com sucesso!"
        );


        window.location.href =
            "entregador.html";

    })();
}
/* =========================================
   PAINEL DO ENTREGADOR
========================================= */

async function carregarPainelEntregador() {

    pedirPermissaoNotificacao();

    const entregador =
        await window.obterEntregadorFirebase();

    if (!entregador) {
        return;
    }


    /* NOME */

    const nomeElemento =
        document.getElementById(
            "nomeEntregadorInicio"
        );

    if (nomeElemento && entregador.nome) {

        const primeiroNome =
            entregador.nome.split(" ")[0];

        nomeElemento.textContent =
            `Olá, ${primeiroNome}!`;

    }


    /* FOTO */

    const fotoElemento =
        document.getElementById(
            "fotoDisponibilidade"
        );

    if (
        fotoElemento &&
        entregador.foto
    ) {

        fotoElemento.innerHTML = `
            <img
                src="${entregador.foto}"
                alt="Foto do entregador"
            >
        `;

    }


    /* DISPONIBILIDADE */

    atualizarVisualDisponibilidade(
        entregador.disponivel
    );


    /* AVALIAÇÃO */

    const avaliacaoElemento =
        document.getElementById(
            "avaliacaoEntregador"
        );

    if (
        avaliacaoElemento &&
        typeof entregador.avaliacaoMedia === "number"
    ) {

        avaliacaoElemento.textContent =
            entregador.avaliacaoMedia
                .toFixed(1)
                .replace(".", ",") + " ⭐";
    }


    /* CORRIDAS HOJE */

    const corridasElemento =
        document.getElementById(
            "corridasHoje"
        );

    if (corridasElemento && window.obterCorridasHojeFirebase) {

        const corridas =
            await window.obterCorridasHojeFirebase();

        corridasElemento.textContent =
            String(corridas);
    }

}


/* ALTERAR DISPONIBILIDADE */

async function alternarDisponibilidade() {

    const entregador =
        await window.obterEntregadorFirebase();

    if (!entregador) {
        return;
    }

    const novoValor =
        !entregador.disponivel;


    // Se ele está DESATIVANDO, mostra antes um resumo de
    // quantas entregas ele fez nesse turno que está terminando.
    if (!novoValor) {

        const corridas =
            window.obterCorridasHojeFirebase
                ? await window.obterCorridasHojeFirebase()
                : 0;

        alert(
            `Turno encerrado!\n\nVocê concluiu ${corridas} ${
                corridas === 1 ? "entrega" : "entregas"
            } nesse turno.`
        );
    }


    await window.definirDisponibilidadeFirebase(novoValor);

    atualizarVisualDisponibilidade(novoValor);


    // Atualiza o número na tela na hora — se ativou, começa
    // do 0 de novo; se desativou, já mostra 0 esperando o
    // próximo turno.
    const corridasElemento =
        document.getElementById("corridasHoje");

    if (corridasElemento) {
        corridasElemento.textContent = "0";
    }

}


/* ATUALIZAR BOTÃO */

function atualizarVisualDisponibilidade(
    disponivel
) {

    const texto =
        document.getElementById(
            "textoDisponibilidade"
        );

    const botao =
        document.getElementById(
            "botaoDisponibilidade"
        );


    if (!texto || !botao) {
        return;
    }


    if (disponivel) {

        texto.textContent =
            "Disponível";

        botao.textContent =
            "DESATIVAR";

    } else {

        texto.textContent =
            "Indisponível";

        botao.textContent =
            "ATIVAR";

    }

}


/* NAVEGAÇÃO */

function irParaInicioEntregador() {

    window.location.href =
        "entregador.html";

}


function abrirEntregasEntregador() {

    window.location.href =
        "entregas-entregador.html";

}


function abrirPerfilEntregador() {

    window.location.href =
        "perfil-entregador.html";

}


/* NOTIFICAÇÕES */

function abrirNotificacoesEntregador() {

    alert(
        "As notificações do entregador serão ativadas na próxima etapa."
    );

}


/* AVALIAÇÃO */

function abrirAvaliacaoEntregador() {

    alert(
        "Aqui serão exibidas suas avaliações e as entregas avaliadas."
    );

}


/* CARREGAR AUTOMATICAMENTE */

document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "entregador.html"
        )
    ) {
        carregarPainelEntregador();
    }
});
/* =========================================
   ENTREGAS DO ENTREGADOR
========================================= */

let entregaDisponivelAtualId = null;
let entregaEmAndamentoId = null;

/* =========================================
   NOTIFICAÇÃO DE NOVA ENTREGA (tipo WhatsApp)
========================================= */

let ultimaEntregaNotificadaId = null;

function pedirPermissaoNotificacao() {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}

function notificarNovaEntrega(entrega) {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission !== "granted") {
        return;
    }

    const notificacao = new Notification(
        "🛵 Nova solicitação de entrega!",
        {
            body: `${entrega.empresa} • Cliente: ${entrega.cliente}`,
            icon: "../imagens/logo.png",
            tag: "lz-express-nova-entrega"
        }
    );

    notificacao.onclick = function () {
        window.focus();
        notificacao.close();
    };
}


function carregarEntregasEntregador() {

    pedirPermissaoNotificacao();

    const cardNova =
        document.getElementById("cardNovaEntrega");

    const cardAtual =
        document.getElementById("cardEntregaAtual");

    const semEntregas =
        document.getElementById("semEntregas");


    if (!cardNova || !cardAtual || !semEntregas) {
        return;
    }

    if (!window.iniciarPainelEntregasEntregador) {
        return;
    }

    window.iniciarPainelEntregasEntregador(function(estado) {

        /* NENHUMA ENTREGA */

        if (estado.estado === "nenhuma") {

            cardNova.style.display = "none";
            cardAtual.style.display = "none";
            semEntregas.style.display = "block";

            return;
        }


        const entrega = estado.entrega;


        /* ENTREGA SOLICITADA (disponível pra aceitar) */

        if (estado.estado === "nova") {

            entregaDisponivelAtualId = entrega.id;

            if (entrega.id !== ultimaEntregaNotificadaId) {
                ultimaEntregaNotificadaId = entrega.id;
                notificarNovaEntrega(entrega);
            }

            cardNova.style.display = "block";
            cardAtual.style.display = "none";
            semEntregas.style.display = "none";


            const empresa =
                document.getElementById(
                    "empresaNovaEntrega"
                );

            if (empresa) {

                empresa.textContent =
                    `${entrega.empresa} solicitou uma entrega.`;

            }


            const valor =
                document.getElementById(
                    "valorNovaEntrega"
                );

            if (valor) {

                valor.textContent =
                    `Valor: R$ ${(entrega.valor || 0).toFixed(2).replace(".", ",")}`;

            }

            return;
        }


        /* ENTREGA JÁ ACEITA POR MIM */

        if (estado.estado === "atual") {

            entregaEmAndamentoId = entrega.id;

            cardNova.style.display = "none";
            cardAtual.style.display = "block";
            semEntregas.style.display = "none";


            const empresa =
                document.getElementById(
                    "empresaEntregaAtual"
                );

            const destino =
                document.getElementById(
                    "destinoEntregaAtual"
                );

            const status =
                document.getElementById(
                    "statusEntregaAtual"
                );


            if (empresa) {
                empresa.textContent =
                    entrega.empresa;
            }


            if (destino) {

                destino.textContent =
                    `${entrega.destino.rua}, ${entrega.destino.numero} - ${entrega.destino.bairro}`;

            }


            if (status) {

                status.textContent =
                    entrega.status === "em_rota"
                        ? "Em rota"
                        : "Em andamento";

            }

        }

    });

}


/* ABRIR DETALHES */

function abrirDetalhesEntrega() {

    if (entregaDisponivelAtualId) {

        localStorage.setItem(
            "entregaSelecionadaId",
            entregaDisponivelAtualId
        );
    }

    window.location.href =
        "detalhes-entrega.html";

}


/* ANDAMENTO */

function abrirAndamentoEntregador() {

    if (entregaEmAndamentoId) {

        localStorage.setItem(
            "entregaSelecionadaId",
            entregaEmAndamentoId
        );
    }

    window.location.href =
        "andamento-entregador.html";

}


/* HISTÓRICO */

function abrirHistoricoEntregador() {

    window.location.href =
        "historico-entregador.html";

}


/* CARREGAR AUTOMATICAMENTE */

document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "entregas-entregador.html"
        )
    ) {
        carregarEntregasEntregador();
    }
});
/* =========================================
   DETALHES DA ENTREGA
========================================= */

async function carregarDetalhesEntrega() {

    const id =
        localStorage.getItem("entregaSelecionadaId");

    if (!id) {
        return;
    }

    const entrega =
        await window.obterEntregaPorIdFirebase(id);

    if (!entrega) {
        return;
    }


    const numero =
        document.getElementById("detalheNumero");

    const empresa =
        document.getElementById("detalheEmpresa");

    const retirada =
        document.getElementById("detalheRetirada");

    const nomeCliente =
        document.getElementById("detalheClienteNome");

    const endereco =
        document.getElementById("detalheEndereco");

    const bairro =
        document.getElementById("detalheBairro");

    const referencia =
        document.getElementById("detalheReferencia");

    const observacoes =
        document.getElementById("detalheObservacoes");


    if (numero) {
        numero.textContent =
            "#" + String(entrega.numero).slice(-6);
    }

    if (empresa) {
        empresa.textContent =
            entrega.empresa || "---";
    }

    if (retirada) {

        retirada.textContent =
            `${entrega.retirada.rua}, ${entrega.retirada.numero} - ${entrega.retirada.bairro}, ${entrega.retirada.cidade}`;
    }

    if (nomeCliente) {
        nomeCliente.textContent =
            entrega.cliente || "---";
    }

    if (endereco) {

        const complemento =
            entrega.destino.complemento
                ? `, ${entrega.destino.complemento}`
                : "";

        endereco.textContent =
            `${entrega.destino.rua}, ${entrega.destino.numero}${complemento}`;
    }

    if (bairro) {

        bairro.textContent =
            `${entrega.destino.bairro} - ${entrega.destino.cidade}`;
    }

    if (referencia) {

        referencia.textContent =
            entrega.destino.referencia || "Não informado.";
    }

    if (observacoes) {

        observacoes.textContent =
            entrega.observacoes ||
            "Nenhuma observação.";
    }

}



/* ACEITAR */

async function aceitarEntrega() {

    const id =
        localStorage.getItem("entregaSelecionadaId");

    if (!id) {
        alert("Nenhuma entrega encontrada.");
        return;
    }

    const resultado =
        await window.aceitarEntregaFirebase(id);

    if (!resultado.sucesso) {

        if (resultado.jaAceita) {
            alert("Essa entrega já foi aceita por outro entregador.");
        } else {
            alert("Não foi possível aceitar a entrega. Tente novamente.");
        }

        window.location.href =
            "entregas-entregador.html";

        return;
    }

    alert("Entrega aceita com sucesso!");

    window.location.href =
        "andamento-entregador.html";
}


/* RECUSAR */

function recusarEntrega() {

    const confirmar =
        confirm(
            "Deseja realmente recusar esta entrega?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(
        "entregaSelecionadaId"
    );

    alert(
        "Entrega recusada. Você poderá receber outra solicitação."
    );

    window.location.href =
        "entregas-entregador.html";
}


/* CARREGAR */

document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "detalhes-entrega.html"
        )
    ) {
        carregarDetalhesEntrega();
    }
});
/* =========================================
   ANDAMENTO DA ENTREGA
========================================= */

let statusEntregaAndamentoAtual = null;

function carregarAndamentoEntregador() {

    const id =
        localStorage.getItem("entregaSelecionadaId");

    if (!id) {
        return;
    }

    if (!window.observarEntregaFirebase) {
        return;
    }

    window.observarEntregaFirebase(id, function(entrega) {

        if (!entrega) return;

        statusEntregaAndamentoAtual = entrega.status;

        const numero =
            document.getElementById(
                "numeroEntregaAndamento"
            );

        if (numero) {
            numero.textContent =
                "#" + String(entrega.numero).slice(-6);
        }

        atualizarVisualStatusEntrega(
            entrega.status
        );

    });

}


async function atualizarStatusEntrega() {

    const id =
        localStorage.getItem("entregaSelecionadaId");

    if (!id) {
        return;
    }

    if (statusEntregaAndamentoAtual === "em_andamento") {

        await window.atualizarStatusEntregaFirebase(id, "em_rota");

        return;
    }


    if (statusEntregaAndamentoAtual === "em_rota") {

        await window.atualizarStatusEntregaFirebase(id, "entregue");

        alert(
            "Entrega concluída com sucesso! 🏁"
        );

        localStorage.removeItem("entregaSelecionadaId");

        window.location.href =
            "historico-entregador.html";
    }

}


function atualizarVisualStatusEntrega(
    status
) {

    const etapa1 =
        document.getElementById("statusEtapa1");

    const etapa2 =
        document.getElementById("statusEtapa2");

    const etapa3 =
        document.getElementById("statusEtapa3");

    const botao =
        document.getElementById(
            "botaoAtualizarStatus"
        );


    if (!etapa1 || !etapa2 || !etapa3) {
        return;
    }


    [etapa1, etapa2, etapa3].forEach((etapa) => {
        etapa.classList.remove("ativa", "concluida");
    });


    if (status === "em_andamento") {
        etapa1.classList.add("ativa");
    }


    if (status === "em_rota") {
        etapa1.classList.add("concluida");
        etapa2.classList.add("ativa");
    }


    if (status === "entregue") {

        etapa1.classList.add("concluida");
        etapa2.classList.add("concluida");
        etapa3.classList.add("ativa", "concluida");

        if (botao) {
            botao.style.display = "none";
        }
    }

}


document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "andamento-entregador.html"
        )
    ) {
        carregarAndamentoEntregador();
    }
});
/* =========================================
   HISTÓRICO DO ENTREGADOR
========================================= */

let historicoEntregadorCache = [];

function renderizarListaHistoricoEntregador(lista) {

    const container =
        document.getElementById(
            "listaHistoricoEntregador"
        );

    if (!container) return;

    if (lista.length === 0) {

        container.innerHTML = `
            <div class="sem-historico-entregador">
                <div class="icone">🛵</div>
                <h2>Nenhuma entrega concluída</h2>
                <p>Suas entregas finalizadas aparecerão aqui.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        lista
        .map(entrega => `

            <div class="card-historico-entregador">

                <div class="topo-historico-entregador">

                    <strong>
                        #${String(entrega.numero).slice(-6)}
                    </strong>

                    <span class="status-historico-entregador">
                        Entregue
                    </span>

                </div>

                <span class="data-historico-entregador">
                    ${entrega.concluidaEm}
                </span>

                <p class="loja-historico-entregador">
                    ${entrega.empresa}
                </p>

                <p class="valor-historico-entregador">
                    Valor: R$ ${(entrega.valor || 0).toFixed(2).replace(".", ",")}
                </p>

            </div>

        `)
        .join("");
}


function filtrarHistoricoEntregador(tipo) {

    const abaTodas = document.getElementById("abaTodas");
    const abaConcluidas = document.getElementById("abaConcluidas");

    if (abaTodas && abaConcluidas) {
        abaTodas.classList.toggle("ativa", tipo === "todas");
        abaConcluidas.classList.toggle("ativa", tipo === "concluidas");
    }

    // Hoje só temos entregas concluídas no histórico (recusadas
    // e canceladas não geram registro), então as duas abas
    // mostram a mesma lista por enquanto.
    renderizarListaHistoricoEntregador(historicoEntregadorCache);
}


async function carregarHistoricoEntregador() {

    const lista =
        document.getElementById(
            "listaHistoricoEntregador"
        );

    if (!lista) {
        return;
    }


    const historico =
        await window.obterHistoricoEntregadorFirebase();

    historicoEntregadorCache = historico;

    renderizarListaHistoricoEntregador(historico);

}


document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "historico-entregador.html"
        )
    ) {
        carregarHistoricoEntregador();
    }
});
/* =========================================
   PERFIL DO ENTREGADOR
========================================= */

async function carregarPerfilEntregador() {

    const entregador =
        await window.obterEntregadorFirebase();

    if (!entregador) {
        return;
    }


    const nome =
        document.getElementById(
            "nomePerfilEntregador"
        );

    const foto =
        document.getElementById(
            "fotoPerfilEntregador"
        );


    if (nome) {
        nome.textContent =
            entregador.nome;
    }


    if (
        foto &&
        entregador.foto
    ) {

        foto.innerHTML = `
            <img
                src="${entregador.foto}"
                alt="Foto do entregador"
            >
        `;

    }

}


function abrirDadosEntregador() {

    alert(
        "Aqui serão exibidos seus dados pessoais."
    );

}


function abrirDadosMotoEntregador() {

    alert(
        "Aqui serão exibidos os dados da sua motocicleta."
    );

}


function abrirAlterarSenhaEntregador() {

    alert(
        "A alteração de senha será integrada ao Firebase."
    );

}


function abrirSobreEntregador() {

    alert(
        "LZ Express\n\nEntregas rápidas, simples e seguras."
    );

}


function sairEntregador() {

    const confirmar =
        confirm(
            "Deseja realmente sair da conta?"
        );

    if (!confirmar) {
        return;
    }

    if (window.sairFirebase) {
        window.sairFirebase();
    } else {
        localStorage.removeItem("entregadorLZ");
        localStorage.removeItem("usuarioLZ");
        window.location.href = "../index.html";
    }

}


document.addEventListener("DOMContentLoaded", function () {

    if (
        window.location.pathname.endsWith(
            "perfil-entregador.html"
        )
    ) {
        carregarPerfilEntregador();
    }
});
/* =========================================
   LOGIN COM FIREBASE
========================================= */
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        let mensagemErro = document.getElementById("mensagemErroLogin");

        if (!mensagemErro) {
            mensagemErro = document.createElement("p");
            mensagemErro.id = "mensagemErroLogin";
            mensagemErro.className = "mensagem-erro";

            formLogin.insertBefore(
                mensagemErro,
                formLogin.querySelector(".botao-entrar-novo")
            );
        }

        mensagemErro.textContent = "";

        const botaoEntrar = formLogin.querySelector(".botao-entrar-novo");

        botaoEntrar.disabled = true;

        const textoBotao = document.getElementById("textoBotaoEntrar");
        if (textoBotao) textoBotao.textContent = "ENTRANDO...";

        const resultado = await window.loginFirebase(email, senha);

        if (!resultado.sucesso) {
            botaoEntrar.disabled = false;
            if (textoBotao) textoBotao.textContent = "ENTRAR";

            switch (resultado.erro.code) {
                case "auth/invalid-credential":
                case "auth/wrong-password":
                case "auth/user-not-found":
                    mensagemErro.textContent = "E-mail ou senha incorretos.";
                    break;

                case "auth/invalid-email":
                    mensagemErro.textContent = "Digite um e-mail válido.";
                    break;

                case "auth/too-many-requests":
                    mensagemErro.textContent =
                        "Muitas tentativas. Aguarde um pouco e tente novamente.";
                    break;

                default:
                    mensagemErro.textContent =
                        "Não foi possível entrar. Tente novamente.";
            }

            return;
        }

        /*
         * O login foi realizado.
         * Agora verificamos o tipo da conta salvo no Firestore.
         */

        if (resultado.tipo === "empresa") {
            window.location.href = "empresa.html";
            return;
        }

        if (resultado.tipo === "entregador") {
            window.location.href = "entregador.html";
            return;
        }

        /*
         * Só chega aqui se a conta ainda não tiver
         * um tipo definido.
         */
        window.location.href = "tipo-conta.html";
    });
}

/* =========================================
   PROTEÇÃO DE PÁGINAS (login + tipo de conta)
========================================= */

const paginasDeEmpresa = [
    "empresa.html",
    "cadastro-empresa.html",
    "cadastro-empresa-sucesso.html",
    "entregas-empresas.html",
    "solicitar-entrega.html",
    "entrega-andamento.html",
    "historico-empresa.html",
    "usuario-empresa.html"
];

const paginasDeEntregador = [
    "entregador.html",
    "cadastro-entregador.html",
    "entregas-entregador.html",
    "andamento-entregador.html",
    "detalhes-entrega.html",
    "historico-entregador.html",
    "perfil-entregador.html"
];

document.addEventListener("DOMContentLoaded", function () {

    const pagina = window.location.pathname.split("/").pop();

    if (pagina === "tipo-conta.html") {
        if (window.redirecionarSeJaTiverTipo) {
            window.redirecionarSeJaTiverTipo();
        }
        return;
    }

    if (paginasDeEmpresa.includes(pagina)) {
        if (window.protegerPaginaTipo) {
            window.protegerPaginaTipo("empresa");
        }
        return;
    }

    if (paginasDeEntregador.includes(pagina)) {
        if (window.protegerPaginaTipo) {
            window.protegerPaginaTipo("entregador");
        }
        return;
    }
});
