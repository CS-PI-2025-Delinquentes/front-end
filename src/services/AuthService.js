import BaseService from "./BaseService";

class AuthService extends BaseService{

    constructor(){
        super("/auth");
    }

    async login(data){
        const resposta = this.api.post(`${this.endPoint}/login/clientes`, data);
        return resposta;
    }
}

export default AuthService;