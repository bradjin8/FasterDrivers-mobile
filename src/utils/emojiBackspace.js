function safeEmojiBackspace(str) {
  let initialRealCount = fancyCount(str);
  while (str.length > 0 && fancyCount(str) !== initialRealCount - 1) {
    str = str.substring(0, str.length - 1);
  }
  return str;
}
function fancyCount(str) {
  const joiner = "\u{200D}";
  const split = str.split(joiner);
  let count = 0;
  for (const s of split) {
    //removing the variation selectors
    const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join("")).length;
    count += num;
  }
  //assuming the joiners are used appropriately
  return count / split.length;
}

export default safeEmojiBackspace;