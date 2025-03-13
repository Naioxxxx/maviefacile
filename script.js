document.addEventListener('DOMContentLoaded', function () {
    // Afficher le pseudo de l'utilisateur connecté
    const loggedInUsername = document.getElementById('logged-in-username');
    if (loggedInUsername) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            loggedInUsername.textContent = loggedInUser.username;
        }
    }

    // Gestion de la connexion (dans index.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Récupère les utilisateurs depuis le localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Vérifie si l'utilisateur existe
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                alert('Connexion réussie !');
                localStorage.setItem('loggedInUser', JSON.stringify(user)); // Stocke l'utilisateur connecté
                window.location.href = 'home.html'; // Redirige vers la page d'accueil
            } else {
                alert('Nom d\'utilisateur ou mot de passe incorrect.');
            }
        });
    }

    // Gestion de l'inscription (dans register.html)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Récupération des valeurs
            const email = document.getElementById('email').value.trim();
            const newUsername = document.getElementById('new-username').value.trim();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const profilePicture = document.getElementById('profile-picture').value.trim();

            // Réinitialisation des erreurs
            clearErrors();

            // Validation des champs
            if (!validateForm(email, newUsername, newPassword, confirmPassword, profilePicture)) {
                return;
            }

            // Création de l'utilisateur
            const defaultProfilePicture = "https://us.123rf.com/450wm/kritchanut/kritchanut1405/kritchanut140500356/28235038-man-ic%C3%B4ne-silhouette-avec-le-signe-de-point-d-interrogation-notion-anonyme-et-suspect.jpg?ver=6";
            const finalProfilePicture = profilePicture || defaultProfilePicture;

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(u => u.username === newUsername)) {
                showError('username-error', 'Ce nom d\'utilisateur est déjà pris');
                return;
            }

            if (users.some(u => u.email === email)) {
                showError('email-error', 'Cet email est déjà utilisé');
                return;
            }

            // Enregistrement
            users.push({
                email,
                username: newUsername,
                password: newPassword, // À hasher en production!
                profilePicture: finalProfilePicture,
                description: '',
                joined: new Date().toISOString()
            });

            localStorage.setItem('users', JSON.stringify(users));
            alert('Inscription réussie !');
            window.location.href = 'index.html';
        });
    }

    // Fonctions de validation
    function validateForm(email, username, password, confirmPassword, profilePicture) {
        let isValid = true;

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email-error', 'Format d\'email invalide');
            isValid = false;
        }

        // Validation username
        if (username.length < 3) {
            showError('username-error', 'Minimum 3 caractères');
            isValid = false;
        }

        // Validation password
        if (password.length < 8) {
            showError('password-error', 'Minimum 8 caractères');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-error', 'Les mots de passe ne correspondent pas');
            isValid = false;
        }

        // Validation image
        if (profilePicture) {
            const pathPart = profilePicture.split(/[?#]/)[0];
            const allowedExtensions = /\.(png|jpe?g|webp)$/i;
            if (!allowedExtensions.test(pathPart)) {
                showError('image-error', 'Format .png, .jpg ou .webp requis');
                isValid = false;
            }
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => errorElement.style.display = 'none', 5000);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    // Gestion du menu déroulant (dans home.html et settings.html)
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerMenu && dropdownMenu) {
        hamburgerMenu.addEventListener('click', function () {
            // Ajoute/retire la classe 'active' pour l'animation
            this.classList.toggle('active');
            // Gère l'ouverture/fermeture du menu
            dropdownMenu.classList.toggle('show');
        });

        // Fermer le menu déroulant si on clique ailleurs
        window.addEventListener('click', function (event) {
            if (!event.target.closest('.menu-container')) {
                hamburgerMenu.classList.remove('active');
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Gestion de l'affichage des utilisateurs (dans home.html)
    const userList = document.getElementById('user-list');
    if (userList) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="user-profile">
                <div class="user-header">
                    <img src="${user.profilePicture}" 
                         alt="Photo de ${user.username}" 
                         class="profile-picture">
                    <div class="user-info">
                        <div class="username-line">
                            <span class="username">${user.username}</span>
                            <button class="user-button">Contacter</button>
                        </div>
                        <p class="user-description">
                            ${user.description || "Aucune description disponible"}
                        </p>
                    </div>
                </div>
            </div>
        `;
            userList.appendChild(li);

            if (index < users.length - 1) {
                const separator = document.createElement('div');
                separator.classList.add('separator');
                userList.appendChild(separator);
            }
        });
    }
    
 // Gestion de la sauvegarde de la description (dans settings.html)
 const descriptionForm = document.getElementById('description-form');
 if (descriptionForm) {
     descriptionForm.addEventListener('submit', function(e) {
         e.preventDefault();
         
         // Récupérer l'utilisateur connecté (avec le bon nom de clé 'loggedInUser')
         const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
         const users = JSON.parse(localStorage.getItem('users')) || [];
         
         // Mettre à jour la description
         const newDescription = document.getElementById('user-description').value;
         loggedInUser.description = newDescription;
         
         // Mettre à jour la liste des utilisateurs
         const userIndex = users.findIndex(u => u.username === loggedInUser.username);
         if (userIndex > -1) {
             users[userIndex] = loggedInUser;
             localStorage.setItem('users', JSON.stringify(users));
             localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
             
             alert('Description sauvegardée avec succès !');
             document.getElementById('user-description').value = '';
         }
     });
 }
 
    // Gestion du formulaire de réinitialisation de mot de passe (dans reset-password.html)
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetMessage = document.getElementById('reset-message');

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            const newPassword = document.getElementById('new-password').value;

            // Récupère les utilisateurs depuis le localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Trouve l'utilisateur par son e-mail
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex !== -1) {
                // Met à jour le mot de passe de l'utilisateur
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));

                // Affiche un message de succès
                resetMessage.textContent = 'Mot de passe réinitialisé avec succès !';
                resetMessage.classList.remove('error');
                resetMessage.classList.add('success');
                resetMessage.classList.remove('hidden');

                // Redirige vers la page de connexion après 3 secondes
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                // Affiche un message d'erreur
                resetMessage.textContent = 'Aucun utilisateur trouvé avec cette adresse e-mail.';
                resetMessage.classList.remove('success');
                resetMessage.classList.add('error');
                resetMessage.classList.remove('hidden');
            }
        });
    }

    // Gestion du formulaire de modification de la photo de profil (dans edit-profile.html)
    const editProfileForm = document.getElementById('edit-profile-form');
    const editProfileMessage = document.getElementById('edit-profile-message');

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newProfilePicture = document.getElementById('new-profile-picture').value;

            // Récupère l'utilisateur actuellement connecté
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Trouve l'utilisateur dans la liste des utilisateurs
            const userIndex = users.findIndex(u => u.username === loggedInUser.username);

            if (userIndex !== -1) {
                // Met à jour la photo de profil de l'utilisateur
                users[userIndex].profilePicture = newProfilePicture;
                localStorage.setItem('users', JSON.stringify(users));

                // Met à jour l'utilisateur connecté dans le localStorage
                loggedInUser.profilePicture = newProfilePicture;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // Affiche un message de succès
                editProfileMessage.textContent = 'Photo de profil mise à jour avec succès !';
                editProfileMessage.classList.remove('error');
                editProfileMessage.classList.add('success');
                editProfileMessage.classList.remove('hidden');

                // Redirige vers la page d'accueil après 3 secondes
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 3000);
            } else {
                // Affiche un message d'erreur
                editProfileMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                editProfileMessage.classList.remove('success');
                editProfileMessage.classList.add('error');
                editProfileMessage.classList.remove('hidden');
            }
        });
    }
});