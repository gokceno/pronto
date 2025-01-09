const Cache = () => {
  const get = (key) => {
  };
  const set = (key, value) => {
  };
  const is = (key) => {
  };
  export {
    get,
    set,
    is,
  };
}

const OpenAI = ({ systemPrompt }) => {
  const invoke = ({ contexts, userPrompt }) => {
  };
}

export const describe = ({ input, type }) => {
  const systemPrompt = "";
  const cache = Cache();
  if (cache.is(input)) {
    return cache.get(input);
  }
  const openAI = OpenAI({ systemPrompt });
  const aiGeneratedDescription = openAI.invoke({ contexts: [], userPrompt: input });
  return cache.set(input, aiGeneratedDescription);
}