'use strict';

/**
 * memorial controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::memorial.memorial', ({ strapi }) => ({
  async find(ctx) {
    // Get the user from the context
    const user = ctx.state.user;
    
    // If no user is logged in, return forbidden
    if (!user) {
      return ctx.forbidden('You must be logged in to access memorials');
    }

    // Get the base query from the original find method
    const { query } = ctx;

    // Add a filter to only show memorials where the user is assigned
    query.filters = {
      ...(query.filters || {}),
      users: {
        id: user.id
      }
    };

    // Call the parent find method with the modified query
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // If no user is logged in, return forbidden
    if (!user) {
      return ctx.forbidden('You must be logged in to access this memorial');
    }

    // Check if the user has access to this memorial
    const memorial = await strapi.entityService.findOne('api::memorial.memorial', id, {
      populate: ['users']
    });

    if (!memorial) {
      return ctx.notFound('Memorial not found');
    }

    const hasAccess = memorial.users.some(u => u.id === user.id);
    if (!hasAccess) {
      return ctx.forbidden('You do not have access to this memorial');
    }

    // If user has access, return the memorial data
    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
}));
