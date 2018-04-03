const { getUserId } = require('../../utils');

const board = {
  async updateBoard(parent, args, ctx, info) {
    const userId = getUserId(ctx);
    const board = await ctx.db.mutation.updateBoard(
      {
        where: args.where,
        data: {
          ...args.data,
          updatedBy: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
    return board;
  },
  async createBoard(parent, args, ctx, info) {
    const { name } = args;

    const id = getUserId(ctx);

    console.log('user-id', id);

    const user = await ctx.db.mutation.updateUser(
      {
        data: {
          boards: {
            create: {
              name,
            },
          },
        },
        where: { id },
      },
      info
    );

    const onDatabase = `
      mutation {
        updateUser(
          data: {
          boards: {
            create: {
              name: "name"
            }
          }
        }
        where: {
          id: "234"
        }
      ) {
          id
          boards {
            name
            id
          }
        }
      }`;

    return user;
  },
  async deleteBoard(parent, args, ctx, info) {
    const { id } = args;

    getUserId(ctx);

    console.log('board-id', id);

    const board = await ctx.db.mutation.deleteBoard(
      {
        where: { id },
      },
      info
    );

    const onDatabase = `
      mutation {
        deleteBoard(where: {id: "xcjd90t1gw0019018143trudyk"}) {
          id
          name
        }
      }
    }`;

    return board;
  },
};

module.exports = { board };
