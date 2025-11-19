import BaseService from "./BaseService";

class BudgetService extends BaseService {
    constructor() {
        super("solicitacoes")
    }

    async findAllClient(page) {
        const resultado = await this.api.get(`${this.endPoint}/clientes?size=10&page=${page}&sort=id,desc`);
        return resultado;
    }

    async deleteClient(id) {
        const resultado = await this.api.delete(`${this.endPoint}/clientes/${id}`);
        return resultado;
    }

    async create(orcamento) {
        const resultado = await this.api.post(`${this.endPoint}`, orcamento);
        return resultado;
    }
}

export default BudgetService;