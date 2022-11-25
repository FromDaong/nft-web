import { styled } from "@styles/theme";
import { ReactNode } from "react";

export const Container = styled("div", {
  variants: {
    variant: {
      unstyled: {
        margin: 0,
      },
      tab: {
        padding: "12px",
      },
    },
    state: {
      active: {
        borderBottom: "2px solid $accentText",
      },
      default: {
        border: "0 !important",
      },
    },
  },
});

export const ContextualContainer = styled("div", {
  marginTop: "32px",
});

const ThemedContainer = styled(Container, {
  padding: "64px 0",

  variants: {
    state: {
      normal: {
        backgroundColor: "$surface",
      },
      invert: {
        backgroundColor: "$textContrast",
      },
    },
  },

  defaultVariants: {
    state: "normal",
  },
});

export const PublicFluidContainer = ({
  className,
  children,
  state,
  fullscreen,
}: {
  className?: string;
  children: ReactNode;
  state?: "invert" | "normal";
  fullscreen?: boolean;
}) => {
  return (
    <ThemedContainer state={state}>
      <div
        className={className + fullscreen ? "w-screen" : "max-w-6xl mx-auto"}
      >
        {children}
      </div>
    </ThemedContainer>
  );
};

export const FluidContainerBase = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
  state?: "invert" | "normal";
  fullscreen?: boolean;
}) => {
  return <div className={"max-w-6xl" + className}>{children}</div>;
};

export const FluidContainer = styled(FluidContainerBase, {
  variants: {
    justified: {
      true: {
        marginY: "12px",
      },
    },
  },
});
