'use strict'

module.exports = async function todoRoutes (fastify, _opts) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: fastify.getSchema('schema:todo:list:query'),
      security: [{ bearerAuth: [] }],
      response: {
        200: fastify.getSchema('schema:todo:list:response')
      },
      tags: ['ToDo']
    },
    handler: async function listTodo (request, reply) {
      const { skip, limit, title } = request.query

      const todos = await request.todosDataSource.listTodos({
        filter: { title },
        skip,
        limit
      })
      const totalCount = await request.todosDataSource.countTodos()
      return { data: todos, totalCount }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      security: [{ bearerAuth: [] }],
      body: fastify.getSchema('schema:todo:create:body'),
      response: {
        201: fastify.getSchema('schema:todo:create:response')
      },
      tags: ['ToDo']
    },
    handler: async function createTodo (request, reply) {
      const insertedId = await request.todosDataSource.createTodo(request.body)
      reply.code(201)
      return { id: insertedId }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      security: [{ bearerAuth: [] }],
      params: fastify.getSchema('schema:todo:read:params'),
      response: {
        200: fastify.getSchema('schema:todo')
      },
      tags: ['ToDo']
    },
    handler: async function readTodo (request, reply) {
      const todo = await request.todosDataSource.readTodo(request.params.id)
      if (!todo) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      return todo
    }
  })

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['ToDo'],
      params: fastify.getSchema('schema:todo:read:params'),
      body: fastify.getSchema('schema:todo:update:body')
    },
    handler: async function updateTodo (request, reply) {
      const res = await request.todosDataSource.updateTodo(
        request.params.id,
        request.body
      )
      if (res.modifiedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      reply.code(204)
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['ToDo'],
      params: fastify.getSchema('schema:todo:read:params')
    },
    handler: async function deleteTodo (request, reply) {
      const res = await request.todosDataSource.deleteTodo(request.params.id)
      if (res.deletedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      reply.code(204)
    }
  })

  fastify.route({
    method: 'POST',
    url: '/:id/:status',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['ToDo'],
      params: fastify.getSchema('schema:todo:status:params')
    },
    handler: async function changeStatus (request, reply) {
      const res = await request.todosDataSource.updateTodo(request.params.id, {
        done: true
      })
      if (res.modifiedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      reply.code(204)
    }
  })
}
