<template>
  <div id="whole-page">
    <div class="auth-container">
      <menu-bar :user="user" @logout="logout" />
      <div v-if="user" class="username-display">
        <h1>{{ user }}</h1>
      </div>
      <div v-if="!user" class="form-container">
        <h2>{{ showRegisterForm ? 'Registrieren' : 'Login' }}</h2>
        
        <!-- Login-Formular -->
        <form v-if="!showRegisterForm" @submit.prevent="login" class="auth-form">
          <input type="text" v-model="loginForm.username" placeholder="Benutzername" required>
          <input type="password" v-model="loginForm.password" placeholder="Passwort" required>
          <button type="submit">Einloggen</button>
          <p>Kein Konto? <a href="#" @click.prevent="toggleForm">Registrieren</a></p>
        </form>

        <!-- Registrierungs-Formular -->
        <form v-if="showRegisterForm" @submit.prevent="register" class="auth-form">
          <input type="text" v-model="registerForm.vorname" placeholder="Vorname" required>
          <input type="text" v-model="registerForm.nachname" placeholder="Name" required>
          <input type="text" v-model="registerForm.username" placeholder="Benutzername" required>
          <input type="password" v-model="registerForm.password" placeholder="Passwort" required>
          <input type="date" v-model="registerForm.birthdate" placeholder="Geburtsdatum" required>
          <button type="submit">Registrieren</button>
          <p>Bereits ein Konto? <a href="#" @click.prevent="toggleForm">Einloggen</a></p>
        </form>
      </div>

      <div v-if="user" class="welcome-message">
        <p>Hallo {{ user }}!</p>
        <p>Willkommen zurück!</p>
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue';

export default {
  name: 'AuthForm',
  components: {
    MenuBar
  },
  data() {
    return {
      showRegisterForm: false,
      registerForm: {
        username: '',
        password: '',
        vorname: '',
        nachname: '',
        birthdate: ''
      },
      loginForm: {
        username: '',
        password: ''
      },
      user: null,
      username: localStorage.getItem('username') || null,
      vorname: localStorage.getItem('vorname') || '',
      nachname: localStorage.getItem('nachname') || '',
      birthdate: localStorage.getItem('birthdate') || '',
      role: localStorage.getItem('role') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || 'default-profile.png' // Setze das Profilbild, falls vorhanden
    };
  },
  methods: {
    toggleForm() {
      this.showRegisterForm = !this.showRegisterForm;
    },
    register() {
      fetch('http://localhost:8002/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.registerForm)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.loginForm.username = this.registerForm.username;
        this.loginForm.password = this.registerForm.password;
        this.login();
      })
      .catch(error => {
        console.error('Fehler bei der Registrierung:', error);
      });
    },
    login() {
      fetch('http://localhost:8002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.loginForm)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          localStorage.setItem('vorname', data.vorname);
          localStorage.setItem('nachname', data.nachname);
          localStorage.setItem('birthdate', data.birthdate);
          localStorage.setItem('role', data.role); // Speichere die Rolle
          localStorage.setItem('profileImageUrl', data.profileImageUrl); // Profilbild-URL speichern


          this.user = data.username;
          this.vorname = data.vorname;
          this.nachname = data.nachname;
          this.birthdate = data.birthdate;
          this.role = data.role;
          this.profileImageUrl = data.profileImageUrl; // Setze die URL auch hier

          if (data.role === 'supersuperuser') {
            console.log('Benutzer ist ein Supersuperuser.');
            this.$router.push('/admin');
          } else {
            console.log('Benutzer ist kein Supersuperuser.');
            this.$router.push('/');
          }
        } else {
          console.error('Login fehlgeschlagen:', data.error);
        }
      })
      .catch(error => {
        console.error('Fehler beim Einloggen:', error);
      });
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('vorname');
      localStorage.removeItem('nachname');
      localStorage.removeItem('birthdate');
      localStorage.removeItem('role');
      localStorage.removeItem('profileImageUrl')
      this.user = null;
      this.vorname = '';
      this.nachname = '';
      this.$router.push('/');
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8002/api/welcome', {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          this.user = localStorage.getItem('username');
          this.vorname = localStorage.getItem('vorname');
          this.nachname = localStorage.getItem('nachname');
          this.birthdate = localStorage.getItem('birthdate');
          this.role = localStorage.getItem('role'); // Ausgabe der Benutzerrolle hinzugefügt
          console.log('Benutzerrolle:', this.role); // Ausgabe der Benutzerrolle
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('vorname');
          localStorage.removeItem('nachname');
          localStorage.removeItem('birthdate');
          localStorage.removeItem('role'); // Rolle entfernt, wenn keine Nachricht zurückgegeben wird
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('vorname');
        localStorage.removeItem('nachname');
        localStorage.removeItem('birthdate');
        localStorage.removeItem('role'); // Rolle entfernt, wenn ein Fehler auftritt
      });
    }
}
};
</script>

<style scoped>

#whole-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Mindesthöhe des gesamten Bildschirms */
  background-color: #EEF7FF; /* Hier die gewünschte Hintergrundfarbe einfügen */
}

.auth-container {
  position: relative;
}

.content-container {
  margin-top: 50px; /* Setze den oberen Abstand für den Inhalt, um Platz für das Menü zu schaffen */
}

.auth-form-container {
  position: fixed; /* Ändere die Position zu absolut */
  top: 50%; /* Setze die obere Position auf 50% des Elternelements */
  left: 50%; /* Setze die linke Position auf 50% des Elternelements */
  transform: translate(-50%, -50%); /* Verschiebe das Element um -50% seiner eigenen Breite und Höhe, um es horizontal und vertikal zu zentrieren */
}

.username-display h1 {
  font-size: 2em;
  color: #333;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-form input[type="text"],
.auth-form input[type="password"],
.auth-form input[type="date"],
.auth-form button {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.auth-form button {
  background-color: #577B8D; /* Hellgrün */
  color: white;
  border: none;
  cursor: pointer;
}

.auth-form button:hover {
  background-color: #2A629A; /* Etwas dunkleres Hellgrün für Hover-Effekt */
}

.auth-form p {
  text-align: center;
  margin-top: 10px;
}

.auth-form a {
  color: #007bff;
  text-decoration: none;
}

.auth-form a:hover {
  text-decoration: underline;
}

.welcome-message {
  text-align: center;
  margin-top: 20px;
}

.welcome-message p {
  font-size: 1.2em;
  color: #333;
}
</style>
