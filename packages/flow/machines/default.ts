export const default_machine = {
  id: "AuthEngineMachine",
  initial: "BASIC_PROFILE",
  states: {
    BASIC_PROFILE: {
      on: {
        UPGRADE_PROFILE: [
          {
            target: "ENTER_CREATOR_PERSONAL_INFORMATION",
            cond: "NOT EXIST creator_personal_information",
          },
          {
            target: "PASSBASE_VERIFICATION",
            cond: "EXIST creator_personal_information",
          },
        ],
      },
    },
  },
};
