<template>
  <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl" @logout="logout" />
  <div id="whole-page">
      <h1>Die Vision hinter diesem Dashboard</h1>
      <p>
        Armenien ist ein Land voller Geschichte, Kultur und beeindruckender Architektur, die bis in die Antike zurückreicht. 
        Besonders stolz sind die Armenier darauf, die erste Nation zu sein, die das Christentum als Staatsreligion im Jahr 301 annahm. 
        Dies führte zum Bau zahlreicher Kirchen, die heute zu den bedeutendsten kulturellen und historischen Sehenswürdigkeiten gehören.
      </p>
      <p>
        Trotz seines reichen kulturellen Erbes ist Armenien für viele Menschen noch ein unentdecktes Reiseziel. 
        Mein Dashboard wurde geschaffen, um dieses Problem zu lösen und sowohl Touristen als auch Einheimischen 
        eine Plattform zu bieten, um Armeniens weniger bekannte, aber ebenso faszinierende Kirchen und Sehenswürdigkeiten zu entdecken.
      </p>
      <p>
        Das Ziel dieser Seite ist es, umfassende Informationen über jede der 11 Provinzen Armeniens bereitzustellen. 
        Jede Provinz wird durch eine ihrer ältesten Kirchen und eine besondere Sehenswürdigkeit repräsentiert, die oft auf üblichen 
        Reisewebsites nicht zu finden sind. Dadurch wird diese Plattform zu einer wertvollen Quelle für kulturorientierte Reisende und alle, 
        die Armeniens reiche Geschichte und beeindruckende Architektur erkunden möchten.
      </p>
      <p>
        Zusätzlich zu den bereitgestellten Informationen ermöglicht die Plattform den Nutzern, Erfahrungen auszutauschen, 
        Orte zu bewerten und Kommentare zu hinterlassen. Dies schafft eine Gemeinschaft, die nicht nur Informationen teilt, 
        sondern auch Inspiration für zukünftige Reisen bietet.
      </p>
      <p>
        Dieses Dashboard wurde von mir, Artur Barseghyan, im Rahmen meiner Bachelorarbeit im Fach Informatik an der Universität Bremen entwickelt.
        Ziel war es, sowohl technische Fähigkeiten zu demonstrieren als auch eine nützliche und interaktive Plattform zu schaffen, die Tourismus und
        kulturelles Bewusstsein fördert.
      </p>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar';

export default {
  name: 'AboutPage',
  components: {
    MenuBar
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
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
      this.$router.push('/');
    },
  }
};
</script>

<style scoped>
#whole-page {
  display: flex;
  flex-direction: column;
  background-color: #EEF7FF;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.about-section {
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: inline-block; /* Neu hinzugefügt */
}


h1 {
  text-align: center;
  color: #333;
}

p {
  font-size: 1rem;
  line-height: 1.5;
  color: #555;
}

@media (max-width: 800px) {
  h1 {
    font-size: 1.4rem;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>