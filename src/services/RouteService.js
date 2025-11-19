import BaseService from "./BaseService";

class RouteService extends BaseService {
    constructor() {
        super("/cidades")
    }

    async findAll(page) { 
        const response = await this.api.get(`${this.endPoint}/client?size=20&page=${page}&sort=nome,asc`);
        return response;
    }
}

export default RouteService;