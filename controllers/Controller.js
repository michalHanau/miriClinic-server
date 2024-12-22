class Controller {

    constructor(service) {
      this.service = service;
    }
  
    async getAll(queryParameters) {
      const data = await this.service.getAll(queryParameters);
      return data;
    }
  
    async get(id) {
      const data = await this.service.get(id);
      return data;
    }
  
    async insert(objToInsert) {
      const insertedObj = await this.service.insert(objToInsert);
      return insertedObj;
    }
  
    async update(id, objToUpdate) {
      const updatedObj = await this.service.update(id, objToUpdate);
      return updatedObj;
    }
  
    async delete(id) {
      const response = await this.service.delete(id);
      return response;
    }
 
  }

  module.exports = Controller;