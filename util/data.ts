import { Issue } from "../interfaces/Issue";

type Author = any
type Quote = any
type QuoteMap = any

const jake: Author = {
    id: '1',
    name: 'Jake',
    url: 'http://adventuretime.wikia.com/wiki/Jake',
    avatarUrl: '/bmo.png',
    colors: {
        soft: 'yellow',
        hard: 'orange',
    },
};

const BMO: Author = {
    id: '2',
    name: 'BMO',
    url: 'http://adventuretime.wikia.com/wiki/BMO',
    avatarUrl: '/bmo.png',
    colors: {
        soft: 'pink',
        hard: 'purple',
    },
};

const finn: Author = {
    id: '3',
    name: 'Finn',
    url: 'http://adventuretime.wikia.com/wiki/Finn',
    avatarUrl: '/bmo.png',
    colors: {
        soft: 'orange',
        hard: 'red',
    },
};

const princess: Author = {
    id: '4',
    name: 'Princess bubblegum',
    url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
    avatarUrl: '/bmo.png',
    colors: {
        soft: 'yellow',
        hard: 'green',
    },
};

export const authors: Author[] = [jake, BMO, finn, princess];

export const quotes: Quote[] = [
    {
        id: '1',
        content: 'Sometimes life is scary and dark',
        author: BMO,
    },
    {
        id: '2',
        content:
            'Sucking at something is the first step towards being sorta good at something.',
        author: jake,
    },
    {
        id: '3',
        content: "You got to focus on what's real, man",
        author: jake,
    },
    {
        id: '4',
        content: 'Is that where creativity comes from? From sad biz?',
        author: finn,
    },
    {
        id: '5',
        content: 'Homies help homies. Always',
        author: finn,
    },
    {
        id: '6',
        content: 'Responsibility demands sacrifice',
        author: princess,
    },
    {
        id: '7',
        content: "That's it! The answer was so simple, I was too smart to see it!",
        author: princess,
    },
    {
        id: '8',
        content:
            "People make mistakes. It's all a part of growing up and you never really stop growing",
        author: finn,
    },
    {
        id: '9',
        content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
        author: finn,
    },
    {
        id: '10',
        content: 'I should not have drunk that much tea!',
        author: princess,
    },
    {
        id: '11',
        content: 'Please! I need the real you!',
        author: princess,
    },
    {
        id: '12',
        content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
        author: princess,
    },
];

export const columns = ["To Do", "In Progress", "Blocked", "In Review", "Done"]

export const sprint: Issue[] = [{
    id: 'ID-1',
    content: 'Sprint Content',
    status: columns[1],
    tags: [],
    priority: 1,
    type: "Story",
    storyPoints: 3,
    author: princess,
},
{
    id: 'ID-2',
    content: 'Sprint Content',
    status: columns[1],
    tags: [],
    priority: 1,
    type: "Story",
    storyPoints: 1,
    author: princess,
}, {
    id: 'ID-3',
    content: 'Sprint Content',
    status: columns[2],
    tags: [],
    priority: 4,
    type: "Story",
    storyPoints: 3,
    author: princess,
}, {
    id: 'ID-4',
    content: 'Sprint Content',
    status: columns[3],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
}]

// So we do not have any clashes with our hardcoded ones
let idCount: number = quotes.length + 1;

export const getQuotes = (count: number): Quote[] =>
    Array.from({ length: count }, (v, k) => k).map(() => {
        const random: Quote = quotes[Math.floor(Math.random() * quotes.length)];

        const custom: Quote = {
            ...random,
            id: `G${idCount++}`,
        };

        return custom;
    });

export const getAuthors = (count: number): Author[] =>
    Array.from({ length: count }, (v, k) => k).map(() => {
        const random: Author = authors[Math.floor(Math.random() * authors.length)];

        const custom: Author = {
            ...random,
            id: `author-${idCount++}`,
        };

        return custom;
    });

const getByAuthor = (author: Author, items: Quote[]): Quote[] =>
    items.filter((quote: Quote) => quote.author === author);

export const authorQuoteMap: QuoteMap = authors.reduce(
    (previous: QuoteMap, author: Author) => ({
        ...previous,
        [author.name]: getByAuthor(author, quotes),
    }),
    {},
);

export const generateQuoteMap = (quoteCount: number): QuoteMap =>
    authors.reduce(
        (previous: QuoteMap, author: Author) => ({
            ...previous,
            [author.name]: getQuotes(quoteCount / authors.length),
        }),
        {},
    );
