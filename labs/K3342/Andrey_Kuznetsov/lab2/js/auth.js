import { API_BASE_URL } from './config.js';
import { JWT_BASE_URL } from './config.js';


document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[type='email']");
    const loginButton = document.querySelector(".button.login");  
    const signupButton = document.querySelector(".button.signup"); 

    const switchToSignup = document.querySelector("#signup");
    const switchToLogin = document.querySelector("#login");

    const passwordInput = document.querySelector("input[name='password']");
    const passwordConfirmInput = document.querySelector("input[name='confirm-password']");


    switchToSignup.addEventListener('click', () => {
        document.querySelector(".login-form").style.display = "none";
        document.querySelector(".signup-form").style.display = "block";
    });

    switchToLogin.addEventListener('click', () => {
        document.querySelector(".signup-form").style.display = "none";
        document.querySelector(".login-form").style.display = "block";
    });

    signupButton.addEventListener('click', async function (e) {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = passwordConfirmInput.value;

        if (password !== confirmPassword) {
            console.log(password, confirmPassword, passwordInput, passwordConfirmInput);
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.id) { // Проверяем, что пользователь был успешно создан
                alert("Registration successful. Please log in.");
                switchToLogin.click();
            } else {
                alert("Registration failed.");
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error during registration. Please try again later.');
        }
    });

    // Вход в систему с JWT
    loginButton.addEventListener('click', async function (e) {
        e.preventDefault(); // Предотвращаем перезагрузку страницы при клике на кнопку

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(`${JWT_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.token) {
                // Сохраняем токен и данные пользователя в localStorage
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                localStorage.setItem("jwt", data.token);

                window.location.href = '../html/profile.html'; // Переход на страницу профиля
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error during authentication. Please try again later.');
        }
    });
});
