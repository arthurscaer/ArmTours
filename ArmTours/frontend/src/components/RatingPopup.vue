<template>
  <div v-if="showPopup" class="popup">
      <div class="popup-content">
      <div class="popup-header">
        <h2 class="header-title">Bewertung abgeben</h2>
        <button @click="closeRatingPopup" class="btn-cancel">Abbrechen</button>
      </div>
      <input type="text" v-model="newRating.username" placeholder="Dein Username" class="popup-input" />
      <div v-if="currentStep === 1">
        <div class="question-section" v-for="question in questionsStep1" :key="question.key">
          <label>{{ question.label }}</label>
          <select v-model="newRating[question.key]" class="popup-input">
            <option value="1">1 Stern</option>
            <option value="2">2 Sterne</option>
            <option value="3">3 Sterne</option>
            <option value="4">4 Sterne</option>
            <option value="5">5 Sterne</option>
          </select>
        </div>
      </div>
      <div v-if="currentStep === 2">
        <div class="question-section" v-for="question in questionsStep2" :key="question.key">
          <label>{{ question.label }}</label>
          <select v-model="newRating[question.key]" class="popup-input">
            <option value="1">1 Stern</option>
            <option value="2">2 Sterne</option>
            <option value="3">3 Sterne</option>
            <option value="4">4 Sterne</option>
            <option value="5">5 Sterne</option>
          </select>
        </div>
      </div>
      <div v-if="currentStep === 3">
        <div class="question-section">
          <label>Persönliche Erfahrung: Wie hat der Besuch dieser Kirche/dieser Sehenswürdigkeit deine Erwartungen erfüllt oder übertroffen?</label>
          <textarea v-model="newRating.personalExperience" placeholder="Dein Kommentar" class="popup-input"></textarea>
        </div>
      </div>
      <div class="navigation-buttons">
        <button v-if="currentStep > 1" @click="previousStep" class="btn-back">Zurück</button>
          <button v-if="currentStep < 3" @click="nextStep" class="btn-forward">Weiter</button>
          <button v-if="currentStep === 3" @click="submitRating" class="btn-submit">Bewertung absenden</button>
      </div>
    </div>
  </div>
</template>




<script>
export default {
  props: {
    showPopup: Boolean,
    kirche: Object,
  },
  data() {
    return {
      currentStep: 1,
      newRating: {
        username: '',
        architectureDesign: 1,
        conditionPreservation: 1,
        atmosphereSpirituality: 1,
        accessibility: 1,
        visitorComfort: 1,
        costValue: 1,
        personalExperience: '',
      },
      questionsStep1: [
        {
          label: 'Architektur und Design: Wie beeindruckend findest du die Architektur und das Design der Kirche/Sehenswürdigkeit?',
          key: 'architectureDesign',
          commentKey: 'architectureDesignComment',
        },
        {
          label: 'Zustand und Erhaltung: Wie gut ist die Kirche/die Sehenswürdigkeit gepflegt und erhalten?',
          key: 'conditionPreservation',
          commentKey: 'conditionPreservationComment',
        },
        {
          label: 'Atmosphäre und Spiritualität: Wie würdest du die Atmosphäre und spirituelle Ausstrahlung der Kirche/bestimmten Sehenswürdigkeit bewerten?',
          key: 'atmosphereSpirituality',
          commentKey: 'atmosphereSpiritualityComment',
        },
      ],
      questionsStep2: [
        {
          label: 'Zugänglichkeit: Wie einfach war es, die Kirche/die Sehenswürdigkeit zu erreichen? Gibt es Hinweise oder Beschilderungen?',
          key: 'accessibility',
          commentKey: 'accessibilityComment',
        },
        {
          label: 'Besucherkomfort: Gab es ausreichende Einrichtungen für Besucher wie Toiletten, Ruhebereiche usw.?',
          key: 'visitorComfort',
          commentKey: 'visitorComfortComment',
        },
        {
          label: 'Kosten-Nutzen-Verhältnis: War der Eintrittspreis angemessen im Vergleich zum Erlebniswert der Kirche/Sehenswürdigkeit?',
          key: 'costValue',
          commentKey: 'costValueComment',
        },
      ],
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    async submitRating() {
      if (!this.newRating.username) {
        alert('Bitte geben Sie Ihren Namen ein.');
        return;
      }

      if (
        this.newRating.architectureDesign === null ||
        this.newRating.conditionPreservation === null ||
        this.newRating.atmosphereSpirituality === null ||
        this.newRating.accessibility === null ||
        this.newRating.visitorComfort === null ||
        this.newRating.costValue === null
      ) {
        alert('Bitte füllen Sie alle Bewertungsfelder aus.');
        return;
      }
      if (!this.kirche.name) {
        alert('Bitte wählen Sie eine Kirche aus.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8002/api/rateChurch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            church_name: this.kirche.name,
            username: this.newRating.username,
            architecture_design: this.newRating.architectureDesign,
            architecture_design_comment: this.newRating.architectureDesignComment,
            condition_preservation: this.newRating.conditionPreservation,
            condition_preservation_comment: this.newRating.conditionPreservationComment,
            atmosphere_spirituality: this.newRating.atmosphereSpirituality,
            atmosphere_spirituality_comment: this.newRating.atmosphereSpiritualityComment,
            accessibility: this.newRating.accessibility,
            accessibility_comment: this.newRating.accessibilityComment,
            visitor_comfort: this.newRating.visitorComfort,
            visitor_comfort_comment: this.newRating.visitorComfortComment,
            cost_value: this.newRating.costValue,
            cost_value_comment: this.newRating.costValueComment,
            personal_experience: this.newRating.personalExperience,
          }),
        });

        if (!response.ok) {
          throw new Error('Fehler beim Absenden der Bewertung');
        }

        alert('Bewertung erfolgreich abgegeben');
        await this.fetchRatings(this.kirche.name);

        this.newRating = {
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
        };

        this.closeRatingPopup();
      } catch (error) {
        console.error('Fehler beim Absenden der Bewertung:', error);
      }
    },
    async fetchRatings(churchName) {
      try {
        const response = await fetch(`http://localhost:8002/api/ratings/${churchName}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Bewertungen');
        const ratings = await response.json();
        console.log('Empfangene Bewertungen:', ratings);
        return ratings;
      } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
        throw error;
      }
    },
    closeRatingPopup() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
}
.popup-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-back {
  
  background-color: #B8869B;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #9B3C66;
}

.popup-header {
  display: flex;
  justify-content: flex-end;
  align-items: center; 
}

.btn-cancel {
  background-color: #B8869B;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #9B3C66;
}

.btn-forward {
  background-color: #B8869B;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-forward:hover {
  background-color: #9B3C66;
}

.btn-submit {
  background-color: #B8869B;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #9B3C66;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.question-section {
  margin-bottom: 20px;
}

.header-title {
  font-size: 1.5em;
  margin: 0;
  text-align: center;
  width: 65%;
}
</style>
