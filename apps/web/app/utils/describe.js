const Cache = () => {
  const get = (key) => {};
  const set = (key, value) => {};
  const is = (key) => {};
  return {
    get,
    set,
    is,
  };
};

const OpenAI = ({ systemPrompt }) => {
  const invoke = ({ contexts, userPrompt }) => {};
  return { invoke };
};

const describe = ({ input, type }) => {
  const systemPrompt = "";
  const cache = Cache();
  if (cache.is(input)) {
    return cache.get(input);
  }
  const openAI = OpenAI({ systemPrompt });
  const aiGeneratedDescription = openAI.invoke({
    contexts: [],
    userPrompt: input,
  });
  return cache.set(input, aiGeneratedDescription);
};

export { describe };
