import "@johnlindquist/kit"
import type { Choice, PromptConfig } from "@johnlindquist/kit"

export default async function promptConfirm(
  message: string,
  style: "yesno" | "confirm" = "confirm",
  promptConfig: Omit<PromptConfig, "placeholder"> = {},
): Promise<boolean> {
  const { choices, placeholder } = getPropsForStyle(style)

  const choice = await select(
    {
      placeholder,
      hint: message,
      panel: message,
      multiple: false,
      strict: true,
      ...promptConfig,
    },
    choices,
  )

  return choice === "y"
}

function getPropsForStyle(style: "yesno" | "confirm"): { choices: Choice<"y" | "n">[]; placeholder: string } {
  switch (style) {
    case "yesno":
      return {
        placeholder: "Please type 'y' for yes or 'n' for no",
        choices: [
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
        ],
      }
    case "confirm":
      return {
        placeholder: "Please type 'c' to confirm",
        choices: [
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
        ],
      }
  }
}
