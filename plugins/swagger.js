'use strict'

const fp = require('fastify-plugin')
const fastifySwagger = require('@fastify/swagger')
const SwaggerUI = require('@fastify/swagger-ui')
const pkg = require('../package.json')

module.exports = fp(
  async function swaggerPlugin (fastify, opts) {
    fastify.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Fastify app',
          description: 'Fastify Book examples',
          version: pkg.version
        },
        // servers: [
        //   {
        //     url: `http://0.0.0.0:${fastify.secrets.PORT}`,
        //   },
        // ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      }
    })
    if (fastify.secrets.NODE_ENV !== 'production') {
      fastify.register(SwaggerUI, {
        routePrefix: '/docs'
      })
    }
  },
  { dependencies: ['application-config'] }
)
