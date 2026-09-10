// =====================================================
// FIREBASE
// =====================================================

import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} 
    from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// =====================================================
// CONFIGURAÇÃO DO FIREBASE
// =====================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJRDpLht_vuoJjtZMu2GfVqTXq7SkRWIA",
  authDomain: "apostacetam.firebaseapp.com",
  projectId: "apostacetam",
  storageBucket: "apostacetam.firebasestorage.app",
  messagingSenderId: "975694291387",
  appId: "1:975694291387:web:f2bc399b33662894b5a49e",
  measurementId: "G-FEP7FPF2CN"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);


// Referência para a coleção de palpites
const palpitesRef = collection(db, "palpites");


// =====================================================
// PARTICIPANTES DA TURMA
// =====================================================

let participantes = [

    {
        nome: "Alex",
        votos: 0
    },

    {
        nome: "Aline",
        votos: 0
    },

    {
        nome: "Hanna",
        votos: 0
    },

    {
        nome: "Hugo",
        votos: 0
    },

    {
        nome: "Guilherme Mendonça",
        votos: 0
    },

    {
        nome: "Gabriel",
        votos: 0
    },

    {
        nome: "Luciano",
        votos: 0
    },

    {
        nome: "Clicia",
        votos: 0
    },

    {
        nome: "Welder",
        votos: 0
    },

    {
        nome: "Bruno",
        votos: 0
    },

    {
        nome: "Pedro",
        votos: 0
    },

    {
        nome: "Eduardo",
        votos: 0
    },

    {
        nome: "Dulcineves",
        votos: 0
    },

    {
        nome: "Davi",
        votos: 0
    },

    {
        nome: "Yan",
        votos: 0
    },

    {
        nome: "Guilherme",
        votos: 0
    },

    {
        nome: "Drizana",
        votos: 0
    },

    {
        nome: "Rainier",
        votos: 0
    },

    {
        nome: "Endrew",
        votos: 0
    },

    {
        nome: "Flavio",
        votos: 0
    },

    {
        nome: "Fernanda",
        votos: 0
    },

    {
        nome: "Rickson",
        votos: 0
    }

];


// =====================================================
// CONFIGURAÇÕES
// =====================================================

const PONTOS_INICIAIS = 100;

let valorSelecionado = 10;

let historicoPalpites = [];


// =====================================================
// ATUALIZAR TELA
// =====================================================

function atualizarTela() {

    atualizarRanking();

    atualizarSelects();

    atualizarPalpites();

    atualizarPontos();

}


// =====================================================
// ATUALIZAR PONTOS
// =====================================================

function atualizarPontos() {

    const elementoPontos =
        document.getElementById("pontos");

    if (!elementoPontos) {
        return;
    }

    // Soma quanto a pessoa Fernanda, por exemplo,
    // já apostou não é usada aqui porque o sistema
    // antigo possui apenas um contador local.
    //
    // Para manter a estrutura original:
    // começa mostrando 100 pontos.

    elementoPontos.textContent = PONTOS_INICIAIS;

}


// =====================================================
// ATUALIZAR SELECTS
// =====================================================

function atualizarSelects() {

    const apostador =
        document.getElementById("apostador");

    const escolha =
        document.getElementById("escolha");


    if (!apostador || !escolha) {
        return;
    }


    apostador.innerHTML = `
        <option value="">
            Selecione seu nome
        </option>
    `;


    escolha.innerHTML = `
        <option value="">
            Selecione um participante
        </option>
    `;


    participantes.forEach(
        (pessoa, index) => {

            // Select do apostador

            const optionApostador =
                document.createElement("option");

            optionApostador.value = index;

            optionApostador.textContent =
                pessoa.nome;

            apostador.appendChild(
                optionApostador
            );


            // Select de quem vai desistir

            const optionEscolha =
                document.createElement("option");

            optionEscolha.value = index;

            optionEscolha.textContent =
                pessoa.nome;

            escolha.appendChild(
                optionEscolha
            );

        }
    );

}


// =====================================================
// ATUALIZAR RANKING
// =====================================================

function atualizarRanking() {

    const ranking =
        document.getElementById("ranking");


    if (!ranking) {
        return;
    }


    ranking.innerHTML = "";


    const ordenados =
        [...participantes].sort(
            (a, b) =>
                b.votos - a.votos
        );


    const maior =
        ordenados.length > 0
            ? Math.max(
                ordenados[0].votos,
                1
            )
            : 1;


    ordenados.forEach(
        (pessoa, index) => {

            const percentual =
                Math.round(
                    (pessoa.votos / maior)
                    * 100
                );


            const div =
                document.createElement("div");


            div.className =
                "participante";


            let icone = "👤";


            if (index === 0) {
                icone = "🔥";
            }


            if (index === 1) {
                icone = "😬";
            }


            if (index === 2) {
                icone = "👀";
            }


            div.innerHTML = `

                <div class="avatar">
                    ${icone}
                </div>

                <div class="info">

                    <strong>
                        ${pessoa.nome}
                    </strong>

                    <small>
                        ${pessoa.votos}
                        palpite(s)
                    </small>

                </div>

                <div class="chance">
                    ${percentual}%
                </div>

            `;


            ranking.appendChild(div);

        }
    );

}


// =====================================================
// SELECIONAR VALOR DA APOSTA
// =====================================================

function selecionarValor(
    valor,
    botao
) {

    valorSelecionado = valor;


    const campoValor =
        document.getElementById("valor");


    if (campoValor) {

        campoValor.value =
            valor + " pontos";

    }


    document
        .querySelectorAll(".valor")
        .forEach(
            btn => {

                btn.classList.remove(
                    "selecionado"
                );

            }
        );


    if (botao) {

        botao.classList.add(
            "selecionado"
        );

    }

}


// =====================================================
// REGISTRAR PALPITE NO FIREBASE
// =====================================================

async function registrarPalpite() {

    const apostador =
        document.getElementById(
            "apostador"
        ).value;


    const escolha =
        document.getElementById(
            "escolha"
        ).value;


    // =================================================
    // VALIDAR APOSTADOR
    // =================================================

    if (apostador === "") {

        alert(
            "Escolha quem está fazendo o palpite! 😂"
        );

        return;

    }


    // =================================================
    // VALIDAR ESCOLHA
    // =================================================

    if (escolha === "") {

        alert(
            "Escolha quem você acha que vai desistir! 👀"
        );

        return;

    }


    // =================================================
    // NÃO PODE VOTAR EM SI MESMO
    // =================================================

    if (apostador === escolha) {

        alert(
            "Você não pode apostar em si mesmo! 😂"
        );

        return;

    }


    // =================================================
    // PEGAR NOMES
    // =================================================

    const nomeApostador =
        participantes[apostador].nome;


    const nomeEscolhido =
        participantes[escolha].nome;


    // =================================================
    // DESABILITAR BOTÃO DURANTE O ENVIO
    // =================================================

    const botoes =
        document.querySelectorAll(
            "button"
        );


    // =================================================
    // SALVAR NO FIREBASE
    // =================================================

    try {

        const documento =
            await addDoc(
                palpitesRef,
                {

                    apostador:
                        nomeApostador,

                    escolhido:
                        nomeEscolhido,

                    valor:
                        valorSelecionado,

                    criadoEm:
                        serverTimestamp()

                }
            );


        console.log(
            "Palpite registrado:",
            documento.id
        );


        // =================================================
        // LIMPAR FORMULÁRIO
        // =================================================

        document.getElementById(
            "apostador"
        ).value = "";


        document.getElementById(
            "escolha"
        ).value = "";


        // =================================================
        // MENSAGEM
        // =================================================

        alert(
            "🎯 PALPITE REGISTRADO!\n\n" +

            nomeApostador +

            " apostou " +

            valorSelecionado +

            " pontos em " +

            nomeEscolhido +

            ". 😂"
        );


    } catch (erro) {

        console.error(
            "Erro ao registrar palpite:",
            erro
        );


        alert(
            "❌ Não foi possível registrar o palpite.\n\n" +
            "Verifique sua conexão e a configuração do Firebase."
        );

    }

}


// =====================================================
// OUVIR PALPITES DO FIREBASE
// =====================================================

function ouvirPalpites() {

    const consulta =
        query(
            palpitesRef,
            orderBy(
                "criadoEm",
                "desc"
            )
        );


    onSnapshot(
        consulta,

        snapshot => {

            historicoPalpites = [];


            // Zerar votos
            participantes.forEach(
                pessoa => {
                    pessoa.votos = 0;
                }
            );


            snapshot.forEach(
                documento => {

                    const palpite =
                        documento.data();


                    // Adicionar ao histórico

                    historicoPalpites.push({

                        id:
                            documento.id,

                        apostador:
                            palpite.apostador,

                        escolhido:
                            palpite.escolhido,

                        valor:
                            palpite.valor || 0,

                        criadoEm:
                            palpite.criadoEm

                    });


                    // Contabilizar voto

                    const participante =
                        participantes.find(
                            pessoa =>
                                pessoa.nome ===
                                palpite.escolhido
                        );


                    if (participante) {

                        participante.votos++;

                    }

                }
            );


            atualizarTela();


            console.log(
                "Palpites carregados:",
                historicoPalpites.length
            );

        },

        erro => {

            console.error(
                "Erro ao carregar palpites:",
                erro
            );


            alert(
                "❌ Não foi possível carregar os palpites do Firebase."
            );

        }
    );

}


// =====================================================
// MOSTRAR PALPITES
// =====================================================

function atualizarPalpites() {

    const area =
        document.getElementById(
            "meusPalpites"
        );


    if (!area) {
        return;
    }


    area.innerHTML = "";


    if (
        historicoPalpites.length === 0
    ) {

        area.innerHTML = `

            <p
                style="
                    color:#807687;
                    font-size:13px;
                "
            >
                Nenhum palpite registrado.
            </p>

        `;

        return;

    }


    // Mostrar somente os 8 mais recentes

    historicoPalpites
        .slice(0, 8)
        .forEach(
            palpite => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "palpite-item";


                div.innerHTML = `

                    👤 ${palpite.apostador}

                    →

                    <strong>
                        ${palpite.escolhido}
                    </strong>

                    <br>

                    🪙 ${palpite.valor}
                    pontos

                `;


                area.appendChild(div);

            }
        );

}


// =====================================================
// ADICIONAR NOVO PARTICIPANTE
// =====================================================

function adicionarParticipante() {

    const input =
        document.getElementById(
            "novoNome"
        );


    if (!input) {
        return;
    }


    const nome =
        input.value.trim();


    // =================================================
    // VALIDAR NOME
    // =================================================

    if (nome === "") {

        alert(
            "Digite o nome do participante!"
        );

        return;

    }


    // =================================================
    // VERIFICAR DUPLICADO
    // =================================================

    const existe =
        participantes.some(
            pessoa =>
                pessoa.nome.toLowerCase()
                ===
                nome.toLowerCase()
        );


    if (existe) {

        alert(
            "Essa pessoa já está no bolão! 😂"
        );

        return;

    }


    // =================================================
    // ADICIONAR
    // =================================================

    participantes.push({

        nome: nome,

        votos: 0

    });


    input.value = "";


    atualizarTela();


    alert(
        nome +
        " foi adicionado ao Bolão do CETAM! 🎯"
    );

}


// =====================================================
// MULTIPLICADOR ANIMADO
// =====================================================

let numero = 1;


setInterval(
    () => {

        numero += 0.01;


        const multiplicador =
            document.getElementById(
                "multiplicador"
            );


        if (multiplicador) {

            multiplicador.textContent =
                numero.toFixed(2) + "x";

        }

    },
    100
);


// =====================================================
// REVELAR CAMPEÃO
// =====================================================

function revelarCampeao() {

    if (
        participantes.length === 0
    ) {

        return;

    }


    // =================================================
    // MAIOR NÚMERO DE VOTOS
    // =================================================

    const maior =
        Math.max(
            ...participantes.map(
                pessoa =>
                    pessoa.votos
            )
        );


    // =================================================
    // NENHUM PALPITE
    // =================================================

    if (maior === 0) {

        alert(
            "Ainda não tem nenhum palpite! 😂"
        );

        return;

    }


    // =================================================
    // PEGAR EMPATADOS
    // =================================================

    const campeoes =
        participantes.filter(
            pessoa =>
                pessoa.votos === maior
        );


    const nomes =
        campeoes
            .map(
                pessoa =>
                    pessoa.nome
            )
            .join(" e ");


    // =================================================
    // MOSTRAR RESULTADO
    // =================================================

    const mensagem =
        document.getElementById(
            "mensagemResultado"
        );


    if (mensagem) {

        mensagem.innerHTML = `

            A turma escolheu:

            <br><br>

            <strong
                style="
                    font-size:27px;
                    color:#a8e063;
                "
            >
                ${nomes}
            </strong>

            <br><br>

            Com

            <strong>
                ${maior}
            </strong>

            palpite(s)!

            <br><br>

            Será que chega até o final
            do curso? 👀😂

        `;

    }


    const resultado =
        document.getElementById(
            "resultado"
        );


    if (resultado) {

        resultado.style.display =
            "flex";

    }

}


// =====================================================
// FECHAR RESULTADO
// =====================================================

function fecharResultado() {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (resultado) {

        resultado.style.display =
            "none";

    }

}


// =====================================================
// DISPONIBILIZAR FUNÇÕES PARA O HTML
// =====================================================
//
// Como o app.js agora é "type=module",
// as funções deixam de ficar automaticamente
// disponíveis para onclick="..." no HTML.
//
// Por isso colocamos elas no window.
//

window.selecionarValor =
    selecionarValor;

window.registrarPalpite =
    registrarPalpite;

window.adicionarParticipante =
    adicionarParticipante;

window.revelarCampeao =
    revelarCampeao;

window.fecharResultado =
    fecharResultado;


// =====================================================
// INICIALIZAÇÃO
// =====================================================

atualizarTela();

ouvirPalpites();


console.log(
    "🚀 Bolão do CETAM iniciado!"
);