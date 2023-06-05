# Using codebeautify.org to make the code better formatted and readable!
# Check it out here: https://codebeautify.org/python-formatter-beautifier#

import random
import string

passlen = 12  # Change this to any number greater than 8. Recommended to keep this at 12.


# This function will check the user's password strength.
# There are 6 checks. If any of these checks fail, the function will return a keyword.
# The returned keyword will then be sent to the generate_password function, which will then apply the necessary fixes.
# If the function returns True, the password is strong.
def check_password_strength(password):

    # Check #1: Password Length Check
    if len(password) < passlen:
        return "SHORT"  # Password length is less than the initialized length.
    # Check #1 passed, continue...

    # Check #2: Check For At Least 1 Uppercase and 1 Lowercase Letter
    if not any(char.isupper() for char in password) or not any(
        char.islower() for char in password
    ):
        return "UPLOW"  # Password does not contain an uppercase and lowercase letter.
    # Check #2 passed, continue...

    # Check #3: Check For At Least 1 Digit
    if not any(char.isdigit() for char in password):
        return "NODIG"  # Password does not contain a digit.
    # Check #3 passed, continue...

    # Check #4: Check For At Least 1 Symbol
    if not any(char in "!@#$%^&*+" for char in password):
        return "NOSYM"  # Password does not contain a symbol from the list above.
    # Check #4 passed, continue...

    # Check #5: Check For Consecutive Characters
    for i in range(len(password) - 1):
        if password[i] == password[i + 1]:
            return "CONSEC"  # Password contains consecutive characters.
    # Check #5 passed, continue...

    # Check #6: Check For Patterns
    for i in range(len(password) - 2):
        if (
            (ord(password[i]) == ord(password[i + 1]) - 1 == ord(password[i + 2]) - 2)
            or (
                ord(password[i]) == ord(password[i + 1]) + 1 == ord(password[i + 2]) + 2
            )
            or (password[i] == password[i + 1] == password[i + 2])
        ):
            return "PATRN"  # Password contains a pattern.
    # Check #6 passed, continue...

    # If all checks pass, return True for a strong password.
    return True


# This function will generate a very strong password or modify a user's existing password.
# The input keyword determines what the current issue with the input password is.
# This function will continuously be called along with check_password_strength() until a strong password is generated.
# The keywords have been explained above. The code should be rather self-explanatory.
def generate_password(keyword, password):
    updated_password = password

    if keyword == "SHORT":
        while len(updated_password) < 12:
            updated_password += random.choice(
                string.ascii_letters + string.digits + "!@#$%^&*+"
            )

    if keyword == "UPLOW":
        lowercase_indices = [
            i for i, char in enumerate(updated_password) if char.islower()
        ]
        uppercase_indices = [
            i for i, char in enumerate(updated_password) if char.isupper()
        ]
        if not lowercase_indices:
            index = random.choice(uppercase_indices)
            updated_password = (
                updated_password[:index]
                + updated_password[index].lower()
                + updated_password[index + 1 :]
            )
        if not uppercase_indices:
            index = random.choice(lowercase_indices)
            updated_password = (
                updated_password[:index]
                + updated_password[index].upper()
                + updated_password[index + 1 :]
            )

    if keyword == "NODIG":
        replacements = {
            "a": "4",
            "b": "8",
            "e": "3",
            "g": "6",
            "i": "1",
            "l": "7",
            "l": "1",
            "o": "0",
            "s": "5",
            "v": "7",
            "z": "2",
        }
        replaced = False
        for i in range(len(updated_password)):
            if updated_password[i] in replacements:
                updated_password = (
                    updated_password[:i]
                    + replacements[updated_password[i]]
                    + updated_password[i + 1 :]
                )
                replaced = True
                break
        if not replaced:
            updated_password += random.choice(string.digits)

    if keyword == "NOSYM":
        replacements = {
            "a": "@",
            "b": "&",
            "h": "#",
            "i": "!",
            "l": "!",
            "n": "7",
            "o": "*",
            "s": "$",
            "t": "+",
            "v": "^",
            "x": "%",
            "y": "7",
            "z": "$",
        }
        replaced = False
        indices = list(range(len(updated_password)))
        random.shuffle(indices)
        for i in indices:
            if updated_password[i] in replacements:
                updated_password = (
                    updated_password[:i]
                    + replacements[updated_password[i]]
                    + updated_password[i + 1 :]
                )
                replaced = True
                break
        if not replaced:
            updated_password += random.choice("!@#$%^&*+")

    replacements = {
        "a": ["4", "@"],
        "b": ["8", "&"],
        "e": ["3"],
        "g": ["6"],
        "h": ["#"],
        "i": ["1", "!"],
        "l": ["7", "!"],
        "n": ["7"],
        "o": ["*", "0"],
        "s": ["5", "$"],
        "t": ["+"],
        "v": ["^"],
        "x": ["%"],
        "y": ["7"],
        "z": ["2", "$"],
    }

    if keyword == "CONSEC":
        for i in range(len(updated_password) - 1):
            if updated_password[i] == updated_password[i + 1]:
                replacement = replacements.get(updated_password[i].lower())
                if replacement:
                    updated_password = (
                        updated_password[: i + 1]
                        + random.choice(replacement)
                        + updated_password[i + 2 :]
                    )
                else:
                    updated_password = (
                        updated_password[: i + 1]
                        + random.choice(
                            string.ascii_letters + string.digits + "!@#$%^&*+"
                        )
                        + updated_password[i + 1 :]
                    )
                break

    if keyword == "PATRN":
        for i in range(len(updated_password) - 2):
            if (
                (
                    ord(updated_password[i])
                    == ord(updated_password[i + 1]) - 1
                    == ord(updated_password[i + 2]) - 2
                )
                or (
                    ord(updated_password[i])
                    == ord(updated_password[i + 1]) + 1
                    == ord(updated_password[i + 2]) + 2
                )
                or (
                    updated_password[i]
                    == updated_password[i + 1]
                    == updated_password[i + 2]
                )
            ):
                replacement = replacements.get(updated_password[i].lower())
                if replacement:
                    updated_password = (
                        updated_password[: i + 1]
                        + random.choice(replacement)
                        + updated_password[i + 2 :]
                    )
                else:
                    updated_password = (
                        updated_password[: i + 1]
                        + random.choice(
                            string.ascii_letters + string.digits + "!@#$%^&*+"
                        )
                        + updated_password[i + 1 :]
                    )
                break
    return updated_password


# This is the main part of the program.
# Ask the user to input a password, and then determin its strength by calling check_password_strength().
# If the password is not strong enough, call generate_password() until calling check_password_strength() with the updated password returns True.

print("\nWelcome to Password Gym!\n")
print("***DISCLAIMER: Password Gym does not guarantee that your password will not be cracked.\n***Password strength goes beyond just the number of characters, digits, symbols, uppercase/lowercase letters etc.\n***Some additional precautions users should take that this program does not cover:")
print("1. Do not use the same password for multiple accounts.")
print("2. Do not use personal information in your password (e.g. your name, birthday, address, etc.)")
print("3. Do not use common words or phrases in your password (e.g. password, 123456, qwerty, etc.)\n")

while True:

    user_password = input("Enter a password: ")

    if check_password_strength(user_password) == True:
        print("\nYour password is already strong! Good job!")
    else:
        print("\nYour password could use some strengthening. Here is a modified version of your password!")
        new_password = user_password
        while check_password_strength(new_password) != True:
            new_password = generate_password(
                check_password_strength(new_password), new_password
            )

        print("\n***Your new password:", new_password)

    user_feedback = input("\nWould you like to check another password? (y/n): ")

    if user_feedback.lower() == "n":
        print("\nThanks for using Password Gym!")
        print("Please check out my GitHub for more personal projects! https://github.com/podobinskip")
        break
    

