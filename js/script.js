document.addEventListener("DOMContentLoaded", function () {
    console.log("Garage Performance carregado!");

    const formulario = document.getElementById("formContato");
    const mensagemRetorno = document.getElementById("mensagemRetorno");
    const listaCadastros = document.getElementById("listaCadastros");
    const chaveArmazenamento = "cadastrosGarage";
    let cadastros = [];

    try {
        const dadosSalvos = localStorage.getItem(chaveArmazenamento);
        cadastros = dadosSalvos ? JSON.parse(dadosSalvos) : [];
        if (!Array.isArray(cadastros)) cadastros = [];
    } catch (erro) {
        cadastros = [];
        console.error("Não foi possível recuperar os cadastros:", erro);
    }

    function salvarCadastros() {
        try {
            localStorage.setItem(chaveArmazenamento, JSON.stringify(cadastros));
            return true;
        } catch (erro) {
            console.error("Não foi possível salvar os cadastros:", erro);
            if (mensagemRetorno) {
                mensagemRetorno.textContent = "Não foi possível salvar os dados neste navegador.";
                mensagemRetorno.className = "mensagem-retorno mensagem-erro";
            }
            return false;
        }
    }

    function exibirCadastros() {
        if (!listaCadastros) return;
        listaCadastros.innerHTML = "";
        if (cadastros.length === 0) {
            listaCadastros.textContent = "Nenhuma mensagem cadastrada ainda.";
            return;
        }

        cadastros.forEach(function (cadastro, indice) {
            const item = document.createElement("article");
            item.classList.add("cadastro-item");
            const nome = document.createElement("p");
            nome.textContent = "Nome: " + cadastro.nome;
            const email = document.createElement("p");
            email.textContent = "E-mail: " + cadastro.email;
            const assunto = document.createElement("p");
            assunto.textContent = "Assunto: " + cadastro.assunto;
            const mensagem = document.createElement("p");
            mensagem.textContent = "Mensagem: " + cadastro.mensagem;
            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir cadastro";
            botaoExcluir.classList.add("botao", "botao-excluir");
            botaoExcluir.addEventListener("click", function () {
                cadastros.splice(indice, 1);
                if (salvarCadastros()) exibirCadastros();
            });
            item.appendChild(nome);
            item.appendChild(email);
            item.appendChild(assunto);
            item.appendChild(mensagem);
            item.appendChild(botaoExcluir);
            listaCadastros.appendChild(item);
        });
    }

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }
            const novoCadastro = {
                nome: document.getElementById("nome").value.trim(),
                email: document.getElementById("email").value.trim(),
                assunto: document.getElementById("assunto").value,
                mensagem: document.getElementById("mensagem").value.trim()
            };
            cadastros.push(novoCadastro);
            if (salvarCadastros()) {
                formulario.reset();
                if (mensagemRetorno) {
                    mensagemRetorno.textContent = "Mensagem cadastrada com sucesso!";
                    mensagemRetorno.className = "mensagem-retorno mensagem-sucesso";
                }
                exibirCadastros();
            } else {
                cadastros.pop();
            }
        });
    }
    exibirCadastros();
});
