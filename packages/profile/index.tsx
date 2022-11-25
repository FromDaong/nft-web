export const profile_utils = (profile_username) => {
  const share_profile = (username) =>
    `https://${process.env.NEXT_PUBLIC_HOSTNAME}/${profile_username}?ref=${username}`;

  return {
    share_profile,
  };
};
