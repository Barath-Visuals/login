const B = [
  "******** ",
  "***   ***",
  "***   ***",
  "******** ",
  "***   ***",
  "***   ***",
  "******** ",
];

const A = [
  "   ***   ",
  "  *****  ",
  " *** *** ",
  "***   ***",
  "*********",
  "***   ***",
  "***   ***",
];

const R = [
  "******** ",
  "***   ***",
  "***   ***",
  "******** ",
  "***  *** ",
  "***   ***",
  "***    **",
];

const T = [
  "***********",
  "***********",
  "    ***    ",
  "    ***    ",
  "    ***    ",
  "    ***    ",
  "    ***    ",
];

const H = [
  "***   ***",
  "***   ***",
  "***   ***",
  "*********",
  "***   ***",
  "***   ***",
  "***   ***",
];

const buildAsciiWord = (...letters) => {
  const rows = letters[0].length;
  const result = [];

  for (let i = 0; i < rows; i++) {
    let row = "";
    for (let letter of letters) {
      row += letter[i] + "  "; // Add space between letters
    }
    result.push(row);
  }

  return result.join("\n");
};

const asciiBarath = buildAsciiWord(B, A, R, A, T, H);

export default asciiBarath;
