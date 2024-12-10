export const replyMixin = {
  methods: {
    async addComment() {
      if (!this.localComment.trim()) {
        alert('Kommentar darf nicht leer sein.');
        return;
      }
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          this.showCommentWarning = true;
          return;
        }

        if (!token) throw new Error('Token nicht gefunden.');
        const response = await fetch('http://localhost:8002/api/addComment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: this.username,
            comment: this.localComment,
            profileImageUrl: this.profileImageUrl,
            church_name: this.kirche.name
          })
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Fehler beim Hinzufügen des Kommentars: ${errorMessage}`);
        }
        const newComment = await response.json();
        this.localComments.push(newComment);
        this.localComment = '';
        this.$emit('comment-added');
        this.showCommentWarning = false;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Kommentars:', error);
        this.showCommentWarning = false;
      }
    },
    async addReply(commentId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.showCommentWarning = true;
          return;
        }
        if (!token) throw new Error('Token nicht gefunden.');

        const reply = this.localReplies[commentId] || '';
        if (!reply.trim()) {
          alert('Antwort kann nicht leer sein.');
          return;
        }

        const existingComment = this.localComments.find(comment => comment.id === commentId);
        if (!existingComment) {
          console.error('Kommentar nicht gefunden.');
          return;
        }
        if (!existingComment.replies) {
          existingComment.replies = [];
        }
        if (existingComment.replies.some(r => r.reply === reply)) {
          alert('Antwort wurde bereits hinzugefügt.');
          return;
        }
        const response = await fetch(`http://localhost:8002/api/comments/${commentId}/replies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            reply: reply,
            profileImageUrl: this.profileImageUrl,
            username: this.username,
            original_comment_text: this.original_comment_text
          })
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Fehler beim Hinzufügen der Antwort: ${errorMessage}`);
        }
        const newReply = await response.json();
        if (!existingComment.replies.some(reply => reply.id === newReply.id)) {
          existingComment.replies.push(newReply);
        }
        this.localReplies[commentId] = '';

        await this.fetchReplies(commentId);
        this.showCommentWarning = false;

        this.$emit('add-reply', commentId, newReply);
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Antwort:', error);
        this.showCommentWarning = false;
      }
    },
    async addReplyOnReply(parentReplyId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.showCommentWarning = true;
          return;
        }
        if (!token) throw new Error('Token nicht gefunden.');

        const reply = this.localReplyOnReplies[parentReplyId] || '';
        if (!reply.trim()) {
          alert('Antwort kann nicht leer sein.');
          return;
        }
        const commentId = this.getCommentIdForReply(parentReplyId);
        if (!commentId) {
          console.error('Kommentar-ID nicht gefunden.');
          return;
        }
        const response = await fetch(`http://localhost:8002/api/replies/${parentReplyId}/replies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            reply: reply,
            comment_id: commentId,
            parent_reply_id: parentReplyId
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Fehler beim Hinzufügen der Antwort auf Antwort: ${errorText}`);
        }
        const newReplyOnReply = await response.json();

        const replyIndex = this.localComments
          .flatMap(comment => comment.replies)
          .findIndex(reply => reply.id === parentReplyId);
        if (replyIndex !== -1) {
          const parentReply = this.localComments.flatMap(comment => comment.replies)[replyIndex];
          if (parentReply) {
            if (!parentReply.replies) {
              parentReply.replies = [];
            }
            parentReply.replies.push(newReplyOnReply);
          }
        }
        this.localReplyOnReplies[parentReplyId] = '';
        this.localReplyOnReplyFormVisible[parentReplyId] = false;
        this.showCommentWarning = false;
        await this.fetchReplies(commentId);
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Antwort auf eine Antwort:', error);
        this.showCommentWarning = false;
      }
    },
    findReplyById(replyId) {
      for (const comment of this.localComments) {
        const replies = Array.isArray(comment.replies) ? comment.replies : [];
        const reply = replies.find(r => r.id === replyId);
        if (reply) {
          return reply;
        }
        for (const subReply of replies) {
          const subReplies = Array.isArray(subReply.replies) ? subReply.replies : [];
          if (subReplies.some(r => r.id === replyId)) {
            return subReply.replies.find(r => r.id === replyId);
          }
        }
      }
      return null;
    },
    getCommentIdForReply(parentReplyId) {
      for (const comment of this.localComments) {
        if (Array.isArray(comment.replies)) {
          const reply = comment.replies.find(r => r.id === parentReplyId);

          if (reply) {
            return comment.id;
          }
        } else {
          console.warn('comment.replies ist nicht definiert oder kein Array:', comment.replies);
        }
      }
      return null;
    },
    async deleteComment(commentId) {
      if (confirm("Möchten Sie diesen Kommentar wirklich löschen?")) {
        if (!this.canDeleteComment) {
          alert("Sie haben keine Berechtigung, diesen Kommentar zu löschen.");
          return;
        }
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.showCommentWarning = true; 
            return;
          }
    
          const response = await fetch(`http://localhost:8002/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Fehler beim Löschen des Kommentars: ${errorMessage}`);
          }
    
          this.localComments = this.localComments.filter(comment => comment.id !== commentId);
    
          alert('Kommentar wurde erfolgreich gelöscht.');
        } catch (error) {
          console.error('Fehler beim Löschen des Kommentars:', error);
          alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      }
    },
    async deleteReply(replyId) {
      if (confirm("Möchten Sie diese Antwort wirklich löschen?")) {
        if (!this.canDeleteComment) {
          alert("Sie haben keine Berechtigung, diesen Kommentar zu löschen.");
          return;
        }
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.showCommentWarning = true;
            return;
          }
          const response = await fetch(`http://localhost:8002/api/replies/${replyId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Fehler beim Löschen der Antwort: ${errorMessage}`);
          }

          this.localComments.forEach(comment => {
            comment.replies = comment.replies.filter(reply => reply.id !== replyId);
          });

          alert('Antwort und alle zugehörigen verschachtelten Antworten wurden gelöscht.');
          this.$emit('reply-deleted', replyId);
          await this.fetchReplies();
        } catch (error) {
          console.error('Fehler beim Löschen der Antwort:', error);
          this.showCommentWarning = false;
        }
      }
    },
    toggleReplyForm(commentId) {
      this.localReplyFormVisible[commentId] = !this.localReplyFormVisible[commentId];
    },
    toggleReplyOnReplyForm(replyId) {
      this.localReplyOnReplyFormVisible[replyId] = !this.localReplyOnReplyFormVisible[replyId];
    },
    async rateComment(commentId, rating) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          this.showRatingWarning = true;
          return;
        }
        const response = await fetch(`http://localhost:8002/api/comments/${commentId}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating })
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error(`Fehler beim Bewerten des Kommentars: ${errorMessage}`);
          throw new Error(`Fehler beim Bewerten des Kommentars: ${errorMessage}`);
        }
        const { ratings } = await response.json();
        if (!ratings) {
          console.error('Bewertungen fehlen in der Antwort.');
          return;
        }
        const commentIndex = this.localComments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          this.localComments[commentIndex].ratings = ratings;
        } else {
          console.warn(`Kommentar ${commentId} nicht gefunden.`);
        }
        this.repliesCache[commentId] = { ...this.repliesCache[commentId], userRating: rating };
        localStorage.setItem(`userRating_comment_${commentId}`, rating);
        this.showRatingWarning = false;
      } catch (error) {
        console.error('Fehler beim Bewerten des Kommentars:', error);
        this.showRatingWarning = false;
      }
    },
    async rateReply(replyId, rating) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.showRatingWarning = true; 
          return;
        }
        const response = await fetch(`http://localhost:8002/api/comments/${replyId}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating, isReply: true }) 
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Fehler beim Bewerten der Antwort: ${errorMessage}`);
        }
        const updatedReply = await response.json();
        if (!updatedReply || !updatedReply.ratings) {
          console.error('Bewertungen fehlen in der Antwort.');
          return;
        }
        const commentIndex = this.localComments.findIndex(comment =>
          comment.replies && comment.replies.some(reply => reply.id === replyId)
        );

        if (commentIndex !== -1) {
          const replyIndex = this.localComments[commentIndex].replies.findIndex(reply => reply.id === replyId);
          if (replyIndex !== -1) {
            this.localComments[commentIndex].replies[replyIndex].ratings = updatedReply.ratings;
            this.localComments[commentIndex].replies[replyIndex].userRating = rating;
          } else {
            console.warn(`Antwort ${replyId} nicht gefunden.`);
          }
        } else {
          console.warn(`Kommentar ${replyId} nicht gefunden.`);
        }
        localStorage.setItem(`userRating_reply_${replyId}`, rating);
        this.repliesCache[replyId] = { ...this.repliesCache[replyId], userRating: rating };
        this.showRatingWarning = false;
      } catch (error) {
        console.error('Fehler beim Bewerten der Antwort:', error);
        this.showRatingWarning = false;
      }
    },
    userRating(id, isReply = false) {
      const key = isReply ? `userRating_reply_${id}` : `userRating_comment_${id}`;
      const rating = parseInt(localStorage.getItem(key)) || 0;
      return rating;
    },
    initializeComments(comments) {
      return comments.map(comment => ({
        ...comment,
        ratings: comment.ratings || { thumbsUp: 0, thumbsDown: 0 },
        userRating: parseInt(localStorage.getItem(`userRating_comment_${comment.id}`)) || 0
      }));
    },
    initializeRatings() {
      this.localComments.forEach(comment => {
        const userRating = parseInt(localStorage.getItem(`userRating_comment_${comment.id}`)) || 0;
        comment.userRating = userRating;
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            const replyUserRating = parseInt(localStorage.getItem(`userRating_reply_${reply.id}`)) || 0;
            reply.userRating = replyUserRating;
          });
        }
      });
    },
    async fetchReplies(commentId) {
      try {
        const response = await fetch(`http://localhost:8002/api/comments/${commentId}/replies`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Antworten');

        const replies = await response.json();
        const comment = this.localComments.find(comment => comment.id === commentId);

        if (comment) {
          comment.replies = replies || [];

          await Promise.all(replies.map(async reply => {
            await this.fetchRatings(reply.id, true);
            const ratings = this.localComments
              .flatMap(c => c.replies || [])
              .find(r => r.id === reply.id)?.ratings || { thumbsUp: 0, thumbsDown: 0 };

            return {
              ...reply,
              ratings: ratings,
              original_comment_text: reply.original_comment_text || 'Kein Originaltext verfügbar'
            };
          }));
          await Promise.all(replies.map(async (reply) => {
            if (!this.localRepliesOnReplies[reply.id]) {
              const subResponse = await fetch(`http://localhost:8002/api/replies/${reply.id}/replies`);
              if (subResponse.ok) {
                const subReplies = await subResponse.json();
                this.localRepliesOnReplies = {
                  ...this.localRepliesOnReplies,
                  [reply.id]: subReplies
                };
              } else {
                console.error(`Fehler beim Abrufen der Unterantworten für Antwort-ID ${reply.id}`);
              }
            }
          }));
        } else {
          console.error('Kommentar nicht gefunden.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Antworten:', error);
      }
    },
    async fetchRatings(id, isReply = false) {
      try {
        const url = `http://localhost:8002/api/comments/${id}/ratings?isReply=${isReply}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Fehler beim Abrufen der Bewertungen: ${errorText}`);
          throw new Error('Fehler beim Abrufen der Bewertungen');
        }
        const ratings = await response.json();

        if (isReply) {
          for (let comment of this.localComments) {
            const replyIndex = comment.replies.findIndex(reply => reply.id === id);
            if (replyIndex !== -1) {
              comment.replies[replyIndex].ratings = ratings;
              break;
            }
          }
        } else {
          const commentIndex = this.localComments.findIndex(comment => comment.id === id);
          if (commentIndex !== -1) {
            this.localComments[commentIndex].ratings = ratings;
          } else {
            console.warn(`Kommentar nicht gefunden: ${id}`);
          }
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
      }
    },
    async toggleReplies(commentId) {
      try {
        if (!this.localRepliesOnReplies[commentId]) {
          await this.fetchReplies(commentId);
        }
        this.localRepliesVisible = {
          ...this.localRepliesVisible,
          [commentId]: !this.localRepliesVisible[commentId]
        };
      } catch (error) {
        console.error('Fehler beim Umschalten der Antworten:', error);
      }
    },
    handleImageError(event) {
      console.error('Fehler beim Laden des Bildes:', event.target.src);
    },
    formatDate(date) {
      return new Date(date).toLocaleString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
    },
    created() {
      this.localComments.forEach(comment => {
        this.fetchRatings(comment.id, false);
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            this.fetchRatings(reply.id, true);
          });
        }
      });
      this.localComments.forEach(comment => {
        this.userRatings[comment.id] = parseInt(localStorage.getItem(`userRating_${comment.id}`)) || 0;
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            this.userRatings[reply.id] = parseInt(localStorage.getItem(`userRating_${reply.id}`)) || 0;
          });
        }
      });
    }
  },
  mounted() {
    const role = localStorage.getItem('role') || '';
    console.log('Aktuelle Rolle:', role);

    this.canDeleteComment = (role === 'supersuperuser' || role === 'superuser');
    console.log('canDeleteComment:', this.canDeleteComment);
  },
};
