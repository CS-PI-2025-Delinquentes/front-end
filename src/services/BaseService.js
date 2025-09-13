import api from "../configs/axiosConfig"

class BaseService {

    constructor(endPoint) {
        this.endPoint = endPoint;
        this.api = api;
    }

    async findById(id) {
        const response = await this.api.get(`${this.endPoint}/${id}`)
        return response;
    }

    async insert(data) {
        const response = await this.api.post(this.endPoint, data)
        return response;
    }

    async alter(id, data) {
        const response = await this.api.put(`${this.endPoint}/${id}`, data);
        return response;
    }

    async delete(id) {
        const response = await this.api.delete(`${this.endPoint}/${id}`)
        return response
    }

    async findAll() {
        const response = await this.api.get(this.endPoint)
        return response;
    }
}

export default BaseService