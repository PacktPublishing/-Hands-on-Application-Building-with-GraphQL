let boardData = {
  name: 'Course',
  lists: [
    {
      name: 'First Section',
      cards: [
        {
          name: 'Intro',
        },
      ],
    },
    {
      name: 'Second Section',
      cards: [
        {
          name: 'Video 1',
        },
        {
          name: 'Video 2',
        },
        {
          name: 'Video 3',
        },
        {
          name: 'Video 4',
        },
        {
          name: 'Video 5',
        },
      ],
    },
  ],
};

let numbers = Array.from(Array(20).keys());
let cards = numbers.map(i => ({ name: `Video ${i}` }));
boardData.lists[0].cards.push(...cards);

export default boardData;
