<template>
  <body>
    <div class="all-comments-popup">
      <h2>Alle Kommentare</h2>
      <button class="close-button" @click="$emit('close')">Schließen</button>
      <div class="comments-container">
        <div v-for="comment in localComments" :key="comment.id" class="comment">
          <div class="comment-header">
            <div class="user-info">
              <img :src="comment.profileImageUrl || defaultProfileImage" alt="Profilbild" class="profile-image"
                @error="handleImageError">
              <span>{{ comment.username }}</span>
            </div>
            <div class="comment-date">{{ formatDate(comment.created_at) }}</div>
            <div class="rating">
              <div class="tooltip">
                <button @click="rateComment(comment.id, 1)" :class="{ 'active': userRating(comment.id) === 1 }">
                  <svg v-if="userRating(comment.id) === 1" width="24px" height="24px" viewBox="0 0 64 64">
                    <g>
                      <circle fill="#231F20" cx="7" cy="57" r="1" />
                      <g>
                        <path fill="#231F20" d="M14,26c0-2.212-1.789-4-4-4H4c-2.211,0-4,1.788-4,4v34c0,2.21,1.789,4,4,4h6c2.211,0,4-1.79,4-4V26z M7,60
              c-1.657,0-3-1.344-3-3c0-1.658,1.343-3,3-3s3,1.342,3,3C10,58.656,8.657,60,7,60z" />
                        <path fill="#231F20" d="M64,28c0-3.314-2.687-6-6-6H41l0,0h-0.016H41l2-18c0.209-2.188-1.287-4-3.498-4h-4.001
              C33,0,31.959,1.75,31,4l-8,18c-2.155,5.169-5,6-7,6v30.218c1.203,0.285,2.714,0.945,4.21,2.479C23.324,63.894,27.043,64,29,64h23
              c3.313,0,6-2.688,6-6c0-1.731-0.737-3.288-1.91-4.383C58.371,52.769,60,50.577,60,48c0-1.731-0.737-3.288-1.91-4.383
              C60.371,42.769,62,40.577,62,38c0-1.731-0.737-3.288-1.91-4.383C62.371,32.769,64,30.577,64,28z" />
                      </g>
                    </g>
                  </svg>
                  <svg v-else width="24px" height="24px" viewBox="0 0 64 64">
                    <path fill="#231F20" d="M64,28c0-3.314-2.687-6-6-6H41l0,0h-0.016H41l2-18c0.209-2.188-1.287-4-3.498-4h-4.001
          C33,0,31.959,1.75,31,4l-8,18c-2.155,5.169-5,6-7,6c-1,0-2,0-2,0v-2c0-2.212-1.789-4-4-4H4c-2.211,0-4,1.788-4,4v34
          c0,2.21,1.789,4,4,4h6c2.211,0,4-1.79,4-4v-2c1,0,3.632,0.052,6.21,2.697C23.324,63.894,27.043,64,29,64h23c3.313,0,6-2.688,6-6
          c0-1.731-0.737-3.288-1.91-4.383C58.371,52.769,60,50.577,60,48c0-1.731-0.737-3.288-1.91-4.383C60.371,42.769,62,40.577,62,38
          c0-1.731-0.737-3.288-1.91-4.383C62.371,32.769,64,30.577,64,28z M12,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V26
          c0-1.105,0.896-2,2-2h6c1.104,0,2,0.895,2,2V60z M58,32H48c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4
          c0,2.209-1.791,4-4,4H46c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4c0,2.209-1.791,4-4,4H44
          c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4c0,2.209-1.791,4-4,4H29c-1,0-4.695,0.034-7.358-2.699
          C18.532,56.109,16.112,56.003,14,56V30h2c4,0,6.57-1.571,9.25-8L33,4c0.521-1.104,1.146-2,2.251-2H39c1.104,0,2.126,0.834,2,2
          l-1.99,18c-0.132,1.673,0.914,2,1.99,2h17c2.209,0,4,1.79,4,4C62,30.209,60.209,32,58,32z" />
                  </svg>
                  {{ (comment.ratings && comment.ratings.thumbsUp) || 0 }}
                </button>
                <span class="tooltiptext" v-if="showRatingWarning">Um eine Bewertung abzugeben, müssen Sie sich
                  registrieren.</span>
              </div>
              <div class="tooltip">
                <button @click="rateComment(comment.id, -1)" :class="{ 'active': userRating(comment.id) === -1 }">
                  <svg v-if="userRating(comment.id) === -1" width="24px" height="24px" viewBox="0 0 64 64">
                    <g>
                      <circle fill="#231F20" cx="7" cy="35" r="1" />
                      <g>
                        <path fill="#231F20" d="M0,4c0-2.211,1.789-4,4-4h6c2.211,0,4,1.789,4,4v34c0,2.211-1.789,4-4,4H4c-2.211,0-4-1.789-4-4V4z M7,38
			c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S5.343,38,7,38z" />
                        <path fill="#231F20" d="M64,36c0,3.313-2.687,6-6,6H41l0,0h-0.016H41l2,18c0.209,2.187-1.287,4-3.498,4h-4.001
			C33,64,31.959,62.25,31,60l-8-18c-2.155-5.17-5-6-7-6V5.781c1.203-0.285,2.714-0.945,4.21-2.479C23.324,0.105,27.043,0,29,0h23
			c3.313,0,6,2.687,6,6c0,1.73-0.737,3.287-1.91,4.382C58.371,11.23,60,13.422,60,16c0,1.73-0.737,3.287-1.91,4.382
			C60.371,21.23,62,23.422,62,26c0,1.73-0.737,3.287-1.91,4.382C62.371,31.23,64,33.422,64,36z" />
                      </g>
                    </g>
                  </svg>
                  <svg v-else width="24px" height="24px" viewBox="0 0 64 64">
                    <path fill="#231F20" d="M64,36c0,3.312-2.687,6-6,6H41v-0.002L40.984,42H41l2,18c0.209,2.186-1.287,4-3.498,4h-4.001
		C33,64,31.959,62.248,31,60l-8-18c-2.155-5.171-5-6-7-6c-1,0-2,0-2,0v2c0,2.21-1.789,4-4,4H4c-2.211,0-4-1.79-4-4V4
		c0-2.212,1.789-4,4-4h6c2.211,0,4,1.788,4,4v2c1,0,3.632-0.054,6.21-2.699C23.324,0.104,27.043,0,29,0h23c3.313,0,6,2.686,6,6
		c0,1.729-0.737,3.286-1.91,4.381C58.371,11.229,60,13.421,60,16c0,1.729-0.737,3.286-1.91,4.381C60.371,21.229,62,23.421,62,26
		c0,1.729-0.737,3.286-1.91,4.381C62.371,31.229,64,33.421,64,36z M12,4c0-1.105-0.896-2-2-2H4C2.896,2,2,2.895,2,4v34
		c0,1.104,0.896,2,2,2h6c1.104,0,2-0.896,2-2V4z M58,32H48c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4
		c0-2.21-1.791-4-4-4H46c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4c0-2.21-1.791-4-4-4H44
		c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4c0-2.21-1.791-4-4-4H29c-1,0-4.695-0.036-7.358,2.697
		C18.532,7.889,16.112,7.995,14,8v26h2c4,0,6.57,1.569,9.25,8L33,60c0.521,1.103,1.146,2,2.251,2H39c1.104,0,2.126-0.834,2-2
		l-1.99-18c-0.132-1.675,0.914-2,1.99-2h17c2.209,0,4-1.791,4-4C62,33.79,60.209,32,58,32z" />
                  </svg>
                  {{ (comment.ratings && comment.ratings.thumbsDown) || 0 }}
                </button>
                <span class="tooltiptext" v-if="showRatingWarning">Um eine Bewertung abzugeben, müssen Sie sich
                  registrieren.</span>
              </div>
            </div>
          </div>
          <div class="comment-text">{{ comment.comment }}</div>
          <button @click="toggleReplyForm(comment.id)" class="reply-button">Antworten</button>
          <div v-if="localReplyFormVisible[comment.id]" class="reply-form">
            <textarea v-model="localReplies[comment.id]" placeholder="Antwort schreiben..."></textarea>
            <div class="tooltip">
              <span class="tooltiptext" v-if="showCommentWarning">Um einen Kommentar abzugeben, müssen Sie sich
                registrieren.</span>
              <button @click="addReply(comment.id)" class="submit-reply-button">Antwort senden</button>
            </div>
          </div>
          <button @click="toggleReplies(comment.id)" class="reply-button">
            {{ localRepliesVisible[comment.id] ? 'Antworten verstecken' : 'Antworten anzeigen' }}
          </button>
          <div v-if="localRepliesVisible[comment.id]" class="comment-replies">
            <div v-if="comment.replies.length === 0" class="no-replies-message">
              Keine Antworten vorhanden. Seien Sie der Erste!
            </div>
            <div v-for="reply in comment.replies" :key="reply.id" class="reply">
              <div class="reply-header">
                <div class="user-info">
                  <img :src="reply.profileImageUrl || defaultProfileImage" alt="Profilbild" class="profile-image"
                    @error="handleImageError">
                  <span>{{ reply.username }}</span>
                </div>
                <div class="original-comment-wrapper">
                  <div class="original-comment">
                    <div class="arrow"></div>
                    <div class="comment-text">
                      Antwort auf: <span>{{ comment.username }}</span> |
                      Kommentar: <div class="comment-content"> {{ reply.original_comment_text }}</div>
                    </div>
                  </div>
                </div>
                <div class="reply-date">{{ formatDate(reply.created_at) }}
                  <div class="rating">
                    <div class="tooltip">
                      <button @click="rateReply(reply.id, 1)" :class="{ 'active': userRating(reply.id) === 1 }">
                        <svg v-if="userRating(reply.id, true) === 1" width="24px" height="24px" viewBox="0 0 64 64">
                          <g>
                            <circle fill="#231F20" cx="7" cy="57" r="1" />
                            <g>
                              <path fill="#231F20" d="M14,26c0-2.212-1.789-4-4-4H4c-2.211,0-4,1.788-4,4v34c0,2.21,1.789,4,4,4h6c2.211,0,4-1.79,4-4V26z M7,60
              c-1.657,0-3-1.344-3-3c0-1.658,1.343-3,3-3s3,1.342,3,3C10,58.656,8.657,60,7,60z" />
                              <path fill="#231F20" d="M64,28c0-3.314-2.687-6-6-6H41l0,0h-0.016H41l2-18c0.209-2.188-1.287-4-3.498-4h-4.001
              C33,0,31.959,1.75,31,4l-8,18c-2.155,5.169-5,6-7,6v30.218c1.203,0.285,2.714,0.945,4.21,2.479C23.324,63.894,27.043,64,29,64h23
              c3.313,0,6-2.688,6-6c0-1.731-0.737-3.288-1.91-4.383C58.371,52.769,60,50.577,60,48c0-1.731-0.737-3.288-1.91-4.383
              C60.371,42.769,62,40.577,62,38c0-1.731-0.737-3.288-1.91-4.383C62.371,32.769,64,30.577,64,28z" />
                            </g>
                          </g>
                        </svg>
                        <svg v-else width="24px" height="24px" viewBox="0 0 64 64">
                          <path fill="#231F20" d="M64,28c0-3.314-2.687-6-6-6H41l0,0h-0.016H41l2-18c0.209-2.188-1.287-4-3.498-4h-4.001
          C33,0,31.959,1.75,31,4l-8,18c-2.155,5.169-5,6-7,6c-1,0-2,0-2,0v-2c0-2.212-1.789-4-4-4H4c-2.211,0-4,1.788-4,4v34
          c0,2.21,1.789,4,4,4h6c2.211,0,4-1.79,4-4v-2c1,0,3.632,0.052,6.21,2.697C23.324,63.894,27.043,64,29,64h23c3.313,0,6-2.688,6-6
          c0-1.731-0.737-3.288-1.91-4.383C58.371,52.769,60,50.577,60,48c0-1.731-0.737-3.288-1.91-4.383C60.371,42.769,62,40.577,62,38
          c0-1.731-0.737-3.288-1.91-4.383C62.371,32.769,64,30.577,64,28z M12,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V26
          c0-1.105,0.896-2,2-2h6c1.104,0,2,0.895,2,2V60z M58,32H48c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4
          c0,2.209-1.791,4-4,4H46c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4c0,2.209-1.791,4-4,4H44
          c-0.553,0-1,0.446-1,1c0,0.552,0.447,1,1,1h8c2.209,0,4,1.79,4,4c0,2.209-1.791,4-4,4H29c-1,0-4.695,0.034-7.358-2.699
          C18.532,56.109,16.112,56.003,14,56V30h2c4,0,6.57-1.571,9.25-8L33,4c0.521-1.104,1.146-2,2.251-2H39c1.104,0,2.126,0.834,2,2
          l-1.99,18c-0.132,1.673,0.914,2,1.99,2h17c2.209,0,4,1.79,4,4C62,30.209,60.209,32,58,32z" />
                        </svg>
                        {{ (reply.ratings && reply.ratings.thumbsUp) || 0 }}
                      </button>
                      <span class="tooltiptext" v-if="showRatingWarning">Um eine Bewertung abzugeben, müssen Sie sich
                        registrieren.</span>
                    </div>
                    <div class="tooltip">
                      <button @click="rateReply(reply.id, -1)" :class="{ 'active': userRating(reply.id) === -1 }">
                        <svg v-if="userRating(reply.id, true) === -1" width="24px" height="24px" viewBox="0 0 64 64">
                          <g>
                            <circle fill="#231F20" cx="7" cy="35" r="1" />
                            <g>
                              <path fill="#231F20" d="M0,4c0-2.211,1.789-4,4-4h6c2.211,0,4,1.789,4,4v34c0,2.211-1.789,4-4,4H4c-2.211,0-4-1.789-4-4V4z M7,38
			c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S5.343,38,7,38z" />
                              <path fill="#231F20" d="M64,36c0,3.313-2.687,6-6,6H41l0,0h-0.016H41l2,18c0.209,2.187-1.287,4-3.498,4h-4.001
			C33,64,31.959,62.25,31,60l-8-18c-2.155-5.17-5-6-7-6V5.781c1.203-0.285,2.714-0.945,4.21-2.479C23.324,0.105,27.043,0,29,0h23
			c3.313,0,6,2.687,6,6c0,1.73-0.737,3.287-1.91,4.382C58.371,11.23,60,13.422,60,16c0,1.73-0.737,3.287-1.91,4.382
			C60.371,21.23,62,23.422,62,26c0,1.73-0.737,3.287-1.91,4.382C62.371,31.23,64,33.422,64,36z" />
                            </g>
                          </g>
                        </svg>
                        <svg v-else width="24px" height="24px" viewBox="0 0 64 64">
                          <path fill="#231F20" d="M64,36c0,3.312-2.687,6-6,6H41v-0.002L40.984,42H41l2,18c0.209,2.186-1.287,4-3.498,4h-4.001
		C33,64,31.959,62.248,31,60l-8-18c-2.155-5.171-5-6-7-6c-1,0-2,0-2,0v2c0,2.21-1.789,4-4,4H4c-2.211,0-4-1.79-4-4V4
		c0-2.212,1.789-4,4-4h6c2.211,0,4,1.788,4,4v2c1,0,3.632-0.054,6.21-2.699C23.324,0.104,27.043,0,29,0h23c3.313,0,6,2.686,6,6
		c0,1.729-0.737,3.286-1.91,4.381C58.371,11.229,60,13.421,60,16c0,1.729-0.737,3.286-1.91,4.381C60.371,21.229,62,23.421,62,26
		c0,1.729-0.737,3.286-1.91,4.381C62.371,31.229,64,33.421,64,36z M12,4c0-1.105-0.896-2-2-2H4C2.896,2,2,2.895,2,4v34
		c0,1.104,0.896,2,2,2h6c1.104,0,2-0.896,2-2V4z M58,32H48c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4
		c0-2.21-1.791-4-4-4H46c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4c0-2.21-1.791-4-4-4H44
		c-0.553,0-1-0.448-1-1c0-0.554,0.447-1,1-1h8c2.209,0,4-1.791,4-4c0-2.21-1.791-4-4-4H29c-1,0-4.695-0.036-7.358,2.697
		C18.532,7.889,16.112,7.995,14,8v26h2c4,0,6.57,1.569,9.25,8L33,60c0.521,1.103,1.146,2,2.251,2H39c1.104,0,2.126-0.834,2-2
		l-1.99-18c-0.132-1.675,0.914-2,1.99-2h17c2.209,0,4-1.791,4-4C62,33.79,60.209,32,58,32z" />
                        </svg>
                        {{ (reply.ratings && reply.ratings.thumbsDown) || 0 }}
                      </button>
                      <span class="tooltiptext" v-if="showRatingWarning">Um eine Bewertung abzugeben, müssen Sie sich
                        registrieren.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="reply-text">{{ reply.reply }}</div>
              <button @click="toggleReplyOnReplyForm(reply.id)" class="reply-button">
                {{ localReplyOnReplyFormVisible[reply.id] ? 'Antworten verstecken' : 'Antwort auf Antwort schreiben' }}
              </button>
              <div v-if="localReplyOnReplyFormVisible[reply.id]" class="reply-form">
                <textarea v-model="localReplyOnReplies[reply.id]"
                  placeholder="Antwort auf Antwort schreiben..."></textarea>
                <div class="tooltip">
                  <span class="tooltiptext" v-if="showCommentWarning">Um einen Kommentar abzugeben, müssen Sie sich
                    registrieren.</span>
                  <button @click="addReplyOnReply(reply.id)" class="submit-reply-button">Antwort senden</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import { replyMixin } from '../mixins/replyMixin'; 
import defaultProfileImage from '@/assets/default-profile.png';


export default {
  mixins: [replyMixin], 
  props: {
    comments: Array,
    username: String,
    role: String,
    displayedComments: Array,
    repliesVisible: Object,
    replyFormVisible: Object,
    replies: Object,
    replyReplies: Object,
    replyOnReplies: Object,
    replyOnReplyFormVisible: Object,
    repliesOnReplies: Object,
    kirche: Object
  },
  data() {
    return {
      localComment: '',
      localComments: [...this.comments],
      localDisplayedComments: [...this.displayedComments],
      localRepliesVisible: { ...this.repliesVisible },
      localReplyFormVisible: { ...this.replyFormVisible },
      localReplies: { ...this.replies },
      localReplyReplies: { ...this.replyReplies },
      localReplyOnReplies: { ...this.replyOnReplies },
      localReplyOnReplyFormVisible: { ...this.replyOnReplyFormVisible },
      localRepliesOnReplies: { ...this.repliesOnReplies },
      repliesCache: {},
      showRatingWarning: false,
      showCommentWarning: false,
      ratings: {},
      userRatings: {},
      newReply: {},
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      defaultProfileImage,

    };
  },
  watch: {
    comments(newVal) {
      this.localComments = [...newVal];
    },
    displayedComments(newVal) {
      this.localDisplayedComments = [...newVal];
    },
    repliesVisible(newVal) {
      this.localRepliesVisible = { ...newVal };
    },
    replyFormVisible(newVal) {
      this.localReplyFormVisible = { ...newVal };
    },
    replies(newVal) {
      this.localReplies = { ...newVal };
    },
    replyReplies(newVal) {
      this.localReplyReplies = { ...newVal };
    },
    replyOnReplies(newVal) {
      this.localReplyOnReplies = { ...newVal };
    },
    replyOnReplyFormVisible(newVal) {
      this.localReplyOnReplyFormVisible = { ...newVal };
    },
    repliesOnReplies(newVal) {
      this.localRepliesOnReplies = { ...newVal };
    },
  },
  methods: {
    closePopup() {
      this.$emit('close'); 
    }
  }
}
</script>



<style scoped> 
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
   /* Über dem Overlay */
   border-radius: 8px;
 }

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

 .close-button:hover {
   background-color: #9B3C66;
 }

 .comments {
   margin-top: 20px;
   flex: 1;
   overflow-y: auto;
   width: 100%;
   display: flex;
   flex-direction: column;
 }

 .rating {
   margin: 10px 0;
 }

 .rating button {
   background-color: transparent;
   border: none;
   cursor: pointer;
 }

 .rating-counts {
   margin-top: 5px;
 }

 .reply-button {
   background-color: #007bff;
   color: white;
   border: none;
   padding: 5px 10px;
   cursor: pointer;
   margin-top: 5px;
 }

 .comment {
   border-bottom: 1px solid #ddd;
   padding: 10px 0;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   width: 100%;
   box-sizing: border-box;
   margin-bottom: 20px;
   padding: 10px;
   border: 2px solid #d7e0ea;
   border-radius: 8px;
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
   font-weight: bold;
   color: #333;
   margin-right: 10px;
 }

 .profile-image {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   margin-right: 10px;
   border: 2px solid #ddd;
 }

 .comment-date {
   font-size: 0.9em;
   color: #999;
   margin-left: auto;
 }

 .comment-text {
   font-size: 1.0em;
   color: #333;
   overflow-wrap: break-word;
   margin-top: 5px;
   margin: 10px 0;
 }

 .submit-comment-button {
   align-self: center;
   padding: 10px 20px;
   border: none;
   border-radius: 5px;
   background-color: #B8869B;
   color: #fff;
   cursor: pointer;
   transition: background-color 0.3s;
   margin-top: 10px;
 }

 .submit-comment-button:hover {
   background-color: #9B3C66;
 }

 .comment-form textarea {
   width: 100%;
   height: 100px;
   box-sizing: border-box;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   resize: none;
   overflow-y: auto;
 }

 .close-button {
   position: absolute;
   top: 10px;
   right: 10px;
   border: none;
   padding: 10px;
   border-radius: 4px;
   cursor: pointer;
 }

 .comment-reply {
   border: 1px solid #ddd;
   padding: 10px;
   margin-top: 10px;
   margin-bottom: 10px;
   border-radius: 8px;
   background-color: #f1f8f9;
   border-left: 4px solid #b0bec5;
   box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
   padding-left: 10px;
 }

 .reply-header {
   display: flex;
   align-items: center;
   margin-left: auto;
   font-size: 0.9em;
   color: #888;
   margin-bottom: 5px;
 }

 .reply-text {
   margin-top: 5px;
 }

 .comment-replies {
   padding: 15px;
   margin-top: 15px;
   background-color: #f9f9f9;
   border-radius: 8px;
 }

 .reply-button,
 .submit-comment-button,
 .submit-reply-button {
   color: #fff;
   border: none;
   padding: 10px 20px;
   border-radius: 4px;
   cursor: pointer;
   margin-right: 10px;
   margin-bottom: 10px;
   background-color: #B8869B;
   transition: background-color 0.3s;
   margin-top: 10px;
 }

 .reply-button:hover,
 .submit-comment-button:hover,
 .submit-reply-button:hover {
   background-color: #9B3C66;
 }

 .reply-form {
   margin-top: 10px;
 }

 .reply {
   padding: 10px;
   border: 2px solid #28a745;
   border-radius: 4px;
   background-color: #e8f5e9;
   margin-bottom: 15px;
 }

 .sub-replies {
   margin-left: 20px;
 }

 .sub-reply {
   padding: 10px;
   border: 2px solid #ffc107;
   border-radius: 4px;
   background-color: #fff9e8;
   margin-bottom: 15px;
 }

 .comment-replies .reply .original-comment-text {
   font-size: 0.9em;
   color: #444;
   background-color: #e8f0fe;
   border: 1px solid #d0e3fc;
   padding: 10px;
   border-radius: 6px;
   margin-top: 10px;
   position: relative;
 }

 .comment-replies .reply .original-comment-text::before {
   content: '';
   position: absolute;
   left: -25px;
   top: 50%;
   width: 0;
   height: 0;
   border: 10px solid transparent;
   border-right: 10px solid #007bff;
   transform: translateY(-50%);
 }

 .comment-replies .reply .original-comment-text::after {
   content: '';
   position: absolute;
   left: -25px;
   top: 0;
   width: 20px;
   height: 100%;
   background-color: #007bff;
   z-index: -1;
 }

 .reply-form textarea {
   width: 100%;
   height: 100px;
   box-sizing: border-box;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 6px;
   resize: none;
   overflow-y: auto;
   font-size: 1em;
   color: #333;
   background-color: #f9f9f9;
 }

 .original-comment-wrapper {
   position: relative;
   margin-top: 10px;
   padding-left: 30px;
 }

 .line {
   border-left: 2px solid #007bff;
   height: 20px;
   position: absolute;
   left: 10px;
   top: 0;
 }

 .original-comment {
   display: flex;
   align-items: center;
 }

 .arrow {
   width: 0;
   height: 0;
   border-top: 10px solid transparent;
   border-bottom: 10px solid transparent;
   border-right: 10px solid #007bff;
   margin-right: 10px;
 }

 .comment-text {
   background-color: #f1f8ff;
   border: 1px solid #d0e3fc;
   border-radius: 6px;
   padding: 10px;
   font-size: 0.9em;
   color: #333;
 }

 .comment-replies .reply {
   padding: 15px;
   margin-bottom: 12px;
   border-radius: 8px;
   background-color: #ffffff;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 }

 .comment-replies .reply-header {
   display: flex;
   align-items: center;
   margin-bottom: 10px;
 }

 .comment-replies .reply-date {
   font-size: 0.8em;
   color: #888;
   margin-left: auto;
 }

 .comment-replies .reply-text {
   font-size: 1em;
   color: #444;
   background-color: #fefefe;
   border: 1px solid #ddd;
   padding: 10px;
   border-radius: 6px;
   word-wrap: break-word;
 }

 .reply-button:hover {
   background-color: #ccc;
 }

 .reply-form {
   display: flex;
   flex-direction: column;
   margin-top: 15px;
   border-top: 1px solid #ddd;
   padding-top: 10px;
 }

 h2 {
   margin-top: 0;
   margin-bottom: 38px;
 }

 .no-replies-message {
   padding: 5px 20px;
   text-align: center;
   color: #666;
   font-style: italic;
   display: none;
 }

 .comment-replies .no-replies-message {
   display: block;
 }

 body {
   text-align: center;
 }



 .original-comment .comment-content {
   font-weight: bold;
   color: #333;
 }

 button {
   background: none;
   border: none;
   cursor: pointer;
 }

 .rating-counts {
   margin-top: 10px;
 }

 .rating svg {
   width: 24px;
   height: 24px;
   vertical-align: middle;
   fill: #231F20;
 }

 .tooltip {
   position: relative;
   display: inline-block;
 }

 .tooltip .tooltiptext {
   visibility: hidden;
   width: 200px;
   background-color: #333;
   color: #fff;
   text-align: center;
   border-radius: 5px;
   padding: 5px 0;
   position: absolute;
   z-index: 1;
   bottom: 125%;
   left: 50%;
   margin-left: -100px;
   opacity: 0;
   transition: opacity 0.3s;
 }

 .tooltip:hover .tooltiptext {
   visibility: visible;
   opacity: 1;
 }
 </style>
  
