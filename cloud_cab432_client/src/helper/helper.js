export function generateSpaces(count) {
  return "\u00A0".repeat(count);
}

export function generateLoadingStory(lang) {
  const dict = {
    en: [
      "Weaving a tale",
      "Setting a stage",
      "Orchestrating a plot",
      "Constructing a storyline",
      "Designing a chronicle",
    ],
  };

  return dict[lang][Math.floor(Math.random() * dict[lang].length)];
}

export function generateLoadingQuiz(lang) {
  const dict = {
    en: [
      "Cooking up",
      "Whipping together",
      "Crafting a challenge",
      "Putting together",
      "Designing a quiz",
    ],
  };

  return dict[lang][Math.floor(Math.random() * dict[lang].length)];
}
