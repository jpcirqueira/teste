import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { FastifyInstance } from 'fastify';
import { createServer } from '@infrastructure/http';
import { cepRoutes } from '@presentation/routes';

describe('CEP API', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
    await cepRoutes(server);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /cep/:cep', () => {
    it('should return address for valid CEP', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cep/01001000',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('cep');
      expect(body.data).toHaveProperty('logradouro');
      expect(body.data).toHaveProperty('bairro');
      expect(body.data).toHaveProperty('localidade');
      expect(body.data).toHaveProperty('uf');
      expect(body.data.cep).toBe('01001-000');
      expect(body.data.uf).toBe('SP');
    }, 10000); // 10 segundos de timeout para requisição externa

    it('should accept CEP with mask', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cep/01001-000',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.cep).toBe('01001-000');
    }, 10000);

    it('should return 404 for non-existent CEP', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cep/99999999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('NotFoundError');
    }, 10000);

    it('should return 400 for invalid CEP format', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cep/123',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('BadRequestError');
      expect(body.message).toContain('8 dígitos');
    });

    it('should return 400 for CEP with letters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cep/0100100a',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('should handle CEP from different regions', async () => {
      // CEP de Porto Alegre
      const response = await server.inject({
        method: 'GET',
        url: '/cep/90010-150',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.uf).toBe('RS');
    }, 10000);
  });
});


