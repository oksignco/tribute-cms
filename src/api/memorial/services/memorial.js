'use strict';

/**
 * memorial service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::memorial.memorial');
