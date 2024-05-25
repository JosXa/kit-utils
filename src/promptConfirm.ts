import "@johnlindquist/kit"
import type { Choice, PromptConfig } from "@johnlindquist/kit"

export default async function promptConfirm(
  message: string,
  style: "yesno" | "confirm" = "confirm",
  promptConfig: Omit<PromptConfig, "placeholder"> = {},
): Promise<boolean> {
  const choice = await select(
    {
      placeholder: message,
      hint: message,
      panel: message,
      multiple: false,
      strict: true,
      ...promptConfig,
    },
    getChoices(style),
  )
  return choice === "y"
}

function getChoices(style: "yesno" | "confirm"): Choice<"y" | "n">[] {
  switch (style) {
    case "yesno":
      return [
        {
          name: "(Y)es",
          value: "y",
          trigger: "y",
        },
        {
          name: "(N)o",
          value: "n",
          trigger: "n",
        },
      ]
    case "confirm":
      return [
        {
          name: "(C)onfirm",
          value: "y",
          trigger: "c",
        },
        {
          name: "(A)bort",
          value: "n",
          trigger: "a",
        },
      ]
  }
}
