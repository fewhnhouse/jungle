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
},
{
    id: 'ID-5',
    content: 'Sprint Content',
    status: columns[3],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
},
{
    id: 'ID-6',
    content: 'Sprint Content',
    status: columns[3],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
},
{
    id: 'ID-7',
    content: 'Sprint Content',
    status: columns[0],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
},
{
    id: 'ID-8',
    content: 'Sprint Content',
    status: columns[1],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
},
{
    id: 'ID-9',
    content: 'Sprint Content',
    status: columns[4],
    tags: [],
    priority: 2,
    type: "Story",
    storyPoints: 8,
    author: princess,
}]



