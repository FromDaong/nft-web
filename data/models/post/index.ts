/**
 * Post Definition
 */
const Post = {
    post_id: {
        type: 'uuid',
        primary: true,
    },
    textContent: {
        type: 'string',
        index: true,
    },
    age: 'number',
    knows: {
        type: 'relationship',
        relationship: 'KNOWS',
        direction: 'out',
        properties: {
            since: {
                type: 'localdatetime',
                default: () => new Date,
            },
        },
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    }
};

export default Post
