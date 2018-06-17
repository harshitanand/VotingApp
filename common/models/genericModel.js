'use strict';

module.exports = GenericModel => {
  GenericModel.observe('before save', (ctx, next) => {
    let steps = '';
    if (ctx.instance && !ctx.currentInstance && !ctx.data) {
      steps = 'ExistingModelInstanceSave';
    } else if (!ctx.instance && ctx.currentInstance && ctx.data) {
      steps = 'NormalUpdateAttribute';
    } else if (!ctx.instance && !ctx.currentInstance && ctx.data) {
      steps = 'UpdateAllCalledForTable';
    }

    switch (steps) {
      case 'ExistingModelInstanceSave': {
        ctx.instance.updatedAt = new Date();
        if (!ctx.instance.createdAt) ctx.instance.createdAt = new Date();
        break;
      }
      case 'NormalUpdateAttribute': {
        ctx.currentInstance.updatedAt = new Date();
        break;
      }
      case 'UpdateAllCalledForTable': {
        break;
      }
      default:
        break;
    }
    next();
  });
};
