import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    auth,
    db
} from "../firebase/firebase-config.js";


// ==========================================
// CRIAR CONTA
// ==========================================

window.criarContaFirebase = async function(nome, email, senha) {

    try {

        const resultado = await createUserWithEmailAndPassword(
            auth,
            email,
            senha
        );

        const usuario = resultado.user;

        // Guarda somente informações básicas localmente.
        // A senha NÃO é salva.
        localStorage.setItem(
            "usuarioLZ",
            JSON.stringify({
                uid: usuario.uid,
                nome: nome,
                email: usuario.email
            })
        );

        return {
            sucesso: true,
            usuario: usuario
        };

    } catch (erro) {

        console.error("Erro ao criar conta:", erro);

        return {
            sucesso: false,
            erro: erro
        };
    }
};


// ==========================================
// SALVAR TIPO DE CONTA NO FIRESTORE
// ==========================================

window.salvarTipoContaFirebase = async function(tipo) {

    const usuario = auth.currentUser;

    if (!usuario) {

        return {
            sucesso: false,
            erro: "Usuário não autenticado."
        };
    }

    try {

        const usuarioLocal =
            JSON.parse(
                localStorage.getItem("usuarioLZ") || "{}"
            );

        await setDoc(
            doc(db, "usuarios", usuario.uid),
            {
                uid: usuario.uid,
                nome: usuarioLocal.nome || "",
                email: usuario.email,
                tipo: tipo
            },
            {
                merge: true
            }
        );

        console.log("Tipo de conta salvo:", tipo);

        return {
            sucesso: true
        };

    } catch (erro) {

        console.error(
            "Erro ao salvar tipo de conta:",
            erro
        );

        return {
            sucesso: false,
            erro: erro
        };
    }
};


// ==========================================
// PEGAR TIPO DE CONTA
// ==========================================

window.obterTipoContaFirebase = async function() {

    const usuario = auth.currentUser;

    if (!usuario) {
        return null;
    }

    try {

        const documento = await getDoc(
            doc(db, "usuarios", usuario.uid)
        );

        if (documento.exists()) {

            const dados = documento.data();

            return dados.tipo || null;
        }

        return null;

    } catch (erro) {

        console.error(
            "Erro ao buscar tipo de conta:",
            erro
        );

        return null;
    }
};


// ==========================================
// LOGIN
// ==========================================

window.loginFirebase = async function(email, senha) {

    try {

        const resultado = await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        const usuario = resultado.user;

        // Atualiza informações básicas do usuário
        localStorage.setItem(
            "usuarioLZ",
            JSON.stringify({
                uid: usuario.uid,
                nome: usuario.displayName || "",
                email: usuario.email
            })
        );

        // Busca o tipo de conta no Firestore
        const documento = await getDoc(
            doc(db, "usuarios", usuario.uid)
        );

        let tipo = null;

        if (documento.exists()) {

            const dados = documento.data();

            tipo = dados.tipo || null;
        }

        return {
            sucesso: true,
            usuario: usuario,
            tipo: tipo
        };

    } catch (erro) {

        console.error("Erro no login:", erro);

        return {
            sucesso: false,
            erro: erro
        };
    }
};


// ==========================================
// RECUPERAR SENHA
// ==========================================

window.recuperarSenhaFirebase = async function(email) {

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        return {
            sucesso: true
        };

    } catch (erro) {

        console.error(
            "Erro ao recuperar senha:",
            erro
        );

        return {
            sucesso: false,
            erro: erro
        };
    }
};


// ==========================================
// PROTEÇÃO DE PÁGINAS
// ==========================================
//
// Toda página que exige login deve carregar este arquivo
// como <script type="module"> e o app.js decide, com base
// na URL, qual guarda chamar (ver final do app.js).

// Espera o Firebase confirmar se existe usuário logado.
// (auth.currentUser é null por um instante mesmo com sessão
// salva, então NUNCA leia auth.currentUser direto ao carregar
// a página — sempre espere o onAuthStateChanged.)
window.exigirLogin = function() {

    return new Promise((resolve) => {

        onAuthStateChanged(auth, (usuario) => {

            if (!usuario) {
                window.location.href = "login.html";
                resolve(null);
                return;
            }

            resolve(usuario);
        });
    });
};


// Garante que só empresa acesse página de empresa,
// e só entregador acesse página de entregador.
// Se a conta ainda não escolheu tipo, manda para tipo-conta.html.
window.protegerPaginaTipo = async function(tipoEsperado) {

    const usuario = await window.exigirLogin();

    if (!usuario) {
        return;
    }

    const tipo = await window.obterTipoContaFirebase();

    if (!tipo) {
        window.location.href = "tipo-conta.html";
        return;
    }

    if (tipo !== tipoEsperado) {
        window.location.href =
            tipo === "empresa" ? "empresa.html" : "entregador.html";
    }
};


// Usada em tipo-conta.html: se a conta logada já tem tipo
// definido, não faz sentido escolher de novo — manda direto
// para o painel certo.
window.redirecionarSeJaTiverTipo = async function() {

    const usuario = await window.exigirLogin();

    if (!usuario) {
        return;
    }

    const tipo = await window.obterTipoContaFirebase();

    if (tipo === "empresa") {
        window.location.href = "empresa.html";
    } else if (tipo === "entregador") {
        window.location.href = "entregador.html";
    }
};


// ==========================================
// SAIR DA CONTA
// ==========================================

window.sairFirebase = async function() {

    try {

        await signOut(auth);

        localStorage.removeItem("usuarioLZ");
        localStorage.removeItem("empresaLZ");
        localStorage.removeItem("entregadorLZ");

        window.location.href = "../index.html";

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );
    }
};