export const create_post_machine = createMachine({
  id: "create_post_machine",
  initial: "select_post_type",
  states: {
    select_post_type: {},
    trit_collectible_content: {},
    trit_subscription_content: {},
    trit_exclusive_content: {},
    publish_post: {},
    preview_published_post: {},
  },
});
