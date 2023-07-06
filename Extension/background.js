// Tried "converting" the Python version into Javascript.

const asciiLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "0123456789";
const symbols = "!@#$%^&*+";

function checkPasswordStrength(password) {
  const passlen = 12;

  if (password.length < passlen) {
    return "SHORT";
  }

  if (
    !password.split("").some((char) => char.toUpperCase() !== char) ||
    !password.split("").some((char) => char.toLowerCase() !== char)
  ) {
    return "UPLOW";
  }

  if (!/\d/.test(password)) {
    return "NODIG";
  }

  if (!/[!@#$%^&*+]/.test(password)) {
    return "NOSYM";
  }

  // Check #5: Check For Consecutive Characters
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      return "CONSEC";
    }
  }

  for (let i = 0; i < password.length - 2; i++) {
    if (
      (password.charCodeAt(i) === password.charCodeAt(i + 1) - 1 &&
        password.charCodeAt(i) === password.charCodeAt(i + 2) - 2) ||
      (password.charCodeAt(i) === password.charCodeAt(i + 1) + 1 &&
        password.charCodeAt(i) === password.charCodeAt(i + 2) + 2) ||
      (password[i] === password[i + 1] && password[i] === password[i + 2])
    ) {
      return "PATRN";
    }
  }

  return true;
}

function generatePassword(keyword, password) {
  let updatedPassword = password;

  if (keyword === "SHORT") {
    while (updatedPassword.length < 12) {
      updatedPassword += randomChoice(asciiLetters + digits + symbols);
    }
  }

  if (keyword === "UPLOW") {
    const lowercaseIndices = [...updatedPassword]
      .map((char, index) => (char.toLowerCase() === char ? index : -1))
      .filter((index) => index !== -1);
    const uppercaseIndices = [...updatedPassword]
      .map((char, index) => (char.toUpperCase() === char ? index : -1))
      .filter((index) => index !== -1);

    if (lowercaseIndices.length === 0) {
      const index = randomChoice(uppercaseIndices);
      updatedPassword =
        updatedPassword.substring(0, index) +
        updatedPassword[index].toLowerCase() +
        updatedPassword.substring(index + 1);
    }

    if (uppercaseIndices.length === 0) {
      const index = randomChoice(lowercaseIndices);
      updatedPassword =
        updatedPassword.substring(0, index) +
        updatedPassword[index].toUpperCase() +
        updatedPassword.substring(index + 1);
    }
  }

  if (keyword === "NODIG") {
    const replacements = {
      a: "4",
      b: "8",
      e: "3",
      g: "6",
      i: "1",
      l: "7",
      o: "0",
      s: "5",
      v: "7",
      z: "2",
    };
    let replaced = false;

    for (let i = 0; i < updatedPassword.length; i++) {
      const char = updatedPassword[i];
      if (replacements[char]) {
        updatedPassword =
          updatedPassword.substring(0, i) +
          replacements[char] +
          updatedPassword.substring(i + 1);
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      updatedPassword += randomChoice(digits);
    }
  }

  if (keyword === "NOSYM") {
    const replacements = {
      a: "@",
      b: "&",
      h: "#",
      i: "!",
      l: "!",
      n: "7",
      o: "*",
      s: "$",
      t: "+",
      v: "^",
      x: "%",
      y: "7",
      z: "$",
    };
    const indices = [...Array(updatedPassword.length).keys()].sort(
      () => Math.random() - 0.5
    );
    let replaced = false;

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const char = updatedPassword[index];
      if (replacements[char]) {
        updatedPassword =
          updatedPassword.substring(0, index) +
          replacements[char] +
          updatedPassword.substring(index + 1);
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      updatedPassword += randomChoice(symbols);
    }
  }

  const replacements = {
    a: ["4", "@"],
    b: ["8", "&"],
    e: ["3"],
    g: ["6"],
    h: ["#"],
    i: ["1", "!"],
    l: ["7", "!"],
    n: ["7"],
    o: ["*", "0"],
    s: ["5", "$"],
    t: ["+"],
    v: ["^"],
    x: ["%"],
    y: ["7"],
    z: ["2", "$"],
  };

  if (keyword === "CONSEC") {
    for (let i = 0; i < updatedPassword.length - 1; i++) {
      if (updatedPassword[i] === updatedPassword[i + 1]) {
        const char = updatedPassword[i].toLowerCase();
        const replacement = replacements[char];
        if (replacement) {
          updatedPassword =
            updatedPassword.substring(0, i + 1) +
            randomChoice(replacement) +
            updatedPassword.substring(i + 2);
        } else {
          updatedPassword =
            updatedPassword.substring(0, i + 1) +
            randomChoice(asciiLetters + digits + symbols) +
            updatedPassword.substring(i + 1);
        }
        break;
      }
    }
  }

  if (keyword === "PATRN") {
    for (let i = 0; i < updatedPassword.length - 2; i++) {
      if (
        (updatedPassword.charCodeAt(i) ===
          updatedPassword.charCodeAt(i + 1) - 1 &&
          updatedPassword.charCodeAt(i) ===
            updatedPassword.charCodeAt(i + 2) - 2) ||
        (updatedPassword.charCodeAt(i) ===
          updatedPassword.charCodeAt(i + 1) + 1 &&
          updatedPassword.charCodeAt(i) ===
            updatedPassword.charCodeAt(i + 2) + 2) ||
        (updatedPassword[i] === updatedPassword[i + 1] &&
          updatedPassword[i] === updatedPassword[i + 2])
      ) {
        const char = updatedPassword[i].toLowerCase();
        const replacement = replacements[char];
        if (replacement) {
          updatedPassword =
            updatedPassword.substring(0, i + 1) +
            randomChoice(replacement) +
            updatedPassword.substring(i + 2);
        } else {
          updatedPassword =
            updatedPassword.substring(0, i + 1) +
            randomChoice(asciiLetters + digits + symbols) +
            updatedPassword.substring(i + 1);
        }
        break;
      }
    }
  }

  return updatedPassword;
}

function randomChoice(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function generateStrongPassword(password) {
  let newPassword = password;
  while (checkPasswordStrength(newPassword) !== true) {
    newPassword = generatePassword(
      checkPasswordStrength(newPassword),
      newPassword
    );
  }
  return newPassword;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "generatePassword") {
    const generatedPassword = generateStrongPassword(request.password);
    sendResponse({ password: generatedPassword });
  }
});
