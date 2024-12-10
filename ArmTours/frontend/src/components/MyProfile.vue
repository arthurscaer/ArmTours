<template>
  <div id="whole-page">
    <div>
      <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl || defaultProfileImage"
        @logout="logout" />
      <div class="profile-container">
        <h2>Willkommen, {{ username }}!</h2>
        <div class="profile-card">
          <div class="profile-image">
            <img :src="computedProfileImageUrl" alt="Profilbild" @error="handleImageError" />
            <div class="upload-button-image">
              <input type="file" @change="onFileChange" id="file-upload" />
              <label for="file-upload">Bild hochladen</label>
            </div>
          </div>
          <div class="profile-details">
            <p><strong>Benutzername:</strong> {{ username }}</p>
            <p><strong>Vorname:</strong> {{ vorname }}</p>
            <p><strong>Nachname:</strong> {{ nachname }}</p>
            <p><strong>Geburtsdatum:</strong> {{ formattedBirthdate }}</p>
            <button class="edit-button" @click="openEditModal">Bearbeiten</button>
          </div>
        </div>
        <div class="collections-section">
          <h3>Eigene Kollektionen</h3>
          <button class="btn-create" @click="openCreateCollectionPopup">Neue Sammlung erstellen</button>
          <div v-if="showCreateCollectionPopup" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeCreateCollectionPopup">&times;</span>
              <h3 class="modal-title">Neue Sammlung erstellen</h3>
              <div class="form-group">
                <label for="newCollectionName">Name der Sammlung:</label>
                <input type="text" v-model="newCollectionName" id="newCollectionName" class="input-field"
                  placeholder="Gib einen Namen ein" />
              </div>
              <div class="form-buttons">
                <button class="btn-create-collection" @click="createCollection">Erstellen</button>
                <button class="btn-cancel" @click="closeCreateCollectionPopup">Abbrechen</button>
              </div>
            </div>
          </div>
          <div v-if="uniqueCollections.length > 0" class="collections-grid">
            <div v-for="collection in uniqueCollections" :key="collection.id" class="collection-card">
              <h4>{{ collection.collection_name }}</h4>
              <div class="button-group">
                <button class="btn-open" @click="openCollectionPopup(collection)">Sammlung öffnen</button>
                <button class="btn-delete" @click="removeCollection(collection.id)">Sammlung löschen</button>
              </div>
            </div>
          </div>
          <p v-else>Noch keine Sammlungen vorhanden.</p>
        </div>
        <transition name="popup">
          <div v-if="showCollectionPopup" class="popup-collect">
            <div class="popup-collect-content">
              <div class="header">
                <h3 class="popup-title">Kirchen in {{ activeCollection.collection_name }}
                  <button class="btn-close" @click="closeCollectionPopup">Schließen</button>
                </h3>
              </div>
              <div v-if="activeCollection.churches && activeCollection.churches.length > 0" class="church-list">
                <div v-for="church in activeCollection.churches" :key="church.id" class="church-item">
                  <div class="church-image-container">
                    <img :src="church.image_data" alt="Bild von {{ church.name }}" class="church-image">
                    <button class="btn-visit" @click="goToProvince(church.province)">Ort besuchen</button>
                    <button class="btn-remove" @click="removeChurchFromCollection(church.name)">Ort löschen</button>
                  </div>
                  <div class="church-info">
                    <h4>Name: {{ church.name }}</h4>
                    <p><strong>Geschichte:</strong> {{ church.description }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-collection-message">
                <p>Keine Orte in der Sammlung. Sie haben die Möglichkeit, Provinzen zu erkunden und dadurch gefällte Orte
                  zu Ihren Sammlungen hinzuzufügen.</p>
                <button class="btn-add-place" @click="goToMyPlaces">Ort hinzufügen</button>
              </div>
            </div>
          </div>
        </transition>
        <div class="comments-section">
          <h3>Letzte Kommentare von {{ username }}</h3>
          <div v-if="sortedComments.length > 0">
            <ul>
              <li v-for="comment in sortedComments" :key="comment.id" class="comment-item">
                <p>
                  <span v-if="expandedComments.includes(comment.id)">{{ comment.comment }}</span>
                  <span v-else>
                    <p class="comment-date">{{ formatDate(comment.created_at) }}</p>
                    {{ truncateComment(comment.comment) }}
                    <a v-if="comment.comment.length > 2000" @click="toggleCommentExpansion(comment.id)">...mehr</a>
                  </span>
                </p>
                <button class="btn-goto" @click="goToPage(comment.church_name)">Zur Seite</button>
              </li>
            </ul>
          </div>
          <p v-else>Keine Kommentare vorhanden.</p>
          <button class="btn-open-comm" v-if="comments.length > 3" @click="showAllComments">Alle kommentare
            anzeigen</button>
        </div>
      </div>
      <transition name="modal2">
        <div v-if="isEditing" class="modal2">
          <div class="modal2-content">
            <span class="close" @click="closeEditModal">&times;</span>
            <h3>Profil bearbeiten</h3>
            <div class="form-group">
              <label for="username">Benutzername:</label>
              <input type="text" v-model="username" id="username" disabled />
            </div>
            <div class="form-group">
              <label for="Vorname">Vorname:</label>
              <input type="text" v-model="vorname" id="Vorname" />
            </div>
            <div class="form-group">
              <label for="Nachname">Nachname:</label>
              <input type="text" v-model="nachname" id="Nachname" />
            </div>
            <div class="form-group">
              <label for="birthdate">Geburtsdatum:</label>
              <input type="date" v-model="birthdate" id="birthdate" />
            </div>
            <div class="form-buttons">
              <button class="btn-save" @click="saveProfile">Speichern</button>
              <button class="btn-nosave" @click="closeEditModal">Abbrechen</button>
            </div>
          </div>
        </div>
      </transition>
      <transition name="modal-comment">
        <div v-if="showCommentsModal" class="modal-comment">
          <div class="modal-content-comment comments-modal-content">
            <h3>Alle Kommentare von {{ username }}</h3>
            <span class="close-comment" @click="closeCommentsModal">Schließen</span>
            <div v-if="comments.length === 0">
              <p>Keine Kommentare vorhanden.</p>
            </div>
            <ul v-else>
              <li v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-date">{{ new Date(comment.created_at).toLocaleDateString() }}</div>
                <div class="comment-text">
                  <p v-if="expandedComments.includes(comment.id)">{{ comment.comment }}</p>
                  <p v-else>
                    {{ truncateComment(comment.comment) }}
                    <a v-if="comment.comment.length > 2000" @click="toggleCommentExpansion(comment.id)">...mehr</a>
                  </p>
                </div>
                <div class="church-name">Kirche: {{ comment.church_name }}</div>
                <button class="btn-goto" @click="goToPage(comment.church_name)">Zur Seite</button>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue';
import axios from 'axios';
import defaultProfileImage from '@/assets/default-profile.png';

export default {
  name: 'MyProfile',
  components: {
    MenuBar
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
      vorname: localStorage.getItem('vorname') || '',
      nachname: localStorage.getItem('nachname') || '',
      birthdate: localStorage.getItem('birthdate') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      defaultProfileImage,
      isEditing: false,
      showCommentsModal: false,
      loggedInMessage: false,
      comments: [],
      expandedComments: [],
      userCollections: [],
      churchName: '',
      showCreateCollectionPopup: false,
      newCollectionName: '',
      collections: [],
      showCollectionPopup: false,
      activeCollection: null,
    };
  },
  computed: {
    formattedBirthdate() {
      const birthdate = new Date(this.birthdate);
      const pad = (num) => num.toString().padStart(2, '0');
      const day = pad(birthdate.getDate());
      const month = pad(birthdate.getMonth() + 1);
      const year = birthdate.getFullYear();
      return `${day}-${month}-${year}`;
    },
    uniqueCollections() {
      const unique = new Map();
      this.userCollections.forEach((collection) => {
        const key = `${collection.id}-${collection.collection_name}`;
        if (!unique.has(key)) {
          unique.set(key, collection);
        }
      });
      return Array.from(unique.values());
    },
    sortedComments() {
      return this.comments.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
    },
    reversedComments() {
      return this.comments.slice().reverse();
    },
    lastThreeComments() {
      const reversedComments = this.comments.slice().reverse();
      return reversedComments.slice(0, 3);
    },
    computedProfileImageUrl() {
      return this.profileImageUrl && this.profileImageUrl !== 'null'
        ? this.profileImageUrl
        : this.defaultProfileImage;
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
      this.$router.push('/');
    },
    handleImageError(event) {
      console.error('Fehler beim Laden des Bildes:', event.target.src);
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        console.error('Kein Bild ausgewählt');
        return;
      }
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', this.username);
      try {
        const response = await axios.post('http://localhost:8002/api/uploadImage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const { profileImageUrl } = response.data;
        this.profileImageUrl = profileImageUrl;
        localStorage.setItem('profileImageUrl', profileImageUrl);
      } catch (error) {
        console.error('Fehler beim Hochladen des Bildes:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('de-DE', options);
    },
    openEditModal() {
      this.isEditing = true;
      document.body.style.overflow = 'hidden';
    },
    closeEditModal() {
      this.isEditing = false;
      document.body.style.overflow = '';
    },
    showAllComments() {
      this.showCommentsModal = true;
      document.body.style.overflow = 'hidden';
    },
    isCommentExpanded(commentId) {
      return this.expandedComments.includes(commentId);
    },
    toggleCommentExpansion(commentId) {
      const index = this.expandedComments.indexOf(commentId);
      if (index === -1) {
        this.expandedComments.push(commentId);
      } else {
        this.expandedComments.splice(index, 1);
      }
    },
    truncateComment(comment) {
      if (comment.length > 2000) {
        return comment.slice(0, 2000) + '...';
      }
      return comment;
    },
    closeCommentsModal() {
      this.showCommentsModal = false;
      document.body.style.overflow = '';
    },
    async saveProfile() {
      try {
        const token = localStorage.getItem('token');
        const profileImageFile = document.getElementById('file-upload').files[0];
        let profileImageUrl = this.profileImageUrl;

        if (profileImageFile) {
          profileImageUrl = await this.uploadProfileImage(profileImageFile);
        }

        const birthdate = new Date(this.birthdate);
        if (isNaN(birthdate.getTime())) {
          alert("Bitte ein gültiges Geburtsdatum eingeben.");
          return;
        }
        if (birthdate.getDate() > 31 || birthdate.getMonth() + 1 > 12) {
          alert("Bitte ein gültiges Geburtsdatum eingeben.");
          return;
        }
        const birthYear = new Date(this.birthdate).getFullYear();
        if (birthYear < 1930) {
          alert("Das Jahr muss 1930 oder später sein.");
          return;
        }

        const formattedBirthdate = birthdate.toISOString().split('T')[0];

        const response = await axios.post('http://localhost:8002/api/updateProfile', {
          username: this.username,
          vorname: this.vorname,
          nachname: this.nachname,
          birthdate: formattedBirthdate,
          profileImageUrl: profileImageUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          localStorage.setItem('vorname', this.vorname);
          localStorage.setItem('nachname', this.nachname);
          localStorage.setItem('birthdate', formattedBirthdate);
          if (profileImageUrl) {
            localStorage.setItem('profileImageUrl', profileImageUrl);
            this.profileImageUrl = profileImageUrl;
          }
          this.isEditing = false;
          await this.fetchComments();
        } else {
          console.error(response.data.error);
        }
      } catch (error) {
        console.error('Fehler beim Speichern des Profils:', error);
      }
    },
    async openCollectionPopup(collection) {

      this.activeCollection = collection;
      this.showCollectionPopup = true;

      this.activeCollection.churches = [];

      try {
        const response = await fetch(`http://localhost:8002/api/collection/${collection.id}/churches`);
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Kirchen');
        }
        const data = await response.json();
        this.activeCollection.churches = data.churches || [];
      } catch (error) {
        console.error(error);
      }
    },
    closeCollectionPopup() {
      this.showCollectionPopup = false;
      this.activeCollection.churches = [];
    },
    async fetchComments() {
      try {
        const token = localStorage.getItem('token');
        const username = this.username;
        if (!username) {
          throw new Error('Benutzername nicht gefunden.');
        }
        const response = await fetch(`http://localhost:8002/api/user/comments?username=${encodeURIComponent(username)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Fehlerantwort vom Server:', errorMessage);
          throw new Error(`Fehler beim Abrufen der Kommentare: ${errorMessage}`);
        }
        const commentsData = await response.json();
        this.comments = commentsData;
      } catch (error) {
        console.error('Fehler beim Abrufen der Kommentare:', error);
      }
    },
    async fetchUserCollections() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Kein Token gefunden');
          return;
        }
        const response = await axios.get('http://localhost:8002/api/myCollections', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.userCollections = response.data;
      } catch (error) {
        console.error('Fehler beim Abrufen der Sammlungen:', error);
      }
    },
    async removeCollection(collectionId) {
      try {
        console.log('collectionId:', collectionId);
        if (!collectionId) {
          console.error('Ungültige collectionId:', collectionId);
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Kein Token gefunden');
          return;
        }
        await axios.delete(`http://localhost:8002/api/collections/${collectionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.userCollections = this.userCollections.filter(collection => collection.id !== collectionId);
      } catch (error) {
        console.error('Fehler beim Entfernen der Sammlung:', error);
      }
    },
    openCreateCollectionPopup() {
      this.showCreateCollectionPopup = true;
      document.body.style.overflow = 'hidden';
    },
    closeCreateCollectionPopup() {
      this.showCreateCollectionPopup = false;
      this.newCollectionName = '';
      document.body.style.overflow = '';
    },
    async createCollection() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Kein Token gefunden');
          return;
        }
        const response = await axios.post('http://localhost:8002/api/createCollection', {
          username: this.username,
          name: this.newCollectionName
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.userCollections.push(response.data);
        this.closeCreateCollectionPopup();
      } catch (error) {
        console.error('Fehler beim Erstellen der Sammlung:', error);
      }
    },
    goToProvince(provinceName) {
      if (provinceName) {
        this.$router.push(`/province-info/${provinceName}`);
        document.body.style.overflow = '';
      } else {
        console.error("Province name is undefined");
      }
    },
    async removeChurchFromCollection(churchName) {
      const collectionId = this.activeCollection.id;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`http://localhost:8002/api/collections/${collectionId}/churches/${encodeURIComponent(churchName)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Fehlerantwort vom Server:', errorMessage);
          throw new Error(`Fehler beim Löschen des Ortes: ${errorMessage}`);
        }
        this.activeCollection.churches = this.activeCollection.churches.filter(church => church.name !== churchName);

        alert(`${churchName} wurde erfolgreich aus der Sammlung gelöscht.`);
      } catch (error) {
        console.error('Fehler beim Löschen des Ortes:', error);
        alert('Fehler beim Löschen des Ortes.');
      }
    },
    goToMyPlaces() {
      this.$router.push('/my-places');
    },
    async created() {
      const username = localStorage.getItem('username');
      if (!username) {
        this.loggedInMessage = true;
        return;
      }
      await this.fetchProfileData(username);
      const storedProfileImageUrl = localStorage.getItem('profileImageUrl');
      if (storedProfileImageUrl) {
        this.profileImageUrl = storedProfileImageUrl;
      }
    },
    async goToPage(churchName) {
      if (!churchName) {
        console.error('Kirchenname fehlt');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8002/api/churchToProvince/${encodeURIComponent(churchName)}`);
        if (response.ok) {
          const data = await response.json();
          const province = data.province;
          if (province) {
            const url = `http://localhost/province-info/${encodeURIComponent(province)}`;
            window.location.href = url;
          } else {
            console.error('Keine Provinz für Kirche gefunden:', churchName);
          }
        } else {
          console.error('Fehler beim Abrufen der Provinz:', await response.text());
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Provinz:', error);
      }
    },
  },
  mounted() {
    this.fetchComments();
    this.fetchUserCollections();
  }
};
</script>

<style scoped>
.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.collection-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.collection-card:hover {
  transform: scale(1.05);
}

.collection-card h4 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: bold;
}

.collection-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.church-listo {
  display: flex;
}

.church-listo li {
  font-size: 14px;
  white-space: normal;
}

button {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-create {
  background-color: #B8869B;
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: background-color 0.3s ease
}

.btn-create:hover {
  background-color: #9B3C66;
}

.btn-remove {
  background-color: #f44336;
  margin-top: 5px;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn-remove:hover {
  background-color: #e53935;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  backdrop-filter: blur(5px);
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.input-field {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #9B3C66;
  outline: none;
}

.btn-create-collection {
  background-color: #1ABC9C;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease
}

.btn-create-collection:hover {
  background-color: #17A589;
}

.btn-cancel {
  background-color: #B8869B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  margin-left: 10px;
  transition: background-color 0.3s ease
}

.btn-cancel:hover {
  background-color: #9B3C66;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}

.close:hover {
  color: #f44336;
}

.profile-details {
  position: relative;
}

.edit-button {
  position: absolute;
  top: -25px;
  right: 0;
  padding: 10px 20px;
  background-color: #B8869B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #9B3C66;
}

.modal2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  z-index: 1000;
}

.modal2-content {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: modalFadeIn 0.3s ease-out;
  text-align: center;
}

.modal2 h3 {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
}

.modal2 .form-group {
  margin-bottom: 20px;
}

.modal2 .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #34495e;
}

.modal2 .form-group input {
  width: 90%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.modal2 .form-group input:focus {
  border-color: #1ABC9C;
  box-shadow: 0 0 5px rgba(26, 188, 156, 0.5);
  outline: none;
}

.btn-save {
  background-color: #1ABC9C;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease
}

.btn-save:hover {
  background-color: #17A589;
}

.btn-nosave {
  background-color: #B8869B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  margin-left: 10px;
  transition: background-color 0.3s ease
}

.btn-nosave:hover {
  background-color: #9B3C66;
}

.modal2 .close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}

.modal2 .close:hover {
  color: #e74c3c;
}

.popup-collect {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.popup-collect-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.church-list {
  display: flex;
  flex-direction: column;
}

.church-item {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  align-items: flex-start;
}

.church-image-container {
  max-width: 150px;
  overflow: hidden;
  margin-right: 15px;
}

.church-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.church-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.church-info h4 {
  margin: 0;
  margin-bottom: 5px;
}

.church-info p {
  margin: 0;
}

.popup-collect-content h3 {
  text-align: center;
  margin: 20px 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.popup-title {
  margin: 0;
  flex: 1;
}

.btn-close {
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: #B8869B;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  max-width: 200px;
  margin: 5px 0;
  text-align: center;
}

.btn-close:hover {
  background-color: #9B3C66;
}

.church-image-container {
  max-width: 150px;
  overflow: hidden;
}

.church-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.btn-visit {
  margin-top: 5px;
  padding: 10px;
  background-color: #1ABC9C;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn-visit:hover {
  background-color: #17A589;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  gap: 10px;
}

.btn-open,
.btn-delete {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
  margin: 5px 0;
  text-align: center;
}

.btn-open {
  background-color: #1ABC9C;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-open:hover {
  background-color: #17A589;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.empty-collection-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.empty-collection-message p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
}


.btn-add-place {
  padding: 10px 20px;
  background-color: #1ABC9C;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-add-place:hover {
  background-color: #17A589;
}

.comments-section {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.comment-date {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

h3 {
  color: #333;
}

.comments-modal-content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-open-comm {
  background-color: #B8869B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease
}

.btn-open-comm:hover {
  background-color: #9B3C66;
}

.btn-goto {
  background-color: #B8869B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease
}

.btn-goto:hover {
  background-color: #9B3C66;
}

.modal-comment {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.modal-content-comment {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.close-comment {
  font-family: 'Arial', sans-serif;
  position: absolute;
  top: 33px;
  right: 20px;
  background-color: #B8869B;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  max-width: 200px;
  margin: 5px 0;
  text-align: center;
  transition: background-color 0.3s ease
}

.close-comment:hover {
  background-color: #9B3C66;
}

.modal-comment h3 {
  font-size: 26px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}
</style>