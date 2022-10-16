const auth_engine_machine = createMachine({
  id: "AuthEngineMachine",
  initial: "UNKNOWN",
  states: {
    UNKNOWN: {
      on: {
        AUTH_WALLET: [
          {
            target: "new_user",
            cond: "NOT EXIST Profile With Address",
          },
          {
            target: "authenticated_profile",
            cond: "EXIST Profile WITH Address",
          },
        ],
      },
    },
    new_user: {
      on: {
        AUTH_CREATE_PROFILE: {
          target: "authenticated_profile",
        },
        AUTH_SIGNOUT: {
          target: "UNKNOWN",
        },
      },
    },
    authenticated_profile: {
      on: {
        AUTH_UPGRADE_TO_CREATOR: {
          target: "pending_creator_profile",
        },
        AUTH_SIGNOUT: {
          target: "UNKNOWN",
        },
      },
    },
    pending_creator_profile: {
      on: {
        AUTH_PASSBASE_VERIFY: [
          {
            target: "verified_creator_profile",
            cond: "PASS",
          },
          {
            target: "authenticated_profile",
            cond: "FAIL",
          },
        ],
      },
    },
    verified_creator_profile: {
      on: {
        AUTH_SIGNOUT: {
          target: "UNKNOWN",
        },
      },
    },
  },
  schema: {
    context: {} as {},
    events: {} as
      | { type: "AUTH_WALLET" }
      | { type: "AUTH_PASSBASE_VERIFY" }
      | { type: "AUTH_SIGNOUT" }
      | { type: "AUTH_CREATE_PROFILE" }
      | { type: "AUTH_UPGRADE_TO_CREATOR" },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
});

export default auth_engine_machine;
