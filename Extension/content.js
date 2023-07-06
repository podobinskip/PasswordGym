function isPasswordBoxPresent() {
  return document.querySelector(".password-box") !== null;
}

function createPasswordBoxElement() {
  var container = document.createElement("div");
  container.classList.add("password-container");

  var passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Check your password with PasswordGym!";
  passwordLabel.classList.add("password-label");
  container.appendChild(passwordLabel);

  var passwordBox = document.createElement("div");
  passwordBox.classList.add("password-box");

  var passwordInput = document.createElement("input");
  passwordInput.type = "text";
  passwordInput.placeholder = "Enter password";

  var checkButton = document.createElement("button");
  checkButton.textContent = "Check";

  var handleCheckButtonClick = function (event) {
    event.preventDefault();

    var password = passwordInput.value;
    sendPasswordToBackgroundScript(password);
  };

  checkButton.addEventListener("click", handleCheckButtonClick);

  passwordBox.appendChild(passwordInput);
  passwordBox.appendChild(checkButton);

  container.appendChild(passwordBox);

  return container;
}

function attachPasswordBox(createPasswordBox, target) {
  target.parentNode.appendChild(createPasswordBox);
}

document.addEventListener("click", function (event) {
  var target = event.target;

  if (
    target.tagName.toLowerCase() === "input" &&
    target.type === "password" &&
    !target.nextElementSibling.classList.contains("password-box") &&
    !isPasswordBoxPresent() &&
    isAccountCreationPage()
  ) {
    var passwordBox = createPasswordBoxElement();
    attachPasswordBox(passwordBox, target);
  }
});

function isAccountCreationPage() {
  var passwordFields = document.querySelectorAll('input[type="password"]');
  var pageContent = document.body.innerText.toLowerCase();

  if (passwordFields.length >= 2) {
    return true;
  }

  if (
    pageContent.includes("confirm password") ||
    pageContent.includes("enter new password")
  ) {
    return true;
  }

  return false;
}

function sendPasswordToBackgroundScript(password) {
  chrome.runtime.sendMessage({ action: "generatePassword", password: password }, function (response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    var generatedPassword = response.password;
    displayResult(generatedPassword, password);
  });
}

function displayResult(generatedPassword, inputPassword) {
  var passwordContainer = document.querySelector(".password-container");
  var resultLabel = passwordContainer.querySelector(".result-label");

  if (resultLabel) {
    resultLabel.remove();
  }

  if (generatedPassword === inputPassword) {
    var label = document.createElement("label");
    label.textContent = "Your password is already strong!";
    label.classList.add("result-label");
    passwordContainer.appendChild(label);
  } else {
    var label = document.createElement("label");
    label.textContent = "Your password has been strengthened!";
    label.classList.add("result-label");
    passwordContainer.appendChild(label);

    var passwordInput = passwordContainer.querySelector("input");
    passwordInput.value = generatedPassword;
  }
}
