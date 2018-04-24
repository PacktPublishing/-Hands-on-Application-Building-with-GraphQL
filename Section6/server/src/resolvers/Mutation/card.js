const { getUserId } = require('../../utils');

const card = {
  /*
  mutation updateCard(data: CardUpdateInput!, where: CardWhereUniqueInput!): Card

  input CardUpdateInput {
    name: String
    description: String
    updatedBy: UserUpdateOneInput
  }
  input UserUpdateOneInput {
    connect: UserWhereUniqueInput
    # ...
  }
  */
  async updateCard(parent, args, ctx, info) {
    const userId = getUserId(ctx);

    const argsWithUpdatedByUser = {
      where: args.where,
      data: {
        ...args.data,
        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    };

    const updatedCard = await ctx.db.mutation.updateCard(
      argsWithUpdatedByUser
    );

    const result = await ctx.db.query.card(
      { where: { id: updatedCard.id } },
      info
    );
    return result;

    /* Example:
    mutation {
      updateCard(
        data: {
          name: "Video 5.1",
          updatedBy: {
            connect: {
              id: "cjfbofu49003q0938r41q67vb"
            }
          }
        }
        where: {
          id: "cjfejkdzn001d09459bzzsyml"
        }
      )
      {
        name
        updatedBy {
          avatarUrl
          name
        }
      }
    }
    */
  },
};

module.exports = { card };
