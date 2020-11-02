import defineData from "../define";

const talkie = data => {
  const { EMIT_DATA_KEY } = defineData;
  const str = `${EMIT_DATA_KEY}${JSON.stringify(data)}`;
  console.log(str);
};

export default talkie;
