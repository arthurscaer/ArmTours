<template>
  <div class="province-info">
    <div v-if="province === 'Tavush'">
      <h2>Informationen zu Tavush</h2>
      <p>Tavush ist ein idealer Ort für Natur- und Kulturinteressierte und bietet eine Fülle von Aktivitäten, von Wandern in den Bergen bis hin zum Erkunden historischer Stätten.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Haghartsin</p>
          <img src="@/assets/haghartsin.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Parz-See</p>
          <img src="@/assets/parz.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Lori'">
      <h2>Informationen zu Lori</h2>
      <p>Die Provinz Lori in Armenien ist bekannt für ihre grünen Landschaften, historischen Klöster und traditionellen
        Handwerkskünste ist bekannt für ihre grünen Landschaften.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Akhtala</p>
          <img src="@/assets/akhtala2.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Stepanavan Arboretum</p>
          <img src="@/assets/stepanavan.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Shirak'">
      <h2>Informationen zu Shirak</h2>
      <p>Shirak bietet Besuchern eine einzigartige Mischung aus Natur, Geschichte und Kultur, die es zu einem faszinierenden Ziel in Armenien macht.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Marmashen</p>
          <img src="@/assets/marmashen.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Stadt Gyumri</p>
          <img src="@/assets/gyumri.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Gegharkunik'">
      <h2>Informationen zu Gegharkunik</h2>
      <p>Gegharkunik ist eine malerische Provinz in Armenien, bekannt für den Sevansee und ihre atemberaubende Natur. Sie bietet zahlreiche Möglichkeiten für Outdoor-Aktivitäten und hat eine reiche Geschichte.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Sevanavank</p>
          <img src="@/assets/sevanavank.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Sevansee</p>
          <img src="@/assets/sevansee.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Aragatsotn'">
      <h2>Informationen zu Aragatsotn</h2>
      <p>Aragatsotn ist bekannt für den höchsten Gipfel des Landes, den Aragats. Sie bietet atemberaubende Landschaften, historische Stätten wie die Kirche von Amberd und eine reiche Flora und Fauna.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Hovhanavank</p>
          <img src="@/assets/aragatsotn.jpg" alt="Aragatsotn" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Observatorium Byurakan</p>
          <img src="@/assets/byurakan.jpg" alt="Aragatsotn" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Kotayk'">
      <h2>Informationen zu Kotayk</h2>
      <p>Die Kombination aus Geschichte, Landschaft und Gastfreundschaft macht Kotayk zu einem faszinierenden Ziel in Armenien.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Kecharis</p>
          <img src="@/assets/kecharis.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Tsaghkadzor Ski-resort</p>
          <img src="@/assets/ski.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Armavir'">
      <h2>Informationen zu Armavir</h2>
      <p>Die Provinz Armavir in Armenien ist berühmt für ihre Weinbaugebiete und antiken Kirchen. Sie hat eine bedeutende kulturelle und historische Vergangenheit.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Kathedrale von Etschmiadsin</p>
          <img src="@/assets/ejmiacin.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Die Ruinen der antiken Hauptstadt Yervandashat</p>
          <img src="@/assets/yervandashat.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Yerevan'">
      <h2>Informationen zu Yerevan</h2>
      <p>Yerevan, die Hauptstadt Armeniens, ist eine der ältesten Städte der Welt und bekannt für ihre reiche Geschichte, Kultur und beeindruckende Architektur.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Kathedrale des Heiligen Gregor des Erleuchters</p>
          <img src="@/assets/gregorychurch.jpeg" alt="GregoryChurch" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Cascade-Komplex in Yerevan</p>
          <img src="@/assets/cascade.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Ararat'">
      <h2>Informationen zu Ararat</h2>
      <p>Die Provinz Ararat in Armenien ist bekannt für ihre fruchtbaren Täler und historische Stätten. Sie spielt eine wichtige Rolle in der armenischen Landwirtschaft.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Khor Virap</p>
          <img src="@/assets/khorvirape.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Kaqavaberd</p>
          <img src="@/assets/kaqavaberd.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'VayotsDzor'">
      <h2>Informationen zu Vayots Dzor</h2>
      <p>Vayots Dzor ist eine malerische Provinz Armeniens, berühmt für ihre Weinproduktion, antiken Klöster wie Noravank und atemberaubende Naturlandschaften.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Noravank</p>
          <img src="@/assets/noravank.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">Festung Smbataberd</p>
          <img src="@/assets/fort.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div v-else-if="province === 'Syunik'">
      <h2>Informationen zu Syunik</h2>
      <p>Syunik ist die südlichste Provinz Armeniens, bekannt für ihre atemberaubenden Berglandschaften, historischen Klöster wie Tatev und eine reiche Geschichte, die stark mit der armenischen Identität verbunden ist.</p>
      <div class="content">
        <div class="church-section" v-if="provinceData">
          <h3>Unsere empfohlene Kirche</h3>
          <p class="church-namee">Tatev</p>
          <img src="@/assets/tatev.jpg" alt="Akhtala" class="church-image" />
          <button @click="visitChurch" class="visit-button">Kirche besuchen</button>
        </div>
        <div class="landmark-section">
          <h3>Unsere empfohlene Sehenswürdigkeit</h3>
          <p class="church-namee">TaTever - wings of Tatev</p>
          <img src="@/assets/tatwing.jpg" alt="TavushPlace" class="church-image" />
          <button @click="visitLandmark" class="visit-button">Sehenswürdigkeit besuchen</button>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="close-button" @click="close">Schließen</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProvinceInfo',
  props: ['province'],
  data() {
    return {
      provinceData: {
        Tavush: {
          church: {
            name: 'Kirche in Tavush',
          },
          landmark: {
            name: 'Kirche in Tavush',
          },
        },
        Lori: {
          church: {
            name: 'Kirche in Lori',
            image_data: 'path/to/lori-church-image.jpg',
          },
          landmark: 'Sehenswürdigkeit in Lori'
        },
      },
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    visitChurch() {
      this.$router.push(`/province-info/${this.province}`);
    },
    visitLandmark() {
      this.$router.push(`/province-info/${this.province}Place`);
    }
  },
}
</script>

<style scoped>
.province-info {
  position: absolute;
  top: 64%;
  left: 73%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 450px;
  animation: fadeIn 0.5s ease-out;
}

h2,
h3 {
  color: #333;
  font-family: 'Arial', sans-serif;
  font-size: 1.3em;
  margin-bottom: 15px;
  margin-top: 5px;
  text-align: center;
}

p {
  color: #666;
  font-family: 'Arial', sans-serif;
  font-size: 1.0em;
  line-height: 1.6em;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.visit-button {
  width: 100%;
  padding: 10px;
  background-color: #89bcc4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.visit-button:hover {
  background-color: #50737b;
}

.close-button {
  width: 96%;
  padding: 10px;
  background-color: #50737b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: -3px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.close-button:hover {
  background-color: #89bcc4;
}

.content {
  display: flex;
  justify-content: space-between;
}

.church-section, .landmark-section {
  flex: 1; /* Erlaubt, dass beide Abschnitte gleich viel Platz einnehmen */
  text-align: center; /* Zentriert den Text innerhalb der Abschnitte */

  margin: 0 10px;
}

.church-namee {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.landmark-namee {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.church-image,
.landmark-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.landmark-placeholder {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  max-height: 1.2em;
}

@keyframes fadeIn {
  from {
    opacity: 0;

  }

  to {
    opacity: 1;

  }
}

@media (min-width: 1600px) {
	.province-info {
		top: 57%; /* Position für Bildschirme größer als 2560px */
		left: 53%;
	}
}

@media (max-width: 768px) {
  .province-info {
    position: static;
    transform: none;
    margin-top: 20px;
    width: 100%;

  }

  .content {
    flex-direction: column;
    align-items: center;
  }

  .church-section,
  .landmark-section {
    margin-bottom: 20px;
  }

}
</style>
