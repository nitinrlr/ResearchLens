import type { ComponentProps } from "react";
import { Theme } from "@radix-ui/themes";

/** Keeps cards white inside the dark dashboard. */
export default function LightTheme(props: ComponentProps<typeof Theme>) {
  return (
    <Theme
      appearance="light"
      hasBackground={false}
      panelBackground="solid"
      {...props}
    />
  );
}
