import BaseService from "./BaseService";

class ReviewService extends BaseService {
    constructor() {
        super("/avaliacoes")
    }

    async findAllByPessoaId(page) {
        const resultado = await this.api.get(`${this.endPoint}/clientes?size=6&page=${page}&sort=id,asc`);
        return resultado;
    }

    async findAllLanding() {
        const resultado = await this.api.get(`${this.endPoint}/landing?size=10&page=0&sort=id,desc&nota=3`);
        return resultado;
    }
}

export default ReviewService;