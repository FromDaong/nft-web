export const onlyQueryProps = (ctx: { query: any }) => ({
  props: {
    query: ctx.query,
  },
});

export const blankServerProps = {
  props: {},
};

export const withDataProps = (data: any): object => {
  return {
    props: {
      ...data,
    },
  };
};

export const redirectToPage = ({ page, redirectTo }) => ({
  redirect: {
    permanent: false,
    destination: `${page}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`,
  },
  props: { redirectTo },
});

export const returnProps = (props) => ({
  props: { ...props },
});
