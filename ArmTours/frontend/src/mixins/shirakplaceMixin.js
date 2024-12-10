export const shirakplaceMixin = {
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push('/');
      this.showRatingWarning = false;
    },
    async datenAbrufen() {
      try {
        const province = 'ShirakPlace';
        const response = await fetch(`http://localhost:8002/api/kirche/${province}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Kirchendaten');
        this.kirche = await response.json();
        const additionalResponse = await fetch(`http://localhost:8002/api/additional-churches/${province}`);
        if (!additionalResponse.ok) throw new Error('Fehler beim Abrufen der zusätzlichen Kirchendaten');
        this.additionalChurches = await additionalResponse.json();
        this.editedDescription = this.kirche.description || '';
        await this.fetchComments(this.kirche.name);
        const ratingsResponse = await fetch(`http://localhost:8002/api/ratings/${this.kirche.name}`);
        if (!ratingsResponse.ok) throw new Error('Fehler beim Abrufen der Bewertungen');
        this.ratings = await ratingsResponse.json();

        this.ratings = this.ratings.map(rating => ({
          ...rating,
          date: new Date(rating.created_at).toLocaleString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }),
        }));
        this.canUploadImage = this.role === 'superuser' || this.role === 'supersuperuser';
        this.canAddToCollection = true;
      } catch (error) {
        console.error('Error fetching church data:', error);
      }
    },
    fetchChurchInfo() {
      const province = 'ShirakPlace';
      fetch(`http://localhost:8002/api/kirche/${province}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const churchData = data.length > 0 ? data[0] : null;
          if (churchData) {
            this.churchId = churchData.id;
            this.kirche.image_data = churchData.image_data || '';
            this.kirche.description = churchData.description || '';
            this.kirche.name = churchData.name || '';
            this.kirche.year_built = churchData.year_built || '';
            this.kirche.address = churchData.address || '';
            this.kirche.surroundings_description = churchData.surroundings_description || '';
            this.kirche.access_info = churchData.access_info || '';
            this.kirche.guided_tours = churchData.guided_tours || '';
            this.kirche.recommended_duration = churchData.recommended_duration || '';
            this.kirche.events_and_services = churchData.events_and_services || '';
            this.kirche.accommodation_and_food = churchData.accommodation_and_food || '';
          } else {
            console.warn(`Keine Kirche für Provinz ${province} gefunden`);
          }
        })
        .catch(error => {
          console.error('Fehler beim Abrufen der Kirchendaten:', error);
        });
    },
    openAllRatingsPopup() {
      this.showAllRatingsPopup = true;
      document.body.style.overflow = 'hidden';
    },
    closeAllRatingsPopup() {
      this.showAllRatingsPopup = false;
      document.body.style.overflow = '';
    },
    openAllCommentsPopup() {
      this.showAllCommentsPopup = true;
      document.body.style.overflow = 'hidden';
    },
    closeAllCommentsPopup() {
      this.showAllCommentsPopup = false;
      document.body.style.overflow = '';
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    openRatingPopup() {
      this.showRatingPopup = true;
      document.body.style.overflow = 'hidden';
    },
    async closeRatingPopup() {
      await this.fetchRatings(this.kirche.name);
      this.showRatingPopup = false;
      document.body.style.overflow = '';
    },
    async deleteRating(ratingId) {
      if (confirm("Möchten Sie diese Bewertung wirklich löschen?")) {
        const role = localStorage.getItem('role') || ''; 
        if (role !== 'superuser' && role !== 'supersuperuser') {
          alert("Sie haben keine Berechtigung, diese Bewertung zu löschen.");
          return;
        }
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.showCommentWarning = true;
            return;
          }
          const response = await fetch(`http://localhost:8002/api/ratings/${ratingId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Fehler beim Löschen der Bewertung: ${errorMessage}`);
          }
          alert('Bewertung wurde gelöscht.');
          await this.fetchRatings(this.kirche.name); 
          this.$emit('rating-deleted', ratingId);
        } catch (error) {
          console.error('Fehler beim Löschen der Bewertung:', error);
          this.showCommentWarning = false;
        }
      }
    },
    async fetchRatings(churchName) {
      try {
        const response = await fetch(`http://localhost:8002/api/ratings/${churchName}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Bewertungen');
        const fetchedRatings = await response.json();

        this.ratings = fetchedRatings.map(rating => ({
          ...rating,
          date: new Date(rating.created_at).toLocaleString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }),
        }));
      } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
      }
    },
    async uploadImage() {
      if (!this.selectedFile) {
        alert('Bitte wählen Sie eine Datei aus.');
        return;
      }
      if (this.canUploadImage) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('name', this.imageName);
        formData.append('description', this.imageDescription);
        try {
          const response = await fetch('http://localhost:8002/api/upload/image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Fehler beim Hochladen des Bildes:', errorText);
            throw new Error('Fehler beim Hochladen des Bildes');
          }
          alert('Bild und Beschreibung erfolgreich hochgeladen');
          await this.datenAbrufen();
          this.uploadedChurchName = this.imageName;
        } catch (error) {
          console.error('Fehler beim Hochladen des Bildes:', error);
        }
      } else {
        alert('Sie haben keine Berechtigung zum Hochladen eines Bildes.');
      }
    },
    async deleteImage() {
      if (this.canDeleteImage) {
        try {
          const response = await fetch(`http://localhost:8002/api/kirche/${this.kirche.name}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Fehler beim Löschen des Bildes');
          }
          alert('Bild erfolgreich gelöscht');
          this.imageDeleted = true;
          this.datenAbrufen();
        } catch (error) {
          console.error('Fehler beim Löschen des Bildes:', error);
        }
      } else {
        alert('Sie haben keine Berechtigung zum Löschen des Bildes.');
      }
    },
    convertToStars(value) {
      let stars = '';
      const fullStars = Math.ceil(value);
      const emptyStars = 5 - fullStars;
      for (let i = 0; i < fullStars; i++) {
        stars += '★';
      }
      for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
      }
      return stars;
    },
    async fetchComments(churchName) {
      try {
        const response = await fetch(`http://localhost:8002/api/comments/${churchName}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Kommentare');
        const fetchedComments = await response.json();
        this.comments = fetchedComments;

        for (const comment of fetchedComments) {
          await this.fetchCommentRatings(comment.id);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Kommentare:', error);
      }
    },
    async fetchCommentRatings(commentId) {
      try {
        const response = await fetch(`http://localhost:8002/api/comments/${commentId}/ratings`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Bewertungen');

        const ratings = await response.json();

        const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          this.comments[commentIndex].ratings = ratings;
        } else {
          console.warn('Kommentar nicht gefunden:', commentId);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
      }
    },
    handleCommentAdded() {
      this.fetchComments(this.kirche.name);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('de-DE', options);
    },
    toggleUploadContainer() {
      this.uploadContainerOpen = !this.uploadContainerOpen;
    },
    showAddChurchPopup() {
      this.showPopup = true;
      document.body.style.overflow = 'hidden';
    },
    closeAddChurchPopup() {
      this.showPopup = false;
      this.newChurchName = '';
      this.newChurchDescription = '';
      this.newChurchFile = null;
      document.body.style.overflow = '';
    },
    handleNewChurchFileUpload(event) {
      this.newChurchFile = event.target.files[0];
    },
    async updateDescription() {
      const {
        name,
        description,
        province = 'ShirakPlace',
        year_built,
        address,
        surroundings_description,
        access_info,
        guided_tours,
        recommended_duration,
        events_and_services,
        accommodation_and_food
      } = this.kirche;

      if (!name || !province || !this.editedDescription) {
        alert('Bitte geben Sie alle erforderlichen Informationen ein.');
        return;
      }
      try {
        const response = await fetch('http://localhost:8002/api/upload/church', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            name,
            description,
            province,
            year_built,
            address,
            surroundings_description,
            access_info,
            guided_tours,
            recommended_duration,
            events_and_services,
            accommodation_and_food
          }),
        });
        if (!response.ok) {
          throw new Error('Fehler beim Aktualisieren der Kirche');
        }
        alert('Ort erfolgreich aktualisiert');
        await this.fetchChurchInfo();
        this.uploadContainerOpen = false;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kirche:', error);
      }
    },
    async addNewChurch() {
      const token = localStorage.getItem('token');
      const province = 'ShirakPlace';

      if (!this.newChurchFile || !this.newChurchName || !this.newChurchDescription) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      const formData = new FormData();
      formData.append('name', this.newChurchName);
      formData.append('description', this.newChurchDescription);
      formData.append('province', province);
      formData.append('image', this.newChurchFile);

      if (this.newChurchYearBuilt) formData.append('year_built', this.newChurchYearBuilt);
      if (this.newChurchAddress) formData.append('address', this.newChurchAddress);
      if (this.newChurchSurroundingsDescription) formData.append('surroundings_description', this.newChurchSurroundingsDescription);
      if (this.newChurchAccessInfo) formData.append('access_info', this.newChurchAccessInfo);
      if (this.newChurchGuidedTours) formData.append('guided_tours', this.newChurchGuidedTours);
      if (this.newChurchRecommendedDuration) formData.append('recommended_duration', this.newChurchRecommendedDuration);
      if (this.newChurchEventsAndServices) formData.append('events_and_services', this.newChurchEventsAndServices);
      if (this.newChurchAccommodationAndFood) formData.append('accommodation_and_food', this.newChurchAccommodationAndFood);

      try {
        const response = await fetch('http://localhost:8002/api/churches', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Fehler beim Hochladen der Kirchendaten');
        }
        alert('Ort wurde erfolgreich hinzugefügt');
        this.closeAddChurchPopup();
        const newChurchData = await response.json();
        this.additionalChurches.push(newChurchData);
        this.fetchChurchInfo();
      } catch (error) {
        console.error('Fehler beim Hochladen der Kirchendaten:', error);
      }
    },
    async deleteChurch(index, churchName) {
      if (confirm(`Möchten Sie den Ort "${churchName}" wirklich löschen?`)) {
        try {
          const response = await fetch(`http://localhost:8002/api/churches/${churchName}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Fehler beim Löschen der Kirche');
          }
          alert('Ort erfolgreich gelöscht');
          this.additionalChurches.splice(index, 1);
          await this.datenAbrufen(); 
        } catch (error) {
          console.error('Fehler beim Löschen der Kirche:', error);
        }
      }
    },
    swapChurches(index) {
      const selectedChurch = this.additionalChurches[index];
      this.additionalChurches.splice(index, 1, this.kirche);
      this.kirche = selectedChurch;
      this.editedDescription = selectedChurch.description || '';
      this.fetchRatings(selectedChurch.name);
      this.fetchComments(selectedChurch.name);
    },
    async addToCollection(churchInfo) {
      try {
        if (!churchInfo || !churchInfo.name) {
          throw new Error('Ungültige Kirchendaten.');
        }
        const response = await fetch('http://localhost:8002/api/addToCollection', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            churchName: churchInfo.name,
          }),
        });
        if (!response.ok) {
          throw new Error('Fehler beim Hinzufügen zur Sammlung');
        }
        alert(`Ort erfolgreich zur Sammlung hinzugefügt.`);
      } catch (error) {
        console.error('Fehler beim Hinzufügen zur Sammlung:', error);
      }
    },
    addToCollectionOutside(churchInfo) {
      if (!churchInfo || !churchInfo.name) {
        console.error('Ungültige Kirchendaten:', churchInfo);
        return;
      }
      this.addToCollection(churchInfo);
    },
    openAddToCollectionPopup() {
      this.showAddToCollectionPopup = true;
      document.body.style.overflow = 'hidden';
    },
    closeAddToCollectionPopup() {
      this.showAddToCollectionPopup = false;
      this.selectedCollection = null;
      document.body.style.overflow = '';
    },
    async addToSelectedCollection() {
      if (!this.selectedCollection) {
        alert('Bitte wählen Sie eine Sammlung aus.');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8002/api/addToCollection`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            churchName: this.kirche.name,
            collectionId: this.selectedCollection, 
          }),
        });
        if (!response.ok) {
          const errorData = await response.json(); 
          alert(errorData.error); 
          return; 
        }
        alert(`Ort erfolgreich zur Sammlung hinzugefügt.`);
        this.closeAddToCollectionPopup();
      } catch (error) {
        console.error('Fehler beim Hinzufügen zur Sammlung:', error);
      }
    },
    async loadCollections() {
      try {
        const response = await fetch('http://localhost:8002/api/myCollections', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Sammlungen');
        }
        this.collections = await response.json();
        this.canAddToCollection = true;
      } catch (error) {
        console.error('Fehler beim Laden der Sammlungen:', error);
      }
    },
  },
  computed: {
    displayedComments() {
      return this.comments.slice(0, 3);
    }
  },
  mounted() {
    this.datenAbrufen()
      .then(() => {
        this.fetchComments(this.kirche.name);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Komponente:', error);
      });
    this.loadCollections();
    this.fetchChurchInfo();
    this.canUploadImage = this.role === 'supersuperuser' || this.role === 'superuser';
    this.canDeleteImage = this.role === 'supersuperuser' || this.role === 'superuser';
    this.canDeleteRating = this.role === 'supersuperuser' || this.role === 'superuser';
  },
}
