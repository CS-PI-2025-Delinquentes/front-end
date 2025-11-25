import BaseService from "./BaseService";

class UserService extends BaseService{

    constructor(){
        super("");
    }

    async getInfo(){
        const resposta = this.api.get(`${this.endPoint}/auth/home`);
        return resposta;
    }

    async createClient(data){
        const resposta = this.api.post(`${this.endPoint}/pessoa-fisica`, data);
        return resposta;
    }

    async createBusiness(data){
        const resposta = this.api.post(`${this.endPoint}/pessoa-juridica`, data);
        return resposta;
    }

    async updatePJ(data){
        const resposta = this.api.put(`${this.endPoint}/pessoa-juridica`, data);
        return resposta;
    }

    async updatePF(data){
        const resposta = this.api.put(`${this.endPoint}/pessoa-fisica`, data);
        return resposta;
    }

    async updatePasswordPJ(data){
        const resposta = this.api.patch(`${this.endPoint}/pessoa-juridica`, data);
        return resposta;
    }

    async updatePasswordPF(data){
        const resposta = this.api.patch(`${this.endPoint}/pessoa-fisica`, data);
        return resposta;
    }
}

export default UserService;