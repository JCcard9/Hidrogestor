const API_BASE_URL = 'http://localhost:3000';

// Variáveis globais
let faturasData = [];
let leiturasData = [];


function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


function createFaturaItem(fatura) {
    return `
        <li>
            <strong>Mês:</strong> ${String(fatura.meslido).padStart(2,'0')} <br>
            <strong>Valor:</strong> R$ ${Number(fatura.valorfatura).toFixed(2)} <br>
            <strong>Data Leitura:</strong> ${formatDate(fatura.dataleitura)}
        </li>
    `;
}

function createLeituraItem(leitura) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    const isContador = usuarioLogado?.tipo_usuario === 0;

    return `
        <li class="leitura-item">
            <div class="leitura-info">
                <strong>Mês:</strong> ${String(leitura.meslido).padStart(2,'0')} <br>
                <strong>Consumo:</strong> ${leitura.quantidadeconsumida} m³ <br>
                <strong>Data Registro:</strong> ${formatDate(leitura.dataleitura)}
            </div>
            ${isContador ? `<button class="btn-delete-leitura" onclick="excluirLeitura(${leitura.id}, '${leitura.meslido}', '${leitura.quantidadeconsumida}')">Excluir</button>` : ""}
        </li>
    `;
}


async function fetchFaturas(nrUC) {
    const response = await fetch(`${API_BASE_URL}/listarFaturas/${nrUC}`);

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

async function fetchLeituras(nrUC) {
    const response = await fetch(`${API_BASE_URL}/listarLeitura/${nrUC}`);

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}


async function excluirLeitura(id, mes, consumo) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

    if (!usuarioLogado || usuarioLogado.tipo_usuario !== 0) {
        alert("Apenas o contador pode excluir leituras.");
        return;
    }

    const confirmed = confirm(`Deseja excluir a leitura do mês ${mes} com consumo ${consumo} m³?`);
    if (!confirmed) return;

    try {
        const params = new URLSearchParams(window.location.search);
        const nrUC = params.get("id");

        const response = await fetch(`${API_BASE_URL}/excluirLeitura/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nr_unidadeconsumidora: nrUC, nr_mes: Number(mes) })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Erro ao excluir leitura");
        }

        alert("Leitura e fatura excluídas com sucesso!");
        await loadData();
    } catch (error) {
        console.error("Erro ao excluir leitura:", error);
        alert(error.message);
    }
}

async function loadData() {
    const listaFaturas = document.getElementById("listaFaturas");
    const listaLeituras = document.getElementById("listaLeituras");

    listaFaturas.innerHTML = "<li>Carregando faturas...</li>";
    listaLeituras.innerHTML = "<li>Carregando leituras...</li>";

    try {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioLogado) {
            listaFaturas.innerHTML = "<li>Usuário não encontrado.</li>";
            listaLeituras.innerHTML = "<li>Usuário não encontrado.</li>";
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const nrUC = Number(params.get("id"));

        // Busca paralela (melhor performance)
        const [faturas, leituras] = await Promise.all([
            fetchFaturas(nrUC),
            fetchLeituras(nrUC)
        ]);

        // Renderização Faturas
        if (faturas.length === 0) {
            listaFaturas.innerHTML = "<li>Nenhuma fatura encontrada.</li>";
        } else {
            listaFaturas.innerHTML = faturas.map(createFaturaItem).join("");
        }

        // Renderização Leituras
        if (leituras.length === 0) {
            listaLeituras.innerHTML = "<li>Nenhuma leitura encontrada.</li>";
        } else {
            listaLeituras.innerHTML = leituras.map(createLeituraItem).join("");
        }

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        listaFaturas.innerHTML = "<li>Erro ao carregar faturas.</li>";
        listaLeituras.innerHTML = "<li>Erro ao carregar leituras.</li>";
    }
}


document.addEventListener("DOMContentLoaded", loadData);
