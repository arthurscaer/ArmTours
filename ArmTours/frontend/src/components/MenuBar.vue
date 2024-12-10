<template>
  <div class="menu">
    <div class="menu-toggle" @click="toggleMenu" v-if="isSmallScreen">☰</div> 
    <ul :class="{ 'show': menuVisible }">
      <li>
        <div class="menu-item"><router-link to="/">Startseite</router-link></div>
      </li>
      <li>
        <div class="menu-item"><router-link to="/my-profile">Mein Profil</router-link></div>
      </li>
      <li>
        <div class="menu-item"><router-link to="/my-places">Provinzen</router-link></div>
      </li>
      <li>
        <div class="menu-item"><router-link to="/about">Vision</router-link></div>
      </li>
      <li v-if="!user">
        <div class="menu-item"><router-link to="/register">Einloggen</router-link></div>
      </li>
      <li v-else>
        <div class="menu-item"><a href="#" @click="logout">Logout</a></div>
      </li>
      <li v-if="role === 'supersuperuser'">
        <div class="menu-item"><router-link to="/admin">Adminpanel</router-link></div>
      </li>
      <li class="flex-grow"></li>
      <li class="profile-and-notifications">
        <div class="profile" @click="goToProfile">
          <img :src="computedProfileImageUrl" alt="Profilbild" @error="handleImageError" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import defaultProfileImage from '@/assets/default-profile.png';

export default {
  name: 'MenuBar',
  props: {
    user: {
      type: String,
      default: null
    },
    role: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      Vorname: localStorage.getItem('Vorname') || '',
      Nachname: localStorage.getItem('Nachname') || '',
      birthdate: localStorage.getItem('birthdate') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      defaultProfileImage,
      menuVisible: false,
    };
  },
  computed: {
    computedProfileImageUrl() {
      return this.profileImageUrl && this.profileImageUrl !== 'null'
        ? this.profileImageUrl
        : this.defaultProfileImage;
    },
    isSmallScreen() {
      return window.innerWidth <= 768; 
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('vorname');
      localStorage.removeItem('nachname');
      localStorage.removeItem('birthdate');
      localStorage.removeItem('profileImageUrl');
      this.$emit('logout');
    },
    goToProfile() {
      this.$router.push('/my-profile');
    },
    handleImageError(event) {
      console.error('Fehler beim Laden des Bildes:', event.target.src);
    },
    viewNotifications() {
      console.log('Benachrichtigungen ansehen');
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible; 
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.menuVisible = false; 
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.closeMenu);
  }
};
</script>

<style scoped>
.menu {
  background-color: #577B8D;
  color: #fff;
  padding: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  font-family: Arial, sans-serif;
}

.menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.menu ul li {
  margin-right: 20px;
}

.menu ul li:last-child {
  margin-right: 0;
}

.menu ul li .menu-item {
  padding: 8px;
  border-radius: 5px;
}

.menu ul li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.menu ul li a:hover {
  color: #ddd;
}

.flex-grow {
  flex-grow: 1;
}

.profile-and-notifications {
  display: flex;
  align-items: center;
}

.profile {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notifications {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.notifications svg {
  color: #fff;
  width: 32px;
  height: 32px;
  display: block;
}

.notifications svg:hover {
  color: #ddd;
}

@media (max-width: 768px) {
  .menu ul {
    flex-direction: column;
    align-items: flex-start;
    display: none;
  }

  .menu ul.show {
    display: flex;
  }

  .menu-toggle {
    display: block;
  }
}

/* Für große Bildschirme */
@media (min-width: 769px) {
  .menu ul {
    display: flex;
  }

  .menu-toggle {
    display: none;
  }
}
</style>