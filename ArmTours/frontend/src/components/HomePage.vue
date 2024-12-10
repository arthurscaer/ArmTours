<template>
  <div id="home-page">
    <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl || defaultProfileImage" @logout="logout" />
    <div class="content">
      <div class="slider-container">
        <div class="arrow-container left-arrow">
          <button @click="prevItem">‹</button>
        </div>
        <div id="slider">
          <div v-for="item in visibleItems" :key="item.id" class="b-content__inline_item">
            <router-link :to="`/province-info/${item.province}`">
              <img :src="item.image_data" :alt="item.name" />
              <h2>{{ item.name }}</h2>
              <p></p>
              <p></p>
            </router-link>
          </div>
        </div>
        <div class="arrow-container right-arrow">
          <button @click="nextItem">›</button>
        </div>
      </div>
    </div>
    <ArmeniaMap />
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue';
import ArmeniaMap from '@/components/ArmeniaMap.vue';
import defaultProfileImage from '@/assets/default-profile.png';
import axios from 'axios';

export default {
  name: 'HomePage',
  components: {
    MenuBar,
    ArmeniaMap,
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
      vorname: localStorage.getItem('vorname') || '',
      nachname: localStorage.getItem('nachname') || '',
      birthdate: localStorage.getItem('birthdate') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      sehenswuerdigkeiten: [],
      currentIndex: 0,
      defaultProfileImage,
    };
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

      this.username = '';
      this.role = '';
      this.vorname = '';
      this.nachname = '';
      this.birthdate = '';

      this.$emit('logout');
      this.$router.push('/');
      window.location.reload();
    },
    async fetchAllChurches() {
      const cachedData = sessionStorage.getItem('allChurches');
      if (cachedData) {
        this.sehenswuerdigkeiten = JSON.parse(cachedData);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8002/api/all-churches');
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Keine gültigen Daten empfangen');
        }
        this.sehenswuerdigkeiten = response.data;
        sessionStorage.setItem('allChurches', JSON.stringify(this.sehenswuerdigkeiten));
      } catch (error) {
        console.error('Fehler beim Abrufen der Kirchen:', error.message || error);
      }
    },
    updateVisibleItems() {
      this.$forceUpdate();
    },
    nextItem() {
      const itemsPerView = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
      const maxIndex = window.innerWidth > 768 ? 5 : itemsPerView;

      if (this.currentIndex < this.sehenswuerdigkeiten.length - maxIndex) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    },
    prevItem() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.sehenswuerdigkeiten.length - 1;
      }
    }
  },
  computed: {
    visibleItems() {
      const itemsPerView = window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 2 : 3;
      return window.innerWidth > 768
        ? this.sehenswuerdigkeiten.slice(this.currentIndex, this.currentIndex + 5)
        : this.sehenswuerdigkeiten.slice(this.currentIndex, this.currentIndex + itemsPerView);
    },
    computedProfileImageUrl() {
      return this.profileImageUrl && this.profileImageUrl !== 'null'
        ? this.profileImageUrl
        : this.defaultProfileImage;
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateVisibleItems);
    this.fetchAllChurches();
    document.title = 'ArmTours';
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateVisibleItems);
  },
}
</script>

<style scoped>
#home-page {
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  position: relative;
  background-color: #EEF7FF;
}

.content {
  flex: 1;
  text-align: center;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 12000px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: -10px;
}

#slider {
  display: flex;
  overflow: hidden;
  flex: 1;
  justify-content: center;
  align-items: center;
  justify-content: center;
}

.b-content__inline_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 150px;
  height: auto;
  overflow: hidden;
  margin: 0 15px;
}

.b-content__inline_item h2 {
  text-align: center;
  margin: 10px 0;
  height: 45px;
  text-overflow: ellipsis;
  white-space: wrap;
}

.b-content__inline_item img {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.b-content__inline_item h2 {
  font-size: 18px;
  margin: 10px 0 5px;
}

.b-content__inline_item p {
  font-size: 14px;
  color: #666;
}

.arrow-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  z-index: 2;
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}

button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
}

button:hover {
  color: #007BFF;
}

.b-content__inline_item a {
  text-decoration: none;
  color: inherit;
  transition: background-color 0.5s ease, transform 0.3s ease;
}

.b-content__inline_item a:hover h2 {
  color: #B8869B;
}

.b-content__inline_item a h2 {
  margin: 10px 0 5px;
}

@media (max-width: 768px) {
  #home-page {
    flex-direction: column;
  }

  .content {
    flex-direction: column;
  }

  .slider-container {
    width: 100%;
    padding: 5px;
    margin: 10px 0;
  }

  .b-content__inline_item img {
    width: 100px;
    height: 150px;
  }

  .b-content__inline_item {
    margin: 0 5px;
  }

  .arrow-container {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  ArmeniaMap {
    width: 100%;
    margin-bottom: 20px;
  }

  .slider-container {
    width: 90%;
  }

  .b-content__inline_item {
    width: 120px;
  }

  .b-content__inline_item h2 {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .b-content__inline_item img {
    width: 80px;
    height: 120px;
  }

  .slider-container {
    margin: 0 5px;
  }

  .slider-container {
    width: 100%;
  }

  .b-content__inline_item {
    width: 100px;
  }

  .b-content__inline_item h2 {
    font-size: 13px;
  }
}
</style>
