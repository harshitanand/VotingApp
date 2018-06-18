'use strict';

const LoopBackContext = require('loopback-context');
const CustomError = require('../../server/errors/custom-error');
const Promise = require('bluebird');

module.exports = Poll => {
  Poll.observe('before save', (ctx, next) => {
    const currentUser = LoopBackContext.getCurrentContext().get('currentUser');
    let target = ctx.data;
    const options = ctx.options;
    if (ctx.instance) {
      target = ctx.instance;
    }
    target.userId = currentUser.id;
    next();
  });

  Poll.getAllPolls = async () => {
    const userInclusion = {
      relation: 'author',
      scope: {
        fields: ['id', 'email', 'fullName'],
      },
    };

    const optionsInclusion = {
      relation: 'pollOptions',
      scope: {
        fields: ['id', 'content', 'description'],
      },
    };

    const querySet = {
      where: { active: true },
      include: [userInclusion, optionsInclusion],
    };

    let polls = await Poll.find(querySet);
    polls = polls.map(poll => poll.toJSON());

    await Promise.map(polls, async poll => {
      await Promise.map(poll.pollOptions, async opt => {
        const count = await Vote.count({ pollOptionId: opt.id, pollId: poll.id });
        opt.votes = count;
        return opt;
      });
    });
    return polls;
  };

  Poll.getActiveUserPolls = async req => {
    const optionsInclusion = {
      relation: 'pollOptions',
      scope: {
        fields: ['id', 'content', 'description'],
      },
    };

    const querySet = {
      where: { userId: req.currentUser, active: true },
      include: [optionsInclusion],
    };

    let polls = await Poll.find(querySet);
    polls = polls.map(poll => poll.toJSON());

    await Promise.map(polls, async poll => {
      await Promise.map(poll.pollOptions, async opt => {
        const count = await Vote.count({ pollOptionId: opt.id, pollId: poll.id });
        opt.votes = count;
        return opt;
      });
    });
    return polls;
  };

  Poll.getPollFullData = async pollId => {
    const userInclusion = {
      relation: 'author',
      scope: {
        fields: ['id', 'email', 'fullName'],
      },
    };

    const votesInclusion = {
      relation: 'votes',
      scope: {
        include: ['author', 'poll', 'pollOption'],
      },
    };

    const optionsInclusion = {
      relation: 'pollOptions',
      scope: {
        fields: ['id', 'content', 'description'],
        include: [votesInclusion],
      },
    };

    const querySet = {
      where: { id: pollId, active: true },
      include: [userInclusion, optionsInclusion],
    };

    const poll = await Poll.find(querySet);
    if (poll[0]) {
      return Promise.resolve(poll[0]);
    } else {
      return Promise.reject(new CustomError('No Active Poll found with provided Id'), {}, 403);
    }
  };

  Poll.createNewPoll = async (data, req, options) => {
    const poll = await Poll.create({ primaryContent: data.primaryContent, description: data.description });
    await Promise.map(data.pollOptions, async opt => {
      return PollOption.create({ content: opt.content, poll });
    });
    return Poll.findOne({ where: { id: poll.id }, include: ['pollOptions'] });
  };

  Poll.remoteMethod('createNewPoll', {
    accepts: [
      {
        arg: 'data',
        type: 'object',
        required: true,
      },
    ],
    returns: {
      root: true,
      type: 'object',
    },
    http: {
      path: '/createNewPoll',
      verb: 'get',
    },
  });

  Poll.remoteMethod('getPollFullData', {
    accepts: [
      {
        arg: 'pollId',
        type: 'number',
        required: true,
      },
    ],
    returns: {
      root: true,
      type: 'object',
    },
    http: {
      path: '/getPollFullData',
      verb: 'get',
    },
  });

  Poll.remoteMethod('getActiveUserPolls', {
    accepts: [],
    returns: {
      root: true,
      type: 'array',
    },
    http: {
      path: '/getActiveUserPolls',
      verb: 'get',
    },
  });

  Poll.remoteMethod('getAllPolls', {
    accepts: [],
    returns: {
      root: true,
      type: 'array',
    },
    http: {
      path: '/getAllPolls',
      verb: 'get',
    },
  });
};
