<template>
  <div>
    <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl" @logout="logout" />
    <div class="container">
      <h1 class="intro-text">
        Armavir beeindruckt mit einer Vielzahl an Sehenswürdigkeiten, die tief in der Geschichte und Kultur Armeniens verwurzelt sind. 
        Von antiken Stätten bis hin zu malerischen Landschaften bietet die Region eine einzigartige Vielfalt an Erlebnissen, 
        die Besucher in ihren Bann ziehen.
      </h1>
      <div class="content">
        <div class="left-box">
          <img :src="kirche.image_data" alt="Kirche" class="church-image" v-if="kirche.image_data" />
        </div>
        <div class="right-box">
          <p><strong>Name:</strong> {{ kirche.name }}</p>
          <p v-if="kirche.year_built"><strong>Baujahr:</strong> {{ kirche.year_built }}</p>
          <p v-if="kirche.description"><strong>Geschichte</strong> {{ kirche.description }}</p>
          <p v-if="kirche.address"><strong>Adresse:</strong> {{ kirche.address }}</p>
          <p v-if="kirche.surroundings_description"><strong>Beschreibung der Umgebung:</strong> {{
            kirche.surroundings_description }}</p>
          <p v-if="kirche.access_info"><strong>Zugang und Öffnungszeiten:</strong> {{ kirche.access_info }}</p>
          <p v-if="kirche.guided_tours"><strong>Eintritt und Führungen:</strong> {{ kirche.guided_tours }}</p>
          <p v-if="kirche.recommended_duration"><strong>Empfohlene Reisedauer:</strong> {{ kirche.recommended_duration }}
          </p>
          <p v-if="kirche.events_and_services"><strong>Veranstaltungen</strong> {{
            kirche.events_and_services }}</p>
          <p v-if="kirche.accommodation_and_food"><strong>Unterkünfte und Gastronomie:</strong> {{
            kirche.accommodation_and_food }}</p>
        </div>
      </div>
      <button v-if="canUploadImage" @click="toggleUploadContainer" class="toggle-upload-button">
        {{ uploadContainerOpen ? 'Upload-Container schließen' : 'Upload-Container öffnen' }}
      </button>
      <div v-if="(canUploadImage) && uploadContainerOpen" class="upload-container">
        <div class="upload-content">
          <div class="upload-box">
            <div class="file-input-container">
              <input type="file" @change="handleFileUpload" class="file-input"
                :disabled="imageUploaded || !canUploadImage" />
            </div>
            <div class="name-input-container">
              <input type="text" v-model="imageName" placeholder="Bildname" class="name-input" />
              <p class="name-input-hint">Geben Sie zuerst den Namen der Sehenswürdigkeit ein, um das Bild zu speichern.</p>
            </div>
            <div class="square-button-container">
              <button @click="uploadImage" class="square-button upload-button" :disabled="!imageName">Bild
                hochladen</button>
            </div>
            <button @click="deleteChurch('selected', kirche.name)" class="delete-button">Sehenswürdigkeit endgültig löschen</button>
            <div class="description-edit">
              <textarea v-model="kirche.description" class="description-input" placeholder="Beschreibung"></textarea>
              <input v-model="kirche.year_built" placeholder="Baujahr" class="input-field" />
              <input v-model="kirche.address" placeholder="Adresse" class="input-field" />
              <textarea v-model="kirche.surroundings_description" placeholder="Beschreibung der Umgebung"
                class="input-field"></textarea>
              <textarea v-model="kirche.access_info" placeholder="Zugang und Öffnungszeiten"
                class="input-field"></textarea>
              <textarea v-model="kirche.guided_tours" placeholder="Eintritt und Führungen" class="input-field"></textarea>
              <input v-model="kirche.recommended_duration" placeholder="Empfohlene Reisedauer" class="input-field" />
              <textarea v-model="kirche.events_and_services" placeholder="Veranstaltungen"
                class="input-field"></textarea>
              <textarea v-model="kirche.accommodation_and_food" placeholder="Unterkünfte und Gastronomie"
                class="input-field"></textarea>
              <button @click="updateDescription" class="save-button">Speichern</button>
            </div>
          </div>
        </div>
      </div>
      <button @click="openAddToCollectionPopup" class="square-button">
        Zur Sammlung hinzufügen
      </button>
      <div v-if="showAddToCollectionPopup" class="popup-collections">
        <div class="popup-collections-content">
          <h2>Zur Sammlung hinzufügen</h2>
          <p>Wählen Sie eine Sammlung aus:</p>
          <select v-model="selectedCollection" class="popup-collections-input">
            <option v-for="collection in collections" :key="collection.id" :value="collection.id">
              {{ collection.collection_name }}
            </option>
          </select>
          <div class="popup-collections-buttons">
            <button @click="addToSelectedCollection" class="popup-collections-button">Hinzufügen</button>
            <button @click="closeAddToCollectionPopup" class="popup-collections-button">Abbrechen</button>
          </div>
        </div>
      </div>
      <div class="additional-churches">
        <div v-for="(church, index) in additionalChurches" :key="index" class="church-container"
          @click="swapChurches(index)">
          <img :src="church.image_data" alt="Kirche" class="church-image" v-if="church.image_data" />
          <p class="church-name">{{ church.name }}</p>
        </div>
        <div v-if="canUploadImage" class="church-container add-new" @click="showAddChurchPopup">
          <span class="plus-icon">+</span>
        </div>
      </div>
      <div v-if="showPopup" class="popup-addchurch">
        <div class="popup-content-addchurch">
          <h2>Neue Sehenswürdigkeit hinzufügen</h2>
          <input type="text" v-model="newChurchName" placeholder="Name" class="popup-input-addchurch" />
          <textarea v-model="newChurchDescription" placeholder="Beschreibung" class="popup-input-addchurch"></textarea>
          <input type="file" @change="handleNewChurchFileUpload" class="popup-input-addchurch" />
          <input type="text" v-model="newChurchYearBuilt" placeholder="Baujahr" class="popup-input-addchurch" />
          <input type="text" v-model="newChurchAddress" placeholder="Adresse" class="popup-input-addchurch" />
          <textarea v-model="newChurchSurroundingsDescription" placeholder="Beschreibung der Umgebung"
            class="popup-input-addchurch"></textarea>
          <textarea v-model="newChurchAccessInfo" placeholder="Zugang und Öffnungszeiten"
            class="popup-input-addchurch"></textarea>
          <input type="text" v-model="newChurchGuidedTours" placeholder="Eintritt und Führungen"
            class="popup-input-addchurch" />
          <input type="text" v-model="newChurchRecommendedDuration" placeholder="Empfohlene Dauer"
            class="popup-input-addchurch" />
          <textarea v-model="newChurchEventsAndServices" placeholder="Veranstaltungen"
            class="popup-input-addchurch"></textarea>
          <textarea v-model="newChurchAccommodationAndFood" placeholder="Unterkünfte und Gastronomie"
            class="popup-input-addchurch"></textarea>
          <div class="popup-buttons-addchurch">
            <button @click="addNewChurch" class="popup-button-addchurch">Hinzufügen</button>
            <button @click="closeAddChurchPopup" class="popup-button-addchurch">Abbrechen</button>
          </div>
        </div>
      </div>
      <div class="rating-container">
        <div class="content">
          <div class="left-box-rating">
            <h2>Bewertungen</h2>
            <button @click="openRatingPopup" class="rating-submit-button">Bewertung abgeben</button>
            <div v-if="ratings.length > 0">
              <div v-for="(rating, index) in ratings.slice(0, 3)" :key="index" class="rating">
                <div class="rating-header">
                  <p><strong>{{ rating.username }}</strong> - {{ rating.date }}</p>
                  <button v-if="canDeleteRating" @click="deleteRating(rating.id)" class="delete-rating-button">
                    Bewertung löschen
                  </button>
                </div>
                <div class="rating-point-group">
                  <div class="rating-point"> Architektur und Design: {{ convertToStars(rating.architecture_design) }}
                  </div>
                  <div class="rating-point">Zustand und Erhaltung: {{ convertToStars(rating.condition_preservation) }}
                  </div>
                  <div class="rating-point">Atmosphäre und Spiritualität: {{
                    convertToStars(rating.atmosphere_spirituality) }}</div>
                  <div class="rating-point">Zugänglichkeit: {{ convertToStars(rating.accessibility) }}</div>
                  <div class="rating-point">Besucherkomfort: {{ convertToStars(rating.visitor_comfort) }}</div>
                  <div class="rating-point">Kosten-Nutzen-Verhältnis: {{ convertToStars(rating.cost_value) }}</div>
                  <div class="rating-point">Persönliche Erfahrung: {{ rating.personal_experience }} </div>
                </div>
              </div>
              <button v-if="ratings.length > 3" @click="openAllRatingsPopup" class="show-all-ratings-button">Alle
                Bewertungen anzeigen</button>
            </div>
            <div v-else class="no-ratings">
              <p>Es liegen keine Bewertungen vor.</p>
            </div>
          </div>
          <div class="right-box-comments">
            <CommentTeil :comments="comments" :profileImageUrl="profileImageUrl" :username="username"
              :displayedComments="displayedComments" :repliesVisible="repliesVisible" :replyFormVisible="replyFormVisible"
              :replies="replies" :replyReplies="replyReplies" :replyOnReplies="replyOnReplies"
              :replyOnReplyFormVisible="replyOnReplyFormVisible" :repliesOnReplies="repliesOnReplies"
              @openAllCommentsPopup="openAllCommentsPopup" @comment-added="handleCommentAdded" :kirche="kirche" />
          </div>
          <div v-if="showAllCommentsPopup" class="popup-overlay"></div>
          <AllCommentsPopup v-if="showAllCommentsPopup" :comments="comments" @close="closeAllCommentsPopup"
            :profileImageUrl="profileImageUrl" :username="username" :displayedComments="displayedComments"
            :repliesVisible="repliesVisible" :replyFormVisible="replyFormVisible" :replies="replies"
            :replyReplies="replyReplies" :replyOnReplies="replyOnReplies"
            :replyOnReplyFormVisible="replyOnReplyFormVisible" :repliesOnReplies="repliesOnReplies" :kirche="kirche" />
        </div>
      </div>
      <div v-if="showAllRatingsPopup" class="all-ratings-popup">
        <div class="popup-content">
          <h2>Alle Bewertungen</h2>
          <div v-if="ratings.length > 0">
            <div v-for="(rating, index) in ratings" :key="index" class="rating">
              <div class="rating-user">{{ rating.username }}</div>
              <div class="rating-header">
                <p>{{ rating.date }}</p> 
              </div>
              <div class="rating-point-group">
                <div class="rating-point">Architektur und Design: {{ convertToStars(rating.architecture_design) }}</div>
                <div class="rating-point">Zustand und Erhaltung: {{ convertToStars(rating.condition_preservation) }}</div>
                <div class="rating-point">Atmosphäre und Spiritualität: {{ convertToStars(rating.atmosphere_spirituality)
                }}</div>
                <div class="rating-point">Zugänglichkeit: {{ convertToStars(rating.accessibility) }}</div>
                <div class="rating-point">Besucherkomfort: {{ convertToStars(rating.visitor_comfort) }}</div>
                <div class="rating-point">Kosten-Nutzen-Verhältnis: {{ convertToStars(rating.cost_value) }}</div>
                <div class="rating-point">Persönliche Erfahrung: {{ rating.personal_experience }} </div>
              </div>
            </div>
          </div>
          <div v-else class="no-ratings">
            <p>Es liegen keine Bewertungen vor.</p>
          </div>
          <button @click="closeAllRatingsPopup" class="close-button">Schließen</button>
        </div>
      </div>
      <rating-popup :show-popup="showRatingPopup" :kirche="kirche" @close="closeRatingPopup" />
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue';
import RatingPopup from '@/components/RatingPopup.vue';
import CommentTeil from './CommentTeil.vue';
import AllCommentsPopup from './AllCommentsPopup.vue';
import { armavirplaceMixin } from '../mixins/armavirplaceMixin';

export default {
  name: 'ArmavirPlace',
  mixins: [armavirplaceMixin],
  components: {
    MenuBar,
    RatingPopup,
    CommentTeil,
    AllCommentsPopup,
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      kirche: {
        name: '',
        image_data: '',
        description: '',
        province: '',
        construction_year: '',
        year_built: '',
        address: '',
        surroundings_description: '',
        access_info: '',
        guided_tours: '',
        events_and_services: '',
        accommodation_and_food: '',
        environment_description: '',
        access_hours: '',
        entrance_fees: '',
        recommended_duration: '',
        events: '',
        accommodation: ''
      },
      additionalChurches: [],
      selectedFile: null,
      imageName: '',
      imageDescription: '',
      imageUploaded: false,
      canUploadImage: false,
      editing: false,
      editedDescription: '',
      uploadContainerOpen: false,
      uploadedChurchName: '',
      showPopup: false,
      newChurchName: '',
      newChurchDescription: '',
      newChurchFile: null,
      newChurchYearBuilt: '',
      newChurchHistoricalSignificance: '',
      newChurchAddress: '',
      newChurchCoordinates: '',
      newChurchSurroundingsDescription: '',
      newChurchAccessInfo: '',
      newChurchOpeningHours: '',
      newChurchEntranceFee: '',
      newChurchGuidedTours: '',
      newChurchRecommendedDuration: '',
      newChurchEventsAndServices: '',
      newChurchAccommodationAndFood: '',
      selectedChurch: null,
      ratings: [],
      newRating: {
        username: '',
        architectureDesign: 1,
        architectureDesignComment: '',
        conditionPreservation: 1,
        conditionPreservationComment: '',
        atmosphereSpirituality: 1,
        atmosphereSpiritualityComment: '',
        accessibility: 1,
        accessibilityComment: '',
        visitorComfort: 1,
        visitorComfortComment: '',
        costValue: 1,
        costValueComment: '',
        personalExperience: '',
        date: '',
      },
      showRatingPopup: false,
      showAllRatingsPopup: false,
      showAllCommentsPopup: false,
      collections: [],
      canAddToCollection: false,
      selectedCollection: null,
      showAddToCollectionPopup: false,
      comment: '',
      comments: [],
      repliesVisible: {},
      replyFormVisible: {},
      replies: {},
      replyReplies: {},
      replyRepliesVisible: {},
      repliesOnReplies: {},
      replyOnReplies: {},
      replyOnReplyFormVisible: {},
      canDeleteRating: false,
    };
  },
}
</script>

<style scoped> 

.upload-content {
   display: flex;
   flex-direction: column;
 }

 .file-input-container {
   margin-bottom: 15px;
 }

 .file-input {
   width: 100%;
   padding: 10px;
   box-sizing: border-box;
 }

 .name-input-container {
   margin-bottom: 15px;
 }

 .name-input {
   width: calc(100% - 20px);
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 4px;
   box-sizing: border-box;
 }

 .name-input-hint {
   font-size: 12px;
   color: #888;
 }

 .square-button-container {
   margin-bottom: 15px;
 }

 .upload-button {
   width: 100%;
   padding: 10px;
   background-color: #B8869B;
   color: white;
   border: none;
   border-radius: 4px;
   transition: background-color 0.3s ease, transform 0.3s ease;
   cursor: pointer;
 }

 .upload-button:hover {
   background-color: #9B3C66;
 }

 .delete-button {
   width: 100%;
   padding: 10px;
   background-color: #f44336;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   margin-bottom: 15px;
 }

 .description-edit {
   display: flex;
   flex-direction: column;
 }

 .input-field,
 .description-input {
   width: 100%;
   padding: 10px;
   margin-bottom: 15px;
   border: 1px solid #ddd;
   border-radius: 4px;
   box-sizing: border-box;
   resize: vertical;
   box-sizing: border-box;
 }

 .save-button {
   width: 100%;
   padding: 10px;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
 }

 .popup-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(5px);
   z-index: 999;
   pointer-events: auto;
 }

 body.popup-open {
   overflow: hidden;
   position: fixed;
 }

 .all-comments-popup {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 80%;
   max-height: 80%;
   overflow-y: auto;
   background-color: white;
   border: 1px solid #ccc;
   padding: 20px;
   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
   z-index: 1000;
   border-radius: 8px;
 }

 .all-ratings-popup {
   background-color: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(5px);
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
 }

 .popup-content h2 {
   margin-bottom: 20px;
   font-size: 1.5em;
   color: #333;
 }

 .rating-container {
   margin-top: 40px;
 }

 .rating {
   padding: 15px;
   margin-bottom: 20px;
   background-color: #f9f9f9;
   border: 1px solid #ddd;
   border-radius: 8px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
 }

 .delete-rating-button {
   padding: 10px 20px;
   background-color: #f44336;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-left: auto;
   transition: background-color 0.3s;
 }

 .delete-rating-button:hover {
   background-color: #e53935;
 }

 .rating-point-group {
   display: flex;
   flex-direction: column;
   gap: 5px;
 }

 .rating-header {
   margin-bottom: 10px;
   font-weight: bold;
   color: #333;
   display: flex;
   justify-content: space-between;
   align-items: center;
 }

 .rating-point {
   display: flex;
   justify-content: space-between;
 }

 .rating-comment {
   margin-top: 10px;
   color: #666;
   padding: 10px;
   border-radius: 4px;
   background-color: #eef2f3;
 }

 .rating-comment p {
   margin: 0;
 }

 .no-ratings {
   margin-top: 20px;
   text-align: center;
   color: #777;
 }

 .show-all-ratings-button,
 .close-button {
   display: block;
   margin-top: 10px;
   padding: 10px 20px;
   cursor: pointer;
   background-color: #B8869B;
   color: #fff;
   border: none;
   border-radius: 5px;
   transition: background-color 0.3s;
 }

 .show-all-ratings-button:hover,
 .close-button:hover {
   background-color: #9B3C66;
 }

 .close-button {
   display: block;
   margin: 20px auto 0;
   padding: 10px 20px;
   cursor: pointer;
   background-color: #B8869B;
   color: #fff;
   border: none;
   border-radius: 5px;
   transition: background-color 0.3s;
 }

 .close-button:hover {
   background-color: #9B3C66;
 }

 .rating-point-group {
   display: flex;
   flex-direction: column;
   gap: 5px;
 }

 .rating-user {
   font-weight: bold;
   margin-bottom: 10px;
 }

 .rating-points {
   margin-bottom: 10px;
 }

 .rating-comment {
   font-style: italic;
 }

 .stars {
   color: gold;
 }

 .profile-image {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   margin-right: 10px;
 }

 .user-info {
   display: flex;
   align-items: center;
   gap: 10px;
 }

 .left-box-rating,
 .right-box-comments {
   flex: 1;
   margin: 10px;
   padding: 10px;
 }

 .left-box-rating {
   border-right: 1px solid #ddd;
 }

 .rating-container,
 .comment-form,
 .comments {
   display: flex;
   flex-direction: column;
 }

 .rating-container h2,
 .comment-form h2 {
   margin-bottom: 20px;
 }

 .rating-container .rating,
 .comment-form .comment {
   margin-bottom: 10px;
 }

 .rating-container .rating-point-group,
 .comment-form .comments {
   flex: 1;
   overflow-y: auto;
 }

 .popup-content {
   background: #fff;
   padding: 20px;
   border-radius: 8px;
   width: 80%;
   max-height: 80%;
   overflow-y: auto;
   position: relative;
 }

 .close-button {
   position: absolute;
   top: 10px;
   right: 10px;
   background-color: #B8869B;
   color: #fff;
   border: none;
   padding: 10px;
   border-radius: 4px;
   cursor: pointer;
 }

 .show-all-ratings-button {
   display: block;
   margin: 20px auto;
   padding: 10px 20px;
   cursor: pointer;
   background-color: #B8869B;
   color: #fff;
   border: none;
   border-radius: 5px;
   transition: background-color 0.3s;

 }

 .show-all-ratings-button:hover {
   background-color: #9B3C66;
 }

 .rating-comments-container {
   display: flex;
   flex: 1;
   overflow: hidden;
 }

 .left-box-rating,
 .right-box-comments {
   flex: 1;
   display: flex;
   flex-direction: column;
   gap: 1rem;
   padding: 10px;
   margin-top: -30px;
 }

 .right-box-comments {
   position: relative;
 }

 .comment {
   border-bottom: 1px solid #ddd;
   padding: 10px 0;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   width: 100%;
   box-sizing: border-box;
   margin-bottom: 20px;
   padding: 10px;
   border: 2px solid #007bff;
   border-radius: 4px;
   background-color: #f9f9f9;
 }

 .comment-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 10px;
 }

 .user-info {
   display: flex;
   align-items: center;
   gap: 10px;
 }

 .profile-image {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   margin-right: 10px;
 }

 .comment-date {
   font-size: 0.9em;
   color: #999;
   margin-left: auto;
 }

 .popup-collections {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(5px);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
 }

 .popup-collections-content {
   background-color: #fff;
   padding: 20px;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   width: 90%;
   max-width: 500px;
   text-align: center;
 }

 .popup-collections-content h2 {
   margin: 0 0 15px;
   font-size: 1.5em;
   color: #333;
 }

 .popup-collections-content p {
   margin: 0 0 10px;
   font-size: 1em;
   color: #555;
 }

 .popup-collections-input {
   width: 100%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   margin-bottom: 20px;
 }

 .popup-collections-buttons {
   display: flex;
   justify-content: center;
   gap: 10px;
 }

 .popup-collections-button {
   padding: 10px 20px;
   border: none;
   border-radius: 5px;
   color: #fff;
   cursor: pointer;
   transition: background-color 0.3s, transform 0.3s;
 }

 .popup-collections-button:first-child {
   background-color: #1ABC9C;
 }

 .popup-collections-button:first-child:hover {
   background-color: #17A589;
 }

 .popup-collections-button:last-child {
   background-color: #B8869B;
 }

 .popup-collections-button:last-child:hover {
   background-color: #9B3C66;
 }

 .popup-addchurch {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.4);
   z-index: 1000;
   overflow: auto;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(5px);
   pointer-events: auto;
 }

 .popup-content-addchurch {
   background-color: #ffffff;
   padding: 20px;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   width: 90%;
   max-width: 500px;
   position: relative;
   overflow: hidden;
   overflow: hidden;
 }

 .popup-content-addchurch h2 {
   margin: 0 0 15px;
   font-size: 20px;
   color: #333;
 }

 .popup-input-addchurch {
   width: 100%;
   margin-bottom: 10px;
   padding: 8px;
   border-radius: 4px;
   border: 1px solid #ddd;
   font-size: 14px;
   box-sizing: border-box;
 }

 .popup-buttons-addchurch {
   display: flex;
   justify-content: center;
   gap: 10px;
 }

 .popup-button-addchurch {
   padding: 10px 20px;
   border: none;
   border-radius: 5px;
   color: #fff;
   cursor: pointer;
   transition: background-color 0.3s, transform 0.3s;
 }

 .popup-button-addchurch:first-child {
   background-color: #1ABC9C;
 }

 .popup-button-addchurch:last-child {
   background-color: #B8869B;
 }

 .popup-button-addchurch:first-child:hover {
   background-color: #17A589;
 }

 .popup-button-addchurch:last-child:hover {
   background-color: #9B3C66;
 }
 
 </style>