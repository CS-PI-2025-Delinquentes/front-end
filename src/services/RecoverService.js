import BaseService from "./BaseService";

class RecoverService extends BaseService {

    constructor() {
        super("/codigo");
    }

    async gerarCodigo(data) {
        const resposta = await this.api.post(`${this.endPoint}/gerar?email=${data}`);
        return resposta;
    }

    async validarCodigo(email, codigo) {
        const resposta = await this.api.post(`${this.endPoint}/validar?email=${email}&codigo=${codigo}`);
        return resposta;
    }

    async atualizarSenha(email, codigo, senha) {
        const resposta = await this.api.patch(`${this.endPoint}/atualizar`,{ email, codigo, novaSenha: senha }); 
        return resposta;
    }
}

export default RecoverService;