/* =========================================================
   LZ EXPRESS — DADOS (Firestore + Storage)
   =========================================================

   Este arquivo substitui o localStorage como "banco de dados"
   do site. Ele guarda empresa, entregador e entregas de verdade
   no Firebase, então uma empresa e um entregador em celulares
   diferentes conseguem se enxergar.

   Coleções usadas no Firestore:

     empresas/{uid}      -> dados da empresa dona da conta
     entregadores/{uid}  -> dados do entregador dono da conta
     entregas/{autoId}   -> cada entrega solicitada

   Carregue este arquivo como <script type="module"> em toda
   página que precisa ler ou salvar esses dados (já foi
   adicionado nas páginas certas).
========================================================= */

import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    collection,
    query,
    where,
    onSnapshot,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    ref as storageRef,
    uploadString,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    auth,
    db,
    storage
} from "../firebase/firebase-config.js";


// ==========================================
// ESPERAR O FIREBASE CONFIRMAR O USUÁRIO
// ==========================================
//
// auth.currentUser é null por um instante mesmo quando existe
// sessão salva, porque o Firebase demora um pouquinho pra
// restaurar o login ao carregar a página. Se a gente ler
// auth.currentUser direto nesse instante, o site acha que
// "não tem ninguém logado" mesmo a pessoa estando logada — foi
// isso que causava a tela de cadastro aparecer de novo depois
// de já ter cadastrado a empresa. Por isso, toda função aqui
// espera essa confirmação antes de continuar.

let usuarioConfirmado = null;
let jaConfirmou = false;

onAuthStateChanged(auth, (usuario) => {
    usuarioConfirmado = usuario;
    jaConfirmou = true;
});

function aguardarUsuario() {

    if (jaConfirmou) {
        return Promise.resolve(usuarioConfirmado);
    }

    return new Promise((resolve) => {

        const cancelar = onAuthStateChanged(auth, (usuario) => {
            cancelar();
            resolve(usuario);
        });
    });
}


/* =========================================
   EMPRESA
========================================= */

// Recebe o mesmo objeto que o formulário já monta
// ({nome, whatsapp, rua, numero, bairro, cidade, referencia, foto})
// e salva no Firestore. A foto (vem como data URL do FileReader)
// é enviada pro Storage e vira uma URL de verdade.
window.salvarEmpresaFirebase = async function(empresa) {

    const usuario = await aguardarUsuario();

    if (!usuario) {
        return { sucesso: false, erro: "Não autenticado." };
    }

    try {

        let fotoURL = null;

        if (empresa.foto) {

            const referenciaFoto =
                storageRef(storage, `empresas/${usuario.uid}/foto.jpg`);

            await uploadString(referenciaFoto, empresa.foto, "data_url");

            fotoURL = await getDownloadURL(referenciaFoto);
        }

        await setDoc(
            doc(db, "empresas", usuario.uid),
            {
                uid: usuario.uid,
                nome: empresa.nome,
                categoria: empresa.categoria || "",
                whatsapp: empresa.whatsapp,
                rua: empresa.rua,
                numero: empresa.numero,
                bairro: empresa.bairro,
                cidade: empresa.cidade,
                referencia: empresa.referencia || "",
                horario: empresa.horario || "",
                ...(fotoURL ? { foto: fotoURL } : {}),
                criadoEm: serverTimestamp()
            },
            { merge: true }
        );

        return { sucesso: true };

    } catch (erro) {
        console.error("Erro ao salvar empresa:", erro);
        return { sucesso: false, erro };
    }
};


// Devolve os dados da empresa da conta logada (ou null se
// ela ainda não cadastrou a empresa).
window.obterEmpresaFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return null;

    try {

        const documento = await getDoc(doc(db, "empresas", usuario.uid));

        return documento.exists() ? documento.data() : null;

    } catch (erro) {
        console.error("Erro ao buscar empresa:", erro);
        return null;
    }
};


/* =========================================
   ENTREGADOR
========================================= */

window.salvarEntregadorFirebase = async function(entregador) {

    const usuario = await aguardarUsuario();

    if (!usuario) {
        return { sucesso: false, erro: "Não autenticado." };
    }

    try {

        let fotoURL = null;

        if (entregador.foto) {

            const referenciaFoto =
                storageRef(storage, `entregadores/${usuario.uid}/foto.jpg`);

            await uploadString(referenciaFoto, entregador.foto, "data_url");

            fotoURL = await getDownloadURL(referenciaFoto);
        }

        await setDoc(
            doc(db, "entregadores", usuario.uid),
            {
                uid: usuario.uid,
                nome: entregador.nome,
                cpf: entregador.cpf,
                email: entregador.email,
                whatsapp: entregador.whatsapp,
                nascimento: entregador.nascimento,
                endereco: entregador.endereco,
                possuiCNH: entregador.possuiCNH,
                cnh: entregador.cnh,
                moto: entregador.moto,
                disponivel: false,
                ...(fotoURL ? { foto: fotoURL } : {}),
                criadoEm: serverTimestamp()
            },
            { merge: true }
        );

        return { sucesso: true };

    } catch (erro) {
        console.error("Erro ao salvar entregador:", erro);
        return { sucesso: false, erro };
    }
};


window.obterEntregadorFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return null;

    try {

        const documento = await getDoc(doc(db, "entregadores", usuario.uid));

        return documento.exists() ? documento.data() : null;

    } catch (erro) {
        console.error("Erro ao buscar entregador:", erro);
        return null;
    }
};


window.definirDisponibilidadeFirebase = async function(disponivel) {

    const usuario = await aguardarUsuario();

    if (!usuario) return { sucesso: false };

    try {

        const dados = { disponivel };

        // Toda vez que ele FICA disponível, marca o início de um
        // turno novo — é a partir daqui que contamos "corridas
        // hoje" (na verdade, corridas deste turno).
        if (disponivel) {
            dados.inicioTurno = new Date().toISOString();
        }

        await setDoc(
            doc(db, "entregadores", usuario.uid),
            dados,
            { merge: true }
        );

        return { sucesso: true };

    } catch (erro) {
        console.error("Erro ao mudar disponibilidade:", erro);
        return { sucesso: false, erro };
    }
};


/* =========================================
   ENTREGAS — EMPRESA
========================================= */

// Cria uma nova entrega já usando o endereço cadastrado da
// empresa como retirada.
window.criarEntregaFirebase = async function(dadosDestino) {

    const usuario = await aguardarUsuario();

    if (!usuario) {
        return { sucesso: false, erro: "Não autenticado." };
    }

    try {

        const empresa = await window.obterEmpresaFirebase();

        if (!empresa) {
            return {
                sucesso: false,
                erro: "Cadastre sua empresa antes de solicitar uma entrega."
            };
        }

        const novaEntrega = {
            numero: Date.now(),
            empresaId: usuario.uid,
            empresa: empresa.nome,
            retirada: {
                rua: empresa.rua,
                numero: empresa.numero,
                bairro: empresa.bairro,
                cidade: empresa.cidade
            },
            cliente: dadosDestino.cliente,
            destino: dadosDestino.destino,
            observacoes: dadosDestino.observacoes || "",
            valor: dadosDestino.valor || 0,
            status: "solicitada",
            entregadorId: null,
            entregador: null,
            data: new Date().toLocaleString("pt-BR"),
            concluidaEm: null,
            avaliacao: null,
            criadoEm: serverTimestamp()
        };

        const referencia = await addDoc(collection(db, "entregas"), novaEntrega);

        return { sucesso: true, id: referencia.id };

    } catch (erro) {
        console.error("Erro ao criar entrega:", erro);
        return { sucesso: false, erro };
    }
};


// Busca TODAS as entregas da empresa logada (ativas e concluídas),
// pra tela de lista com abas.
window.obterEntregasEmpresaFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return [];

    try {

        const consulta = query(
            collection(db, "entregas"),
            where("empresaId", "==", usuario.uid)
        );

        const snap = await getDocs(consulta);

        return snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.numero || 0) - (a.numero || 0));

    } catch (erro) {
        console.error("Erro ao buscar entregas da empresa:", erro);
        return [];
    }
};


// Busca (uma vez só) se a empresa logada tem alguma entrega
// que ainda não terminou.
window.obterEntregaAtualEmpresaFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return null;

    try {

        const consulta = query(
            collection(db, "entregas"),
            where("empresaId", "==", usuario.uid)
        );

        const snap = await getDocs(consulta);

        const emAberto = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((e) => e.status !== "entregue")
            .sort((a, b) => b.numero - a.numero);

        return emAberto[0] || null;

    } catch (erro) {
        console.error("Erro ao buscar entrega atual:", erro);
        return null;
    }
};


// Acompanha uma entrega específica em tempo real (usado na
// tela "Entrega em andamento" da empresa). Devolve a função
// de cancelar a inscrição — chame quando sair da página.
window.observarEntregaFirebase = function(id, callback) {

    return onSnapshot(doc(db, "entregas", id), (snap) => {
        callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
};


window.obterHistoricoEmpresaFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return [];

    try {

        const consulta = query(
            collection(db, "entregas"),
            where("empresaId", "==", usuario.uid)
        );

        const snap = await getDocs(consulta);

        return snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((e) => e.status === "entregue")
            .sort((a, b) => b.numero - a.numero);

    } catch (erro) {
        console.error("Erro ao buscar histórico da empresa:", erro);
        return [];
    }
};


// Avalia o entregador de uma entrega já concluída.
window.avaliarEntregaFirebase = async function(id, nota) {

    try {

        await updateDoc(doc(db, "entregas", id), { avaliacao: nota });

        const entregaSnap = await getDoc(doc(db, "entregas", id));

        if (entregaSnap.exists() && entregaSnap.data().entregadorId) {

            const entregadorId = entregaSnap.data().entregadorId;
            const entregadorRef = doc(db, "entregadores", entregadorId);
            const entregadorSnap = await getDoc(entregadorRef);
            const dados = entregadorSnap.exists() ? entregadorSnap.data() : {};

            const totalAnterior = dados.avaliacoesTotal || 0;
            const somaAnterior =
                (dados.avaliacaoMedia || 5) * totalAnterior;

            const novoTotal = totalAnterior + 1;
            const novaMedia = (somaAnterior + nota) / novoTotal;

            await setDoc(
                entregadorRef,
                {
                    avaliacoesTotal: novoTotal,
                    avaliacaoMedia: novaMedia
                },
                { merge: true }
            );
        }

        return { sucesso: true };

    } catch (erro) {
        console.error("Erro ao avaliar entregador:", erro);
        return { sucesso: false, erro };
    }
};


/* =========================================
   ENTREGAS — ENTREGADOR
========================================= */

// Mantém a tela "Entregas" do entregador atualizada em tempo
// real: mostra uma nova solicitação disponível OU a entrega
// que ele já está fazendo. Devolve a função para cancelar a
// inscrição (chame antes de sair da página, se quiser).
window.iniciarPainelEntregasEntregador = function(callback) {

    let cancelarDisponibilidade = () => {};
    let cancelarPropria = () => {};
    let cancelarDisponiveis = () => {};
    let cancelado = false;

    aguardarUsuario().then((usuario) => {

        if (cancelado) return;

        if (!usuario) {
            callback({ estado: "nenhuma" });
            return;
        }

        let entregaPropria = null;
        let entregasDisponiveis = [];
        let disponivel = false;

        function emitir() {

            if (entregaPropria) {
                callback({ estado: "atual", entrega: entregaPropria });
                return;
            }

            // Só mostra novas solicitações se o entregador estiver
            // marcado como disponível — senão fica esperando parado.
            if (disponivel && entregasDisponiveis.length > 0) {
                callback({ estado: "nova", entrega: entregasDisponiveis[0] });
                return;
            }

            callback({ estado: "nenhuma" });
        }

        cancelarDisponibilidade = onSnapshot(
            doc(db, "entregadores", usuario.uid),
            (snap) => {
                disponivel = snap.exists() && !!snap.data().disponivel;
                emitir();
            }
        );

        const paraMim = query(
            collection(db, "entregas"),
            where("entregadorId", "==", usuario.uid)
        );

        cancelarPropria = onSnapshot(paraMim, (snap) => {

            const minhas = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((e) => e.status === "em_andamento" || e.status === "em_rota");

            entregaPropria = minhas[0] || null;

            emitir();
        });

        const disponiveis = query(
            collection(db, "entregas"),
            where("status", "==", "solicitada")
        );

        cancelarDisponiveis = onSnapshot(disponiveis, (snap) => {

            entregasDisponiveis = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            emitir();
        });
    });

    return function cancelar() {
        cancelado = true;
        cancelarDisponibilidade();
        cancelarPropria();
        cancelarDisponiveis();
    };
};


window.obterEntregaPorIdFirebase = async function(id) {

    try {

        const documento = await getDoc(doc(db, "entregas", id));

        return documento.exists() ? { id: documento.id, ...documento.data() } : null;

    } catch (erro) {
        console.error("Erro ao buscar entrega:", erro);
        return null;
    }
};


// Tenta aceitar a entrega com segurança: se outro entregador
// aceitar no mesmo instante, só um dos dois consegue.
window.aceitarEntregaFirebase = async function(id) {

    const usuario = await aguardarUsuario();

    if (!usuario) return { sucesso: false, erro: "Não autenticado." };

    try {

        const entregador = await window.obterEntregadorFirebase();

        await runTransaction(db, async (transacao) => {

            const referencia = doc(db, "entregas", id);
            const snap = await transacao.get(referencia);

            if (!snap.exists() || snap.data().status !== "solicitada") {
                throw new Error("JA_ACEITA");
            }

            transacao.update(referencia, {
                status: "em_andamento",
                entregadorId: usuario.uid,
                entregador: entregador ? entregador.nome : ""
            });
        });

        return { sucesso: true };

    } catch (erro) {

        if (erro.message === "JA_ACEITA") {
            return { sucesso: false, jaAceita: true };
        }

        console.error("Erro ao aceitar entrega:", erro);
        return { sucesso: false, erro };
    }
};


window.atualizarStatusEntregaFirebase = async function(id, novoStatus) {

    try {

        const dados = { status: novoStatus };

        if (novoStatus === "entregue") {
            const agora = new Date();
            dados.concluidaEm = agora.toLocaleString("pt-BR");
            dados.concluidaEmData = agora.toISOString().slice(0, 10);
            dados.concluidaEmISO = agora.toISOString();
        }

        await updateDoc(doc(db, "entregas", id), dados);

        return { sucesso: true };

    } catch (erro) {
        console.error("Erro ao atualizar status da entrega:", erro);
        return { sucesso: false, erro };
    }
};


// Conta quantas entregas o entregador concluiu DESDE que ele
// ficou disponível pela última vez (o "turno" atual). Quando ele
// desativa e ativa de novo, a contagem reinicia sozinha.
window.obterCorridasHojeFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return 0;

    try {

        const entregadorSnap =
            await getDoc(doc(db, "entregadores", usuario.uid));

        const inicioTurno =
            entregadorSnap.exists() ? entregadorSnap.data().inicioTurno : null;

        if (!inicioTurno) return 0;

        const consulta = query(
            collection(db, "entregas"),
            where("entregadorId", "==", usuario.uid)
        );

        const snap = await getDocs(consulta);

        return snap.docs.filter((d) => {
            const dados = d.data();
            return (
                dados.status === "entregue" &&
                dados.concluidaEmISO &&
                dados.concluidaEmISO >= inicioTurno
            );
        }).length;

    } catch (erro) {
        console.error("Erro ao contar corridas do turno:", erro);
        return 0;
    }
};


window.obterHistoricoEntregadorFirebase = async function() {

    const usuario = await aguardarUsuario();

    if (!usuario) return [];

    try {

        const consulta = query(
            collection(db, "entregas"),
            where("entregadorId", "==", usuario.uid)
        );

        const snap = await getDocs(consulta);

        return snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((e) => e.status === "entregue")
            .sort((a, b) => b.numero - a.numero);

    } catch (erro) {
        console.error("Erro ao buscar histórico do entregador:", erro);
        return [];
    }
};
